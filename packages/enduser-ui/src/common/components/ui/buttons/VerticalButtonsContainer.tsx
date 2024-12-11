import * as React from "react";

export const VerticalButtonsContainer = ({
  children,
  className,
  ...restProps
}: React.HTMLAttributes<HTMLDivElement> & {
  alignToBottomOnMobile?: boolean;
}) => (
  <div
    className={`flex flex-col mb-8 mx-auto ${className || ""}`}
    {...restProps}
  >
    {children}
  </div>
);

export const VerticalButtonsModalContainer = ({
  children,
  className,
  ...restProps
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex flex-col mx-auto ${className || ""}`} {...restProps}>
    {children}
  </div>
);
