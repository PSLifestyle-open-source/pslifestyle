import { create, all } from "mathjs";

const math = create(all);

// White list
export const { evaluate, round, randomInt, compare } = math as Pick<
  math.MathJsStatic,
  "evaluate" | "round" | "randomInt" | "compare"
>;

if (math.import) {
  math.import(
    {
      import: () => {
        throw new Error("Function import is disabled");
      },
      createUnit: () => {
        throw new Error("Function createUnit is disabled");
      },
      reviver: () => {
        throw new Error("Function reviver is disabled");
      },
      evaluate: () => {
        throw new Error("Function evaluate is disabled");
      },
      parse: () => {
        throw new Error("Function parse is disabled");
      },
      simplify: () => {
        throw new Error("Function simplify is disabled");
      },
      derivative: () => {
        throw new Error("Function derivative is disabled");
      },
      resolve: () => {
        throw new Error("Function resolve is disabled");
      },
    },
    { override: true },
  );
}
