import auth from "./auth0Client"

const defaultCredentials = {
  username: Cypress.env("auth0Username"),
  password: Cypress.env("auth0Password"),
}

Cypress.Commands.add("getUserTokens", (credentials = defaultCredentials) => {
  const { username, password } = credentials

  return new Cypress.Promise((resolve, reject) => {
    auth.client.loginWithDefaultDirectory(
      {
        username,
        password,
        audience: Cypress.env("auth0Audience"),
        scope: Cypress.env("auth0Scope"),
      },
      (err, response) => {
        if (err) {
          reject(err)
        } else {
          resolve(response)
        }
      },
    )
  })
})
