import { RelationshipManager, User } from "../../src/services/mytfo/types"

let commonKeys
let profileKeys
let homeKeys
let relationshipManager: RelationshipManager

describe("profile: personal and contact information", () => {
  let user: User
  before(() => {
    cy.fixture("user").then((userDetails) => {
      user = userDetails
    })

    cy.fixture("RMAssigned").then((rmDetails) => {
      relationshipManager = rmDetails
    })
    cy.loginBE()

    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })

    cy.fixture("../../public/locales/en/profile").then((keys) => {
      profileKeys = keys
    })

    cy.fixture("../../public/locales/en/home").then((keys) => {
      homeKeys = keys
    })
  })

  beforeEach(() => {
    cy.intercept("/api/user", { fixture: "user" }).as("user")

    cy.intercept("/api/user/relationship-manager", {
      fixture: "RMNotAssigned",
    }).as("relationshipManager")

    cy.intercept("/api/portfolio/opportunities", {
      fixture: "userOpportunityStatusUnverified",
    }).as("portfolioOpportunities")

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
      fixture: "proposalJourneyNotStarted",
    }).as("userStatus")

    cy.intercept("/api/user/preference/disclaimer", {
      fixture: "userDisclaimerAccepted",
    }).as("userDisclaimerAccepted")

    cy.intercept("/api/user/preference", {
      fixture: "userPreferenceENDefault",
    }).as("languagePreference")

    cy.intercept("/api/user/investment-goals", {
      fixture: "investmentGoalQuizNotStarted",
    }).as("investmentGoalResponse")

    cy.intercept("/api/user/summary", {
      fixture: "userSummaryFreshUser",
    }).as("userSummary")

    cy.intercept("/api/user/proposals/status", {
      fixture: "proposalsStatusNotStarted",
    }).as("proposalsStatus")

    cy.intercept("/api/user/kyc/status", {
      fixture: "kycNotStarted",
    }).as("kycStatus")

    cy.intercept("/api/user/risk-assessment", {
      fixture: "riskAssessmentQuizNotStarted",
    }).as("riskAssessmentResponse")
  })

  context("desktop", () => {
    it("should able to navigate to profile screen", () => {
      cy.visit("/")

      cy.findByRole("button", { name: user.profile.firstName }).click()

      cy.findByText(commonKeys.nav.links.profile).click()

      cy.location("pathname").should("equal", "/profile")
    })

    it("should not able to edit first name", () => {
      cy.findByText(profileKeys.tabs.personal.fields.label.firstName)
        .siblings("input")
        .should("be.disabled")
    })

    it("should fill first name by default", () => {
      cy.findByText(profileKeys.tabs.personal.fields.label.firstName)
        .siblings("input")
        .should("have.value", user.profile.firstName)
    })

    it("should not able to edit last name", () => {
      cy.findByText(profileKeys.tabs.personal.fields.label.lastName)
        .siblings("input")
        .should("be.disabled")
    })

    it("should fill last name by default", () => {
      cy.findByText(profileKeys.tabs.personal.fields.label.lastName)
        .siblings("input")
        .should("have.value", user.profile.lastName)
    })

    it("should not able to edit Personal Email", () => {
      cy.findByText(profileKeys.tabs.personal.fields.label.email)
        .siblings("input")
        .should("be.disabled")
    })

    it("should fill Personal Email by default", () => {
      cy.findByText(profileKeys.tabs.personal.fields.label.email)
        .siblings("input")
        .should("have.value", user.email)
    })

    it("should be able to edit Personal Phone Number", () => {
      cy.findByLabelText("phoneCountryCode")
        .children("div")
        .children("div")
        .should("have.attr", "data-disabled", "true")
      cy.findByLabelText("phoneNumber").should("be.disabled")
    })

    it("should fill Personal Phone Number by default", () => {
      cy.findByLabelText("phoneCountryCode").should(
        "contain.text",
        user.profile.phoneCountryCode,
      )
      cy.findByLabelText("phoneNumber").should(
        "have.value",
        user.profile.phoneNumber,
      )
    })

    it("should able to navigate back from profile screen using Back button", () => {
      cy.findByRole("button", { name: commonKeys.button.back }).click()

      cy.location("pathname").should("equal", "/")
    })

    it("should able to navigate to preferences tab", () => {
      cy.visit("/profile")

      cy.wait(["@languagePreference", "@relationshipManager"])

      cy.findByRole("tab", { name: profileKeys.tabs.preferences.name }).click()
    })

    it("should be able to close change password window", () => {
      cy.findByRole("button", {
        name: profileKeys.changePassword.button.change,
      }).click()
      cy.findByLabelText(commonKeys.button.close).click()
      cy.findByRole("tab", { name: profileKeys.tabs.preferences.name }).should(
        "be.visible",
      )
    })

    it("should see the language used while signed up as the default language being set as the preference", () => {
      cy.findByRole("button", {
        name: profileKeys.tabs.preferences.button.applyChanges,
      }).should("be.visible")
      cy.findAllByRole("group")
        .eq(0)
        .then(($element) => {
          expect($element.text()).to.equal("English")
        })
    })

    it("should see the language preferences that are available as English and Arabic in a drop down list", () => {
      cy.findAllByRole("group").eq(0).click()
      const languagePreferances = ["English", "Arabic"]
      cy.findAllByRole("group")
        .eq(0)
        .findAllByRole("button")

        .should("have.length", 2)
        .each(($el) => {
          expect(languagePreferances).to.include($el.text())
        })
    })

    it("should able to change language preferance from English to Arabic in real time", () => {
      cy.intercept("/api/user/preference", {
        fixture: "userPreferenceARDefault",
      }).as("languagePreference")
      cy.findByRole("button", { name: "Arabic" }).click()
      cy.findByRole("button", {
        name: profileKeys.tabs.preferences.button.applyChanges,
      }).click()
      cy.wait("@languagePreference")
      cy.location("pathname").should("equal", "/ar")
    })

    it("should view RM assigned in profile", () => {
      cy.intercept("/api/user/relationship-manager", {
        fixture: "RMAssigned",
      }).as("relationshipManager")

      cy.visit("/profile")
      const manager =
        relationshipManager.manager.firstName +
        " " +
        relationshipManager.manager.lastName
      cy.findByText(manager).should("be.visible")
    })

    it("should able to call relationship manager", () => {
      cy.intercept("/api/user/relationship-manager", {
        fixture: "RMAssigned",
      }).as("relationshipManager")

      cy.findByRole("button", {
        name: homeKeys.cta.relationshipManager.button.meeting,
      }).click()

      cy.location("pathname").should("equal", "/schedule-meeting")
    })

    it("Should display CTA for sending message to RM", () => {
      cy.intercept("/api/user/relationship-manager", {
        fixture: "RMAssigned",
      }).as("relationshipManager")

      cy.visit("/profile")
      cy.wait(["@languagePreference", "@relationshipManager"])

      cy.findByRole("button", {
        name: homeKeys.cta.relationshipManager.button.message,
      }).should("be.visible")
    })

    it("should disable change password CTA when user has done social login", () => {
      cy.logout()

      cy.loginSocial()

      cy.visit("/profile")

      cy.findByRole("tab", { name: profileKeys.tabs.preferences.name }).click()

      cy.findByRole("button", {
        name: profileKeys.changePassword.button.change,
      }).should("be.disabled")
    })
  })

  context(
    "mobile",
    {
      viewportHeight: 812,
      viewportWidth: 375,
    },
    () => {
      it("should able to navigate to profile screen", () => {
        cy.visit("/")

        cy.findByRole("button", { name: /Hamburger Menu/i }).click()
        cy.findByRole("link", { name: user.profile.firstName }).click()

        cy.location("pathname").should("equal", "/profile")
      })

      it("should able to expand personal details accordion", () => {
        cy.findByRole("button", {
          name: profileKeys.tabs.personal.name,
        }).click()
      })

      it("should not able to edit first name", () => {
        cy.findByText(profileKeys.tabs.personal.fields.label.firstName)
          .siblings("input")
          .should("be.disabled")
      })

      it("should fill first name by default", () => {
        cy.findByText(profileKeys.tabs.personal.fields.label.firstName)
          .siblings("input")
          .should("have.value", user.profile.firstName)
      })

      it("should not able to edit last name", () => {
        cy.findByText(profileKeys.tabs.personal.fields.label.lastName)
          .siblings("input")
          .should("be.disabled")
      })

      it("should fill last name by default", () => {
        cy.findByText(profileKeys.tabs.personal.fields.label.lastName)
          .siblings("input")
          .should("have.value", user.profile.lastName)
      })

      it("should not able to edit Personal Email", () => {
        cy.findByText(profileKeys.tabs.personal.fields.label.email)
          .siblings("input")
          .should("be.disabled")
      })

      it("should fill Personal Email by default", () => {
        cy.findByText(profileKeys.tabs.personal.fields.label.email)
          .siblings("input")
          .should("have.value", user.email)
      })

      it("should be able to edit Personal Phone Number", () => {
        cy.findByLabelText("phoneCountryCode")
          .children("div")
          .children("div")
          .should("have.attr", "data-disabled", "true")
        cy.findByLabelText("phoneNumber").should("be.disabled")
      })

      it("should fill Personal Phone Number by default", () => {
        cy.findByLabelText("phoneCountryCode").should(
          "contain.text",
          user.profile.phoneCountryCode,
        )
        cy.findByLabelText("phoneNumber").should(
          "have.value",
          user.profile.phoneNumber,
        )
      })

      it("should able to navigate back from profile screen using Back button", () => {
        cy.findByRole("button", { name: commonKeys.button.back }).click()

        cy.location("pathname").should("equal", "/")
      })

      it("should able to expand preferences accordion", () => {
        cy.visit("/profile")

        cy.wait(["@languagePreference", "@relationshipManager"])

        cy.findByRole("button", {
          name: profileKeys.tabs.preferences.name,
        }).click()
      })

      it("should see the language used while signed up as the default language being set as the preference", () => {
        cy.findByRole("button", {
          name: profileKeys.tabs.preferences.button.applyChanges,
        }).should("be.visible")
        cy.findAllByRole("group")
          .eq(0)
          .then(($element) => {
            expect($element.text()).to.equal("English")
          })
      })

      it("should see the language preferences that are available as English and Arabic in a drop down list", () => {
        cy.findAllByRole("group").eq(0).click()
        const languagePreferances = ["English", "Arabic"]
        cy.findAllByRole("group")
          .eq(0)
          .findAllByRole("button")
          .should("have.length", 2)
          .each(($el) => {
            expect(languagePreferances).to.include($el.text())
          })
      })

      it("should able to change language preferance from English to Arabic in real time", () => {
        cy.findByRole("button", { name: "Arabic" }).click()
        cy.findByRole("button", {
          name: profileKeys.tabs.preferences.button.applyChanges,
        }).click()
        cy.wait("@languagePreference")
        cy.location("pathname").should("equal", "/ar")
      })

      it("should view RM assigned in profile", () => {
        cy.intercept("/api/user/relationship-manager", {
          fixture: "RMAssigned",
        }).as("relationshipManager")

        cy.visit("/profile")
        const manager =
          relationshipManager.manager.firstName +
          " " +
          relationshipManager.manager.lastName
        cy.findByText(manager).should("be.visible")
      })

      it("should be able to expand contact for RM", () => {
        cy.findByRole("button", {
          name: homeKeys.cta.relationshipManager.button.contact,
        }).click()
        cy.findByRole("button", {
          name: homeKeys.cta.relationshipManager.button.message,
        }).should("be.visible")
        cy.findByRole("button", {
          name: homeKeys.cta.relationshipManager.button.meeting,
        }).should("be.visible")
      })

      it("should able to call relationship manager", () => {
        cy.intercept("/api/user/relationship-manager", {
          fixture: "RMAssigned",
        }).as("relationshipManager")

        cy.findByRole("button", {
          name: homeKeys.cta.relationshipManager.button.meeting,
        }).click()

        cy.location("pathname").should("equal", "/schedule-meeting")
      })

      it("should display CTA for sending message to RM", () => {
        cy.intercept("/api/user/relationship-manager", {
          fixture: "RMAssigned",
        }).as("relationshipManager")

        cy.visit("/profile")
        cy.wait(["@languagePreference", "@relationshipManager"])

        cy.findByRole("button", {
          name: homeKeys.cta.relationshipManager.button.contact,
        }).click()

        cy.findByRole("button", {
          name: homeKeys.cta.relationshipManager.button.message,
        }).should("be.visible")
      })
    },
  )
})
