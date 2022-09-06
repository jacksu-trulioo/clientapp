import { InsightsWithPagination } from "../../src/services/mytfo/types"

describe("articles", () => {
  let commonKeys
  let insightKeys
  let currentPage = 1
  let articlesPage1: InsightsWithPagination
  let totalPageCount: String
  before(() => {
    cy.loginBE()
    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })

    cy.fixture("../../public/locales/en/insights").then((keys) => {
      insightKeys = keys
    })

    cy.fixture("articlesPage1").then((articlesList) => {
      articlesPage1 = articlesList
      totalPageCount = Number(Number(articlesPage1.totalCount) / 10).toFixed(0)
    })
  })

  beforeEach(() => {
    cy.intercept("/api/portfolio/insights", {
      fixture: "insights",
    }).as("insights")

    cy.intercept("/api/user", { fixture: "user" }).as("user")

    cy.intercept("/api/user/relationship-manager", {
      fixture: "RMNotAssigned",
    }).as("relationshipManager")

    cy.intercept("/api/user/status", {
      fixture: "userStatusNotQualified",
    }).as("userQualificationStatus")

    cy.intercept("/api/user/qualifications/status", {
      fixture: "proposalJourneyNotStarted",
    }).as("userStatus")

    cy.intercept("/api/user/summary", {
      fixture: "userSummaryFreshUser",
    }).as("userSummary")

    cy.intercept("/api/user/investment-goals", {
      fixture: "investmentGoalQuizNotStarted",
    }).as("investmentGoalResponse")

    cy.intercept("/api/portfolio/insights", {
      fixture: "insights",
    }).as("insights")

    cy.intercept("/api/portfolio/insights/articles?currentPage=1", {
      fixture: "articlesPage1",
    }).as("articles")

    cy.intercept("/api/portfolio/insights/articles?currentPage=2", {
      fixture: "articlesPage2",
    }).as("articles")

    cy.intercept("/api/portfolio/insights/article?id=*", {
      fixture: "articleDetails",
    }).as("articleDetails")

    cy.intercept("/api/portfolio/insights/top-articles?excludingId=*", {
      fixture: "topArticles",
    }).as("topArticles")

    cy.intercept("/api/portfolio/opportunities", {
      fixture: "userOpportunityStatusUnverified",
    }).as("portfolioOpportunities")

    cy.intercept("/api/user/preference/disclaimer", {
      fixture: "userDisclaimerAccepted",
    }).as("userDisclaimerAccepted")
  })

  context("desktop", () => {
    it("should view the entire list of articles", () => {
      cy.visit("/insights")

      cy.wait(["@insights"])
      cy.findAllByRole("link", { name: commonKeys.button.seeMore })
        .filter("[href='/insights/articles']")
        .click()
      cy.wait("@articles")
      cy.location("pathname").should("equal", "/insights/articles")
    })

    it("should display Breadcrumbs navigation for the page", () => {
      cy.findByLabelText("breadcrumb").should(
        "have.text",
        `${commonKeys.breadcrumb.insights}/${commonKeys.breadcrumb["articles"]}`,
      )
    })

    it("should display heading for articles", () => {
      cy.findByRole("heading", {
        name: insightKeys.page.articles.heading,
      }).should("be.visible")
    })

    it("should display information in a card for article", function () {
      cy.findAllByLabelText("insightCard").each(function (item) {
        cy.wrap(item).findByLabelText("insightPublishDate").should("be.visible")
        cy.wrap(item)
          // title of article
          .findByLabelText("insightTitle")
          .then((title) => {
            // image of article
            cy.wrap(item).findByAltText(title.text()).should("be.visible")
          })
      })
    })

    it("should show pagination", () => {
      cy.findByLabelText("pagination").should(
        "have.text",
        `${commonKeys.pagination.page} ${currentPage} ${commonKeys.pagination.of} ${totalPageCount}`,
      )
    })

    it("should disable left pagination arrow when user is on first page", () => {
      cy.findByLabelText("pagination")
        .findByLabelText("previousPage")
        .should("be.disabled")
    })

    it("should show maximum of 10 articles on single page", () => {
      cy.findAllByLabelText("insightCard").should("have.length.at.most", 10)
    })

    it("should navigate to all pages", () => {
      for (currentPage; currentPage < Number(totalPageCount); currentPage++) {
        cy.findByLabelText("pagination").should(
          "have.text",
          `${commonKeys.pagination.page} ${currentPage} ${commonKeys.pagination.of} ${totalPageCount}`,
        )
        cy.findByLabelText("pagination").findByLabelText("nextPage").click()
      }
    })

    it("should disable next pagination arrow when user is on last page", () => {
      cy.findByLabelText("pagination")
        .findByLabelText("nextPage")
        .should("be.disabled")
    })

    it("should navigate back from last page using pagination arrows", () => {
      for (
        currentPage = Number(totalPageCount);
        currentPage > 1;
        currentPage--
      ) {
        cy.findByLabelText("pagination").should(
          "have.text",
          `${commonKeys.pagination.page} ${currentPage} ${commonKeys.pagination.of} ${totalPageCount}`,
        )
        cy.findByLabelText("pagination").findByLabelText("previousPage").click()
      }
    })

    it("should navigate back to insights page on clicking Back button", () => {
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.location("pathname").should("equal", "/insights")
    })

    it("should be landed on the detailed page of the particular article", () => {
      cy.visit("/insights/articles")

      cy.wait("@articles")

      cy.findAllByLabelText("insightCard").eq(0).click()
      cy.wait(["@articleDetails", "@topArticles"])
      cy.location("pathname").should("match", /insights\/articles\/*/)
    })

    it("should keep all accordion closed by default for content", () => {
      cy.findAllByLabelText("content").each((item) => {
        cy.wrap(item)
          .findByRole("button")
          .should("have.attr", "aria-expanded", "false")
      })
    })

    it("should display maximum 3 related articles ", () => {
      cy.findAllByLabelText("insightCard")
        .should("have.length.at.most", 3)
        .each((item) => {
          cy.wrap(item).findByText(insightKeys.tag.Article).should("be.visible")
        })
    })

    it("should not display same article in related content section", () => {
      const currentArticle = cy
        .findAllByRole("heading", { level: 2 })
        .eq(0)
        .its("text")
      cy.findAllByLabelText("insightCard").each((item) => {
        cy.wrap(item)
          .findByLabelText("insightTitle")
          .should("not.contain.text", currentArticle)
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
      it("should view the entire list of articles", () => {
        cy.visit("/insights")

        cy.wait(["@insights"])
        cy.findAllByRole("link", { name: commonKeys.button.seeMore })
          .filter("[href='/insights/articles']")
          .click()
        cy.wait("@articles")
        cy.location("pathname").should("equal", "/insights/articles")
      })

      it("should display Breadcrumbs navigation for the page", () => {
        cy.findByLabelText("breadcrumb").should(
          "have.text",
          `${commonKeys.breadcrumb.insights}/${commonKeys.breadcrumb["articles"]}`,
        )
      })

      it("should display heading for articles", () => {
        cy.findByRole("heading", {
          name: insightKeys.page.articles.heading,
        }).should("be.visible")
      })

      it("should display information in a card for article", () => {
        cy.findAllByLabelText("insightCard").each(function (item) {
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

      it("should be landed on the detailed page of the particular article", () => {
        cy.findAllByLabelText("insightCard").eq(0).click()
        cy.wait("@articleDetails")
        cy.location("pathname").should("match", /insights\/articles\/*/)
      })

      it("should keep all accordion closed by default for content", () => {
        cy.findAllByLabelText("content").each((item) => {
          cy.wrap(item)
            .findByRole("button")
            .should("have.attr", "aria-expanded", "false")
        })
      })

      it("should navigate back to articles list page on clicking Back button", () => {
        cy.findByRole("button", { name: commonKeys.button.back }).click()
        cy.location("pathname").should("equal", "/insights/articles")
      })
    },
  )
})
