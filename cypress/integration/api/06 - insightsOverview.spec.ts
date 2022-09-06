/// <reference types ="Cypress" />

describe("Insights Overview", () => {
  let mandatesList
  let insightsLandingPage
  let getPodcastVideos
  let latestInsights

  before(() => {
    cy.loginClient().then((mandates) => {
      mandatesList = mandates
    })

    cy.fixture("api/insights/insightsLandingPage").then((json) => {
      insightsLandingPage = json
    })

    cy.fixture("api/insights/getPodcastVideos").then((json) => {
      getPodcastVideos = json
    })

    cy.fixture("api/insights/latestInsights").then((json) => {
      latestInsights = json
    })
  })

  context("GET | /api/client/insights/insights-landing-page", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/insights/insights-landing-page",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/insights/insights-landing-page",
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
          url: "/api/client/insights/insights-landing-page",
        },
        jsonSchema: insightsLandingPage,
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

  context("GET | /api/client/insights/latest-insights", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/insights/latest-insights",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/insights/latest-insights",
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
          url: "/api/client/insights/latest-insights",
        },
        jsonSchema: latestInsights,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })
})
