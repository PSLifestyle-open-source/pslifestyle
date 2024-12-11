import { Button } from "../../../common/components/ui/buttons/Button";
import React from "react";

export interface QuestionnaireButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  choiceId: string;
  className?: string;
  // eslint-disable-next-line react/no-unused-prop-types
  active: boolean;
  children: React.ReactNode;
}

export const QuestionnaireButton: React.FC<QuestionnaireButtonProps> = ({
  children,
  choiceId,
  className = "",
  onClick,
}) => (
  <Button
    cyData={`choice.choiceText.${choiceId}`}
    onClick={onClick}
    className={`
      container
      inline-flex
      justify-center
      items-center
      w-full
      py-3
      px-6
      rounded
      border-2
      leading-5
      text-body-md
      ${className}
      `}
    type="button"
  >
    {children}
  </Button>
);
