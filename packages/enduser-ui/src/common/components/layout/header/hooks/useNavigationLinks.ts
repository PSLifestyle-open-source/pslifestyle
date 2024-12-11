import { authedSessionSelectors } from "../../../../../features/auth/authedSessionSlice";
import { locationSelectors } from "../../../../../features/location/locationSlice";
import { userPlanSelectors } from "../../../../../features/plan/userPlanSlice";
import { userAnswersSelectors } from "../../../../../features/questionnaire/userAnswersSlice";
import DefaultMenuItem from "../DefaultMenuItem";
import GoToTestMenuItem from "../GoToTestMenuItem";
import LogOutMenuItem from "../LogOutMenuItem";
import { IMenuItemRendererProps } from "../types";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export interface HeaderLink {
  to: string;
  linkText: string;
  enabled: boolean;
  linkLocation: ("hamburger" | "header" | "desktopHamburger")[];
  hidden: boolean;
  renderer: FC<IMenuItemRendererProps>;
}

const useNavigationLinks = () => {
  const { t } = useTranslation(["common"]);
  const user = useSelector(authedSessionSelectors.user);
  const selectedActions = useSelector(userPlanSelectors.selectedActions);
  const hasPlan = !!selectedActions.length;
  const hasAnswers = useSelector(userAnswersSelectors.hasAnswers);
  const language = useSelector(locationSelectors.language);
  const country = useSelector(locationSelectors.country);

  const links: HeaderLink[] = [
    {
      to: "#!",
      linkText: `1. ${t("test", { ns: "common" })}`,
      enabled: !!(country && language),
      linkLocation: ["desktopHamburger"],
      hidden: false,
      renderer: GoToTestMenuItem,
    },
    {
      to: "/results",
      linkText: `2. ${t("results", { ns: "common" })}`,
      enabled: hasAnswers,
      linkLocation: ["desktopHamburger"],
      hidden: false,
      renderer: DefaultMenuItem,
    },
    {
      to: "/recommendations",
      linkText: `3. ${t("recommendations", { ns: "common" })}`,
      enabled: hasPlan,
      linkLocation: ["desktopHamburger"],
      hidden: false,
      renderer: DefaultMenuItem,
    },
    {
      to: "/plan",
      linkText: `4. ${t("plan", { ns: "common" })}`,
      enabled: hasPlan,
      linkLocation: ["desktopHamburger"],
      hidden: false,
      renderer: DefaultMenuItem,
    },
    {
      to: "/account",
      linkText: t("accountManagement", { ns: "common" }),
      enabled: !!user,
      linkLocation: ["desktopHamburger"],
      hidden: !user,
      renderer: DefaultMenuItem,
    },
    {
      to: "/managementpanel",
      linkText: t("managementPanel", { ns: "common" }),
      enabled: !!user && !!user.roles.length,
      linkLocation: ["desktopHamburger"],
      hidden: !user || !user.roles.length,
      renderer: DefaultMenuItem,
    },
    {
      to: "/login",
      linkText: t("signIn", { ns: "common" }),
      enabled: !user,
      linkLocation: ["header", "hamburger"],
      hidden: !!user,
      renderer: DefaultMenuItem,
    },
    {
      to: "/",
      linkText: t("signOut", { ns: "common" }),
      enabled: !!user,
      linkLocation: ["hamburger", "header"],
      hidden: !user,
      renderer: LogOutMenuItem,
    },
  ];

  const visibleLinks = links.filter((link) => !link.hidden);
  const hamburgerLinks = visibleLinks.filter((link) =>
    link.linkLocation.includes("hamburger"),
  );
  const desktopHamburgerLinks = visibleLinks.filter((link) =>
    link.linkLocation.includes("desktopHamburger"),
  );
  const headerLinks = visibleLinks.filter((link) =>
    link.linkLocation.includes("header"),
  );

  return { hamburgerLinks, headerLinks, desktopHamburgerLinks };
};

export default useNavigationLinks;
