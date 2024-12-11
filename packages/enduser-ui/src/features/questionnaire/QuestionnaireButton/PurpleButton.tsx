import {
  QuestionnaireButton,
  QuestionnaireButtonProps,
} from "./QuestionnaireButton";

const PurpleButton: React.FC<QuestionnaireButtonProps> = ({
  active,
  ...props
}) => (
  <QuestionnaireButton
    className={`
      border-purple-40
      hover:bg-purple-40
      hover:border-purple-60
      active:bg-purple-80
      active:border-purple-100 
      ${active ? "bg-purple-60 border-purple-80" : "bg-neutral-white"}
      `}
    active={active}
    {...props}
  />
);

export default PurpleButton;
