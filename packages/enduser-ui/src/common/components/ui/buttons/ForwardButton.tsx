import { ButtonMedium } from "./index";
import * as React from "react";
import { HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";

const ForwardButton = ({
  children,
  onClick,
  ...restProps
}: HTMLAttributes<HTMLButtonElement>) => {
  const { t } = useTranslation();

  return (
    <ButtonMedium
      onClick={onClick}
      theme="secondary"
      icon={{ position: "right", type: "ArrowRight" }}
      {...restProps}
    >
      {children || t("goBack")}
    </ButtonMedium>
  );
};

export default ForwardButton;
