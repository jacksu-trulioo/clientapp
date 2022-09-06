let proposalKeys
let commonKeys

describe("Risk Assessment - risk questionnaire to build a personalised proposal", () => {
  before(() => {
    cy.loginBE()
    cy.fixture("../../public/locales/en/proposal").then((keys) => {
      proposalKeys = keys
    })

    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })
  })

  beforeEach(() => {
    cy.intercept("/api/user/relationship-manager", {
      fixture: "RMNotAssigned",
    }).as("relationshipManager")

    cy.intercept("/api/user/status", {
      fixture: "userStatusNotQualified",
    }).as("userStatus")

    cy.intercept("/api/user", { fixture: "user" }).as("user")

    cy.intercept("/api/user/preference", {
      fixture: "userPreferenceENDefault",
    }).as("languagePreference")

    cy.intercept("/api/user/summary", {
      fixture: "userSummary",
    }).as("userSummary")

    cy.intercept("/api/user/kyc/status", {
      fixture: "kycNotStarted",
    }).as("kycStatus")

    cy.intercept("/api/user/investment-goals", {
      fixture: "investmentGoalCompletedResponse",
    }).as("investmentGoalResponse")

    cy.intercept("/api/user/preference/disclaimer", {
      fixture: "userDisclaimerAccepted",
    }).as("userDisclaimerAccepted")

    cy.intercept("/api/user/proposals/status", {
      fixture: "proposalsStatusNotStarted",
    }).as("proposalsStatus")

    cy.intercept("/api/user/qualifications/status", {
      fixture: "proposalRiskAssessmentNotStarted",
    }).as("userStatus")

    cy.intercept("/api/user/risk-assessment", {
      fixture: "riskAssessmentQuizNotStarted",
    }).as("riskAssessmentResponse")
  })

  context("desktop", () => {
    it("should be able to start risk assessment section", () => {
      cy.visit("/proposal")
      cy.wait("@userStatus")
      cy.findByText(commonKeys.button.continue).click()
      cy.location("pathname").should("equal", "/proposal/risk-assessment")
      cy.wait("@riskAssessmentResponse")
    })

    it("should show progress in progressbar", () => {
      cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "10")
    })

    it("should show step name in header", () => {
      cy.get("header").findByText(
        proposalKeys.chapterSelection.chapterThree.stepper.title,
      )
      cy.get("header").findByText("3")
    })

    it("should not navigate to next statement without answering current statement", () => {
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByText(proposalKeys.riskAssessment.question[1].description)
      cy.findByText(commonKeys.errors.required).should("be.visible")
    })

    it("should be able to invoke Save & Exit from Q1", () => {
      cy.findByRole("button", { name: commonKeys.button.saveAndExit }).click()
      cy.findByRole("dialog")
        .children("header")
        .should("have.text", commonKeys.modal.saveAndExit.title)
    })

    it("should be able to cancel Save & Exit from Q1", () => {
      cy.findByRole("button", { name: commonKeys.button.cancel }).click()
      cy.findByText(proposalKeys.riskAssessment.question[1].description).should(
        "be.visible",
      )
    })

    it("should be able to Save & Exit from Q1", () => {
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

      cy.findByRole("button", { name: commonKeys.button.saveAndExit }).click()
      cy.findByRole("link", { name: commonKeys.button.saveAndExit }).click()
      cy.location("pathname").should("equal", "/")
    })

    it("should display question 1 to the user", () => {
      cy.intercept("/api/user/qualifications/status", {
        fixture: "proposalRiskAssessmentNotStarted",
      }).as("userStatus")

      cy.visit("/proposal")
      cy.wait("@userStatus")
      cy.intercept("/api/user/risk-assessment", {
        fixture: "riskAssessmentQuizNotStarted",
      }).as("riskAssessmentResponse")
      cy.findByText(commonKeys.button.continue).click()
      cy.wait("@riskAssessmentResponse")
      cy.findByText(proposalKeys.riskAssessment.question[1].description)
    })

    it("should be able to choose options for Q1", () => {
      this.selectedOption = Math.ceil(Math.random() * 3)
      cy.findByRole("radiogroup").find("label").eq(this.selectedOption).click()
    })

    it("should be able to navigate to Q2", () => {
      cy.intercept("/api/user/risk-assessment", {
        body: {
          q1: this.selectedOption + 1,
          q2: null,
        },
      })

      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByText(proposalKeys.riskAssessment.question[2].description)
    })

    it("should show increased progress in progressbar", () => {
      cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "20")
    })

    it("should be able to navigate back to Q1 from Q2", () => {
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.findByText(proposalKeys.riskAssessment.question[1].description)
    })

    it("should show decreased progress in progressbar", () => {
      cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "10")
    })

    it("should be able to navigate again to Q2", () => {
      cy.intercept("/api/user/risk-assessment", {
        body: {
          q1: this.selectedOption + 1,
          q2: null,
        },
      })

      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByText(proposalKeys.riskAssessment.question[2].description)
    })

    it("should show increased progress in progressbar", () => {
      cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "20")
    })

    it("should be able to choose options for Q2", () => {
      this.selectedOption = Math.ceil(Math.random() * 4)
      cy.findByRole("radiogroup").find("label").eq(this.selectedOption).click()
    })

    it("should be able to navigate to Q3", () => {
      cy.intercept("/api/user/risk-assessment", {
        body: {
          q2: this.selectedOption + 1,
          q3: null,
        },
      })

      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByText(proposalKeys.riskAssessment.question[3].description)
    })

    it("should show progress in progressbar", () => {
      cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "30")
    })

    it("should be able to choose options for Q3", () => {
      this.selectedOption = Math.ceil(Math.random() * 4)
      cy.findByRole("radiogroup").find("label").eq(this.selectedOption).click()
    })

    it("should be able to navigate to Q4", () => {
      cy.intercept("/api/user/risk-assessment", {
        body: {
          q3: this.selectedOption + 1,
          q4: null,
        },
      })
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByText(proposalKeys.riskAssessment.question[4].description)
    })

    it("should show progress in progressbar", () => {
      cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "40")
    })

    it("should be able to choose options for Q4", () => {
      this.selectedOption = Math.ceil(Math.random() * 4)
      cy.findByRole("radiogroup").find("label").eq(this.selectedOption).click()
    })

    it("should be able to navigate to Q5", () => {
      cy.intercept("/api/user/risk-assessment", {
        body: {
          q4: this.selectedOption + 1,
          q5: null,
        },
      })
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByText(proposalKeys.riskAssessment.question[5].description)
    })

    it("should show progress in progressbar", () => {
      cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "50")
    })

    it("should be able to choose options for Q5", () => {
      this.selectedOption = Math.ceil(Math.random() * 4)
      cy.findByRole("radiogroup").find("label").eq(this.selectedOption).click()
    })

    it("should be able to navigate to Q6", () => {
      cy.intercept("/api/user/risk-assessment", {
        body: {
          q5: this.selectedOption + 1,
          q4: null,
        },
      })
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByText(proposalKeys.riskAssessment.question[6].description)
    })

    it("should show progress in progressbar", () => {
      cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "60")
    })

    it("should be able to choose options for Q6", () => {
      this.selectedOption = Math.ceil(Math.random() * 4)
      cy.findByRole("radiogroup").find("label").eq(this.selectedOption).click()
    })

    it("should be able to navigate to Q7", () => {
      cy.intercept("/api/user/risk-assessment", {
        body: {
          q6: this.selectedOption + 1,
          q7: null,
        },
      })
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByText(proposalKeys.riskAssessment.question[7].description)
    })

    it("should show progress in progressbar", () => {
      cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "70")
    })

    it("should be able to choose options for Q7", () => {
      this.selectedOption = Math.ceil(Math.random() * 4)
      cy.findByRole("radiogroup").find("label").eq(this.selectedOption).click()
    })

    it("should be able to navigate to Q8", () => {
      cy.intercept("/api/user/risk-assessment", {
        body: {
          q7: this.selectedOption + 1,
          q8: null,
        },
      })
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByText(proposalKeys.riskAssessment.question[8].description)
    })

    it("should show progress in progressbar", () => {
      cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "80")
    })

    it("should be able to choose options for Q8", () => {
      this.selectedOption = Math.ceil(Math.random() * 4)
      cy.findByRole("radiogroup").find("label").eq(this.selectedOption).click()
    })

    it("should be able to navigate to Q9", () => {
      cy.intercept("/api/user/risk-assessment", {
        body: {
          q8: this.selectedOption + 1,
          q9: null,
        },
      })
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByText(proposalKeys.riskAssessment.question[9].description)
    })

    it("should show progress in progressbar", () => {
      cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "90")
    })

    it("should be able to choose options for Q9", () => {
      this.selectedOption = Math.ceil(Math.random() * 4)
      cy.findByRole("radiogroup").find("label").eq(this.selectedOption).click()
    })

    it("should be able to complete risk assessment", () => {
      cy.intercept("/api/user/risk-assessment", {
        body: {
          q9: this.selectedOption + 1,
        },
      })

      cy.intercept("/api/user/risk-assessment/result", {
        fixture: "riskAssessmentResult",
      }).as("riskAssessementResult")

      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.location("pathname").should(
        "equal",
        "/proposal/risk-assessment/result",
      )
      cy.wait("@riskAssessementResult").then((interception) => {
        let json = JSON.parse(JSON.stringify(interception.response.body))
        this.riskScale = json.data.scoreDescription
      })
    })

    it("should display risk profile category", () => {
      let riskCategoryHeading: string =
        proposalKeys.riskAssessment.result.heading
      riskCategoryHeading = riskCategoryHeading.replace(
        "{{riskDescription}}",
        this.riskScale,
      )
      cy.findByRole("heading", { level: 2 }).should(
        "contain.text",
        riskCategoryHeading,
      )
    })

    it("should confirm profile and continue when user status is not Qualified", () => {
      cy.intercept("/api/user/risk-assessment", {
        fixture: "riskAssessmentResult",
      }).as("riskAssessmentCompleted")

      cy.findByText(
        proposalKeys.riskAssessment.result.button.confirmProfile,
      ).click()
      cy.wait("@riskAssessmentCompleted")
      cy.location("pathname").should(
        "equal",
        "/proposal/risk-assessment/completed",
      )
    })

    it("should display email where confirmation will be send", () => {
      cy.findByText(Cypress.env("auth0Username")).should("be.visible")
    })

    it("should redirected to dashboard from result screen", () => {
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
      cy.findByText(
        proposalKeys.riskAssessment.completed.button.backToDashboard,
      ).click()
      cy.location("pathname").should("equal", "/")
    })

    it("should be navigate to proposal screen when user status is Qualified", () => {
      cy.intercept("/api/user/risk-assessment", {
        fixture: "riskAssessmentResult",
      }).as("riskAssessmentCompleted")

      cy.intercept("/api/user/risk-assessment/retake/result", {
        fixture: "retakeRiskAssessmentResult",
      }).as("retakeRiskAssessmentResult")

      cy.intercept("/api/user/status", {
        fixture: "userStatusQualified",
      }).as("userStatus")

      cy.intercept("/api/user/summary", {
        fixture: "userSummary",
      }).as("userSummary")

      cy.intercept("/api/user/proposals", { fixture: "userProposals" }).as(
        "userProposal",
      )

      cy.intercept("/api/portfolio/opportunities", {
        fixture: "userOpportunityStatusVerified",
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
        fixture: "proposalJourneyCompleted",
      }).as("userStatus")

      cy.intercept("/api/portfolio/proposal/deals?id=Capital*Growth", {
        fixture: "proposalCapitalDeals",
      }).as("proposalCapitalDeals")

      cy.intercept("/api/user/risk-assessment/result", {
        fixture: "riskAssessmentResult",
      }).as("riskAssessementResult")

      cy.visit("/proposal/risk-assessment/result")

      cy.findByText(
        proposalKeys.riskAssessment.result.button.confirmAndView,
      ).click()
      cy.wait(["@riskAssessmentCompleted", "@userProposal"])

      cy.location("pathname").should("equal", "/personalized-proposal")
    })
  })

  context(
    "mobile",
    {
      viewportHeight: 812,
      viewportWidth: 375,
    },
    () => {
      it("should be able to start risk assessment section", () => {
        cy.visit("/proposal")

        cy.wait("@userStatus")
        cy.get("footer")
          .findByRole("button", { name: commonKeys.button.continue })
          .click()
        cy.location("pathname").should("equal", "/proposal/risk-assessment")
        cy.wait("@riskAssessmentResponse")
      })

      it("should show progress in progressbar", () => {
        cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "10")
      })

      it("should show step name in header", () => {
        cy.get("header").findByText(
          proposalKeys.chapterSelection.chapterThree.stepper.title,
        )
        cy.get("header").findByText("3")
      })

      it("should not navigate to next statement without answering current statement", () => {
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findByText(proposalKeys.riskAssessment.question[1].description)
        cy.findByText(commonKeys.errors.required)
          .scrollIntoView()
          .should("be.visible")
      })

      it("should be able to invoke Save & Exit from Q1", () => {
        cy.findByRole("button", { name: commonKeys.button.saveAndExit }).click()
        cy.findByRole("dialog")
          .children("header")
          .should("have.text", commonKeys.modal.saveAndExit.title)
      })

      it("should be able to cancel Save & Exit from Q1", () => {
        cy.findByRole("button", { name: commonKeys.button.cancel }).click()
        cy.findByText(
          proposalKeys.riskAssessment.question[1].description,
        ).should("be.visible")
      })

      it("should be able to Save & Exit from Q1", () => {
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
        cy.findByRole("button", { name: commonKeys.button.saveAndExit }).click()
        cy.findByRole("link", { name: commonKeys.button.saveAndExit }).click()
        cy.location("pathname").should("equal", "/")
      })

      it("should display question 1 to the user", () => {
        cy.intercept("/api/user/qualifications/status", {
          fixture: "proposalRiskAssessmentNotStarted",
        }).as("userStatus")

        cy.visit("/proposal")

        cy.wait("@userStatus")
        // required to handle element detached from DOM
        cy.findAllByLabelText("Check Icon").should("have.length", 2)

        cy.intercept("/api/user/risk-assessment", {
          fixture: "riskAssessmentQuizNotStarted",
        }).as("riskAssessmentResponse")

        cy.get("footer")
          .findByRole("button", { name: commonKeys.button.continue })
          .click()
        cy.wait("@riskAssessmentResponse")
        cy.findByText(proposalKeys.riskAssessment.question[1].description)
      })

      it("should be able to choose options for Q1", () => {
        this.selectedOption = Math.ceil(Math.random() * 3)
        cy.findByRole("radiogroup")
          .find("label")
          .eq(this.selectedOption)
          .click()
      })

      it("should be able to navigate to Q2", () => {
        cy.intercept("/api/user/risk-assessment", {
          body: {
            q1: this.selectedOption + 1,
            q2: null,
          },
        })

        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findByText(proposalKeys.riskAssessment.question[2].description)
      })

      it("should show increased progress in progressbar", () => {
        cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "20")
      })

      it("should be able to navigate back to Q1 from Q2", () => {
        cy.findByRole("button", { name: commonKeys.button.back }).click()
        cy.findByText(proposalKeys.riskAssessment.question[1].description)
      })

      it("should show decreased progress in progressbar", () => {
        cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "10")
      })

      it("should be able to navigate again to Q2", () => {
        cy.intercept("/api/user/risk-assessment", {
          body: {
            q1: this.selectedOption + 1,
            q2: null,
          },
        })

        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findByText(proposalKeys.riskAssessment.question[2].description)
      })

      it("should show increased progress in progressbar", () => {
        cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "20")
      })

      it("should be able to choose options for Q2", () => {
        this.selectedOption = Math.ceil(Math.random() * 4)
        cy.findByRole("radiogroup")
          .find("label")
          .eq(this.selectedOption)
          .click()
      })

      it("should be able to navigate to Q3", () => {
        cy.intercept("/api/user/risk-assessment", {
          body: {
            q2: this.selectedOption + 1,
            q3: null,
          },
        })

        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findByText(proposalKeys.riskAssessment.question[3].description)
      })

      it("should show progress in progressbar", () => {
        cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "30")
      })

      it("should be able to choose options for Q3", () => {
        this.selectedOption = Math.ceil(Math.random() * 4)
        cy.findByRole("radiogroup")
          .find("label")
          .eq(this.selectedOption)
          .click()
      })

      it("should be able to navigate to Q4", () => {
        cy.intercept("/api/user/risk-assessment", {
          body: {
            q3: this.selectedOption + 1,
            q4: null,
          },
        })
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findByText(proposalKeys.riskAssessment.question[4].description)
      })

      it("should show progress in progressbar", () => {
        cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "40")
      })

      it("should be able to choose options for Q4", () => {
        this.selectedOption = Math.ceil(Math.random() * 4)
        cy.findByRole("radiogroup")
          .find("label")
          .eq(this.selectedOption)
          .click()
      })

      it("should be able to navigate to Q5", () => {
        cy.intercept("/api/user/risk-assessment", {
          body: {
            q4: this.selectedOption + 1,
            q5: null,
          },
        })
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findByText(proposalKeys.riskAssessment.question[5].description)
      })

      it("should show progress in progressbar", () => {
        cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "50")
      })

      it("should be able to choose options for Q5", () => {
        this.selectedOption = Math.ceil(Math.random() * 4)
        cy.findByRole("radiogroup")
          .find("label")
          .eq(this.selectedOption)
          .click()
      })

      it("should be able to navigate to Q6", () => {
        cy.intercept("/api/user/risk-assessment", {
          body: {
            q5: this.selectedOption + 1,
            q4: null,
          },
        })
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findByText(proposalKeys.riskAssessment.question[6].description)
      })

      it("should show progress in progressbar", () => {
        cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "60")
      })

      it("should be able to choose options for Q6", () => {
        this.selectedOption = Math.ceil(Math.random() * 4)
        cy.findByRole("radiogroup")
          .find("label")
          .eq(this.selectedOption)
          .click()
      })

      it("should be able to navigate to Q7", () => {
        cy.intercept("/api/user/risk-assessment", {
          body: {
            q6: this.selectedOption + 1,
            q7: null,
          },
        })
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findByText(proposalKeys.riskAssessment.question[7].description)
      })

      it("should show progress in progressbar", () => {
        cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "70")
      })

      it("should be able to choose options for Q7", () => {
        this.selectedOption = Math.ceil(Math.random() * 4)
        cy.findByRole("radiogroup")
          .find("label")
          .eq(this.selectedOption)
          .click()
      })

      it("should be able to navigate to Q8", () => {
        cy.intercept("/api/user/risk-assessment", {
          body: {
            q7: this.selectedOption + 1,
            q8: null,
          },
        })
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findByText(proposalKeys.riskAssessment.question[8].description)
      })

      it("should show progress in progressbar", () => {
        cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "80")
      })

      it("should be able to choose options for Q8", () => {
        this.selectedOption = Math.ceil(Math.random() * 4)
        cy.findByRole("radiogroup")
          .find("label")
          .eq(this.selectedOption)
          .click()
      })

      it("should be able to navigate to Q9", () => {
        cy.intercept("/api/user/risk-assessment", {
          body: {
            q8: this.selectedOption + 1,
            q9: null,
          },
        })
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findByText(proposalKeys.riskAssessment.question[9].description)
      })

      it("should show progress in progressbar", () => {
        cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "90")
      })

      it("should be able to choose options for Q9", () => {
        this.selectedOption = Math.ceil(Math.random() * 4)
        cy.findByRole("radiogroup")
          .find("label")
          .eq(this.selectedOption)
          .click()
      })

      it("should be able to complete risk assessment", () => {
        cy.intercept("/api/user/risk-assessment", {
          body: {
            q9: this.selectedOption + 1,
          },
        })

        cy.intercept("/api/user/risk-assessment/result", {
          fixture: "riskAssessmentResult",
        }).as("riskAssessementResult")

        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.location("pathname").should(
          "equal",
          "/proposal/risk-assessment/result",
        )
        cy.wait("@riskAssessementResult").then((interception) => {
          let json = JSON.parse(JSON.stringify(interception.response.body))
          this.riskScale = json.data.scoreDescription
        })
      })

      it("should display risk profile category", () => {
        let riskCategoryHeading: string =
          proposalKeys.riskAssessment.result.heading
        riskCategoryHeading = riskCategoryHeading.replace(
          "{{riskDescription}}",
          this.riskScale,
        )
        cy.findByRole("heading", { level: 2 }).should(
          "contain.text",
          riskCategoryHeading,
        )
      })

      it("should confirm profile and continue when user status is not Qualified", () => {
        cy.intercept("/api/user/risk-assessment", {
          fixture: "riskAssessmentResult",
        }).as("riskAssessmentCompleted")

        cy.findByText(
          proposalKeys.riskAssessment.result.button.confirmProfile,
        ).click()
        cy.wait("@riskAssessmentCompleted")
        cy.location("pathname").should(
          "equal",
          "/proposal/risk-assessment/completed",
        )
      })

      it("should display email where confirmation will be send", () => {
        cy.findByText(Cypress.env("auth0Username")).should("be.visible")
      })

      it("should redirected to dashboard from result screen", () => {
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

        cy.findByText(
          proposalKeys.riskAssessment.completed.button.backToDashboard,
        ).click()
        cy.location("pathname").should("equal", "/")
      })

      it("should be navigate to proposal screen when user status is Qualified", () => {
        cy.intercept("/api/user/risk-assessment", {
          fixture: "riskAssessmentResult",
        }).as("riskAssessmentCompleted")

        cy.intercept("/api/user/risk-assessment/result", {
          fixture: "riskAssessmentResult",
        }).as("riskAssessementResult")

        cy.intercept("/api/user/risk-assessment/retake/result", {
          fixture: "retakeRiskAssessmentResult",
        }).as("retakeRiskAssessmentResult")

        cy.intercept("/api/user/summary", {
          fixture: "userSummary",
        }).as("userSummary")

        cy.intercept("/api/user/status", {
          fixture: "userStatusQualified",
        }).as("userStatus")

        cy.intercept("/api/user/proposals", { fixture: "userProposals" }).as(
          "userProposal",
        )

        cy.intercept("/api/portfolio/proposal/deals?id=Capital*Growth", {
          fixture: "proposalCapitalDeals",
        }).as("proposalCapitalDeals")

        cy.visit("/proposal/risk-assessment/result")

        cy.findByText(
          proposalKeys.riskAssessment.result.button.confirmAndView,
        ).click()
        cy.wait("@riskAssessmentCompleted")
        cy.location("pathname").should("equal", "/personalized-proposal")
      })
    },
  )
})
