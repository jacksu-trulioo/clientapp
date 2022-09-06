/// <reference types ="Cypress" />

describe("Redeem Details", () => {
  let mandatesList
  let getRedeemDetails
  let reqBody = {
    fundName: "BondVest Class A ",
    redemptionAmount: 809972,
    remainingAmount: 0,
    reason: "Partial redemption for capital call",
  }

  before(() => {
    cy.loginClient().then((mandates) => {
      mandatesList = mandates
    })

    cy.fixture("api/opportunities/getRedeemDetails").then((json) => {
      getRedeemDetails = json
    })
  })

  context("POST | /api/client/deals/get-redeem-details", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "POST",
        url: "/api/client/deals/get-redeem-details",
        body: reqBody,
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "POST",
          url: "/api/client/deals/get-redeem-details",
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
          url: "/api/client/deals/get-redeem-details",
          body: reqBody,
        },
        jsonSchema: getRedeemDetails,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })
})
