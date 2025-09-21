/// <reference types="cypress" />

Cypress.Commands.add('loginAsEmployee', () => {
  cy.request('POST', 'http://localhost:8900/api/login', {
    email: 'hannah@example.com',
    password: 'pass1'
  }).then((response) => {
    window.localStorage.setItem('authToken', response.body.token);
  });
});

Cypress.Commands.add('loginAsAdmin', () => {
  cy.request('POST', 'http://localhost:8900/api/login', {
    email: 'admin@example.com',
    password: 'pass2'
  }).then((response) => {
    window.localStorage.setItem('authToken', response.body.token);
  });
});