import { colors } from "./helpers";

/*
Chart components from Nivo library accept colors only as strings.
Since we can't use Tailwind classes directly, we dig up the codes of the colors from the Tailwind-created CSS.
*/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getCategoryColorCode = (category: string, documentStyle: any) =>
  documentStyle.getPropertyValue(`--colors-${colors[category]}-80`);
