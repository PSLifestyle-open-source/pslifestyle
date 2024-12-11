import {
  QuestionnaireButton,
  QuestionnaireButtonProps,
} from "./QuestionnaireButton";

const PinkButton: React.FC<QuestionnaireButtonProps> = ({
  active,
  ...props
}) => (
  <QuestionnaireButton
    className={`
      border-pink-40
      hover:bg-pink-40
      hover:border-pink-60
      active:bg-pink-80
      active:border-pink-100
      ${active ? "bg-pink-80 border-pink-100" : "bg-neutral-white"}
      `}
    active={active}
    {...props}
  />
);

export default PinkButton;
