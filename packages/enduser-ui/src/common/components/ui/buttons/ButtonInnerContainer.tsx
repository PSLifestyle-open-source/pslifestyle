import { Icon, IconProps } from "../Icon";
import { ForwardedRef, forwardRef, ReactNode } from "react";

export interface IButtonInnerContainerProps {
  icon?: IconProps & {
    position: "left" | "right";
  };
  children?: ReactNode;
  className?: string;
}

const defaultClassNames = `
      inline-flex
      items-center
      cursor-pointer
      no-underline 
      hover:no-underline 
      group-focus:no-underline`;

export const ButtonInnerContainer = forwardRef(
  (
    { icon, className, children }: IButtonInnerContainerProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ) => (
    <span
      className={`${defaultClassNames} ${
        icon?.position === "left" ? "flex-row" : "flex-row-reverse"
      } ${className || ""}`}
      ref={ref}
    >
      {icon && <Icon type={icon.type} size={icon.size} />}
      {children && <span>{children}</span>}
    </span>
  ),
);
