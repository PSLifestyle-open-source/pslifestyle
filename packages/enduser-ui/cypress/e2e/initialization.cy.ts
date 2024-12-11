/// <reference types="cypress" />
describe("Initialize user", () => {
  it("should redirect from landing page to selections", () => {
    cy.visit("/");
    cy.location("pathname").should("eq", "/selections");
  });

  it("should be able to select country and language", () => {
    cy.visit("/selections");
    cy.get("#countrySelector");
    cy.get("#languageSelector").should("not.exist");
    cy.get("#countrySelector").click();
    cy.get('[role="option"]').contains("Europe").click();
    cy.get("#languageSelector").click();
    cy.get('[role="option"]').contains("English").click();
    cy.data("continue-button").click();
    cy.location("pathname").should("eq", "/");
    cy.data("country-language-select-button").contains("English");
  });
});
