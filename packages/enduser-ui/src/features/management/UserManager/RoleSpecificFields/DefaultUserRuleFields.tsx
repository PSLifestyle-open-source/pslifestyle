import { ButtonLarge } from "../../../../common/components/ui/buttons";
import * as Form from "@radix-ui/react-form";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export const DefaultUserRuleFields = ({
  roleName,
  children,
  onRoleDeleted,
}: {
  roleName: string;
  children?: ReactNode;
  onRoleDeleted: (roleName: string) => void;
}) => {
  const { t } = useTranslation(["management"]);
  return (
    <>
      <Form.Field className="mb-3" name="campaignName">
        <Form.Label>{t("userManager.roleNameLabel")}</Form.Label>
        <Form.Control asChild>
          <input
            className="p-1 my-1 border border-neutral-10 rounded shadow focus:outline-none w-full"
            type="text"
            disabled
            value={roleName}
          />
        </Form.Control>
        <Form.Message className="text-red-80" match="valueMissing">
          Please enter a question
        </Form.Message>
      </Form.Field>
      {children}
      <div className="w-full text-right mt-4">
        <ButtonLarge theme="secondary" onClick={() => onRoleDeleted(roleName)}>
          {t("userManager.deleteRole")}
        </ButtonLarge>
      </div>
    </>
  );
};
