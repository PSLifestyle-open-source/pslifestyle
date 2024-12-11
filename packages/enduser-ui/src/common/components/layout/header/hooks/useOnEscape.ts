import { useEffect } from "react";

interface Props {
  enabled: boolean;
  callback: () => unknown;
}

const useOnEscape = ({ enabled, callback }: Props): void => {
  const handleOnEscape = (event: KeyboardEvent) => {
    if (!enabled) {
      return;
    }
    if (event.key === "Escape") {
      callback();
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleOnEscape);
    return () => {
      window.removeEventListener("keydown", handleOnEscape);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback]);
};

export default useOnEscape;
