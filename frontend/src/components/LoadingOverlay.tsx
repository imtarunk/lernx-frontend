import { useEffect, useState } from "react";
import { getLoadingCount, onLoadingChange } from "@/lib/loader";

export default function LoadingOverlay() {
  const [count, setCount] = useState<number>(getLoadingCount());

  useEffect(() => {
    return onLoadingChange(setCount);
  }, []);

  if (count <= 0) return null;

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-background/40 backdrop-blur-sm">
      <div className="glass rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg">
        <span className="inline-block h-3 w-3 bg-foreground rounded-full animate-ping" />
        <span className="text-sm">Loading…</span>
      </div>
    </div>
  );
}
