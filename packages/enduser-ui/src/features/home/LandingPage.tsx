import { locationSelectors } from "../location/locationSlice";
import Hero, { HeroSubtitle } from "./Hero";
import LandingPageArticle from "./LandingPageArticle";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const LandingPage = () => {
  const { t } = useTranslation(["frontpage"]);

  const country = useSelector(locationSelectors.country);
  const language = useSelector(locationSelectors.language);

  if (!country || !language) {
    return <Navigate to="/selections" />;
  }

  const subtitles: HeroSubtitle[] = [
    {
      iconName: "PieChart",
      subTitle: t("contentPart1.title"),
    },
    {
      iconName: "Heart",
      subTitle: t("contentPart2.title"),
    },
    {
      iconName: "TrendingUp",
      subTitle: t("contentPart3.title"),
    },
    {
      iconName: "Compass",
      subTitle: t("contentPart4.title"),
    },
  ];

  return (
    <>
      <Hero logoText={t("logotext")} subtitles={subtitles} />
      <LandingPageArticle />
    </>
  );
};

export default LandingPage;
