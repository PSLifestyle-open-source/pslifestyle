import {
  QuestionnaireButton,
  QuestionnaireButtonProps,
} from "./QuestionnaireButton";

const CyanButton: React.FC<QuestionnaireButtonProps> = ({
  active,
  ...props
}) => (
  <QuestionnaireButton
    className={`
      border-cyan-40
      hover:bg-cyan-40
      hover:border-cyan-60
      active:bg-cyan-80
      active:border-cyan-100
      ${active ? "bg-cyan-80 border-cyan-100" : "bg-neutral-white"}
      `}
    active={active}
    {...props}
  />
);

export default CyanButton;
