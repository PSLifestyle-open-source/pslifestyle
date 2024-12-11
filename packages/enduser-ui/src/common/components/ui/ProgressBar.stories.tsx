import { ProgressBar } from "./ProgressBar";
import type { Meta, StoryFn } from "@storybook/react";

const meta: Meta<typeof ProgressBar> = {
  title: "ProgressBar",
  component: ProgressBar,
};

export default meta;

/**
 * Progress bar.
 */
export const Default: StoryFn = (args) => (
  <div className="pb-10 h-20 w-100">
    <ProgressBar value={75} {...args} />
  </div>
);

export const Green: StoryFn = (args) => (
  <div className="pb-10 h-20 w-100">
    <ProgressBar
      baseColorClassName="bg-green-40"
      progressColorClassName="bg-green-100"
      value={3}
      max={4}
      {...args}
    />
  </div>
);

export const MinHeight: StoryFn = (args) => (
  <div className="pb-10">
    <ProgressBar
      baseColorClassName="bg-yellow-40"
      progressColorClassName="bg-yellow-100"
      value={75}
      {...args}
    />
  </div>
);
