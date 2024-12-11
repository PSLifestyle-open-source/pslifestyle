import { FullWidthContainer } from "../../common/components/layout/Container";
import Heading from "../../common/components/ui/Heading";
import Paragraph from "../../common/components/ui/Paragraph";
import BackButtonInContainer from "../../common/components/ui/buttons/BackButtonInContainer";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const CalculationBasisPage = () => {
  const { t } = useTranslation("results");

  return (
    <>
      <BackButtonInContainer />
      <FullWidthContainer>
        <Heading level={1} type="headline-lg-eb" className="text-green-100">
          {t("calculationBasis")}
        </Heading>
        <Paragraph className="mt-4" type="body-lg">
          <Trans
            i18nKey="calculationBasisDescription"
            ns="common"
            components={{
              Link: (
                <Link
                  to={t("calculationBasisLink", { ns: "common" })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                />
              ),
            }}
          />
        </Paragraph>
        <img className="mt-5" src="/images/forest.jpeg" alt="" />
      </FullWidthContainer>
    </>
  );
};
