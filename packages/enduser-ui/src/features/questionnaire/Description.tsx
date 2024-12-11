import { Country } from "@pslifestyle/common/src/models/countries";
import { useTranslation } from "react-i18next";

interface Props {
  descriptionTranslationKey: string | undefined;
  country: Country;
}

const Description = ({ descriptionTranslationKey, country }: Props) => {
  const { t } = useTranslation(["questionAndRecommendationTranslations"]);
  const description = descriptionTranslationKey
    ? t(`${descriptionTranslationKey}_${country.code}`, {
        ns: "questionAndRecommendationTranslations",
      })
    : "";

  if (!description) {
    return null;
  }

  return <p className="max-w-3xl">{description}</p>;
};

export default Description;
