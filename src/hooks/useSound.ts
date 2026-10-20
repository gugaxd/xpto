import { useEffect, useState } from "react";
import { sfx } from "@/audio/sfx";

export function useMuted() {
  const [muted, setMuted] = useState(sfx.isMuted());
  useEffect(() => sfx.subscribe(setMuted), []);
  return { muted, toggle: () => sfx.setMuted(!muted) };
}
