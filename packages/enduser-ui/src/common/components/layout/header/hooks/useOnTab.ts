import { useEffect } from "react";

interface Props {
  enabled: boolean;
  callback: (event: KeyboardEvent) => unknown;
}

const useOnTab = ({ enabled, callback }: Props): void => {
  const handleOnTab = (event: KeyboardEvent) => {
    if (!enabled) {
      return;
    }
    if (event.key === "Tab") {
      callback(event);
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleOnTab);
    return () => {
      window.removeEventListener("keydown", handleOnTab);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback]);
};

export default useOnTab;
