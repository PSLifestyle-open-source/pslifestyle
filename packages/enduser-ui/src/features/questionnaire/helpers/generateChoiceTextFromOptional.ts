export const generateChoiceTextFromOptional = (value: number) => {
  switch (true) {
    case value < 18:
      return "Under 18";
    case value <= 30:
      return "18-30";
    case value <= 50:
      return "31-50";
    case value > 50:
      return "Over 50";
    default:
      return value.toString();
  }
};
