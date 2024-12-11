import { IThemedButtonProps, ThemedButton } from "./ThemedButton";
import { ForwardedRef, forwardRef } from "react";

type IButtonMediumProps = IThemedButtonProps & {
  buttonClassName?: string;
};

const ButtonMedium = forwardRef(
  (
    { className, children, ...restProps }: IButtonMediumProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => (
    <ThemedButton
      {...restProps}
      className={`rounded-full ${children ? "py-2 px-4" : "p-2.5"} gap-2 button-md ${className || ""}`}
      ref={ref}
    >
      {children}
    </ThemedButton>
  ),
);

export default ButtonMedium;
