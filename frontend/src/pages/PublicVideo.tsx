import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VideoPlayer from "@/components/ui/video-player";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api from "@/lib/api";
import type { Video } from "@/types";

export default function PublicVideo() {
  const { token } = useParams<{ token: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchVideo();
    }
  }, [token]);

  const fetchVideo = async () => {
    try {
      const { data } = await api.get(`/videos/share/${token}`);
      setVideo(data);
    } catch (error: any) {
      setError(
        error.response?.data?.error || "Video not found or access denied"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-10">
        <p className="text-center">Loading video...</p>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="py-10">
        <Alert variant="destructive">
          <AlertDescription>{error || "Video not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!video.is_public) {
    return (
      <div className="py-10">
        <Alert>
          <AlertDescription>This video is private.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="py-2 sm:py-4">
      <Card className="glass glass-edge backdrop-noise rounded-2xl">
        <CardHeader>
          <CardTitle>Video Explanation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {video.prompt && (
              <div>
                <p className="text-sm font-semibold mb-1">Prompt:</p>
                <p className="text-sm text-muted-foreground">{video.prompt}</p>
              </div>
            )}
            <VideoPlayer src={video.video_url} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
