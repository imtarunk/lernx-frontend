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
import { Copy, ExternalLink, Play, Trash2, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import VideoPlayer from "@/components/ui/video-player";
import { toast } from "sonner";

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
      console.debug("[Videos] Fetching videos …", new Date().toISOString());
      const { data } = await api.get("/videos");
      console.debug(
        "[Videos] Fetch success:",
        Array.isArray(data) ? data.length : data
      );
      setVideos(data);
    } catch (error: any) {
      console.error("[Videos] Fetch failed", {
        error,
        status: error?.response?.status,
        payload: error?.response?.data,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyShareLink = (token: string) => {
    const shareUrl = `${window.location.origin}/s/${token}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Share link copied to clipboard!");
  };

  const deleteVideo = async (id: string) => {
    console.group("[Videos] Delete request");
    console.log("videoId:", id);
    const ok = window.confirm(
      "Delete this video? This action cannot be undone."
    );
    if (!ok) return;
    try {
      console.time("delete:/videos/:id");
      await api.delete(`/videos/${id}`);
      console.timeEnd("delete:/videos/:id");
      console.log("Delete success");
      setVideos((prev) => prev.filter((v) => v.id !== id));
      if (activeVideo?.id === id) setActiveVideo(null);
      toast.success("Video deleted");
      console.groupEnd();
    } catch (e: any) {
      console.error("[Videos] Delete failed", {
        error: e,
        status: e?.response?.status,
        payload: e?.response?.data,
        videoId: id,
      });
      toast.error(e?.response?.data?.error || "Failed to delete video");
      console.groupEnd();
    }
  };

  const togglePublic = async (v: Video) => {
    try {
      const next = !Boolean(v.is_public);
      console.debug("[Videos] Toggle visibility", v.id, "->", next);
      const { data } = await api.patch(`/videos/${v.id}/public`, {
        is_public: next,
      });
      setVideos((prev) =>
        prev.map((it) =>
          it.id === v.id ? { ...it, is_public: data?.is_public ?? next } : it
        )
      );
      toast.success(next ? "Video set to public" : "Video set to private");
    } catch (e: any) {
      console.error("[Videos] Toggle failed", e?.response || e);
      toast.error(e?.response?.data?.error || "Failed to toggle visibility");
    }
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
                  <CardDescription className="flex items-center justify-between">
                    <span>
                      Created {new Date(video.created_at).toLocaleDateString()}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border">
                      {video.is_public ? (
                        <>
                          <Eye className="h-3 w-3" /> Public
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" /> Private
                        </>
                      )}
                    </span>
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
                      <Button
                        variant="outline"
                        className="rounded-lg"
                        onClick={() => togglePublic(video)}
                        title="Toggle visibility"
                      >
                        {video.is_public ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        className="rounded-lg"
                        onClick={() => deleteVideo(video.id)}
                        title="Delete video"
                      >
                        <Trash2 className="h-4 w-4" />
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
              <VideoPlayer src={activeVideo.video_url} />
              <div className="flex justify-end gap-2">
                <Button
                  variant="destructive"
                  onClick={() => deleteVideo(activeVideo.id)}
                  className="rounded-lg"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
