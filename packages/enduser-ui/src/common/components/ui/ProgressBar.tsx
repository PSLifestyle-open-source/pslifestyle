import * as Progress from "@radix-ui/react-progress";
import classNames from "classnames";

interface ProgressBarProps {
  value: number;
  // if max is not provided, value is handled as "percent"
  max?: number;
  // provide colors as tailwind css classes, defaults to neutral
  baseColorClassName?: string;
  progressColorClassName?: string;
}

export const ProgressBar = ({
  value,
  max = 100,
  progressColorClassName,
  baseColorClassName,
}: ProgressBarProps): null | JSX.Element => (
  <Progress.Root
    className={classNames(
      baseColorClassName || "bg-neutral-10",
      "h-full w-full min-h-0.5 rounded-full overflow-hidden",
    )}
    value={value}
  >
    <Progress.Indicator
      className={classNames(
        progressColorClassName || "bg-neutral-40",
        "h-full w-full rounded-full min-h-0.5 transition-all duration 200 ease-in-out",
      )}
      style={{
        width: `${(100 * value) / max}%`,
      }}
    />
  </Progress.Root>
);
