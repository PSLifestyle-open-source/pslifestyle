import { Button, IButtonProps } from "./Button";
import {
  ButtonInnerContainer,
  IButtonInnerContainerProps,
} from "./ButtonInnerContainer";
import { ForwardedRef, forwardRef } from "react";

export interface IThemedButtonProps
  extends IButtonProps,
    IButtonInnerContainerProps {
  theme?:
    | "primary"
    | "goalCTA"
    | "blackCTA"
    | "planCTA"
    | "goalCTAActive"
    | "secondary"
    | "secondaryInverted"
    | "tertiary";
  buttonClassName?: string;
}

const defaultDisabledClasses = `
      group-disabled:cursor-default 
      group-disabled:bg-grey-10
      group-disabled:text-grey-40`;

const defaultFocusBorderClasses =
  "group-focus:border-2 group-focus:-m-0.5 group-focus:border-neutral-100";

const themeClassNamesMap = {
  primary: `${defaultFocusBorderClasses} ${defaultDisabledClasses} 
  bg-yellow-100 
  hover:bg-yellow-60 
  group-focus:bg-yellow-100 border-transparent
  active:bg-yellow-80 active:border-0`,
  goalCTA: `${defaultFocusBorderClasses} 
    bg-green-100 text-neutral-white border-transparent
    active:bg-green-80 
    hover:bg-green-60 
    group-disabled:cursor-default group-disabled:bg-grey-30`,
  goalCTAActive: `${defaultFocusBorderClasses} ${defaultDisabledClasses} 
    bg-green-140 text-neutral-white border-transparent
    hover:bg-green-60`,
  planCTA: `${defaultFocusBorderClasses} 
    bg-green-10 text-green-160 border-transparent 
    active:bg-green-40 
    hover:bg-green-30
    group-disabled:cursor-default group-disabled:bg-grey-60 group-disabled:text-green-120`,
  blackCTA: `${defaultFocusBorderClasses} ${defaultDisabledClasses}
  bg-basic-black text-yellow-100
  hover:bg-grey-80 
  group-focus:border-yellow-100 border-transparent
  active:bg-yellow-dark active:!border-0 active:!-m-0`,
  secondary: `${defaultFocusBorderClasses} ${defaultDisabledClasses} 
  -m-px 
  active:border-grey-60 active:text-grey-60
  border border-neutral-100 
  group-hover:border-grey-80 
  group-focus:text-neutral-100`,
  secondaryInverted: `
  -m-px
  group-disabled:cursor-default group-disabled:bg-transparent group-disabled:border-green-60 group-disabled:text-green-60
  border border-basic-white text-basic-white bg-transparent
  hover:bg-green-80
  active:bg-green-80 active:border-green-10 active:text-green-10 active:border
  group-focus:border-2 group-focus:-m-0.5 group-focus:border-basic-black
  `,
  tertiary: `${defaultFocusBorderClasses} 
  bg-transparent border-neutral-100 
  active:bg-grey-10
  group-hover:bg-basic-background 
  group-disabled:cursor-default group-disabled:bg-neutral-white group-disabled:text-grey-40`,
};

export const ThemedButton = forwardRef(
  (
    {
      theme = "primary",
      children,
      icon,
      className,
      buttonClassName,
      ...restProps
    }: IThemedButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => (
    <Button {...restProps} className={buttonClassName} ref={ref}>
      <ButtonInnerContainer
        icon={icon}
        className={`${themeClassNamesMap[theme]} ${className || ""}`}
      >
        {children}
      </ButtonInnerContainer>
    </Button>
  ),
);
