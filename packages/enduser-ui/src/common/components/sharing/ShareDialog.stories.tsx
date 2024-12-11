import ShareDialog from "./ShareDialog";
import type { Meta, StoryFn } from "@storybook/react";

/**
 * Share results dialog.
 */
const meta: Meta<typeof ShareDialog> = {
  title: "Sharing/ShareDialog",
  component: ShareDialog,
};

export default meta;

const props = {
  title: "Title",
  description: "Description",
  successfulShareMessage: "Success",
  sharedFilePrefix: "sharedFilePrefix",
  cypressPrefix: "cypressPrefix",
  elementRef: null,
};

export const Default: StoryFn = (args) => (
  <ShareDialog shareTriggerButtonText="Share" {...props} {...args} />
);
