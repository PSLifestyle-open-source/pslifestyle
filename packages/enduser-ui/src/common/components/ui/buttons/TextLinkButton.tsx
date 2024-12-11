import { Button, IButtonProps } from "./Button";
import {
  ButtonInnerContainer,
  IButtonInnerContainerProps,
} from "./ButtonInnerContainer";
import { ForwardedRef, forwardRef } from "react";

export interface ITextLinkButtonProps
  extends IButtonProps,
    IButtonInnerContainerProps {
  buttonClassName?: string;
}

export const TextLinkButton = forwardRef(
  (
    {
      children,
      icon,
      className,
      buttonClassName,
      ...restProps
    }: ITextLinkButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => (
    <Button {...restProps} className={buttonClassName} ref={ref}>
      <ButtonInnerContainer
        icon={icon}
        className={`textlink-md ${className || ""}`}
      >
        {children}
      </ButtonInnerContainer>
    </Button>
  ),
);
