/// <reference types ="Cypress" />

describe("Market Indicators", () => {
  let mandatesList
  let marketAll

  before(() => {
    cy.loginClient().then((mandates) => {
      mandatesList = mandates
    })

    cy.fixture("api/myPortfolio/marketIndicators/marketAll").then((json) => {
      marketAll = json
    })
  })

  context("GET | /api/client/miscellaneous/market-all", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/miscellaneous/market-all",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/miscellaneous/market-all",
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
          url: "/api/client/miscellaneous/market-all",
        },
        jsonSchema: marketAll,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })
})
