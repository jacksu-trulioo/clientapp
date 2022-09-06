import { InsightsWithPagination } from "../../src/services/mytfo/types"

describe("monthly market updates", () => {
  let commonKeys
  let insightKeys
  let currentPage = 1
  let monthlyMarketUpdatesPage1: InsightsWithPagination
  let totalPageCount: String
  before(() => {
    cy.loginBE()
    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })

    cy.fixture("../../public/locales/en/insights").then((keys) => {
      insightKeys = keys
    })

    cy.fixture("monthlyMarketUpdatesPage1").then((monthlyMarketUpdatesList) => {
      monthlyMarketUpdatesPage1 = monthlyMarketUpdatesList
      totalPageCount = Number(
        Number(monthlyMarketUpdatesPage1.totalCount) / 10,
      ).toFixed(0)
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

    cy.intercept(
      "/api/portfolio/insights/monthly-market-updates?currentPage=1",
      {
        fixture: "monthlyMarketUpdatesPage1",
      },
    ).as("monthlyMarketUpdates")

    cy.intercept(
      "/api/portfolio/insights/monthly-market-updates?currentPage=2",
      {
        fixture: "monthlyMarketUpdatesPage2",
      },
    ).as("monthlyMarketUpdates")

    cy.intercept(
      "/api/portfolio/insights/monthly-market-updates?currentPage=3",
      {
        fixture: "monthlyMarketUpdatesPage3",
      },
    ).as("monthlyMarketUpdates")

    cy.intercept("/api/portfolio/insights/monthly-market-update?id=*", {
      fixture: "monthlyMarketUpdateDetails",
    }).as("monthlyMarketUpdateDetails")

    cy.intercept(
      "/api/portfolio/insights/top-monthly-market-updates?excludingId=*",
      {
        fixture: "topMonthlyMarketUpdates",
      },
    ).as("topMonthlyMarketUpdates")
  })

  context("desktop", () => {
    it("should view the entire list of monthly market updates", () => {
      cy.visit("/insights")

      cy.wait(["@insights"])
      cy.findAllByRole("link", { name: commonKeys.button.seeMore })
        .filter("[href='/insights/monthly-market-updates']")
        .click()
      cy.wait("@monthlyMarketUpdates")

      cy.location("pathname").should(
        "equal",
        "/insights/monthly-market-updates",
      )
    })

    it("should display Breadcrumbs navigation for the page", () => {
      cy.findByLabelText("breadcrumb").should(
        "have.text",
        `${commonKeys.breadcrumb.insights}/${commonKeys.breadcrumb["monthly-market-updates"]}`,
      )
    })

    it("should display heading for Monthly Market Updates", () => {
      cy.findByRole("heading", {
        name: insightKeys.page.monthlyMarketUpdates.heading,
      }).should("be.visible")
    })

    it("should display information in a card for Monthly Market Updates", function () {
      cy.findAllByLabelText("insightCard").each(function (item) {
        cy.wrap(item).findByLabelText("insightPublishDate").should("be.visible")
        cy.wrap(item)
          // title of Monthly Market Updates
          .findByLabelText("insightTitle")
          .then((title) => {
            // image of Monthly Market Updates
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

    it("should show maximum of 10 monthly Market Updates on single page", () => {
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
      cy.intercept("/api/portfolio/insights", {
        fixture: "insights",
      }).as("insights")
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.location("pathname").should("equal", "/insights")
    })

    it("should be landed on the detailed page of the particular Monthly Market Updates", () => {
      cy.visit("/insights/monthly-market-updates")

      cy.wait("@monthlyMarketUpdates")

      cy.findAllByLabelText("insightCard").eq(0).click()

      cy.wait("@monthlyMarketUpdateDetails")

      cy.location("pathname").should(
        "match",
        /insights\/monthly-market-updates\/*/,
      )
    })

    it("should keep all accordion closed by default for content", () => {
      cy.findAllByLabelText("content").each((item) => {
        cy.wrap(item)
          .findByRole("button")
          .should("have.attr", "aria-expanded", "false")
      })
    })

    it("should display maximum 3 related Monthly Market Updates ", () => {
      cy.findAllByLabelText("insightCard")
        .should("have.length.at.most", 3)
        .each((item) => {
          cy.wrap(item)
            .findByText(insightKeys.tag.MonthlyMarketUpdate)
            .should("be.visible")
        })
    })

    it("should not display same Monthly Market Updates in related content section", () => {
      const currentMonthlyMarketUpdate = cy
        .findAllByRole("heading", { level: 2 })
        .eq(0)
        .its("text")
      cy.findAllByLabelText("insightCard").each((item) => {
        cy.wrap(item)
          .findByLabelText("insightTitle")
          .should("not.contain.text", currentMonthlyMarketUpdate)
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
      it("should view the entire list of monthly market updates", () => {
        cy.visit("/insights")

        cy.wait(["@insights"])
        cy.findAllByRole("link", { name: commonKeys.button.seeMore })
          .filter("[href='/insights/monthly-market-updates']")
          .click()

        cy.wait("@monthlyMarketUpdates")

        cy.location("pathname").should(
          "equal",
          "/insights/monthly-market-updates",
        )
      })

      it("should display Breadcrumbs navigation for the page", () => {
        cy.findByLabelText("breadcrumb").should(
          "have.text",
          `${commonKeys.breadcrumb.insights}/${commonKeys.breadcrumb["monthly-market-updates"]}`,
        )
      })

      it("should display heading for Monthly Market Updates", () => {
        cy.findByRole("heading", {
          name: insightKeys.page.monthlyMarketUpdates.heading,
        }).should("be.visible")
      })

      it("should display information in a card for Monthly Market Updates", function () {
        cy.findAllByLabelText("insightCard").each(function (item) {
          cy.wrap(item)
            .findByLabelText("insightPublishDate")
            .should("be.visible")
          cy.wrap(item)
            // title of Monthly Market Updates
            .findByLabelText("insightTitle")
            .then((title) => {
              // image of Monthly Market Updates
              cy.wrap(item).findByAltText(title.text()).should("be.visible")
            })
        })
      })

      it("should be landed on the detailed page of the particular Monthly Market Updates", () => {
        cy.visit("/insights/monthly-market-updates")

        cy.wait("@monthlyMarketUpdates")

        cy.findAllByLabelText("insightCard").eq(0).click()

        cy.wait("@monthlyMarketUpdateDetails")

        cy.location("pathname").should(
          "match",
          /insights\/monthly-market-updates\/*/,
        )
      })

      it("should keep all accordion closed by default for content", () => {
        cy.findAllByLabelText("content").each((item) => {
          cy.wrap(item)
            .findByRole("button")
            .should("have.attr", "aria-expanded", "false")
        })
      })

      it("should navigate back to Monthly Market Updates list page on clicking Back button", () => {
        cy.findByRole("button", { name: commonKeys.button.back }).click()
        cy.location("pathname").should(
          "equal",
          "/insights/monthly-market-updates",
        )
      })
    },
  )
})
