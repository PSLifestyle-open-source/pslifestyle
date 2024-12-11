import { useEffect } from "react";

interface Props {
  enabled: boolean;
  callback: () => unknown;
}

const useOnSpacebar = ({ enabled, callback }: Props): void => {
  const handleOnSpacebar = (event: KeyboardEvent) => {
    if (!enabled) {
      return;
    }
    if (event.key === " ") {
      callback();
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleOnSpacebar);
    return () => {
      window.removeEventListener("keydown", handleOnSpacebar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback]);
};

export default useOnSpacebar;
