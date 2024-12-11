import { actionsSelected } from "../fixtures/state/actionsSelected";

describe("View plan", () => {
  it("should be able to view plan and share results", () => {
    cy.selectCountryAndLanguage();
    cy.setState(actionsSelected);
    cy.window()
      .its("store")
      .invoke("getState")
      .its("userPlan.selectedActions")
      .should("have.length", 1);

    cy.routerNavigate("/plan");
    cy.location("pathname").should("eq", "/plan");
    cy.data("introToPlan.continue.button").click();
    cy.get("h1").contains("Your plan");
    cy.get('[data-cy^="planActionCard.default.card."]')
      .find("h3")
      .should("contain.text", "Try ride-sharing to get around");
    cy.data("recommendations.impactDetails").should("contain.text", "0 / 38");

    cy.data("shareResults.button").click();
    cy.data("download.href").should("be.visible");
    cy.data("fullPageDialog.close.button").click();

    cy.get('[data-cy^="planActionCard.default.card."]')
      .first()
      .find("button")
      .contains("Complete action")
      .click();
    cy.get('[data-cy^="planActionCard.completed.card."]')
      .find("h3")
      .should("contain.text", "Try ride-sharing to get around");
    cy.data("recommendations.impactDetails").should("contain.text", "38 / 38");

    cy.get("button").contains("Save").click();
    cy.get("h2").contains("Your plan is looking great! You should save it.");
    cy.get("button").contains("Continue without signing in").click();
  });
});
