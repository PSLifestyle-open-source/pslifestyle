import { useAppDispatch } from "../../../../app/store";
import { commonActions } from "../../../store/actions";
import { IMenuItemRendererProps } from "./types";
import { useCallback } from "react";
import { Link } from "react-router-dom";

const LogOutMenuItem = ({
  onClick,
  to,
  linkText,
  className,
  role,
  tabIndex,
}: IMenuItemRendererProps) => {
  const dispatch = useAppDispatch();
  const click = useCallback(() => {
    if (onClick) {
      onClick();
    }
    dispatch(commonActions.fullyLogoutUser());
  }, [dispatch, onClick]);
  return (
    <Link to={to} onClick={click} role={role} tabIndex={tabIndex}>
      <div
        data-cy="menuLinks"
        className={`${className} flex items-center border-b md:border-0 border-transparent-black h-12 hover:bg-neutral-20 md:px-4`}
      >
        {linkText}
      </div>
    </Link>
  );
};

export default LogOutMenuItem;
