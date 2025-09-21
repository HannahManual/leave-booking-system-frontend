describe("DashboardPage", () => {
  const baseUrl = "http://localhost:5173/dashboard";

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it("redirects to login if no roleId is in localStorage", () => {
    cy.clearLocalStorage();
    cy.visit(baseUrl);
    cy.location("pathname").should("include", "/login");
  });

  it("renders admin dashboard with correct buttons", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem("roleId", "3"); // admin
      }
    });

    cy.visit(baseUrl);

    cy.contains("Welcome Admin!").should("exist");

    cy.get("button[aria-label='Make a new leave request']").should("exist");
    cy.get("button[aria-label='View submitted leave requests']").should("exist");
    cy.get("button[aria-label='Create a new user']").should("exist");
    cy.get("button[aria-label='Amend annual leave balance']").should("exist");
    cy.get("button[aria-label='View system usage analytics']").should("exist");
  });

  it("renders manager dashboard with correct buttons", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem("roleId", "2"); // manager
      }
    });

    cy.visit(baseUrl);

    cy.contains("Welcome Manager!").should("exist");

    cy.get("button[aria-label='Make a new leave request']").should("exist");
    cy.get("button[aria-label='View submitted leave requests']").should("exist");

    cy.contains("Create New User").should("not.exist");
    cy.contains("Amend Annual Leave Balance").should("not.exist");
    cy.contains("System Usage").should("not.exist");
  });

  it("renders employee dashboard with correct buttons", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem("roleId", "1"); // employee
      }
    });

    cy.visit(baseUrl);

    cy.contains("Welcome Employee!").should("exist");

    cy.get("button[aria-label='Make a new leave request']").should("exist");
    cy.get("button[aria-label='View submitted leave requests']").should("exist");
    cy.get("button[aria-label='View remaining leave balance']").should("exist");
  });

  it("navigates correctly when each button is clicked (admin)", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem("roleId", "3");
      }
    });

    cy.visit(baseUrl);

    cy.get("button[aria-label='Make a new leave request']").click();
    cy.location("pathname").should("include", "/request-leave");

    cy.visit(baseUrl);
    cy.get("button[aria-label='View submitted leave requests']").click();
    cy.location("pathname").should("include", "/view-requests");

    cy.visit(baseUrl);
    cy.get("button[aria-label='Create a new user']").click();
    cy.location("pathname").should("include", "/create-user");

    cy.visit(baseUrl);
    cy.get("button[aria-label='Amend annual leave balance']").click();
    cy.location("pathname").should("include", "/amend-leave");

    cy.visit(baseUrl);
    cy.get("button[aria-label='View system usage analytics']").click();
    cy.location("pathname").should("include", "/system-usage");
  });

  it("navigates correctly when employee clicks 'View Remaining Leave'", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem("roleId", "1");
      }
    });

    cy.visit(baseUrl);

    cy.get("button[aria-label='View remaining leave balance']").click();
    cy.location("pathname").should("include", "/view-remaining-leave");
  });
});