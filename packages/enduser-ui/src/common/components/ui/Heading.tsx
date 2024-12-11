import * as React from "react";
import { HTMLAttributes } from "react";

interface IProps extends HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  type:
    | "headline-xl-eb"
    | "headline-lg-eb"
    | "headline-md-b"
    | "headline-sm-sb"
    | "headline-sm-b"
    | "headline-xs-eb"
    | "headline-xs-sb"
    | "title-lg"
    | "title-md"
    | "title-sm";
}

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const Heading = ({
  level,
  type,
  className,
  children,
  ...restProps
}: IProps) => {
  const Tag = `h${level}` as HeadingTag;
  return (
    <Tag className={`${type} ${className || ""}`} {...restProps}>
      {children}
    </Tag>
  );
};

export default Heading;
