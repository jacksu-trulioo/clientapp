describe("Interested Deals", () => {
  let opportunitiesKeys
  let commonKeys

  before(() => {
    cy.loginClient()

    cy.fixture("../../public/locales/en/opportunities").then((keys) => {
      opportunitiesKeys = keys
    })
    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })
  })

  it("Should open an Opportunities deal sheet", () => {
    // Click on Interested deals under Opportunities in the sidenav
    cy.visit("/client")
    cy.findByRole("button", {
      name: "Opportunities",
    }).click()
    cy.findByRole("link", {
      name: commonKeys.nav.links.interestedDeals,
      timeout: 20000,
    }).click()
    cy.location("pathname").should("match", /opportunities/)
    cy.findByRole("heading", {
      name: opportunitiesKeys.client.labels.interested,
      level: 2,
    }).should("be.visible")
    // Click on "view details" button in the card
    cy.findAllByRole("button", {
      name: commonKeys.button.viewDetails,
      timeout: 20000,
    })
      .eq(0)
      .click({ timeout: 20000 })
    cy.findByRole("heading", {
      name: "opportunityTitle",
      level: 2,
    }).should("be.visible")
  })

  it("Should mark the deal as interested and view in interested deal page", () => {
    // Go to opportunities
    cy.visit("/client/opportunities")
    cy.findAllByText(commonKeys.button.seeMore).eq(0).click()
    // Click on view details button of any card
    cy.findAllByRole("heading", {
      name: "Project Luxor",
      level: 2,
      timeout: 20000,
    }).click({ timeout: 20000 })
    // click on "interested" button
    cy.findByRole("button", {
      name: "Interested",
    }).then((button) => {
      if (button.find('[aria-label="Not Interested"]').length > 0) {
        cy.findByRole("button", {
          name: "Interested",
        }).click()
        cy.findByRole("button", {
          name: "Later",
        }).click()
      }
    })
    // Go to Interested deal Page
    cy.findByRole("button", {
      name: "Opportunities",
    }).click()
    cy.findByRole("link", {
      name: commonKeys.nav.links.interestedDeals,
      timeout: 20000,
    }).click()
    cy.findAllByRole("heading", {
      name: "Project Luxor",
      level: 2,
      timeout: 20000,
    }).should("be.visible")
  })

  it("Should mark interested deal - uninterested and should not be present in interested deals page", () => {
    // Go to Interested deals
    cy.visit("/client/opportunities/interested-deals")
    // Click on view details button of any interested deal
    cy.findAllByRole("heading", {
      name: "Project Luxor",
      level: 2,
      timeout: 20000,
    }).click()
    // Click on "interested" button
    cy.findByRole("button", {
      name: "Interested",
    }).then((button) => {
      if (button.find('[aria-label="Interested"]').length > 0) {
        cy.findByRole("button", {
          name: "Interested",
        }).click()
        cy.findByRole("button", {
          name: "Ok",
        }).click()
      }
    })
    cy.findByRole("button", {
      name: "Back",
    }).click()
    cy.wait(2000)
    cy.findAllByRole("heading", {
      name: "Project Luxor",
      level: 2,
      timeout: 20000,
    }).should("not.exist")
  })
})
