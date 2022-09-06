let textBoxLength
Cypress.Commands.add("textbox", () => {
  // let textBoxLength
  cy.findAllByRole("textbox").then(async (elem) => {
    textBoxLength = elem.length
  })
})

Cypress.Commands.add("orderSummaryCalculationCheck", () => {
  let sum = 0
  cy.findAllByRole("columnheader").each((program) => {
    cy.wrap(program)
      .invoke("text")
      .then((progName) => {
        let regExp = new RegExp(`${progName} Amount`, "i")
        cy.findAllByRole("cell", { name: regExp }).each((amount) => {
          cy.wrap(amount)
            .invoke("text")
            .then((text) => {
              let splitTextArr = text.split("$")
              let cuma = splitTextArr[1].split(",")
              let ProgramDeal = ""
              cuma.forEach((a) => {
                ProgramDeal += a
              })
              sum = sum + +ProgramDeal
            })
        })
        let Total = new RegExp(`${progName} Total Amount`, "i")
        cy.findAllByRole("cell", { name: Total })
          .invoke("text")
          .then((text) => {
            let splitTextArr = text.split("$")
            let cuma = splitTextArr[1].split(",")
            let amount = ""
            cuma.forEach((program) => {
              amount += program
            })
            expect(Number(amount)).to.eql(sum)
          })
      })
  })
  let deal = 0
  cy.findAllByLabelText("Deal Amount").each((amount) => {
    cy.wrap(amount)
      .invoke("text")
      .then((text) => {
        let splitTextArr = text.split("$")
        let cuma = splitTextArr[1].split(",")
        let deals = ""
        cuma.forEach((a) => {
          deals += a
        })
        deal = deal + +deals
      })
  })
  let TotalImmediateInvestment
  cy.findAllByLabelText("Total Deal Amount")
    .invoke("text")
    .then((text) => {
      let splitTextArr = text.split("$")
      let cuma = splitTextArr[1].split(",")
      let dealtotal = ""
      cuma.forEach((program) => {
        dealtotal += program
      })
      expect(Number(dealtotal)).to.eql(deal)
      TotalImmediateInvestment = deal + +sum
    })
  cy.findAllByLabelText("Total Immediate Amount")
    .invoke("text")
    .then((text) => {
      let splitTextArr = text.split("$")
      let cuma = splitTextArr[1].split(",")
      let TotalImmediate = ""
      cuma.forEach((program) => {
        TotalImmediate += program
      })
      expect(Number(TotalImmediate)).to.eql(TotalImmediateInvestment)
    })
})

Cypress.Commands.add("confirmCalculationCheck", (invAmount) => {
  let program = 0
  cy.findAllByLabelText("Program Deal Amount").each((amount) => {
    cy.wrap(amount)
      .invoke("text")
      .then((text) => {
        let splitTextArr = text.split("$")
        let cuma = splitTextArr[1].split(",")
        let ProgramDeal = ""
        cuma.forEach((a) => {
          ProgramDeal += a
        })
        program = program + +ProgramDeal
      })
  })
  let DealAmount = 0
  cy.findAllByLabelText("Deal Amount").each((amount) => {
    cy.wrap(amount)
      .invoke("text")
      .then((text) => {
        let splitTextArr = text.split("$")
        let cuma = splitTextArr[1].split(",")
        let deals = ""
        cuma.forEach((a) => {
          deals += a
        })
        DealAmount = DealAmount + +deals
      })
  })
  cy.findByLabelText("Immediate Investment")
    .invoke("text")
    .then((text) => {
      let splitTextArr = text.split("$")
      let cuma = splitTextArr[1].split(",")
      let ImmediateInvestment = ""
      cuma.forEach((amount) => {
        ImmediateInvestment += amount
      })
      let ImmediateInvestmentTotal = DealAmount + +program
      expect(Number(ImmediateInvestment)).to.eql(ImmediateInvestmentTotal)
    })
  cy.findByLabelText("Investment Amount")
    .invoke("text")
    .then((text) => {
      let splitTextArr = text.split("$")
      let cuma = splitTextArr[1].split(",")
      let InvestmentAmount = ""
      cuma.forEach((amount) => {
        InvestmentAmount += amount
      })
      expect(Number(InvestmentAmount)).to.eql(invAmount * textBoxLength)
    })
})
Cypress.Commands.add("addToCartDeal", () => {
  cy.findByRole("button", { name: "Order Management", timeout: 20000 })
    .children()
    .eq(1)
    .invoke("text")
    .then((txt) => {
      if (txt.trim() == "Add to Cart") {
        cy.findByRole("button", { name: "Add to Cart" }).click()
      }
    })
})

Cypress.Commands.add("removeDeal", () => {
  cy.visit("/client/subscription")
  cy.findAllByRole("dialog", { name: "Remove Deal" }).each(() => {
    cy.findAllByRole("dialog", { name: "Remove Deal" }).eq(0).click()
    cy.findByRole("button", { name: "Yes", timeout: 5000 }).click()
    cy.wait(2000)
  })
})

Cypress.Commands.add("addToCartProgram", () => {
  cy.findByRole("button", { name: "Order Management" })
    .children()
    .eq(1)
    .invoke("text")
    .then((txt) => {
      if (txt.trim() == "Add to Cart") {
        cy.findByRole("button", { name: "Add to Cart" }).click()
        cy.findByRole("button", { name: "Conventional" }).click()
      }
    })
})
