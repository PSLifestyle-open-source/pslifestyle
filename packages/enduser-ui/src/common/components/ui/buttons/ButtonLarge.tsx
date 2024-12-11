import { IThemedButtonProps, ThemedButton } from "./ThemedButton";
import { ForwardedRef, forwardRef } from "react";

type IButtonLargeProps = IThemedButtonProps & {
  buttonClassName?: string;
};

const iconLeftClassNames = "pl-6 pr-8 pt-2.5 pb-3 gap-3";
const iconRightClassNames = "pl-8 pr-6 pt-2.5 pb-3 gap-3";
const noIconClassNames = "px-8 pt-2.5 pb-3";

const ButtonLarge = forwardRef(
  (
    { className, children, icon, ...restProps }: IButtonLargeProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    let padding = children ? noIconClassNames : "p-2.5";

    if (icon && children) {
      padding =
        icon.position === "right" ? iconRightClassNames : iconLeftClassNames;
    }

    return (
      <ThemedButton
        icon={icon}
        {...restProps}
        className={`rounded-full 
          button-lg
          ${padding}  
          ${className || ""}
          `}
        ref={ref}
      >
        {children}
      </ThemedButton>
    );
  },
);

export default ButtonLarge;
