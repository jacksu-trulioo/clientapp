/// <reference types ="Cypress" />

describe("Total Investments", () => {
  let mandatesList
  let totalInvestments
  let reqBody = {
    langCode: "en",
    filterKeys: [],
    filterValues: [],
    sortBy: "investmentVehicle",
    orderBy: "asc",
  }

  before(() => {
    cy.loginClient().then((mandates) => {
      mandatesList = mandates
    })

    cy.fixture("api/myPortfolio/totalInvestments/totalInvestments").then(
      (json) => {
        totalInvestments = json
      },
    )
  })

  context("POST | /api/client/investments/total-investments", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "POST",
        url: "/api/client/investments/total-investments",
        body: reqBody,
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "POST",
          url: "/api/client/investments/total-investments",
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
          url: "/api/client/investments/total-investments",
          body: reqBody,
        },
        jsonSchema: totalInvestments,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })
})
