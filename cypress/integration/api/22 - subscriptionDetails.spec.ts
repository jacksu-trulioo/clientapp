/// <reference types ="Cypress" />

describe("Subscription Details", () => {
  let mandatesList
  let subDetails
  let reqBody = {
    subscriptionDetailsList: {
      subscriptionDealDTOList: [
        {
          dealId: 1380,
          dealName: "Project Luxor",
          investmentAmount: 100000,
          isInvestmentPreferenceShariah: false,
          associatedConventionalDealId: null,
        },
      ],
      subscriptionProgramDTOList: [],
    },
  }

  before(() => {
    cy.loginClient().then((mandates) => {
      mandatesList = mandates
    })

    cy.fixture("api/opportunities/subscriptionDetails").then((json) => {
      subDetails = json
    })
  })

  context("POST | /api/client/deals/subscription-details", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "POST",
        url: "/api/client/deals/subscription-details",
        body: reqBody,
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "POST",
          url: "/api/client/deals/subscription-details",
          body: reqBody,
          failOnStatusCode: false,
        },
        "appSession",
      )
    })

    it("should validate json schema", () => {
      let obj = {
        mandatesList,
        requestObj: {
          method: "POST",
          url: "/api/client/deals/subscription-details",
          body: reqBody,
        },
        jsonSchema: subDetails,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })
})
