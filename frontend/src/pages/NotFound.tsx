import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="py-10 flex items-center justify-center min-h-[60vh]">
      <div className="glass glass-edge backdrop-noise rounded-2xl p-8 text-center max-w-md w-full">
        <h1 className="text-4xl font-semibold mb-2">404</h1>
        <p className="text-muted-foreground mb-6">
          The page you are looking for was not found.
        </p>
        <Link to="/">
          <Button variant="default" className="rounded-lg">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
