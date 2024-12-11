/// <reference types="cypress" />
describe("Login", () => {
  it("should fail verification of invalid magic link", () => {
    cy.visit("/checklogin?=invalid");
    cy.data("loginFromOtherDevice").should("exist");
    cy.get("input[id=email]").type("invalid@email");
    cy.get("button[type=submit]").should("be.disabled");
    cy.get("input[id=email]").clear();
    cy.get("input[id=email]").type("invalid@email.com");
    cy.get("button[type=submit]").click();
    cy.data("loginFromOtherDevice.errorModal.title").should("exist");
  });

  it("should be able to login with a valid link", () => {
    cy.visit("/login");
    cy.data("menuLinks.logout").should("not.exist");
    cy.data("loginForm").should("exist");

    cy.get("input[id=email]").type("invalid@email");
    cy.get("button[type=submit]").should("be.disabled");
    cy.get("input[id=email]").clear();

    const validEmail = "valid@email.com";
    cy.get("input[id=email]").type(validEmail);
    cy.get("button[type=submit]").click();
    cy.data("magicLinkRequested.email").contains(validEmail);

    // emulator writes magic link to a file in /tmp with requester email as its name
    cy.readFile(`/tmp/${validEmail}`).then((url) => {
      cy.visit(url);
      cy.location("pathname").should("eq", "/selections");
      cy.get("a").contains("Log out").click();
      cy.get("a").contains("Log in").should("be.visible");
    });
  });

  it("should show error for expired token", () => {
    cy.selectCountryAndLanguage();

    const email = "test@user.com";
    cy.visit("/login");
    cy.get("input[id=email]").type(email);
    cy.get("button[type=submit]").click();
    cy.readFile(`/tmp/${email}`).then((url) => {
      cy.visit(url);
      cy.location("pathname").should("eq", "/test");

      // after successful login, set an invalid session token
      const invalidUser = {
        email,
        sessionToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
        roles: [],
      };
      cy.window().its("store").invoke("dispatch", {
        type: "authedSession/setUserLoggedIn",
        payload: invalidUser,
      });

      cy.window()
        .its("store")
        .invoke("getState")
        .its("authedSession.user.sessionToken")
        .should("equal", invalidUser.sessionToken);

      cy.get("div[role=dialog]").should("be.visible");
      cy.data("notification.description").should(
        "contain.text",
        "Your session has expired",
      );

      cy.window()
        .its("store")
        .invoke("getState")
        .its("notification.notifications")
        .should("have.all.key", "sessionExpired");

      cy.get("button").contains("Close").click();
      cy.get("div[role=dialog]").should("not.exist");
      cy.data("notification.description").should("not.exist");
    });
  });
});
