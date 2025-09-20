/// <reference types="cypress" />

Cypress.Commands.add('loginAsEmployee', () => {
  cy.request('POST', 'http://localhost:8900/api/auth/login', {
    email: 'hannah@example.com',
    password: 'pass1'
  }).then((response) => {
    window.localStorage.setItem('authToken', response.body.token);
  });
});