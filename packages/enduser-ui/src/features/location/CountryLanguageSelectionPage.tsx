import { FullWidthContainer } from "../../common/components/layout/Container";
import { ButtonLarge } from "../../common/components/ui/buttons";
import CountryLanguageSelection from "./CountryAndLanguageSelection";
import { locationSelectors } from "./locationSlice";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const CountryLanguageSelectionPage = (): JSX.Element => {
  const { t } = useTranslation(["common", "frontpage"]);
  const navigate = useNavigate();
  const language = useSelector(locationSelectors.language);
  const country = useSelector(locationSelectors.country);

  return (
    <FullWidthContainer data-testid="container-div" className="py-2 gap-6">
      <CountryLanguageSelection title={t("welcome", { ns: "frontpage" })} />
      <div data-testid="continue-btn-div" className="flex justify-center py-2">
        <ButtonLarge
          cyData="continue-button"
          onClick={() => {
            navigate("/");
          }}
          disabled={!country || !language}
        >
          {t("continue", { ns: "common" })}
        </ButtonLarge>
      </div>
    </FullWidthContainer>
  );
};
