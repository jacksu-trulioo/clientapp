/// <reference types ="Cypress" />

describe("Opportunities - Get Redeem Funds", () => {
  let mandatesList
  let getRedeemFunds

  before(() => {
    cy.loginClient().then((mandates) => {
      mandatesList = mandates
    })

    cy.fixture("api/opportunities/getRedeemFunds").then((json) => {
      getRedeemFunds = json
    })
  })

  context("GET | /api/client/deals/get-redeem-funds", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/deals/get-redeem-funds",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/deals/get-redeem-funds",
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
          url: "/api/client/deals/get-redeem-funds",
        },
        jsonSchema: getRedeemFunds,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })
})
