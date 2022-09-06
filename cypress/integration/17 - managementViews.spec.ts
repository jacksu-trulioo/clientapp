describe("management views", () => {
  let commonKeys
  let insightKeys

  before(() => {
    cy.loginBE()

    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })

    cy.fixture("../../public/locales/en/insights").then((keys) => {
      insightKeys = keys
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

    cy.intercept("/api/portfolio/insights/management-views?currentPage=1", {
      fixture: "managementViews",
    }).as("managementViews")

    cy.intercept("/api/portfolio/insights/management-view?id=*", {
      fixture: "managementViewDetails",
    }).as("managementViewDetails")

    cy.intercept("/api/portfolio/insights/top-management-views?excludingId=*", {
      fixture: "topManagementViews",
    }).as("topManagementViews")
  })

  context("desktop", () => {
    it("should view the entire list of management views", () => {
      cy.visit("/insights")

      cy.wait(["@insights"])

      cy.findAllByRole("link", { name: commonKeys.button.seeMore })
        .filter("[href='/insights/management-views']")
        .click()
      cy.wait("@managementViews")

      cy.location("pathname").should("equal", "/insights/management-views")
    })

    it("should display Breadcrumbs navigation for the page", () => {
      cy.findByLabelText("breadcrumb").should(
        "have.text",
        `${commonKeys.breadcrumb.insights}/${commonKeys.breadcrumb["management-views"]}`,
      )
    })

    it("should display heading for management views", () => {
      cy.findByRole("heading", {
        name: insightKeys.page.managementViews.heading,
      }).should("be.visible")
    })

    it("should display information in a card for Management View", function () {
      cy.findAllByLabelText("insightCard").each(function (item) {
        cy.wrap(item).findByLabelText("insightPublishDate").should("be.visible")
        cy.wrap(item)
          // title of Management View
          .findByLabelText("insightTitle")
          .then((title) => {
            // image of Management View
            cy.wrap(item).findByAltText(title.text()).should("be.visible")
          })
      })
    })

    it("should not display pagination when there are less than 10 managementViews", () => {
      cy.findByLabelText("pagination").should("not.exist")
    })

    it("should navigate back to insights page on clicking Back button", () => {
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.location("pathname").should("equal", "/insights")
    })

    it("should be landed on the detailed page of the particular Management View", () => {
      cy.visit("/insights/management-views")

      cy.wait("@managementViews")

      cy.findAllByLabelText("insightCard").eq(0).click()
      cy.wait(["@managementViewDetails", "@topManagementViews"])

      cy.location("pathname").should("match", /insights\/management-views\/*/)

      cy.get("iframe").then(($frame) => {
        expect($frame.attr("src")).to.contains("www.youtube.com")
      })
    })

    it("should display maximum 3 related management views ", () => {
      cy.findAllByLabelText("insightCard")
        .should("have.length.at.most", 3)
        .each((item) => {
          cy.wrap(item)
            .findByText(insightKeys.tag.ManagementView)
            .should("be.visible")
        })
    })

    it("should not display same Management View in related content section", () => {
      const currentManagementView = cy
        .findAllByRole("heading", { level: 2 })
        .eq(0)
        .its("text")
      cy.findAllByLabelText("insightCard").each((item) => {
        cy.wrap(item)
          .findByLabelText("insightTitle")
          .should("not.contain.text", currentManagementView)
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
      it("should view the entire list of management views", () => {
        cy.visit("/insights")

        cy.wait(["@insights"])

        cy.findAllByRole("link", { name: commonKeys.button.seeMore })
          .filter("[href='/insights/management-views']")
          .click()
        cy.wait("@managementViews")

        cy.location("pathname").should("equal", "/insights/management-views")
      })

      it("should display Breadcrumbs navigation for the page", () => {
        cy.findByLabelText("breadcrumb").should(
          "have.text",
          `${commonKeys.breadcrumb.insights}/${commonKeys.breadcrumb["management-views"]}`,
        )
      })

      it("should display heading for Management Views", () => {
        cy.findByRole("heading", {
          name: insightKeys.page.managementViews.heading,
        }).should("be.visible")
      })

      it("should display information in a card for Management View", () => {
        cy.findAllByLabelText("insightCard").each(function (item) {
          cy.wrap(item)
            .findByLabelText("insightPublishDate")
            .should("be.visible")
          cy.wrap(item)
            // title of Management View
            .findByLabelText("insightTitle")
            .then((title) => {
              // image of Management View
              cy.wrap(item).findByAltText(title.text()).should("be.visible")
            })
        })
      })

      it("should be landed on the detailed page of the particular Management View", () => {
        cy.findAllByLabelText("insightCard").eq(0).click()
        cy.wait(["@managementViewDetails", "@topManagementViews"])

        cy.location("pathname").should("match", /insights\/management-views\/*/)

        cy.get("iframe").then(($frame) => {
          expect($frame.attr("src")).to.contains("www.youtube.com")
        })
      })

      it("should navigate back to management views list page on clicking Back button", () => {
        cy.findByRole("button", { name: commonKeys.button.back }).click()
        cy.location("pathname").should("equal", "/insights/management-views")
      })
    },
  )
})
