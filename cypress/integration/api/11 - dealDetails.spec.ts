/// <reference types ="Cypress" />

describe("Deal Details", () => {
  let mandatesList
  let dealDetails

  before(() => {
    cy.loginClient().then((mandates) => {
      mandatesList = mandates
    })

    cy.fixture("api/myPortfolio/totalInvestments/dealDetails").then((json) => {
      dealDetails = json
    })
  })

  context("GET | /api/client/investments/deal-details", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/investments/deal-details?dealId=10773",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/investments/deal-details?dealId=10773",
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
          url: "/api/client/investments/deal-details?dealId=10773",
        },
        jsonSchema: dealDetails,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })
})
