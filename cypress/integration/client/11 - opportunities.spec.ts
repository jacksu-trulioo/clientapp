describe("Opportunities", () => {
  let faker = require("faker")
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

  beforeEach(() => {
    cy.intercept("GET", "/api/client/deals/popup-details", {
      fixture: "opportunities/orderManagement.json",
    }).as("popup-details")
  })

  context("Order Management - FTUE popups", () => {
    it("Should show 'Add to Investment  cart'  popup for a new client", () => {
      cy.visit("/client/opportunities")
      cy.wait("@popup-details")
      // when the investment cart is empty and the user is in a deal's deal - detail page
      cy.findAllByRole("button", {
        name: opportunitiesKeys.index.button.viewDetails,
        timeout: 20000,
      })
        .eq(1)
        .click()
      cy.findByText(
        commonKeys.client.userOnBoarding.addToCart.description.deal,
      ).should("be.visible")
      cy.findByRole("button", {
        name: commonKeys.button.back,
      }).click()
      cy.wait(2000)
      // when the investment cart is empty and the user is in a Programs' deal - detail page
      cy.findAllByRole("button", {
        name: opportunitiesKeys.index.button.viewDetails,
        timeout: 20000,
      })
        .eq(3)
        .click()
      cy.findByText(
        commonKeys.client.userOnBoarding.addToCart.description.program,
      ).should("be.visible")
      cy.addToCartProgram()
    })

    it("Should show 'Investment Cart' popup", () => {
      cy.intercept("GET", "/api/client/deals/popup-details", {
        fixture: "opportunities/invesmentCart.json",
      }).as("invesment-cart")
      cy.reload()
      cy.wait("@invesment-cart")
      // on adding any program or deal in add
      cy.findByText(
        commonKeys.client.userOnBoarding.viewCart.description,
      ).should("be.visible")
    })

    it("Should show the 'Subscription details' popup", () => {
      cy.reload()
      cy.wait("@popup-details")
      // on entering the Investment cart page
      cy.findByRole("button", {
        name: "Investment Cart",
      }).click()
      cy.findByText(
        commonKeys.client.userOnBoarding.checkout.description,
      ).should("be.visible")
    })

    it("Should show the 'Subscription Amount' popup", () => {
      // on entering the subscription details page
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      cy.findByText(
        commonKeys.client.userOnBoarding.subscriptionDetails.description,
      ).should("be.visible")
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box)
          .click()
          .type(faker.datatype.number({ min: 100000, max: 100000000 }))
      })
    })

    it("Should show Program details' popup", () => {
      // After entering subscription amount for a program and clicking on next - on the program details page
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      cy.findAllByText(
        commonKeys.client.userOnBoarding.programDetails.description,
      ).should("be.visible")
    })

    it("Should show 'Confirmation' popup", () => {
      // in order summary page
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      cy.findByText(
        commonKeys.client.userOnBoarding.orderSummary.description,
      ).should("be.visible")
    })
  })

  context("Subscribed Deals", () => {
    it("Should show 'Subscribed Deals", () => {
      // Go to opportunities
      cy.visit("/client/opportunities")
      // Should show the "Subscribed Deals" section
      cy.findByRole("heading", {
        name: opportunitiesKeys.client.subscribedDeals.title,
        level: 2,
      }).should("be.visible")
      // Click on "see all" section
      cy.findAllByText(opportunitiesKeys.client.links.seeAll)
        .eq(1)
        .should("be.visible")
        .click()
      cy.wait(2000)
      cy.findByRole("heading", {
        name: opportunitiesKeys.client.subscribedDeals.title,
        level: 2,
      }).should("be.visible")
      cy.findAllByRole("button", {
        name: commonKeys.button.viewDetails,
      }).should("have.length.greaterThan", 0)
      //Should able to Add the cart in "Investmnet Card"
      cy.findAllByRole("button", {
        name: commonKeys.button.viewDetails,
      })
        .eq(0)
        .click()
      cy.addToCartDeal()
      cy.findByRole("button", { name: "Order Management", timeout: 20000 })
        .children()
        .eq(1)
        .contains(opportunitiesKeys.client.button.addedToCart)
    })
  })
})
