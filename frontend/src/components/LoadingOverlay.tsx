import { useEffect, useRef, useState } from "react";
import { getLoadingCount, onLoadingChange } from "@/lib/loader";

export default function LoadingOverlay() {
  const [count, setCount] = useState<number>(getLoadingCount());
  const [visible, setVisible] = useState<boolean>(false);
  const delayRef = useRef<any>(null);

  useEffect(() => {
    return onLoadingChange(setCount);
  }, []);

  useEffect(() => {
    if (count > 0) {
      // Show after small delay to avoid flicker for quick calls
      if (!delayRef.current) {
        delayRef.current = setTimeout(() => setVisible(true), 250);
      }
    } else {
      setVisible(false);
      if (delayRef.current) {
        clearTimeout(delayRef.current);
        delayRef.current = null;
      }
    }
  }, [count]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-background/40 backdrop-blur-sm">
      <div className="glass rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg">
        <span className="inline-block h-3 w-3 bg-foreground rounded-full animate-ping" />
        <span className="text-sm">Loading…</span>
      </div>
    </div>
  );
}
