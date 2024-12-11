import { Loader } from "./Loader";
import type { Meta } from "@storybook/react";

const meta: Meta<typeof Loader> = {
  title: "Loader",
  component: Loader,
};

export default meta;

/**
 * Indicates loading status.
 */
export const Default = () => <Loader />;
