import { FullWidthContainer } from "../../common/components/layout/Container";
import Heading from "../../common/components/ui/Heading";
import Paragraph from "../../common/components/ui/Paragraph";
import DeleteUserModal from "./DeleteUserModal";
import { authedSessionSelectors } from "./authedSessionSlice";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export const AccountManagementPage = (): JSX.Element => {
  const user = useSelector(authedSessionSelectors.user);
  const { t } = useTranslation();

  if (!user) {
    return <div>You have no access here.</div>;
  }

  return (
    <FullWidthContainer className="py-4">
      <div className="h-full mb-10">
        <Heading level={1} type="headline-lg-eb" className="mb-2">
          {t("accountManagement", { ns: "common" })}
        </Heading>
        <Paragraph type="body-lg">Your email address: {user!.email}</Paragraph>
        <DeleteUserModal />
      </div>
    </FullWidthContainer>
  );
};
