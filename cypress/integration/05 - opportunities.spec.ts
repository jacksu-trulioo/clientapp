import { Opportunity, User } from "../../src/services/mytfo/types"

let opportunitiesKeys
let commonKeys
let proposalKeys
let user: User

describe("opportunities", () => {
  let opportunities: Opportunity[]
  before(() => {
    cy.loginBE()

    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })

    cy.fixture("../../public/locales/en/opportunities").then((keys) => {
      opportunitiesKeys = keys
    })

    cy.fixture("../../public/locales/en/proposal").then((keys) => {
      proposalKeys = keys
    })

    cy.fixture("user").then((mockedUser) => {
      user = mockedUser
    })

    cy.fixture("userOpportunityStatusUnverified").then(
      (unVerifiedOpportunities) => {
        opportunities = unVerifiedOpportunities.opportunities
      },
    )
  })

  beforeEach(() => {
    cy.intercept("/api/user", { fixture: "user" }).as("user")

    cy.intercept("/api/user/relationship-manager", {
      fixture: "RMNotAssigned",
    }).as("relationshipManager")

    cy.intercept("/api/portfolio/insights/dashboard", {
      fixture: "dashboardInsights",
    }).as("dashboardInsights")

    cy.intercept("/api/portfolio/webinars/upcomings", {
      fixture: "upcomingWebinars",
    }).as("upcomingWebinars")

    cy.intercept("/api/portfolio/insights/webinars/recent", {
      fixture: "recentWebinars",
    }).as("recentWebinars")

    cy.intercept("/api/portfolio/opportunities", {
      fixture: "userOpportunityStatusUnverified",
    }).as("portfolioOpportunities")

    cy.intercept("/api/user/status", {
      fixture: "userStatusNotQualified",
    }).as("userQualificationStatus")

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

    cy.intercept("/api/user/preference", {
      fixture: "userPreferenceENDefault",
    }).as("languagePreference")

    cy.intercept("/api/user/kyc/status", {
      fixture: "kycNotStarted",
    }).as("kycStatus")

    cy.intercept("/api/user/proposals/status", {
      fixture: "proposalsStatusNotStarted",
    }).as("proposalsStatus")
  })

  context("desktop", () => {
    it("should display Qualify to Unlock CTA", () => {
      cy.visit("/opportunities")

      cy.findAllByText(opportunitiesKeys.index.button.qualify).should(
        "have.length",
        2,
      )
      cy.findByText(opportunitiesKeys.unlock.heading)
    })

    it("should see all sanitized opportunities offered by TFO", () => {
      cy.findAllByText(opportunitiesKeys.index.button.unlock).should(
        "have.length",
        opportunities.length,
      )
    })

    it("should see expected return as confidential for a a non-qualified investor who has not completed the investment profile section yet", () => {
      cy.findAllByText(opportunitiesKeys.index.text.confidential).should(
        "have.length",
        opportunities.length,
      )
    })

    it("should display Sharia'h tag for opportunities with Shariah compliance", () => {
      var shariahCount = 0

      for (var i = 0; i < opportunities.length; i++) {
        if (opportunities[i].isShariahCompliant) {
          shariahCount++
        }
      }

      if (shariahCount > 0) {
        cy.findAllByText(opportunitiesKeys.index.card.tag.shariah).should(
          "have.length",
          shariahCount,
        )
      }
    })

    it("should be able to initiate the investment profile section to unlock opportunities from Qualify to unlock CTA", () => {
      cy.intercept("/api/portfolio/opportunities", {
        fixture: "userOpportunityStatusUnverified",
      }).as("portfolioOpportunities")

      cy.intercept("/api/user/status", {
        fixture: "userStatusNotQualified",
      }).as("userQualificationStatus")

      cy.intercept("/api/user/qualifications/status", {
        fixture: "proposalJourneyNotStarted",
      }).as("userStatus")

      cy.findAllByText(opportunitiesKeys.index.button.qualify).eq(0).click()
      cy.location("pathname").should("equal", "/opportunities/unlock")
    })

    it("should be able to initiate the investment profile section to unlock opportunities", () => {
      cy.intercept("/api/portfolio/opportunities", {
        fixture: "userOpportunityStatusUnverified",
      }).as("portfolioOpportunities")

      cy.intercept("/api/user/status", {
        fixture: "userStatusNotQualified",
      }).as("userQualificationStatus")

      cy.intercept("/api/user/qualifications/status", {
        fixture: "proposalJourneyNotStarted",
      }).as("userStatus")

      cy.visit("/opportunities")

      cy.wait(["@portfolioOpportunities"])
        .its("response.body")
        .then(($body) => {
          opportunities = $body.opportunities
        })

      cy.findAllByLabelText("opportunityCard")
        .eq(0)
        .then((item) => {
          cy.wrap(item)
            .findAllByRole("link", {
              name: opportunitiesKeys.index.button.unlock,
            })
            .click()
        })
      cy.location("pathname").should("equal", "/opportunities/unlock")
    })

    it("should be able to start investment profile", () => {
      cy.intercept("/api/user/profile", {
        fixture: "investmentProfileQuizNotStarted",
      }).as("investmentProfileResponse")
      cy.findByRole("button", {
        name: opportunitiesKeys.unlock.button.getStarted,
      }).click()
      cy.location("pathname").should(
        "equal",
        "/opportunities/unlock/investor-profile",
      )

      cy.location("search").should("equal", "?originPage=opportunity")
    })

    it("should display step name in navigation bar", () => {
      cy.get("header").findByText(
        proposalKeys.chapterSelection.chapterOne.stepper.title,
      )
    })

    it("should display non-qualified if selected US as nationality", () => {
      cy.intercept("/api/user/profile", {
        body: {
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          countryOfResidence: user.profile.countryOfResidence,
          nationality: "US",
          phoneCountryCode: user.profile.phoneCountryCode,
          phoneNumber: user.profile.phoneNumber,
          isTaxableInUS: true,
          isDefinedSophisticatedByCMA: true,
          isAccreditedByCBB: false,
          preProposalInitialAction: null,
        },
      })

      let nationality = "United States"
      cy.findByLabelText("nationality").type(nationality)
      cy.findByRole("button", { name: nationality }).click()
      cy.findAllByRole("radiogroup").eq(0).findByText("Yes").click()
      cy.findAllByRole("radiogroup").eq(1).findByText("No").click()
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByRole("heading", {
        name: proposalKeys.sorryModal.heading,
      }).should("be.visible")
    })

    it("should display non-qualified if selected North Korea as nationality", () => {
      cy.findByRole("button", {
        name: proposalKeys.sorryModal.button.goBack,
      }).click()
      cy.intercept("/api/user/profile", {
        body: {
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          countryOfResidence: user.profile.countryOfResidence,
          nationality: "KP",
          phoneCountryCode: user.profile.phoneCountryCode,
          phoneNumber: user.profile.phoneNumber,
          isTaxableInUS: true,
          isDefinedSophisticatedByCMA: true,
          isAccreditedByCBB: false,
          preProposalInitialAction: null,
        },
      })
      let nationality = "North Korea"
      cy.findByLabelText("nationality").type(nationality)
      cy.findByRole("button", { name: nationality }).click()
      cy.findAllByRole("radiogroup").eq(0).findByText("Yes").click()
      cy.findAllByRole("radiogroup").eq(1).findByText("No").click()
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByRole("heading", {
        name: proposalKeys.sorryModal.heading,
      }).should("be.visible")
    })

    it("should display non-qualified if selected Iran as nationality", () => {
      cy.findByRole("button", {
        name: proposalKeys.sorryModal.button.goBack,
      }).click()
      cy.intercept("/api/user/profile", {
        body: {
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          countryOfResidence: user.profile.countryOfResidence,
          nationality: "IR",
          phoneCountryCode: user.profile.phoneCountryCode,
          phoneNumber: user.profile.phoneNumber,
          isTaxableInUS: true,
          isDefinedSophisticatedByCMA: true,
          isAccreditedByCBB: false,
          preProposalInitialAction: null,
        },
      })
      let nationality = "Iran"
      cy.findByLabelText("nationality").type(nationality)
      cy.findByRole("button", { name: nationality }).click()
      cy.findAllByRole("radiogroup").eq(0).findByText("Yes").click()
      cy.findAllByRole("radiogroup").eq(1).findByText("No").click()
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByRole("heading", {
        name: proposalKeys.sorryModal.heading,
      }).should("be.visible")
    })

    it("should be redirected to opportunities screen on Save & Exit from Q1", () => {
      cy.intercept("/api/portfolio/opportunities", {
        fixture: "userOpportunityStatusUnverified",
      }).as("portfolioOpportunities")
      cy.visit("/opportunities/unlock/investor-profile?originPage=opportunity")
      cy.findByRole("button", { name: commonKeys.button.saveAndExit }).click()
      cy.findByRole("link", { name: commonKeys.button.saveAndExit }).click()
      cy.location("pathname").should("equal", "/opportunities")
    })

    it("should display CTAs for navigating back to dashboard and to view opportunities", () => {
      cy.intercept("/api/user/status", { fixture: "userStatusQualified" }).as(
        "userQualificationStatus",
      )

      cy.visit("/opportunities/unlock/completed")

      cy.wait("@userQualificationStatus")
      cy.findByRole("link", {
        name: opportunitiesKeys.completed.button.viewOpportunities,
      }).should("be.visible")
      cy.findByRole("link", {
        name: opportunitiesKeys.completed.button.backToDashboard,
      }).should("be.visible")
    })

    it("should able to view opportunities for verified user", () => {
      cy.intercept("/api/portfolio/opportunities", {
        fixture: "userOpportunityStatusVerified",
      }).as("portfolioOpportunities")

      cy.findByRole("link", {
        name: opportunitiesKeys.completed.button.viewOpportunities,
      }).click()
      cy.location("pathname").should("equal", "/opportunities")
    })

    it("should display result screen when user scored less than 70%", () => {
      cy.intercept("/api/user/status", {
        fixture: "userStatusPendingVerification",
      }).as("userQualificationStatus")

      cy.visit("/opportunities/unlock/completed")
      cy.wait("@userQualificationStatus")
    })

    it("should not display CTA to view opportunities", () => {
      cy.findByRole("link", {
        name: opportunitiesKeys.completed.button.viewOpportunities,
      }).should("not.exist")
    })

    it("should able to navigate back to dashboard", () => {
      cy.findByRole("link", {
        name: proposalKeys.riskAssessment.completed.button.backToDashboard,
      }).click()
      cy.location("pathname").should("equal", "/")
    })

    it("should see verifying status after user submitted profile information", () => {
      cy.intercept("/api/portfolio/opportunities", {
        fixture: "userOpportunityStatusPendingApproval",
      }).as("portfolioOpportunities")

      cy.intercept("/api/user/status", {
        fixture: "userStatusPendingVerification",
      }).as("userQualificationStatus")

      cy.intercept("/api/user/qualifications/status", {
        fixture: "proposalInvestmentGoalsNotStarted",
      }).as("userStatus")

      cy.visit("/opportunities")

      cy.wait(["@portfolioOpportunities"])
        .its("response.body")
        .then(($body) => {
          opportunities = $body.opportunities
        })

      cy.findAllByText(opportunitiesKeys.index.button.verifying).should(
        "have.length",
        opportunities.length,
      )
    })

    it("should display Profile is being verified status after user submitted profile information", () => {
      cy.findByText(opportunitiesKeys.index.card.defaultVerify.title).should(
        "be.visible",
      )
      cy.findAllByText(opportunitiesKeys.index.button.unlock).should(
        "not.exist",
      )
    })

    it("should see expected return as Unlocking... after user submitted profile information", () => {
      cy.findAllByText(opportunitiesKeys.index.text.unlocking).should(
        "have.length",
        opportunities.length,
      )
    })

    it("should be able to view information about unsanitized opportunities when user is verified", () => {
      cy.intercept("/api/portfolio/opportunities", {
        fixture: "userOpportunityStatusVerified",
      }).as("portfolioOpportunities")

      cy.reload()

      cy.wait(["@portfolioOpportunities"])
      cy.findAllByLabelText("opportunityCard").each((item) => {
        cy.wrap(item).findByLabelText("title").should("be.visible")
        cy.wrap(item).findByLabelText("description").should("be.visible")
        cy.wrap(item)
          .findByRole("link", {
            name: opportunitiesKeys.index.button.viewDetails,
          })
          .should("be.visible")
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

      cy.visit("/opportunities")

      cy.findAllByRole("link", {
        name: opportunitiesKeys.index.button.unlock,
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
      it("should display Qualify to Unlock CTA", () => {
        cy.visit("/opportunities")

        cy.wait(["@portfolioOpportunities"])
          .its("response.body")
          .then(($body) => {
            opportunities = $body.opportunities
          })

        cy.findAllByText(opportunitiesKeys.index.button.qualify).should(
          "have.length",
          2,
        )
        cy.findByText(opportunitiesKeys.unlock.heading)
      })

      it("should see all sanitized opportunities offered by TFO", () => {
        cy.findAllByText(opportunitiesKeys.index.button.unlock).should(
          "have.length",
          opportunities.length,
        )
      })

      it("should see expected return as confidential for a a non-qualified investor who has not completed the investment profile section yet", () => {
        cy.findAllByText(opportunitiesKeys.index.text.confidential).should(
          "have.length",
          opportunities.length,
        )
      })

      it("should display Sharia'h tag for opportunities with Shariah compliance", () => {
        var shariahCount = 0

        for (var i = 0; i < opportunities.length; i++) {
          if (opportunities[i].isShariahCompliant) {
            shariahCount++
          }
        }

        if (shariahCount > 0) {
          cy.findAllByText(opportunitiesKeys.index.card.tag.shariah).should(
            "have.length",
            shariahCount,
          )
        }
      })

      it("should be able to initiate the investment profile section to unlock opportunites from Qualify to unlock CTA", () => {
        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusUnverified",
        }).as("portfolioOpportunities")
        cy.intercept("/api/user/status", {
          fixture: "userStatusNotQualified",
        }).as("userQualificationStatus")

        cy.intercept("/api/user/qualifications/status", {
          fixture: "proposalJourneyNotStarted",
        }).as("userStatus")
        cy.findAllByText(opportunitiesKeys.index.button.qualify).eq(0).click()
        cy.location("pathname").should("equal", "/opportunities/unlock")
      })

      it("should be able to initiate the investment profile section to unlock opportunites", () => {
        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusUnverified",
        }).as("portfolioOpportunities")
        cy.intercept("/api/user/status", {
          fixture: "userStatusNotQualified",
        }).as("userQualificationStatus")

        cy.intercept("/api/user/qualifications/status", {
          fixture: "proposalJourneyNotStarted",
        }).as("userStatus")

        cy.visit("/opportunities")

        cy.wait(["@portfolioOpportunities"])
          .its("response.body")
          .then(($body) => {
            opportunities = $body.opportunities
          })
        cy.findAllByLabelText("opportunityCard")
          .eq(0)
          .then((item) => {
            cy.wrap(item)
              .findAllByRole("link", {
                name: opportunitiesKeys.index.button.unlock,
              })
              .click()
          })
        cy.location("pathname").should("equal", "/opportunities/unlock")
      })

      it("should be able to start investment profile", () => {
        cy.intercept("/api/user/profile", {
          fixture: "investmentProfileQuizNotStarted",
        }).as("investmentProfileResponse")
        cy.findByRole("button", {
          name: opportunitiesKeys.unlock.button.getStarted,
        }).click()
        cy.location("pathname").should(
          "equal",
          "/opportunities/unlock/investor-profile",
        )

        cy.location("search").should("equal", "?originPage=opportunity")
      })

      it("should display step name in navigation bar", () => {
        cy.get("header").findByText(
          proposalKeys.chapterSelection.chapterOne.stepper.title,
        )
      })

      it("should be redirected to opportunities screen on Save & Exit from Q1", () => {
        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusUnverified",
        }).as("portfolioOpportunities")
        cy.visit(
          "/opportunities/unlock/investor-profile?originPage=opportunity",
        )
        cy.findByRole("button", { name: commonKeys.button.saveAndExit }).click()
        cy.findByRole("link", { name: commonKeys.button.saveAndExit }).click()
        cy.location("pathname").should("equal", "/opportunities")
      })

      it("should display result screen when user scored greater than/ equal to 70%", () => {
        cy.intercept("/api/user/status", { fixture: "userStatusQualified" }).as(
          "userQualificationStatus",
        )
        cy.visit("/opportunities/unlock/completed")
        cy.wait("@userQualificationStatus")
      })

      it("should display CTAs for navigating back to dashboard and to view opportunities", () => {
        cy.findByRole("link", {
          name: opportunitiesKeys.completed.button.viewOpportunities,
        }).should("be.visible")
        cy.findByRole("link", {
          name: opportunitiesKeys.completed.button.backToDashboard,
        }).should("be.visible")
      })

      it("should able to view opportunities for verified user", () => {
        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusVerified",
        }).as("portfolioOpportunities")
        cy.findByRole("link", {
          name: opportunitiesKeys.completed.button.viewOpportunities,
        }).click()
        cy.location("pathname").should("equal", "/opportunities")
      })

      it("should display result screen when user scored less than 70%", () => {
        cy.intercept("/api/user/status", {
          fixture: "userStatusPendingVerification",
        }).as("userQualificationStatus")

        cy.visit("/opportunities/unlock/completed")
        cy.wait("@userQualificationStatus")
      })

      it("should not display CTA to view opportunities", () => {
        cy.findByRole("link", {
          name: opportunitiesKeys.completed.button.viewOpportunities,
        }).should("not.exist")
      })

      it("should able to navigate back to dashboard", () => {
        cy.findByRole("link", {
          name: opportunitiesKeys.completed.button.backToDashboard,
        }).click()
        cy.location("pathname").should("equal", "/")
      })

      it("should see verifying status after user submitted profile information", () => {
        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusPendingApproval",
        }).as("portfolioOpportunities")

        cy.visit("/opportunities")

        cy.wait(["@portfolioOpportunities"])
          .its("response.body")
          .then(($body) => {
            opportunities = $body.opportunities
          })

        cy.findAllByText(opportunitiesKeys.index.button.verifying).should(
          "have.length",
          opportunities.length,
        )
      })

      it("should display Profile is being verified status after user submitted profile information", () => {
        cy.findByText(opportunitiesKeys.index.card.defaultVerify.title).should(
          "be.visible",
        )
        cy.findAllByText(opportunitiesKeys.index.button.unlock).should(
          "not.exist",
        )
      })

      it("should see expected return as Unlocking... after user submitted profile information", () => {
        cy.findAllByText(opportunitiesKeys.index.text.unlocking).should(
          "have.length",
          opportunities.length,
        )
      })

      it("should be able to view information about unsanitized opportunities when user is verified", () => {
        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusVerified",
        }).as("portfolioOpportunities")

        cy.reload()

        cy.wait(["@portfolioOpportunities"])

        cy.findAllByLabelText("opportunityCard").each((item) => {
          cy.wrap(item).findByLabelText("title").should("be.visible")
          cy.wrap(item).findByLabelText("description").should("be.visible")
          cy.wrap(item)
            .findByRole("link", {
              name: opportunitiesKeys.index.button.viewDetails,
            })
            .should("be.visible")
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

        cy.visit("/opportunities")

        cy.findAllByRole("link", {
          name: opportunitiesKeys.index.button.unlock,
        }).should("not.exist")
      })
    },
  )
})
