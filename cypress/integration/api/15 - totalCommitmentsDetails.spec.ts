/// <reference types ="Cypress" />

describe("Total Commitments Details", () => {
  let mandatesList
  let totalCommitmentsDetails

  let reqBody = {
    filterKeys: ["deployed"],
    filterValues: ["0-100"],
    sortBy: "deployed",
    orderBy: "asc",
  }

  before(() => {
    cy.loginClient().then((mandates) => {
      mandatesList = mandates
    })

    cy.fixture("api/myPortfolio/totalCommitments/totalCommitmentsDetails").then(
      (json) => {
        totalCommitmentsDetails = json
      },
    )
  })

  context("POST | /api/client/commitment/total-commitment-details", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "POST",
        url: "/api/client/commitment/total-commitment-details",
        body: reqBody,
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "POST",
          url: "/api/client/commitment/total-commitment-details",
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
          url: "/api/client/commitment/total-commitment-details",
          body: reqBody,
        },
        jsonSchema: totalCommitmentsDetails,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })
})
