import { Icon } from "../../common/components/ui/Icon";
import { ButtonLarge } from "../../common/components/ui/buttons";
import FullPageDialogPortal from "../../common/components/ui/dialogs/FullPageDialogPortal";
import { parseLanguageCode } from "../../i18n/utils";
import CountryLanguageSelection from "./CountryAndLanguageSelection";
import { locationSelectors } from "./locationSlice";
import { languagesConfig } from "@pslifestyle/common/src/models/languages";
import * as Dialog from "@radix-ui/react-dialog";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

interface IProps {
  onTrigger?: () => void;
  customTriggerButtonClassName?: string;
  tabIndex?: number;
}

const CountryAndLanguageSelectionDialog = ({
  onTrigger,
  customTriggerButtonClassName,
  tabIndex,
}: IProps): JSX.Element | null => {
  const { t } = useTranslation(["common", "frontpage", "accessibility"]);
  const country = useSelector(locationSelectors.country);
  const language = useSelector(locationSelectors.language);

  const currentLangName = useMemo(() => {
    const { languageCode } = parseLanguageCode(language);
    if (languagesConfig[languageCode]) {
      return languagesConfig[languageCode].nativeName;
    }
    return "English";
  }, [language]);

  const triggerButtonClassNames =
    customTriggerButtonClassName ||
    "w-full h-full hover:bg-neutral-20 title-md px-3";

  if (!country) {
    return null;
  }

  return (
    <Dialog.Root modal={false}>
      <Dialog.Trigger asChild onClick={onTrigger}>
        <button
          data-cy="country-language-select-button"
          type="button"
          role="menuitem"
          className={triggerButtonClassNames}
          aria-label={t("countryLanguageSelectorAriaLabel", {
            country: country.name,
            language: currentLangName,
          })}
          tabIndex={tabIndex}
        >
          <Icon
            size="medium"
            type="Globe"
            className="align-middle mr-1 inline"
          />
          <span>
            {country.code
              ? `${country.code} / ${currentLangName}`
              : currentLangName}
          </span>
        </button>
      </Dialog.Trigger>
      <FullPageDialogPortal>
        <CountryLanguageSelection
          title={t("countryAndLangChoice", { ns: "common" })}
        />
        <div
          data-testid="continue-btn-div"
          className="flex justify-center py-2"
        >
          <Dialog.Close className="mb-2" asChild>
            <ButtonLarge theme="primary">{t("close")}</ButtonLarge>
          </Dialog.Close>
        </div>
      </FullPageDialogPortal>
    </Dialog.Root>
  );
};

export default CountryAndLanguageSelectionDialog;
