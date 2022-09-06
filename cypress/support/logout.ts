Cypress.Commands.add("logout", () => {
  cy.request("/api/auth/logout")
  cy.reload()
})
