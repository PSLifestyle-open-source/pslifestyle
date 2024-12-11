import {
  FullWidthContainer,
  NarrowWidthContainer,
} from "../components/layout/Container";
import Heading from "../components/ui/Heading";
import { Icon } from "../components/ui/Icon";
import Paragraph from "../components/ui/Paragraph";
import { ButtonLarge } from "../components/ui/buttons";
import { VerticalButtonsContainer } from "../components/ui/buttons/VerticalButtonsContainer";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["common"]);
  return (
    <FullWidthContainer className="py-4">
      <NarrowWidthContainer className="text-center gap-4">
        <Heading level={1} type="headline-lg-eb" className="text-red-80">
          {t("pageNotFound")}
        </Heading>
        <Icon size="extraextralarge" type="Frown" className="m-auto" />
        <Paragraph type="body-lg">{t("pageNotFoundExplanation")}</Paragraph>
        <VerticalButtonsContainer className="gap-4">
          <ButtonLarge
            onClick={() => navigate(-1)}
            icon={{ type: "ArrowLeft", position: "left", size: "medium" }}
          >
            {t("goBack", { ns: "common" })}
          </ButtonLarge>
          <ButtonLarge
            theme="secondary"
            onClick={() => navigate("/")}
            cyData="notFoundPage.backToHome"
          >
            {t("takeMeToFrontPage")}
          </ButtonLarge>
        </VerticalButtonsContainer>
      </NarrowWidthContainer>
    </FullWidthContainer>
  );
};

export default NotFoundPage;
