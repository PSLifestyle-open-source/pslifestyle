import { ButtonLarge } from "../../../common/components/ui/buttons";
import * as Form from "@radix-ui/react-form";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export const SearchForUser = ({
  onSearchSubmit,
}: {
  onSearchSubmit: (
    event: React.FormEvent<HTMLFormElement>,
    searchedEmail: string,
  ) => void;
}) => {
  const { t } = useTranslation("management");
  const [searchedEmail, setSearchedEmail] = useState("");

  return (
    <Form.Root onSubmit={(event) => onSearchSubmit(event, searchedEmail)}>
      <Form.Field className="mb-3" name="targetUserEmail">
        <Form.Label>{t("userManager.targetUserEmailLabel")}</Form.Label>
        <Form.Control asChild>
          <input
            className="p-1 my-1 border border-neutral-10 rounded shadow focus:outline-none w-full"
            type="email"
            required
            value={searchedEmail}
            onChange={(event) => setSearchedEmail(event.target.value)}
          />
        </Form.Control>
        <Form.Message className="text-red-80" match="valueMissing">
          Please enter a question
        </Form.Message>
        <Form.Message className="FormMessage" match="typeMismatch">
          Please provide a valid email
        </Form.Message>
      </Form.Field>
      <Form.Submit asChild>
        <ButtonLarge type="submit">{t("userManager.searchButton")}</ButtonLarge>
      </Form.Submit>
    </Form.Root>
  );
};
