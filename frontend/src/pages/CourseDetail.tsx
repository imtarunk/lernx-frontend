import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import VideoPlayer from "@/components/ui/video-player";
import { useQuestionsStore } from "@/store/useQuestions";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, XCircle, Loader2, Video, ArrowLeft } from "lucide-react";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    byCourseId,
    loading,
    error: qError,
    fetchQuestions,
    currentIndexByCourse,
    setCurrentIndex,
  } = useQuestionsStore();
  const questions = byCourseId[id || ""] || [];
  const currentIndex = currentIndexByCourse[id || ""] || 0;
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [videoPrompt, setVideoPrompt] = useState("");
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(
    null
  );
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (id) fetchQuestions(id);
  }, [id, user, navigate, fetchQuestions]);

  useEffect(() => {
    if (qError) setError(qError);
  }, [qError]);

  const handleAnswer = async (answer: string) => {
    if (selectedAnswer) return; // Already answered

    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return;

    setSelectedAnswer(answer);

    // Normalize answers for comparison
    const normalizedAnswer = answer.trim();
    const normalizedCorrectAnswer = currentQuestion.correct_answer.trim();

    // Check if correct_answer is the full text match
    let correct = normalizedAnswer === normalizedCorrectAnswer;

    // If not a direct match, check if correct_answer is a letter (A, B, C, D)
    // and match it to the option index
    if (!correct && /^[A-D]$/i.test(normalizedCorrectAnswer)) {
      const letterIndex =
        normalizedCorrectAnswer.toUpperCase().charCodeAt(0) - 65;
      if (letterIndex >= 0 && letterIndex < currentQuestion.options.length) {
        correct =
          normalizedAnswer === currentQuestion.options[letterIndex].trim();
      }
    }

    setIsCorrect(correct);
    setShowFeedback(true);

    // Save answer to backend
    try {
      await api.post("/answers", {
        question_id: currentQuestion.id,
        selected_answer: answer,
        is_correct: correct,
      });
    } catch (error) {
      console.error("Error saving answer:", error);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(id || "", currentIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsCorrect(false);
      setError(null);
    }
  };

  const previousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(id || "", currentIndex - 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsCorrect(false);
      setError(null);
    }
  };

  const handleGenerateVideo = async () => {
    if (!questions[currentIndex]) return;

    setGeneratingVideo(true);
    setError(null);
    setVideoProgress(0);
    setShowVideoDialog(false);

    // Simulate progress while waiting for API response
    const progressInterval = setInterval(() => {
      setVideoProgress((prev) => Math.min(prev + 10, 90));
    }, 3000);

    try {
      const { data } = await api.post("/videos", {
        question_id: questions[currentIndex].id,
        prompt: videoPrompt || undefined,
      });
      clearInterval(progressInterval);
      setVideoProgress(100);
      setVideoPrompt("");
      setGeneratedVideoUrl(data.video_url);
      setShowVideoModal(true);
    } catch (error: any) {
      clearInterval(progressInterval);
      setError(error.response?.data?.error || "Failed to generate video");
      setShowVideoDialog(true);
    } finally {
      setTimeout(() => {
        setGeneratingVideo(false);
        setVideoProgress(0);
      }, 500);
    }
  };

  if (loading) {
    return (
      <div className="py-10">
        <p className="text-center">Loading questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="py-10">
        <Alert>
          <AlertDescription>
            No questions found for this course.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  // Helper function to get the display text for correct answer
  const getCorrectAnswerDisplay = () => {
    const normalizedCorrect = currentQuestion.correct_answer.trim();
    // Check if correct_answer is a letter (A, B, C, D)
    if (/^[A-D]$/i.test(normalizedCorrect)) {
      const letterIndex = normalizedCorrect.toUpperCase().charCodeAt(0) - 65;
      if (letterIndex >= 0 && letterIndex < currentQuestion.options.length) {
        return currentQuestion.options[letterIndex];
      }
    }
    return currentQuestion.correct_answer;
  };

  return (
    <div className="py-2 sm:py-4">
      <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Courses
      </Button>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Question {currentIndex + 1} of {questions.length}
        </p>
      </div>

      <Card className="mb-6 glass glass-edge backdrop-noise rounded-2xl overflow-hidden">
        <div className="aspect-video relative">
          <img
            src="/thumn.png"
            alt="Course"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="font-normal text-lg sm:text-xl md:text-2xl leading-relaxed">
              {currentQuestion.question_text}
            </CardTitle>

            <Button
              variant="outline"
              onClick={() => setShowVideoDialog(true)}
              className="hover:bg-white hover:text-black"
            >
              <Video className="mr-2 h-4 w-4" />
              Generate Video
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              // Check if this option is the correct answer
              // Handle both full text match and letter match (A, B, C, D)
              const normalizedOption = option.trim();
              const normalizedCorrect = currentQuestion.correct_answer.trim();
              let isCorrectAnswer = normalizedOption === normalizedCorrect;

              // If not a direct match, check if correct_answer is a letter
              if (!isCorrectAnswer && /^[A-D]$/i.test(normalizedCorrect)) {
                const letterIndex =
                  normalizedCorrect.toUpperCase().charCodeAt(0) - 65;
                isCorrectAnswer = idx === letterIndex;
              }

              let buttonVariant:
                | "default"
                | "outline"
                | "secondary"
                | "destructive" = "outline";
              if (showFeedback) {
                if (isCorrectAnswer) {
                  buttonVariant = "default";
                } else if (isSelected && !isCorrect) {
                  buttonVariant = "destructive";
                }
              } else if (isSelected) {
                buttonVariant = "secondary";
              }

              return (
                <Button
                  key={idx}
                  variant={buttonVariant}
                  className="w-full justify-start h-auto py-3 text-left rounded-xl text-base sm:text-[1rem] md:text-lg"
                  onClick={() => handleAnswer(option)}
                  disabled={showFeedback}
                >
                  <span className="font-semibold mr-2">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {option}
                  {showFeedback && isCorrectAnswer && (
                    <CheckCircle2 className="ml-auto h-5 w-5" />
                  )}
                  {showFeedback && isSelected && !isCorrect && (
                    <XCircle className="ml-auto h-5 w-5" />
                  )}
                </Button>
              );
            })}
          </div>

          {showFeedback && (
            <div className="mt-6">
              <Alert variant={isCorrect ? "default" : "destructive"}>
                <AlertDescription>
                  {isCorrect ? (
                    <span className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Correct!
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <XCircle className="mr-2 h-4 w-4" />
                      Incorrect. The correct answer is:{" "}
                      {getCorrectAnswerDisplay()}
                    </span>
                  )}
                </AlertDescription>
              </Alert>
              {currentQuestion.explanation && (
                <div className="mt-4 p-4 glass rounded-xl">
                  <p className="text-sm font-semibold mb-2">Explanation:</p>
                  <p className="text-sm">{currentQuestion.explanation}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentIndex === 0}
            >
              Previous
            </Button>
            <Button
              onClick={nextQuestion}
              disabled={currentIndex === questions.length - 1}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Video Explanation</DialogTitle>
            <DialogDescription>
              Add an optional prompt to customize the video explanation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt">Optional Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="e.g., Explain step by step with visual examples..."
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                className="mt-2"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowVideoDialog(false);
                  setVideoPrompt("");
                  setError(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleGenerateVideo} disabled={generatingVideo}>
                {generatingVideo ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Video"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Progress Dialog */}
      <Dialog open={generatingVideo} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generating Video</DialogTitle>
            <DialogDescription>
              Please wait while we create your video explanation...
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Progress value={videoProgress} />
            <p className="text-sm text-center text-muted-foreground">
              {videoProgress}% complete
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Player Modal */}
      <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Video Explanation</DialogTitle>
            <DialogDescription>
              Your video explanation is ready!
            </DialogDescription>
          </DialogHeader>
          {generatedVideoUrl && (
            <div className="space-y-4">
              <VideoPlayer src={generatedVideoUrl} />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowVideoModal(false);
                    setGeneratedVideoUrl(null);
                  }}
                >
                  Close
                </Button>
                <Button
                  onClick={() => window.open(generatedVideoUrl, "_blank")}
                >
                  Open in New Tab
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
