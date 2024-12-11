import { DefaultUserRuleFields } from "./DefaultUserRuleFields";
import { countries } from "@pslifestyle/common/src/models/countries";
import * as Form from "@radix-ui/react-form";
import React from "react";
import { useTranslation } from "react-i18next";

export const CampaignManagerRuleFields = ({
  roleName,
  options,
  onRoleUpdated,
  onRoleDeleted,
}: {
  roleName: string;
  options: Record<string, unknown>;
  onRoleUpdated: (roleName: string, options: Record<string, unknown>) => void;
  onRoleDeleted: (roleName: string) => void;
}) => {
  const { t } = useTranslation(["management"]);
  return (
    <DefaultUserRuleFields roleName={roleName} onRoleDeleted={onRoleDeleted}>
      <Form.Field className="mb-3" name={`${roleName}.options.countries`}>
        <Form.Label>
          {t("userManager.campaignManager.countriesLabel")}
        </Form.Label>
        <Form.Control
          asChild
          className="p-1 my-1 border border-neutral-10 rounded shadow focus:outline-none w-full"
        >
          <select
            required
            multiple
            onChange={(event) => {
              const value: string[] = [];
              const optionsLength = event.target.options.length;
              for (let i = 0; i < optionsLength; i += 1) {
                const option = event.target.options.item(i);
                if (option && option.selected) {
                  value.push(option.value);
                }
              }
              onRoleUpdated(roleName, {
                ...options,
                countries: value,
              });
            }}
          >
            {countries.map((country) => (
              <option
                value={country.code}
                key={country.code}
                className="p-2"
                selected={
                  "countries" in options && Array.isArray(options.countries)
                    ? options.countries.includes(country.code)
                    : false
                }
              >
                {country.name}
              </option>
            ))}
          </select>
        </Form.Control>
        <Form.Message className="text-red-80" match="valueMissing">
          Please enter a question
        </Form.Message>
      </Form.Field>
    </DefaultUserRuleFields>
  );
};
