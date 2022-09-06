// Add this env in cypress.env.json for separately fetch client environment variables
Cypress.Commands.add("getMandateId", (accessToken) => {
  cy.request({
    method: "GET",
    url: `${Cypress.env(
      "clientBaseURL",
    )}/account/api/v2/mandate-authentications`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      identifier: "auth0",
    },
  }).then((response) => {
    if (!response.body) {
      let err = new Error("No mandateId")
      return err
    }

    return response.body
  })
})
