import { useEffect, useMemo, useState } from "react";

type Sizes = Record<
  "screen-x-small" | "screen-small" | "screen-medium" | "screen-large",
  boolean
>;

function getSizes(): Sizes {
  const w = window.innerWidth;

  return {
    "screen-x-small": w < 576,
    "screen-small": w >= 576 && w < 768,
    "screen-medium": w >= 768 && w < 992,
    "screen-large": w >= 992,
  };
}

export function useScreenService() {
  const [sizes, setSizes] = useState<Sizes>(() =>
    typeof window !== "undefined"
      ? getSizes()
      : {
          "screen-x-small": false,
          "screen-small": false,
          "screen-medium": false,
          "screen-large": false,
        },
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    let raf = 0;

    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setSizes(getSizes());
      });
    };

    window.addEventListener("resize", onResize, { passive: true });
    onResize();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const changedKey = useMemo(() => JSON.stringify(sizes), [sizes]);

  return { sizes, changedKey };
}
