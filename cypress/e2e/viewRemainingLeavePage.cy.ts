describe("ViewRemainingLeavePage", () => {
  beforeEach(() => {
    cy.loginAsEmployee(); 
    cy.visit("http://localhost:5173/view-remaining-leave");
  });

  it("shows loading message initially", () => {
    cy.get('[role="status"]').should("contain.text", "Loading...");
  });

  it("displays remaining leave after successful API call", () => {
    cy.intercept("GET", "http://localhost:8900/api/leave/remaining", {
      statusCode: 200,
      body: { remainingLeave: 42 },
    }).as("getRemainingLeave");

    cy.reload(); // re-trigger useEffect
    cy.wait("@getRemainingLeave");

    cy.get('[aria-label="Annual leave balance card"]').within(() => {
      cy.contains("You have").should("exist");
      cy.get("h1").should("contain.text", "42");
      cy.contains("of annual leave left.").should("exist");
    });
  });

  it("shows error message on API failure", () => {
    cy.intercept("GET", "http://localhost:8900/api/leave/remaining", {
      statusCode: 500,
    }).as("getRemainingLeaveFail");

    cy.reload();
    cy.wait("@getRemainingLeaveFail");

    cy.get('[role="alert"]').should("contain.text", "Could not fetch remaining leave balance.");
  });

  it("navigates back to dashboard when back button is clicked", () => {
    cy.contains("← Back to Dashboard").click();

   
    cy.location("pathname").should("include", "/login");
  });
});