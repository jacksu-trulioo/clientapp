/// <reference types ="Cypress" />

describe("Commitment Related Deals", () => {
  let mandatesList
  let commitRelatedDeals
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

    cy.fixture("api/myPortfolio/totalCommitments/commitmentRelatedDeals").then(
      (json) => {
        commitRelatedDeals = json
      },
    )
  })

  context("POST | /api/client/deals/commitment-related-deals", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "POST",
        url: "/api/client/deals/commitment-related-deals?spvId=22",
        body: reqBody,
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "POST",
          url: "/api/client/deals/commitment-related-deals?spvId=22",
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
          url: "/api/client/deals/commitment-related-deals?spvId=22",
          body: reqBody,
        },
        jsonSchema: commitRelatedDeals,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })
})
