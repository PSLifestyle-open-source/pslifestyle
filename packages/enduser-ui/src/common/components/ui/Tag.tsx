import { TagTheme } from "@pslifestyle/common/src/types/planTypes";
import classNames from "classnames";
import { ReactNode } from "react";

interface Props {
  filter: string;
  children: ReactNode;
  variant?: TagTheme;
  selected?: boolean;
  clickable?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Tag = ({
  children,
  filter,
  variant = "other",
  selected = false,
  clickable = false,
  onClick,
}: Props) => {
  const classes = classNames(
    "rounded-full inline-flex items-center px-3 py-1 label-sm",

    {
      "bg-purple-40 text-purple-dark": variant === "transport",
      "bg-pink-40 text-pink-dark": variant === "food",
      "bg-cyan-40 text-cyan-dark": variant === "purchases",
      "bg-orange-40 text-orange-dark": variant === "housing",
      "bg-green-40 text-green-dark": variant === "action",

      "bg-yellow-40": ["idea", "challenge"].includes(variant),
      "bg-pink-60": variant === "other",
      invert: selected,
    },
  );

  if (clickable && typeof onClick === "function") {
    return (
      <div>
        <button
          data-cy={variant}
          type="button"
          onClick={onClick}
          className={classes}
          id={`gtm-motivation-filters-button-${filter}`}
        >
          {children}
        </button>
      </div>
    );
  }
  return <div className={classes}>{children}</div>;
};

export default Tag;
