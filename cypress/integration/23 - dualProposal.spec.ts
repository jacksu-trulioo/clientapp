import { MyProposal } from "../../src/services/mytfo/types"

describe("Dual proposal: As a user who completed the pre-proposal journey and is qualified, would be able to see two proposal", () => {
  let shortTermProposalDetails: MyProposal
  let longTermProposalDetails: MyProposal
  let homeKeys
  let personalisedProposalKeys

  before(() => {
    cy.fixture("../../public/locales/en/home").then((keys) => {
      homeKeys = keys
    })
    cy.fixture("../../public/locales/en/personalizedProposal").then((keys) => {
      personalisedProposalKeys = keys
    })

    cy.fixture("userDualProposals").then((userProposal) => {
      shortTermProposalDetails = userProposal[0]
      longTermProposalDetails = userProposal[1]
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

    cy.intercept("/api/user/proposals/status", {
      fixture: "proposalsStatusGenerated",
    }).as("proposalsStatus")

    cy.intercept("/api/user/kyc/status", {
      fixture: "kycNotStarted",
    }).as("kycStatus")

    cy.intercept("/api/user/proposals", { fixture: "userDualProposals" }).as(
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

    cy.intercept("/api/portfolio/proposal/deals?id=Opportunistic", {
      fixture: "proposalOpportunisticDeals",
    }).as("proposalOpportunisticDeals")

    cy.intercept("/api/user/preference", {
      fixture: "userPreferenceENDefault",
    }).as("userPreference")

    cy.intercept("/api/user/preference/disclaimer", {
      fixture: "userDisclaimerAccepted",
    }).as("userDisclaimerAccepted")

    cy.intercept("/api/user/risk-assessment/retake-result", {
      fixture: "retakeRiskAssessmentResult",
    }).as("retakeRiskAssessmentResult")
  })

  context("desktop", () => {
    it("should able to view two proposals", () => {
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
        name: homeKeys.cta.portfolioCompleted.button.viewDetails,
      }).click()

      cy.location("pathname").should("equal", "/personalized-proposal")

      cy.findByLabelText("multipleProposalTitle").should(
        "have.text",
        personalisedProposalKeys.multipleProposal.title,
      )
    })

    it("should be able to select short term proposal", () => {
      cy.findByText(
        personalisedProposalKeys.multipleProposal.labels.shortTerm,
      ).click()
      cy.findByRole("button", {
        name: personalisedProposalKeys.multipleProposal.button.continue,
      }).click()
    })

    it("should select short term proposal in left navigation dropdown by default", () => {
      cy.findByLabelText("proposalType").should(
        "have.text",
        personalisedProposalKeys.leftNavigation.select.shortTerm,
      )
    })

    it("should show summary metrics of selected proposal", () => {
      cy.findAllByLabelText("summaryMetrics")
        .eq(0)
        .findByText(
          personalisedProposalKeys.yourAllocation.proposalFacts.expectedReturn
            .label,
        )
        .parent("div")
        .siblings("p")
        .should(
          "have.text",
          `${Number(
            Number(shortTermProposalDetails.expectedReturn) * 100,
          ).toFixed(1)}%`,
        )

      cy.findAllByLabelText("summaryMetrics")
        .eq(1)
        .findByText(
          personalisedProposalKeys.yourAllocation.proposalFacts.expectedYield
            .label,
        )
        .parent("div")
        .siblings("p")
        .should(
          "have.text",
          `${Number(
            Number(shortTermProposalDetails.expectedYield) * 100,
          ).toFixed(1)}%`,
        )

      cy.findAllByLabelText("summaryMetrics")
        .eq(2)
        .findByText(
          personalisedProposalKeys.yourAllocation.proposalFacts
            .forecastedVolatility.label,
        )
        .parent("div")
        .siblings("p")
        .should(
          "have.text",
          `${Number(
            Number(shortTermProposalDetails.forecastedVolatility) * 100,
          ).toFixed(1)}%`,
        )

      cy.findAllByLabelText("summaryMetrics")
        .eq(3)
        .findByText(
          personalisedProposalKeys.yourAllocation.proposalFacts.sharpeRatio
            .label,
        )
        .parent("div")
        .siblings("p")
        .should(
          "have.text",
          `${Number(shortTermProposalDetails.sharpeRatio).toFixed(2)}`,
        )
    })

    it("should be able to switch another proposal from left navigation dropdown", () => {
      cy.findByLabelText("proposalType").click()
      cy.findByRole("button", {
        name: personalisedProposalKeys.leftNavigation.select.longTerm,
      }).click()
      cy.findByLabelText("proposalType").should(
        "contain.text",
        personalisedProposalKeys.leftNavigation.select.longTerm,
      )
    })

    it("should show summary metrics of selected proposal", () => {
      cy.findAllByLabelText("summaryMetrics")
        .eq(0)
        .findByText(
          personalisedProposalKeys.yourAllocation.proposalFacts.expectedReturn
            .label,
        )
        .parent("div")
        .siblings("p")
        .should(
          "have.text",
          `${Number(
            Number(longTermProposalDetails.expectedReturn) * 100,
          ).toFixed(1)}%`,
        )

      cy.findAllByLabelText("summaryMetrics")
        .eq(1)
        .findByText(
          personalisedProposalKeys.yourAllocation.proposalFacts.expectedYield
            .label,
        )
        .parent("div")
        .siblings("p")
        .should(
          "have.text",
          `${Number(
            Number(longTermProposalDetails.expectedYield) * 100,
          ).toFixed(1)}%`,
        )

      cy.findAllByLabelText("summaryMetrics")
        .eq(2)
        .findByText(
          personalisedProposalKeys.yourAllocation.proposalFacts
            .forecastedVolatility.label,
        )
        .parent("div")
        .siblings("p")
        .should(
          "have.text",
          `${Number(
            Number(longTermProposalDetails.forecastedVolatility) * 100,
          ).toFixed(1)}%`,
        )

      cy.findAllByLabelText("summaryMetrics")
        .eq(3)
        .findByText(
          personalisedProposalKeys.yourAllocation.proposalFacts.sharpeRatio
            .label,
        )
        .parent("div")
        .siblings("p")
        .should(
          "have.text",
          `${Number(longTermProposalDetails.sharpeRatio).toFixed(2)}`,
        )
    })

    it("should save user selection for proposal as a preference", () => {
      cy.intercept("/api/user/preference", {
        fixture: "userPreferenceProposal",
      }).as("userPreference")

      cy.reload()

      cy.findByLabelText("proposalType").should(
        "contain.text",
        personalisedProposalKeys.leftNavigation.select.longTerm,
      )
    })

    it("should not show left navigation dropdown if user has editted parameters and only one proposal is generated", () => {
      cy.intercept("/api/user/proposals", { fixture: "userProposals" }).as(
        "userProposals",
      )

      cy.reload()

      cy.findByLabelText("proposalType").should("not.exist")
    })
  })

  context(
    "mobile",
    {
      viewportHeight: 844,
      viewportWidth: 390,
    },
    () => {
      it("should able to view two proposals", () => {
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
          name: homeKeys.cta.portfolioCompleted.button.viewDetails,
        }).click()

        cy.location("pathname").should("equal", "/personalized-proposal")

        cy.findByLabelText("multipleProposalTitle").should(
          "have.text",
          personalisedProposalKeys.multipleProposal.title,
        )
      })

      it("should be able to select short term proposal", () => {
        cy.findByText(
          personalisedProposalKeys.multipleProposal.labels.shortTerm,
        ).click()
        cy.findByRole("button", {
          name: personalisedProposalKeys.multipleProposal.button.continue,
        }).click()
      })

      it("should select short term proposal in left navigation dropdown by default", () => {
        cy.findByLabelText("proposalType").should(
          "have.text",
          personalisedProposalKeys.leftNavigation.select.shortTerm,
        )
      })

      it("should show summary metrics of selected proposal", () => {
        cy.findAllByLabelText("summaryMetrics")
          .eq(0)
          .findByText(
            personalisedProposalKeys.yourAllocation.proposalFacts.expectedReturn
              .label,
          )
          .parent("div")
          .siblings("p")
          .should(
            "have.text",
            `${Number(
              Number(shortTermProposalDetails.expectedReturn) * 100,
            ).toFixed(1)}%`,
          )

        cy.findAllByLabelText("summaryMetrics")
          .eq(1)
          .findByText(
            personalisedProposalKeys.yourAllocation.proposalFacts.expectedYield
              .label,
          )
          .parent("div")
          .siblings("p")
          .should(
            "have.text",
            `${Number(
              Number(shortTermProposalDetails.expectedYield) * 100,
            ).toFixed(1)}%`,
          )

        cy.findAllByLabelText("summaryMetrics")
          .eq(2)
          .findByText(
            personalisedProposalKeys.yourAllocation.proposalFacts
              .forecastedVolatility.label,
          )
          .parent("div")
          .siblings("p")
          .should(
            "have.text",
            `${Number(
              Number(shortTermProposalDetails.forecastedVolatility) * 100,
            ).toFixed(1)}%`,
          )

        cy.findAllByLabelText("summaryMetrics")
          .eq(3)
          .findByText(
            personalisedProposalKeys.yourAllocation.proposalFacts.sharpeRatio
              .label,
          )
          .parent("div")
          .siblings("p")
          .should(
            "have.text",
            `${Number(shortTermProposalDetails.sharpeRatio).toFixed(2)}`,
          )
      })

      it("should be able to switch another proposal from left navigation dropdown", () => {
        cy.findByLabelText("proposalType").find("svg").click()
        cy.findByRole("button", {
          name: personalisedProposalKeys.leftNavigation.select.longTerm,
        }).click()
        cy.findByLabelText("proposalType").should(
          "contain.text",
          personalisedProposalKeys.leftNavigation.select.longTerm,
        )
      })

      it("should show summary metrics of selected proposal", () => {
        cy.findAllByLabelText("summaryMetrics")
          .eq(0)
          .findByText(
            personalisedProposalKeys.yourAllocation.proposalFacts.expectedReturn
              .label,
          )
          .parent("div")
          .siblings("p")
          .should(
            "have.text",
            `${Number(
              Number(longTermProposalDetails.expectedReturn) * 100,
            ).toFixed(1)}%`,
          )

        cy.findAllByLabelText("summaryMetrics")
          .eq(1)
          .findByText(
            personalisedProposalKeys.yourAllocation.proposalFacts.expectedYield
              .label,
          )
          .parent("div")
          .siblings("p")
          .should(
            "have.text",
            `${Number(
              Number(longTermProposalDetails.expectedYield) * 100,
            ).toFixed(1)}%`,
          )

        cy.findAllByLabelText("summaryMetrics")
          .eq(2)
          .findByText(
            personalisedProposalKeys.yourAllocation.proposalFacts
              .forecastedVolatility.label,
          )
          .parent("div")
          .siblings("p")
          .should(
            "have.text",
            `${Number(
              Number(longTermProposalDetails.forecastedVolatility) * 100,
            ).toFixed(1)}%`,
          )

        cy.findAllByLabelText("summaryMetrics")
          .eq(3)
          .findByText(
            personalisedProposalKeys.yourAllocation.proposalFacts.sharpeRatio
              .label,
          )
          .parent("div")
          .siblings("p")
          .should(
            "have.text",
            `${Number(longTermProposalDetails.sharpeRatio).toFixed(2)}`,
          )
      })

      it("should save user selection for proposal as a preference", () => {
        cy.intercept("/api/user/preference", {
          fixture: "userPreferenceProposal",
        }).as("userPreference")

        cy.reload()

        cy.findByLabelText("proposalType").should(
          "contain.text",
          personalisedProposalKeys.leftNavigation.select.longTerm,
        )
      })

      it("should not show left navigation dropdown if user has editted parameters and only one proposal is generated", () => {
        cy.intercept("/api/user/proposals", { fixture: "userProposals" }).as(
          "userProposals",
        )

        cy.reload()

        cy.findByLabelText("proposalType").should("not.exist")
      })
    },
  )
})
