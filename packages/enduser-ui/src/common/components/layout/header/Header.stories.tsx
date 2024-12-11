import { store } from "../../../../app/store";
import { Header } from "./Header";
import HeaderMenu from "./HeaderMenu";
import type { Meta } from "@storybook/react";
import { Provider } from "react-redux";

const meta: Meta<typeof Header> = {
  title: "Header",
  component: Header,
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
};

export default meta;

/**
 * Header without children.
 */
export const Default = () => <Header />;

/**
 * Header with menu.
 */
export const WithMenu = () => (
  <Header>
    <HeaderMenu />
  </Header>
);
