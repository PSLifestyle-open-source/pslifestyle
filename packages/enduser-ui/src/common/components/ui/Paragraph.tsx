import * as React from "react";
import { HTMLAttributes } from "react";

export interface IParagraphProps extends HTMLAttributes<HTMLParagraphElement> {
  type:
    | "body-lg"
    | "body-md"
    | "body-sm"
    | "body-lg-b"
    | "body-md-b"
    | "body-sm-b"
    | "meta-lg"
    | "meta-md"
    | "meta-sm"
    | "label-lg"
    | "label-md"
    | "label-sm";
  cyData?: string;
}

const Paragraph = ({
  children,
  type,
  className,
  ...restProps
}: IParagraphProps) => (
  <p className={`${type} ${className || ""}`} {...restProps}>
    {children}
  </p>
);

export default Paragraph;
