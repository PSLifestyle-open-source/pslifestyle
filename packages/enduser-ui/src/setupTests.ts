// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/vitest";
import { TextEncoder, TextDecoder } from "util";
import { vi } from "vitest";

Object.assign(global, { TextDecoder, TextEncoder });

vi.mock("react-i18next", () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string): string => str,
    i18n: {
      language: "fi",
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  Trans: () => null,
  initReactI18next: {
    type: "3rdParty",
    init: vi.fn(),
  },
}));
