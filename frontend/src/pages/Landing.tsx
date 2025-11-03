import { Link } from "react-router-dom";
import { InteractiveRobotSpline } from "@/components/ui/interactive-3d-robot";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const ROBOT_SCENE_URL =
    "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

  return (
    <div className="relative w-screen h-[calc(100vh-72px)] overflow-hidden rounded-2xl">
      <InteractiveRobotSpline
        scene={ROBOT_SCENE_URL}
        className="absolute inset-0 z-0"
      />

      <div className="absolute inset-0 z-10 pt-24 md:pt-36 lg:pt-44 px-4 md:px-8 pointer-events-none">
        <div className="text-center text-white drop-shadow-lg w-full max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Learn faster with Lernx
          </h1>
          <p className="mt-3 text-sm md:text-base text-white/80">
            Personalized practice, instant explanations, and shareable video
            answers.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 pointer-events-auto">
            <Link to="/auth">
              <Button variant="default" className="rounded-full">
                Join now
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" className="rounded-full">
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
