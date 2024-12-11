import ButtonLarge from "./ButtonLarge";
import type { Meta, StoryFn } from "@storybook/react";

/**
 * Large styled button used for PSLifestyle button needs. It comes in variety of variants with separate flags for primary and disabled toggles.
 */
const meta: Meta<typeof ButtonLarge> = {
  title: "Buttons/ButtonLarge",
  component: ButtonLarge,
};

export default meta;

export const Default: StoryFn = (args) => (
  <ButtonLarge {...args}>Button</ButtonLarge>
);
export const IconLeft: StoryFn = (args) => (
  <ButtonLarge icon={{ type: "CheckCircle", position: "left" }} {...args}>
    Button
  </ButtonLarge>
);
export const IconRight: StoryFn = (args) => (
  <ButtonLarge icon={{ type: "CheckCircle", position: "right" }} {...args}>
    Button
  </ButtonLarge>
);
