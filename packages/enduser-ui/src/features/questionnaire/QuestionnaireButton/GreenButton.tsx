import {
  QuestionnaireButton,
  QuestionnaireButtonProps,
} from "./QuestionnaireButton";

const GreenButton: React.FC<QuestionnaireButtonProps> = ({
  active,
  ...props
}) => (
  <QuestionnaireButton
    className={`
      border-green-40
      hover:bg-green-40
      hover:border-green-60
      active:bg-green-80
      active:border-green-100
      ${active ? "bg-green-80 border-green-100" : "bg-neutral-white"}
      `}
    active={active}
    {...props}
  />
);

export default GreenButton;
