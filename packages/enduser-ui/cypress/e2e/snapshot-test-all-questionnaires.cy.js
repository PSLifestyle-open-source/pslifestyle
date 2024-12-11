import { countries } from "../../src/common/utils/CountriesAndCategories/countries";
import { default as allPathsToTest } from "../support/paths-to-test.json";

const countryCodeToRun = Cypress.env("COUNTRY");
const country = countries.find(
  (processedCountry) => processedCountry.code === countryCodeToRun,
);
const selectCountry = (countryLabel) => {
  cy.log(`Selecting country ${countryLabel}`);
  cy.get("#root")
    .contains("Where do you live?")
    .parent()
    .children("div")
    .first()
    .click();
  cy.get("#root")
    .contains("Where do you live?")
    .parent()
    .contains(new RegExp("^" + countryLabel + "$", "g"))
    .click({ force: true });
};

const selectLanguage = (languageLabel) => {
  cy.log(`Selecting language ${languageLabel}`);
  cy.get("#root")
    .contains("Language?")
    .parent()
    .children("div")
    .first()
    .click();
  cy.get("#root")
    .contains("Language?")
    .parent()
    .contains(new RegExp("^" + languageLabel + "$", "g"))
    .click({ force: true });
};

const clickChoice = (choiceLabel) => {
  cy.get(`[data-cy="choice.choiceText.${choiceLabel}"]`).click();
};

const clickContinueToNextQuestionCategory = () => {
  cy.get('[data-cy="enterNextCategory.button"]').click();
};

const clickToGoToResults = () => {
  cy.get('[data-cy="introToDemographic.goToResults.button"]').click();
  cy.get('[data-cy="outroOfQuestionnaire.continue.button"]').click();
};

const approveCountryAndLanguage = () => {
  cy.get("#root").get("div > div > a > span").click();
  cy.get("#gtm-take-test").click();
};

const snapshotUserResult = () => {
  cy.get('[data-cy="round(userFootprintByCategory.overall)"]')
    .first()
    .then(($element) => {
      cy.snapshot($element.text());
    });
};

const snapshotResultAgainstOthers = () => {
  cy.get('[data-cy="comparedToAllCountriesAverages"] text')
    .should("contain", "kg CO2")
    .then(($elements) => {
      const allResults = [];
      console.log("should maybe");
      Object.values($elements).forEach((element) => {
        allResults.push(element.textContent);
      });
      cy.snapshot(allResults.filter((result) => result));
    });
};

describe("Test whether all unique question paths are resolvable", () => {
  describe(`Full questionnaire test: test for country ${country.name}`, () => {
    beforeEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.window().then((win) => {
        win.sessionStorage.clear();
      });
      cy.wait(2000);
    });
    allPathsToTest.forEach((testPath, key) => {
      let previousQuestionType = "01";
      it(`Full questionnaire test: test for country ${country.name} and path key ${key}`, () => {
        cy.visit("/selections", { timeout: 30000 });
        selectCountry(country.name);
        selectLanguage("English");
        approveCountryAndLanguage();
        testPath.forEach((pathStep) => {
          const questionType = pathStep.questionKey.slice(0, 2);
          if (previousQuestionType !== questionType) {
            clickContinueToNextQuestionCategory();
            previousQuestionType = questionType;
          }
          clickChoice(pathStep.choice.choiceTranslationKey);
        });
        clickToGoToResults();
        snapshotUserResult();
        snapshotResultAgainstOthers();
      });
    });
  });
});
