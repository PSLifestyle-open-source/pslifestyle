import { FullWidthContainer } from "../../common/components/layout/Container";
import Heading from "../../common/components/ui/Heading";
import Paragraph from "../../common/components/ui/Paragraph";
import ButtonLarge from "../../common/components/ui/buttons/ButtonLarge";
import { VerticalButtonsContainer } from "../../common/components/ui/buttons/VerticalButtonsContainer";
import { constants } from "./constants";
import { ChangeEvent } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface IProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: (email: string) => void;
}

const LoginFormView = ({ onSubmit, email, setEmail }: IProps) => {
  const { t } = useTranslation();

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const findUserSendLink = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    onSubmit(email);
  };

  return (
    <FullWidthContainer
      className="py-8"
      data-testid="loginForm.mainContainer"
      data-cy="loginForm"
    >
      <Heading level={1} type="headline-md-b">
        {t("enterEmail", { ns: "authentication" })}
      </Heading>

      <form
        onSubmit={findUserSendLink}
        className="flex flex-col justify-center"
      >
        <input
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          className="p-4 my-8 border border-neutral-10 rounded shadow focus:outline-none w-full"
          type="email"
          id="email"
          name="email"
          placeholder="Email@address.com"
          value={email}
          onChange={(event) => handleEmailChange(event)}
        />
        <VerticalButtonsContainer>
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

export default LoginFormView;
