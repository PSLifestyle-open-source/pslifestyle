import { Card } from "../Card/Card";
import Heading from "../ui/Heading";
import Paragraph from "../ui/Paragraph";
import ButtonLarge from "../ui/buttons/ButtonLarge";
import FeedbackModalFlow from "./FeedbackModalFlow";
import { useTranslation } from "react-i18next";

export const FeedbackBlock = () => {
  const { t } = useTranslation(["common", "feedback"]);
  return (
    <Card>
      <div className="p-4 bg-yellow-100 rounded-2xl flex flex-col gap-3">
        <Heading level={2} type="title-sm">
          {t("feedback:plan-looking-great-need-help")}
        </Heading>
        <Paragraph type="body-md">
          {t("feedback:make-this-service-better")}
        </Paragraph>
        <FeedbackModalFlow>
          <ButtonLarge
            theme="tertiary"
            buttonClassName="bg-basic-white rounded-full"
            className="justify-center"
          >
            {t("common:continue")}
          </ButtonLarge>
        </FeedbackModalFlow>
      </div>
    </Card>
  );
};
