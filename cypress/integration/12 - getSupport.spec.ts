import siteConfig from "../../src/config"
import { FAQ } from "../../src/services/mytfo/types"

let supportKeys
let commonKeys
let faqs: FAQ[]

const { inquiryEmail } = siteConfig

describe("Help - Support page & FAQ", () => {
  before(() => {
    cy.fixture("../../public/locales/en/support").then((keys) => {
      supportKeys = keys
    })

    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })

    cy.fixture("faqs").then((json) => {
      faqs = json
    })

    cy.loginBE()
  })

  beforeEach(() => {
    cy.intercept("/api/portfolio/faqs", { fixture: "faqs" }).as("faqs")

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

    cy.intercept("/api/user", { fixture: "user" }).as("user")

    cy.intercept("/api/user/qualifications/status", {
      fixture: "proposalJourneyNotStarted",
    }).as("userStatus")

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
    it("should able to contact client service", () => {
      // needed to visit dashboard first to simulate Back button scenario
      cy.visit("/")

      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
      ])

      cy.visit("/support")

      cy.findByRole("button", {
        name: supportKeys.card.contactClientService.title,
      })
        .click()
        .then(() => {
          cy.findByPlaceholderText(commonKeys.textarea.placeholder).should(
            "have.attr",
            "maxlength",
            "300",
          )
        })
    })

    it("should able to close contact client service", () => {
      cy.findByRole("button", { name: commonKeys.button.close })
        .click()
        .then(() => {
          cy.findByText(supportKeys.headings.faqs).should("be.visible")
        })
    })

    it("should display CTA to Schedule a call with CS for non-qualified user", () => {
      cy.findByRole("button", {
        name: supportKeys.card.talkWithExperts.title,
      }).should("be.visible")
    })

    it("should display CTA to Schedule a call with RM for qualified user", () => {
      cy.intercept("/api/user/status", { fixture: "userStatusQualified" }).as(
        "userStatus",
      )

      cy.intercept("/api/user/relationship-manager", {
        fixture: "RMAssigned",
      }).as("relationshipManager")

      cy.reload()

      cy.wait(["@userStatus", "@relationshipManager"])

      cy.wait("@faqs").then(() => {
        cy.findByRole("button", {
          name: supportKeys.card.scheduleMeeting.title,
        }).should("be.visible")
      })
    })

    it("first faq accordian must be open by default", () => {
      cy.findByText(faqs[0].title).should("be.visible")
      cy.findByText(faqs[0].description).should("be.visible")
    })

    it("should able to expand and view all FAQs", () => {
      for (var i = 1; i < faqs.length; i++) {
        // expand accordian
        cy.findByText(faqs[i].title).click()

        //if description is visible
        cy.findByText(faqs[i].description).should("be.visible")
      }
    })

    it("should view Email contact information", () => {
      cy.findByText(supportKeys.text.email)
        .parent()
        .siblings()
        .eq(0)
        .should("have.text", inquiryEmail)
    })

    it("should able to navigate back to dashboard", () => {
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.location("pathname").should("equal", "/")
      cy.wait([
        "@userSummary",
        "@investmentGoalResponse",
        "@kycStatus",
        "@userDisclaimerAccepted",
      ])
    })
  })

  context(
    "mobile",
    {
      viewportHeight: 812,
      viewportWidth: 375,
    },
    () => {
      it("should able to contact client service", () => {
        cy.visit("/")

        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
        ])

        cy.visit("/support")

        cy.findByRole("button", {
          name: supportKeys.card.contactClientService.title,
        })
          .click()
          .then(() => {
            cy.findByPlaceholderText(commonKeys.textarea.placeholder).should(
              "have.attr",
              "maxlength",
              "300",
            )
          })
      })

      it("should able to close contact client service", () => {
        cy.findByRole("button", { name: commonKeys.button.close }).click()
        cy.findByText(supportKeys.headings.faqs).should("be.visible")
      })

      it("should display CTA to Schedule a call with CS for non-qualified user", () => {
        cy.findByRole("button", {
          name: supportKeys.card.talkWithExperts.title,
        }).should("be.visible")
      })

      it("should display CTA to Schedule a call with RM for qualified user", () => {
        cy.intercept("/api/user/status", { fixture: "userStatusQualified" }).as(
          "userStatus",
        )

        cy.intercept("/api/user/relationship-manager", {
          fixture: "RMAssigned",
        }).as("relationshipManager")

        cy.reload()

        cy.wait(["@userStatus", "@relationshipManager"])

        cy.wait("@faqs").then((interception) => {
          faqs = interception.response.body

          cy.findByRole("button", {
            name: supportKeys.card.scheduleMeeting.title,
          }).should("be.visible")
        })
      })

      it("first faq accordian must be open by default", () => {
        cy.findByText(faqs[0].title).should("be.visible")
        cy.findByText(faqs[0].description).should("be.visible")
      })

      it("should able to expand and view all FAQs", () => {
        for (var i = 1; i < faqs.length; i++) {
          // expand accordian
          cy.findByText(faqs[i].title).click()

          //if description is visible
          cy.findByText(faqs[i].description).should("be.visible")
        }
      })

      it("should view Email contact information", () => {
        cy.findByText(supportKeys.text.email)
          .parent()
          .siblings()
          .eq(0)
          .should("have.text", inquiryEmail)
      })

      it("should able to navigate back to dashboard", () => {
        cy.findByRole("button", { name: commonKeys.button.back }).click()
        cy.location("pathname").should("equal", "/")
      })
    },
  )
})
