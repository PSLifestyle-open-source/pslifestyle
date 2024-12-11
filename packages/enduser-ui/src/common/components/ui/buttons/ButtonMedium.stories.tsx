import ButtonMedium from "./ButtonMedium";
import type { Meta, StoryFn } from "@storybook/react";

/**
 * Medium styled button used for PSLifestyle button needs. It comes in variety of variants with separate flags for primary and disabled toggles.
 */
const meta: Meta<typeof ButtonMedium> = {
  title: "Buttons/ButtonMedium",
  component: ButtonMedium,
};

export default meta;

export const Default: StoryFn = (args) => (
  <ButtonMedium {...args}>Button</ButtonMedium>
);
export const IconLeft: StoryFn = (args) => (
  <ButtonMedium icon={{ type: "CheckCircle", position: "left" }} {...args}>
    Button
  </ButtonMedium>
);
export const IconRight: StoryFn = (args) => (
  <ButtonMedium icon={{ type: "CheckCircle", position: "right" }} {...args}>
    Button
  </ButtonMedium>
);
