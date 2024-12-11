import { locationSelectors } from "../../../features/location/locationSlice";
import Heading from "../ui/Heading";
import Tag from "../ui/Tag";
import { TextLinkButton } from "../ui/buttons/TextLinkButton";
import IdeaActionCardCorner from "./ActionCardCorner/IdeaActionCardCorner";
import ImpactActionCardCorner from "./ActionCardCorner/ImpactActionCardCorner";
import {
  CalculatedAction,
  TagTheme,
} from "@pslifestyle/common/src/types/planTypes";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

interface Props {
  action: CalculatedAction;
  children: ReactNode;
  cyData?: string;
}

const ActionCard = ({ action, children, cyData }: Props): JSX.Element => {
  const { t } = useTranslation("recommendations");
  const country = useSelector(locationSelectors.country);

  const [showMore, setShowMore] = useState(false);

  return (
    <div className="bg-basic-white rounded-2xl" data-cy={cyData}>
      <div className="flex flex-row">
        <div className="grow pt-6 pl-5 pb-1">
          <Tag
            filter={action.category.toLowerCase()}
            key={action.category}
            variant={action.category.toLowerCase() as TagTheme}
          >
            {t(`categories.${action.category.toLowerCase()}`, {
              ns: "common",
            })}
          </Tag>
          <Heading level={3} type="title-md" className="mt-3">
            {t(`${action.id}_actionTitle_${country?.code}`, {
              ns: "questionAndRecommendationTranslations",
            })}
          </Heading>
          <TextLinkButton
            onClick={() => setShowMore(!showMore)}
            icon={{
              position: "right",
              size: "medium",
              type: showMore ? "ChevronUp" : "ChevronDown",
            }}
            buttonClassName="mt-2.5"
          >
            {showMore ? t("hide", { ns: "common" }) : t("seeMore")}
          </TextLinkButton>
        </div>
        <div>
          {Math.round(action.calculatedImpact) > 0 ? (
            <ImpactActionCardCorner action={action} />
          ) : (
            <IdeaActionCardCorner action={action} />
          )}
        </div>
      </div>
      <div
        className={`ml-3 overflow-hidden transition-max-height ease-in-out duration-300 ${
          showMore ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-2 mb-2 body-md">
          {t(`${action.id}_actionDescription_${country?.code}`, {
            ns: "questionAndRecommendationTranslations",
          })
            .split("\n")
            .filter((str) => str.length > 0)
            .map((str, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <p key={`str${index}`}>{str}</p>
            ))}
        </div>
      </div>
      <div className="flex flex-col mx-auto w-full">{children}</div>
    </div>
  );
};

export default ActionCard;
