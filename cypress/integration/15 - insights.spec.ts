import { Insights } from "../../src/services/mytfo/types"

describe("insights - view all content categories", () => {
  let insightList: Insights[]

  before(() => {
    cy.loginBE()

    cy.fixture("insights").then((insights) => {
      insightList = insights
    })
  })

  beforeEach(() => {
    cy.intercept("/api/user/relationship-manager", {
      fixture: "RMNotAssigned",
    }).as("relationshipManager")

    cy.intercept("/api/user/status", {
      fixture: "userStatusNotQualified",
    }).as("userQualificationStatus")

    cy.intercept("/api/portfolio/opportunities", {
      fixture: "userOpportunityStatusUnverified",
    }).as("portfolioOpportunities")

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

    cy.intercept("/api/user", { fixture: "user" }).as("user")

    cy.intercept("/api/user/preference/disclaimer", {
      fixture: "userDisclaimerAccepted",
    }).as("userDisclaimerAccepted")

    cy.intercept("/api/portfolio/insights", {
      fixture: "insights",
    }).as("insights")

    cy.intercept("/api/portfolio/insights/article?id=*", {
      fixture: "articleDetails",
    })

    cy.intercept("/api/portfolio/insights/top-articles?excludingId=*", {
      fixture: "topArticles",
    }).as("topArticles")

    cy.intercept("/api/user/summary", {
      fixture: "userSummaryFreshUser",
    }).as("userSummary")

    cy.intercept("/api/user/investment-goals", {
      fixture: "investmentGoalQuizNotStarted",
    }).as("investmentGoalResponse")
  })

  context("desktop", () => {
    it("should display all categories of insights", () => {
      cy.visit("/insights")

      insightList.forEach((insight) => {
        const typeName = insight.type.replace(/([A-Z])/g, " $1").trim()
        cy.findAllByRole("heading", { level: 2 }).should(
          "contain.text",
          typeName,
        )
      })
    })

    it("should display maximum 3 related cards in each insight category ", () =>
      cy.findAllByLabelText("insightContainer").each((insightCategory) => {
        let categoryCards = []
        cy.wrap(insightCategory)
          .findAllByLabelText("insightCardType")
          // validate atmost 3 cards are displayed for each category
          .should("have.length.at.most", 3)
          .each((card) => {
            categoryCards.push(card.text())
          })
        // validate all cards are of same category
        expect(categoryCards.every((item) => item === item[0])).to.be.true
      }))

    it("should navigate to detailed screen when user clicks on insight", () => {
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
      it("should display all categories of insights", () => {
        cy.visit("/insights")

        insightList.forEach((insight) => {
          const typeName = insight.type.replace(/([A-Z])/g, " $1").trim()
          cy.findAllByRole("heading", { level: 2 }).should(
            "contain.text",
            typeName,
          )
        })
      })

      it("should display maximum 3 related cards in each insight category ", () =>
        cy.findAllByLabelText("insightContainer").each((insightCategory) => {
          let categoryCards = []
          cy.wrap(insightCategory)
            .findAllByLabelText("insightCardType")
            // validate atmost 3 cards are displayed for each category
            .should("have.length.at.most", 3)
            .each((card) => {
              categoryCards.push(card.text())
            })
          // validate all cards are of same category
          expect(categoryCards.every((item) => item === item[0])).to.be.true
        }))

      it("should navigate to detailed screen when user clicks on insight", () => {
        cy.findAllByLabelText("insightCardType").eq(0).click()
        cy.location("pathname").should("match", /insights\/(.*)\/(.*)/)
      })
    },
  )
})
