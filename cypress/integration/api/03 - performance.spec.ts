/// <reference types ="Cypress" />

describe("Performance", () => {
  let mandatesList
  let getTopDeals
  let detailedPerformance

  before(() => {
    cy.loginClient().then((mandates) => {
      mandatesList = mandates
    })

    cy.fixture("api/myPortfolio/performance/getTopDeals").then((json) => {
      getTopDeals = json
    })

    cy.fixture("api/myPortfolio/performance/detailedPerformance").then(
      (json) => {
        detailedPerformance = json
      },
    )
  })

  context("GET | /api/client/performance/get-top-deals", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/performance/get-top-deals?year=2020&quarter=3",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/performance/get-top-deals?year=2020&quarter=3",
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
          url: "/api/client/performance/get-top-deals?year=2020&quarter=3",
        },
        jsonSchema: getTopDeals,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })

  context("GET | /api/client/performance/detailed-performance", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/performance/detailed-performance",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/performance/detailed-performance",
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
          url: "/api/client/performance/detailed-performance",
        },
        jsonSchema: detailedPerformance,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })
})
