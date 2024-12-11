import { authedSessionSelectors } from "./authedSessionSlice";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
}

export const RequireAuth = ({ children }: Props) => {
  const user = useSelector(authedSessionSelectors.user);

  if (!user) return <Navigate to="/login" />;

  return children;
};
