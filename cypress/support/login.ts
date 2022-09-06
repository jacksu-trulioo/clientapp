let cachedUsername: string

const sessionCookieName = Cypress.env("auth0SessionCookieName")

Cypress.Commands.add("login", (credentials = {}) => {
  const { username, password } = credentials
  const cachedUserIsCurrentUser = cachedUsername && cachedUsername === username
  const _credentials = {
    username: username || Cypress.env("auth0Username"),
    password: password || Cypress.env("auth0Password"),
  }

  try {
    cy.getCookie(sessionCookieName).then((cookieValue) => {
      // Skip logging in again if session already exists.
      if (cookieValue && cachedUserIsCurrentUser) {
        return true
      } else {
        cy.clearCookies()

        cy.getUserTokens(_credentials).then((response) => {
          const { accessToken, expiresIn, idToken, scope } = response

          if (!accessToken) {
            throw new Error("accessToken missing from user token")
          }

          cy.getUserInfo(accessToken).then((user) => {
            const persistedSession = {
              secret: Cypress.env("auth0CookieSecret"),
              user,
              idToken,
              accessToken,
              accessTokenScope: scope,
              accessTokenExpiresAt: Date.now() + expiresIn,
              createdAt: Date.now(),
            }

            cy.task<string>("encrypt", persistedSession).then(
              (encryptedSession) => {
                cy.setCookie(sessionCookieName, encryptedSession, {
                  path: "/",
                  httpOnly: true,
                })
              },
            )
          })
        })
      }
    })
  } catch (error) {
    cy.log(error)
  }
})
