/// <reference types ="Cypress" />

describe("Update Client Opportunities", () => {
  let mandatesList
  let clientOpp
  let reqBody = [
    {
      clientOpportunityId: 19973,
      opportunityId: 1380,
      isInterested: "Y",
      isScheduled: true,
      isSeen: true,
      isAddedToCart: true,
    },
  ]

  before(() => {
    cy.loginClient().then((mandates) => {
      mandatesList = mandates
    })

    cy.fixture("api/opportunities/updateClientOpportunities").then((json) => {
      clientOpp = json
    })
  })

  context("PATCH | /api/client/deals/update-client-opportunities", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "PATCH",
        url: "/api/client/deals/update-client-opportunities",
        body: reqBody,
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "PATCH",
          url: "/api/client/deals/update-client-opportunities",
          body: reqBody,
          failOnStatusCode: false,
        },
        "appSession",
      )
    })

    it("should add opportunities to cart and validate json schema", () => {
      let obj = {
        mandatesList,
        requestObj: {
          method: "PATCH",
          url: "/api/client/deals/update-client-opportunities",
          body: reqBody,
        },
        jsonSchema: clientOpp,
      }
      cy.testUpdateClientOpportunites(obj)
    })

    it("should remove opportunities from cart and validate json schema", () => {
      reqBody[0].isAddedToCart = false
      let obj = {
        mandatesList,
        requestObj: {
          method: "PATCH",
          url: "/api/client/deals/update-client-opportunities",
          body: reqBody,
        },
        jsonSchema: clientOpp,
      }
      cy.testUpdateClientOpportunites(obj)
    })
  })
})
