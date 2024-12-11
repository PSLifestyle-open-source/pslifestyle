import { ButtonMedium } from "./index";
import * as React from "react";
import { HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const BackButton = ({
  children,
  onClick,
  ...restProps
}: HTMLAttributes<HTMLButtonElement>) => {
  const { t } = useTranslation(["common"]);
  const navigate = useNavigate();

  return (
    <ButtonMedium
      onClick={onClick || (() => navigate(-1))}
      theme="secondary"
      icon={{ position: "left", type: "ArrowLeft" }}
      {...restProps}
    >
      {children || t("goBack")}
    </ButtonMedium>
  );
};

export default BackButton;
