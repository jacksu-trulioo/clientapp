/// <reference types ="Cypress" />

describe("Opportunities - Interested Deals", () => {
  let mandatesList
  let interestedDeals

  before(() => {
    cy.loginClient().then((mandates) => {
      mandatesList = mandates
    })

    cy.fixture("api/opportunities/interestedDeals").then((json) => {
      interestedDeals = json
    })
  })

  context("GET | /api/client/deals/get-interested-opportunities", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/deals/get-interested-opportunities",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/deals/get-interested-opportunities",
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
          url: "/api/client/deals/get-interested-opportunities",
        },
        jsonSchema: interestedDeals,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })
})
