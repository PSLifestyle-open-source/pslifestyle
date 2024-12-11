describe("Answer questionnaire", () => {
  it("should calculate correct footprint for choices", () => {
    cy.selectCountryAndLanguage();
    cy.fixture("answers/full").then((answerSet) =>
      cy.answerQuestionnaire(answerSet),
    );
  });

  it("should be able to skip demographics", () => {
    cy.selectCountryAndLanguage();
    cy.fixture("answers/default").then((answerSet) => {
      const { answers, totalFootprint } = answerSet;
      cy.answerQuestionnaire({ answers, totalFootprint });
    });
  });
});
