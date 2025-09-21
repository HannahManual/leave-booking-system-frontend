declare namespace Cypress {
  interface Chainable {
    loginAsEmployee(): Chainable<void>;
    loginAsAdmin(): Chainable<void>;
  }
}
