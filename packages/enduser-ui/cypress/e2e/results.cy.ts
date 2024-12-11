import { defaultQuestionnaireCompleted } from "../fixtures/state/defaultQuestionnaireCompleted";

describe("View results", () => {
  it("should show and be able to share results", () => {
    cy.selectCountryAndLanguage();
    cy.setState(defaultQuestionnaireCompleted);
    cy.window()
      .its("store")
      .invoke("getState")
      .its("userAnswers.answerSetId")
      .should("not.be.undefined");

    // go to outro of questionnaire first so that answer set gets sent to backend
    cy.routerNavigate("/test");
    cy.data("outroOfQuestionnaire.continue.button").click();

    cy.location("pathname").should("eq", "/results");
    cy.data("round(userFootprintByCategory.overall)").should(
      "contain.text",
      "1010",
    );
    cy.data("shareResults.button").click();
    cy.data("download.href").should("be.visible");
    cy.data("fullPageDialog.close.button").click();
    cy.data("take-test-button").click();
    cy.data("retakeAlert.title").should("be.visible");
    cy.get("button").contains("Cancel").click();
  });
});
