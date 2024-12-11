import { IThemedButtonProps, ThemedButton } from "../buttons/ThemedButton";
import { ForwardedRef, forwardRef } from "react";

type IButtonMediumProps = IThemedButtonProps;

const WindowDialogButton = forwardRef(
  (
    { className, children, ...restProps }: IButtonMediumProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => (
    <ThemedButton
      {...restProps}
      className={`h-[60px] w-full justify-center font-bold shrink-0 ${className || ""}`}
      ref={ref}
    >
      {children}
    </ThemedButton>
  ),
);

export default WindowDialogButton;
