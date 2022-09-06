import faker from "faker"

import { User } from "../../src/services/mytfo/types"

const credentials = {
  username: Cypress.env("auth0Username"),
  password: Cypress.env("auth0Password"),
}

describe("login", () => {
  let user: User
  let authKeys
  let commonKeys
  let profileKeys

  before(() => {
    cy.fixture("user").then((mockedUser) => {
      user = mockedUser
    })

    cy.fixture("../../public/locales/en/auth").then((keys) => {
      authKeys = keys
    })

    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })

    cy.fixture("../../public/locales/en/profile").then((keys) => {
      profileKeys = keys
    })
  })

  beforeEach(() => {
    cy.intercept("/api/user/relationship-manager", {
      fixture: "RMNotAssigned",
    }).as("relationshipManager")

    cy.intercept("/api/portfolio/opportunities", {
      fixture: "userOpportunityStatusUnverified",
    }).as("portfolioOpportunities")

    cy.intercept("/api/user/preference", {
      fixture: "userPreferenceENDefault",
    }).as("languagePreference")

    cy.intercept("/api/user/status", {
      fixture: "userStatusNotQualified",
    }).as("userQualificationStatus")

    cy.intercept("/api/portfolio/insights/dashboard", {
      fixture: "dashboardInsights",
    }).as("dashboardInsights")

    cy.intercept("/api/portfolio/webinars/upcomings", {
      fixture: "upcomingWebinars",
    }).as("upcomingWebinars")

    cy.intercept("/api/portfolio/insights/webinars/recent", {
      fixture: "recentWebinars",
    }).as("recentWebinars")

    cy.intercept("/api/user/qualifications/status", {
      statusCode: 500,
    }).as("userStatus")

    cy.intercept("/api/user/investment-goals", {
      statusCode: 500,
    }).as("investmentGoalResponse")

    cy.intercept("/api/user/summary", {
      statusCode: 500,
    }).as("userSummary")

    cy.intercept("/api/user/kyc/status", {
      fixture: "kycNotStarted",
    }).as("kycStatus")

    cy.intercept("/api/user/proposals/status", {
      statusCode: 500,
    }).as("proposalsStatus")

    cy.intercept("/api/user/preference/disclaimer", {
      fixture: "userDisclaimerNotAccepted",
    }).as("userDisclaimerNotAccepted")

    cy.intercept("/api/auth/login").as("login")

    cy.intercept("/api/user", { fixture: "firstTimeUser" }).as("firstTimeUser")
  })

  context("desktop", () => {
    it("should not login without mandatory credentials", () => {
      cy.visit("/login")
      cy.findByRole("button", { name: authKeys.login.button.login }).click()
      cy.findAllByText(commonKeys.errors.required).should("have.length", 2)
    })

    it("should not login with wrong credentials", () => {
      cy.intercept("/api/auth/login", { statusCode: 500 }).as(
        "unsuccessfulLogin",
      )
      cy.findByPlaceholderText(authKeys.login.input.email.placeholder).type(
        faker.internet.email(),
      )
      cy.findByPlaceholderText(authKeys.login.input.password.placeholder).type(
        faker.internet.password(),
      )

      cy.findByRole("button", { name: authKeys.login.button.login }).click()
      cy.wait("@unsuccessfulLogin")
        .its("response.statusCode")
        .should("equal", 500)
      cy.findAllByRole("alert").should("have.length.greaterThan", 0)

      cy.findAllByRole("alert")
        .findByText(authKeys.login.toast.error.title)
        .should("be.visible")
    })

    it("should able to close Email Sent toast message", () => {
      cy.findAllByRole("alert")
        .findByRole("button", { name: commonKeys.button.close })
        .click()
    })

    it("should navigate to forgot password page", () => {
      cy.findByRole("link", {
        name: authKeys.login.link.forgotPassword,
      }).click()
      cy.location("pathname").should("equal", "/password/forgot")
    })

    it("should able to trigger email to reset password", () => {
      cy.intercept("/api/auth/request-password-reset", {
        fixture: "forgotPassword",
      }).as("forgotPassword")
      cy.findByPlaceholderText(authKeys.login.input.email.placeholder).type(
        credentials.username,
      )
      cy.findByRole("button", { name: authKeys.forgot.button.send }).click()
      cy.wait("@forgotPassword").its("response.statusCode").should("equal", 200)

      cy.findAllByRole("alert")
        .should("have.length.greaterThan", 1)
        .then(($alert) => {
          expect($alert.text()).to.contain(authKeys.forgot.toast.success.title)
        })
    })

    it("should able to close Email Sent toast message", () => {
      cy.findAllByRole("alert")
        .findByRole("button", { name: commonKeys.button.close })
        .click()
    })

    it("should display email on which intructions to reset password are sent", () => {
      cy.findByRole("heading", {
        name: authKeys.forgot.emailSentSuccess.heading,
      })
        .siblings()
        .eq(1)
        .findByText(credentials.username)
        .should("be.visible")
    })

    it("should navigate back to login page", () => {
      cy.findByRole("link", { name: authKeys.forgot.link.backToLogin }).click()
      cy.location("pathname").should("equal", "/login")
    })

    it("should be redirected to onboarding profile on login successfully", () => {
      cy.intercept("/api/user/profile", {
        fixture: "userOnboardingProfile",
      }).as("onboardingProfile")

      cy.findByPlaceholderText(authKeys.login.input.email.placeholder)
        .clear()
        .type(credentials.username)
      cy.findByPlaceholderText(authKeys.login.input.password.placeholder)
        .clear()
        .type(credentials.password)
      cy.findByRole("button", { name: authKeys.login.button.login }).click()
      cy.wait("@login").its("response.statusCode").should("equal", 200)

      cy.wait("@firstTimeUser")

      cy.location("pathname").should("equal", "/onboarding/profile")
    })

    it("should display validation error when user doesnot enters profile details", () => {
      cy.intercept("/api/user/profile", {
        fixture: "userOnboardingProfile",
      }).as("onboardingProfile")
      cy.findByRole("button", { name: commonKeys.button.continue }).click()
      cy.findAllByText(commonKeys.errors.required).should("have.length", 5)
    })

    it("should display validation error when user enters numeric profile details", () => {
      cy.findByLabelText(profileKeys.onboarding.input.firstName.label).type(
        "123",
      )
      cy.findByLabelText(profileKeys.onboarding.input.lastName.label).type(
        "123",
      )
      cy.findByRole("button", { name: commonKeys.button.continue }).click()
      cy.findAllByText(commonKeys.errors.alphaAllowed).should("have.length", 2)
    })

    it("should have max character limit for First Name and Last Name", () => {
      cy.findByLabelText(profileKeys.onboarding.input.firstName.label).should(
        "have.attr",
        "maxlength",
        "100",
      )
    })

    it("should Provide First Name and Last Name when user logs in for first time after sign up", () => {
      cy.findByLabelText(profileKeys.onboarding.input.firstName.label)
        .clear()
        .type("ee")
      cy.findByLabelText(profileKeys.onboarding.input.lastName.label)
        .clear()
        .type(user.profile.lastName)
    })

    it("should display GCC countries on top and other countries in alphabetical order", () => {
      cy.findByLabelText("countryOfResidence").type("{home}")
      cy.findAllByRole("button")
        .filter("[tabindex='-1']")
        .then(($elements) => {
          var listOfCountries = Cypress._.map($elements, (el) => el.innerText)

          expect(listOfCountries[0]).to.be.equal("Saudi Arabia")
          expect(listOfCountries[1]).to.be.equal("Bahrain")
          expect(listOfCountries[2]).to.be.equal("Kuwait")
          expect(listOfCountries[3]).to.be.equal("United Arab Emirates")
          expect(listOfCountries[4]).to.be.equal("Oman")
          listOfCountries = Cypress._.drop(listOfCountries, 5)

          cy.wrap(Cypress._.sortBy(listOfCountries)).should(
            "deep.equal",
            listOfCountries,
          )
        })
    })

    it("should type country of residence and selects from dropdown when user logs in for first time after sign up", () => {
      cy.findByLabelText("countryOfResidence").type(
        user.profile.countryOfResidence,
      )
      cy.findByText("Bahrain").click()
    })

    it("should do validation for the length of phone number if the country code is KSA", () => {
      const validationMessage = String(
        commonKeys.errors.phoneNumberLength,
      ).replace("{{digit}}", "9")
      cy.findByLabelText("phoneCountryCode").type("SA +966")
      cy.findByRole("button", { name: "SA +966" }).click()

      cy.findByLabelText("phone number").clear().type("88888888888")

      cy.findByRole("button", { name: commonKeys.button.continue }).click()

      cy.findByText(validationMessage).should("be.visible")
    })

    it("should do validation for the length of phone number if the country code is Kuwait", () => {
      const validationMessage = String(
        commonKeys.errors.phoneNumberLength,
      ).replace("{{digit}}", "8")
      cy.findByLabelText("phoneCountryCode").type("KW +965")
      cy.findByRole("button", { name: "KW +965" }).click()

      cy.findByLabelText("phone number").clear().type("888888888")

      cy.findByRole("button", { name: commonKeys.button.continue }).click()

      cy.findByText(validationMessage).should("be.visible")
    })

    it("should do validation for the length of phone number if the country code is Bahrain", () => {
      const validationMessage = String(
        commonKeys.errors.phoneNumberLength,
      ).replace("{{digit}}", "8")
      cy.findByLabelText("phoneCountryCode").type("BH +973")
      cy.findByRole("button", { name: "BH +973" }).click()

      cy.findByLabelText("phone number").clear().type("8888888888")

      cy.findByRole("button", { name: commonKeys.button.continue }).click()

      cy.findByText(validationMessage).should("be.visible")
    })

    it("should do validation for the length of phone number if the country code is Oman", () => {
      const validationMessage = String(
        commonKeys.errors.phoneNumberLength,
      ).replace("{{digit}}", "8")
      cy.findByLabelText("phoneCountryCode").type("OM +968")
      cy.findByRole("button", { name: "OM +968" }).click()

      cy.findByLabelText("phone number").clear().type("888888888")

      cy.findByRole("button", { name: commonKeys.button.continue }).click()

      cy.findByText(validationMessage).should("be.visible")
    })

    it("should do validation for the length of phone number if the country code is other than KSA/ Kuwait / Bahrain or Oman", () => {
      const validationMessage = String(
        commonKeys.errors.phoneNumberLengthMax,
      ).replace("{{digit}}", "15")
      cy.findByLabelText("phoneCountryCode").type("IN +91")
      cy.findByRole("button", { name: "IN +91" }).click()

      cy.findByLabelText("phone number").clear().type("88888888888888888")

      cy.findByRole("button", { name: commonKeys.button.continue }).click()

      cy.findByText(validationMessage).should("be.visible")
    })

    it("should select phone country code and type phone number when user logs in for first time after sign up", () => {
      cy.findByLabelText("phoneCountryCode").type(user.profile.phoneCountryCode)
      cy.findByText("IN +91").click()
      cy.findByLabelText("phone number").clear().type(user.profile.phoneNumber)
    })

    it("should be navigated to dashboard after providing onboarding details", () => {
      cy.intercept("/api/user/profile", {
        fixture: "userOnboardingProfile",
      }).as("onboardingProfile")

      cy.intercept("/api/user", { fixture: "user" }).as("user")

      cy.findByRole("button", { name: commonKeys.button.continue }).click()
      cy.location("pathname").should("equal", "/")
    })

    context("RTL", () => {
      before(() => {
        cy.logout()
        cy.visit("/login")
      })

      it("should toggle language on login screen", () => {
        cy.findByRole("button", { name: /Toggle language/i }).click()
        cy.location("pathname").should("equal", "/ar/login")
        cy.findByRole("button", { name: /Toggle language/i }).contains(
          "English",
        )
        cy.findByRole("button", { name: /Toggle language/i })
      })

      it("should login successfully on entering valid credentials when user signed up with arabic context", () => {
        cy.intercept("/api/user/preference", {
          fixture: "userPreferenceARDefault",
        }).as("languagePreference")

        cy.findAllByRole("group").eq(0).find("input").type(credentials.username)
        cy.findAllByRole("group").eq(1).find("input").type(credentials.password)
        cy.findAllByRole("button").eq(1).click()
        cy.wait("@login").its("response.statusCode").should("equal", 200)
        cy.wait("@firstTimeUser")
      })

      it("should be redirected to ar onboarding profile screen if first time user signs up with ar context", () => {
        cy.location("pathname").should("equal", "/ar/onboarding/profile")
      })

      it("should be redirected to ar dashboard screen if user has set up language preferences as arabic", () => {
        cy.intercept("/api/user/preference", {
          fixture: "userPreferenceARDefault",
        }).as("languagePreference")

        cy.intercept("/api/user", { fixture: "user" }).as("user")

        cy.logout()
        cy.visit("/login")
        cy.findByPlaceholderText(authKeys.login.input.email.placeholder)
          .clear()
          .type(credentials.username)
        cy.findByPlaceholderText(authKeys.login.input.password.placeholder)
          .clear()
          .type(credentials.password)
        cy.findByRole("button", { name: authKeys.login.button.login }).click()
        cy.wait("@login").its("response.statusCode").should("equal", 200)
        cy.location("pathname").should("equal", "/ar")
      })
    })
  })

  context(
    "mobile",
    {
      viewportHeight: 812,
      viewportWidth: 375,
    },
    () => {
      before(() => {
        cy.logout()
        cy.visit("/login")
      })

      it("should not login without mandatory credentials", () => {
        cy.findByRole("button", { name: authKeys.login.button.login }).click()
        cy.findAllByText(commonKeys.errors.required).should("have.length", 2)
      })

      it("should not login with wrong credentials", () => {
        cy.intercept("/api/auth/login", { statusCode: 500 }).as(
          "unsuccessfulLogin",
        )
        cy.findByPlaceholderText(authKeys.login.input.email.placeholder).type(
          faker.internet.email(),
        )
        cy.findByPlaceholderText(
          authKeys.login.input.password.placeholder,
        ).type(faker.internet.password())

        cy.findByRole("button", { name: authKeys.login.button.login }).click()
        cy.wait("@unsuccessfulLogin")
          .its("response.statusCode")
          .should("equal", 500)
        cy.findAllByRole("alert").should("have.length.greaterThan", 0)

        cy.findAllByRole("alert")
          .findByText(authKeys.login.toast.error.title)
          .should("be.visible")
      })

      it("should able to close toast message", () => {
        cy.findAllByRole("alert")
          .findByRole("button", { name: commonKeys.button.close })
          .click()
      })

      it("should navigate to forgot password page", () => {
        cy.findByRole("link", {
          name: authKeys.login.link.forgotPassword,
        }).click()
        cy.location("pathname").should("equal", "/password/forgot")
      })

      it("should able to trigger email to reset password", () => {
        cy.intercept("/api/auth/request-password-reset", {
          fixture: "forgotPassword",
        }).as("forgotPassword")
        cy.findByPlaceholderText(authKeys.login.input.email.placeholder).type(
          credentials.username,
        )
        cy.findByRole("button", { name: authKeys.forgot.button.send }).click()
        cy.wait("@forgotPassword")
          .its("response.statusCode")
          .should("equal", 200)
        cy.findAllByRole("alert")
          .should("have.length.greaterThan", 1)
          .then(($alert) => {
            expect($alert.text()).to.contain(
              authKeys.forgot.toast.success.title,
            )
          })
      })

      it("should able to close Email Sent toast message", () => {
        cy.findAllByRole("alert")
          .findByRole("button", { name: commonKeys.button.close })
          .click()
      })

      it("should display email on which intructions to reset password are sent", () => {
        cy.findByRole("heading", {
          name: authKeys.forgot.emailSentSuccess.heading,
        })
          .siblings()
          .eq(1)
          .findByText(credentials.username)
          .should("be.visible")
      })

      it("should navigate back to login page", () => {
        cy.findByRole("link", {
          name: authKeys.forgot.link.backToLogin,
        }).click()
        cy.location("pathname").should("equal", "/login")
      })

      it("should be redirected to onboarding profile screen on entering valid credentials", () => {
        cy.findByPlaceholderText(authKeys.login.input.email.placeholder)
          .clear()
          .type(credentials.username)
        cy.findByPlaceholderText(authKeys.login.input.password.placeholder)
          .clear()
          .type(credentials.password)
        cy.findByRole("button", { name: authKeys.login.button.login }).click()
        cy.wait("@login").its("response.statusCode").should("equal", 200)
        cy.wait("@firstTimeUser")
        cy.location("pathname").should("equal", "/onboarding/profile")
      })

      it("should display validation error when user doesnot enters profile details", () => {
        cy.findByRole("button", { name: commonKeys.button.continue }).click()
        cy.findAllByText(commonKeys.errors.required).should("have.length", 5)
      })

      it("should display validation error when user enters numeric profile details", () => {
        cy.findByLabelText(profileKeys.onboarding.input.firstName.label).type(
          "123",
        )
        cy.findByLabelText(profileKeys.onboarding.input.lastName.label).type(
          "123",
        )

        cy.findByRole("button", { name: commonKeys.button.continue }).click()
        cy.findAllByText(commonKeys.errors.alphaAllowed).should(
          "have.length",
          2,
        )
      })

      it("should have max character limit for First Name and Last Name", () => {
        cy.findByLabelText(profileKeys.onboarding.input.firstName.label).should(
          "have.attr",
          "maxlength",
          "100",
        )
      })

      it("should Provide First Name and Last Name when user logs in for first time after sign up", () => {
        cy.findByLabelText(profileKeys.onboarding.input.firstName.label)
          .clear()
          .type("ee")
        cy.findByLabelText(profileKeys.onboarding.input.lastName.label)
          .clear()
          .type(user.profile.lastName)
      })

      it("should type country of residence and selects from dropdown when user logs in for first time after sign up", () => {
        cy.findByLabelText("countryOfResidence").type(
          user.profile.countryOfResidence,
        )
        cy.findByText("Bahrain").click()
      })

      it("should do validation for the length of phone number if the country code is KSA", () => {
        const validationMessage = String(
          commonKeys.errors.phoneNumberLength,
        ).replace("{{digit}}", "9")
        cy.findByLabelText("phoneCountryCode").type("SA +966")
        cy.findByRole("button", { name: "SA +966" }).click()

        cy.findByLabelText("phone number").clear().type("8888888888888")

        cy.findByRole("button", { name: commonKeys.button.continue }).click()

        cy.findByText(validationMessage).should("be.visible")
      })

      it("should do validation for the length of phone number if the country code is Kuwait", () => {
        const validationMessage = String(
          commonKeys.errors.phoneNumberLength,
        ).replace("{{digit}}", "8")
        cy.findByLabelText("phoneCountryCode").type("KW +965")
        cy.findByRole("button", { name: "KW +965" }).click()

        cy.findByLabelText("phone number").clear().type("88888888888")

        cy.findByRole("button", { name: commonKeys.button.continue }).click()

        cy.findByText(validationMessage).should("be.visible")
      })

      it("should do validation for the length of phone number if the country code is Bahrain", () => {
        const validationMessage = String(
          commonKeys.errors.phoneNumberLength,
        ).replace("{{digit}}", "8")
        cy.findByLabelText("phoneCountryCode").type("BH +973")
        cy.findByRole("button", { name: "BH +973" }).click()

        cy.findByLabelText("phone number").clear().type("888888888888")

        cy.findByRole("button", { name: commonKeys.button.continue }).click()

        cy.findByText(validationMessage).should("be.visible")
      })

      it("should do validation for the length of phone number if the country code is Oman", () => {
        const validationMessage = String(
          commonKeys.errors.phoneNumberLength,
        ).replace("{{digit}}", "8")
        cy.findByLabelText("phoneCountryCode").type("OM +968")
        cy.findByRole("button", { name: "OM +968" }).click()

        cy.findByLabelText("phone number").clear().type("888888888888")

        cy.findByRole("button", { name: commonKeys.button.continue }).click()

        cy.findByText(validationMessage).should("be.visible")
      })

      it("should do validation for the length of phone number if the country code is other than KSA/ Kuwait / Bahrain or Oman", () => {
        const validationMessage = String(
          commonKeys.errors.phoneNumberLengthMax,
        ).replace("{{digit}}", "15")
        cy.findByLabelText("phoneCountryCode").type("IN +91")
        cy.findByRole("button", { name: "IN +91" }).click()

        cy.findByLabelText("phone number").clear().type("8888888888888888")

        cy.findByRole("button", { name: commonKeys.button.continue }).click()

        cy.findByText(validationMessage).should("be.visible")
      })

      it("should select phone country code and type phone number when user logs in for first time after sign up", () => {
        cy.findByLabelText("phoneCountryCode").type(
          user.profile.phoneCountryCode,
        )
        cy.findByText("IN +91").click()
        cy.findByLabelText("phone number")
          .clear()
          .type(user.profile.phoneNumber)
      })

      it("should be navigated to dashboard after providing onboarding details", () => {
        cy.intercept("/api/user/profile", {
          fixture: "userOnboardingProfile",
        }).as("onboardingProfile")

        cy.intercept("/api/user", { fixture: "user" }).as("user")

        cy.findByRole("button", { name: commonKeys.button.continue }).click()
        cy.location("pathname").should("equal", "/")
      })
    },
  )
})
