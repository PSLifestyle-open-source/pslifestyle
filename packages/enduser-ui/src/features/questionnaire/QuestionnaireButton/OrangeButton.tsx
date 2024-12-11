import {
  QuestionnaireButton,
  QuestionnaireButtonProps,
} from "./QuestionnaireButton";

const OrangeButton: React.FC<QuestionnaireButtonProps> = ({
  active,
  ...props
}) => (
  <QuestionnaireButton
    className={`
      border-orange-40
      hover:bg-orange-40
      hover:border-orange-60
      active:bg-orange-80
      active:border-orange-100
      ${active ? "bg-orange-80 border-orange-100" : "bg-neutral-white"}
      `}
    active={active}
    {...props}
  />
);

export default OrangeButton;
