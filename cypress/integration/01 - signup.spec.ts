describe("signup", () => {
  let authKeys
  let commonKeys

  before(() => {
    cy.fixture("../../public/locales/en/auth").then((keys) => {
      authKeys = keys
    })

    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })
  })
  // Ensure test user is logged out before starting flow.
  beforeEach(() => {
    cy.intercept("/api/auth/signup").as("signup")
  })

  function signUpClick() {
    cy.get("[name=sign-up]").click()
    cy.get("[name=accept-all]").should("be.disabled")
    cy.get("[name=tos]").scrollTo("bottom")
    cy.get("[name=accept-all]").click()
  }

  context("desktop", () => {
    it("should able to navigate to signup page", () => {
      cy.visit("/login")
      cy.findByRole("link", { name: authKeys.login.link.signup }).click()

      cy.location("pathname").should("equal", "/signup")
    })

    it("should display value proposition section", () => {
      cy.findByRole("heading", {
        level: 2,
        name: authKeys.signup.heading.leftPane,
      })
        .should("be.visible")
        .siblings("div")
        .should("contain.text", authKeys.signup.icons.access.heading)
        .should("contain.text", authKeys.signup.icons.access.description)
        .should("contain.text", authKeys.signup.icons.explore.heading)
        .should("contain.text", authKeys.signup.icons.explore.description)
        .should("contain.text", authKeys.signup.icons.simulate.heading)
        .should("contain.text", authKeys.signup.icons.simulate.description)
    })

    it("should able to enter email and password", () => {
      const randomEmail =
        "testuser" + Math.random().toString(36).substring(2, 9) + "@tfoco.com"
      cy.findByPlaceholderText(authKeys.signup.input.email.placeholder)
        .clear()
        .type(randomEmail)
      cy.findByPlaceholderText(authKeys.signup.input.password.placeholder)
        .clear()
        .type("testPassword@12")
    })

    it("should able to view terms of service", () => {
      cy.findByText(authKeys.signup.checkbox.termsService).click()
      cy.findByText(authKeys.signup.tos.title).should("be.visible")
    })

    it("should able to cancel terms of service", () => {
      cy.findByRole("button", { name: commonKeys.button.cancel }).click()
      cy.findByRole("button", { name: commonKeys.button.cancel }).should(
        "not.exist",
      )
    })

    it("should able to close terms of service from close icon", () => {
      cy.findByText(authKeys.signup.checkbox.termsService).click()
      cy.findByText(authKeys.signup.tos.title).should("be.visible")

      cy.findByRole("button", { name: commonKeys.button.close }).click()
      cy.findByText(authKeys.signup.tos.title).should("not.exist")
    })

    it("should able to accept Terms of service from modal window", () => {
      cy.findByText(authKeys.signup.checkbox.termsService).click()
      cy.findByText(authKeys.signup.tos.title).should("be.visible")

      cy.get("[name=tos]").scrollTo("bottom")
      cy.get("[name=accept-all]").click()

      cy.findByLabelText("termsOfService")
        .parent("label")
        .should("have.attr", "data-checked")
    })

    it("should be able to sign up", () => {
      cy.intercept("/api/auth/signup", { fixture: "signup" }).as(
        "successSignUp",
      )
      cy.findByRole("button", { name: authKeys.signup.button.submit }).click()
      cy.wait("@successSignUp").its("response.statusCode").should("equal", 200)
    })

    it("should navigate back to login page", () => {
      cy.visit("/signup")
      cy.findByRole("link", { name: authKeys.signup.link.login }).click()

      cy.location("pathname").should("equal", "/login")
    })
  })

  // Remove skip after `ar` translation keys have been updated.
  context.skip("RTL", () => {
    it("should able to perform signup", () => {
      cy.visit("/ar/signup")

      const randomEmail =
        "testuser" + Math.random().toString(36).substring(2, 9) + "@tfoco.com"
      cy.get("input[type='email']").type(randomEmail)
      cy.get("input[type='password']").type("testPassword@12")

      signUpClick()

      cy.wait("@signup").its("response.statusCode").should("equal", 200)
    })

    it("should get validation error on password field", () => {
      cy.visit("/ar/signup")

      cy.location("pathname").should("equal", "/ar/signup")

      cy.get("input[type='email']").type("testuser@tfoco.com")
      cy.get("input[type='password']").type("testPassword")

      cy.get("[name=sign-up]").should("be.disabled")

      cy.get("@signup.all").then((interceptions) => {
        expect(interceptions).to.have.length(0)
      })
    })

    it("should navigate back to login page", () => {
      cy.visit("/ar/signup")
      cy.get('a[href*="/ar/login"]').click()

      cy.location("pathname").should("equal", "/ar/login")
    })

    it("should be able to toggle language", () => {
      cy.visit("/ar/signup")
      cy.findByRole("button", { name: /Toggle language/i }).click()

      cy.location("pathname").should("equal", "/signup")
      cy.findByRole("button", { name: /Toggle language/i }).click()

      cy.location("pathname").should("equal", "/ar/signup")
    })
  })

  context(
    "mobile",
    {
      viewportHeight: 812,
      viewportWidth: 375,
    },
    () => {
      it("should able to navigate to signup page", () => {
        cy.visit("/login")
        cy.findByRole("link", { name: authKeys.login.link.signup }).click()

        cy.location("pathname").should("equal", "/signup")
      })

      it("should display value proposition section", () => {
        cy.findByRole("heading", {
          level: 2,
          name: authKeys.signup.heading.leftPane,
        })
          .should("be.visible")
          .siblings("div")
          .should("contain.text", authKeys.signup.icons.access.heading)
          .should("contain.text", authKeys.signup.icons.access.description)
          .should("contain.text", authKeys.signup.icons.explore.heading)
          .should("contain.text", authKeys.signup.icons.explore.description)
          .should("contain.text", authKeys.signup.icons.simulate.heading)
          .should("contain.text", authKeys.signup.icons.simulate.description)
      })

      it("should able to enter email and password", () => {
        const randomEmail =
          "testuser" + Math.random().toString(36).substring(2, 9) + "@tfoco.com"
        cy.findByPlaceholderText(authKeys.signup.input.email.placeholder)
          .clear()
          .type(randomEmail)
        cy.findByPlaceholderText(authKeys.signup.input.password.placeholder)
          .clear()
          .type("testPassword@12")
      })

      it("should able to view terms of service", () => {
        cy.findByText(authKeys.signup.checkbox.termsService).click()
        cy.findByText(authKeys.signup.tos.title).should("be.visible")
      })

      it("should able to cancel terms of service", () => {
        cy.findByRole("button", { name: commonKeys.button.cancel }).click()
        cy.findByRole("button", { name: commonKeys.button.cancel }).should(
          "not.exist",
        )
      })

      it("should able to close terms of service from close icon", () => {
        cy.findByText(authKeys.signup.checkbox.termsService).click()
        cy.findByText(authKeys.signup.tos.title).should("be.visible")

        cy.findByRole("button", { name: commonKeys.button.close }).click()
        cy.findByText(authKeys.signup.tos.title).should("not.exist")
      })

      it("should able to accept Terms of service from modal window", () => {
        cy.findByText(authKeys.signup.checkbox.termsService).click()
        cy.findByText(authKeys.signup.tos.title).should("be.visible")

        cy.get("[name=tos]").scrollTo("bottom")
        cy.get("[name=accept-all]").click()

        cy.findByLabelText("termsOfService")
          .parent("label")
          .should("have.attr", "data-checked")
      })

      it("should be able to sign up", () => {
        cy.intercept("/api/auth/signup", { fixture: "signup" }).as(
          "successSignUp",
        )
        cy.findByRole("button", { name: authKeys.signup.button.submit }).click()
        cy.wait("@successSignUp")
          .its("response.statusCode")
          .should("equal", 200)
      })

      it("should navigate back to login page", () => {
        cy.visit("/signup")
        cy.findByRole("link", { name: authKeys.signup.link.login }).click()

        cy.location("pathname").should("equal", "/login")
      })
    },
  )
})
