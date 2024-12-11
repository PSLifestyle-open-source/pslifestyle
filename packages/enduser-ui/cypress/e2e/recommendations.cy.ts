import { fullQuestionnaireCompleted } from "../fixtures/state/fullQuestionnaireCompleted";

describe("View recommendations", () => {
  it("should be able to pick actions", () => {
    cy.selectCountryAndLanguage();
    cy.setState(fullQuestionnaireCompleted);
    cy.window()
      .its("store")
      .invoke("getState")
      .its("userAnswers.answerSetId")
      .should("not.be.undefined");

    // go to outro of questionnaire first so that answer set gets sent to backend
    cy.routerNavigate("/test");
    cy.data("outroOfQuestionnaire.continue.button").click();

    // then we can navigate to recommendations
    cy.routerNavigate("/recommendations");
    cy.data("introToRecommendations.continue.button").click();
    cy.data("recommendations.title").should("be.visible");
    cy.get('[data-cy^="recommendationActionCard.alreadyDoThis.card."]').should(
      "not.exist",
    );

    cy.get('[data-cy^="recommendationActionCard.default.card."]')
      .first()
      .find("h3")
      .should("contain.text", "Share tips with your neighbours");
    cy.get('[data-cy^="recommendationActionCard.default.card."]')
      .first()
      .find('[data-cy="recommendationActionCard.alreadyDoThis.button"]')
      .click();
    cy.get('[data-cy^="recommendationActionCard.alreadyDoThis.card."]').should(
      "be.visible",
    );
    cy.data("recommendations.impactDetails").should("contain.text", "0 / 1235");

    cy.get('[data-cy^="recommendationActionCard.default.card."]')
      .first()
      .find("h3")
      .should("contain.text", "Try ride-sharing to get around");
    cy.get('[data-cy^="recommendationActionCard.default.card."]')
      .first()
      .find('[data-cy="recommendationActionCard.choose.button"]')
      .click();
    cy.data("recommendations.impactDetails").should(
      "contain.text",
      "38 / 1235",
    );
    cy.data("recommendations.next.button").click();
    cy.data("introToPlan.continue.button").should("be.visible");
  });
});
