import { useEffect } from "react";

interface Props {
  enabled: boolean;
  callback: () => unknown;
}

const useOnArrowDown = ({ enabled, callback }: Props): void => {
  const handleArrowUp = (event: KeyboardEvent) => {
    if (!enabled) {
      return;
    }
    if (event.key === "ArrowDown") {
      event.stopPropagation();
      event.preventDefault();
      callback();
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleArrowUp);
    return () => {
      window.removeEventListener("keydown", handleArrowUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback]);
};

export default useOnArrowDown;
