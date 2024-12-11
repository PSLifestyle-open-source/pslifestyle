import { ButtonLarge } from "./index";
import * as React from "react";
import { ForwardedRef, forwardRef, HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";

const DownloadButton = forwardRef(
  (
    { children, onClick, ...restProps }: HTMLAttributes<HTMLButtonElement>,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    const { t } = useTranslation();

    return (
      <ButtonLarge
        onClick={onClick}
        theme="secondary"
        icon={{ position: "left", type: "Download" }}
        id="gtm-share-download-image"
        ref={ref}
        {...restProps}
      >
        {children || t("download", { ns: "common" })}
      </ButtonLarge>
    );
  },
);

export default DownloadButton;
