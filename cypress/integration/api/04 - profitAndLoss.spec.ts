/// <reference types ="Cypress" />

describe("Profit And Loss", () => {
  let mandatesList
  let profitLossDetails

  before(() => {
    cy.loginClient().then((mandates) => {
      mandatesList = mandates
    })

    cy.fixture("api/myPortfolio/profitAndLoss/profitLossDetails").then(
      (json) => {
        profitLossDetails = json
      },
    )
  })

  context("GET | /api/client/profitloss/profit-loss-details", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/profitloss/profit-loss-details",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/deals/investment-cart",
          failOnStatusCode: false,
        },
        "appSession",
      )
    })

    it("should validate json schema", () => {
      let obj = {
        mandatesList,
        requestObj: {
          method: "GET",
          url: "/api/client/profitloss/profit-loss-details",
        },
        jsonSchema: profitLossDetails,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })
})
