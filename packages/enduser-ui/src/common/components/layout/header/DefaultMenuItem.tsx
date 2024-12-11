import { IMenuItemRendererProps } from "./types";
import { Link } from "react-router-dom";

const DefaultMenuItem = ({
  to,
  onClick,
  linkText,
  className,
  role,
  tabIndex,
  enabled,
}: IMenuItemRendererProps) => (
  <Link
    aria-disabled={!enabled}
    to={to}
    onClick={
      enabled
        ? onClick
        : (e) => {
            e.preventDefault();
          }
    }
    className={`${enabled ? "font-bold" : "text-neutral-40"}`}
    role={role}
    tabIndex={tabIndex}
  >
    <div
      data-cy="menuLinks"
      className={`${className || ""} flex items-center border-b md:border-0 border-transparent-black h-12 hover:bg-neutral-20 md:px-4 py-6`}
    >
      {linkText}
    </div>
  </Link>
);

export default DefaultMenuItem;
