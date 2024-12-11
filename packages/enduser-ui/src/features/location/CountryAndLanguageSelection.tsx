import Heading from "../../common/components/ui/Heading";
import CountrySelection from "./CountrySelection";
import { LanguageSelection } from "./LanguageSelection";
import { locationSelectors } from "./locationSlice";
import { countries } from "@pslifestyle/common/src/models/countries";
import { useSelector } from "react-redux";

interface IProps {
  title: string;
}

const CountryLanguageSelection = ({ title }: IProps): JSX.Element => {
  const country = useSelector(locationSelectors.country);

  return (
    <>
      <Heading level={1} type="headline-lg-eb" data-testid="text-header">
        {title}
      </Heading>
      <div data-testid="first-col" className="flex flex-col gap-0.5">
        <CountrySelection countries={countries} />
      </div>
      {country && (
        <div className="flex flex-col gap-0.5">
          <LanguageSelection />
        </div>
      )}
    </>
  );
};

export default CountryLanguageSelection;
