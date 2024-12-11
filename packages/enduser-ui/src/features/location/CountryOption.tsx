import { components, OptionProps, SingleValueProps } from "react-select";

export interface CountryOptionType {
  label: string;
  value: string;
}

const Row = ({ label, value }: CountryOptionType) => (
  <span className="flex items-center">
    <img className="w-6" alt="" src={`/images/flags/${value}-flag.svg`} />
    <span className="ml-0.5">{label}</span>
  </span>
);

// The component that displays the selected value in the input for a single select.
const CountrySingleValue = (
  singleValueProps: SingleValueProps<CountryOptionType>,
) => {
  const {
    data: { label, value },
  } = singleValueProps;

  return (
    <components.SingleValue {...singleValueProps}>
      <Row label={label} value={value} />
    </components.SingleValue>
  );
};

// Component responsible for displaying an option in the menu.
const CountryOption = (optionProps: OptionProps<CountryOptionType>) => {
  const {
    data: { label, value },
  } = optionProps;

  return (
    <components.Option {...optionProps}>
      <Row label={label} value={value} />
    </components.Option>
  );
};

export { CountryOption, CountrySingleValue };
