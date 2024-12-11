import { ReactNode } from "react";

const ActionCardExtraActivityContainer = ({
  children,
  displaySingleActivity,
}: {
  children: ReactNode;
  displaySingleActivity: boolean;
}) => (
  <div
    className={`${displaySingleActivity ? "mt-2.5 mb-5" : "flex flex-row gap-2.5 my-5"} px-5 w-full`}
  >
    {children}
  </div>
);

export default ActionCardExtraActivityContainer;
