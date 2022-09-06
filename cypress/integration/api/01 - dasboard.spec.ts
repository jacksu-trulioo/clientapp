/// <reference types ="Cypress" />

describe("Dashboard", () => {
  let mandatesList
  let profile
  let clientOpp
  let investmentCart
  let getValDate
  let dashPerfMetrics
  let dashPerfChart
  let user

  before(() => {
    cy.loginClient().then((mandates) => {
      mandatesList = mandates
    })

    cy.fixture("api/dashboard/profile").then((json) => {
      profile = json
    })

    cy.fixture("api/dashboard/clientOpportunities").then((json) => {
      clientOpp = json
    })

    cy.fixture("api/dashboard/investmentCart").then((json) => {
      investmentCart = json
    })

    cy.fixture("api/dashboard/getLastValuationDate").then((json) => {
      getValDate = json
    })

    cy.fixture("api/dashboard/dashboardPerformanceMetrics").then((json) => {
      dashPerfMetrics = json
    })

    cy.fixture("api/dashboard/dashboardPerformanceChart").then((json) => {
      dashPerfChart = json
    })
    cy.fixture("api/dashboard/user").then((json) => {
      user = json
    })
  })

  context("GET | /api/client/account/profile", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/account/profile",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/account/profile",
          failOnStatusCode: false,
        },
        "appSession",
      )
    })

    it("should validate json schema", () => {
      let obj = {
        mandatesList,
        requestObj: { method: "GET", url: "/api/client/account/profile" },
        jsonSchema: profile,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })

  context("GET | /api/client/deals/client-opportunities", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/deals/client-opportunities",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/deals/client-opportunities",
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
          url: "/api/client/deals/client-opportunities",
        },
        jsonSchema: clientOpp,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })

  context("GET | /api/client/deals/investment-cart", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/deals/investment-cart",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/deals/investment-cart",
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
          url: "/api/client/deals/investment-cart",
        },
        jsonSchema: investmentCart,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })

  context("GET | /api/client/get-last-valuation-date", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/get-last-valuation-date",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/get-last-valuation-date",
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
          url: "/api/client/get-last-valuation-date",
        },
        jsonSchema: getValDate,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })

  context("GET | /api/client/account/dashboard-performance-metrics", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/account/dashboard-performance-metrics",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/account/dashboard-performance-metrics",
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
          url: "/api/client/account/dashboard-performance-metrics",
        },
        jsonSchema: dashPerfMetrics,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })

  context("GET | /api/client/performance/dashboard-performance-chart", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/performance/dashboard-performance-chart",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/performance/dashboard-performance-chart",
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
          url: "/api/client/performance/dashboard-performance-chart",
        },
        jsonSchema: dashPerfChart,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })

  context("GET | /api/client/user", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/user",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/user",
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
          url: "/api/client/user",
        },
        jsonSchema: user,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })
})
