import faker from "faker"

let commonKeys

describe("Get in touch regarding a general query", () => {
  before(() => {
    cy.loginBE()

    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })
  })

  beforeEach(() => {
    cy.intercept("/api/portfolio/opportunities", {
      fixture: "userOpportunityStatusUnverified",
    }).as("portfolioOpportunities")

    cy.intercept("/api/user/relationship-manager", {
      fixture: "RMNotAssigned",
    }).as("relationshipManager")

    cy.intercept("/api/user/status", {
      fixture: "userStatusNotQualified",
    }).as("userQualificationStatus")

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

    cy.intercept("/api/user/summary", {
      fixture: "userSummaryFreshUser",
    }).as("userSummary")

    cy.intercept("/api/user/investment-goals", {
      fixture: "investmentGoalQuizNotStarted",
    }).as("investmentGoalResponse")

    cy.intercept("/api/user/proposals/status", {
      fixture: "proposalsStatusNotStarted",
    }).as("proposalsStatus")

    cy.intercept("/api/user/kyc/status", {
      fixture: "kycNotStarted",
    }).as("kycStatus")
  })

  context("desktop", () => {
    it("should not allow user to enter more than 300 characters ", () => {
      cy.visit("/")

      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
      ])

      cy.findByRole("button", { name: commonKeys.help.button.email }).click()
      cy.findByPlaceholderText(commonKeys.textarea.placeholder).should(
        "have.attr",
        "maxlength",
        "300",
      )
    })

    it("should not be allowed to submit without text", () => {
      cy.findByRole("button", { name: commonKeys.button.submit }).click()
      cy.findAllByText(commonKeys.errors.required).should("have.length", 2)
    })

    it("should able to submit email", () => {
      cy.findByRole("group", { name: "reason" }).type(
        commonKeys.modal.reasons.learnMore.label,
      )
      cy.findByRole("button", {
        name: commonKeys.modal.reasons.learnMore.label,
      }).click()

      cy.findByPlaceholderText(commonKeys.textarea.placeholder).type(
        faker.lorem.lines(1),
      )

      cy.intercept("/api/user/inquiry/email", {
        fixture: "successSentEmail",
      }).as("successSentEmail")

      cy.findByRole("button", { name: commonKeys.button.submit }).click()
      cy.wait("@successSentEmail")
    })

    it("should see a confirmation message confirming that the message has been emailed.", () => {
      cy.findByText(commonKeys.modal.emailSent.title).should("be.visible")
    })

    it("should able to close email confirmation modal window using close icon", () => {
      cy.findByRole("button", { name: commonKeys.button.close }).click()
      cy.findByRole("button", { name: commonKeys.help.button.email }).should(
        "be.visible",
      )
    })

    it("should able to close inquiry form using close icon", () => {
      cy.findByRole("button", { name: commonKeys.help.button.email }).click()
      cy.findByRole("button", { name: commonKeys.button.close }).click()
      cy.findByRole("button", { name: commonKeys.help.button.email }).should(
        "be.visible",
      )
    })
  })

  context(
    "mobile",
    {
      viewportHeight: 812,
      viewportWidth: 375,
    },
    () => {
      it("should not allow user to enter more than 300 characters ", () => {
        cy.visit("/")

        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
        ])

        cy.findByRole("button", { name: "Email Button" }).click()
        cy.findByPlaceholderText(commonKeys.textarea.placeholder).should(
          "have.attr",
          "maxlength",
          "300",
        )
      })

      it("should not be allowed to submit without text", () => {
        cy.findByRole("button", { name: commonKeys.button.submit }).click()
        cy.findAllByText(commonKeys.errors.required).should("have.length", 2)
      })

      it("should able to submit email", () => {
        cy.findByRole("group", { name: "reason" }).type(
          commonKeys.modal.reasons.learnMore.label,
        )
        cy.findByRole("button", {
          name: commonKeys.modal.reasons.learnMore.label,
        }).click()

        cy.findByPlaceholderText(commonKeys.textarea.placeholder).type(
          faker.lorem.lines(1),
        )

        cy.intercept("/api/user/inquiry/email", {
          fixture: "successSentEmail",
        }).as("successSentEmail")

        cy.findByRole("button", { name: commonKeys.button.submit }).click()
        cy.wait("@successSentEmail")
      })

      it("should see a confirmation message confirming that the message has been emailed.", () => {
        cy.findByText(commonKeys.modal.emailSent.title).should("be.visible")
      })

      it("should able to close email confirmation modal window using close icon", () => {
        cy.findByRole("button", { name: commonKeys.button.close }).click()
        cy.findByRole("button", { name: "Email Button" }).should("be.visible")
      })

      it("should able to close inquiry form using close icon", () => {
        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusUnverified",
        }).as("portfolioOpportunities")
        cy.intercept("/api/user/relationship-manager", {
          fixture: "RMNotAssigned",
        }).as("relationshipManager")
        cy.intercept("/api/user/status", {
          fixture: "userStatusNotQualified",
        }).as("userQualificationStatus")
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

        cy.findByRole("button", { name: "Email Button" }).click()
        cy.findByRole("button", { name: commonKeys.button.close }).click()
        cy.findByRole("button", { name: "Email Button" }).should("be.visible")
      })
    },
  )
})
