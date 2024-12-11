import { ContainerLoader } from "../../common/components/loaders/ContainerLoader";
import { useRequestMagicLink } from "../../common/hooks/firebaseHooks";
import LoginFormView from "./LoginFormView";
import MagicLinkErrorModal from "./MagicLinkErrorModal";
import MagicLinkRequestedModal from "./MagicLinkRequestedModal";
import { authedSessionSelectors } from "./authedSessionSlice";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const LoginPage = (): JSX.Element => {
  const user = useSelector(authedSessionSelectors.user);
  const [email, setEmail] = useState<string>("");
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const {
    requestMagicLink,
    state: {
      success: isMagicLinkRequested,
      loading: isRequestingMagicLink,
      error: magicLinkError,
    },
  } = useRequestMagicLink();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/account");
  });

  return (
    <ContainerLoader loading={isRequestingMagicLink}>
      <LoginFormView
        onSubmit={(email: string) => {
          requestMagicLink(email);
          setFormSubmitted(true);
        }}
        email={email}
        setEmail={setEmail}
      />
      <MagicLinkErrorModal
        open={!!magicLinkError && formSubmitted}
        onClose={() => {
          setEmail("");
          setFormSubmitted(false);
        }}
      />
      <MagicLinkRequestedModal
        email={email}
        open={isMagicLinkRequested && !magicLinkError && formSubmitted}
        onClose={() => {
          setEmail("");
          setFormSubmitted(false);
        }}
      />
    </ContainerLoader>
  );
};
