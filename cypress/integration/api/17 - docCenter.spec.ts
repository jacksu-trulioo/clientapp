/// <reference types ="Cypress" />

describe("Document Center", () => {
  let mandatesList
  let docCenter
  let reqBody = {
    action: "list",
  }

  before(() => {
    cy.loginClient().then((mandates) => {
      mandatesList = mandates
    })

    cy.fixture("api/docCenter/docCenter").then((json) => {
      docCenter = json
    })
  })

  context("POST | /api/client/documents/doc-center", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "POST",
        url: "/api/client/documents/doc-center",
        body: reqBody,
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "POST",
          url: "/api/client/documents/doc-center",
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
          url: "/api/client/documents/doc-center",
          body: reqBody,
        },
        jsonSchema: docCenter,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })
})
