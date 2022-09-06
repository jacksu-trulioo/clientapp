/// <reference types ="Cypress" />

describe("Profit And Loss", () => {
  let mandatesList
  let crr

  before(() => {
    cy.loginClient().then((mandates) => {
      mandatesList = mandates
    })

    cy.fixture("api/crr/crr").then((json) => {
      crr = json
    })
  })

  context("GET | /api/client/miscellaneous/crr", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/miscellaneous/crr",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/miscellaneous/crr",
          failOnStatusCode: false,
        },
        "appSession",
      )
    })

    it("should validate json schema", () => {
      let singleMandate = [mandatesList[5]]
      let obj = {
        mandatesList: singleMandate,
        requestObj: {
          method: "GET",
          url: "/api/client/miscellaneous/crr",
        },
        jsonSchema: crr,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })
})
