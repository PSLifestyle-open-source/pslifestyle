import { FullWidthContainer } from "../../common/components/layout/Container";
import { ButtonLarge } from "../../common/components/ui/buttons";
import { VerticalButtonsContainer } from "../../common/components/ui/buttons/VerticalButtonsContainer";
import { constants } from "./constants";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  onSubmitEmail: (email: string) => unknown;
}

const LoginFromOtherDeviceView = ({ onSubmitEmail }: Props) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleEmailSubmit = (
    event: React.FormEvent<HTMLFormElement>, // Update the type to React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    onSubmitEmail(email);
  };

  return (
    <FullWidthContainer className="py-4" data-cy="loginFromOtherDevice">
      <p>{t("differentDevice", { ns: "authentication" })}</p>

      <form
        onSubmit={handleEmailSubmit}
        className="flex flex-col justify-center"
      >
        <input
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          className="p-2 my-5 border border-neutral-10 rounded shadow focus:outline-none w-full"
          type="email"
          id="email"
          name="email"
          placeholder="Email@address.com"
          value={email}
          onChange={(event) => handleEmailChange(event)}
        />
        <VerticalButtonsContainer className="mt-4">
          <ButtonLarge
            type="submit"
            disabled={!constants.test(email.toLowerCase())}
            className="justify-center"
          >
            {t("sendLink", { ns: "authentication" })}
          </ButtonLarge>
        </VerticalButtonsContainer>
      </form>
    </FullWidthContainer>
  );
};

export default LoginFromOtherDeviceView;
