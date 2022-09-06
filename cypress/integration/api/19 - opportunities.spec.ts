/// <reference types ="Cypress" />

describe("Opportunities", () => {
  let mandatesList
  let opportunities
  let reqBody = {
    filterKeys: [],
    filterValues: [],
    sortBy: "recency",
    orderBy: "asc",
  }

  before(() => {
    cy.loginClient().then((mandates) => {
      mandatesList = mandates
    })

    cy.fixture("api/opportunities/opportunities").then((json) => {
      opportunities = json
    })
  })

  context("POST | /api/client/deals/opportunities", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "POST",
        url: "/api/client/deals/opportunities",
        body: reqBody,
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "POST",
          url: "/api/client/deals/opportunities",
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
          url: "/api/client/deals/opportunities",
          body: reqBody,
        },
        jsonSchema: opportunities,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })
})
