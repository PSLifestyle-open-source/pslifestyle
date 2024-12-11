/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */

const DefaultTheme = require("tailwindcss/defaultTheme");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { default: plugin } = require("tailwindcss/plugin");

const colors = {
  yellow: {
    100: "#F0E047",
    80: "#F3E66C",
    60: "#F6EC91",
    40: "#F9F3B5",
    dark: "#474106",
  },
  orange: {
    100: "#F39200",
    80: "#F5A833",
    60: "#F8BE66",
    40: "#FAD399",
    dark: "#663D00",
  },
  green: {
    160: "#0E4C29",
    140: "#187340",
    120: "#249053",
    100: "#2FAC66",
    80: "#59BD85",
    60: "#82CDA3",
    40: "#AEE2C5",
    30: "#C1EED5",
    20: "#D1FCE4",
    10: "#E4FAED",
    dark: "#165030",
  },
  neutral: {
    100: "#000000",
    80: "#333333",
    60: "#666666",
    40: "#999999",
    20: "#CCCCCC",
    10: "#E6E6E6",
    5: "#F2F2F2",
    2: "#FAFAFA",
    white: "#FFFFFF",
  },
  red: {
    100: "#A70000",
    80: "#B93333",
    60: "#CA6666",
    40: "#DC9999",
    dark: "#620000",
  },
  pink: {
    100: "#DE768A",
    80: "#E591A1",
    60: "#EBADB9",
    40: "#F2C8D0",
    dark: "#5C0A1A",
  },
  purple: {
    100: "#AB87FF",
    80: "#BC9FFF",
    60: "#CDB7FF",
    40: "#DDCFFF",
    dark: "#301A63",
  },
  cyan: {
    100: "#36A9E1",
    80: "#5EBAE7",
    60: "#86CBED",
    40: "#AFDDF3",
    dark: "#08425E",
  },
  grey: {
    80: "#212B30",
    60: "#61686B",
    40: "#979FA3",
    20: "#C9CFD2",
    10: "#E4E7E9",
  },
  transparent: {
    DEFAULT: "rgba(1,1,1,0)",
    black: "#0000001A",
  },
  basic: {
    white: "#FFFFFF",
    black: "#000000",
    background: "#F2F5F6",
  },
};

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    {
      pattern: /bg-(yellow|orange|green|purple|pink|cyan|red)-(100|80|60|40)/,
      variants: ["before"],
    },
    {
      pattern: /text-(yellow|orange|green|purple|pink|cyan|red)-100/,
    },
    {
      pattern: /rounded-(tl|tr|bl|br)-full/,
    },
  ],
  theme: {
    fontWeight: {
      normal: 400,
      semibold: 600,
      bold: 700,
      black: 900,
    },
    fontFamily: {
      standard: ["Poppins", "Roboto"],
    },
    fontSize: {
      "body-xl": "1.5rem",
      "body-lg": "1rem",
      "body-md": "0.875rem",
      "body-sm": "0.75rem",
      "body-crowd": "0.9375rem",
      "heading-crowd": "1.125rem",
      "heading-xs": "1.25rem",
      "heading-sm": "1.5rem",
      "heading-md": "1.75rem",
      "heading-lg": "2rem",
      "heading-xl": "3rem",
      "button-md": "1rem",
      "button-sm": "0.75rem",
      "icon-md": "1.5rem",
      "icon-sm": "1rem",
      "icon-lg": "2rem",
      "icon-xl": "3.5rem",
      "icon-2xl": "7rem",
    },
    colors,
    screens: {
      xs: "355px",
      ...DefaultTheme.screens,
      veryshort: { raw: "(max-height: 350px)" },
      short: { raw: "(max-height: 750px)" },
    },
    extend: {
      backgroundImage: {
        windmillPattern: "url('/images/icons/windmill-background.svg')",
      },
      lineHeight: {
        crowd: "1.125rem",
      },
      variables: {
        DEFAULT: {
          colors,
        },
      },
      maxWidth: {
        "2/3": "66.6%",
      },
      transitionProperty: {
        "max-height": "max-height",
      },
      boxShadow: {
        hamburgerMenu: "0px 4px 16px 0px #0000001A",
        "control-top": "0px 4px 8px 0px #0000000D",
        regular: "0px 4px 8px 0px rgba(0, 111, 165, 0.04)",
        accordion: "0px 4px 12px 0px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [
    require("@mertasan/tailwindcss-variables"),
    ({ addVariant }) => {
      addVariant("child", "& > *");
    },
  ],
};
