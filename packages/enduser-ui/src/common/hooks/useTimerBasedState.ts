import { useEffect, useState } from "react";

// Combine constants with variables from user answers
const useTimerBasedState = (
  length: number,
): {
  state: boolean;
  activateState: () => void;
  deactivateState: () => void;
} => {
  const [state, setState] = useState(false);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => () => {
    if (timer) {
      clearTimeout(timer);
    }
  });

  const activateState = () => {
    setState(true);

    setTimer(
      setTimeout(() => {
        setState(false);
      }, length),
    );
  };

  const deactivateState = () => {
    setState(false);
    if (timer) {
      clearTimeout(timer);
    }
  };

  return { state, activateState, deactivateState };
};

export default useTimerBasedState;
