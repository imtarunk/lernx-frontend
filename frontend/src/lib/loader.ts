type Listener = (count: number) => void;

let inflightCount = 0;
const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l(inflightCount);
}

export function onLoadingChange(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function startLoading() {
  inflightCount += 1;
  emit();
}

export function stopLoading() {
  inflightCount = Math.max(0, inflightCount - 1);
  emit();
}

export function getLoadingCount() {
  return inflightCount;
}
