/// <reference types ="Cypress" />

describe("Program Details", () => {
  let mandatesList
  let programDeals
  let reqBody = {
    programs: [
      {
        concentration: 20,
        programId: 1015,
        subscriptionAmount: "100000",
        isInvestmentPreferenceShariah: false,
        associatedConventionalProgramId: 1359,
      },
    ],
  }

  before(() => {
    cy.loginClient().then((mandates) => {
      mandatesList = mandates
    })

    cy.fixture("api/opportunities/programDeals").then((json) => {
      programDeals = json
    })
  })

  context("POST | /api/client/deals/program-deals", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "POST",
        url: "/api/client/deals/program-deals",
        body: reqBody,
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "POST",
          url: "/api/client/deals/program-deals",
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
          url: "/api/client/deals/program-deals",
          body: reqBody,
        },
        jsonSchema: programDeals,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })
})
