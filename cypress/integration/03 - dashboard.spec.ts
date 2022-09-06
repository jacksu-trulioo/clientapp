import {
  Opportunity,
  RelationshipManager,
  User,
} from "../../src/services/mytfo/types"

describe("dashboard", () => {
  let user: User
  let opportunities: Opportunity[]
  let homeKeys
  let opportunitiesKeys
  let commonKeys
  let relationshipManager: RelationshipManager

  before(() => {
    cy.fixture("user").then((userDetails) => {
      user = userDetails
    })

    cy.loginBE()

    cy.fixture("../../public/locales/en/home").then((keys) => {
      homeKeys = keys
    })

    cy.fixture("../../public/locales/en/opportunities").then((keys) => {
      opportunitiesKeys = keys
    })

    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })

    cy.fixture("RMAssigned").then((manager) => {
      relationshipManager = manager
    })
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
      fixture: "proposalJourneyNotStarted",
    }).as("userStatus")

    cy.intercept("/api/user/summary", {
      fixture: "userSummaryFreshUser",
    }).as("userSummary")

    cy.intercept("/api/user/proposals/status", {
      fixture: "proposalsStatusNotStarted",
    }).as("proposalsStatus")

    cy.intercept("/api/portfolio/opportunities", {
      fixture: "userOpportunityStatusUnverified",
    }).as("portfolioOpportunities")

    cy.intercept("/api/user/relationship-manager", {
      fixture: "RMNotAssigned",
    }).as("relationshipManager")

    cy.intercept("/api/user/status", {
      fixture: "userStatusNotQualified",
    }).as("userQualificationStatus")

    cy.intercept("/api/user/investment-goals", {
      fixture: "investmentGoalQuizNotStarted",
    }).as("investmentGoalResponse")

    cy.intercept("/api/user/kyc/status", {
      fixture: "kycNotStarted",
    }).as("kycStatus")

    cy.intercept("/api/user/preference", {
      fixture: "userPreferenceENDefault",
    }).as("languagePreference")

    cy.intercept("/api/user/preference/disclaimer", {
      fixture: "userDisclaimerNotAccepted",
    }).as("userDisclaimerNotAccepted")

    cy.intercept("/api/user/proposals", { fixture: "userProposals" }).as(
      "userProposal",
    )

    cy.intercept("GET", "/api/user/risk-assessment/result", {
      fixture: "riskAssessmentResult",
    }).as("riskAssessmentResult")

    cy.intercept("/api/portfolio/proposal/deals?id=Capital*Growth", {
      fixture: "proposalCapitalDeals",
    }).as("proposalCapitalDeals")

    cy.intercept("/api/portfolio/proposal/deal-info?id=*", {
      fixture: "proposalDealInfoId",
    }).as("proposalDeals")

    cy.intercept("/api/user/kyc/personal-information", {
      fixture: "kycPersonalInformation",
    }).as("kycPersonalInformation")

    cy.intercept("/api/user/profile", {
      fixture: "userOnboardingProfile",
    }).as("investmentProfileResponse")

    cy.intercept("/api/user/risk-assessment", {
      fixture: "riskAssessmentQuizNotStarted",
    }).as("riskAssessmentResponse")
  })

  context("desktop", () => {
    before(() => {
      cy.fixture("userOpportunityStatusUnverified").then((json) => {
        opportunities = json.opportunities
      })
    })

    it("should see a welcome message with prospect name", () => {
      cy.visit("/")

      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
        "@upcomingWebinars",
        "@recentWebinars",
      ])
      let welcomeMessage = homeKeys.heading.replace(
        "{{firstName}}",
        user.profile.firstName,
      )
      cy.findByText(welcomeMessage).should("be.visible")
    })

    it("should see a portfolio simulator widget", () => {
      cy.findByRole("button", {
        name: homeKeys.cta.simulatePortfolio.button,
      }).should("be.visible")
    })

    it("should see 2 opportunities card", () => {
      cy.findAllByLabelText("opportunityCard").should("have.length", "2")
    })

    it("should display CTA to Unlock sanitized opportunities for a a non-qualified investor who has not completed the investment profile section yet", () => {
      for (let i = 0; i < 2; i++) {
        cy.findAllByLabelText("opportunityCard")
          .eq(i)
          .then((item) => {
            cy.wrap(item)
              .findByLabelText("title")
              .should("have.text", opportunities[i].title)

            cy.wrap(item)
              .findByLabelText("description")
              .should("have.text", opportunities[i].description)

            if (opportunities[i].isShariahCompliant) {
              cy.wrap(item)
                .findByLabelText("isShariahCompliant")
                .should("have.text", opportunitiesKeys.index.card.tag.shariah)
            }

            cy.wrap(item)
              .findByText(opportunitiesKeys.index.card.labels.expectedExit)
              .siblings("p")
              .should("have.text", opportunities[i].expectedExit)

            cy.wrap(item)
              .findByText(opportunitiesKeys.index.card.labels.assetClass)
              .siblings("p")
              .should("have.text", opportunities[i].assetClass)

            cy.wrap(item)
              .findByText(opportunitiesKeys.index.card.labels.country)
              .siblings("p")
              .should("have.text", opportunities[i].country)

            cy.wrap(item)
              .findByText(opportunitiesKeys.index.card.labels.sector)
              .siblings("p")
              .should("have.text", opportunities[i].sector)

            cy.wrap(item)
              .findAllByRole("link", {
                name: opportunitiesKeys.index.button.unlock,
              })
              .should("have.length", "1")
          })
      }
    })

    it("should display Opportunities for you card with count of more opportunities to unlock", () => {
      const moreCardsToView = opportunities.length - 2
      cy.findByLabelText("defaultOpportunitiesCard")
        .findByLabelText("remainingOpportunities")
        .should("have.text", `+${moreCardsToView}`)
    })

    it("should view more cards using see more link", () => {
      cy.findByLabelText("defaultOpportunitiesCard")
        .findByRole("button", {
          name: opportunitiesKeys.index.moreCard.button.viewAll,
        })
        .click()
      cy.location("pathname").should("equal", "/opportunities")
      cy.findAllByText(opportunitiesKeys.index.button.unlock).should(
        "have.length",
        opportunities.length,
      )
    })

    it("should be able to initiate the investment profile section to unlock opportunites from Unlock this opportunity CTA", () => {
      cy.visit("/")
      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
        "@upcomingWebinars",
        "@recentWebinars",
        "@userSummary",
        "@investmentGoalResponse",
        "@proposalsStatus",
        "@kycStatus",
        "@userDisclaimerNotAccepted",
      ])

      cy.findByText(homeKeys.cta.relationshipManager.help.title).should(
        "be.visible",
      )

      cy.findAllByLabelText("opportunityCard")
        .eq(0)
        .findByText(opportunitiesKeys.index.button.unlock)
        .click()
      cy.location("pathname").should("equal", "/opportunities/unlock")
    })

    it("should be able to start investment profile", () => {
      cy.findByRole("button", {
        name: opportunitiesKeys.unlock.button.getStarted,
      }).click()
      cy.location("pathname").should(
        "equal",
        "/opportunities/unlock/investor-profile",
      )
    })

    it("should redirect user to opportunities screen on invoking Save & Exit from Q1", () => {
      cy.findByRole("button", { name: commonKeys.button.saveAndExit }).click()
      cy.findByRole("link", { name: commonKeys.button.saveAndExit }).click()
      cy.location("pathname").should("equal", "/opportunities")
    })

    it("should see verifying status after user completed investment profile via unlocking opportunities", () => {
      cy.intercept("/api/portfolio/opportunities", {
        fixture: "userOpportunityStatusPendingApproval",
      }).as("portfolioOpportunities")

      cy.intercept("/api/user/qualifications/status", {
        fixture: "proposalInvestmentGoalsNotStarted",
      }).as("userStatus")

      cy.intercept("/api/user/profile", {
        fixture: "investmentProfileViaOpportunities",
      }).as("userProfile")

      cy.intercept("/api/user/status", {
        fixture: "userStatusPendingVerification",
      }).as("userQualificationStatus")

      cy.intercept("/api/user/preference/disclaimer", {
        fixture: "userDisclaimerAccepted",
      }).as("userDisclaimerAccepted")

      cy.intercept("/api/user", {
        fixture: "userPreProposalFromOpportunities",
      }).as("user")

      cy.visit("/")
      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
      ])

      cy.findAllByLabelText("opportunityCard")
        .eq(0)
        .findByText(opportunitiesKeys.index.button.verifying)
        .should("be.visible")

      cy.findAllByRole("link", {
        name: opportunitiesKeys.index.button.unlock,
      }).should("not.exist")
    })

    it("should see simulator widget when user started preproposal from opportunities", () => {
      cy.findByRole("button", {
        name: homeKeys.cta.simulatePortfolio.button,
      }).should("be.visible")
    })

    it("should see a tracker notifying pre-proposal flow status to continue with investment goals when user started preproposal from Start Investing", () => {
      cy.intercept("/api/portfolio/opportunities", {
        fixture: "userOpportunityStatusPendingApproval",
      }).as("portfolioOpportunities")

      cy.intercept("/api/user/qualifications/status", {
        fixture: "proposalInvestmentGoalsNotStarted",
      }).as("userStatus")

      cy.intercept("/api/user/profile", {
        fixture: "investmentProfileViaOpportunities",
      }).as("userProfile")

      cy.intercept("/api/user/status", {
        fixture: "userStatusPendingVerification",
      }).as("userQualificationStatus")

      cy.intercept("/api/user/preference/disclaimer", {
        fixture: "userDisclaimerAccepted",
      }).as("userDisclaimerAccepted")

      cy.intercept("/api/user", {
        fixture: "userWithInvestorSurvey",
      }).as("user")

      cy.reload()
      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
        "@upcomingWebinars",
        "@recentWebinars",
      ])
      cy.findByRole("button", { name: commonKeys.button.continue }).click()

      cy.location("pathname").should("equal", "/proposal/investment-goals")
    })

    it("should see a disclaimer when user is verified", () => {
      cy.intercept("/api/user", {
        fixture: "userWithInvestorSurvey",
      }).as("user")

      cy.intercept("/api/user/qualifications/status", {
        fixture: "proposalRiskAssessmentNotStarted",
      }).as("userStatus")

      cy.intercept("/api/portfolio/opportunities", {
        fixture: "userOpportunityStatusVerified",
      }).as("portfolioOpportunities")

      cy.intercept("/api/user/status", {
        fixture: "userStatusQualified",
      }).as("userQualificationStatus")

      cy.intercept("/api/user/investment-goals", {
        fixture: "investmentGoalCompletedResponse",
      }).as("investmentGoalResponse")

      cy.visit("/")
      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
      ])

      cy.findByLabelText("opportunitiesDisclaimer").should(
        "contain.text",
        commonKeys.disclaimer.description,
      )
    })

    it("should able to accept disclaimer", () => {
      cy.intercept("/api/user", {
        fixture: "userWithInvestorSurvey",
      }).as("user")

      cy.intercept("/api/user/qualifications/status", {
        fixture: "proposalRiskAssessmentNotStarted",
      }).as("userStatus")

      cy.intercept("/api/portfolio/opportunities", {
        fixture: "userOpportunityStatusVerified",
      }).as("portfolioOpportunities")

      cy.intercept("/api/user/status", {
        fixture: "userStatusQualified",
      }).as("userQualificationStatus")

      cy.intercept("/api/user/investment-goals", {
        fixture: "investmentGoalCompletedResponse",
      }).as("investmentGoalResponse")

      cy.intercept("/api/user/preference/disclaimer", {
        fixture: "userDisclaimerAccepted",
      }).as("userDisclaimerAccepted")

      cy.findByLabelText("opportunitiesDisclaimer")
        .findByRole("button", { name: commonKeys.disclaimer.button })
        .click()

      cy.findByLabelText("opportunitiesDisclaimer").should("not.exist")
    })

    it("should be able to view 3 unsanitized opportunities when user is verified", () => {
      cy.findAllByLabelText("opportunityCard").should("have.length", 2)
    })

    it("should be able to view information about unsanitized opportunities when user is verified", () => {
      cy.findAllByLabelText("opportunityCard").each((item) => {
        cy.wrap(item).findByLabelText("title").should("be.visible")
        cy.wrap(item).findByLabelText("description").should("be.visible")
        cy.wrap(item)
          .findByRole("link", { name: commonKeys.button.viewDetails })
          .should("be.visible")
      })
    })

    it("should see a tracker notifying pre-proposal flow status to continue with risk assessment", () => {
      cy.intercept("/api/user", {
        fixture: "userWithInvestorSurvey",
      }).as("user")

      cy.intercept("/api/user/status", {
        fixture: "userStatusQualified",
      }).as("userQualificationStatus")

      cy.intercept("/api/user/qualifications/status", {
        fixture: "proposalRiskAssessmentNotStarted",
      }).as("userStatus")

      cy.intercept("/api/portfolio/opportunities", {
        fixture: "userOpportunityStatusVerified",
      }).as("portfolioOpportunities")

      cy.intercept("/api/user/preference/disclaimer", {
        fixture: "userDisclaimerAccepted",
      }).as("userDisclaimerAccepted")

      cy.findByRole("button", { name: commonKeys.button.continue }).click()

      cy.location("pathname").should("equal", "/proposal/risk-assessment")
    })

    it("should see a tracker notifying pre-proposal flow has been completed", () => {
      cy.intercept("/api/user/qualifications/status", {
        fixture: "proposalJourneyCompleted",
      }).as("userStatus")

      cy.intercept("/api/portfolio/opportunities", {
        fixture: "userOpportunityStatusVerified",
      }).as("portfolioOpportunities")

      cy.intercept("/api/user/status", {
        fixture: "userStatusQualified",
      }).as("userQualificationStatus")

      cy.intercept("/api/user/investment-goals", {
        fixture: "investmentGoalCompletedResponse",
      }).as("investmentGoalResponse")

      cy.intercept("/api/user", {
        fixture: "userWithInvestorSurvey",
      }).as("user")

      cy.visit("/")
      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
      ])
      cy.findByRole("heading", {
        name: homeKeys.cta.portfolioCompleted.title,
      }).should("be.visible")
    })

    it("should minimize RM card if user status is ACTIVE_PIPELINE", () => {
      cy.intercept("/api/user/relationship-manager", {
        fixture: "RMAssigned",
      }).as("relationshipManager")

      cy.intercept("/api/user/status", {
        fixture: "userStatusACTIVE_PIPELINE",
      }).as("userQualificationStatus")

      cy.visit("/")
      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
      ])

      cy.findByRole("button", {
        name: "RM card mail icon",
      }).should("be.visible")

      cy.findByRole("button", {
        name: "RM card calendar icon",
      }).should("be.visible")

      cy.findByLabelText("minimizedRMCard").within(() => {
        cy.findByText(homeKeys.cta.relationshipManager.title).should(
          "be.visible",
        )
        cy.findByText(
          relationshipManager.manager.firstName +
            " " +
            relationshipManager.manager.lastName,
        ).should("be.visible")
      })

      cy.findByRole("button", {
        name: homeKeys.cta.relationshipManager.button.message,
      }).should("not.be.visible")
      cy.findByRole("button", {
        name: homeKeys.cta.relationshipManager.button.meeting,
      }).should("not.be.visible")
    })

    it("should minimize RM card if user status is ALREADY_CLIENT", () => {
      cy.intercept("/api/user/relationship-manager", {
        fixture: "RMAssigned",
      }).as("relationshipManager")

      cy.intercept("/api/user/status", {
        fixture: "userStatusALREADY_CLIENT",
      }).as("userQualificationStatus")

      cy.visit("/")
      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
      ])

      cy.findByRole("button", {
        name: "RM card mail icon",
      }).should("be.visible")

      cy.findByRole("button", {
        name: "RM card calendar icon",
      }).should("be.visible")

      cy.findByLabelText("minimizedRMCard").within(() => {
        cy.findByText(homeKeys.cta.relationshipManager.title).should(
          "be.visible",
        )

        cy.findByText(
          relationshipManager.manager.firstName +
            " " +
            relationshipManager.manager.lastName,
        ).should("be.visible")
      })

      cy.findByRole("button", { name: "Send a message" }).should(
        "not.be.visible",
      )
      cy.findByRole("button", { name: "Schedule a meeting" }).should(
        "not.be.visible",
      )
    })

    it("should minimize RM card if user status is KYC_started", () => {
      cy.intercept("/api/user/relationship-manager", {
        fixture: "RMAssigned",
      }).as("relationshipManager")

      cy.intercept("/api/user/proposals/status", {
        fixture: "proposalsStatusAccepted",
      }).as("proposalsStatus")

      cy.intercept("/api/user/status", {
        fixture: "userStatusQualified",
      }).as("userQualificationStatus")

      cy.intercept("/api/user/qualifications/status", {
        fixture: "proposalJourneyCompleted",
      }).as("userStatus")

      cy.intercept("/api/user/summary", {
        fixture: "userSummaryWithLastProposalDate",
      }).as("userSummary")

      cy.intercept("/api/user/investment-goals", {
        fixture: "investmentGoalCompletedResponse",
      }).as("investmentGoalResponse")

      cy.intercept("/api/portfolio/opportunities", {
        fixture: "userOpportunityStatusVerified",
      }).as("portfolioOpportunities")

      cy.intercept("/api/user/preference/disclaimer", {
        fixture: "userDisclaimerAccepted",
      }).as("userDisclaimerAccepted")

      cy.intercept("/api/user", {
        fixture: "userWithInvestorSurvey",
      }).as("user")

      cy.visit("/")
      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
      ])

      cy.findByRole("button", {
        name: "RM card mail icon",
      }).should("be.visible")

      cy.findByLabelText("minimizedRMCard").within(() => {
        cy.findByText(homeKeys.cta.relationshipManager.title).should(
          "be.visible",
        )

        cy.findByText(
          relationshipManager.manager.firstName +
            " " +
            relationshipManager.manager.lastName,
        ).should("be.visible")
      })
      cy.findByRole("button", {
        name: "RM card calendar icon",
      }).should("be.visible")
    })

    it("should display KYC journey tracker when user has accepted proposal", () => {
      cy.findByLabelText("KYCTrackerCard")
        .findByRole("heading", {
          level: 2,
          name: homeKeys.cta.kycIndicator.title,
        })
        .should("be.visible")
    })

    it("should navigate user to personalized proposal screen on description CTA", () => {
      const description = String(homeKeys.cta.kycIndicator.description)
        .replace(/<\d>/g, "")
        .replace(/<\/\d>/g, "")
        .replace("\n", "")
      cy.findByLabelText("KYCTrackerCard")
        .find("h2")
        .siblings("p")
        .should("have.text", description)
        .within(() => {
          cy.findByRole("link", {
            name: description.split(" ").pop(),
          }).click()
        })
      cy.location("pathname").should("equal", "/personalized-proposal")
    })

    it("should minimize help card if user status is KYC_started", () => {
      cy.intercept("/api/user/proposals/status", {
        fixture: "proposalsStatusAccepted",
      }).as("proposalsStatus")

      cy.visit("/")
      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
      ])

      cy.findByLabelText("minimalHelpCard")
        .should(
          "contain.text",
          homeKeys.cta.relationshipManager.button.talkWithExpert,
        )
        .should(
          "contain.text",
          homeKeys.cta.relationshipManager.button.schedule,
        )
    })

    it("should navigate user to KYC journey on clicking complete onboarding CTA", () => {
      cy.intercept("/api/user/qualifications/status", {
        fixture: "proposalJourneyCompleted",
      }).as("userStatus")

      cy.intercept("/api/user/status", {
        fixture: "userStatusQualified",
      }).as("userQualificationStatus")

      cy.intercept("/api/user/summary", {
        fixture: "userSummaryWithLastProposalDate",
      }).as("userSummary")

      cy.intercept("/api/user/investment-goals", {
        fixture: "investmentGoalCompletedResponse",
      }).as("investmentGoalResponse")

      cy.intercept("/api/portfolio/opportunities", {
        fixture: "userOpportunityStatusVerified",
      }).as("portfolioOpportunities")

      cy.intercept("/api/user/proposals/status", {
        fixture: "proposalsStatusAccepted",
      }).as("proposalsStatus")

      cy.intercept("/api/user/preference/disclaimer", {
        fixture: "userDisclaimerAccepted",
      }).as("userDisclaimerAccepted")

      cy.intercept("/api/user", {
        fixture: "userWithInvestorSurvey",
      }).as("user")

      cy.findByLabelText("KYCTrackerCard")
        .findByRole("button", {
          name: homeKeys.cta.kycIndicator.button.completeOnboarding,
        })
        .click()
      cy.location("pathname").should("equal", "/kyc/personal-information")
    })

    it("should change tracker information to completed once user completes the personal information section of KYC", () => {
      cy.intercept("/api/user/proposals/status", {
        fixture: "proposalsStatusAccepted",
      }).as("proposalsStatus")

      cy.intercept("/api/user/kyc/status", {
        fixture: "kycStatusStep1Completed",
      }).as("kycStatus")

      cy.visit("/")
      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
      ])

      cy.findByLabelText("KYCTrackerCard")
        .findByText(homeKeys.cta.kycIndicator.stepper.stepOne.title)
        .siblings("p")
        .should(
          "have.text",
          homeKeys.cta.kycIndicator.stepper.stepOne.completedDesc,
        )
    })

    it("should change tracker information to completed once user completes the investment experience section of KYC", () => {
      cy.intercept("/api/user/proposals/status", {
        fixture: "proposalsStatusAccepted",
      }).as("proposalsStatus")

      cy.intercept("/api/user/kyc/status", {
        fixture: "kycStatusStep2Completed",
      }).as("kycStatus")

      cy.visit("/")
      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
      ])

      cy.findByLabelText("KYCTrackerCard").within(() => {
        cy.findByText(homeKeys.cta.kycIndicator.keepGoingTitle).should(
          "be.visible",
        )
        cy.findByText(homeKeys.cta.kycIndicator.stepper.stepOne.title)
          .siblings("p")
          .should(
            "have.text",
            homeKeys.cta.kycIndicator.stepper.stepOne.completedDesc,
          )
        cy.findByText(homeKeys.cta.kycIndicator.stepper.stepTwo.title)
          .siblings("p")
          .should(
            "have.text",
            homeKeys.cta.kycIndicator.stepper.stepTwo.completedDesc,
          )
      })
    })

    it("should change tracker information to all Set widget once user completed KYC journey", () => {
      cy.intercept("/api/user/proposals/status", {
        fixture: "proposalsStatusAccepted",
      }).as("proposalsStatus")

      cy.intercept("/api/user/kyc/status", {
        fixture: "kycStatusCompleted",
      }).as("kycStatus")

      cy.visit("/")
      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
      ])

      cy.findByLabelText("KYCTrackerCard").should("not.exist")
      cy.findByLabelText("kycCompletedCard").should(
        "contain.text",
        homeKeys.cta.kycIndicator.completedTitle,
      )
    })

    it("should navigated to support page with Help Icon", () => {
      cy.intercept("/api/portfolio/faqs", { fixture: "faqs" }).as("faqs")
      cy.findByLabelText("Support Icon").click()
      cy.location("pathname").should("equal", "/support")
    })

    it("should navigated to support page for Help with Get Support Link", () => {
      cy.intercept("/api/portfolio/faqs", { fixture: "faqs" }).as("faqs")
      cy.visit("/")
      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
      ])
      cy.findByRole("button", { name: commonKeys.help.link.support }).click()
      cy.location("pathname").should("equal", "/support")
    })

    it("should open General enquiry(help page) with Email Us Link", () => {
      cy.findByRole("button", { name: commonKeys.help.button.email }).click()
      cy.findByRole("heading", {
        level: 2,
        name: commonKeys.modal.submitEnquiry.title,
      }).should("be.visible")
    })

    it("should see a help card when RM is not assigned to user", () => {
      // required to navigate back from Support page
      cy.visit("/")
      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
      ])
      cy.findByRole("button", {
        name: homeKeys.cta.relationshipManager.button.schedule,
      }).should("be.visible")
    })

    it("should see a RM card when RM is assigned to user", () => {
      cy.intercept("/api/user/relationship-manager", {
        fixture: "RMAssigned",
      }).as("relationshipManager")

      cy.reload()
      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
      ])

      cy.fixture("RMAssigned").then((interception) => {
        const relationshipManager =
          interception.manager.firstName + " " + interception.manager.lastName

        cy.findByText(homeKeys.cta.relationshipManager.title)
          .siblings()
          .eq(0)
          .should("have.text", relationshipManager)
      })

      cy.findByRole("button", {
        name: homeKeys.cta.relationshipManager.button.message,
      }).should("be.visible")
      cy.findByRole("button", {
        name: homeKeys.cta.relationshipManager.button.meeting,
      }).should("be.visible")
    })

    it("should have truncated summary of insights card after 1 line", () => {
      cy.findAllByLabelText("insightCard").each((item) => {
        cy.wrap(item)
          .findByLabelText("insightTitle")
          .should("have.css", "webkit-line-clamp", "1")
          .should("have.css", "text-overflow", "ellipsis")
      })
    })

    it("should have truncated title of card after 1 line", () => {
      cy.findAllByLabelText("opportunityCard").each((item) => {
        cy.wrap(item)
          .findByLabelText("title")
          .should("have.css", "webkit-line-clamp", "1")
          .should("have.css", "text-overflow", "ellipsis")
      })
    })

    it("should have truncated summary of card after 3 line", () => {
      cy.findAllByLabelText("opportunityCard").each((item) => {
        cy.wrap(item)
          .findByLabelText("description")
          .should("have.css", "webkit-line-clamp", "3")
          .should("have.css", "text-overflow", "ellipsis")
      })
    })

    it("should not display CTA to Unlock sanitized opportunities for a disqualified investor", () => {
      cy.intercept("/api/user/status", {
        fixture: "userStatusDisQualified",
      }).as("userQualificationStatus")

      cy.intercept("/api/portfolio/opportunities", {
        fixture: "userOpportunityStatusDisqualified",
      }).as("portfolioOpportunities")

      cy.visit("/")
      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
      ])
      cy.findAllByRole("link", {
        name: opportunitiesKeys.index.button.unlock,
      }).should("not.exist")
    })

    it("should see maximum of 03 random insight cards", () => {
      cy.findAllByLabelText("insightCard")
        .should("have.length.at.most", 3)
        .each(function (item) {
          cy.wrap(item)
            //publish date for insight
            .findByLabelText("insightPublishDate")
            .should("be.visible")
          cy.wrap(item)
            // title of insight
            .findByLabelText("insightTitle")
            .then((title) => {
              // image of insight
              cy.wrap(item).findByAltText(title.text()).should("be.visible")
            })
        })
    })

    it("should take to the general insight page where all the insight types are available on click of See more", () => {
      cy.intercept("/api/portfolio/insights", {
        fixture: "insights",
      }).as("insights")
      cy.findAllByRole("link", { name: commonKeys.button.seeMore })
        .filter("[href='/insights']")
        .click()

      cy.location("pathname").should("equal", "/insights")
    })

    it("should navigate to detailed screen when user clicks on insight", () => {
      cy.intercept("/api/portfolio/insights/article?id=*", {
        fixture: "articleDetails",
      })
      cy.intercept("/api/portfolio/insights/top-articles?excludingId=*", {
        fixture: "topArticles",
      }).as("topArticles")
      cy.findAllByLabelText("insightCardType").eq(0).click()

      cy.location("pathname").should("match", /insights\/(.*)\/(.*)/)
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
        cy.fixture("userOpportunityStatusUnverified").then((json) => {
          opportunities = json.opportunities
        })
      })

      it("should see a welcome message with prospect name", () => {
        cy.visit("/")
        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
          "@upcomingWebinars",
          "@recentWebinars",
        ])
        cy.findByText(`Hello, ${user.profile.firstName}!`).should("be.visible")
      })

      it("should see a portfolio simulator widget", () => {
        cy.findByRole("button", {
          name: homeKeys.cta.simulatePortfolio.button,
        }).should("be.visible")
      })

      it("should see 2 opportunities card", () => {
        cy.findAllByLabelText("opportunityCard").should("have.length", "2")
      })

      it("should display CTA to Unlock sanitized opportunities for a a non-qualified investor who has not completed the investment profile section yet", () => {
        for (let i = 0; i < 2; i++) {
          cy.findAllByLabelText("opportunityCard")
            .eq(i)
            .then((item) => {
              cy.wrap(item)
                .findByLabelText("title")
                .should("have.text", opportunities[i].title)

              cy.wrap(item)
                .findByLabelText("description")
                .should("have.text", opportunities[i].description)

              if (opportunities[i].isShariahCompliant) {
                cy.wrap(item)
                  .findByLabelText("isShariahCompliant")
                  .should("have.text", opportunitiesKeys.index.card.tag.shariah)
              }

              cy.wrap(item)
                .findByText(opportunitiesKeys.index.card.labels.expectedExit)
                .siblings("p")
                .should("have.text", opportunities[i].expectedExit)

              cy.wrap(item)
                .findByText(opportunitiesKeys.index.card.labels.assetClass)
                .siblings("p")
                .should("have.text", opportunities[i].assetClass)

              cy.wrap(item)
                .findByText(opportunitiesKeys.index.card.labels.country)
                .siblings("p")
                .should("have.text", opportunities[i].country)

              cy.wrap(item)
                .findByText(opportunitiesKeys.index.card.labels.sector)
                .siblings("p")
                .should("have.text", opportunities[i].sector)

              cy.wrap(item)
                .findAllByRole("link", {
                  name: opportunitiesKeys.index.button.unlock,
                })
                .should("have.length", "1")
            })
        }
      })

      it("should display Opportunities for you card with count of more opportunities to unlock", () => {
        const moreCardsToView = opportunities.length - 2
        cy.findByLabelText("defaultOpportunitiesCard")
          .findByLabelText("remainingOpportunities")
          .should("have.text", `+${moreCardsToView}`)
      })

      it("should view more cards using see more link", () => {
        cy.findByLabelText("defaultOpportunitiesCard")
          .findByRole("button", {
            name: opportunitiesKeys.index.moreCard.button.viewAll,
          })
          .click()
        cy.location("pathname").should("equal", "/opportunities")
        cy.findAllByText(opportunitiesKeys.index.button.unlock).should(
          "have.length",
          opportunities.length,
        )
      })

      it("should be able to initiate the investment profile section to unlock opportunites from unlock this opportunity CTA", () => {
        cy.visit("/")

        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
          "@upcomingWebinars",
          "@recentWebinars",
          "@userSummary",
          "@investmentGoalResponse",
          "@proposalsStatus",
          "@kycStatus",
          "@userDisclaimerNotAccepted",
        ])

        cy.findByText(homeKeys.cta.relationshipManager.help.title).should(
          "be.visible",
        )

        cy.findAllByLabelText("opportunityCard")
          .eq(0)
          .findByText(opportunitiesKeys.index.button.unlock)
          .click()
        cy.location("pathname").should("equal", "/opportunities/unlock")
      })

      it("should be able to start investment profile", () => {
        cy.findByRole("button", {
          name: opportunitiesKeys.unlock.button.getStarted,
        }).click()
        cy.location("pathname").should(
          "equal",
          "/opportunities/unlock/investor-profile",
        )
      })

      it("should redirect user to opportunities screen on invoking Save & Exit from Q1", () => {
        cy.findByRole("button", { name: commonKeys.button.saveAndExit }).click()
        cy.findByRole("link", { name: commonKeys.button.saveAndExit }).click()
        cy.location("pathname").should("equal", "/opportunities")
      })

      it("should see verifying status after user completed investment profile via unlocking opportunities", () => {
        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusPendingApproval",
        }).as("portfolioOpportunities")

        cy.intercept("/api/user/qualifications/status", {
          fixture: "proposalInvestmentGoalsNotStarted",
        }).as("userStatus")

        cy.intercept("/api/user/profile", {
          fixture: "investmentProfileViaOpportunities",
        }).as("userProfile")

        cy.intercept("/api/user/status", {
          fixture: "userStatusPendingVerification",
        }).as("userQualificationStatus")

        cy.intercept("/api/user/preference/disclaimer", {
          fixture: "userDisclaimerAccepted",
        }).as("userDisclaimerAccepted")

        cy.intercept("/api/user", {
          fixture: "userPreProposalFromOpportunities",
        }).as("user")

        cy.visit("/")
        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
        ])

        cy.findAllByLabelText("opportunityCard")
          .eq(0)
          .findByText(opportunitiesKeys.index.button.verifying)
          .should("be.visible")

        cy.findAllByRole("link", {
          name: opportunitiesKeys.index.button.unlock,
        }).should("not.exist")
      })

      it("should see simulator widget when user started preproposal from opportunities", () => {
        cy.findByRole("button", {
          name: homeKeys.cta.simulatePortfolio.button,
        }).should("be.visible")
      })

      it("should see a tracker notifying pre-proposal flow status to continue with investment goals when user started preproposal from Start Investing", () => {
        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusPendingApproval",
        }).as("portfolioOpportunities")

        cy.intercept("/api/user/qualifications/status", {
          fixture: "proposalInvestmentGoalsNotStarted",
        }).as("userStatus")

        cy.intercept("/api/user/profile", {
          fixture: "investmentProfileViaOpportunities",
        }).as("userProfile")

        cy.intercept("/api/user/status", {
          fixture: "userStatusPendingVerification",
        }).as("userQualificationStatus")

        cy.intercept("/api/user/preference/disclaimer", {
          fixture: "userDisclaimerAccepted",
        }).as("userDisclaimerAccepted")

        cy.intercept("/api/user", {
          fixture: "userWithInvestorSurvey",
        }).as("user")

        cy.reload()
        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
          "@upcomingWebinars",
          "@recentWebinars",
        ])
        cy.findByRole("button", { name: commonKeys.button.continue }).click()

        cy.location("pathname").should("equal", "/proposal/investment-goals")
      })

      it("should see a disclaimer when user is verified", () => {
        cy.intercept("/api/user", {
          fixture: "userWithInvestorSurvey",
        }).as("user")

        cy.intercept("/api/user/qualifications/status", {
          fixture: "proposalRiskAssessmentNotStarted",
        }).as("userStatus")

        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusVerified",
        }).as("portfolioOpportunities")

        cy.intercept("/api/user/status", {
          fixture: "userStatusQualified",
        }).as("userQualificationStatus")

        cy.intercept("/api/user/investment-goals", {
          fixture: "investmentGoalCompletedResponse",
        }).as("investmentGoalResponse")

        cy.visit("/")
        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
        ])

        cy.findByLabelText("opportunitiesDisclaimer").should(
          "contain.text",
          commonKeys.disclaimer.description,
        )
      })

      it("should able to accept disclaimer", () => {
        cy.intercept("/api/user/preference/disclaimer", {
          fixture: "userDisclaimerAccepted",
        }).as("userDisclaimerAccepted")

        cy.findByLabelText("opportunitiesDisclaimer")
          .findByRole("button", { name: commonKeys.disclaimer.button })
          .click()

        cy.findByLabelText("opportunitiesDisclaimer").should("not.exist")
      })

      it("should be able to view 2 unsanitized opportunities when user is verified", () => {
        cy.findAllByLabelText("opportunityCard").should("have.length", 2)
      })

      it("should be able to view information about unsanitized opportunities when user is verified", () => {
        cy.findAllByLabelText("opportunityCard").each((item) => {
          cy.wrap(item).findByLabelText("title").should("be.visible")
          cy.wrap(item).findByLabelText("description").should("be.visible")
          cy.wrap(item)
            .findByRole("link", { name: commonKeys.button.viewDetails })
            .should("be.visible")
        })
      })

      it("should see a tracker notifying pre-proposal flow status to continue with risk assessment", () => {
        cy.intercept("/api/user", {
          fixture: "userWithInvestorSurvey",
        }).as("user")

        cy.intercept("/api/user/qualifications/status", {
          fixture: "proposalRiskAssessmentNotStarted",
        }).as("userStatus")

        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusVerified",
        }).as("portfolioOpportunities")

        cy.intercept("/api/user/preference/disclaimer", {
          fixture: "userDisclaimerAccepted",
        }).as("userDisclaimerAccepted")

        cy.intercept("/api/user/status", {
          fixture: "userStatusQualified",
        }).as("userQualificationStatus")

        cy.findByRole("button", { name: commonKeys.button.continue }).click()

        cy.location("pathname").should("equal", "/proposal/risk-assessment")
      })

      it("should see a tracker notifying pre-proposal flow has been completed", () => {
        cy.intercept("/api/user/qualifications/status", {
          fixture: "proposalJourneyCompleted",
        }).as("userStatus")

        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusVerified",
        }).as("portfolioOpportunities")

        cy.intercept("/api/user/status", {
          fixture: "userStatusQualified",
        }).as("userQualificationStatus")

        cy.intercept("/api/user/investment-goals", {
          fixture: "investmentGoalCompletedResponse",
        }).as("investmentGoalResponse")

        cy.intercept("/api/user", {
          fixture: "userWithInvestorSurvey",
        }).as("user")

        cy.visit("/")

        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
          "@upcomingWebinars",
          "@recentWebinars",
        ])

        cy.findByRole("heading", {
          name: homeKeys.cta.portfolioCompleted.title,
        }).should("be.visible")
      })

      it("should minimize RM card if user status is ACTIVE_PIPELINE", () => {
        cy.intercept("/api/user/relationship-manager", {
          fixture: "RMAssigned",
        }).as("relationshipManager")

        cy.intercept("/api/user/status", {
          fixture: "userStatusACTIVE_PIPELINE",
        }).as("userQualificationStatus")

        cy.visit("/")

        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
          "@upcomingWebinars",
          "@recentWebinars",
          "@userSummary",
          "@proposalsStatus",
        ])

        cy.findByLabelText("RM card mail icon").should("not.exist")

        cy.findByRole("button", {
          name: homeKeys.cta.simulatePortfolio.button,
        }).should("not.exist")

        cy.findByLabelText("minimizedRMCard")
          .scrollIntoView()
          .should("contain.text", homeKeys.cta.relationshipManager.title)
          .should(
            "contain.text",
            relationshipManager.manager.firstName +
              " " +
              relationshipManager.manager.lastName,
          )
      })

      it("should minimize RM card if user status is ALREADY_CLIENT", () => {
        cy.intercept("/api/user/relationship-manager", {
          fixture: "RMAssigned",
        }).as("relationshipManager")

        cy.intercept("/api/user/status", {
          fixture: "userStatusALREADY_CLIENT",
        }).as("userQualificationStatus")

        cy.visit("/")

        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
          "@upcomingWebinars",
          "@recentWebinars",
          "@userSummary",
          "@proposalsStatus",
        ])

        cy.scrollTo("top")

        cy.findByText(`Hello, ${user.profile.firstName}!`).scrollIntoView()

        cy.findByLabelText("RM card mail icon").should("not.exist")

        cy.findByRole("button", {
          name: homeKeys.cta.simulatePortfolio.button,
        }).should("not.exist")

        cy.scrollTo("top")

        cy.findByLabelText("minimizedRMCard")
          .scrollIntoView()
          .should("contain.text", homeKeys.cta.relationshipManager.title)
          .should(
            "contain.text",
            relationshipManager.manager.firstName +
              " " +
              relationshipManager.manager.lastName,
          )
      })

      it("should minimize RM card if user status is KYC_started", () => {
        cy.intercept("/api/user/relationship-manager", {
          fixture: "RMAssigned",
        }).as("relationshipManager")

        cy.intercept("/api/user/proposals/status", {
          fixture: "proposalsStatusAccepted",
        }).as("proposalsStatus")

        cy.intercept("/api/user/status", {
          fixture: "userStatusQualified",
        }).as("userQualificationStatus")

        cy.intercept("/api/user/qualifications/status", {
          fixture: "proposalJourneyCompleted",
        }).as("userStatus")

        cy.intercept("/api/user/summary", {
          fixture: "userSummaryWithLastProposalDate",
        }).as("userSummary")

        cy.intercept("/api/user/investment-goals", {
          fixture: "investmentGoalCompletedResponse",
        }).as("investmentGoalResponse")

        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusVerified",
        }).as("portfolioOpportunities")

        cy.intercept("/api/user/preference/disclaimer", {
          fixture: "userDisclaimerAccepted",
        }).as("userDisclaimerAccepted")

        cy.intercept("/api/user", {
          fixture: "userWithInvestorSurvey",
        }).as("user")

        cy.visit("/")

        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
          "@upcomingWebinars",
          "@recentWebinars",
          "@userSummary",
          "@proposalsStatus",
        ])

        cy.scrollTo("top")

        cy.findByText(`Hello, ${user.profile.firstName}!`).scrollIntoView()

        cy.findByLabelText("minimizedRMCard")
          .scrollIntoView()
          .should("contain.text", homeKeys.cta.relationshipManager.title)
          .should(
            "contain.text",
            relationshipManager.manager.firstName +
              " " +
              relationshipManager.manager.lastName,
          )
          .scrollIntoView()

        cy.findByLabelText("expandRMCard").scrollIntoView().click()

        cy.findByLabelText("overlaidRMCard").within(() => {
          cy.findByRole("button", {
            name: homeKeys.cta.relationshipManager.button.message,
          }).should("be.visible")
          cy.findByRole("button", {
            name: homeKeys.cta.relationshipManager.button.meeting,
          }).should("be.visible")
        })
      })

      it("should close expanded RM card", () => {
        cy.findByLabelText("overlaidRMCard").within(() => {
          cy.findByRole("button", {
            name: "Close RM card",
          }).click()
        })
        cy.findByLabelText("overlaidRMCard").should("not.be.visible")
      })

      it("should display KYC journey tracker when user has accepted proposal", () => {
        cy.intercept("/api/user/relationship-manager", {
          fixture: "RMAssigned",
        }).as("relationshipManager")

        cy.intercept("/api/user/proposals/status", {
          fixture: "proposalsStatusAccepted",
        }).as("proposalsStatus")

        cy.intercept("/api/user/status", {
          fixture: "userStatusQualified",
        }).as("userQualificationStatus")

        cy.intercept("/api/user/qualifications/status", {
          fixture: "proposalJourneyCompleted",
        }).as("userStatus")

        cy.intercept("/api/user/summary", {
          fixture: "userSummaryWithLastProposalDate",
        }).as("userSummary")

        cy.intercept("/api/user/investment-goals", {
          fixture: "investmentGoalCompletedResponse",
        }).as("investmentGoalResponse")

        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusVerified",
        }).as("portfolioOpportunities")

        cy.intercept("/api/user/preference/disclaimer", {
          fixture: "userDisclaimerAccepted",
        }).as("userDisclaimerAccepted")

        cy.intercept("/api/user", {
          fixture: "userWithInvestorSurvey",
        }).as("user")

        cy.findByLabelText("KYCTrackerCard")
          .findByRole("heading", {
            level: 2,
            name: homeKeys.cta.kycIndicator.title,
          })
          .should("be.visible")
      })

      it("should navigate user to personalized proposal screen on description CTA", () => {
        cy.intercept("/api/user/risk-assessment/retake-result", {
          fixture: "retakeRiskAssessmentResult",
        }).as("retakeRiskAssessmentResult")

        const description = String(homeKeys.cta.kycIndicator.description)
          .replace(/<\d>/g, "")
          .replace(/<\/\d>/g, "")
          .replace("\n", "")
        cy.findByLabelText("KYCTrackerCard")
          .find("h2")
          .siblings("p")
          .should("have.text", description)
          .within(() => {
            cy.findByRole("link", {
              name: description.split(" ").pop(),
            }).click()
          })
        cy.location("pathname").should("equal", "/personalized-proposal")
      })

      it("should minimize help card if user status is KYC_started", () => {
        cy.intercept("/api/user/proposals/status", {
          fixture: "proposalsStatusAccepted",
        }).as("proposalsStatus")

        cy.intercept("/api/user/status", {
          fixture: "userStatusQualified",
        }).as("userQualificationStatus")

        cy.intercept("/api/user/qualifications/status", {
          fixture: "proposalJourneyCompleted",
        }).as("userStatus")

        cy.intercept("/api/user/summary", {
          fixture: "userSummaryWithLastProposalDate",
        }).as("userSummary")

        cy.intercept("/api/user/investment-goals", {
          fixture: "investmentGoalCompletedResponse",
        }).as("investmentGoalResponse")

        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusVerified",
        }).as("portfolioOpportunities")

        cy.intercept("/api/user/preference/disclaimer", {
          fixture: "userDisclaimerAccepted",
        }).as("userDisclaimerAccepted")

        cy.intercept("/api/user", {
          fixture: "userWithInvestorSurvey",
        }).as("user")

        cy.visit("/")

        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
          "@upcomingWebinars",
          "@recentWebinars",
          "@userSummary",
          "@proposalsStatus",
        ])

        cy.findByLabelText("minimalHelpCard")
          .should(
            "contain.text",
            homeKeys.cta.relationshipManager.button.talkWithExpert,
          )
          .should(
            "contain.text",
            homeKeys.cta.relationshipManager.button.schedule,
          )
      })

      it("should navigate user to KYC journey on clicking complete onboarding CTA", () => {
        cy.intercept("/api/user/qualifications/status", {
          fixture: "proposalJourneyCompleted",
        }).as("userStatus")

        cy.intercept("/api/user/status", {
          fixture: "userStatusQualified",
        }).as("userQualificationStatus")

        cy.intercept("/api/user/summary", {
          fixture: "userSummaryWithLastProposalDate",
        }).as("userSummary")

        cy.intercept("/api/user/investment-goals", {
          fixture: "investmentGoalCompletedResponse",
        }).as("investmentGoalResponse")

        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusVerified",
        }).as("portfolioOpportunities")

        cy.intercept("/api/user/proposals/status", {
          fixture: "proposalsStatusAccepted",
        }).as("proposalsStatus")

        cy.intercept("/api/user/preference/disclaimer", {
          fixture: "userDisclaimerAccepted",
        }).as("userDisclaimerAccepted")

        cy.intercept("/api/user", {
          fixture: "userWithInvestorSurvey",
        }).as("user")

        cy.findByLabelText("KYCTrackerCard")
          .findByRole("button", {
            name: homeKeys.cta.kycIndicator.button.completeOnboarding,
          })
          .click()
        cy.location("pathname").should("equal", "/kyc/personal-information")
      })

      it("should change tracker information to completed once user completes the personal information section of KYC", () => {
        cy.intercept("/api/user/proposals/status", {
          fixture: "proposalsStatusAccepted",
        }).as("proposalsStatus")

        cy.intercept("/api/user/kyc/status", {
          fixture: "kycStatusStep1Completed",
        }).as("kycStatus")

        cy.visit("/")
        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
        ])

        cy.findByLabelText("KYCTrackerCard")
          .findByText(homeKeys.cta.kycIndicator.stepper.stepOne.title)
          .siblings("p")
          .should(
            "have.text",
            homeKeys.cta.kycIndicator.stepper.stepOne.completedDesc,
          )
      })

      it("should change tracker information to completed once user completes the investment experience section of KYC", () => {
        cy.intercept("/api/user/proposals/status", {
          fixture: "proposalsStatusAccepted",
        }).as("proposalsStatus")

        cy.intercept("/api/user/kyc/status", {
          fixture: "kycStatusStep2Completed",
        }).as("kycStatus")

        cy.visit("/")
        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
        ])

        cy.findByLabelText("KYCTrackerCard").within(() => {
          cy.findByText(homeKeys.cta.kycIndicator.keepGoingTitle).should(
            "be.visible",
          )
          cy.findByText(homeKeys.cta.kycIndicator.stepper.stepOne.title)
            .siblings("p")
            .should(
              "have.text",
              homeKeys.cta.kycIndicator.stepper.stepOne.completedDesc,
            )
          cy.findByText(homeKeys.cta.kycIndicator.stepper.stepTwo.title)
            .siblings("p")
            .should(
              "have.text",
              homeKeys.cta.kycIndicator.stepper.stepTwo.completedDesc,
            )
        })
      })

      it("should change tracker information to all Set widget once user completed KYC journey", () => {
        cy.intercept("/api/user/proposals/status", {
          fixture: "proposalsStatusAccepted",
        }).as("proposalsStatus")

        cy.intercept("/api/user/kyc/status", {
          fixture: "kycStatusCompleted",
        }).as("kycStatus")

        cy.visit("/")
        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
        ])

        cy.findByLabelText("KYCTrackerCard").should("not.exist")
        cy.findByLabelText("kycCompletedCard").should(
          "contain.text",
          homeKeys.cta.kycIndicator.completedTitle,
        )
      })

      it("should navigate to schedule meeting page when user clicks on minimized help card", () => {
        cy.findByLabelText("minimalHelpCard")
          .findByLabelText("expandScheduleMeetingIcon")
          .click()

        cy.location("pathname").should("equal", "/schedule-meeting")
      })

      it("should navigated to support page with Help Icon", () => {
        cy.intercept("/api/portfolio/faqs", { fixture: "faqs" }).as("faqs")

        cy.visit("/")
        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
          "@upcomingWebinars",
          "@recentWebinars",
        ])

        cy.findByLabelText("Support Icon").click()

        cy.location("pathname").should("equal", "/support")
      })

      it("should navigated to support page for Help with Get Support Link", () => {
        cy.intercept("/api/portfolio/faqs", { fixture: "faqs" }).as("faqs")

        cy.visit("/")
        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
          "@upcomingWebinars",
          "@recentWebinars",
        ])
        cy.findByRole("button", {
          name: commonKeys.help.link.support,
        }).click()
        cy.location("pathname").should("equal", "/support")
      })

      it("should open General enquiry(help page) with Email Us Link", () => {
        cy.findByRole("button", { name: "Email Button" }).click()
        cy.findByRole("heading", {
          level: 2,
          name: commonKeys.modal.submitEnquiry.title,
        }).should("be.visible")
      })

      it("should see a help card when RM is not assigned to user", () => {
        cy.visit("/")

        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
          "@upcomingWebinars",
          "@recentWebinars",
        ])

        cy.findByRole("button", {
          name: homeKeys.cta.relationshipManager.button.schedule,
        }).should("be.visible")
      })

      it("should see a RM card when RM is assigned to user", () => {
        cy.intercept("/api/user/relationship-manager", {
          fixture: "RMAssigned",
        }).as("relationshipManager")

        cy.reload()
        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
          "@upcomingWebinars",
          "@recentWebinars",
        ])
        cy.fixture("RMAssigned").then((interception) => {
          const relationshipManager =
            interception.manager.firstName + " " + interception.manager.lastName

          cy.findByText(homeKeys.cta.relationshipManager.title)
            .siblings()
            .eq(0)
            .should("have.text", relationshipManager)
        })

        cy.findByRole("button", {
          name: homeKeys.cta.relationshipManager.button.message,
        }).should("be.visible")
        cy.findByRole("button", {
          name: homeKeys.cta.relationshipManager.button.meeting,
        }).should("be.visible")
      })

      it("should have truncated summary of insights card after 1 line", () => {
        cy.findAllByLabelText("insightCard").each((item) => {
          cy.wrap(item)
            .findByLabelText("insightTitle")
            .should("have.css", "webkit-line-clamp", "1")
            .should("have.css", "text-overflow", "ellipsis")
        })
      })

      it("should have truncated title of card after 1 line", () => {
        cy.findAllByLabelText("opportunityCard").each((item) => {
          cy.wrap(item)
            .findByLabelText("title")
            .should("have.css", "webkit-line-clamp", "1")
            .should("have.css", "text-overflow", "ellipsis")
        })
      })

      it("should have truncated summary of card after 3 line", () => {
        cy.findAllByLabelText("opportunityCard").each((item) => {
          cy.wrap(item)
            .findByLabelText("description")
            .should("have.css", "webkit-line-clamp", "3")
            .should("have.css", "text-overflow", "ellipsis")
        })
      })

      it("should not display CTA to Unlock sanitized opportunities for a disqualified investor", () => {
        cy.intercept("/api/user/status", {
          fixture: "userStatusDisQualified",
        }).as("userQualificationStatus")

        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusDisqualified",
        }).as("portfolioOpportunities")

        cy.visit("/")
        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
          "@upcomingWebinars",
          "@recentWebinars",
        ])
        cy.findAllByRole("link", {
          name: opportunitiesKeys.index.button.unlock,
        }).should("not.exist")
      })

      it("should see maximum of 03 random insight cards", () => {
        cy.findAllByLabelText("insightCard")
          .should("have.length.at.most", 3)
          .each(function (item) {
            cy.wrap(item)
              //publish date for insight
              .findByLabelText("insightPublishDate")
              .should("be.visible")
            cy.wrap(item)
              // title of insight
              .findByLabelText("insightTitle")
              .then((title) => {
                // image of insight
                cy.wrap(item).findByAltText(title.text()).should("be.visible")
              })
          })
      })

      it("should take to the general insight page where all the insight types are available on click of See more", () => {
        cy.intercept("/api/portfolio/insights", {
          fixture: "insights",
        }).as("insights")
        cy.findAllByRole("link", { name: commonKeys.button.seeMore })
          .filter("[href='/insights']")
          .click()
        cy.location("pathname").should("equal", "/insights")
      })

      it("should navigate to detailed screen when user clicks on insight", () => {
        cy.intercept("/api/portfolio/insights/article?id=*", {
          fixture: "articleDetails",
        })
        cy.intercept("/api/portfolio/insights/top-articles?excludingId=*", {
          fixture: "topArticles",
        }).as("topArticles")
        cy.findAllByLabelText("insightCardType").eq(0).click()
        cy.location("pathname").should("match", /insights\/(.*)\/(.*)/)
      })
    },
  )
})
