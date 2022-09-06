/// <reference types ="Cypress" />

describe("Cashflow", () => {
  let mandatesList
  let cashFlowDetails

  before(() => {
    cy.loginClient().then((mandates) => {
      mandatesList = mandates
    })

    cy.fixture("api/myPortfolio/cashflows/cashFlowDetails").then((json) => {
      cashFlowDetails = json
    })
  })

  context("GET | /api/client/cashflow/cashflow-details", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/cashflow/cashflow-details",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/cashflow/cashflow-details",
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
          url: "/api/client/cashflow/cashflow-details",
        },
        jsonSchema: cashFlowDetails,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })
})
