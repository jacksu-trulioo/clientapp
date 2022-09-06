/// <reference types ="Cypress" />

describe("Investment Listing", () => {
  let mandatesList
  let investmentListing
  let reqBody = {
    filterKeys: [],
    filterValues: [],
    sortBy: "investmentVehicle",
    orderBy: "asc",
  }

  before(() => {
    cy.loginClient().then((mandates) => {
      mandatesList = mandates
    })

    cy.fixture("api/myPortfolio/totalInvestments/investmentListing").then(
      (json) => {
        investmentListing = json
      },
    )
  })

  context("POST | /api/client/investments/investment-listing", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "POST",
        url: "/api/client/investments/investment-listing",
        body: reqBody,
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "POST",
          url: "/api/client/investments/investment-listing",
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
          url: "/api/client/investments/investment-listing",
          body: reqBody,
        },
        jsonSchema: investmentListing,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })
})
