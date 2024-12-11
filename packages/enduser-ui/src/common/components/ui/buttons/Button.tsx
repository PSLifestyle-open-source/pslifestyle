import {
  ButtonHTMLAttributes,
  ForwardedRef,
  forwardRef,
  ReactNode,
} from "react";

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  id?: string;
  cyData?: string;
  children?: ReactNode;
}

export const Button = forwardRef(
  (
    {
      className,
      children,
      cyData,
      type = "button",
      ...restProps
    }: IButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => (
    <button
      {...restProps}
      ref={ref}
      // eslint-disable-next-line react/button-has-type
      type={type}
      data-cy={cyData}
      className={`group outline-none ${className || ""} `}
    >
      {children}
    </button>
  ),
);
