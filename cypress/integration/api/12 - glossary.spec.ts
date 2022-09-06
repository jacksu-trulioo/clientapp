/// <reference types ="Cypress" />

describe("Glossary", () => {
  let mandatesList
  let glossary

  before(() => {
    cy.loginClient().then((mandates) => {
      mandatesList = mandates
    })

    cy.fixture("api/glossary/glossary").then((json) => {
      glossary = json
    })
  })

  context("GET | /api/client/miscellaneous/glossaries", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "GET",
        url: "/api/client/miscellaneous/glossaries?term=all",
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "GET",
          url: "/api/client/miscellaneous/glossaries?term=all",
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
          url: "/api/client/miscellaneous/glossaries?term=all",
        },
        jsonSchema: glossary,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })
})
