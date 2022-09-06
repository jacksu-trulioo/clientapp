describe("Accept proposal: As a user who completed the pre-proposal journey and is qualified, would be able to see accepted proposal", () => {
  let personalisedProposalKeys
  let personalisedProposalArKeys
  let commonKeys

  before(() => {
    cy.fixture("../../public/locales/en/personalizedProposal").then((keys) => {
      personalisedProposalKeys = keys
    })

    cy.fixture("../../public/locales/ar/personalizedProposal").then((keys) => {
      personalisedProposalArKeys = keys
    })

    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })

    cy.loginBE()
  })

  beforeEach(() => {
    cy.intercept("/api/portfolio/insights/dashboard", {
      fixture: "dashboardInsights",
    }).as("dashboardInsights")

    cy.intercept("/api/portfolio/webinars/upcomings", {
      fixture: "upcomingWebinars",
    }).as("upcomingWebinars")

    cy.intercept("/api/portfolio/insights/webinars/recent", {
      fixture: "recentWebinars",
    }).as("recentWebinars")

    cy.intercept("/api/user", { fixture: "user" }).as("user")

    cy.intercept("/api/user/qualifications/status", {
      fixture: "proposalJourneyCompleted",
    }).as("userStatus")

    cy.intercept("/api/portfolio/opportunities", {
      fixture: "userOpportunityStatusVerified",
    }).as("portfolioOpportunities")

    cy.intercept("/api/user/relationship-manager", {
      fixture: "RMNotAssigned",
    }).as("relationshipManager")

    cy.intercept("/api/user/status", {
      fixture: "userStatusQualified",
    }).as("userQualificationStatus")

    cy.intercept("/api/user/summary", {
      fixture: "userSummaryWithLastProposalDate",
    }).as("userSummary")

    cy.intercept("/api/user/investment-goals", {
      fixture: "investmentGoalCompletedResponse",
    }).as("investmentGoalResponse")

    cy.intercept("/api/user/proposals/status", {
      fixture: "proposalsStatusGenerated",
    }).as("proposalsStatus")

    cy.intercept("/api/user/kyc/status", {
      fixture: "kycNotStarted",
    }).as("kycStatus")

    cy.intercept("/api/user/proposals", { fixture: "userProposals" }).as(
      "userProposals",
    )

    cy.intercept("/api/user/investment-goals", {
      fixture: "investmentGoalCompletedResponse",
    }).as("investmentGoalResponse")

    cy.intercept("GET", "/api/user/risk-assessment/result", {
      fixture: "riskAssessmentResult",
    }).as("riskAssessmentResult")

    cy.intercept("/api/portfolio/proposal/deals?id=Capital*Growth", {
      fixture: "proposalCapitalDeals",
    }).as("proposalCapitalDeals")

    cy.intercept("/api/portfolio/proposal/deal-info?id=*", {
      fixture: "proposalDealInfoId",
    }).as("proposalDeals")

    cy.intercept("/api/portfolio/proposal/deals?id=Capital*Yielding", {
      fixture: "proposalCapitalYieldDeals",
    }).as("proposalCapitalYieldDeals")

    cy.intercept("/api/user/preference", {
      fixture: "userPreferenceENDefault",
    }).as("userPreference")

    cy.intercept("/api/user/risk-assessment/retake-result", {
      fixture: "retakeRiskAssessmentResult",
    }).as("retakeRiskAssessmentResult")

    cy.intercept("/api/user/kyc/personal-information", {
      fixture: "kycPersonalInformation",
    }).as("kycPersonalInformation")
  })

  context("desktop", () => {
    it("should navigate user to first screen on the KYC flow on clicking Start Investing CTA", () => {
      cy.visit("/personalized-proposal")

      cy.intercept("POST", "/api/user/proposals/accept", {
        fixture: "acceptProposal",
      }).as("acceptProposal")

      cy.get("footer")
        .findByRole("button", {
          name: personalisedProposalKeys.discussWithExpert.button
            .startInvesting,
        })
        .click()

      cy.location("pathname").should("equal", "/kyc")
    })

    it("should change Save & Exit button to Exit button if user has accepted proposal", () => {
      cy.intercept("/api/user/proposals/status", {
        fixture: "proposalsStatusAccepted",
      }).as("proposalsStatusAccepted")

      cy.visit("/personalized-proposal")

      cy.findByRole("link", { name: commonKeys.button.saveAndExit }).should(
        "not.exist",
      )
      cy.findByRole("link", { name: commonKeys.button.exit }).should(
        "be.visible",
      )
    })

    it("should not display Edit button if user has accepted proposal", () => {
      cy.findByRole("button", {
        name: personalisedProposalKeys.header.button.editDetails,
      }).should("not.exist")
    })

    it("should display client registration CTA when user has already accepted proposal", () => {
      cy.findByRole("button", {
        name: personalisedProposalKeys.footer.button.completeClientRegistration,
      }).click()

      cy.location("pathname").should("equal", "/kyc")
    })

    it("should not display text card and client registration CTA when user has completed KYC flow", () => {
      cy.intercept("/api/user/proposals/status", {
        fixture: "proposalsStatusAccepted",
      }).as("proposalsStatusAccepted")

      cy.intercept("/api/user/kyc/status", {
        fixture: "kycStatusCompleted",
      }).as("kycStatus")

      cy.visit("/personalized-proposal")

      cy.findByRole("button", {
        name: personalisedProposalKeys.footer.button.completeClientRegistration,
      }).should("not.exist")

      cy.findByText(
        personalisedProposalKeys.discussWithExpert.disclaimer,
      ).should("not.exist")
    })

    context("desktop- RTL", () => {
      it("should receive a notification on starting KYC journey about language being switched to English", () => {
        cy.intercept("/api/user/preference", {
          fixture: "userARPreferenceProposal",
        }).as("languagePreference")

        cy.visit("/ar/personalized-proposal")

        cy.intercept("POST", "/api/user/proposals/accept", {
          fixture: "acceptProposal",
        }).as("acceptProposal")

        cy.get("footer").findAllByRole("button").eq(1).click()

        cy.findByRole("dialog")
          .findByRole("heading", { level: 2 })
          .should(
            "have.text",
            personalisedProposalArKeys.languageSwitchNotificationPopUp.heading,
          )
      })
    })
  })

  context(
    "mobile",
    {
      viewportHeight: 844,
      viewportWidth: 390,
    },
    () => {
      it("should navigate user to first screen on the KYC flow on clicking Start Investing CTA", () => {
        cy.visit("/personalized-proposal")

        cy.wait([
          "@userProposals",
          "@investmentGoalResponse",
          "@retakeRiskAssessmentResult",
          "@kycStatus",
          "@userSummary",
          "@relationshipManager",
          "@proposalsStatus",
          "@user",
        ])

        cy.intercept("POST", "/api/user/proposals/accept", {
          fixture: "acceptProposal",
        }).as("acceptProposal")

        cy.get("footer")
          .findByRole("button", {
            name: personalisedProposalKeys.discussWithExpert.button
              .startInvesting,
          })
          .click({ force: true })

        cy.location("pathname").should("equal", "/kyc")
      })

      it("should change Save & Exit button to Exit button if user has accepted proposal", () => {
        cy.intercept("/api/user/proposals/status", {
          fixture: "proposalsStatusAccepted",
        }).as("proposalsStatusAccepted")

        cy.visit("/personalized-proposal")

        cy.findByRole("link", { name: commonKeys.button.saveAndExit }).should(
          "not.exist",
        )
        cy.findByRole("link", { name: commonKeys.button.exit }).should(
          "be.visible",
        )
      })

      it("should not display Edit button if user has accepted proposal", () => {
        cy.findByRole("button", {
          name: personalisedProposalKeys.header.button.editDetails,
        }).should("not.exist")
      })

      it("should display client registration CTA when user has already accepted proposal", () => {
        cy.findByRole("button", {
          name: personalisedProposalKeys.footer.button
            .completeClientRegistration,
        }).click()

        cy.location("pathname").should("equal", "/kyc")
      })

      it("should not display text card and client registration CTA when user has completed KYC flow", () => {
        cy.intercept("/api/user/proposals/status", {
          fixture: "proposalsStatusAccepted",
        }).as("proposalsStatusAccepted")

        cy.intercept("/api/user/kyc/status", {
          fixture: "kycStatusCompleted",
        }).as("kycStatus")

        cy.visit("/personalized-proposal")

        cy.findByRole("button", {
          name: personalisedProposalKeys.footer.button
            .completeClientRegistration,
        }).should("not.exist")

        cy.findByText(
          personalisedProposalKeys.discussWithExpert.disclaimer,
        ).should("not.exist")
      })

      context("mobile- RTL", () => {
        it("should receive a notification on starting KYC journey about language being switched to English", () => {
          cy.intercept("/api/user/preference", {
            fixture: "userARPreferenceProposal",
          }).as("languagePreference")

          cy.visit("/ar/personalized-proposal")

          cy.intercept("POST", "/api/user/proposals/accept", {
            fixture: "acceptProposal",
          }).as("acceptProposal")

          cy.findAllByRole("button", {
            name: personalisedProposalArKeys.footer.button.acceptProposal,
          })
            .eq(1)
            .click()

          cy.findByRole("dialog")
            .findByRole("heading", { level: 2 })
            .should(
              "have.text",
              personalisedProposalArKeys.languageSwitchNotificationPopUp
                .heading,
            )
        })
      })
    },
  )
})
