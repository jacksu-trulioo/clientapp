import auth from "./clientAuth0WebAuth"

Cypress.Commands.add("getClientUserInfo", (accessToken) => {
  return new Cypress.Promise((resolve, reject) => {
    auth.client.userInfo(accessToken, (err, user) => {
      if (err) {
        reject(err)
      }

      resolve(user)
    })
  })
})
