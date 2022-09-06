describe("Proposal - Chapter selection", () => {
  let simulatorKeys
  let proposalKeys
  let commonKeys

  before(() => {
    cy.loginBE()

    cy.fixture("../../public/locales/en/simulator").then((keys) => {
      simulatorKeys = keys
    })

    cy.fixture("../../public/locales/en/proposal").then((keys) => {
      proposalKeys = keys
    })

    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })
  })

  beforeEach(() => {
    cy.intercept("/api/user/status", {
      fixture: "userStatusNotQualified",
    }).as("userQualificationStatus")

    cy.intercept("/api/user", { fixture: "user" }).as("user")

    cy.intercept("/api/user/qualifications/status", {
      fixture: "proposalJourneyNotStarted",
    }).as("userStatus")

    cy.intercept("/api/portfolio/simulator", {
      fixture: "portfolioSimulator",
    }).as("simulator")

    cy.intercept("/api/user/investment-goals", {
      fixture: "investmentGoalQuizNotStarted",
    }).as("investmentGoalResponse")

    cy.intercept("/api/user/kyc/status", {
      fixture: "kycNotStarted",
    }).as("kycStatus")

    cy.intercept("/api/user/preference", {
      fixture: "userPreferenceENDefault",
    }).as("languagePreference")

    cy.intercept("/api/user/summary", {
      fixture: "userSummary",
    }).as("userSummary")

    cy.intercept("/api/user/preference/disclaimer", {
      fixture: "userDisclaimerAccepted",
    }).as("userDisclaimerAccepted")

    cy.intercept("/api/user/risk-assessment", {
      fixture: "riskAssessmentQuizNotStarted",
    }).as("riskAssessmentResponse")
  })

  context("desktop", () => {
    it("should navigate to proposal chapter selection screen", () => {
      cy.visit("/portfolio/simulator")
      cy.findByText(simulatorKeys.footer.button.startInvesting)
        .scrollIntoView()
        .click()
      cy.location("pathname").should("equal", "/proposal")
    })

    it("should list all steps for personalised proposal", () => {
      cy.findByText(proposalKeys.chapterSelection.chapterOne.title).should(
        "be.visible",
      )
      cy.findByText(proposalKeys.chapterSelection.chapterTwo.title).should(
        "be.visible",
      )
      cy.findByText(proposalKeys.chapterSelection.chapterThree.title).should(
        "be.visible",
      )
    })

    it("should display exit button when user has not started journey", () => {
      cy.findByRole("link", { name: commonKeys.button.exit }).should(
        "be.visible",
      )
    })

    it("should be redirected to dashboard on clicking exit button from proposal screen", () => {
      cy.intercept("/api/portfolio/opportunities", {
        fixture: "userOpportunityStatusUnverified",
      }).as("portfolioOpportunities")
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

      cy.findByRole("link", { name: commonKeys.button.exit }).click()
      cy.location("pathname").should("equal", "/")
    })

    it("should display Get Started CTA for Complete your investor profile when flow has not been started", () => {
      cy.visit("/proposal")

      cy.findByText(proposalKeys.chapterSelection.chapterOne.title)
        .parent()
        .findByText(proposalKeys.chapterSelection.button.getStarted)
        .should("be.visible")
      cy.findByText(proposalKeys.chapterSelection.chapterTwo.title)
        .parent()
        .findByText(commonKeys.button.continue)
        .should("not.exist")
      cy.findByText(proposalKeys.chapterSelection.chapterThree.title)
        .parent()
        .findByText(commonKeys.button.continue)
        .should("not.exist")
    })

    it("should display being verified status when investor profile is completed and scores less than 70%", () => {
      cy.intercept("/api/user/qualifications/status", {
        fixture: "proposalInvestmentGoalsNotStarted",
      }).as("userStatus")

      cy.intercept("/api/user/status", {
        fixture: "userStatusPendingVerification",
      }).as("userQualificationStatus")

      cy.reload()

      cy.wait(["@userStatus", "@userQualificationStatus"])
      cy.findByText(
        proposalKeys.chapterSelection.chapterOne.description.completed,
      ).should("be.visible")
    })

    it("should display verified status when investor profile is completed and scores greater than or equal to 70%", () => {
      cy.intercept("/api/user/qualifications/status", {
        fixture: "proposalInvestmentGoalsNotStarted",
      }).as("userStatus")

      cy.intercept("/api/user/status", { fixture: "userStatusQualified" }).as(
        "userQualificationStatus",
      )

      cy.reload()

      cy.wait(["@userStatus", "@userQualificationStatus"])
      cy.findByText(
        proposalKeys.chapterSelection.chapterOne.description.verified,
      ).should("be.visible")
    })

    it("should display Get Started CTA for Define investment goals when user has completed investment profile", () => {
      cy.findByText(proposalKeys.chapterSelection.chapterOne.title)
        .parent()
        .findByText(proposalKeys.chapterSelection.button.getStarted)
        .should("not.exist")
      cy.findByText(proposalKeys.chapterSelection.chapterTwo.title)
        .parent()
        .findByText(commonKeys.button.continue)
        .should("be.visible")
      cy.findByText(proposalKeys.chapterSelection.chapterThree.title)
        .parent()
        .findByText(commonKeys.button.continue)
        .should("not.exist")
    })

    it("should display save & exit button when user has completed investment profile", () => {
      cy.findByRole("link", { name: commonKeys.button.saveAndExit }).should(
        "be.visible",
      )
    })

    it("should be redirected to dashboard on clicking Save & exit button from proposal screen", () => {
      cy.intercept("/api/portfolio/opportunities", {
        fixture: "userOpportunityStatusUnverified",
      }).as("portfolioOpportunities")
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

      cy.findByRole("link", { name: commonKeys.button.saveAndExit }).click()
      cy.location("pathname").should("equal", "/")
    })

    it("should display Get Started CTA for Complete risk assessment when user has completed investment goals", () => {
      cy.intercept("/api/user/qualifications/status", {
        fixture: "proposalRiskAssessmentNotStarted",
      }).as("userStatus")

      cy.intercept("/api/user/status", {
        fixture: "userStatusQualified",
      }).as("userQualificationStatus")

      cy.visit("/proposal")
      cy.wait("@userStatus")
      cy.findByText(proposalKeys.chapterSelection.chapterOne.title)
        .parent()
        .findByText(proposalKeys.chapterSelection.button.getStarted)
        .should("not.exist")
      cy.findByText(proposalKeys.chapterSelection.chapterTwo.title)
        .parent()
        .findByText(commonKeys.button.continue)
        .should("not.exist")
      cy.findByText(proposalKeys.chapterSelection.chapterThree.title)
        .parent()
        .findByText(commonKeys.button.continue)
        .should("be.visible")
    })

    it("should display save & exit button when user has completed investment goals", () => {
      cy.findByRole("link", { name: commonKeys.button.saveAndExit }).should(
        "be.visible",
      )
    })

    it("should be redirected to dashboard on clicking Save & exit button from proposal screen", () => {
      cy.intercept("/api/portfolio/opportunities", {
        fixture: "userOpportunityStatusUnverified",
      }).as("portfolioOpportunities")
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

      cy.findByRole("link", { name: commonKeys.button.saveAndExit }).click()
      cy.location("pathname").should("equal", "/")
    })
  })

  context(
    "mobile",
    {
      viewportHeight: 812,
      viewportWidth: 375,
    },
    () => {
      it("should navigate to proposal chapter selection screen", () => {
        cy.visit("/portfolio/simulator")
        cy.findByRole("button", { name: commonKeys.button.close }).click()
        cy.findByText(simulatorKeys.footer.button.startInvesting)
          .scrollIntoView()
          .click()
        cy.location("pathname").should("equal", "/proposal")
      })

      it("should list all steps for personalised proposal", () => {
        cy.findByText(proposalKeys.chapterSelection.chapterOne.title).should(
          "be.visible",
        )
        cy.findByText(proposalKeys.chapterSelection.chapterTwo.title).should(
          "be.visible",
        )
        cy.findByText(proposalKeys.chapterSelection.chapterThree.title).should(
          "be.visible",
        )
      })

      it("should display exit button when user has not started journey", () => {
        cy.findByRole("link", { name: commonKeys.button.exit }).should(
          "be.visible",
        )
      })

      it("should be redirected to dashboard on clicking exit button from proposal screen", () => {
        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusUnverified",
        }).as("portfolioOpportunities")
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

        cy.findByRole("link", { name: commonKeys.button.exit }).click()
        cy.location("pathname").should("equal", "/")
      })

      it("should display Get Started CTA for Complete your investor profile when flow has not been started", () => {
        cy.visit("/proposal")
        cy.findByText(proposalKeys.chapterSelection.button.getStarted).should(
          "be.visible",
        )
      })

      it("should display being verified status when investor profile is completed and scores less than 70%", () => {
        cy.intercept("/api/user/qualifications/status", {
          fixture: "proposalInvestmentGoalsNotStarted",
        }).as("userStatus")

        cy.intercept("/api/user/status", {
          fixture: "userStatusPendingVerification",
        }).as("userQualificationStatus")

        cy.reload()

        cy.wait(["@userStatus", "@userQualificationStatus"])
        cy.findByText(
          proposalKeys.chapterSelection.chapterOne.description.completed,
        ).should("be.visible")
      })

      it("should display verified status when investor profile is completed and user is verified", () => {
        cy.intercept("/api/user/qualifications/status", {
          fixture: "proposalInvestmentGoalsNotStarted",
        }).as("userStatus")

        cy.intercept("/api/user/status", { fixture: "userStatusQualified" }).as(
          "userQualificationStatus",
        )

        cy.reload()

        cy.wait(["@userStatus", "@userQualificationStatus"])
        cy.findByText(
          proposalKeys.chapterSelection.chapterOne.description.verified,
        ).should("be.visible")
      })

      it("should display Get Started CTA for Define investment goals when user has completed investment profile", () => {
        cy.findByText(proposalKeys.chapterSelection.button.getStarted).should(
          "not.exist",
        )

        cy.findByText(proposalKeys.chapterSelection.chapterOne.title)
          .parent()
          .parent()
          .siblings("div")
          .eq(0)
          .findByLabelText("Check Icon")
          .should("be.visible")
        cy.findByText(commonKeys.button.continue).should("be.visible")
      })

      it("should display save & exit button when user has completed investment profile", () => {
        cy.findByRole("link", { name: commonKeys.button.saveAndExit }).should(
          "be.visible",
        )
      })

      it("should be redirected to dashboard on clicking Save & exit button from proposal screen", () => {
        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusUnverified",
        }).as("portfolioOpportunities")
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
        cy.findByRole("link", { name: commonKeys.button.saveAndExit }).click()
        cy.location("pathname").should("equal", "/")
      })

      it("should display Get Started CTA for Complete risk assessment when user has completed investment goals", () => {
        cy.intercept("/api/user/qualifications/status", {
          fixture: "proposalRiskAssessmentNotStarted",
        }).as("userStatus")

        cy.visit("/proposal")

        cy.wait("@userStatus")
        cy.findByText(proposalKeys.chapterSelection.button.getStarted).should(
          "not.exist",
        )

        cy.findByText(proposalKeys.chapterSelection.chapterOne.title)
          .parent()
          .parent()
          .siblings("div")
          .eq(0)
          .findByLabelText("Check Icon")
          .should("be.visible")

        cy.findByText(proposalKeys.chapterSelection.chapterTwo.title)
          .parent()
          .parent()
          .siblings("div")
          .eq(0)
          .findByLabelText("Check Icon")
          .should("be.visible")

        cy.findByText(commonKeys.button.continue).should("be.visible")
      })

      it("should display save & exit button when user has completed investment goals", () => {
        cy.findByRole("link", { name: commonKeys.button.saveAndExit }).should(
          "be.visible",
        )
      })

      it("should be redirected to dashboard on clicking Save & exit button from proposal screen", () => {
        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusUnverified",
        }).as("portfolioOpportunities")
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

        cy.findByRole("link", { name: commonKeys.button.saveAndExit }).click()
        cy.location("pathname").should("equal", "/")
      })
    },
  )
})
