/// <reference types ="Cypress" />

describe("Portfolio Summary", () => {
  let mandatesList
  let recentActivities
  let portSummaryAlloc
  let portfolioOverview
  let synthesia
  let portfolioActivity

  before(() => {
    cy.loginClient().then((mandates) => {
      mandatesList = mandates
    })

    cy.fixture("api/myPortfolio/portfolioSummary/recentActivities").then(
      (json) => {
        recentActivities = json
      },
    )

    cy.fixture(
      "api/myPortfolio/portfolioSummary/portfolioSummaryAllocation",
    ).then((json) => {
      portSummaryAlloc = json
    })

    cy.fixture("api/myPortfolio/portfolioSummary/portfolioOverview").then(
      (json) => {
        portfolioOverview = json
      },
    )

    cy.fixture("api/myPortfolio/portfolioSummary/synthesia").then((json) => {
      synthesia = json
    })

    cy.fixture("api/myPortfolio/portfolioSummary/portfolioActivity").then(
      (json) => {
        portfolioActivity = json
      },
    )
  })

  context("GET | /api/client/deals/recent-activities", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/deals/recent-activities",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/deals/recent-activities",
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
          url: "/api/client/deals/recent-activities",
        },
        jsonSchema: recentActivities,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })

  context("GET | /api/client/deals/portfolio-summary-allocation", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/deals/portfolio-summary-allocation",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })
    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/deals/portfolio-summary-allocation",
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
          url: "/api/client/deals/portfolio-summary-allocation",
        },
        jsonSchema: portSummaryAlloc,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })

  context("GET | /api/client/account/portfolio-overview", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/account/portfolio-overview",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/account/portfolio-overview",
          failOnStatusCode: false,
        },
        "appSession",
      )
    })

    it("should validate the json schema", () => {
      let obj = {
        mandatesList,
        requestObj: {
          method: "GET",
          url: "/api/client/account/portfolio-overview",
        },
        jsonSchema: portfolioOverview,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })

  context("GET | /api/client/miscellaneous/synthesia", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/miscellaneous/synthesia",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/miscellaneous/synthesia",
          failOnStatusCode: false,
        },
        "appSession",
      )
    })

    it("should validate the json schema", () => {
      let obj = {
        mandatesList,
        requestObj: {
          method: "GET",
          url: "/api/client/miscellaneous/synthesia",
        },
        jsonSchema: synthesia,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })

  context("GET | /api/client/miscellaneous/portfolio-activity", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/miscellaneous/portfolio-activity",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/miscellaneous/portfolio-activity",
          failOnStatusCode: false,
        },
        "appSession",
      )
    })

    it("should validate the json schema", () => {
      let obj = {
        mandatesList,
        requestObj: {
          method: "GET",
          url: "/api/client/miscellaneous/portfolio-activity",
        },
        jsonSchema: portfolioActivity,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })
})
