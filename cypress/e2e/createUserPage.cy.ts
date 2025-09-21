describe("CreateUserPage", () => {
  beforeEach(() => {
    cy.request("POST", "http://localhost:8900/api/login", {
      email: "admin@example.com",
      password: "pass2",
    });
    cy.visit("http://localhost:5173/create-user");
  });

  it("renders the form fields correctly", () => {
    cy.get('input[name="firstName"]').should("exist");
    cy.get('input[name="surname"]').should("exist");
    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="password"]').should("exist");
    cy.get('select[name="roleId"]').should("exist");
    cy.get('input[name="departmentId"]').should("exist");
    cy.get('input[name="annualLeaveBalance"]').should("exist");
    cy.get('button[type="submit"]').should("contain", "Create User");
  });

  it("submits the form successfully and shows success message", () => {
    cy.intercept("POST", "/api/users", {
      statusCode: 201,
      body: { message: "User created" },
    }).as("createUser");

    cy.get('input[name="firstName"]').type("Alex");
    cy.get('input[name="surname"]').type("Jameson");
    cy.get('input[name="email"]').type("alex.jameson@example.com");
    cy.get('input[name="password"]').type("securePassword!");
    cy.get('select[name="roleId"]').select("2"); // Manager
    cy.get('input[name="departmentId"]').clear().type("2");
    cy.get('input[name="annualLeaveBalance"]').clear().type("30");

    cy.get('button[type="submit"]').click();

    cy.wait("@createUser");

    cy.contains("✅ User created successfully!").should("exist");
  });

  it("shows error message if user creation fails", () => {
    cy.intercept("POST", "/api/users", {
      statusCode: 400,
      body: { error: "Email already exists" },
    }).as("createUserFail");

    cy.get('input[name="firstName"]').type("Alex");
    cy.get('input[name="surname"]').type("Jameson");
    cy.get('input[name="email"]').type("alex.jameson@example.com");
    cy.get('input[name="password"]').type("securePassword!");
    cy.get('select[name="roleId"]').select("1");
    cy.get('input[name="departmentId"]').clear().type("2");
    cy.get('input[name="annualLeaveBalance"]').clear().type("30");

    cy.get('button[type="submit"]').click();

    cy.wait("@createUserFail");

    cy.contains("❌ Email already exists").should("exist");
  });

  it("navigates back to dashboard when 'Back to Dashboard' is clicked", () => {
    cy.intercept("GET", "**/dashboard").as("goDashboard");

    cy.contains("← Back to Dashboard").click();

    cy.url().should("include", "/login");
  });
});