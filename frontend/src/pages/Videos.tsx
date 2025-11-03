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
import { Copy, ExternalLink, Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function Videos() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

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
      <div className="py-10">
        <p className="text-center">Loading videos...</p>
      </div>
    );
  }

  return (
    <div className="py-2 sm:py-4">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-2 tracking-tight">
          My Videos
        </h1>
        <p className="text-muted-foreground">
          View and manage your generated video explanations
        </p>
      </div>

      {videos.length === 0 ? (
        <Card className="glass glass-edge backdrop-noise rounded-2xl">
          <CardContent className="py-10">
            <p className="text-center text-muted-foreground">
              No videos generated yet. Generate a video from any quiz question!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {videos.map((video) => {
            const title = video.prompt?.trim() || "Video Explanation";
            return (
              <Card
                key={video.id}
                className="glass glass-edge backdrop-noise rounded-2xl overflow-hidden"
              >
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-1" title={title}>
                    {title}
                  </CardTitle>
                  <CardDescription>
                    Created {new Date(video.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Thumbnail */}
                    <button
                      type="button"
                      onClick={() => setActiveVideo(video)}
                      className="group w-full"
                    >
                      <div className="aspect-video rounded-xl overflow-hidden relative bg-gradient-to-br from-muted to-muted/60">
                        {/* Default thumbnail placeholder */}
                        <div className="absolute inset-0 grid place-items-center">
                          <svg
                            width="72"
                            height="72"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="opacity-80"
                          >
                            <path
                              d="M8 5h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                            <path
                              d="M10 9.5v5l4.5-2.5L10 9.5z"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-black shadow-sm group-hover:scale-105 transition-transform">
                            <Play className="h-5 w-5" />
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* Prompt preview */}
                    {video.prompt && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {video.prompt}
                      </p>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        variant="default"
                        className="flex-1 rounded-lg"
                        onClick={() => setActiveVideo(video)}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Watch
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-lg"
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
            );
          })}
        </div>
      )}

      {/* Player Modal */}
      <Dialog open={!!activeVideo} onOpenChange={() => setActiveVideo(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {activeVideo?.prompt || "Video Explanation"}
            </DialogTitle>
            <DialogDescription>
              {activeVideo
                ? `Created ${new Date(activeVideo.created_at).toLocaleString()}`
                : ""}
            </DialogDescription>
          </DialogHeader>
          {activeVideo && (
            <div className="space-y-4">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  src={activeVideo.video_url}
                  className="w-full h-full"
                  controls
                  playsInline
                  controlsList="nodownload"
                  preload="metadata"
                  autoPlay
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
