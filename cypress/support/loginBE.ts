Cypress.Commands.add("loginBE", () => {
  const sessionCookieName = Cypress.env("auth0SessionCookieName")
  try {
    cy.request({
      method: "POST",
      url: "https://apimaz-weu-tfo-mvp-dev.azure-api.net/auth/client/token",
      body: {
        username: Cypress.env("auth0Username"),
        password: Cypress.env("auth0Password"),
      },
    }).then((response) => {
      const { accessToken, expiresIn, idToken, scope } = response.body

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
          is_social: false,
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
  } catch (error) {
    cy.log(error)
  }
})
