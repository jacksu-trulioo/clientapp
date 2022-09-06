/// <reference types ="Cypress" />

describe("Market Archive", () => {
  let mandatesList
  let marketArchive
  let getInsightDetails
  let reqBody = {
    lang: "en",
    count: 3,
    type: "all",
    category: "",
    currentPage: 1,
  }

  before(() => {
    cy.loginClient().then((mandates) => {
      mandatesList = mandates
    })

    cy.fixture("api/insights/marketArchive").then((json) => {
      marketArchive = json
    })

    cy.fixture("api/insights/getInsightDetails").then((json) => {
      getInsightDetails = json
    })
  })

  context("POST | /api/client/insights/insights-market-archive", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "POST",
        url: "/api/client/insights/insights-market-archive",
        body: reqBody,
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "POST",
          url: "/api/client/insights/insights-market-archive",
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
          url: "/api/client/insights/insights-market-archive",
          body: reqBody,
        },
        jsonSchema: marketArchive,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })

  context("GET | /api/client/insights/get-insight-details", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/insights/get-insight-details?id=149701030&langCode=en",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/insights/get-insight-details?id=149701030&langCode=en",
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
          url: "/api/client/insights/get-insight-details?id=149701030&langCode=en",
        },
        jsonSchema: getInsightDetails,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })
})
