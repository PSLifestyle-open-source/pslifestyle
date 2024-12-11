import { useAppDispatch } from "../../app/store";
import { ContainerLoader } from "../../common/components/loaders/ContainerLoader";
import { resetEntityStores } from "../../common/store/actions";
import { isErrorWithMessage } from "../../common/utils/helpers";
import { checkLink } from "../../firebase/api/checkLink";
import LoginFromOtherDeviceErrorModal from "./LoginFromOtherDeviceErrorModal";
import LoginFromOtherDeviceView from "./LoginFromOtherDeviceView";
import {
  authedSessionActions,
  authedSessionSelectors,
} from "./authedSessionSlice";
import { User } from "@pslifestyle/common/src/models/user";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const CheckLoginPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const url = new URL(window.location.href);
  const magicLinkTokenFromLink = url.search.slice(url.search.indexOf("=") + 1);

  const user = useSelector(authedSessionSelectors.user);
  const magicLinkEmail = useSelector(authedSessionSelectors.magicLinkEmail);

  const [loading, setLoading] = useState<boolean>(false);
  const [errorOccurred, setErrorOccurred] = useState<boolean>(false);

  const handleEmailSubmit = async (submittedEmail: string) => {
    if (!magicLinkTokenFromLink) {
      navigate("/login");
    }

    if (!submittedEmail) {
      // If we have no email, we want user to type it
      setErrorOccurred(true);
      return;
    }

    if (user) {
      //  Do not try to authenticate if user is already authenticated, and or if magic link is missing
      return;
    }

    setLoading(true);
    try {
      const {
        data: { sessionToken, redirectDestination },
      } = await checkLink(submittedEmail, magicLinkTokenFromLink);

      if (sessionToken) {
        dispatch(resetEntityStores());
        const jwtData: { email: string; roles: User["roles"] } =
          jwtDecode(sessionToken);

        dispatch(
          authedSessionActions.setUserLoggedIn({
            email: jwtData.email,
            sessionToken,
            roles: jwtData.roles || [],
          }),
        );
        navigate(`/${redirectDestination}`);
      }
    } catch (err: unknown) {
      console.log(err);
      if (isErrorWithMessage(err)) {
        console.log("loginWithMagicLinkError", err.message);
        setErrorOccurred(true);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (magicLinkEmail) {
      handleEmailSubmit(magicLinkEmail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ContainerLoader loading={loading}>
      <LoginFromOtherDeviceErrorModal
        onClose={() => setErrorOccurred(false)}
        open={errorOccurred}
      />

      <div className="container mx-auto p-2 flex flex-col max-w-[800px]">
        <div className="flex justify-center">
          <LoginFromOtherDeviceView onSubmitEmail={handleEmailSubmit} />
        </div>
      </div>
    </ContainerLoader>
  );
};
