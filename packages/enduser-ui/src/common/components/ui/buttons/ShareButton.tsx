import { ButtonLarge } from "./index";
import * as React from "react";
import { ForwardedRef, forwardRef, HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";

const ShareButton = forwardRef(
  (
    { children, onClick, ...restProps }: HTMLAttributes<HTMLButtonElement>,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    const { t } = useTranslation();

    return (
      <ButtonLarge
        ref={ref}
        onClick={onClick}
        theme="secondary"
        icon={{ position: "left", type: "Share" }}
        id="gtm-share-results-button"
        cyData="shareResults.button"
        {...restProps}
      >
        {children || t("shareResults")}
      </ButtonLarge>
    );
  },
);

export default ShareButton;
