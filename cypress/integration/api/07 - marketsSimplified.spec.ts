/// <reference types ="Cypress" />

describe("Markets Simplified", () => {
  let mandatesList
  let marketsSimplified
  let getPodcastVideos

  before(() => {
    cy.loginClient().then((mandates) => {
      mandatesList = mandates
    })

    cy.fixture("api/insights/marketsSimplified").then((json) => {
      marketsSimplified = json
    })

    cy.fixture("api/insights/getPodcastVideos").then((json) => {
      getPodcastVideos = json
    })
  })

  context("GET | /api/client/insights/markets-simplified", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/insights/markets-simplified",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/insights/markets-simplified",
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
          url: "/api/client/insights/markets-simplified",
        },
        jsonSchema: marketsSimplified,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })

  context("GET | /api/client/insights/get-podcast-videos", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/insights/get-podcast-videos",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/insights/get-podcast-videos",
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
          url: "/api/client/insights/get-podcast-videos",
        },
        jsonSchema: getPodcastVideos,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })
})
