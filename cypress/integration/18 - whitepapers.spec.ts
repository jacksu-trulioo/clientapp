import { InsightsWithPagination } from "../../src/services/mytfo/types"

describe("whitepapers", () => {
  let commonKeys
  let insightKeys
  let currentPage = 1
  let whitepapers: InsightsWithPagination
  let totalPageCount: String

  before(() => {
    cy.loginBE()
    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })

    cy.fixture("../../public/locales/en/insights").then((keys) => {
      insightKeys = keys
    })

    cy.fixture("whitepapersPage1").then((whitepapersList) => {
      whitepapers = whitepapersList
      totalPageCount = Number(Number(whitepapers.totalCount) / 10).toFixed(0)
    })
  })

  beforeEach(() => {
    cy.intercept("/api/user", { fixture: "user" }).as("user")

    cy.intercept("/api/user/relationship-manager", {
      fixture: "RMNotAssigned",
    }).as("relationshipManager")

    cy.intercept("/api/portfolio/insights", {
      fixture: "insights",
    }).as("insights")

    cy.intercept("/api/user/status", {
      fixture: "userStatusNotQualified",
    }).as("userQualificationStatus")

    cy.intercept("/api/user/qualifications/status", {
      fixture: "proposalJourneyNotStarted",
    }).as("userStatus")

    cy.intercept("/api/user/summary", {
      fixture: "userSummary",
    }).as("userSummary")

    cy.intercept("/api/portfolio/opportunities", {
      fixture: "userOpportunityStatusUnverified",
    }).as("portfolioOpportunities")

    cy.intercept("/api/user/preference/disclaimer", {
      fixture: "userDisclaimerAccepted",
    }).as("userDisclaimerAccepted")

    cy.intercept("/api/user/investment-goals", {
      fixture: "investmentGoalQuizNotStarted",
    }).as("investmentGoalResponse")

    cy.intercept("/api/portfolio/insights/whitepapers?currentPage=1", {
      fixture: "whitepapersPage1",
    }).as("whitepapers")

    cy.intercept("/api/portfolio/insights/whitepapers?currentPage=2", {
      fixture: "whitepapersPage2",
    }).as("whitepapers")

    cy.intercept("/api/portfolio/insights/whitepapers?currentPage=3", {
      fixture: "whitepapersPage3",
    }).as("whitepapers")

    cy.intercept(" /api/portfolio/insights/whitepaper?id=*", {
      fixture: "whitepaperDetails",
    }).as("whitepaperDetails")

    cy.intercept("/api/portfolio/insights/top-whitepapers?excludingId=*", {
      fixture: "topWhitepapers",
    }).as("topWhitepapers")
  })

  context("desktop", () => {
    it("should view the entire list of whitepapers", () => {
      cy.visit("/insights")

      cy.wait(["@insights"])

      cy.findAllByRole("link", { name: commonKeys.button.seeMore })
        .filter("[href='/insights/whitepapers']")
        .click()

      cy.wait("@whitepapers")

      cy.location("pathname").should("equal", "/insights/whitepapers")
    })

    it("should display Breadcrumbs navigation for the page", () => {
      cy.findByLabelText("breadcrumb").should(
        "have.text",
        `${commonKeys.breadcrumb.insights}/${commonKeys.breadcrumb.whitepapers}`,
      )
    })

    it("should display heading for whitepapers", () => {
      cy.findByRole("heading", {
        name: insightKeys.page.whitepapers.heading,
      }).should("be.visible")
    })

    it("should display information in a card for whitepaper", () => {
      cy.findAllByLabelText("insightCard").each((item) => {
        cy.wrap(item)
          .findAllByLabelText("insightType")
          .should("have.text", insightKeys.tag.Whitepaper)
        cy.wrap(item).findByLabelText("insightPublishDate").should("be.visible")
        cy.wrap(item)
          // title of whitepaper
          .findByLabelText("insightTitle")
          .then((title) => {
            // image of whitepaper
            cy.wrap(item).findByAltText(title.text()).should("be.visible")
          })
      })
    })

    it("should navigate back using back button to insights page when user is on 3rd list page", () => {
      for (currentPage; currentPage < Number(totalPageCount); currentPage++) {
        cy.findByLabelText("pagination").should(
          "have.text",
          `${commonKeys.pagination.page} ${currentPage} ${commonKeys.pagination.of} ${totalPageCount}`,
        )
        cy.findByLabelText("pagination").findByLabelText("nextPage").click()
      }
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      currentPage--
      cy.location("pathname").should("equal", "/insights")
    })

    it("should be landed on the detailed page of the particular whitepaper", () => {
      cy.visit("/insights/whitepapers")

      cy.wait("@whitepapers")

      cy.findAllByLabelText("insightCard").eq(0).click()

      cy.wait(["@whitepaperDetails", "@topWhitepapers"])

      cy.location("pathname").should("match", /insights\/whitepapers\/*/)
    })

    it("should display CTA to download whitepaper", () => {
      cy.findByRole("button", {
        name: commonKeys.button.downloadWhitepaper,
      }).should("be.visible")
    })

    it("should display maximum 3 related whitepapers ", () => {
      cy.findAllByLabelText("insightCard")
        .should("have.length.at.most", 3)
        .each((item) => {
          cy.wrap(item)
            .findByText(insightKeys.tag.Whitepaper)
            .should("be.visible")
        })
    })

    it("should not display same whitepaper in related content section", () => {
      const currentwhitepaper = cy
        .findAllByRole("heading", { level: 2 })
        .eq(0)
        .its("text")
      cy.findAllByLabelText("insightCard").each((item) => {
        cy.wrap(item)
          .findByLabelText("insightTitle")
          .should("not.contain.text", currentwhitepaper)
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
      it("should view the entire list of whitepapers", () => {
        cy.visit("/insights")

        cy.wait(["@insights"])
        cy.findAllByRole("link", { name: commonKeys.button.seeMore })
          .filter("[href='/insights/whitepapers']")
          .click()
        cy.wait("@whitepapers")

        cy.location("pathname").should("equal", "/insights/whitepapers")
      })

      it("should display Breadcrumbs navigation for the page", () => {
        cy.findByLabelText("breadcrumb").should(
          "have.text",
          `${commonKeys.breadcrumb.insights}/${commonKeys.breadcrumb.whitepapers}`,
        )
      })

      it("should display heading for whitepapers", () => {
        cy.findByRole("heading", {
          name: insightKeys.page.whitepapers.heading,
        }).should("be.visible")
      })

      it("should display information in a card for whitepaper", () => {
        cy.findAllByLabelText("insightCard").each((item) => {
          cy.wrap(item)
            .findByLabelText("insightCardType")
            .should("have.text", insightKeys.tag.Whitepaper)
          cy.wrap(item)
            .findByLabelText("insightPublishDate")
            .should("be.visible")
          cy.wrap(item)
            // title of article
            .findByLabelText("insightTitle")
            .then((title) => {
              // image of article
              cy.wrap(item).findByAltText(title.text()).should("be.visible")
            })
        })
      })

      it("should be landed on the detailed page of the particular whitepaper", () => {
        cy.findAllByLabelText("insightCard").eq(0).click()

        cy.wait(["@whitepaperDetails", "@topWhitepapers"])

        cy.location("pathname").should("match", /insights\/whitepapers\/*/)
      })

      it("should display CTA to download whitepaper", () => {
        cy.findByRole("button", {
          name: commonKeys.button.downloadWhitepaper,
        }).should("be.visible")
      })

      it("should navigate back to insights page on clicking Back button", () => {
        cy.findByRole("button", { name: commonKeys.button.back }).click()
        cy.location("pathname").should("equal", "/insights/whitepapers")
      })
    },
  )
})
