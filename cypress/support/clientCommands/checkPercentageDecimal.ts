Cypress.Commands.add("checkPercentageDecimal", (selector) => {
  cy.get(selector)
    .invoke("text")
    .then((text) => {
      var splitTextArr = text.split("%")
      for (let i = 0; i < splitTextArr.length - 1; i++) {
        var num = splitTextArr[i].replace(/[^\d.-]/g, "")
        expect(num).to.match(/^(\d+(\.\d{0,2})?|\.?\d{1,2})$/)
      }
    })
})
