import {
  IThemedButtonProps,
  ThemedButton,
} from "../../ui/buttons/ThemedButton";
import { ForwardedRef, forwardRef } from "react";

type IButtonMediumProps = IThemedButtonProps;

const MainActionCardButton = forwardRef(
  (
    { className, children, ...restProps }: IButtonMediumProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => (
    <ThemedButton
      {...restProps}
      className={`h-[60px] w-full justify-center font-bold shrink-0 rounded-b-xl ${
        className || ""
      }`}
      ref={ref}
    >
      {children}
    </ThemedButton>
  ),
);

export default MainActionCardButton;
