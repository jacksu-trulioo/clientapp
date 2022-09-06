// Add this env in cypress.env.json for separately fetch client environment variables.
Cypress.Commands.add("loginClient", () => {
  const sessionCookieName = Cypress.env("auth0SessionCookieName")
  try {
    cy.request({
      method: "POST",
      url: "https://apimaz-weu-tfo-mvp-qa.azure-api.net/auth/client/token",
      body: {
        username: Cypress.env("clientAuth0Username"),
        password: Cypress.env("clientAuth0Password"),
      },
    }).then((response) => {
      const { accessToken, expiresIn, idToken, scope, roles } = response.body
      let persistedSession: PersistedSession = {
        secret: Cypress.env("auth0CookieSecret"),
        accessToken,
        idToken,
        accessTokenScope: scope,
        accessTokenExpiresAt: Date.now() + expiresIn,
        createdAt: Date.now(),
        role: roles,
      }
      if (!accessToken) {
        throw new Error("access_token missing from user token")
      }
      if (roles.includes("client-desktop")) {
        cy.getMandateId(accessToken).then((mandateList) => {
          cy.getUserInfo(accessToken).then((user) => {
            persistedSession.user = user
            persistedSession.mandateId = mandateList[0].mandateId

            cy.task<string>("encrypt", persistedSession).then(
              (encryptedSession) => {
                cy.setCookie(sessionCookieName, encryptedSession, {
                  path: "/",
                  httpOnly: true,
                })
              },
            )
          })
          cy.wrap(mandateList)
        })
      } else {
        cy.getUserInfo(accessToken).then((user) => {
          persistedSession.user = user
          persistedSession.mandateId = null

          cy.task<string>("encrypt", persistedSession).then(
            (encryptedSession) => {
              cy.setCookie(sessionCookieName, encryptedSession, {
                path: "/",
                httpOnly: true,
              })
            },
          )
        })
      }
    })
  } catch (error) {
    cy.log(error)
  }
})

type PersistedSession = {
  secret: string
  accessToken: string
  idToken: string
  user?: object
  accessTokenScope: string
  accessTokenExpiresAt: Date
  createdAt: number
  role: Array<string>
  mandateId?: number | null
}
