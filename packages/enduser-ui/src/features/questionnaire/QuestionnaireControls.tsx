/**
 * Component for controlling Questionnaire. Back&next buttons, current/total (if it is more than 1) indicator etc.
 */
import { FullWidthContainer } from "../../common/components/layout/Container";
import BackButton from "../../common/components/ui/buttons/BackButton";
import ForwardButton from "../../common/components/ui/buttons/ForwardButton";
import React from "react";
import { useTranslation } from "react-i18next";

interface QuestionnaireControlsProps {
  current: number;
  total: number;
  className?: string;
  back?: () => void;
  next?: () => void;
  children: React.ReactNode;
}

const QuestionnaireControls: React.FC<QuestionnaireControlsProps> = ({
  current,
  total,
  back,
  next,
  children,
  className = "fixed left-0 bottom-0",
}) => {
  const { t } = useTranslation(["common", "questionnaire"]);
  const displayBackButton = current !== 1 && typeof back === "function";
  return (
    <div
      data-testid="main-div"
      className={`w-full bg-neutral-white opacity-90 shadow-control-top ${className}`}
    >
      <FullWidthContainer data-testid="auto-div">
        <div
          data-testid="rounded-div"
          className="flex justify-around py-2 px-4"
        >
          <div
            data-testid="w-center-div"
            className="w-1/3 inline-flex justify-start items-center"
          >
            {displayBackButton && (
              <BackButton onClick={back}>
                {t("buttonPreviousQuestion", { ns: "questionnaire" })}
              </BackButton>
            )}
          </div>
          {total === current ? (
            <div
              data-testid="w-body-div"
              className="w-1/3 inline-flex justify-center items-center text-body-sm"
            />
          ) : (
            <div
              data-testid="w-body-div"
              className="w-1/3 inline-flex justify-center items-center text-body-sm"
            >
              <span>
                {current}/{total}
              </span>
            </div>
          )}

          <div
            data-testid="2w-center-div"
            className="w-1/3 inline-flex justify-end items-center"
          >
            {next && (
              <ForwardButton onClick={next}>
                {t("buttonNextQuestion", { ns: "questionnaire" })}
              </ForwardButton>
            )}
          </div>
        </div>
        {children}
      </FullWidthContainer>
    </div>
  );
};

export default QuestionnaireControls;
