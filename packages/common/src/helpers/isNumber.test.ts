import isNumber from "./isNumber";

describe("Utils: isNumber", () => {
  it("handles empty string", () => {
    expect(isNumber("")).toBe(false);
  });
  it("handles null", () => {
    expect(isNumber(null as unknown as number)).toBe(false);
  });
  it("handles string null", () => {
    expect(isNumber("null" as unknown as number)).toBe(false);
  });
  it("handles undefined", () => {
    expect(isNumber(undefined as unknown as number)).toBe(false);
  });
  it("handles string undefined", () => {
    expect(isNumber("undefined")).toBe(false);
  });
  it("handles NaN", () => {
    expect(isNumber(NaN)).toBe(false);
  });
  it("handles string NaN", () => {
    expect(isNumber("NaN")).toBe(false);
  });
  it("handles periods", () => {
    expect(isNumber("33.2")).toBe(true);
  });
  it("handles number", () => {
    expect(isNumber(3.4)).toBe(true);
  });
});
