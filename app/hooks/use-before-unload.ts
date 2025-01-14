import { useEffect } from "react";

export const useBeforeUnload = (block: boolean) => {
  const onBeforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (block) {
      window.addEventListener("beforeunload", onBeforeUnload);
    }
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [block]);
};
