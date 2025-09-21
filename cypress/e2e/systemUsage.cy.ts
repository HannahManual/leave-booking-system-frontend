describe("SystemUsage Page", () => {
  beforeEach(() => {
    cy.loginAsAdmin(); 
    cy.visit("http://localhost:5173/system-usage");
  });

  it("shows loading message initially", () => {
    cy.contains("Loading...").should("exist");
  });

  it("displays usage stats after successful API call", () => {
    cy.intercept("GET", "http://localhost:8900/api/leave/usage", {
      statusCode: 200,
      body: {
        data: {
          totalUsers: 12,
          totalRequests: 34,
          statusBreakdown: [
            { status: "Approved", count: 15 },
            { status: "Pending", count: 10 },
            { status: "Cancelled", count: 9 },
          ],
        },
      },
    }).as("getUsage");

    cy.reload(); // Re-trigger useEffect
    cy.wait("@getUsage");

    // Check data is rendered
    cy.contains("Total Users: 12").should("exist");
    cy.contains("Total Leave Requests: 34").should("exist");
    cy.contains("Approved: 15").should("exist");
    cy.contains("Pending: 10").should("exist");
    cy.contains("Cancelled: 9").should("exist");
  });

  it("shows error message on API failure", () => {
    cy.intercept("GET", "http://localhost:8900/api/leave/usage", {
      statusCode: 500,
    }).as("failUsage");

    cy.reload();
    cy.wait("@failUsage");

    cy.contains("Failed to load system usage stats.").should("exist");
  });

  it("navigates back to dashboard when Back button is clicked", () => {
    cy.intercept("GET", "http://localhost:8900/api/leave/usage", {
      statusCode: 200,
      body: {
        data: {
          totalUsers: 5,
          totalRequests: 20,
          statusBreakdown: [],
        },
      },
    }).as("getUsage");

    cy.reload();
    cy.wait("@getUsage");

    cy.contains("← Back to Dashboard").click();
    cy.location("pathname").should("include", "/login");
  });
});