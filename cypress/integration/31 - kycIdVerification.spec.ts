describe("KYC - Id Verification: ", () => {
  let kycKeys
  let commonKeys
  const pages = 6

  before(() => {
    cy.fixture("../../public/locales/en/kyc").then((keys) => {
      kycKeys = keys
    })

    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })

    cy.loginBE()
  })
  beforeEach(() => {
    cy.intercept("/api/user/preference", {
      fixture: "userPreferenceENDefault",
    }).as("languagePreference")

    cy.intercept("/api/user", { fixture: "saudiNationalityUser" }).as("user")

    cy.intercept("/api/user/kyc/status", {
      fixture: "kycStatusStep2Completed",
    }).as("kycStatus")

    cy.intercept("/api/user/kyc/investment-experience", {
      fixture: "investmentExperienceJourneyNotStarted",
    }).as("kycInvestmentExperience")

    cy.intercept("/api/user/relationship-manager", {
      fixture: "RMAssigned",
    }).as("relationshipManager")

    cy.intercept("/api/user/kyc/personal-information", {
      fixture: "kycPersonalInformation",
    }).as("kycPersonalInformation")

    cy.intercept("/api/user/summary", {
      fixture: "userSummaryWithLastProposalDate",
    }).as("userSummary")

    cy.intercept("/api/user/investment-goals", {
      fixture: "investmentGoalCompletedResponse",
    }).as("investmentGoalResponse")

    cy.intercept("/api/user/preference/disclaimer", {
      fixture: "userDisclaimerAccepted",
    }).as("userDisclaimerAccepted")

    cy.intercept("/api/user/kyc/hybrid-flow", {
      fixture: "kycNotHybridFlow",
    }).as("kycNotHybridFlow")

    cy.intercept("/api/user/risk-assessment/retake-result", {
      fixture: "retakeRiskAssessmentResult",
    }).as("retakeRiskAssessmentResult")
  })

  context(
    "mobile",
    {
      viewportHeight: 812,
      viewportWidth: 375,
    },
    () => {
      let currentPageIndex = 0

      it("should start journey for id verification on mobile", () => {
        cy.visit("/kyc")

        cy.get("footer")
          .findByRole("button", { name: commonKeys.button.continue })
          .click()
        cy.location("pathname").should("equal", "/kyc/id-verification")
      })

      it("should show progress in progressbar", () => {
        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )
      })

      it("should cancel Save & Exit modal", () => {
        cy.findByRole("button", { name: commonKeys.button.saveAndExit }).click()
        cy.findByRole("button", {
          name: kycKeys.confirmModal.actions.cancel,
        }).click()

        cy.findByRole("heading", { level: 2 })
          .should("have.text", kycKeys.idVerification.passportInfoStep.heading)
          .siblings()
          .findByText(kycKeys.idVerification.passportInfoStep.subtitle)
          .should("be.visible")
      })

      it("should navigate user to dashboard on clicking Save & Exit modal", () => {
        cy.findByRole("button", { name: commonKeys.button.saveAndExit }).click()
        cy.findByRole("button", {
          name: kycKeys.confirmModal.actions.goBack,
        }).click()

        cy.location("pathname").should("equal", "/")
      })

      it("should navigate to KYC completed screen after scheduling call", () => {
        cy.intercept("/api/user/kyc/onboarding-id", "10167").as("onboardingId")
        cy.visit("/kyc/complete")

        cy.findByRole("heading", { level: 2 }).should(
          "have.text",
          kycKeys.completionStep.heading,
        )
      })

      it("should navigate back to dashboard on clicking back to dashboard CTA", () => {
        cy.get("footer")
          .findByRole("link", {
            name: kycKeys.completionStep.goBackToDashboardCta,
          })
          .click()
        cy.location("pathname").should("equal", "/")
      })
    },
  )
})
