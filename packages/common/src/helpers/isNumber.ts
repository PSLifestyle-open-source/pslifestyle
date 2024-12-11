const isNumber = (value: number | string): boolean =>
  /^-?[0-9]+(?:\.[0-9]+)?$/.test(value?.toString());

export default isNumber;
