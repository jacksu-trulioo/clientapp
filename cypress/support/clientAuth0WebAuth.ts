import auth0 from "auth0-js"

// Add this env in cypress.env.json for separately fetch client environment variables
const auth = new auth0.WebAuth({
  domain: Cypress.env("clientAuth0Domain"),
  clientID: Cypress.env("clientAuth0ClientId"),
})

export default auth
