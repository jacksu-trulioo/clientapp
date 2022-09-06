import { InsightsWithPagination } from "../../src/services/mytfo/types"

describe("webinars", () => {
  let commonKeys
  let insightKeys
  let currentPage = 1
  let webinarsPage1: InsightsWithPagination
  let totalPageCount: String
  before(() => {
    cy.loginBE()
    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })

    cy.fixture("../../public/locales/en/insights").then((keys) => {
      insightKeys = keys
    })

    cy.fixture("webinarsPage1").then((webinarsList) => {
      webinarsPage1 = webinarsList
      totalPageCount = Number(Number(webinarsPage1.totalCount) / 10).toFixed(0)
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

    cy.intercept("/api/portfolio/insights/webinars?currentPage=1", {
      fixture: "webinarsPage1",
    }).as("webinars")

    cy.intercept("/api/portfolio/insights/webinars?currentPage=2", {
      fixture: "webinarsPage2",
    }).as("webinars")

    cy.intercept("/api/portfolio/insights/webinars?currentPage=3", {
      fixture: "webinarsPage3",
    }).as("webinars")

    cy.intercept("/api/portfolio/insights/webinars?currentPage=4", {
      fixture: "webinarsPage4",
    }).as("webinars")

    cy.intercept(" /api/portfolio/insights/webinar?id=*", {
      fixture: "webinarDetails",
    }).as("webinarDetails")

    cy.intercept("/api/portfolio/insights/webinars/top?excludingId=*", {
      fixture: "topWebinars",
    }).as("topWebinars")

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
  })

  context("desktop", () => {
    it("should view the entire list of webinars", () => {
      cy.visit("/insights")

      cy.wait("@insights")

      cy.findAllByRole("link", { name: commonKeys.button.seeMore })
        .filter("[href='/insights/webinars']")
        .click()

      cy.location("pathname").should("equal", "/insights/webinars")

      cy.wait("@webinars")
    })

    it("should display Breadcrumbs navigation for the page", () => {
      cy.findByLabelText("breadcrumb").should(
        "have.text",
        `${commonKeys.breadcrumb.insights}/${commonKeys.breadcrumb.webinars}`,
      )
    })

    it("should display heading for webinars", () => {
      cy.findByRole("heading", {
        name: insightKeys.page.webinars.heading,
      }).should("be.visible")
    })

    it("should display information in a card for webinar", () => {
      cy.findAllByLabelText("insightCard").each((item) => {
        cy.wrap(item)
          .findAllByLabelText("insightType")
          .should("have.text", insightKeys.tag.Webinar)

        cy.wrap(item).findByLabelText("insightPublishDate").should("be.visible")
        cy.wrap(item)
          // title of webinar
          .findByLabelText("insightTitle")
          .then((title) => {
            // image of webinar
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

    it("should show maximum of 10 webinars on single page", () => {
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

    it("should be landed on the detailed page of the particular webinar", () => {
      cy.visit("/insights/webinars")

      cy.wait("@webinars")

      cy.findAllByLabelText("insightCard").eq(0).click()
      cy.location("pathname").should("match", /insights\/webinars\/*/)
    })

    it("should display video of webinar", () => {
      cy.findByLabelText("video").should("be.visible")
    })

    it("should display list of guest speakers", () => {
      cy.findAllByLabelText("guests").should("have.lengthOf.at.least", 1)
    })

    it("should display maximum 3 related webinars ", () => {
      cy.findAllByLabelText("insightCard")
        .should("have.length.at.most", 3)
        .each((item) => {
          cy.wrap(item).findByText(insightKeys.tag.Webinar).should("be.visible")
        })
    })

    it("should not display same webinar in related content section", () => {
      const currentwebinar = cy
        .findAllByRole("heading", { level: 2 })
        .eq(0)
        .its("text")
      cy.findAllByLabelText("insightCard").each((item) => {
        cy.wrap(item)
          .findByLabelText("insightTitle")
          .should("not.contain.text", currentwebinar)
      })
    })

    it("should not display related content section if there is only current insight available", () => {
      cy.intercept("/api/portfolio/insights/webinars/top?excludingId=*", {
        fixture: "topWebinarsNotAvailable",
      }).as("topWebinars")
      cy.reload()
      cy.findByRole("heading", {
        name: insightKeys.label.relatedContent,
      }).should("not.exist")
    })
  })

  context(
    "mobile",
    {
      viewportHeight: 812,
      viewportWidth: 375,
    },
    () => {
      it("should view the entire list of webinars", () => {
        cy.visit("/insights")

        cy.wait(["@insights"])

        cy.findAllByRole("link", { name: commonKeys.button.seeMore })
          .filter("[href='/insights/webinars']")
          .click()
        cy.wait("@webinars")

        cy.location("pathname").should("equal", "/insights/webinars")
      })

      it("should display Breadcrumbs navigation for the page", () => {
        cy.findByLabelText("breadcrumb").should(
          "have.text",
          `${commonKeys.breadcrumb.insights}/${commonKeys.breadcrumb.webinars}`,
        )
      })

      it("should display heading for webinars", () => {
        cy.findByRole("heading", {
          name: insightKeys.page.webinars.heading,
        }).should("be.visible")
      })

      it("should display information in a card for webinar", () => {
        cy.findAllByLabelText("insightCard").each((item) => {
          cy.wrap(item)
            .findByLabelText("insightCardType")
            .should("have.text", insightKeys.tag.Webinar)

          cy.wrap(item)
            .findByLabelText("insightPublishDate")
            .should("be.visible")
          cy.wrap(item)
            // title of webinar
            .findByLabelText("insightTitle")
            .then((title) => {
              // image of webinar
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

      it("should show maximum of 10 webinars on single page", () => {
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
          cy.findByLabelText("pagination")
            .findByLabelText("previousPage")
            .click()
        }
      })

      it("should be landed on the detailed page of the particular webinar", () => {
        cy.findAllByLabelText("insightCard").eq(0).click()

        cy.wait("@webinarDetails")

        cy.location("pathname").should("match", /insights\/webinars\/*/)
      })

      it("should display video of webinar", () => {
        cy.intercept("/api/portfolio/insights/webinars/top?excludingId=*", {
          fixture: "topWebinars",
        }).as("topWebinars")
        cy.findByLabelText("video").should("be.visible")
      })

      it("should display list of guest speakers", () => {
        cy.findAllByLabelText("guests").should("have.lengthOf.at.least", 1)
      })

      it("should navigate back to insights page on clicking Back button", () => {
        cy.findByRole("button", { name: commonKeys.button.back }).click()
        cy.location("pathname").should("equal", "/insights/webinars")
      })
    },
  )
})
