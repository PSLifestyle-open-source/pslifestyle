import { ThemedButton } from "./ThemedButton";
import * as React from "react";
import { ForwardedRef, forwardRef, HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";

const CloseButton = forwardRef(
  (
    { ...restProps }: HTMLAttributes<HTMLButtonElement>,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    const { t } = useTranslation(["common"]);
    return (
      <ThemedButton
        ref={ref}
        theme="secondary"
        className="rounded-full"
        aria-label={t("close")}
        icon={{ position: "left", type: "X", size: "medium" }}
        {...restProps}
      />
    );
  },
);

export default CloseButton;
