import { useAppDispatch } from "../../app/store";
import {
  questionnaireActions,
  questionnaireSelectors,
} from "../questionnaire/questionnaireSlice";
import ChangeCountryAlertDialog from "./ChangeCountryAlertDialog";
import {
  CountryOptionType,
  CountryOption as Option,
  CountrySingleValue as SingleValue,
} from "./CountryOption";
import { locationActions, locationSelectors } from "./locationSlice";
import { Country } from "@pslifestyle/common/src/models/countries";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

interface Props {
  countries: Country[];
}

const CountrySelection = ({ countries }: Props): JSX.Element => {
  const { t } = useTranslation(["frontpage"]);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>();
  const [countryChangeModalVisible, setCountryChangeModalVisible] =
    useState<boolean>(false);
  const dispatch = useAppDispatch();
  const answers = useSelector(questionnaireSelectors.answers);
  const { resetQuestionnaire } = questionnaireActions;
  const country = useSelector(locationSelectors.country);
  const allowedCountries = useSelector(locationSelectors.allowedCountries);
  const { setCountryCode } = locationActions;

  const countryOptions = countries.map((countryObj) => ({
    value: countryObj.code,
    label: countryObj.name,
  }));
  const filteredCountryOptions = allowedCountries.length
    ? countryOptions.filter((countryOption) =>
        allowedCountries.includes(countryOption.value),
      )
    : [];
  const navigate = useNavigate();

  const handleCountryChangeClearQuestionnaire = (countryCode: string) => {
    dispatch(resetQuestionnaire());
    dispatch(setCountryCode(countryCode));
    setCountryChangeModalVisible(false);
    navigate("/");
  };

  const checkForCountryAndAnswers = (
    selectedOption?: CountryOptionType,
  ): void => {
    const selectedCountryCode = selectedOption?.value;
    if (!selectedCountryCode) {
      return;
    }

    setSelectedCountryCode(selectedCountryCode);
    // If country is changed and there is an unfinished questionnaire, show confirmation modal
    if (answers.length && country && selectedOption?.value !== country.code) {
      setCountryChangeModalVisible(true);
    } else {
      dispatch(setCountryCode(selectedCountryCode));
    }
  };

  return (
    <div>
      <label
        data-testid="country-selection"
        className="title-md"
        htmlFor="countrySelector"
      >
        {t("countryChoice", { ns: "frontpage" })}
      </label>
      <Select
        id="countrySelector"
        aria-label={t("countryChoice", { ns: "frontpage" })}
        autoFocus
        maxMenuHeight={350}
        defaultValue={countryOptions.find((c) => c.value === country?.code)}
        value={countryOptions.find((c) => c.value === country?.code)}
        options={
          allowedCountries.length ? filteredCountryOptions : countryOptions
        }
        components={{ Option, SingleValue }}
        isSearchable={false}
        onChange={(evt) => checkForCountryAndAnswers(evt as CountryOptionType)}
      />
      <ChangeCountryAlertDialog
        open={countryChangeModalVisible}
        onConfirmButtonClick={() => {
          if (selectedCountryCode) {
            handleCountryChangeClearQuestionnaire(selectedCountryCode);
          }
        }}
        onCancelButtonClick={() => {
          setCountryChangeModalVisible(false);
        }}
      />
    </div>
  );
};

export default CountrySelection;
