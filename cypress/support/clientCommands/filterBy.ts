Cypress.Commands.add("filterBy", ({ radio, checkbox }) => {
  if (radio || checkbox) {
    cy.findByRole("button", { name: "Sort & Filter", timeout: 10000 }).click()
  }

  if (radio && radio.length > 0) {
    radio.forEach((button) => {
      cy.findByRole("radio", { name: button }).parent().click()
    })
  }

  if (checkbox && checkbox.length > 0) {
    checkbox.forEach((button) => {
      cy.findByRole("checkbox", { name: button }).parent().click()
    })
  }

  if (radio || checkbox) {
    cy.findByRole("button", { name: "Apply Changes" }).click()
  }
})
