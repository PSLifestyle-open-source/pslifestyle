import { getTodayDate } from "../../utils/helpers";
import { WideWidthContainer } from "../layout/Container";
import { Loader } from "../loaders/Loader";
import Paragraph from "../ui/Paragraph";
import { DownloadButton, ShareButton } from "../ui/buttons";
import DialogDescription from "../ui/dialogs/DialogDescription";
import DialogTitle from "../ui/dialogs/DialogTitle";
import FullPageDialogPortal from "../ui/dialogs/FullPageDialogPortal";
import ShareInSocialMedia from "./ShareInSocialMedia";
import * as Dialog from "@radix-ui/react-dialog";
import { toPng } from "html-to-image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
  shareTriggerButtonText: string;
  title: string;
  description: string;
  cypressPrefix: string;
  elementRef: HTMLDivElement | null;
  successfulShareMessage: string;
  sharedFilePrefix: string;
}

const ShareDialog = ({
  shareTriggerButtonText,
  title,
  description,
  cypressPrefix,
  successfulShareMessage,
  sharedFilePrefix,
  elementRef,
}: IProps) => {
  const { t } = useTranslation(["common", "results"]);
  const [shareMessage, setShareMessage] = useState("");
  const [imgHref, setImgHref] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const createPng = useCallback(() => {
    setShareMessage("");
    if (elementRef === null) {
      return;
    }

    const createOptions = {
      cacheBust: true,
      backgroundColor: "white",
      //   pixelRatio: 1,
      style: {
        // undo the hiding/pushing the ref div, so that it creates the png correctly
        position: "static",
      },
    };

    toPng(elementRef, createOptions)
      .then((dataUrl) => {
        setImgHref(dataUrl);
      })
      .catch((_) => {
        setShareMessage(t("error.general", { ns: "common" }));
      });
  }, [elementRef, t]);

  const downloadPng = () => {
    const todayDate = getTodayDate();
    setShareMessage("");
    if (elementRef === null) {
      return;
    }

    const link = document.createElement("a");
    link.download = `${sharedFilePrefix}-${todayDate}.png`;
    link.href = imgHref;
    link.click();
    setShareMessage(successfulShareMessage);
  };

  useEffect(() => {
    createPng();
  });

  return (
    <Dialog.Root modal>
      <Dialog.Trigger asChild>
        <ShareButton>{shareTriggerButtonText}</ShareButton>
      </Dialog.Trigger>
      <FullPageDialogPortal
        displayHeaderCloseButton
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          if (containerRef.current) {
            (
              containerRef.current?.getElementsByTagName(
                "button",
              )[0] as HTMLButtonElement
            )?.focus();
          }
        }}
      >
        <WideWidthContainer
          className="flex flex-col gap-5 max-w-full lg:max-w-3xl py-2"
          ref={containerRef}
        >
          <DialogTitle cyData={`${cypressPrefix}.title`}>{title}</DialogTitle>
          <DialogDescription cyData={`${cypressPrefix}.description`}>
            {description}
          </DialogDescription>

          <div className="w-full flex justify-center">
            <ShareInSocialMedia
              images={imgHref}
              text="My result. Join and try it!!"
              url=""
              title="Know your carbon footprint"
            />
          </div>

          {shareMessage && (
            <Paragraph className="text-center" type="body-lg">
              {shareMessage}
            </Paragraph>
          )}

          {imgHref ? (
            <img
              data-cy="download.href"
              className="border-2 border-neutral-10 rounded-xl max-w-xs md:max-w-md max-h-xs md:max-h-md mx-auto"
              src={imgHref}
              alt="Preview of the results summary file"
            />
          ) : (
            <div className="border-2 border-neutral-10 rounded-xl max-w-xs md:max-w-md mx-auto p-7 flex justify-center">
              <Loader />
            </div>
          )}
          <div className="w-full flex justify-center">
            <DownloadButton onClick={downloadPng} />
          </div>
        </WideWidthContainer>
      </FullPageDialogPortal>
    </Dialog.Root>
  );
};

export default ShareDialog;
