import { useEffect } from "react";

interface Options {
  readonly when: boolean;
}

export default function usePreventNavigation({ when: condition }: Options) {
  useEffect(() => {
    function handler(e: BeforeUnloadEvent) {
      if (condition) e.preventDefault();
    }

    window.addEventListener("beforeunload", handler);
    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, [condition]);
}
