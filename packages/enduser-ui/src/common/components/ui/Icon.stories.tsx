import { Icon } from "./Icon";
import type { Meta, StoryFn } from "@storybook/react";

/**
 * Used to wrap Material Icons.
 */
const meta: Meta<typeof Icon> = {
  title: "Icon",
  component: Icon,
};

export default meta;

/**
 * Medium size icon.
 */
export const Medium: StoryFn = (args) => (
  <Icon size="medium" type="Smile" {...args} />
);

/**
 * XXL icon.
 */
export const XXL: StoryFn = (args) => (
  <Icon size="extraextralarge" type="Smile" {...args} />
);
