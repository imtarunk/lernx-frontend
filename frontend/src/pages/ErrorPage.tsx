import { Link, useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  const error: any = useRouteError?.() as any;
  const message = error?.statusText || error?.message || "Something went wrong";
  return (
    <div className="py-10 flex items-center justify-center min-h-[60vh]">
      <div className="glass glass-edge backdrop-noise rounded-2xl p-8 text-center max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-2">Error</h1>
        <p className="text-muted-foreground mb-4">{message}</p>
        <Link to="/">
          <Button variant="default" className="rounded-lg">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
