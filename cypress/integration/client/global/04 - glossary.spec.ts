describe("Glossary", () => {
  let glossary
  let clientDashboard
  before(() => {
    cy.loginClient()
    cy.fixture("../../public/locales/en/glossary").then((keys) => {
      glossary = keys
    })
    cy.fixture("../../public/locales/en/clientDashboard").then((keys) => {
      clientDashboard = keys
    })
  })
  context("Glossary page", () => {
    it("should open glossary", () => {
      cy.visit("/client")
      // Click on the glossary icon from the top Nav /header
      cy.findByRole("link", {
        name: "Support Icon",
      }).click()
      cy.location("pathname", { timeout: 4000 }).should("match", /glossary/)
      // Page screen validations
      cy.findByText(glossary.heading).should("be.visible")
      cy.findByText(glossary.description).should("be.visible")
    })
    it("should expand and collapse the definitions", () => {
      // Click on the glossary icon on the nav bar/header
      // Click on the "expand" icon of any one of the term
      cy.wait(2000)
      cy.findByRole("button", {
        name: "Access Fund",
      }).click()
      cy.findByRole("region", {
        name: "Access Fund",
      })
        .children()
        .should("be.visible")
      // Click on the "expand" icon of any other term
      cy.findByRole("button", {
        name: "AGPE",
      }).click()
      cy.findByRole("region", {
        name: "Access Fund",
      }).should("not.exist")
      cy.findByRole("region", {
        name: "AGPE",
      })
        .children()
        .should("be.visible")
    })
    it("should close the Glossary modal", () => {
      // Click on the glossary icon on the nav bar/header
      // Click on the "Back" button
      cy.findAllByText("Back").click()
      cy.findByText(clientDashboard.description).should("not.be.null")
    })
    it("should show valid term's definition", () => {
      // Click on the glossary icon on the nav bar/header
      cy.findByRole("link", {
        name: "Support Icon",
      }).click()
      cy.location("pathname", { timeout: 4000 }).should("match", /glossary/)
      // Search for a valid term relevant to the site/app
      cy.findByPlaceholderText("Search Glossary").type("dyf")
      // Click on the "expand" icon
      cy.findByRole("button", {
        name: "DYF",
      }).click()
      cy.findByRole("region", {
        name: "DYF",
      })
        .children()
        .should("be.visible")
      cy.findByPlaceholderText("Search Glossary").clear()
    })
  })
  context("Glossary - No Result", () => {
    it("should show no result", () => {
      // Click on the glossary icon on the nav bar/header
      // Search for an invalid term or a term which does not exist
      const faker = require("faker")
      cy.findByPlaceholderText(glossary.searchInput.placeHolder).type(
        faker.random.alpha(5),
      )
      cy.findByText("No result found").should("not.be.null")
    })
  })
})
