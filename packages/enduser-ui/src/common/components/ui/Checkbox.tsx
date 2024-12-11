import { NarrowWidthContainer } from "../layout/Container";
import { Icon } from "./Icon";
import classNames from "classnames";
import { PropsWithChildren } from "react";

interface Props {
  checked: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = ({
  checked,
  onChange,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <NarrowWidthContainer>
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
    <label className="inline-flex gap-2 items-center hover:cursor-pointer w-full px-2 sm:px-0 py-1">
      <span className="flex-grow">{children}</span>
      <span
        className={classNames(
          "inline-flex flex-shrink-0 border border-transparent-black rounded-full w-12 h-12",
          {
            "justify-center items-center bg-green-100": checked,
            "bg-neutral-white": !checked,
          },
        )}
      >
        {checked && (
          <Icon size="large" type="Check" className="text-neutral-white" />
        )}
      </span>
      <input
        checked={checked}
        className="sr-only"
        type="checkbox"
        onChange={onChange}
      />
    </label>
  </NarrowWidthContainer>
);

export default Checkbox;
