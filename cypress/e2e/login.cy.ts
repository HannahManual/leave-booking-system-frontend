describe('Login Page', () => {
  const baseUrl = 'http://localhost:5173'; 
  beforeEach(() => {
    cy.visit(`${baseUrl}`);
  });

  it('renders login form correctly', () => {
    cy.get('h2').should('contain', 'Login');
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    cy.get('button[type="submit"]').should('contain', 'Login');
  });

  it('prevents submission with empty fields', () => {
    cy.get('button[type="submit"]').click();
  });

  it('shows error for invalid credentials', () => {
    cy.intercept('POST', '**', {
      statusCode: 401,
      body: { error: 'Invalid credentials' }
    });

    cy.get('input[type="email"]').type('wrong@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.contains('Invalid credentials').should('exist');
  });

  it('logs in with valid credentials and redirects', () => {
    cy.intercept('POST', '**', {
      statusCode: 202,
      body: { role: 1, email: 'hannah@example.com' }
    });

    cy.get('input[type="email"]').type('hannah@example.com');
    cy.get('input[type="password"]').type('correctpassword');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('roleId')).to.eq('1');
    });
  });

  it('handles unexpected server error', () => {
    cy.intercept('POST', '**/login', {
      statusCode: 500,
      body: { error: 'Server error' }
    });

    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('anyPassword');
    cy.get('button[type="submit"]').click();

    cy.contains('Server error').should('exist');
  });
});