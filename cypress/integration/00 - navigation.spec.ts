describe("navigation: left sidebar", () => {
  let commonKeys
  before(() => {
    cy.loginBE()

    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })
  })

  beforeEach(() => {
    cy.intercept("/api/portfolio/insights/dashboard", {
      fixture: "dashboardInsights",
    }).as("dashboardInsights")

    cy.intercept("/api/portfolio/webinars/upcomings", {
      fixture: "upcomingWebinars",
    }).as("upcomingWebinars")

    cy.intercept("/api/portfolio/insights/webinars/recent", {
      fixture: "recentWebinars",
    }).as("recentWebinars")

    cy.intercept("/api/portfolio/insights", {
      fixture: "insights",
    }).as("insights")

    cy.intercept("/api/user", {
      fixture: "user",
    }).as("user")

    cy.intercept("/api/user/qualifications/status", {
      fixture: "proposalJourneyNotStarted",
    }).as("userStatus")

    cy.intercept("/api/user/summary", {
      fixture: "userSummaryFreshUser",
    }).as("userSummary")

    cy.intercept("/api/user/proposals/status", {
      fixture: "proposalsStatusNotStarted",
    }).as("proposalsStatus")

    cy.intercept("/api/portfolio/opportunities", {
      fixture: "userOpportunityStatusUnverified",
    }).as("portfolioOpportunities")

    cy.intercept("/api/user/relationship-manager", {
      fixture: "RMNotAssigned",
    }).as("relationshipManager")

    cy.intercept("/api/user/status", {
      fixture: "userStatusNotQualified",
    }).as("userQualificationStatus")

    cy.intercept("/api/user/preference/disclaimer", {
      fixture: "userDisclaimerAccepted",
    }).as("userDisclaimerAccepted")

    cy.intercept("/api/user/investment-goals", {
      fixture: "investmentGoalQuizNotStarted",
    }).as("investmentGoalResponse")

    cy.intercept("/api/user/kyc/status", {
      fixture: "kycNotStarted",
    }).as("kycStatus")

    cy.intercept("/api/portfolio/simulator", {
      fixture: "portfolioSimulator",
    }).as("simulator")

    cy.intercept("/api/user/preference", {
      fixture: "userPreferenceENDefault",
    }).as("languagePreference")

    cy.intercept("/api/portfolio/proposal/deal-info?id=*", {
      fixture: "proposalDealInfoId",
    }).as("proposalDeals")
  })

  context("desktop", () => {
    it("should have collapsible sidebar for navigation", () => {
      cy.visit("/")

      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
        "@upcomingWebinars",
        "@recentWebinars",
        "@userSummary",
        "@investmentGoalResponse",
      ])
      cy.findByLabelText("leftNavigation").within(() => {
        cy.findByText(commonKeys.nav.links.dashboard).should("be.visible")
        cy.findByRole("button", {
          name: /Close Sidebar/i,
        }).click()
        cy.findByRole("button", { name: /Open Sidebar/i }).click()
        cy.findByRole("button", { name: /Open Sidebar/i }).should("not.exist")
      })
    })

    it("should navigate to opportunities screen", () => {
      cy.findByLabelText("leftNavigation")
        .findAllByRole("list")
        .within(() => {
          cy.findByText(commonKeys.nav.links.opportunities).click()
        })

      cy.location("pathname").should("equal", "/opportunities")
    })

    it("should navigate to dashboard from opportunities screen", () => {
      cy.findByLabelText("leftNavigation")
        .findAllByRole("list")
        .within(() => {
          cy.findByText(commonKeys.nav.links.dashboard).click()
        })

      cy.location("pathname").should("equal", "/")
    })

    it("should navigate to insights screen", () => {
      cy.findByLabelText("leftNavigation")
        .findAllByRole("list")
        .within(() => {
          cy.findByText(commonKeys.nav.links.insights).click()
        })

      cy.location("pathname").should("equal", "/insights")
    })

    it("should list Portfolio simulator link in the left navigation bar when user has not started pre-proposal journey", () => {
      cy.findByLabelText("leftNavigation").within(() => {
        cy.findByRole("link", {
          name: commonKeys.nav.links.portfolioSimulator,
        }).click()
      })

      cy.location("pathname").should("equal", "/portfolio/simulator")
    })

    it("should navigate user back to dashboard when user clicks on company logo on simulator modal", () => {
      cy.intercept("/api/user", {
        fixture: "userPreProposalFromOpportunities",
      }).as("user")

      cy.findByLabelText("logo").click()

      cy.location("pathname").should("equal", "/")
    })

    it("should list Portfolio simulator link in the left navigation bar when user has started unlock opportunities flow", () => {
      cy.findByLabelText("leftNavigation").within(() => {
        cy.findByRole("link", {
          name: commonKeys.nav.links.portfolioSimulator,
        }).click()
      })

      cy.location("pathname").should("equal", "/portfolio/simulator")
    })

    it("should navigate user to pre-proposal journey if it is not completed using personalized proposal CTA", () => {
      cy.visit("/")

      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
        "@upcomingWebinars",
        "@recentWebinars",
      ])

      cy.findByLabelText("leftNavigation").within(() => {
        cy.findByRole("link", {
          name: commonKeys.nav.links.personalizedProposal,
        }).click()
      })

      cy.location("pathname").should("equal", "/proposal")
    })

    it("should navigate user back to dashboard when user clicks on company logo", () => {
      cy.intercept("/api/user/qualifications/status", {
        fixture: "proposalJourneyCompleted",
      }).as("userStatus")

      cy.intercept("/api/portfolio/opportunities", {
        fixture: "userOpportunityStatusVerified",
      }).as("portfolioOpportunities")

      cy.intercept("/api/user/status", {
        fixture: "userStatusQualified",
      }).as("userQualificationStatus")

      cy.intercept("/api/user/summary", {
        fixture: "userSummaryWithLastProposalDate",
      }).as("userSummary")

      cy.intercept("/api/user/investment-goals", {
        fixture: "investmentGoalCompletedResponse",
      }).as("investmentGoalResponse")

      cy.intercept("/api/user/proposals", { fixture: "userProposals" }).as(
        "userProposal",
      )

      cy.intercept("/api/user", {
        fixture: "userPreProposalFromOpportunities",
      }).as("user")

      cy.intercept("/api/user/proposals/status", {
        fixture: "proposalsStatusGenerated",
      }).as("proposalsStatus")

      cy.intercept("/api/user/risk-assessment/retake-result", {
        fixture: "retakeRiskAssessmentResult",
      }).as("retakeRiskAssessmentResult")

      cy.intercept("/api/portfolio/proposal/deals?id=Capital*Growth", {
        fixture: "proposalCapitalDeals",
      }).as("proposalCapitalDeals")

      cy.findByLabelText("logo").click()

      cy.location("pathname").should("equal", "/")
    })

    it("should navigate user to detailed proposal screen if user completed pre-proposal journey AND has active Proposal AND status is Verified", () => {
      cy.intercept("/api/user/qualifications/status", {
        fixture: "proposalJourneyCompleted",
      }).as("userStatus")

      cy.intercept("/api/portfolio/opportunities", {
        fixture: "userOpportunityStatusVerified",
      }).as("portfolioOpportunities")

      cy.intercept("/api/user/status", {
        fixture: "userStatusQualified",
      }).as("userQualificationStatus")

      cy.intercept("/api/user/summary", {
        fixture: "userSummaryWithLastProposalDate",
      }).as("userSummary")

      cy.intercept("/api/user/investment-goals", {
        fixture: "investmentGoalCompletedResponse",
      }).as("investmentGoalResponse")

      cy.intercept("/api/user/proposals", { fixture: "userProposals" }).as(
        "userProposal",
      )

      cy.intercept("/api/user", {
        fixture: "userPreProposalFromOpportunities",
      }).as("user")

      cy.intercept("/api/user/proposals/status", {
        fixture: "proposalsStatusGenerated",
      }).as("proposalsStatus")

      cy.intercept("/api/user/risk-assessment/retake-result", {
        fixture: "retakeRiskAssessmentResult",
      }).as("retakeRiskAssessmentResult")

      cy.intercept("/api/portfolio/proposal/deals?id=Capital*Growth", {
        fixture: "proposalCapitalDeals",
      }).as("proposalCapitalDeals")

      cy.reload()

      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
      ])

      cy.findByLabelText("leftNavigation").within(() => {
        cy.findByRole("link", {
          name: commonKeys.nav.links.personalizedProposal,
        }).click()
      })

      cy.location("pathname").should("equal", "/personalized-proposal")
    })

    it("should navigate user to accepted proposal if it has accepted proposal using personalized proposal CTA", () => {
      cy.intercept("/api/user/proposals/status", {
        fixture: "proposalsStatusAccepted",
      }).as("proposalsStatus")

      cy.intercept("/api/user/proposals", { fixture: "userProposals" }).as(
        "userProposal",
      )

      cy.intercept("/api/user/qualifications/status", {
        fixture: "proposalJourneyCompleted",
      }).as("userStatus")

      cy.intercept("/api/portfolio/opportunities", {
        fixture: "userOpportunityStatusVerified",
      }).as("portfolioOpportunities")

      cy.intercept("/api/user/status", {
        fixture: "userStatusQualified",
      }).as("userQualificationStatus")

      cy.intercept("/api/user/summary", {
        fixture: "userSummaryWithLastProposalDate",
      }).as("userSummary")

      cy.intercept("/api/user/risk-assessment/retake-result", {
        fixture: "retakeRiskAssessmentResult",
      }).as("retakeRiskAssessmentResult")

      cy.intercept("/api/portfolio/proposal/deals?id=Capital*Growth", {
        fixture: "proposalCapitalDeals",
      }).as("proposalCapitalDeals")

      cy.visit("/")

      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
        "@upcomingWebinars",
        "@recentWebinars",
      ])

      cy.findByLabelText("leftNavigation").within(() => {
        cy.findByRole("link", {
          name: commonKeys.nav.links.personalizedProposal,
        }).click()
      })

      cy.location("pathname").should("equal", "/personalized-proposal")
    })

    it("should not list personalized proposal CTA if user status is 'Pending Approval' but user has completed preproposal journey", () => {
      cy.intercept("/api/user/qualifications/status", {
        fixture: "proposalJourneyCompleted",
      }).as("userStatus")

      cy.intercept("/api/portfolio/opportunities", {
        fixture: "userOpportunityStatusVerified",
      }).as("portfolioOpportunities")

      cy.intercept("/api/user/status", {
        fixture: "userStatusPendingVerification",
      }).as("userQualificationStatus")

      cy.intercept("/api/user/proposals", { fixture: "userProposals" }).as(
        "userProposal",
      )
      cy.visit("/")

      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
        "@upcomingWebinars",
        "@recentWebinars",
      ])

      cy.findByLabelText("leftNavigation").within(() => {
        cy.findByRole("link", {
          name: commonKeys.nav.links.personalizedProposal,
        }).should("not.exist")
      })
    })

    it("should not list personalized proposal CTA and portfolio simulator CTA if user status is 'Disqualified' but user has completed preproposal journey", () => {
      cy.intercept("/api/user/qualifications/status", {
        fixture: "proposalJourneyCompleted",
      }).as("userStatus")

      cy.intercept("/api/portfolio/opportunities", {
        fixture: "userOpportunityStatusVerified",
      }).as("portfolioOpportunities")

      cy.intercept("/api/user/status", {
        fixture: "userStatusDisQualified",
      }).as("userQualificationStatus")

      cy.intercept("/api/user/proposals", { fixture: "userProposals" }).as(
        "userProposal",
      )
      cy.visit("/")

      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
        "@upcomingWebinars",
        "@recentWebinars",
      ])

      cy.findByLabelText("leftNavigation").within(() => {
        cy.findByRole("link", {
          name: commonKeys.nav.links.personalizedProposal,
        }).should("not.exist")

        cy.findByRole("link", {
          name: commonKeys.nav.links.portfolioSimulator,
        }).should("not.exist")
      })
    })

    it("should not list personalized proposal CTA and portfolio simulator CTA if user status is 'Active pipeline' but user has completed preproposal journey", () => {
      cy.intercept("/api/user/qualifications/status", {
        fixture: "proposalJourneyCompleted",
      }).as("userStatus")

      cy.intercept("/api/portfolio/opportunities", {
        fixture: "userOpportunityStatusVerified",
      }).as("portfolioOpportunities")

      cy.intercept("/api/user/status", {
        fixture: "userStatusACTIVE_PIPELINE",
      }).as("userQualificationStatus")

      cy.intercept("/api/user/proposals", { fixture: "userProposals" }).as(
        "userProposal",
      )
      cy.visit("/")

      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
        "@upcomingWebinars",
        "@recentWebinars",
      ])

      cy.findByLabelText("leftNavigation").within(() => {
        cy.findByRole("link", {
          name: commonKeys.nav.links.personalizedProposal,
        }).should("not.exist")

        cy.findByRole("link", {
          name: commonKeys.nav.links.portfolioSimulator,
        }).should("not.exist")
      })
    })

    it("should not list personalized proposal CTA and portfolio simulator CTA if user status is 'Already client' but user has completed preproposal journey", () => {
      cy.intercept("/api/user/qualifications/status", {
        fixture: "proposalJourneyCompleted",
      }).as("userStatus")

      cy.intercept("/api/user/status", {
        fixture: "userStatusALREADY_CLIENT",
      }).as("userQualificationStatus")

      cy.intercept("/api/user/proposals", { fixture: "userProposals" }).as(
        "userProposal",
      )
      cy.visit("/")

      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
        "@upcomingWebinars",
        "@recentWebinars",
      ])

      cy.findByLabelText("leftNavigation").within(() => {
        cy.findByRole("link", {
          name: commonKeys.nav.links.personalizedProposal,
        }).should("not.exist")

        cy.findByRole("link", {
          name: commonKeys.nav.links.portfolioSimulator,
        }).should("not.exist")
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
      it("should see hamburger menu icon after login", () => {
        cy.visit("/")
        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
          "@upcomingWebinars",
          "@recentWebinars",
        ])
        cy.findByRole("button", { name: /Hamburger Menu/i }).click()
        cy.findByLabelText("leftNavigation").within(() => {
          cy.findByText(commonKeys.nav.links.dashboard).should("be.visible")
          cy.findByRole("button", { name: /Close Menu/i }).click()
          cy.findByRole("button", { name: /Close Menu/i }).should("not.exist")
        })
      })

      it("should navigate to opportunities screen", () => {
        cy.findByRole("button", { name: /Hamburger Menu/i }).click()
        cy.findByLabelText("leftNavigation")
          .findAllByRole("list")
          .within(() => {
            cy.findByText(commonKeys.nav.links.opportunities).click()
          })
        cy.location("pathname").should("equal", "/opportunities")
      })

      it("should navigate to dashboard from opportunities screen", () => {
        cy.findByRole("button", { name: /Hamburger Menu/i }).click()
        cy.findByLabelText("leftNavigation")
          .findAllByRole("list")
          .within(() => {
            cy.findByText(commonKeys.nav.links.dashboard).click()
          })
        cy.location("pathname").should("equal", "/")
      })

      it("should navigate to insights screen", () => {
        cy.findByRole("button", { name: /Hamburger Menu/i }).click()
        cy.findByLabelText("leftNavigation")
          .findAllByRole("list")
          .within(() => {
            cy.findByText(commonKeys.nav.links.insights).click()
          })
        cy.location("pathname").should("equal", "/insights")
      })

      it("should list Portfolio simulator link in the left navigation bar when user has not started pre-proposal journey", () => {
        cy.findByRole("button", { name: /Hamburger Menu/i }).click()
        cy.findByLabelText("leftNavigation").within(() => {
          cy.findByRole("link", {
            name: commonKeys.nav.links.portfolioSimulator,
          }).click()
        })

        cy.location("pathname").should("equal", "/portfolio/simulator")
      })

      it("should navigate user back to dashboard when user clicks on company logo on simulator modal", () => {
        cy.intercept("/api/user", {
          fixture: "userPreProposalFromOpportunities",
        }).as("user")

        cy.findByLabelText("logo").click()

        cy.location("pathname").should("equal", "/")
      })

      it("should list Portfolio simulator link in the left navigation bar when user has started unlock opportunities flow", () => {
        cy.findByRole("button", { name: /Hamburger Menu/i }).click()
        cy.findByLabelText("leftNavigation").within(() => {
          cy.findByRole("link", {
            name: commonKeys.nav.links.portfolioSimulator,
          }).click()
        })

        cy.location("pathname").should("equal", "/portfolio/simulator")
      })

      it("should navigate user to pre-proposal journey if it is not completed using personalized proposal CTA", () => {
        cy.visit("/")

        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
          "@upcomingWebinars",
          "@recentWebinars",
        ])

        cy.findByRole("button", { name: /Hamburger Menu/i }).click()
        cy.findByLabelText("leftNavigation").within(() => {
          cy.findByRole("link", {
            name: commonKeys.nav.links.personalizedProposal,
          }).click()
        })

        cy.location("pathname").should("equal", "/proposal")
      })

      it("should navigate user back to dashboard when user clicks on company logo", () => {
        cy.intercept("/api/user/qualifications/status", {
          fixture: "proposalJourneyCompleted",
        }).as("userStatus")

        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusVerified",
        }).as("portfolioOpportunities")

        cy.intercept("/api/user/status", {
          fixture: "userStatusQualified",
        }).as("userQualificationStatus")

        cy.intercept("/api/user/summary", {
          fixture: "userSummaryWithLastProposalDate",
        }).as("userSummary")

        cy.intercept("/api/user/investment-goals", {
          fixture: "investmentGoalCompletedResponse",
        }).as("investmentGoalResponse")

        cy.intercept("/api/user/proposals", { fixture: "userProposals" }).as(
          "userProposal",
        )

        cy.intercept("/api/user", {
          fixture: "userPreProposalFromOpportunities",
        }).as("user")

        cy.intercept("/api/user/proposals/status", {
          fixture: "proposalsStatusGenerated",
        }).as("proposalsStatus")

        cy.intercept("/api/user/risk-assessment/retake-result", {
          fixture: "retakeRiskAssessmentResult",
        }).as("retakeRiskAssessmentResult")

        cy.intercept("/api/portfolio/proposal/deals?id=Capital*Growth", {
          fixture: "proposalCapitalDeals",
        }).as("proposalCapitalDeals")

        cy.findByLabelText("logo").click()

        cy.location("pathname").should("equal", "/")
      })

      it("should navigate user to detailed proposal screen if user completed pre-proposal journey AND has active Proposal AND status is Verified", () => {
        cy.intercept("/api/user/qualifications/status", {
          fixture: "proposalJourneyCompleted",
        }).as("userStatus")

        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusVerified",
        }).as("portfolioOpportunities")

        cy.intercept("/api/user/status", {
          fixture: "userStatusQualified",
        }).as("userQualificationStatus")

        cy.intercept("/api/user/summary", {
          fixture: "userSummaryWithLastProposalDate",
        }).as("userSummary")

        cy.intercept("/api/user/investment-goals", {
          fixture: "investmentGoalCompletedResponse",
        }).as("investmentGoalResponse")

        cy.intercept("/api/user/proposals", { fixture: "userProposals" }).as(
          "userProposal",
        )

        cy.intercept("/api/user", {
          fixture: "userPreProposalFromOpportunities",
        }).as("user")

        cy.intercept("/api/user/proposals/status", {
          fixture: "proposalsStatusGenerated",
        }).as("proposalsStatus")

        cy.intercept("/api/user/risk-assessment/retake-result", {
          fixture: "retakeRiskAssessmentResult",
        }).as("retakeRiskAssessmentResult")

        cy.intercept("/api/portfolio/proposal/deals?id=Capital*Growth", {
          fixture: "proposalCapitalDeals",
        }).as("proposalCapitalDeals")

        cy.reload()

        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
        ])

        cy.findByRole("button", { name: /Hamburger Menu/i }).click()
        cy.findByLabelText("leftNavigation").within(() => {
          cy.findByRole("link", {
            name: commonKeys.nav.links.personalizedProposal,
          }).click()
        })

        cy.location("pathname").should("equal", "/personalized-proposal")
      })

      it("should navigate user to accepted proposal if it has accepted proposal using personalized proposal CTA", () => {
        cy.intercept("/api/user/proposals/status", {
          fixture: "proposalsStatusAccepted",
        }).as("proposalsStatus")

        cy.intercept("/api/user/proposals", { fixture: "userProposals" }).as(
          "userProposal",
        )

        cy.intercept("/api/user/qualifications/status", {
          fixture: "proposalJourneyCompleted",
        }).as("userStatus")

        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusVerified",
        }).as("portfolioOpportunities")

        cy.intercept("/api/user/status", {
          fixture: "userStatusQualified",
        }).as("userQualificationStatus")

        cy.intercept("/api/user/summary", {
          fixture: "userSummaryWithLastProposalDate",
        }).as("userSummary")

        cy.intercept("/api/user/risk-assessment/retake-result", {
          fixture: "retakeRiskAssessmentResult",
        }).as("retakeRiskAssessmentResult")

        cy.intercept("/api/portfolio/proposal/deals?id=Capital*Growth", {
          fixture: "proposalCapitalDeals",
        }).as("proposalCapitalDeals")

        cy.visit("/")

        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
          "@upcomingWebinars",
          "@recentWebinars",
        ])

        cy.findByRole("button", { name: /Hamburger Menu/i }).click()
        cy.findByLabelText("leftNavigation").within(() => {
          cy.findByRole("link", {
            name: commonKeys.nav.links.personalizedProposal,
          }).click()
        })

        cy.location("pathname").should("equal", "/personalized-proposal")
      })

      it("should not list personalized proposal CTA if user status is 'Pending Approval' but user has completed preproposal journey", () => {
        cy.intercept("/api/user/qualifications/status", {
          fixture: "proposalJourneyCompleted",
        }).as("userStatus")

        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusVerified",
        }).as("portfolioOpportunities")

        cy.intercept("/api/user/status", {
          fixture: "userStatusPendingVerification",
        }).as("userQualificationStatus")

        cy.intercept("/api/user/proposals", { fixture: "userProposals" }).as(
          "userProposal",
        )
        cy.visit("/")
        cy.findByRole("button", { name: /Hamburger Menu/i }).click()
        cy.findByLabelText("leftNavigation").within(() => {
          cy.findByRole("link", {
            name: commonKeys.nav.links.personalizedProposal,
          }).should("not.exist")
        })
      })

      it("should not list personalized proposal CTA and portfolio simulator CTA if user status is 'Disqualified' but user has completed preproposal journey", () => {
        cy.intercept("/api/user/qualifications/status", {
          fixture: "proposalJourneyCompleted",
        }).as("userStatus")

        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusVerified",
        }).as("portfolioOpportunities")

        cy.intercept("/api/user/status", {
          fixture: "userStatusDisQualified",
        }).as("userQualificationStatus")

        cy.intercept("/api/user/proposals", { fixture: "userProposals" }).as(
          "userProposal",
        )
        cy.visit("/")

        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
          "@upcomingWebinars",
          "@recentWebinars",
        ])

        cy.findByRole("button", { name: /Hamburger Menu/i }).click()
        cy.findByLabelText("leftNavigation").within(() => {
          cy.findByRole("link", {
            name: commonKeys.nav.links.personalizedProposal,
          }).should("not.exist")

          cy.findByRole("link", {
            name: commonKeys.nav.links.portfolioSimulator,
          }).should("not.exist")
        })
      })

      it("should not list personalized proposal CTA and portfolio simulator CTA if user status is 'Active pipeline' but user has completed preproposal journey", () => {
        cy.intercept("/api/user/qualifications/status", {
          fixture: "proposalJourneyCompleted",
        }).as("userStatus")

        cy.intercept("/api/portfolio/opportunities", {
          fixture: "userOpportunityStatusVerified",
        }).as("portfolioOpportunities")

        cy.intercept("/api/user/status", {
          fixture: "userStatusACTIVE_PIPELINE",
        }).as("userQualificationStatus")

        cy.intercept("/api/user/proposals", { fixture: "userProposals" }).as(
          "userProposal",
        )
        cy.visit("/")

        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
          "@upcomingWebinars",
          "@recentWebinars",
        ])

        cy.findByRole("button", { name: /Hamburger Menu/i }).click()
        cy.findByLabelText("leftNavigation").within(() => {
          cy.findByRole("link", {
            name: commonKeys.nav.links.personalizedProposal,
          }).should("not.exist")

          cy.findByRole("link", {
            name: commonKeys.nav.links.portfolioSimulator,
          }).should("not.exist")
        })
      })

      it("should not list personalized proposal CTA and portfolio simulator CTA if user status is 'Already client' but user has completed preproposal journey", () => {
        cy.intercept("/api/user/qualifications/status", {
          fixture: "proposalJourneyCompleted",
        }).as("userStatus")

        cy.intercept("/api/user/status", {
          fixture: "userStatusALREADY_CLIENT",
        }).as("userQualificationStatus")

        cy.intercept("/api/user/proposals", { fixture: "userProposals" }).as(
          "userProposal",
        )
        cy.visit("/")

        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
          "@upcomingWebinars",
          "@recentWebinars",
        ])

        cy.findByRole("button", { name: /Hamburger Menu/i }).click()
        cy.findByLabelText("leftNavigation").within(() => {
          cy.findByRole("link", {
            name: commonKeys.nav.links.personalizedProposal,
          }).should("not.exist")

          cy.findByRole("link", {
            name: commonKeys.nav.links.portfolioSimulator,
          }).should("not.exist")
        })
      })
    },
  )
})
