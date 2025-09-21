describe("View Requests Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");

    cy.get('input[type="email"]').type("admin@example.com");
    cy.get('input[type="password"]').type("pass2");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/dashboard");

    cy.visit("http://localhost:5173/view-requests");
  });

  it("displays leave requests from API and renders table headers", () => {
    cy.intercept("GET", "/api/leave", {
      statusCode: 200,
      body: {
        data: [
          {
            leaveRequestId: 1,
            userId: 1,
            type: "Annual Leave",
            startDate: "2025-09-25",
            endDate: "2025-09-27",
            status: "Pending",
            user: {
              firstName: "Hannah",
              surname: "Manual",
            },
          },
        ],
      },
    }).as("getLeave");

    cy.visit("http://localhost:5173/view-requests");
    cy.wait("@getLeave");

    cy.get("table").should("exist");
    cy.get("th").should("contain", "User");
    cy.get("th").should("contain", "Type");
    cy.get("th").should("contain", "Start");
    cy.get("th").should("contain", "End");
    cy.get("th").should("contain", "Status");

    cy.contains("Hannah Manual").should("exist");
    cy.contains("Annual Leave").should("exist");
  });

  it("allows manager/admin to approve a pending request", () => {
  cy.get('table[role="table"] tbody tr').should('have.length.greaterThan', 0);

cy.get('table[role="table"] tbody tr').each(($row) => {
  if ($row.text().includes('Pending')) {
    cy.wrap($row).within(() => {
    
      cy.get('button[aria-label^="Toggle approval options"]').click();

      
      cy.get('select[aria-label^="Update status"]').select("Approved");

      
      cy.wait('@updateStatus').then(() => {
        cy.get('tr').contains('Approved', { timeout: 6000}).should('exist');
      });

    });

   
    return false;
  }
});

 
});

  it("shows red or gray status circles depending on state", () => {
  
    cy.get('[aria-label="Status: Cancelled"]')
      .should("have.css", "background-color")
      .and("match", /rgb\(255,\s*0,\s*0\)/); // red

    cy.get('[aria-label="Status: Pending"]')
      .should("have.css", "background-color")
      .and("match", /rgb\(255,\s*165,\s*0\)/); // orange

    cy.get('[aria-label="Status: Rejected"]')
      .should("have.css", "background-color")
      .and("match", /rgb\(128,\s*128,\s*128\)/); // gray
  });

  it("handles API failure and shows an error", () => {
    cy.intercept("GET", "/api/leave", {
      statusCode: 500,
      body: {},
    }).as("getLeaveError");

    cy.visit("http://localhost:5173/view-requests");

    cy.wait("@getLeaveError");

    cy.get('[role="alert"]').should("contain", "Failed to fetch leave requests.");
  });

  it("navigates back to dashboard when back button is clicked", () => {
    cy.contains("← Back to Dashboard").click();
    cy.url().should("include", "/dashboard");
  });
})