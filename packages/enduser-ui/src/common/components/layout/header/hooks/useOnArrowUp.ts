import { useEffect } from "react";

interface Props {
  enabled: boolean;
  callback: () => unknown;
}

const useOnArrowUp = ({ enabled, callback }: Props): void => {
  const handleArrowUp = (event: KeyboardEvent) => {
    if (!enabled) {
      return;
    }
    if (event.key === "ArrowUp") {
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

export default useOnArrowUp;
