import * as React from "react";
import * as FeatherIcon from "react-feather";
import { IconProps as FeatherIconProps } from "react-feather";

export interface IconProps extends FeatherIconProps {
  type: keyof typeof FeatherIcon;
  size?: keyof typeof sizeMap;
}

const sizeMap = {
  small: 16,
  medium: 24,
  large: 32,
  extralarge: 56,
  extraextralarge: 112,
};

export const Icon = ({ type, size, ...restProps }: IconProps) => {
  const IconComponent = FeatherIcon[type];

  return <IconComponent size={sizeMap[size || "medium"]} {...restProps} />;
};
