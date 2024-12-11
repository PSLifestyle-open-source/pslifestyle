import { ForwardedRef, forwardRef, HTMLAttributes } from "react";

const defaultClassNames = "mx-auto flex flex-col";

export const NarrowWidthContainer = forwardRef(
  (
    { children, className, ...restProps }: HTMLAttributes<HTMLDivElement>,
    ref: ForwardedRef<HTMLDivElement>,
  ) => (
    <div
      ref={ref}
      className={`w-full sm:max-w-[475px] ${defaultClassNames} ${
        className || ""
      }`}
      {...restProps}
    >
      {children}
    </div>
  ),
);

export const ModalContentContainer = ({
  children,
  centerContent,
  centerVertically,
  scrollable,
  grow,
  className,
  ...restProps
}: HTMLAttributes<HTMLDivElement> & {
  centerContent?: boolean;
  centerVertically?: boolean;
  scrollable?: boolean;
  grow?: boolean;
}) => (
  <NarrowWidthContainer
    className={`p-4
    ${scrollable ? "overflow-y-auto" : ""}
    ${grow ? "flex-grow" : ""} 
    ${centerContent ? "text-center items-center" : ""} 
    ${centerVertically ? "justify-center" : ""}
    ${className || ""}`}
    {...restProps}
  >
    {children}
  </NarrowWidthContainer>
);

export const WideWidthContainer = forwardRef(
  (
    { children, className, ...restProps }: HTMLAttributes<HTMLDivElement>,
    ref: ForwardedRef<HTMLDivElement>,
  ) => (
    <div
      className={`w-full sm:max-w-[640px] ${defaultClassNames} ${className || ""}`}
      ref={ref}
      {...restProps}
    >
      {children}
    </div>
  ),
);

export const FullWidthContainer = forwardRef(
  (
    { children, className, ...restProps }: HTMLAttributes<HTMLDivElement>,
    ref: ForwardedRef<HTMLDivElement>,
  ) => (
    <div
      className={`w-[100%] lg:max-w-[1024px] md:max-w-[768px] sm:max-w-[640px] px-4 ${defaultClassNames} ${
        className || ""
      }`}
      ref={ref}
      {...restProps}
    >
      {children}
    </div>
  ),
);

export const ColumnedContainer = ({
  children,
  className,
  ...restProps
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`w-full flex flex-col gap-4 md:gap-5 lg:flex-row md:justify-around ${
      className || ""
    }`}
    {...restProps}
  >
    {children}
  </div>
);

export const Column = ({
  columns = 2,
  children,
  className,
  ...restProps
}: { columns?: number } & HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`basis-full lg:basis-1/${columns} w-full lg:max-w-md${
      className || ""
    }`}
    {...restProps}
  >
    {children}
  </div>
);
