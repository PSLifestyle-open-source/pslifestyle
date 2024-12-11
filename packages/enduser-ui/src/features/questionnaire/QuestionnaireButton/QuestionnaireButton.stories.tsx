import CyanButton from "./CyanButton";
import GreenButton from "./GreenButton";
import OrangeButton from "./OrangeButton";
import PinkButton from "./PinkButton";
import PurpleButton from "./PurpleButton";
import {
  QuestionnaireButton,
  QuestionnaireButtonProps,
} from "./QuestionnaireButton";
import type { Meta, StoryFn } from "@storybook/react";

/**
 * Button used in the questionnaire.
 * Similiar to our normal button, but with different enough styling
 * to warrant a separate component.
 *
 * The different colours map to different themes.
 *
 * - Orange for housing
 * - Purple for transport
 * - Pink for food
 * - Cyan for purchases
 * - Green for demographic
 */
const meta: Meta<typeof QuestionnaireButton> = {
  title: "Questionnaire/QuestionnaireButton",
  component: QuestionnaireButton,
};

export default meta;

const props: Omit<QuestionnaireButtonProps, "children"> = {
  active: true,
  onClick: () => null,
  choiceId: "null",
};

export const Default: StoryFn = (args) => (
  <QuestionnaireButton {...props} {...args}>
    Answer
  </QuestionnaireButton>
);
export const Orange: StoryFn = (args) => (
  <OrangeButton {...props} {...args}>
    Answer
  </OrangeButton>
);
export const Purple: StoryFn = (args) => (
  <PurpleButton {...props} {...args}>
    Answer
  </PurpleButton>
);
export const Pink: StoryFn = (args) => (
  <PinkButton {...props} {...args}>
    Answer
  </PinkButton>
);
export const Cyan: StoryFn = (args) => (
  <CyanButton {...props} {...args}>
    Answer
  </CyanButton>
);
export const Green: StoryFn = (args) => (
  <GreenButton {...props} {...args}>
    Answer
  </GreenButton>
);
export const Disabled: StoryFn = (args) => (
  <QuestionnaireButton {...props} {...args} active={false}>
    Answer
  </QuestionnaireButton>
);
