import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Video } from "@/types";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Copy, ExternalLink } from "lucide-react";

export default function Videos() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchVideos();
    }
  }, [user]);

  const fetchVideos = async () => {
    try {
      // We'll need to implement a user-specific endpoint
      // For now, we'll use a generic endpoint
      const { data } = await api.get("/videos");
      setVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyShareLink = (token: string) => {
    const shareUrl = `${window.location.origin}/s/${token}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Share link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <p className="text-center">Loading videos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Videos</h1>
        <p className="text-muted-foreground">
          View and manage your generated video explanations
        </p>
      </div>

      {videos.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <p className="text-center text-muted-foreground">
              No videos generated yet. Generate a video from any quiz question!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id}>
              <CardHeader>
                <CardTitle className="text-lg">Video Explanation</CardTitle>
                <CardDescription>
                  Created {new Date(video.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {video.prompt && (
                    <div>
                      <p className="text-sm font-semibold mb-1">Prompt:</p>
                      <p className="text-sm text-muted-foreground">
                        {video.prompt}
                      </p>
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={() => window.open(video.video_url, "_blank")}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Watch
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => copyShareLink(video.share_token)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Link
                    to={`/s/${video.share_token}`}
                    className="text-xs text-muted-foreground hover:underline"
                  >
                    View share link
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
