describe('Amend Annual Leave Balance Page', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:8900/api/users', {
      statusCode: 200,
      body: [
        {
          userId: 1,
          firstName: 'Hannah',
          lastName: 'Manual',
          email: 'hannah@example.com'
        }
      ]
    }).as('getUsers');
    cy.intercept('PUT', 'http://localhost:8900/api/leave/amend-alb', {
      statusCode: 200
    }).as('updateBalance');

    // Visit the page
    cy.visit('http://localhost:5173/amend-alb');

    // Wait for the GET users call to complete
    cy.wait('@getUsers');
  });

  it('renders all fields correctly', () => {
    // There should be 2 options: the placeholder and the 1 user
    cy.get('[data-cy="user-select"] option').should('have.length', 2);

    cy.get('[data-cy="new-balance-input"]').should('exist');
    cy.get('[data-cy="submit-button"]').should('exist');
    cy.get('[data-cy="back-button"]').should('exist');
  });

  it('submits the form and shows success message', () => {
    // Select user by value
    cy.get('[data-cy="user-select"]').select('1');

    // Enter new balance
    cy.get('[data-cy="new-balance-input"]').clear().type('48');

    // Submit form
    cy.get('[data-cy="submit-button"]').click();

    // Wait for PUT request
    cy.wait('@updateBalance');

    // Check success message
    cy.get('[data-cy="success-message"]').should('contain', 'Leave balance updated successfully.');
  });

  it('shows error message if no user selected', () => {
    // Select empty string (placeholder)
    cy.get('[data-cy="user-select"]').select('');

    cy.get('[data-cy="new-balance-input"]').clear().type('40');
    cy.get('[data-cy="submit-button"]').click();

    cy.get('[data-cy="error-message"]').should('contain', 'Please select a user.');
  });

  it('shows error message if API call fails', () => {
    // Override the PUT request with a failed response
    cy.intercept('PUT', 'http://localhost:8900/api/leave/amend-alb', {
      statusCode: 500
    }).as('updateBalanceFail');

    cy.get('[data-cy="user-select"]').select('1');
    cy.get('[data-cy="new-balance-input"]').clear().type('30');
    cy.get('[data-cy="submit-button"]').click();

    cy.wait('@updateBalanceFail');

    cy.get('[data-cy="error-message"]').should('contain', 'Failed to update leave balance.');
  });

  it('navigates back to dashboard when "Back to Dashboard" is clicked', () => {
    cy.get('[data-cy="back-button"]').click();
    cy.url().should('include', '/dashboard');
  });
});