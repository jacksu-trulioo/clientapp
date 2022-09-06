Cypress.Commands.add("testByClearCookie", (requestObj, cookieName) => {
  cy.getCookie(cookieName).then((cookie) => {
    cy.clearCookie(cookieName)
    cy.request(requestObj).then((res) => {
      expect(res.status).to.be.eq(401)
    })
    cy.setCookie(cookieName, cookie.value)
  })
})

Cypress.Commands.add(
  "checkJsonSchemaForAllClient",
  ({ mandatesList, requestObj, jsonSchema }) => {
    mandatesList.forEach((mandate) => {
      cy.request({
        method: "POST",
        url: "/api/client/account/mandate",
        body: {
          mandateId: mandate.mandateId,
        },
      })
      cy.request(requestObj).then((res) => {
        expect(res.body).to.be.jsonSchema(jsonSchema)
      })
    })
  },
)

Cypress.Commands.add(
  "testUpdateClientOpportunites",
  ({ mandatesList, requestObj, jsonSchema }) => {
    mandatesList.forEach((mandate) => {
      cy.request({
        method: "POST",
        url: "/api/client/account/mandate",
        body: {
          mandateId: mandate.mandateId,
        },
      })
      cy.request({
        method: "GET",
        url: `/api/client/deals/opportunities?opportunityId=1380`,
      }).then((res) => {
        requestObj.body[0].clientOpportunityId = res.body.clientOpportunityId
        cy.request(requestObj).then((res) => {
          expect(res.body).to.be.jsonSchema(jsonSchema)
        })
      })
    })
  },
)
