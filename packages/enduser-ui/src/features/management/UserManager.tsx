import Heading from "../../common/components/ui/Heading";
import { fetchUserSettings } from "../../firebase/api/fetchUserSettings";
import { FunctionsErrorCodes } from "../auth/constants";
import { EditUserSettingsForm } from "./UserManager/EditUserSettingsForm";
import { SearchForUser } from "./UserManager/SearchForUser";
import { UserSettings } from "@pslifestyle/common/src/models/user";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export const UserManager = () => {
  const { t } = useTranslation("management");
  const [targetUserEmail, setTargetUserEmail] = useState("");
  const [foundUserSettings, setFoundUserSettings] =
    useState<UserSettings | null>(null);
  const [searchResponseStatusCode, setSearchResponseStatusCode] =
    useState<number>(200);
  const onSearchSubmit = async (
    event: React.FormEvent<HTMLFormElement>, // Update the type to React.FormEvent<HTMLFormElement>
    searchedEmail: string,
  ) => {
    setSearchResponseStatusCode(200);
    event.preventDefault();
    try {
      const foundUserSettingsResponse = await fetchUserSettings(searchedEmail);

      setTargetUserEmail(searchedEmail);
      setFoundUserSettings(foundUserSettingsResponse.data);
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === FunctionsErrorCodes.NOT_FOUND
      ) {
        setSearchResponseStatusCode(404);
      } else {
        setSearchResponseStatusCode(500);
      }
      setTargetUserEmail("");
      setFoundUserSettings(null);
    }
  };

  return (
    <>
      <div className="mb-4">
        <SearchForUser onSearchSubmit={onSearchSubmit} />
      </div>
      {foundUserSettings && (
        <EditUserSettingsForm
          targetUserEmail={targetUserEmail}
          userSettings={foundUserSettings}
          setUserSettings={setFoundUserSettings}
        />
      )}
      <div className="text-center">
        {searchResponseStatusCode === 404 && (
          <Heading level={2} type="headline-md-b" className="text-red-100">
            {t("userManager.userNotFoundErrorSearchForUser")}
          </Heading>
        )}
        {searchResponseStatusCode === 500 && (
          <Heading level={2} type="headline-md-b" className="text-red-100">
            {t("userManager.genericErrorSearchForUser")}
          </Heading>
        )}
      </div>
    </>
  );
};
