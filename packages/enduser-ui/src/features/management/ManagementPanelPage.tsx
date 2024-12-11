import { FullWidthContainer } from "../../common/components/layout/Container";
import Heading from "../../common/components/ui/Heading";
import { assertRole } from "../../common/utils/user";
import { authedSessionSelectors } from "../auth/authedSessionSlice";
import AccordionTrigger from "./AccordionTrigger";
import CampaignLinkManager from "./CampaignLinkManager";
import RoleConfigView from "./RoleConfigView";
import { UserManager } from "./UserManager";
import {
  campaignManagerRoleName,
  userManagerRoleName,
} from "@pslifestyle/common/src/models/user";
import * as Accordion from "@radix-ui/react-accordion";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ManagementPanelPage = (): JSX.Element => {
  const user = useSelector(authedSessionSelectors.user);
  const { t } = useTranslation(["management"]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.roles.length) navigate("/");
  }, [navigate, user]);

  if (!user) {
    return <div>You have no access here.</div>;
  }

  return (
    <FullWidthContainer className="py-4">
      <div className="h-full mb-8">
        <Heading level={1} type="headline-lg-eb">
          {t("managementPanel", { ns: "common" })}
        </Heading>
      </div>
      <Accordion.Root type="single" defaultValue="roleDisplay" collapsible>
        <Accordion.Item value="roleDisplay">
          <AccordionTrigger className="bg-green-80">
            See own roles
          </AccordionTrigger>
          <Accordion.Content className="p-2 border-green-100">
            <RoleConfigView user={user} />
          </Accordion.Content>
        </Accordion.Item>
        {assertRole(user, campaignManagerRoleName) && (
          <Accordion.Item value="customLink">
            <AccordionTrigger className="bg-green-80">
              {t("campaignManager.title")}
            </AccordionTrigger>
            <Accordion.Content className="p-2 border-green-100">
              <CampaignLinkManager user={user} />
            </Accordion.Content>
          </Accordion.Item>
        )}
        {assertRole(user, userManagerRoleName) && (
          <Accordion.Item value="userManagement">
            <AccordionTrigger className="bg-green-80">
              {t("userManager.title")}
            </AccordionTrigger>
            <Accordion.Content className="p-2 border-green-100">
              <UserManager />
            </Accordion.Content>
          </Accordion.Item>
        )}
      </Accordion.Root>
    </FullWidthContainer>
  );
};

export default ManagementPanelPage;
