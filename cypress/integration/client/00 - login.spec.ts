describe("Login", () => {
  let clientDashboard
  let authKeys

  before(() => {
    cy.fixture("../../public/locales/en/clientDashboard").then((keys) => {
      clientDashboard = keys
    })
    cy.fixture("../../public/locales/en/auth").then((keys) => {
      authKeys = keys
    })
  })

  context("Login for Client", () => {
    it("should login with valid email and password", () => {
      // Go to the site
      cy.visit("/login")
      cy.location("pathname", { timeout: 4000 }).should("match", /login/)
      cy.findByText(authKeys.login.subheading).should("be.visible")
      // Enter registered email
      cy.findByRole("textbox", { name: "email" }).type(
        Cypress.env("clientAuth0Email"),
      )
      // Enter valid password
      cy.findByPlaceholderText("Password").type(
        Cypress.env("clientAuth0Password"),
        { log: false },
      )
      // Click on "Login" button
      cy.findByRole("button", { name: "Login" }).click()
      cy.location("pathname", { timeout: 12000 }).should("match", /client/)
      cy.findByText(clientDashboard.description).should("be.visible")
    })

    it("should login with valid username and password", () => {
      // Go to the site
      cy.visit("/login")
      cy.location("pathname", { timeout: 4000 }).should("match", /login/)
      cy.findByText(authKeys.login.subheading).should("be.visible")
      // Enter valid username
      cy.findByRole("textbox", { name: "email" }).type(
        Cypress.env("clientAuth0Username"),
      )
      // Enter valid password
      cy.findByPlaceholderText("Password").type(
        Cypress.env("clientAuth0Password"),
        { log: false },
      )
      // Click on "Login" button
      cy.findByRole("button", { name: "Login" }).click()
      cy.location("pathname", { timeout: 12000 }).should("match", /client/)
      cy.findByText(clientDashboard.description).should("be.visible")
    })

    it("should not login with wrong / invalid email and password", () => {
      // Go to the site
      cy.visit("/login")
      cy.location("pathname", { timeout: 4000 }).should("match", /login/)
      cy.findByText(authKeys.login.subheading).should("be.visible")
      // Enter wrong / invalid email
      const faker = require("faker")
      cy.findByRole("textbox", { name: "email" }).type(faker.random.alpha(6))
      // Enter wrong / invalid password
      cy.findByPlaceholderText("Password").type(faker.random.alpha(8), {
        log: false,
      })
      // Click on "Login" button
      cy.findByRole("button", { name: "Login" }).click()
      cy.findByText(authKeys.login.toast.error.title).should("be.visible")
    })

    it("should not login with wrong / invalid username and password", () => {
      // Go to the site
      cy.visit("/login")
      cy.location("pathname", { timeout: 4000 }).should("match", /login/)
      cy.findByText(authKeys.login.subheading).should("be.visible")
      // Enter wrong / invalid username
      const faker = require("faker")
      cy.findByRole("textbox", { name: "email" }).type(faker.random.alpha(6))
      // Enter wrong / invalid password
      cy.findByPlaceholderText("Password").type(faker.random.alpha(8), {
        log: false,
      })
      // Click on "Login" button
      cy.findByRole("button", { name: "Login" }).click()
      cy.findByText(authKeys.login.toast.error.title).should("be.visible")
    })

    it("should not login with wrong / invalid username and valid password", () => {
      // Go to the site
      cy.visit("/login")
      cy.location("pathname", { timeout: 4000 }).should("match", /login/)
      cy.findByText(authKeys.login.subheading).should("be.visible")
      // Enter wrong / invalid username
      const faker = require("faker")
      cy.findByRole("textbox", { name: "email" }).type(faker.random.alpha(6))
      // Enter valid password
      cy.findByPlaceholderText("Password").type(
        Cypress.env("clientAuth0Password"),
        { log: false },
      )
      // Click on "Login" button
      cy.findByRole("button", { name: "Login" }).click()
      cy.findByText(authKeys.login.toast.error.title).should("be.visible")
    })

    it("should not login with  wrong / invalid email and valid password", () => {
      // Go to the site
      cy.visit("/login")
      cy.location("pathname", { timeout: 4000 }).should("match", /login/)
      cy.findByText(authKeys.login.subheading).should("be.visible")
      // Enter wrong / invalid email
      const faker = require("faker")
      cy.findByRole("textbox", { name: "email" }).type(faker.random.alpha(6))
      // Enter valid password
      cy.findByPlaceholderText("Password").type(
        Cypress.env("clientAuth0Password"),
        { log: false },
      )
      // Click on "Login" button
      cy.findByRole("button", { name: "Login" }).click()
      cy.findByText(authKeys.login.toast.error.title).should("be.visible")
    })

    it("should not login with valid email and wrong / invalid password", () => {
      // Go to the site
      cy.visit("/login")
      cy.location("pathname", { timeout: 4000 }).should("match", /login/)
      cy.findByText(authKeys.login.subheading).should("be.visible")
      // Enter valid email
      cy.findByRole("textbox", { name: "email" }).type(
        Cypress.env("clientAuth0Email"),
      )
      // Enter  wrong / invalid password
      const faker = require("faker")
      cy.findByPlaceholderText("Password").type(faker.random.alpha(8), {
        log: false,
      })
      // Click on "Login" button
      cy.findByRole("button", { name: "Login" }).click()
      cy.findByText(authKeys.login.toast.error.title).should("be.visible")
    })

    it("should not login with valid username and wrong / invalid password", () => {
      // Go to the site
      cy.visit("/login")
      cy.location("pathname", { timeout: 4000 }).should("match", /login/)
      cy.findByText(authKeys.login.subheading).should("be.visible")
      // Enter valid username
      cy.findByRole("textbox", { name: "email" }).type(
        Cypress.env("clientAuth0Username"),
      )
      // Enter  wrong / invalid password
      const faker = require("faker")
      cy.findByPlaceholderText("Password").type(faker.random.alpha(8), {
        log: false,
      })
      // Click on "Login" button
      cy.findByRole("button", { name: "Login" }).click()
      cy.findByText(authKeys.login.toast.error.title).should("be.visible")
    })

    it("login screen validations", () => {
      // Go to the site
      cy.visit("/login")
      cy.location("pathname", { timeout: 4000 }).should("match", /login/)
      cy.findByText(authKeys.login.subheading).should("be.visible")
      cy.findByLabelText("logo").should("be.visible")
      cy.findByRole("textbox", { name: "email" }).should("be.visible")
      cy.findByPlaceholderText("Password").should("be.visible")
      cy.findByRole("link", { name: "Forgot password?" }).should("be.visible")
      cy.findByRole("button", { name: "Login" })
    })
  })
})
