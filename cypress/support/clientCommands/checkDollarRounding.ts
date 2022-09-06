Cypress.Commands.add("checkDollarRounding", (selector) => {
  cy.get(selector)
    .eq(0)
    .invoke("text")
    .then((text) => {
      let splitTextArr = text.split("$")
      let sum = 0
      sum += parseInt(splitTextArr[1])
      expect(sum).to.satisfy(Number.isInteger)
    })
})
