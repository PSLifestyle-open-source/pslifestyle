import { WideWidthContainer } from "../../common/components/layout/Container";
import ShareDialog from "../../common/components/sharing/ShareDialog";
import { ButtonMedium } from "../../common/components/ui/buttons";
import RetakeQuestionnaireAlertDialog from "../questionnaire/RetakeQuestionnaireAlertDialog";
import ShareableResults from "./actions/ShareableResults";
import { MathScopes } from "@pslifestyle/common/src/types/genericTypes";
import { CategorizedFootprint } from "@pslifestyle/common/src/types/questionnaireTypes";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface IActionsProps {
  fullMathScope: MathScopes;
  totalFootprint: number;
  categorizedFootprint: CategorizedFootprint;
}

const Actions = ({
  totalFootprint,
  categorizedFootprint,
  fullMathScope,
}: IActionsProps) => {
  // results png download
  const [resultsElementRef, setResultsElementRef] =
    useState<HTMLDivElement | null>(null);
  const { t } = useTranslation(["results", "common"]);
  const navigate = useNavigate();

  return (
    <WideWidthContainer className="flex flex-col gap-5 text-center px-4 py-4 sm:py-10">
      <div>
        <ShareDialog
          shareTriggerButtonText={t("shareResultsSocialMedia", {
            ns: "results",
          })}
          title={t("shareResultsTitle", { ns: "results" })}
          description={t("shareResultsText", { ns: "results" })}
          cypressPrefix="shareResults"
          elementRef={resultsElementRef}
          successfulShareMessage={t("shareResultsDownloadComplete", {
            ns: "results",
          })}
          sharedFilePrefix={t("result")}
        />
        <ShareableResults
          setRef={setResultsElementRef}
          constants={fullMathScope!}
          totalFootprint={totalFootprint}
          categorizedFootprint={categorizedFootprint}
        />
      </div>
      <div>
        <ButtonMedium
          theme="tertiary"
          icon={{ position: "left", type: "HelpCircle" }}
          onClick={() => navigate("/calculationbasis")}
        >
          {t("linkToCalculationBasis", { ns: "common" })}
        </ButtonMedium>
      </div>
      <div>
        <RetakeQuestionnaireAlertDialog>
          <ButtonMedium
            id="gtm-take-test"
            icon={{ type: "ArrowLeft", position: "left", size: "small" }}
            theme="tertiary"
            className="justify-center"
            cyData="take-test-button"
          >
            {t("retakeTest", { ns: "common" })}
          </ButtonMedium>
        </RetakeQuestionnaireAlertDialog>
      </div>
    </WideWidthContainer>
  );
};

export default Actions;
