import { useState } from "react";

export function useSlideIndex(dataLength, duration = 300) {
  const [index, setIndex] = useState(0);
  const [animClass, setAnimClass] = useState("");

  const next = () => {
    if (dataLength === 0) return;

    setAnimClass("slide-out");

    setTimeout(() => {
      setIndex((prev) => (prev + 1) % dataLength);
      setAnimClass("slide-in");

      setTimeout(() => setAnimClass(""), duration);
    }, duration);
  };

  return { index, next, animClass };
}