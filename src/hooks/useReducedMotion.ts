import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export function useReducedMotion() {
  const [reduce, setReduce] = useState(() => matchMedia(QUERY).matches);
  useEffect(() => {
    const mq = matchMedia(QUERY);
    const on = () => setReduce(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduce;
}
