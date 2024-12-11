import { NavigateFunction, NavigateOptions, To } from "react-router-dom";

Cypress.Commands.add(
  "routerNavigate",
  { prevSubject: false },
  (to: To, options?: NavigateOptions) =>
    cy
      .window()
      .its("cyNavigate")
      .then((navigate: NavigateFunction) => navigate(to, options)),
);

Cypress.Commands.add("selectCountryAndLanguage", () => {
  cy.visit("/selections");
  cy.get("#countrySelector").click();
  cy.get('[role="option"]').contains("Europe").click();
  cy.get("#languageSelector").click();
  cy.get('[role="option"]').contains("English").click();
  cy.data("continue-button").click();
  cy.location("pathname").should("eq", "/");
  cy.data("country-language-select-button").contains("English");
});

Cypress.Commands.add("data", (value) => cy.get(`[data-cy="${value}"]`));

Cypress.Commands.add(
  "setSliderValue",
  { prevSubject: "element" },
  (subject, value) => {
    const element = subject[0];

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )?.set;

    nativeInputValueSetter?.call(element, value);
    element.dispatchEvent(new Event("input", { bubbles: true }));
  },
);

Cypress.Commands.add("setState", (newState) => {
  cy.window()
    .its("store")
    .invoke("dispatch", { type: "resetStateForTesting", payload: newState });
});

Cypress.Commands.add(
  "answerQuestionnaire",
  ({ answers, demographics, totalFootprint }) => {
    cy.location("pathname").should("eq", "/");
    cy.data("take-test-button").first().click();

    // let currentCategory: string;
    answers.forEach((step) => {
      if (step.category) {
        // if (currentCategory && currentCategory !== step.category) {
        //   cy.data("enterNextCategory.button").click();
        // }
        // currentCategory = step.category;
        // cy.log(`Category '${step.category}'`);
      } else {
        cy.get('[data-cy^="question."]').should("be.visible");
      }
      cy.get("button[data-cy^=choice]")
        .contains(new RegExp(`^${step.choice}$`))
        .click();
    });

    if (demographics) {
      const { age, gender } = demographics;
      cy.data("introToDemographic.answer.button").click();
      cy.get('input[type="range"]').setSliderValue(age);
      cy.data("setDemographicAge.button").click();
      cy.get("button[data-cy^=choice]").contains(gender).click();
      cy.data("outroOfQuestionnaire.continue.button").click();
    } else {
      cy.data("introToDemographic.goToResults.button").click();
    }

    cy.data("round(userFootprintByCategory.overall)").should(
      "contain.text",
      totalFootprint,
    );
  },
);
