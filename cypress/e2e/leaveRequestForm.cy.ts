describe('Leave Request Form', () => {
  beforeEach(() => {
    cy.loginAsEmployee(); 
    cy.visit('/request-leave');
  });

  it('displays remaining leave balance', () => {
    cy.get('[data-testid="remaining-leave"]').should('contain', 'hours');
  });

  it('prevents submission with empty fields', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Start Date:').should('exist');
  });

  it('prevents selecting a past start date', () => {
    cy.get('[name="startDate"]').type('2020-01-01');
    cy.get('[name="endDate"]').type('2025-09-22');
    cy.get('button[type="submit"]').click();
    cy.contains('Start date cannot be in the past').should('exist');
  });

  it('submits a valid leave request', () => {
    cy.get('[name="leaveType"]').select('PTO');
    cy.get('[name="startDate"]').type('2025-10-01');
    cy.get('[name="endDate"]').type('2025-10-03');
    cy.get('[name="reason"]').type('Attending a wedding');
    cy.get('button[type="submit"]').click();
    cy.contains('Leave request submitted successfully').should('exist');
  });
});