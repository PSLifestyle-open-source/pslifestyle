import { MathScopes } from "../types/genericTypes";
import { compare } from "./securedMathjs";

const operatorMap: Record<string, number[]> = {
  "===": [0],
  "!==": [-1, 1],
  ">=": [0, 1],
  "<=": [-1, 0],
  ">": [1],
  "<": [-1],
};

export function evaluateFormula(
  mathScope: MathScopes,
  variableName: string,
  operator: string,
  value: string | number,
): boolean {
  // Compare two values. Returns 1 when x > y, -1 when x < y, and 0 when x == y.
  const comparison = compare(mathScope[variableName], value);
  return operatorMap[operator].includes(Number(comparison));
}
