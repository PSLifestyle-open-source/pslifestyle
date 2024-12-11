import { NarrowWidthContainer } from "../../common/components/layout/Container";
import Heading from "../../common/components/ui/Heading";
import { ButtonLarge } from "../../common/components/ui/buttons";
import { getCountryObjectByCode } from "@pslifestyle/common/src/models/countries";
import {
  CampaignManagerRole,
  campaignManagerRoleName,
  User,
} from "@pslifestyle/common/src/models/user";
import { NewCampaign } from "@pslifestyle/common/src/types/api/payloadTypes";
import { CampaignRedirectDestination } from "@pslifestyle/common/src/types/api/responseTypes";
import * as Form from "@radix-ui/react-form";
import React, { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
  user: User;
  onCreate: (campaign: NewCampaign) => Promise<void>;
}

export const NewCampaignLinkForm = ({
  user,
  onCreate,
}: IProps): JSX.Element | null => {
  const [campaignName, setCampaignName] = useState("");
  const [allowedCountries, setAllowedCountries] = useState<string[]>([]);
  const [redirectDestination, setRedirectDestination] =
    useState<CampaignRedirectDestination>("homepage");
  const { t } = useTranslation(["management"]);

  const campaignManagerOptions: { countries: string[] } | undefined = (
    user?.roles.find((role) => role.name === campaignManagerRoleName) as
      | CampaignManagerRole
      | undefined
  )?.options as { countries: string[] } | undefined;

  if (!campaignManagerOptions) {
    return null;
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onCreate({
      name: campaignName,
      allowedCountries,
      redirectDestination,
    });

    return false;
  };

  return (
    <NarrowWidthContainer>
      <Heading level={2} type="headline-md-b" className="mb-2">
        {t("campaignManager.createTitle")}
      </Heading>
      <Form.Root onSubmit={onSubmit}>
        <Form.Field className="mb-3" name="campaignName">
          <Form.Label>{t("campaignManager.campaignNameLabel")}</Form.Label>
          <Form.Control asChild>
            <input
              className="p-1 my-1 border border-neutral-10 rounded shadow focus:outline-none w-full"
              type="text"
              required
              value={campaignName}
              onChange={(event) => setCampaignName(event.target.value)}
            />
          </Form.Control>
          <Form.Message className="text-red-80" match="valueMissing">
            Please enter a question
          </Form.Message>
        </Form.Field>
        <Form.Field className="mb-3" name="allowedCountries">
          <Form.Label>{t("campaignManager.allowedCountriesLabel")}</Form.Label>
          <Form.Control
            asChild
            className="p-1 my-1 border border-neutral-10 rounded shadow focus:outline-none w-full"
          >
            <select
              multiple
              required
              onChange={(event) => {
                const value: string[] = [];
                const optionsLength = event.target.options.length;
                for (let i = 0; i < optionsLength; i += 1) {
                  const option = event.target.options.item(i);
                  if (option && option.selected) {
                    value.push(option.value);
                  }
                }
                setAllowedCountries(value);
              }}
            >
              {campaignManagerOptions.countries.map((countryCode) => (
                <option value={countryCode} key={countryCode} className="p-2">
                  {getCountryObjectByCode(countryCode)?.name ||
                    "Missing country name"}
                </option>
              ))}
            </select>
          </Form.Control>
          <Form.Message className="text-red-80" match="valueMissing">
            Please enter a question
          </Form.Message>
        </Form.Field>
        <Form.Field className="mb-3" name="redirectDestination">
          <Form.Label>
            {t("campaignManager.redirectDestinationLabel")}
          </Form.Label>
          <Form.Control
            asChild
            className="p-1 my-1 border border-neutral-10 rounded shadow focus:outline-none w-full"
          >
            <select
              required
              onChange={(event) => {
                setRedirectDestination(
                  event.target.value as CampaignRedirectDestination,
                );
              }}
            >
              <option value="homepage" className="p-2">
                {t("campaignManager.redirectDestination.homepage")}
              </option>
              <option value="test" className="p-2">
                {t("campaignManager.redirectDestination.testPage")}
              </option>
            </select>
          </Form.Control>
          <Form.Message className="text-red-80" match="valueMissing">
            Please enter a question
          </Form.Message>
        </Form.Field>
        <Form.Submit asChild>
          <ButtonLarge type="submit">
            {t("campaignManager.submitNewCampaign")}
          </ButtonLarge>
        </Form.Submit>
      </Form.Root>
    </NarrowWidthContainer>
  );
};
