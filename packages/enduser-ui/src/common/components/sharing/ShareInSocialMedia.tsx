import { dataURLtoFile } from "../../utils/helpers";
import { ButtonLarge } from "../ui/buttons";
import { ForwardedRef, forwardRef } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  text: string;
  url: string;
  title: string;
  images: string;
}

const ShareInSocialMedia = forwardRef(
  (
    { text, url, title, images }: Props,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    const { t } = useTranslation(["results"]);
    const shareOnSocialMedia = () => {
      if (!navigator?.canShare || !title) {
        console.log("Sharing functionality is not available");
        return;
      }

      const files = [images].map((image: string) =>
        dataURLtoFile(image, "image.png"),
      ) as File[];

      if (!files.length) return;

      const shareData = {
        text,
        title,
        url,
        files,
      };

      if (navigator.canShare(shareData)) {
        navigator.share?.(shareData).catch((e) => console.error(e, e.stack));
      }
    };

    return navigator.share ? (
      <ButtonLarge
        id="gtm-share-invite-friends"
        onClick={() => shareOnSocialMedia()}
        theme="primary"
        icon={{ position: "left", type: "Share" }}
        ref={ref}
      >
        {t("shareResultsSocialMedia", { ns: "results" })}
      </ButtonLarge>
    ) : null;
  },
);

export default ShareInSocialMedia;
