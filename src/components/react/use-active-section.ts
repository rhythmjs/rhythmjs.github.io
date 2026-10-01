import { useEffect, useState } from "react";

const LINE = 120;

export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | undefined>(ids[0]);

  useEffect(() => {
    const targets = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const current = atBottom ? targets.at(-1) : targets.filter((el) => el.getBoundingClientRect().top <= LINE).at(-1);
      setActive((current ?? targets[0])!.id);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [ids.join("|")]);

  return [active, setActive] as const;
}
