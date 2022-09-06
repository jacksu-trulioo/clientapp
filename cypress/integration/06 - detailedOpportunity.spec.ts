describe("detailed opportunities", () => {
  let opportunitiesKeys
  let scheduleMeetingKeys
  let commonKeys
  before(() => {
    cy.loginBE()

    cy.fixture("../../public/locales/en/opportunities").then((keys) => {
      opportunitiesKeys = keys
    })

    cy.fixture("../../public/locales/en/scheduleMeeting").then((keys) => {
      scheduleMeetingKeys = keys
    })

    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })
  })

  beforeEach(() => {
    cy.intercept("/api/portfolio/opportunities", {
      fixture: "userOpportunityStatusVerified",
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

    cy.intercept("/api/user/investment-goals", {
      fixture: "investmentGoalQuizNotStarted",
    }).as("investmentGoalResponse")

    cy.intercept("/api/user/preference", {
      fixture: "userPreferenceENDefault",
    }).as("languagePreference")

    cy.intercept("/api/user/summary", {
      fixture: "userSummary",
    }).as("userSummary")

    cy.intercept("/api/user/preference/disclaimer", {
      fixture: "userDisclaimerAccepted",
    }).as("userDisclaimerAccepted")

    cy.intercept("/api/portfolio/opportunity?id=*", {
      fixture: "detailedOpportunity",
    }).as("detailedOpportunity")

    cy.intercept("/api/user/kyc/status", {
      fixture: "kycNotStarted",
    }).as("kycStatus")
  })

  context("desktop", () => {
    let opportunityTitle: string

    it("should navigate to detailed opportunity screen", () => {
      cy.visit("/opportunities")

      cy.wait(["@portfolioOpportunities"])

      cy.findAllByLabelText("opportunityCard")
        .eq(0)
        .findByRole("link", {
          name: opportunitiesKeys.index.button.viewDetails,
        })
        .click()

      cy.wait("@detailedOpportunity")

      cy.location("pathname").should("match", /opportunities\/*/)
    })

    it("should view details of the opportunity", () => {
      cy.findByAltText("Hero Image").should("be.visible")
      cy.findByLabelText("opportunityTitle")
        .should("be.visible")
        .then((title) => {
          opportunityTitle = title.text()
        })
      cy.findByLabelText("opportunityDescription").should("be.visible")
      cy.findByLabelText("opportunityIsShariahCompliant").should("be.visible")
      cy.findByRole("button", {
        name: opportunitiesKeys.index.button.playVideo,
      }).should("be.visible")
      cy.findByRole("button", {
        name: opportunitiesKeys.index.button.scheduleMeeting,
      }).should("be.visible")

      cy.findAllByLabelText("breakdown").should(
        "contain.text",
        opportunitiesKeys.index.card.labels.assetManager,
      )
      cy.findAllByLabelText("breakdown").should(
        "contain.text",
        opportunitiesKeys.index.card.labels.assetClass,
      )
      cy.findAllByLabelText("breakdown").should(
        "contain.text",
        opportunitiesKeys.index.card.labels.sector,
      )
      cy.findAllByLabelText("breakdown").should(
        "contain.text",
        opportunitiesKeys.index.card.labels.expectedExit,
      )
      cy.findAllByLabelText("breakdown").should(
        "contain.text",
        opportunitiesKeys.index.card.labels.expectedReturn,
      )
      cy.findAllByLabelText("breakdown").should(
        "contain.text",
        opportunitiesKeys.index.card.labels.country,
      )
    })

    it("should show similar 3 opportunities", () => {
      cy.findAllByLabelText("opportunityCard")
        .should("have.length.at.most", 3)
        .each((card) => {
          cy.wrap(card)
            .findByLabelText("title")
            .should("not.have.text", opportunityTitle)
        })
    })

    it("should open a popup with the scheduler form when RM is not assigned", () => {
      cy.findByRole("button", {
        name: opportunitiesKeys.index.button.scheduleMeeting,
      }).click()

      cy.location("pathname").should("match", /schedule-meeting/)
    })

    it("should autofill non-editable call reason", () => {
      cy.findByLabelText("callReason").find("div[data-disabled='true']")
      cy.findByLabelText("callReason").should(
        "contain.text",
        scheduleMeetingKeys.callReason.options.opportunity,
      )

      cy.findByLabelText("callDetailsSummary")
        .findByLabelText("reason")
        .should(
          "contain.text",
          scheduleMeetingKeys.callReason.options.opportunity,
        )
    })

    // need code updated from Nirmal to intercept the api
    it.skip("should attach a deal", () => {})

    it("should autofill details in the scheduler form when RM is assigned", () => {
      cy.intercept("/api/user/relationship-manager", {
        fixture: "RMAssigned",
      }).as("relationshipManager")
      cy.reload()

      cy.wait("@relationshipManager")

      cy.findByLabelText("callReason").find("div[data-disabled='true']")

      cy.findByLabelText("callReason").should(
        "contain.text",
        scheduleMeetingKeys.callReason.options.opportunity,
      )

      cy.findByLabelText("callDetailsSummary")
        .findByLabelText("reason")
        .should(
          "contain.text",
          scheduleMeetingKeys.callReason.options.opportunity,
        )

      cy.fixture("RMAssigned").then((json) => {
        let rmAssigned = json.manager.firstName + " " + json.manager.lastName

        cy.findByLabelText("rmName").should("contain.text", rmAssigned)
      })
    })

    it("should able to close meeting pop up", () => {
      cy.findByRole("button", { name: "Close schedule meeting modal" }).click()

      cy.wait("@detailedOpportunity")
    })

    it("should navigate back to opportunities screen", () => {
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.location("pathname").should("equal", "/opportunities")
    })
  })

  context(
    "mobile",
    {
      viewportHeight: 812,
      viewportWidth: 375,
    },
    () => {
      let opportunityTitle: string

      it("should navigate to detailed opportunity screen", () => {
        cy.visit("/opportunities")

        cy.wait(["@portfolioOpportunities"])

        cy.findAllByLabelText("opportunityCard")
          .eq(0)
          .findByRole("link", {
            name: opportunitiesKeys.index.button.viewDetails,
          })
          .click()

        cy.wait("@detailedOpportunity")

        cy.location("pathname").should("match", /opportunities\/*/)
      })

      it("should view details of the opportunity", () => {
        cy.findByAltText("Hero Image").should("be.visible")
        cy.findByLabelText("opportunityTitle")
          .should("be.visible")
          .then((title) => {
            opportunityTitle = title.text()
          })
        cy.findByLabelText("opportunityDescription").should("be.visible")
        cy.findByLabelText("opportunityIsShariahCompliant").should("be.visible")
        cy.findByRole("button", {
          name: opportunitiesKeys.index.button.playVideo,
        }).should("be.visible")
        cy.findByRole("button", {
          name: opportunitiesKeys.index.button.scheduleMeeting,
        }).should("be.visible")

        cy.findAllByLabelText("breakdown").should(
          "contain.text",
          opportunitiesKeys.index.card.labels.assetManager,
        )
        cy.findAllByLabelText("breakdown").should(
          "contain.text",
          opportunitiesKeys.index.card.labels.assetClass,
        )
        cy.findAllByLabelText("breakdown").should(
          "contain.text",
          opportunitiesKeys.index.card.labels.sector,
        )
        cy.findAllByLabelText("breakdown").should(
          "contain.text",
          opportunitiesKeys.index.card.labels.expectedExit,
        )
        cy.findAllByLabelText("breakdown").should(
          "contain.text",
          opportunitiesKeys.index.card.labels.expectedReturn,
        )
        cy.findAllByLabelText("breakdown").should(
          "contain.text",
          opportunitiesKeys.index.card.labels.country,
        )
      })

      it("should show similar 3 opportunities", () => {
        cy.findAllByLabelText("opportunityCard")
          .should("have.length.at.most", 3)
          .each((card) => {
            cy.wrap(card)
              .findByLabelText("title")
              .should("not.have.text", opportunityTitle)
          })
      })

      it("should open a popup with the scheduler form when RM is not assigned", () => {
        cy.findByRole("button", {
          name: opportunitiesKeys.index.button.scheduleMeeting,
        }).click()

        cy.location("pathname").should("match", /schedule-meeting/)
      })

      it("should autofill non-editable call reason", () => {
        cy.findByLabelText("callReason").find("div[data-disabled='true']")
        cy.findByLabelText("callReason").should(
          "contain.text",
          scheduleMeetingKeys.callReason.options.opportunity,
        )

        cy.findByLabelText("callDetailsSummary")
          .findByLabelText("reason")
          .should(
            "contain.text",
            scheduleMeetingKeys.callReason.options.opportunity,
          )
      })

      // need code updated from Nirmal to intercept the api
      it.skip("should attach a deal", () => {})

      it("should autofill details in the scheduler form when RM is assigned", () => {
        cy.intercept("/api/user/relationship-manager", {
          fixture: "RMAssigned",
        }).as("relationshipManager")
        cy.reload()

        cy.wait("@relationshipManager")

        cy.findByLabelText("callReason").find("div[data-disabled='true']")

        cy.findByLabelText("callReason").should(
          "contain.text",
          scheduleMeetingKeys.callReason.options.opportunity,
        )

        cy.findByLabelText("callDetailsSummary")
          .findByLabelText("reason")
          .should(
            "contain.text",
            scheduleMeetingKeys.callReason.options.opportunity,
          )

        cy.fixture("RMAssigned").then((json) => {
          let rmAssigned = json.manager.firstName + " " + json.manager.lastName

          cy.findByLabelText("rmName").should("contain.text", rmAssigned)
        })
      })

      it("should able to close meeting pop up", () => {
        cy.findByRole("button", {
          name: "Close schedule meeting modal",
        }).click()

        cy.wait("@detailedOpportunity")
      })

      it("should navigate back to opportunities screen", () => {
        cy.findByRole("button", { name: commonKeys.button.back }).click()
        cy.location("pathname").should("equal", "/opportunities")
      })
    },
  )
})
