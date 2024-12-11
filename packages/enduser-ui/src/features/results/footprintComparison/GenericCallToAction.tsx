import { ButtonMedium } from "../../../common/components/ui/buttons";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const GenericCallToAction = () => {
  const { t } = useTranslation(["results"]);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-green-100 px-6 pt-16 pb-10 sm:px-10 sm:py-14 rounded-2xl sm:rounded-lg gap-6 sm:gap-4 items-center sm:items-start bg-windmill-small before:bg-green-120 before:opacity-50">
      <p className="headline-md-b text-basic-white flex-1">
        {t("greenCTA.description", { ns: "results" })}
      </p>
      <div>
        <ButtonMedium
          onClick={() => navigate("/recommendations")}
          theme="planCTA"
          icon={{ position: "right", type: "ChevronRight" }}
          id="gtm-results-cta-button"
        >
          {t("greenCTA.button", { ns: "results" })}
        </ButtonMedium>
      </div>
    </div>
  );
};

export default GenericCallToAction;
