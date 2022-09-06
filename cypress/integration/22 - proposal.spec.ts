import {
  MyProposal,
  PortfolioSummary,
  PROPOSAL_ASSETCLASS_LIST,
  ProposalDealsGridAssets,
  ProposalDealsGridObj,
  StrategiesType,
} from "../../src/services/mytfo/types"
import formatCurrency from "../../src/utils/formatCurrency"
import formatYearName from "../../src/utils/formatYearName"
import nFormatter from "../../src/utils/nFormatter"

describe("proposal: As a user who completed the pre-proposal journey and is qualified, would be able to see a proposal", () => {
  let summaryDetails: PortfolioSummary
  let proposalDetails: MyProposal
  let userProposalsCapitalGrowthDeals: ProposalDealsGridObj[]
  let userProposalsCapitalYieldDeals: ProposalDealsGridObj[]
  let userProposalsOpportunisticDeals: ProposalDealsGridObj[]
  let userProposalsAbsoluteReturnDeals: ProposalDealsGridObj[]
  let proposalDealInfo: ProposalDealsGridAssets
  let homeKeys
  let personalisedProposalKeys
  let commonKeys
  let supportKeys

  before(() => {
    cy.fixture("../../public/locales/en/home").then((keys) => {
      homeKeys = keys
    })
    cy.fixture("../../public/locales/en/personalizedProposal").then((keys) => {
      personalisedProposalKeys = keys
    })

    cy.fixture("userSummaryWithLastProposalDate").then(
      (userSummaryWithLastProposalDate) => {
        summaryDetails = userSummaryWithLastProposalDate
      },
    )

    cy.fixture("userProposals").then((userProposal) => {
      proposalDetails = userProposal[0]
    })

    cy.fixture("proposalCapitalDeals").then((capitalGrowthDeals) => {
      userProposalsCapitalGrowthDeals = capitalGrowthDeals
    })

    cy.fixture("proposalCapitalYieldDeals").then((capitalYieldDeals) => {
      userProposalsCapitalYieldDeals = capitalYieldDeals
    })

    cy.fixture("proposalOpportunisticDeals").then(
      (capitalOpportunisticDeals) => {
        userProposalsOpportunisticDeals = capitalOpportunisticDeals
      },
    )

    cy.fixture("proposalAbsoluteReturnDeals").then(
      (capitalAbsoluteReturnDeals) => {
        userProposalsAbsoluteReturnDeals = capitalAbsoluteReturnDeals
      },
    )

    cy.fixture("proposalDealInfoId").then((proposalDeal) => {
      proposalDealInfo = proposalDeal
    })

    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })

    cy.fixture("../../public/locales/en/support").then((keys) => {
      supportKeys = keys
    })

    cy.loginBE()
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

    cy.intercept("/api/user", { fixture: "user" }).as("user")

    cy.intercept("/api/user/qualifications/status", {
      fixture: "proposalJourneyCompleted",
    }).as("userStatus")

    cy.intercept("/api/portfolio/opportunities", {
      fixture: "userOpportunityStatusVerified",
    }).as("portfolioOpportunities")

    cy.intercept("/api/user/relationship-manager", {
      fixture: "RMNotAssigned",
    }).as("relationshipManager")

    cy.intercept("/api/user/status", {
      fixture: "userStatusQualified",
    }).as("userQualificationStatus")

    cy.intercept("/api/user/summary", {
      fixture: "userSummaryWithLastProposalDate",
    }).as("userSummary")

    cy.intercept("/api/user/proposals/status", {
      fixture: "proposalsStatusGenerated",
    }).as("proposalsStatus")

    cy.intercept("/api/user/kyc/status", {
      fixture: "kycNotStarted",
    }).as("kycStatus")

    cy.intercept("/api/user/proposals", { fixture: "userProposals" }).as(
      "userProposals",
    )

    cy.intercept("/api/user/investment-goals", {
      fixture: "investmentGoalCompletedResponse",
    }).as("investmentGoalResponse")

    cy.intercept("GET", "/api/user/risk-assessment/result", {
      fixture: "riskAssessmentResult",
    }).as("riskAssessmentResult")

    cy.intercept("/api/portfolio/proposal/deals?id=Capital*Growth", {
      fixture: "proposalCapitalDeals",
    }).as("proposalCapitalDeals")

    cy.intercept("/api/portfolio/proposal/deal-info?id=*", {
      fixture: "proposalDealInfoId",
    }).as("proposalDeals")

    cy.intercept("/api/portfolio/proposal/deals?id=Capital*Yielding", {
      fixture: "proposalCapitalYieldDeals",
    }).as("proposalCapitalYieldDeals")

    cy.intercept("/api/portfolio/proposal/deals?id=Opportunistic", {
      fixture: "proposalOpportunisticDeals",
    }).as("proposalOpportunisticDeals")

    cy.intercept("/api/portfolio/proposal/deals?id=Absolute*Return", {
      fixture: "proposalAbsoluteReturnDeals",
    }).as("proposalAbsoluteReturnDeals")

    cy.intercept("/api/user/preference", {
      fixture: "userPreferenceENDefault",
    }).as("preference")

    cy.intercept("/api/user/preference/disclaimer", {
      fixture: "userDisclaimerAccepted",
    }).as("userDisclaimerAccepted")

    cy.intercept("/api/user/risk-assessment/retake-result", {
      fixture: "retakeRiskAssessmentResult",
    }).as("retakeRiskAssessmentResult")
  })

  context("desktop", () => {
    it("should able to view last updated date for proposal generated", () => {
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
      cy.findByRole("heading", {
        name: homeKeys.cta.portfolioCompleted.completedTitle,
      })
        .siblings("p")
        .should(
          "have.text",
          `${homeKeys.cta.portfolioCompleted.lastUpdate} ${summaryDetails.lastProposalDate}`,
        )
    })

    it("should able to navigate to the detailed proposal page", () => {
      cy.findByRole("button", {
        name: homeKeys.cta.portfolioCompleted.button.viewDetails,
      }).click()

      cy.location("pathname").should("equal", "/personalized-proposal")

      cy.wait(["@userProposals", "@proposalCapitalDeals"])
    })

    it("should see a banner on top with investment goal summary", () => {
      let expectedGoalsSummary =
        personalisedProposalKeys.header.goals.labels[summaryDetails.goal[0]]

      const expectedTimeHorizon =
        summaryDetails.timeHorizon +
        " " +
        formatYearName(summaryDetails.timeHorizon, "en")
      const expectedInvestmentAMount = formatCurrency(
        summaryDetails.investmentAmount,
      )
      if (summaryDetails.goal.length > 1) {
        expectedGoalsSummary =
          expectedGoalsSummary + ` +${summaryDetails.goal.length - 1}`
      }

      cy.findByLabelText("personalizedProposalSummary").within(() => {
        cy.findByText(personalisedProposalKeys.header.labels.goals)
          .siblings("p")
          .should("have.text", expectedGoalsSummary)
        cy.findByText(personalisedProposalKeys.header.labels.timeHorizon)
          .siblings("p")
          .should("have.text", expectedTimeHorizon)
        cy.findByText(personalisedProposalKeys.header.labels.investmentAmount)
          .siblings("p")
          .should("have.text", expectedInvestmentAMount)
        cy.findByText(personalisedProposalKeys.header.labels.riskLevel)
          .siblings("p")
          .should(
            "have.text",
            personalisedProposalKeys.header.riskLevel[summaryDetails.riskLevel],
          )
      })
    })

    it("should show navigation for three sections of proposal", () => {
      cy.findByLabelText("leftNavigation").within(() => {
        cy.findByText(personalisedProposalKeys.leftNavigation.yourAllocation)
          .should("be.visible")
          .should("have.css", "color", "rgb(185, 152, 85)")
      })
      cy.findByLabelText("leftNavigation").within(() => {
        cy.findByText(
          personalisedProposalKeys.leftNavigation.investmentWillWork,
        )
          .should("be.visible")
          .should("have.css", "color", "rgb(199, 199, 199)")
      })
      cy.findByLabelText("leftNavigation").within(() => {
        cy.findByText(personalisedProposalKeys.leftNavigation.investWithUs)
          .should("be.visible")
          .should("have.css", "color", "rgb(199, 199, 199)")
      })
    })

    it("should see focus of proposal as Capital Yield if it has more allocation", () => {
      let allocationProposalStratergy =
        personalisedProposalKeys.yourAllocation.description.capitalYield.label
      cy.findAllByRole("heading", {
        name: personalisedProposalKeys.yourAllocation.subHeading,
        level: 2,
      })
        .eq(0)
        .siblings("p")
        .eq(0)
        .should(
          "have.text",
          `${personalisedProposalKeys.yourAllocation.description.startingText} ${allocationProposalStratergy}`,
        )
    })

    it("should see focus of proposal as Capital Growth if it has more allocation", () => {
      const allocationProposalStratergy =
        personalisedProposalKeys.yourAllocation.description.capitalGrowth.label

      cy.intercept("/api/user/proposals", {
        fixture: "userProposalWithHighCapitalGrowth",
      }).as("userProposals")

      cy.fixture("userProposalWithHighCapitalGrowth").then((userProposal) => {
        proposalDetails = userProposal[0]
      })

      cy.reload()

      cy.wait([
        "@userProposals",
        "@proposalCapitalDeals",
        "@investmentGoalResponse",
      ])

      cy.findAllByRole("heading", {
        name: personalisedProposalKeys.yourAllocation.subHeading,
        level: 2,
      })
        .eq(0)
        .siblings("p")
        .eq(0)
        .should(
          "have.text",
          `${personalisedProposalKeys.yourAllocation.description.startingText} ${allocationProposalStratergy}`,
        )
    })

    it("should show summary metrics", () => {
      cy.findAllByLabelText("summaryMetrics")
        .eq(0)
        .findByText(
          personalisedProposalKeys.yourAllocation.proposalFacts.expectedReturn
            .label,
        )
        .parent("div")
        .siblings("p")
        .should(
          "have.text",
          `${Number(Number(proposalDetails.expectedReturn) * 100).toFixed(1)}%`,
        )

      cy.findAllByLabelText("summaryMetrics")
        .eq(1)
        .findByText(
          personalisedProposalKeys.yourAllocation.proposalFacts.expectedYield
            .label,
        )
        .parent("div")
        .siblings("p")
        .should(
          "have.text",
          `${Number(Number(proposalDetails.expectedYield) * 100).toFixed(1)}%`,
        )

      cy.findAllByLabelText("summaryMetrics")
        .eq(2)
        .findByText(
          personalisedProposalKeys.yourAllocation.proposalFacts
            .forecastedVolatility.label,
        )
        .parent("div")
        .siblings("p")
        .should(
          "have.text",
          `${Number(Number(proposalDetails.forecastedVolatility) * 100).toFixed(
            1,
          )}%`,
        )

      cy.findAllByLabelText("summaryMetrics")
        .eq(3)
        .findByText(
          personalisedProposalKeys.yourAllocation.proposalFacts.sharpeRatio
            .label,
        )
        .parent("div")
        .siblings("p")
        .should(
          "have.text",
          `${Number(proposalDetails.sharpeRatio).toFixed(2)}`,
        )
    })

    it("should show explanation for the terms of summary metrics", () => {
      cy.findAllByLabelText("summaryMetrics")
        .eq(0)
        .findByLabelText("Info icon")
        .trigger("mouseover")

      cy.findByRole("tooltip").should(
        "have.text",
        personalisedProposalKeys.yourAllocation.proposalFacts.expectedReturn
          .description,
      )

      cy.findAllByLabelText("summaryMetrics")
        .eq(0)
        .findByLabelText("Info icon")
        .trigger("mouseleave")

      cy.findAllByLabelText("summaryMetrics")
        .eq(1)
        .findByLabelText("Info icon")
        .trigger("mouseover")

      cy.findByRole("tooltip").should(
        "have.text",
        personalisedProposalKeys.yourAllocation.proposalFacts.expectedYield
          .description,
      )

      cy.findAllByLabelText("summaryMetrics")
        .eq(1)
        .findByLabelText("Info icon")
        .trigger("mouseleave")

      cy.findAllByLabelText("summaryMetrics")
        .eq(2)
        .findByLabelText("Info icon")
        .trigger("mouseover")

      cy.findByRole("tooltip").should(
        "have.text",
        personalisedProposalKeys.yourAllocation.proposalFacts
          .forecastedVolatility.description,
      )

      cy.findAllByLabelText("summaryMetrics")
        .eq(2)
        .findByLabelText("Info icon")
        .trigger("mouseleave")

      cy.findAllByLabelText("summaryMetrics")
        .eq(3)
        .findByLabelText("Info icon")
        .trigger("mouseover")

      cy.findByRole("tooltip").should(
        "have.text",
        personalisedProposalKeys.yourAllocation.proposalFacts.sharpeRatio
          .description,
      )

      cy.findAllByLabelText("summaryMetrics")
        .eq(3)
        .findByLabelText("Info icon")
        .trigger("mouseleave")
    })

    it("should show allocation categories", () => {
      cy.findAllByLabelText("yourAllocations")
        .eq(0)
        .should(
          "contain.text",
          personalisedProposalKeys.yourAllocation.proposalPostulates
            .capitalGrowth.label,
        )
      cy.findAllByLabelText("yourAllocations").eq(1).should(
        "contain.text",

        personalisedProposalKeys.yourAllocation.proposalPostulates.opportunistic
          .label,
      )
      cy.findAllByLabelText("yourAllocations").eq(2).should(
        "contain.text",

        personalisedProposalKeys.yourAllocation.proposalPostulates
          .capitalYielding.label,
      )
      cy.findAllByLabelText("yourAllocations")
        .eq(3)
        .should(
          "contain.text",
          personalisedProposalKeys.yourAllocation.proposalPostulates
            .absoluteReturn.label,
        )
    })

    it("should display allocation details for capital growth", () => {
      cy.findByRole("tab", {
        name: personalisedProposalKeys.yourAllocationDetail.tabHeaders
          .capitalGrowth,
      }).click()

      let percentageOfAllocation = Math.round(
        Number(
          proposalDetails.strategies.capitalGrowth.percentageAllocation * 100,
        ),
      )
      cy.findAllByRole("tabpanel")
        .eq(0)
        .within(() => {
          cy.get("svg").should("be.visible")
          cy.findByRole("heading", {
            name: personalisedProposalKeys.yourAllocationDetail.capitalGrowth
              .title,
          }).should("be.visible")
          cy.findByText(
            `${percentageOfAllocation}${personalisedProposalKeys.yourAllocationDetail.capitalGrowth.percentageOfAllocation}`,
          ).should("be.visible")

          cy.findByText(
            personalisedProposalKeys.yourAllocationDetail.capitalGrowth
              .capitalGrowthDesc,
          ).should("be.visible")

          cy.findByText(
            personalisedProposalKeys.yourAllocationDetail.capitalGrowth
              .assetClassDesc,
          ).should("be.visible")
        })
    })

    it("should show list of asset classes and deals for capital growth", () => {
      for (let i = 0; i < userProposalsCapitalGrowthDeals.length; i++) {
        cy.findAllByLabelText("assetClass")
          .eq(i)
          .within(() => {
            let activeDealText =
              userProposalsCapitalGrowthDeals[i].assets.length > 1
                ? personalisedProposalKeys.yourAllocationDetail.gridData
                    .activeDeals
                : personalisedProposalKeys.yourAllocationDetail.gridData
                    .activeDeal
            cy.findByRole("button")
              .should(
                "contain.text",
                userProposalsCapitalGrowthDeals[i].assetClass,
              )
              .should(
                "contain.text",
                `${userProposalsCapitalGrowthDeals[i].assets.length} ${activeDealText}`,
              )
              .click()

            if (userProposalsCapitalGrowthDeals.length > 1) {
              cy.findByRole("button").click()
            }

            cy.findByRole("region").should(
              "contain.text",
              personalisedProposalKeys.yourAllocationDetail.gridData[
                getDealDescription(
                  <PROPOSAL_ASSETCLASS_LIST>(
                    userProposalsCapitalGrowthDeals[i].assetClass
                  ),
                )
              ],
            )
            // headers for deals in asset classes
            cy.findByRole("table")
              .find("thead")
              .findByRole("row")
              .within(() => {
                cy.findByText(
                  personalisedProposalKeys.yourAllocationDetail.tableHeaders
                    .dealName,
                ).should("be.visible")
                cy.findByText(
                  personalisedProposalKeys.yourAllocationDetail.tableHeaders
                    .assetManager,
                ).should("be.visible")
                cy.findByText(
                  personalisedProposalKeys.yourAllocationDetail.tableHeaders
                    .preferences,
                ).should("be.visible")
                cy.findByText(
                  personalisedProposalKeys.yourAllocationDetail.tableHeaders
                    .expectedReturn,
                ).should("be.visible")
                cy.findByLabelText("Info icon")
                  .scrollIntoView()
                  .trigger("mouseover", { force: true })
                cy.root()
                  .parents("body")
                  .findByText(
                    personalisedProposalKeys.yourAllocationDetail.tableHeaders
                      .targetReturnToolTipText,
                  )
                  .should("be.visible")

                cy.findByLabelText("Info icon").trigger("mouseleave", {
                  force: true,
                })
              })

            for (
              let j = 0;
              j < userProposalsCapitalGrowthDeals[i].assets.length;
              j++
            ) {
              //deals in asset classes
              cy.findByRole("table")
                .find("tbody")
                .findAllByRole("row")
                .eq(j)
                .within(() => {
                  cy.findByRole("gridcell", {
                    name: userProposalsCapitalGrowthDeals[i].assets[j].title,
                  })
                  cy.findByRole("gridcell", {
                    name: userProposalsCapitalGrowthDeals[i].assets[j]
                      .assetManager,
                  })
                  cy.findByRole("gridcell", {
                    name: userProposalsCapitalGrowthDeals[i].assets[j]
                      .preferences,
                  })
                  cy.findByRole("gridcell", {
                    name: userProposalsCapitalGrowthDeals[i].assets[j]
                      .expectedReturn,
                  })
                })
            }
          })
      }
    })

    it("should be able to view detailed deal information", () => {
      cy.findAllByLabelText("assetClass")
        .eq(0)
        .within(() => {
          cy.findByRole("button").click()
          //deals in asset classes
          cy.findByRole("table")
            .find("tbody")
            .findAllByRole("row")
            .eq(0)
            .within(() => {
              cy.findByRole("gridcell", {
                name: personalisedProposalKeys.yourAllocationDetail.gridData
                  .more,
              }).click()
            })
        })

      cy.findByLabelText("detailedDealInfoModal").within(() => {
        cy.findAllByLabelText("breakdown")
          .eq(0)
          .should(
            "contain.text",
            personalisedProposalKeys.yourAllocationDetail.gridPostulates
              .assetManager,
          )
          .siblings("p")
          .should("contain.text", proposalDealInfo.sponsor)
        cy.findAllByLabelText("breakdown")
          .eq(1)
          .should(
            "contain.text",
            personalisedProposalKeys.yourAllocationDetail.gridPostulates
              .assetClass,
          )
          .siblings("p")
          .should("contain.text", proposalDealInfo.assetClass)
        cy.findAllByLabelText("breakdown")
          .eq(2)
          .should(
            "contain.text",
            personalisedProposalKeys.yourAllocationDetail.gridPostulates.sector,
          )
          .siblings("p")
          .should("contain.text", proposalDealInfo.sector)
        cy.findAllByLabelText("breakdown")
          .eq(3)
          .should(
            "contain.text",
            personalisedProposalKeys.yourAllocationDetail.gridPostulates
              .expectedExit,
          )
          .siblings("p")
          .should("contain.text", proposalDealInfo.expectedExit)
        cy.findAllByLabelText("breakdown")
          .eq(4)
          .should(
            "contain.text",
            personalisedProposalKeys.yourAllocationDetail.gridPostulates
              .expectedReturn,
          )
          .siblings("p")
          .should("contain.text", proposalDealInfo.expectedReturn)
        cy.findAllByLabelText("breakdown")
          .eq(5)
          .should(
            "contain.text",
            personalisedProposalKeys.yourAllocationDetail.gridPostulates
              .country,
          )
          .siblings("p")
          .should("contain.text", proposalDealInfo.country)
      })
    })

    it("should view the tooltip for Expected Return", () => {
      cy.findByLabelText("detailedDealInfoModal")
        .findByLabelText("infoIcon")
        .trigger("mouseover")

      cy.findByRole("tooltip").should(
        "have.text",
        personalisedProposalKeys.yourAllocationDetail.tooltip.expectedReturn,
      )
    })

    it("should able to close detailed deal modal", () => {
      cy.findByLabelText("closeIcon").click()
      cy.findByLabelText("detailedDealInfoModal").should("not.exist")
    })

    it("should display allocation details for capital yield", () => {
      cy.findByRole("tab", {
        name: personalisedProposalKeys.yourAllocationDetail.tabHeaders
          .capitalYielding,
      }).click()

      let percentageOfAllocation = Math.round(
        Number(
          proposalDetails.strategies.capitalYielding.percentageAllocation * 100,
        ),
      )
      cy.findAllByRole("tabpanel")
        .eq(0)
        .within(() => {
          cy.get("svg").should("be.visible")
          cy.findByRole("heading", {
            name: personalisedProposalKeys.yourAllocationDetail.capitalYielding
              .title,
          }).should("be.visible")
          cy.findByText(
            `${percentageOfAllocation}${personalisedProposalKeys.yourAllocationDetail.capitalYielding.percentageOfAllocation}`,
          ).should("be.visible")

          cy.findByText(
            personalisedProposalKeys.yourAllocationDetail.capitalYielding
              .capitalYieldingDesc,
          ).should("be.visible")

          cy.findByText(
            personalisedProposalKeys.yourAllocationDetail.capitalYielding
              .assetClassDesc,
          ).should("be.visible")
        })
    })

    it("should show list of asset classes and deals for capital yield", () => {
      for (let i = 0; i < userProposalsCapitalYieldDeals.length; i++) {
        cy.findByRole("tabpanel")
          .findAllByLabelText("assetClass")
          .eq(i)
          .within(() => {
            let activeDealText =
              userProposalsCapitalYieldDeals[i].assets.length > 1
                ? personalisedProposalKeys.yourAllocationDetail.gridData
                    .activeDeals
                : personalisedProposalKeys.yourAllocationDetail.gridData
                    .activeDeal
            cy.findByRole("button")
              .should(
                "contain.text",
                userProposalsCapitalYieldDeals[i].assetClass,
              )
              .should(
                "contain.text",
                `${userProposalsCapitalYieldDeals[i].assets.length} ${activeDealText}`,
              )
              .click()

            // will uncomment this once bug 6035 is resolved

            // cy.findByRole("region").should(
            //   "contain.text",
            //   personalisedProposalKeys.yourAllocationDetail.gridData[
            //     getDealDescription(
            //       <PROPOSAL_ASSETCLASS_LIST>(
            //         userProposalsCapitalYieldDeals[i].assetClass
            //       ),
            //     )
            //   ],
            // )

            // headers for deals in asset classes
            cy.findByRole("table")
              .find("thead")
              .findByRole("row")
              .within(() => {
                cy.findByText(
                  personalisedProposalKeys.yourAllocationDetail.tableHeaders
                    .dealName,
                ).should("be.visible")
                cy.findByText(
                  personalisedProposalKeys.yourAllocationDetail.tableHeaders
                    .assetManager,
                ).should("be.visible")
                cy.findByText(
                  personalisedProposalKeys.yourAllocationDetail.tableHeaders
                    .preferences,
                ).should("be.visible")
                cy.findByText(
                  personalisedProposalKeys.yourAllocationDetail.tableHeaders
                    .targetYield,
                ).should("be.visible")
                cy.findAllByLabelText("Info icon").eq(0).trigger("mouseover")

                cy.root()
                  .parents("body")
                  .findByText(
                    personalisedProposalKeys.yourAllocationDetail.tableHeaders
                      .targetYieldToolTipText,
                  )
                  .should("be.visible")

                cy.findAllByLabelText("Info icon").eq(0).trigger("mouseleave")

                cy.findByText(
                  personalisedProposalKeys.yourAllocationDetail.tableHeaders
                    .expectedReturn,
                ).should("be.visible")

                cy.findAllByLabelText("Info icon").eq(1).trigger("mouseover")

                cy.root()
                  .parents("body")
                  .findByText(
                    personalisedProposalKeys.yourAllocationDetail.tableHeaders
                      .targetReturnToolTipText,
                  )
                  .should("be.visible")
                cy.findAllByLabelText("Info icon").eq(1).trigger("mouseleave")
              })

            for (
              let j = 0;
              j < userProposalsCapitalYieldDeals[i].assets.length;
              j++
            ) {
              //deals in asset classes
              cy.findByRole("table")
                .find("tbody")
                .findAllByRole("row")
                .eq(j)
                .within(() => {
                  cy.findByRole("gridcell", {
                    name: userProposalsCapitalYieldDeals[i].assets[j].title,
                  })
                  cy.findByRole("gridcell", {
                    name: userProposalsCapitalYieldDeals[i].assets[j]
                      .assetManager,
                  })
                  cy.findByRole("gridcell", {
                    name: userProposalsCapitalYieldDeals[i].assets[j]
                      .preferences,
                  })
                  cy.findByRole("gridcell", {
                    name: userProposalsCapitalYieldDeals[i].assets[j]
                      .expectedReturn,
                  })
                })
            }
          })
      }
    })

    it("should display allocation details for opportunistic", () => {
      cy.findByRole("tab", {
        name: personalisedProposalKeys.yourAllocationDetail.tabHeaders
          .opportunistic,
      }).click()

      let percentageOfAllocation = Math.round(
        Number(
          proposalDetails.strategies.opportunistic.percentageAllocation * 100,
        ),
      )
      cy.findAllByRole("tabpanel")
        .eq(0)
        .within(() => {
          cy.get("svg").should("be.visible")
          cy.findByRole("heading", {
            name: personalisedProposalKeys.yourAllocationDetail.opportunistic
              .title,
          }).should("be.visible")
          cy.findByText(
            `${percentageOfAllocation}${personalisedProposalKeys.yourAllocationDetail.opportunistic.percentageOfAllocation}`,
          ).should("be.visible")

          cy.findByText(
            personalisedProposalKeys.yourAllocationDetail.opportunistic
              .opportunisticDescription,
          ).should("be.visible")
        })
    })

    it("should display accordions for funds in opportunistic", () => {
      for (let i = 0; i < userProposalsOpportunisticDeals.length; i++) {
        cy.findByRole("tabpanel")
          .findAllByLabelText("fundsAccordion")
          .eq(i)
          .within(() => {
            for (
              let j = 0;
              j < userProposalsOpportunisticDeals[i].assets.length;
              j++
            ) {
              cy.findByRole("button")
                .should(
                  "contain.text",
                  userProposalsOpportunisticDeals[i].assets[j].title,
                )
                .click()

              cy.findByRole("region")
                .should(
                  "contain.text",
                  userProposalsOpportunisticDeals[i].assets[j].description,
                )
                .within(() => {
                  cy.findByText(
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.heading,
                  )

                  cy.findAllByLabelText("assets")
                    .eq(0)
                    .should(
                      "contain.text",
                      userProposalsOpportunisticDeals[i].assets[j].targetReturn,
                    )
                    .should(
                      "contain.text",
                      personalisedProposalKeys.yourAllocationDetail
                        .absoluteReturnOpportunisticDetail.labels.targetReturn,
                    )
                    .findByLabelText("Info icon")
                    .trigger("mouseover")

                  cy.root()
                    .parents("body")
                    .findByText(
                      personalisedProposalKeys.yourAllocationDetail
                        .absoluteReturnOpportunisticDetail.tooltip.targetReturn,
                    )
                    .should("be.visible")

                  cy.findAllByLabelText("assets")
                    .eq(0)
                    .findByLabelText("Info icon")
                    .trigger("mouseleave")
                })

              cy.findAllByLabelText("assets")
                .eq(1)
                .should(
                  "contain.text",
                  userProposalsOpportunisticDeals[i].assets[j].targetYield,
                )
                .should(
                  "contain.text",
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.labels.targetYield,
                )
                .findByLabelText("Info icon")
                .trigger("mouseover")

              cy.root()
                .parents("body")
                .findByText(
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.tooltip.targetYield,
                )
                .should("be.visible")

              cy.findAllByLabelText("assets")
                .eq(1)
                .findByLabelText("Info icon")
                .trigger("mouseleave")

              cy.findAllByLabelText("assets")
                .eq(2)
                .should(
                  "contain.text",
                  userProposalsOpportunisticDeals[i].assets[j].fundTerm,
                )
                .should(
                  "contain.text",
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.labels.fundTerm,
                )
                .findByLabelText("Info icon")
                .trigger("mouseover")

              cy.root()
                .parents("body")
                .findByText(
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.tooltip.fundTerm,
                )
                .should("be.visible")

              cy.findAllByLabelText("assets")
                .eq(2)
                .findByLabelText("Info icon")
                .trigger("mouseleave")

              cy.findAllByLabelText("assets")
                .eq(3)
                .should(
                  "contain.text",
                  userProposalsOpportunisticDeals[i].assets[j].offeringPeriod,
                )
                .should(
                  "contain.text",
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.labels
                    .initialOfferingPeriod,
                )
                .findByLabelText("Info icon")
                .trigger("mouseover")

              cy.root()
                .parents("body")
                .findByText(
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.tooltip
                    .initialOfferingPeriod,
                )
                .should("be.visible")

              cy.findAllByLabelText("assets")
                .eq(3)
                .findByLabelText("Info icon")
                .trigger("mouseleave")

              cy.findAllByLabelText("assets")
                .eq(4)
                .should(
                  "contain.text",
                  userProposalsOpportunisticDeals[i].assets[j].administrator,
                )
                .should(
                  "contain.text",
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.labels.administrator,
                )

              cy.findAllByLabelText("assets")
                .eq(5)
                .should(
                  "contain.text",
                  userProposalsOpportunisticDeals[i].assets[j].auditor,
                )
                .should(
                  "contain.text",
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.labels.auditor,
                )

              const assetClassValue: String =
                userProposalsOpportunisticDeals[i].assets[j].assetClass

              cy.findAllByLabelText("assets")
                .eq(6)
                .should(
                  "contain.text",
                  assetClassValue.length > 0 ? assetClassValue : "-".trim(),
                )
                .should(
                  "contain.text",
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.labels.assetClasses,
                )

              cy.findAllByLabelText("assets")
                .eq(7)
                .should(
                  "contain.text",
                  userProposalsOpportunisticDeals[i].assets[j].shareClasses,
                )
                .should(
                  "contain.text",
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.labels.shareClasses,
                )
                .findByLabelText("Info icon")
                .trigger("mouseover")

              cy.root()
                .parents("body")
                .findByText(
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.tooltip.shareClass,
                )
                .should("be.visible")

              cy.findAllByLabelText("assets")
                .eq(7)
                .findByLabelText("Info icon")
                .trigger("mouseleave")

              cy.findAllByLabelText("assets")
                .eq(8)
                .should(
                  "contain.text",
                  userProposalsOpportunisticDeals[i].assets[j].redemptions,
                )
                .should(
                  "contain.text",
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.labels.redemptions,
                )
                .findByLabelText("Info icon")
                .trigger("mouseover")

              cy.root()
                .parents("body")
                .findByText(
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.tooltip.redemption,
                )
                .should("be.visible")

              cy.findAllByLabelText("assets")
                .eq(8)
                .findByLabelText("Info icon")
                .trigger("mouseleave")
            }
          })
      }
    })

    it("should display allocation details for absolute return", () => {
      cy.findByRole("tab", {
        name: personalisedProposalKeys.yourAllocationDetail.tabHeaders
          .absoluteReturn,
      }).click()

      let percentageOfAllocation = Math.round(
        Number(
          proposalDetails.strategies.absoluteReturn.percentageAllocation * 100,
        ),
      )
      cy.findAllByRole("tabpanel")
        .eq(0)
        .within(() => {
          cy.get("svg").should("be.visible")
          cy.findByRole("heading", {
            name: personalisedProposalKeys.yourAllocationDetail.absoluteReturn
              .title,
          }).should("be.visible")
          cy.findByText(
            `${percentageOfAllocation}${personalisedProposalKeys.yourAllocationDetail.absoluteReturn.percentageOfAllocation}`,
          ).should("be.visible")

          cy.findByText(
            personalisedProposalKeys.yourAllocationDetail.absoluteReturn
              .absoluteReturnDescription,
          ).should("be.visible")
        })
    })

    it("should display accordions for funds in absolute return", () => {
      for (let i = 0; i < userProposalsAbsoluteReturnDeals.length; i++) {
        cy.findByRole("tabpanel")
          .findAllByLabelText("fundsAccordion")
          .eq(i)
          .within(() => {
            for (
              let j = 0;
              j < userProposalsAbsoluteReturnDeals[i].assets.length;
              j++
            ) {
              cy.findByRole("button")
                .should(
                  "contain.text",
                  userProposalsAbsoluteReturnDeals[i].assets[j].title,
                )
                .click()

              cy.findByRole("region")
                .should(
                  "contain.text",
                  userProposalsAbsoluteReturnDeals[i].assets[j].description,
                )
                .within(() => {
                  cy.findByText(
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.heading,
                  )

                  cy.findAllByLabelText("assets")
                    .eq(0)
                    .should(
                      "contain.text",
                      userProposalsAbsoluteReturnDeals[i].assets[j]
                        .targetReturn,
                    )
                    .should(
                      "contain.text",
                      personalisedProposalKeys.yourAllocationDetail
                        .absoluteReturnOpportunisticDetail.labels.targetReturn,
                    )
                    .findByLabelText("Info icon")
                    .trigger("mouseover")

                  cy.root()
                    .parents("body")
                    .findByText(
                      personalisedProposalKeys.yourAllocationDetail
                        .absoluteReturnOpportunisticDetail.tooltip.targetReturn,
                    )
                    .should("be.visible")

                  cy.findAllByLabelText("assets")
                    .eq(0)
                    .findByLabelText("Info icon")
                    .trigger("mouseleave")
                })

              cy.findAllByLabelText("assets")
                .eq(1)
                .should(
                  "contain.text",
                  userProposalsAbsoluteReturnDeals[i].assets[j].targetYield,
                )
                .should(
                  "contain.text",
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.labels.targetYield,
                )
                .findByLabelText("Info icon")
                .trigger("mouseover")

              cy.root()
                .parents("body")
                .findByText(
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.tooltip.targetYield,
                )
                .should("be.visible")

              cy.findAllByLabelText("assets")
                .eq(1)
                .findByLabelText("Info icon")
                .trigger("mouseleave")

              cy.findAllByLabelText("assets")
                .eq(2)
                .should(
                  "contain.text",
                  userProposalsAbsoluteReturnDeals[i].assets[j].fundTerm,
                )
                .should(
                  "contain.text",
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.labels.fundTerm,
                )
                .findByLabelText("Info icon")
                .trigger("mouseover")

              cy.root()
                .parents("body")
                .findByText(
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.tooltip.fundTerm,
                )
                .should("be.visible")

              cy.findAllByLabelText("assets")
                .eq(2)
                .findByLabelText("Info icon")
                .trigger("mouseleave")

              cy.findAllByLabelText("assets")
                .eq(3)
                .should(
                  "contain.text",
                  userProposalsAbsoluteReturnDeals[i].assets[j].offeringPeriod,
                )
                .should(
                  "contain.text",
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.labels
                    .initialOfferingPeriod,
                )
                .findByLabelText("Info icon")
                .trigger("mouseover")

              cy.root()
                .parents("body")
                .findByText(
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.tooltip
                    .initialOfferingPeriod,
                )
                .should("be.visible")

              cy.findAllByLabelText("assets")
                .eq(3)
                .findByLabelText("Info icon")
                .trigger("mouseleave")

              cy.findAllByLabelText("assets")
                .eq(4)
                .should(
                  "contain.text",
                  userProposalsAbsoluteReturnDeals[i].assets[j].administrator,
                )
                .should(
                  "contain.text",
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.labels.administrator,
                )

              cy.findAllByLabelText("assets")
                .eq(5)
                .should(
                  "contain.text",
                  userProposalsAbsoluteReturnDeals[i].assets[j].auditor,
                )
                .should(
                  "contain.text",
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.labels.auditor,
                )

              const assetClassValue: String =
                userProposalsAbsoluteReturnDeals[i].assets[j].assetClass

              cy.findAllByLabelText("assets")
                .eq(6)
                .should(
                  "contain.text",
                  assetClassValue.length > 0 ? assetClassValue : "-".trim(),
                )
                .should(
                  "contain.text",
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.labels.assetClasses,
                )

              cy.findAllByLabelText("assets")
                .eq(7)
                .should(
                  "contain.text",
                  userProposalsAbsoluteReturnDeals[i].assets[j].shareClasses,
                )
                .should(
                  "contain.text",
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.labels.shareClasses,
                )
                .findByLabelText("Info icon")
                .trigger("mouseover")

              cy.root()
                .parents("body")
                .findByText(
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.tooltip.shareClass,
                )
                .should("be.visible")

              cy.findAllByLabelText("assets")
                .eq(7)
                .findByLabelText("Info icon")
                .trigger("mouseleave")

              cy.findAllByLabelText("assets")
                .eq(8)
                .should(
                  "contain.text",
                  userProposalsAbsoluteReturnDeals[i].assets[j].redemptions,
                )
                .should(
                  "contain.text",
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.labels.redemptions,
                )
                .findByLabelText("Info icon")
                .trigger("mouseover")

              cy.root()
                .parents("body")
                .findByText(
                  personalisedProposalKeys.yourAllocationDetail
                    .absoluteReturnOpportunisticDetail.tooltip.redemption,
                )
                .should("be.visible")

              cy.findAllByLabelText("assets")
                .eq(8)
                .findByLabelText("Info icon")
                .trigger("mouseleave")
            }
          })
      }
    })

    it("should show How your investment will work section", () => {
      cy.findByLabelText("leftNavigation").within(() => {
        cy.findByText(
          personalisedProposalKeys.leftNavigation.investmentWillWork,
        )
          .click()
          .should("have.css", "color", "rgb(185, 152, 85)")
      })
      cy.findAllByRole(
        "heading",
        personalisedProposalKeys.investmentWork.heading,
      )
        .eq(0)
        .scrollIntoView()
        .should("be.visible")

      cy.findByText(
        personalisedProposalKeys.investmentWork.labels.deploymentSchedule,
      )
        .scrollIntoView()
        .should("be.visible")

      cy.findByText(
        personalisedProposalKeys.investmentWork.labels.totalCommitted,
      )
        .siblings("p")
        .should("have.text", formatCurrency(proposalDetails.totalCommitted))

      cy.findByText(
        personalisedProposalKeys.investmentWork.labels.yearsToFullyDeploy,
      )
        .siblings("p")
        .should("have.text", proposalDetails.graphData.length)
    })

    it("should open pop up for expert advice", () => {
      cy.findByLabelText("leftNavigation").within(() => {
        cy.findByText(
          personalisedProposalKeys.leftNavigation.investmentWillWork,
        ).click()
      })
      cy.findByRole("dialog")
        .findByText(personalisedProposalKeys.footer.popover.header)
        .should("be.visible")
    })

    it("should navigate to schedule a call with RM process from a help pop up module", () => {
      cy.findByRole("dialog")
        .findByText(personalisedProposalKeys.footer.popover.button.scheduleCall)
        .click({ force: true })

      cy.location("pathname").should("equals", "/schedule-meeting")
    })

    it("should show year-wise deployment in tabular form", () => {
      cy.visit("/personalized-proposal")
      cy.fixture("userProposals").then((userProposal) => {
        proposalDetails = userProposal[0]
      })
      cy.wait([
        "@userProposals",
        "@proposalCapitalDeals",
        "@investmentGoalResponse",
      ])
      let totalColumns = 0
      let totalDeploymentYearWise = [0, 0, 0]
      cy.findByRole("table")
        .findAllByRole("row")
        .then((rows) => {
          cy.wrap(rows[0]).within((headerRow) => {
            totalColumns = headerRow.find("th").length
            cy.wrap(headerRow[0])
              .should(
                "contain.text",
                personalisedProposalKeys.investmentWork.chart.strategyName,
              )
              .should(
                "contain.text",
                personalisedProposalKeys.investmentWork.chart.totalAmount,
              )
              .should(
                "contain.text",
                personalisedProposalKeys.investmentWork.chart.portfolioPercent,
              )
              .should(
                "contain.text",
                personalisedProposalKeys.investmentWork.chart.strategyName,
              )

            for (let i = 1; i <= proposalDetails.graphData.length; i++) {
              cy.wrap(headerRow[0]).should(
                "contain.text",

                personalisedProposalKeys.investmentWork.chart[`year${i}`],
              )
            }
          })

          for (let stragtergyRow = 1; stragtergyRow < 5; stragtergyRow++) {
            let strategy: StrategiesType
            if (stragtergyRow == 1) {
              strategy = StrategiesType.CapitalYielding
            } else if (stragtergyRow == 2) {
              strategy = StrategiesType.CapitalGrowth
            } else if (stragtergyRow == 3) {
              strategy = StrategiesType.Opportunistic
            } else if (stragtergyRow == 4) {
              strategy = StrategiesType.AbsoluteReturn
            }
            cy.wrap(rows[stragtergyRow]).within(() => {
              let totalDeploymentStratergyWise = 0
              cy.findAllByRole("gridcell").then((tableCells) => {
                expect(tableCells[0]).to.have.text(
                  personalisedProposalKeys.investmentWork.legends[strategy],
                )

                for (let i = 0; i < proposalDetails.graphData.length; i++) {
                  expect(tableCells[i + 1]).to.have.text(
                    "$" +
                      nFormatter(
                        proposalDetails.strategies[strategy].deploymentYears[i],
                        2,
                      ),
                  )
                  totalDeploymentStratergyWise =
                    totalDeploymentStratergyWise +
                    proposalDetails.strategies[strategy].deploymentYears[i]

                  totalDeploymentYearWise[i] =
                    totalDeploymentYearWise[i] +
                    proposalDetails.strategies[strategy].deploymentYears[i]
                }

                expect(tableCells[totalColumns - 2]).to.have.text(
                  "$" + nFormatter(totalDeploymentStratergyWise, 2),
                )

                expect(tableCells[totalColumns - 1]).to.have.text(
                  `${(
                    proposalDetails.strategies[strategy].percentageAllocation *
                    100
                  ).toFixed(0)}%`,
                )
              })
            })
          }

          cy.wrap(rows[5]).within(() => {
            cy.findByText(personalisedProposalKeys.investmentWork.chart.total)
              .scrollIntoView()
              .should("be.visible")

            for (let i = 0; i < proposalDetails.graphData.length; i++) {
              cy.findByText(
                "$" + nFormatter(totalDeploymentYearWise[i], 2),
              ).should("be.visible")
            }

            cy.findByText(
              "$" +
                nFormatter(
                  totalDeploymentYearWise.reduce((a, b) => a + b, 2),
                  0,
                ),
            )

            cy.findByText("100%").should("be.visible")
          })
        })
    })

    it("should not show stratergy if allocation is 0", () => {
      cy.intercept("/api/user/proposals", {
        fixture: "userProposalWithNoAbsoluteReturn",
      }).as("userProposals")

      cy.reload()

      cy.wait([
        "@userProposals",
        "@proposalCapitalDeals",
        "@investmentGoalResponse",
      ])

      cy.findByText(
        personalisedProposalKeys.yourAllocation.proposalPostulates
          .absoluteReturn.label,
      ).should("not.exist")

      cy.findAllByLabelText("yourAllocations").eq(0).should(
        "contain.text",

        personalisedProposalKeys.yourAllocation.proposalPostulates.capitalGrowth
          .label,
      )
      cy.findAllByLabelText("yourAllocations").eq(1).should(
        "contain.text",

        personalisedProposalKeys.yourAllocation.proposalPostulates.opportunistic
          .label,
        personalisedProposalKeys.yourAllocation.proposalPostulates.capitalGrowth
          .label,
      )
      cy.findAllByLabelText("yourAllocations").eq(2).should(
        "contain.text",

        personalisedProposalKeys.yourAllocation.proposalPostulates
          .capitalYielding.label,
      )

      cy.findByRole("tablist")
        .findByRole("button", {
          name: personalisedProposalKeys.yourAllocationDetail.tabHeaders
            .absoluteReturn,
        })
        .should("not.exist")
    })

    it("should show projected earnings", () => {
      cy.findByLabelText("earningsHeading").should(
        "have.text",
        personalisedProposalKeys.earnings.heading,
      )
      cy.findByLabelText("earningsSubheading").should(
        "have.text",
        personalisedProposalKeys.earnings.subheading,
      )
    })

    it("should show statistics of The Family Office’s historical performance in distressed market conditions", () => {
      cy.findByLabelText("financialCrisis")
        .scrollIntoView()
        .within(() => {
          cy.findByText(
            personalisedProposalKeys.investingWithTFO.chart.labels
              .financialCrisis,
          ).should("be.visible")
          cy.get("svg").should("be.visible")
        })
      cy.findByLabelText("europeanDebtCrisis").within(() => {
        cy.findByText(
          personalisedProposalKeys.investingWithTFO.chart.labels
            .europeanDebtCrisis,
        ).should("be.visible")
        cy.get("svg").should("be.visible")
      })
      cy.findByLabelText("coronavirusPandemic").within(() => {
        cy.findByText(
          personalisedProposalKeys.investingWithTFO.chart.labels
            .coronavirusPandemic,
        ).should("be.visible")
        cy.get("svg").should("be.visible")
      })
    })

    it("should navigate user back to dashboard on clicking Save & exit CTA", () => {
      cy.findByRole("link", { name: commonKeys.button.exit }).click()
      cy.location("pathname").should("equal", "/")
    })

    it("should open get Support pop up window from Get Support Link", () => {
      cy.visit("/personalized-proposal")

      cy.wait([
        "@userProposals",
        "@proposalCapitalDeals",
        "@investmentGoalResponse",
        "@kycStatus",
        "@userSummary",
      ])

      cy.findByRole("button", { name: commonKeys.help.link.support }).click()
      cy.findByRole("button", {
        name: supportKeys.card.talkWithExperts.title,
      }).should("be.visible")

      cy.findByRole("button", { name: commonKeys.button.close }).click()

      cy.findByRole("button", {
        name: supportKeys.card.talkWithExperts.title,
      }).should("not.exist")
    })

    it("should navigate to schedule a call with RM process from Get Support Link if RM is not assigned", () => {
      cy.findByLabelText("discussWithExpert")
        .findByRole("button", {
          name: personalisedProposalKeys.discussWithExpert.button.scheduleCall,
        })
        .click({ force: true })
      cy.location("pathname").should("equals", "/schedule-meeting")
    })

    it("should display proposal for user with KSA nationality", () => {
      cy.intercept("/api/user", { fixture: "saudiNationalityUser" }).as("user")

      cy.visit("/personalized-proposal")

      cy.wait([
        "@userProposals",
        "@proposalCapitalDeals",
        "@investmentGoalResponse",
        "@kycStatus",
        "@userSummary",
      ])

      cy.findByLabelText("disclaimer")
        .should(
          "contain.text",
          personalisedProposalKeys.disclaimer.info.text1KSA,
        )
        .within(() => {
          cy.findByRole("button", {
            name: personalisedProposalKeys.disclaimer.links.readMore,
          }).click({ force: true })
        })

      cy.findByRole("dialog").should(
        "contain.text",
        personalisedProposalKeys.disclaimer.info.text1KSA,
      )
      cy.findByRole("dialog").should(
        "contain.text",
        personalisedProposalKeys.disclaimer.info.text8KSA,
      )
    })

    it("should be able to close disclaimer dialog box", () => {
      cy.findByRole("dialog")
        .find("footer")
        .findByRole("button", {
          name: personalisedProposalKeys.disclaimer.buttons.close,
        })
        .click()
      cy.findByRole("dialog").should("not.exist")
    })

    it("should display proposal for user other than KSA nationality", () => {
      cy.visit("/personalized-proposal")

      cy.findByLabelText("disclaimer")
        .should(
          "contain.text",
          personalisedProposalKeys.disclaimer.info.text1NonKSA,
        )
        .within(() => {
          cy.findByRole("button", {
            name: personalisedProposalKeys.disclaimer.links.readMore,
          }).click()
        })

      cy.findByRole("dialog").should(
        "contain.text",
        personalisedProposalKeys.disclaimer.info.text1NonKSA,
      )
      cy.findByRole("dialog").should(
        "contain.text",
        personalisedProposalKeys.disclaimer.info.text8NonKSA,
      )
    })

    it("should be able to close disclaimer dialog box using close icon", () => {
      cy.findByRole("dialog").find("header").findByLabelText("Close").click()
      cy.findByRole("dialog").should("not.exist")
    })
  })

  context.skip(
    "mobile",
    {
      viewportHeight: 844,
      viewportWidth: 390,
    },
    () => {
      it("should able to view last updated date for proposal generated", () => {
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
          "@proposalsStatus",
        ])

        cy.findByRole("heading", {
          name: homeKeys.cta.portfolioCompleted.completedTitle,
        })
          .siblings("p")
          .eq(0)
          .should(
            "have.text",
            `${homeKeys.cta.portfolioCompleted.lastUpdate} ${summaryDetails.lastProposalDate}`,
          )
      })

      it("should able to navigate to the detailed proposal page", () => {
        cy.findByRole("button", {
          name: homeKeys.cta.portfolioCompleted.button.viewDetails,
        }).click()

        cy.location("pathname").should("equal", "/personalized-proposal")
        cy.wait([
          "@userProposals",
          "@investmentGoalResponse",
          "@riskAssessmentResult",
          "@kycStatus",
          "@userSummary",
          "@relationshipManager",
          "@proposalsStatus",
        ])
      })

      it("should see a banner on top with investment goal summary", () => {
        const expectedGoalsSummary =
          personalisedProposalKeys.header.goals.labels[summaryDetails.goal[0]]

        let expectedGoalsCount = undefined

        const expectedTimeHorizon =
          summaryDetails.timeHorizon +
          " " +
          formatYearName(summaryDetails.timeHorizon, "en")
        const expectedInvestmentAMount = formatCurrency(
          summaryDetails.investmentAmount,
        )
        if (summaryDetails.goal.length > 1) {
          expectedGoalsCount = `+${summaryDetails.goal.length - 1}`
        }

        cy.findByLabelText("personalizedProposalSummary")
          .scrollIntoView()
          .within(() => {
            cy.findByText(expectedGoalsSummary).should("be.visible")
            cy.findByText(expectedGoalsCount).should("be.visible")
            cy.findByText(expectedTimeHorizon).should("be.visible")
            cy.findByText(expectedInvestmentAMount).should("be.visible")
            cy.findByText(
              personalisedProposalKeys.header.riskLevel[
                summaryDetails.riskLevel
              ],
            ).should("be.visible")
          })
      })

      it("should see focus of proposal as Capital Yield if it has more allocation", () => {
        let allocationProposalStratergy =
          personalisedProposalKeys.yourAllocation.description.capitalYield.label
        cy.findByRole("heading", {
          name: personalisedProposalKeys.yourAllocation.subHeading,
        })
          .siblings("p")
          .eq(0)
          .should(
            "have.text",
            `${personalisedProposalKeys.yourAllocation.description.startingText} ${allocationProposalStratergy}`,
          )
      })

      it("should see focus of proposal as Capital Growth if it has more allocation", () => {
        const allocationProposalStratergy =
          personalisedProposalKeys.yourAllocation.description.capitalGrowth
            .label

        cy.intercept("/api/user/proposals", {
          fixture: "userProposalWithHighCapitalGrowth",
        }).as("userProposals")

        cy.fixture("userProposalWithHighCapitalGrowth").then((userProposal) => {
          proposalDetails = userProposal[0]
        })

        cy.reload()

        cy.wait([
          "@userProposals",
          "@investmentGoalResponse",
          "@riskAssessmentResult",
          "@kycStatus",
          "@userSummary",
          "@proposalsStatus",
          "@relationshipManager",
        ])

        cy.findByRole("heading", {
          name: personalisedProposalKeys.yourAllocation.subHeading,
        })
          .siblings("p")
          .eq(0)
          .should(
            "have.text",
            `${personalisedProposalKeys.yourAllocation.description.startingText} ${allocationProposalStratergy}`,
          )
      })

      it("should show summary metrics", () => {
        cy.findAllByLabelText("summaryMetrics")
          .eq(0)
          .findByText(
            personalisedProposalKeys.yourAllocation.proposalFacts.expectedReturn
              .label,
          )
          .parent("div")
          .siblings("p")
          .should(
            "have.text",
            `${Number(Number(proposalDetails.expectedReturn) * 100).toFixed(
              1,
            )}%`,
          )

        cy.findAllByLabelText("summaryMetrics")
          .eq(1)
          .findByText(
            personalisedProposalKeys.yourAllocation.proposalFacts.expectedYield
              .label,
          )
          .parent("div")
          .siblings("p")
          .should(
            "have.text",
            `${Number(Number(proposalDetails.expectedYield) * 100).toFixed(
              1,
            )}%`,
          )

        cy.findAllByLabelText("summaryMetrics")
          .eq(2)
          .findByText(
            personalisedProposalKeys.yourAllocation.proposalFacts
              .forecastedVolatility.label,
          )
          .parent("div")
          .siblings("p")
          .should(
            "have.text",
            `${Number(
              Number(proposalDetails.forecastedVolatility) * 100,
            ).toFixed(1)}%`,
          )

        cy.findAllByLabelText("summaryMetrics")
          .eq(3)
          .findByText(
            personalisedProposalKeys.yourAllocation.proposalFacts.sharpeRatio
              .label,
          )
          .parent("div")
          .siblings("p")
          .should(
            "have.text",
            `${Number(proposalDetails.sharpeRatio).toFixed(2)}`,
          )
      })

      it("should show explanation for the terms of summary metrics", () => {
        cy.findAllByLabelText("summaryMetrics")
          .eq(0)
          .findByLabelText("Info icon")
          .scrollIntoView()
          .trigger("mouseover", { force: true })

        cy.findByRole("tooltip").should(
          "contain.text",
          personalisedProposalKeys.yourAllocation.proposalFacts.expectedReturn
            .description,
        )

        cy.findAllByLabelText("summaryMetrics")
          .eq(0)
          .findByLabelText("Info icon")
          .trigger("mouseleave")

        cy.findAllByLabelText("summaryMetrics")
          .eq(1)
          .findByLabelText("Info icon")
          .trigger("mouseover")

        cy.findByRole("tooltip").should(
          "contain.text",
          personalisedProposalKeys.yourAllocation.proposalFacts.expectedYield
            .description,
        )

        cy.findAllByLabelText("summaryMetrics")
          .eq(1)
          .findByLabelText("Info icon")
          .trigger("mouseleave")

        cy.findAllByLabelText("summaryMetrics")
          .eq(2)
          .findByLabelText("Info icon")
          .trigger("mouseover", { force: true })

        cy.findByRole("tooltip").should(
          "contain.text",
          personalisedProposalKeys.yourAllocation.proposalFacts
            .forecastedVolatility.description,
        )

        cy.findAllByLabelText("summaryMetrics")
          .eq(2)
          .findByLabelText("Info icon")
          .trigger("mouseleave")

        cy.findAllByLabelText("summaryMetrics")
          .eq(3)
          .findByLabelText("Info icon")
          .trigger("mouseover", { force: true })

        cy.findByRole("tooltip").should(
          "contain.text",
          personalisedProposalKeys.yourAllocation.proposalFacts.sharpeRatio
            .description,
        )

        cy.findAllByLabelText("summaryMetrics")
          .eq(3)
          .findByLabelText("Info icon")
          .trigger("mouseleave")
      })

      it("should show allocation categories", () => {
        let percentageAllocationOfAbsoluteReturn = Math.round(
          Number(
            proposalDetails.strategies.absoluteReturn.percentageAllocation *
              100,
          ),
        )
        let percentageAllocationOfcapitalYielding = Math.round(
          Number(
            proposalDetails.strategies.capitalYielding.percentageAllocation *
              100,
          ),
        )
        let percentageAllocationOfcapitalGrowth = Math.round(
          Number(
            proposalDetails.strategies.capitalGrowth.percentageAllocation * 100,
          ),
        )
        let percentageAllocationOfopportunistic = Math.round(
          Number(
            proposalDetails.strategies.opportunistic.percentageAllocation * 100,
          ),
        )
        cy.findAllByLabelText("yourAllocations")
          .eq(3)
          .should("contain.text", `${percentageAllocationOfAbsoluteReturn}%`)
          .should(
            "contain.text",
            `${personalisedProposalKeys.yourAllocation.proposalPostulates.absoluteReturn.label}`,
          )
          .should(
            "contain.text",
            `${personalisedProposalKeys.yourAllocation.proposalPostulates.absoluteReturn.description}`,
          )
        cy.findAllByLabelText("yourAllocations")
          .eq(2)
          .should("contain.text", `${percentageAllocationOfcapitalYielding}%`)
          .should(
            "contain.text",
            personalisedProposalKeys.yourAllocation.proposalPostulates
              .capitalYielding.label,
          )
          .should(
            "contain.text",
            `${personalisedProposalKeys.yourAllocation.proposalPostulates.capitalYielding.description}`,
          )
        cy.findAllByLabelText("yourAllocations")
          .eq(0)
          .should("contain.text", `${percentageAllocationOfcapitalGrowth}%`)
          .should(
            "contain.text",
            personalisedProposalKeys.yourAllocation.proposalPostulates
              .capitalGrowth.label,
          )

          .should(
            "contain.text",
            `${personalisedProposalKeys.yourAllocation.proposalPostulates.capitalGrowth.description}`,
          )
        cy.findAllByLabelText("yourAllocations")
          .eq(1)
          .should("contain.text", `${percentageAllocationOfopportunistic}%`)
          .should(
            "contain.text",
            personalisedProposalKeys.yourAllocation.proposalPostulates
              .opportunistic.label,
          )

          .should(
            "contain.text",
            `${personalisedProposalKeys.yourAllocation.proposalPostulates.opportunistic.description}`,
          )
      })

      it("should display allocation details for capital growth", () => {
        cy.intercept("/api/user/proposals", {
          fixture: "userProposalWithHighCapitalGrowth",
        }).as("userProposals")

        cy.fixture("userProposalWithHighCapitalGrowth").then((userProposal) => {
          proposalDetails = userProposal[0]
        })

        let percentageAllocationOfcapitalGrowth = Math.round(
          Number(
            proposalDetails.strategies.capitalGrowth.percentageAllocation * 100,
          ),
        )

        cy.get("a[href='/personalized-proposal/capital-growth']").click({
          force: true,
        })

        cy.location("pathname").should(
          "equal",
          "/personalized-proposal/capital-growth",
        )

        cy.wait(["@proposalCapitalDeals", "@userProposals", "@proposalDeals"])

        cy.findByRole("heading", {
          name: personalisedProposalKeys.yourAllocationDetail.capitalGrowth
            .title,
        }).should("be.visible")

        cy.findByText(
          `${percentageAllocationOfcapitalGrowth}${personalisedProposalKeys.yourAllocationDetail.capitalGrowth.percentageOfAllocation}`,
        ).should("be.visible")

        cy.findByText(
          personalisedProposalKeys.yourAllocationDetail.capitalGrowth
            .capitalGrowthDesc,
        ).should("be.visible")

        cy.findByText(
          personalisedProposalKeys.yourAllocationDetail.capitalGrowth
            .assetClassDesc,
        ).should("be.visible")
      })

      it("should show list of asset classes and deals for capital growth", () => {
        for (let i = 0; i < userProposalsCapitalGrowthDeals.length; i++) {
          cy.findAllByLabelText("assetClass")
            .eq(i)
            .within(() => {
              let activeDealText =
                userProposalsCapitalGrowthDeals[i].assets.length > 1
                  ? personalisedProposalKeys.yourAllocationDetail.gridData
                      .activeDeals
                  : personalisedProposalKeys.yourAllocationDetail.gridData
                      .activeDeal
              cy.findByRole("button")
                .should(
                  "contain.text",
                  userProposalsCapitalGrowthDeals[i].assetClass,
                )
                .should(
                  "contain.text",
                  `${userProposalsCapitalGrowthDeals[i].assets.length} ${activeDealText}`,
                )
                .click()

              cy.findByRole("region").should(
                "contain.text",
                personalisedProposalKeys.yourAllocationDetail.gridData[
                  getDealDescription(
                    <PROPOSAL_ASSETCLASS_LIST>(
                      userProposalsCapitalGrowthDeals[i].assetClass
                    ),
                  )
                ],
              )
              // headers for deals in asset classes
              cy.findByRole("table")
                .find("thead")
                .findByRole("row")
                .within(() => {
                  cy.findByText(
                    personalisedProposalKeys.yourAllocationDetail.tableHeaders
                      .dealName,
                  ).should("be.visible")
                  cy.findByText(
                    personalisedProposalKeys.yourAllocationDetail.tableHeaders
                      .expectedReturn,
                  ).should("be.visible")
                  cy.findByLabelText("Info icon").trigger("mouseover")
                })

              for (
                let j = 0;
                j < userProposalsCapitalGrowthDeals[i].assets.length;
                j++
              ) {
                //deals in asset classes
                cy.findByRole("table")
                  .find("tbody")
                  .findAllByRole("row")
                  .eq(j)
                  .within(() => {
                    cy.findByRole("gridcell", {
                      name: userProposalsCapitalGrowthDeals[i].assets[j].title,
                    })
                    cy.findByRole("gridcell", {
                      name: userProposalsCapitalGrowthDeals[i].assets[j]
                        .expectedReturn,
                    })
                  })
              }
            })

          cy.findByText(
            personalisedProposalKeys.yourAllocationDetail.tableHeaders
              .targetReturnToolTipText,
          ).should("be.visible")
        }
      })

      it("should be able to view detailed deal information", () => {
        cy.findAllByLabelText("assetClass")
          .eq(0)
          .within(() => {
            cy.findByRole("button").click()
            //deals in asset classes
            cy.findByRole("table")
              .find("tbody")
              .findAllByRole("row")
              .eq(0)
              .within(() => {
                cy.findByRole("gridcell", {
                  name: personalisedProposalKeys.yourAllocationDetail.gridData
                    .more,
                }).click()
              })
          })

        cy.findByLabelText("detailedDealInfoModal").within(() => {
          cy.findAllByLabelText("breakdown")
            .eq(0)
            .should(
              "contain.text",
              personalisedProposalKeys.yourAllocationDetail.gridPostulates
                .assetManager,
            )
            .siblings("p")
            .should("contain.text", proposalDealInfo.sponsor)
          cy.findAllByLabelText("breakdown")
            .eq(1)
            .should(
              "contain.text",
              personalisedProposalKeys.yourAllocationDetail.gridPostulates
                .assetClass,
            )
            .siblings("p")
            .should("contain.text", proposalDealInfo.assetClass)
          cy.findAllByLabelText("breakdown")
            .eq(2)
            .should(
              "contain.text",
              personalisedProposalKeys.yourAllocationDetail.gridPostulates
                .sector,
            )
            .siblings("p")
            .should("contain.text", proposalDealInfo.sector)
          cy.findAllByLabelText("breakdown")
            .eq(3)
            .should(
              "contain.text",
              personalisedProposalKeys.yourAllocationDetail.gridPostulates
                .expectedExit,
            )
            .siblings("p")
            .should("contain.text", proposalDealInfo.expectedExit)
          cy.findAllByLabelText("breakdown")
            .eq(4)
            .should(
              "contain.text",
              personalisedProposalKeys.yourAllocationDetail.gridPostulates
                .expectedReturn,
            )
            .siblings("p")
            .should("contain.text", proposalDealInfo.expectedReturn)
          cy.findAllByLabelText("breakdown")
            .eq(5)
            .should(
              "contain.text",
              personalisedProposalKeys.yourAllocationDetail.gridPostulates
                .country,
            )
            .siblings("p")
            .should("contain.text", proposalDealInfo.country)
        })
      })

      it("should view the tooltip for Expected Return", () => {
        cy.findByLabelText("detailedDealInfoModal")
          .findByLabelText("infoIcon")
          .trigger("mouseover")

        let toolTipText = String(
          personalisedProposalKeys.yourAllocationDetail.tooltip.expectedReturn,
        ).split("\n")

        cy.findByRole("tooltip")
          .should("contain.text", toolTipText[0])
          .should("contain.text", toolTipText[2])
      })

      it("should able to close detailed deal modal", () => {
        cy.findByLabelText("closeIcon").click()
        cy.findByLabelText("detailedDealInfoModal").should("not.exist")
      })

      it("should be able to navigate back personalized proposal screen", () => {
        cy.intercept("/api/user/proposals", {
          fixture: "userProposalWithHighCapitalGrowth",
        }).as("userProposals")
        cy.findByRole("button", { name: commonKeys.button.back }).click()
        cy.location("pathname").should("equal", "/personalized-proposal")
        cy.wait([
          "@userProposals",
          "@investmentGoalResponse",
          "@riskAssessmentResult",
          "@kycStatus",
          "@userSummary",
          "@proposalsStatus",
          "@relationshipManager",
        ])
      })

      it("should display allocation details for capital yield", () => {
        cy.fixture("userProposalWithHighCapitalGrowth").then((userProposal) => {
          proposalDetails = userProposal[0]
        })

        let percentageOfAllocation = Math.round(
          Number(
            proposalDetails.strategies.capitalYielding.percentageAllocation *
              100,
          ),
        )

        cy.get("a[href='/personalized-proposal/capital-yielding']").click({
          force: true,
        })

        cy.wait(["@proposalCapitalYieldDeals", "@proposalDeals"])

        cy.findByRole("heading", {
          name: personalisedProposalKeys.yourAllocationDetail.capitalYielding
            .title,
        }).should("be.visible")
        cy.findByText(
          `${percentageOfAllocation}${personalisedProposalKeys.yourAllocationDetail.capitalYielding.percentageOfAllocation}`,
        ).should("be.visible")

        cy.findByText(
          personalisedProposalKeys.yourAllocationDetail.capitalYielding
            .capitalYieldingDesc,
        ).should("be.visible")

        cy.findByText(
          personalisedProposalKeys.yourAllocationDetail.capitalYielding
            .assetClassDesc,
        ).should("be.visible")
      })

      it("should show list of asset classes and deals for capital yield", () => {
        for (let i = 0; i < userProposalsCapitalYieldDeals.length; i++) {
          cy.findAllByLabelText("assetClass")
            .eq(i)
            .within(() => {
              let activeDealText =
                userProposalsCapitalYieldDeals[i].assets.length > 1
                  ? personalisedProposalKeys.yourAllocationDetail.gridData
                      .activeDeals
                  : personalisedProposalKeys.yourAllocationDetail.gridData
                      .activeDeal
              cy.findByRole("button")
                .should(
                  "contain.text",
                  userProposalsCapitalYieldDeals[i].assetClass,
                )
                .should(
                  "contain.text",
                  `${userProposalsCapitalYieldDeals[i].assets.length} ${activeDealText}`,
                )
                .click()

              // will uncomment this once bug 6035 is resolved

              // cy.findByRole("region").should(
              //   "contain.text",
              //   personalisedProposalKeys.yourAllocationDetail.gridData[
              //     getDealDescription(
              //       <PROPOSAL_ASSETCLASS_LIST>(
              //         userProposalsCapitalYieldDeals[i].assetClass
              //       ),
              //     )
              //   ],
              // )

              // headers for deals in asset classes
              cy.findByRole("table")
                .find("thead")
                .findByRole("row")
                .within(() => {
                  cy.findByText(
                    personalisedProposalKeys.yourAllocationDetail.tableHeaders
                      .dealName,
                  ).should("be.visible")

                  cy.findByText(
                    personalisedProposalKeys.yourAllocationDetail.tableHeaders
                      .expectedReturn,
                  ).should("be.visible")

                  cy.findAllByLabelText("Info icon").eq(0).trigger("mouseover")

                  cy.root()
                    .parents("body")
                    .findByText(
                      personalisedProposalKeys.yourAllocationDetail.tableHeaders
                        .targetReturnToolTipText,
                    )
                    .should("be.visible")
                  cy.findAllByLabelText("Info icon").eq(0).trigger("mouseleave")
                })

              for (
                let j = 0;
                j < userProposalsCapitalYieldDeals[i].assets.length;
                j++
              ) {
                //deals in asset classes
                cy.findByRole("table")
                  .find("tbody")
                  .findAllByRole("row")
                  .eq(j)
                  .within(() => {
                    cy.findByRole("gridcell", {
                      name: userProposalsCapitalYieldDeals[i].assets[j].title,
                    })
                    cy.findByRole("gridcell", {
                      name: userProposalsCapitalYieldDeals[i].assets[j]
                        .expectedReturn,
                    })
                  })
              }
            })
        }
      })

      it("should be able to navigate back personalized proposal screen", () => {
        cy.intercept("/api/user/proposals", {
          fixture: "userProposalWithHighCapitalGrowth",
        }).as("userProposals")
        cy.findByRole("button", { name: commonKeys.button.back }).click()
        cy.location("pathname").should("equal", "/personalized-proposal")
        cy.wait([
          "@userProposals",
          "@investmentGoalResponse",
          "@riskAssessmentResult",
          "@kycStatus",
          "@userSummary",
          "@proposalsStatus",
          "@relationshipManager",
        ])
      })

      it("should display allocation details for opportunistic", () => {
        cy.findByRole("tab", {
          name: personalisedProposalKeys.yourAllocationDetail.tabHeaders
            .opportunistic,
        }).click()

        let percentageOfAllocation = Math.round(
          Number(
            proposalDetails.strategies.opportunistic.percentageAllocation * 100,
          ),
        )
        cy.findAllByRole("tabpanel")
          .eq(0)
          .within(() => {
            cy.get("svg").should("be.visible")
            cy.findByRole("heading", {
              name: personalisedProposalKeys.yourAllocationDetail.opportunistic
                .title,
            }).should("be.visible")
            cy.findByText(
              `${percentageOfAllocation}${personalisedProposalKeys.yourAllocationDetail.opportunistic.percentageOfAllocation}`,
            ).should("be.visible")

            cy.findByText(
              personalisedProposalKeys.yourAllocationDetail.opportunistic
                .opportunisticDescription,
            ).should("be.visible")
          })
      })

      it("should display accordions for funds in opportunistic", () => {
        for (let i = 0; i < userProposalsOpportunisticDeals.length; i++) {
          cy.findByRole("tabpanel")
            .findAllByLabelText("fundsAccordion")
            .eq(i)
            .within(() => {
              for (
                let j = 0;
                j < userProposalsOpportunisticDeals[i].assets.length;
                j++
              ) {
                cy.findByRole("button")
                  .should(
                    "contain.text",
                    userProposalsOpportunisticDeals[i].assets[j].title,
                  )
                  .click()

                cy.findByRole("region")
                  .should(
                    "contain.text",
                    userProposalsOpportunisticDeals[i].assets[j].description,
                  )
                  .within(() => {
                    cy.findByText(
                      personalisedProposalKeys.yourAllocationDetail
                        .absoluteReturnOpportunisticDetail.heading,
                    )

                    cy.findAllByLabelText("assets")
                      .eq(0)
                      .should(
                        "contain.text",
                        userProposalsOpportunisticDeals[i].assets[j]
                          .targetReturn,
                      )
                      .should(
                        "contain.text",
                        personalisedProposalKeys.yourAllocationDetail
                          .absoluteReturnOpportunisticDetail.labels
                          .targetReturn,
                      )
                      .findByLabelText("Info icon")
                      .trigger("mouseover")

                    cy.root()
                      .parents("body")
                      .findByText(
                        personalisedProposalKeys.yourAllocationDetail
                          .absoluteReturnOpportunisticDetail.tooltip
                          .targetReturn,
                      )
                      .should("be.visible")

                    cy.findAllByLabelText("assets")
                      .eq(0)
                      .findByLabelText("Info icon")
                      .trigger("mouseleave")
                  })

                cy.findAllByLabelText("assets")
                  .eq(1)
                  .should(
                    "contain.text",
                    userProposalsOpportunisticDeals[i].assets[j].targetYield,
                  )
                  .should(
                    "contain.text",
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.labels.targetYield,
                  )
                  .findByLabelText("Info icon")
                  .trigger("mouseover")

                cy.root()
                  .parents("body")
                  .findByText(
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.tooltip.targetYield,
                  )
                  .should("be.visible")

                cy.findAllByLabelText("assets")
                  .eq(1)
                  .findByLabelText("Info icon")
                  .trigger("mouseleave")

                cy.findAllByLabelText("assets")
                  .eq(2)
                  .should(
                    "contain.text",
                    userProposalsOpportunisticDeals[i].assets[j].fundTerm,
                  )
                  .should(
                    "contain.text",
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.labels.fundTerm,
                  )
                  .findByLabelText("Info icon")
                  .trigger("mouseover")

                cy.root()
                  .parents("body")
                  .findByText(
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.tooltip.fundTerm,
                  )
                  .should("be.visible")

                cy.findAllByLabelText("assets")
                  .eq(2)
                  .findByLabelText("Info icon")
                  .trigger("mouseleave")

                cy.findAllByLabelText("assets")
                  .eq(3)
                  .should(
                    "contain.text",
                    userProposalsOpportunisticDeals[i].assets[j].offeringPeriod,
                  )
                  .should(
                    "contain.text",
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.labels
                      .initialOfferingPeriod,
                  )
                  .findByLabelText("Info icon")
                  .trigger("mouseover")

                cy.root()
                  .parents("body")
                  .findByText(
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.tooltip
                      .initialOfferingPeriod,
                  )
                  .should("be.visible")

                cy.findAllByLabelText("assets")
                  .eq(3)
                  .findByLabelText("Info icon")
                  .trigger("mouseleave")

                cy.findAllByLabelText("assets")
                  .eq(4)
                  .should(
                    "contain.text",
                    userProposalsOpportunisticDeals[i].assets[j].administrator,
                  )
                  .should(
                    "contain.text",
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.labels.administrator,
                  )

                cy.findAllByLabelText("assets")
                  .eq(5)
                  .should(
                    "contain.text",
                    userProposalsOpportunisticDeals[i].assets[j].auditor,
                  )
                  .should(
                    "contain.text",
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.labels.auditor,
                  )

                const assetClassValue: String =
                  userProposalsOpportunisticDeals[i].assets[j].assetClass

                cy.findAllByLabelText("assets")
                  .eq(6)
                  .should(
                    "contain.text",
                    assetClassValue.length > 0 ? assetClassValue : "-".trim(),
                  )
                  .should(
                    "contain.text",
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.labels.assetClasses,
                  )

                cy.findAllByLabelText("assets")
                  .eq(7)
                  .should(
                    "contain.text",
                    userProposalsOpportunisticDeals[i].assets[j].shareClasses,
                  )
                  .should(
                    "contain.text",
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.labels.shareClasses,
                  )
                  .findByLabelText("Info icon")
                  .trigger("mouseover")

                cy.root()
                  .parents("body")
                  .findByText(
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.tooltip.shareClass,
                  )
                  .should("be.visible")

                cy.findAllByLabelText("assets")
                  .eq(7)
                  .findByLabelText("Info icon")
                  .trigger("mouseleave")

                cy.findAllByLabelText("assets")
                  .eq(8)
                  .should(
                    "contain.text",
                    userProposalsOpportunisticDeals[i].assets[j].redemptions,
                  )
                  .should(
                    "contain.text",
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.labels.redemptions,
                  )
                  .findByLabelText("Info icon")
                  .trigger("mouseover")

                cy.root()
                  .parents("body")
                  .findByText(
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.tooltip.redemption,
                  )
                  .should("be.visible")

                cy.findAllByLabelText("assets")
                  .eq(8)
                  .findByLabelText("Info icon")
                  .trigger("mouseleave")
              }
            })
        }
      })

      it("should display allocation details for absolute return", () => {
        cy.findByRole("tab", {
          name: personalisedProposalKeys.yourAllocationDetail.tabHeaders
            .absoluteReturn,
        }).click()

        let percentageOfAllocation = Math.round(
          Number(
            proposalDetails.strategies.absoluteReturn.percentageAllocation *
              100,
          ),
        )
        cy.findAllByRole("tabpanel")
          .eq(0)
          .within(() => {
            cy.get("svg").should("be.visible")
            cy.findByRole("heading", {
              name: personalisedProposalKeys.yourAllocationDetail.absoluteReturn
                .title,
            }).should("be.visible")
            cy.findByText(
              `${percentageOfAllocation}${personalisedProposalKeys.yourAllocationDetail.absoluteReturn.percentageOfAllocation}`,
            ).should("be.visible")

            cy.findByText(
              personalisedProposalKeys.yourAllocationDetail.absoluteReturn
                .absoluteReturnDescription,
            ).should("be.visible")
          })
      })

      it("should display accordions for funds in absolute return", () => {
        for (let i = 0; i < userProposalsAbsoluteReturnDeals.length; i++) {
          cy.findByRole("tabpanel")
            .findAllByLabelText("fundsAccordion")
            .eq(i)
            .within(() => {
              for (
                let j = 0;
                j < userProposalsAbsoluteReturnDeals[i].assets.length;
                j++
              ) {
                cy.findByRole("button")
                  .should(
                    "contain.text",
                    userProposalsAbsoluteReturnDeals[i].assets[j].title,
                  )
                  .click()

                cy.findByRole("region")
                  .should(
                    "contain.text",
                    userProposalsAbsoluteReturnDeals[i].assets[j].description,
                  )
                  .within(() => {
                    cy.findByText(
                      personalisedProposalKeys.yourAllocationDetail
                        .absoluteReturnOpportunisticDetail.heading,
                    )

                    cy.findAllByLabelText("assets")
                      .eq(0)
                      .should(
                        "contain.text",
                        userProposalsAbsoluteReturnDeals[i].assets[j]
                          .targetReturn,
                      )
                      .should(
                        "contain.text",
                        personalisedProposalKeys.yourAllocationDetail
                          .absoluteReturnOpportunisticDetail.labels
                          .targetReturn,
                      )
                      .findByLabelText("Info icon")
                      .trigger("mouseover")

                    cy.root()
                      .parents("body")
                      .findByText(
                        personalisedProposalKeys.yourAllocationDetail
                          .absoluteReturnOpportunisticDetail.tooltip
                          .targetReturn,
                      )
                      .should("be.visible")

                    cy.findAllByLabelText("assets")
                      .eq(0)
                      .findByLabelText("Info icon")
                      .trigger("mouseleave")
                  })

                cy.findAllByLabelText("assets")
                  .eq(1)
                  .should(
                    "contain.text",
                    userProposalsAbsoluteReturnDeals[i].assets[j].targetYield,
                  )
                  .should(
                    "contain.text",
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.labels.targetYield,
                  )
                  .findByLabelText("Info icon")
                  .trigger("mouseover")

                cy.root()
                  .parents("body")
                  .findByText(
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.tooltip.targetYield,
                  )
                  .should("be.visible")

                cy.findAllByLabelText("assets")
                  .eq(1)
                  .findByLabelText("Info icon")
                  .trigger("mouseleave")

                cy.findAllByLabelText("assets")
                  .eq(2)
                  .should(
                    "contain.text",
                    userProposalsAbsoluteReturnDeals[i].assets[j].fundTerm,
                  )
                  .should(
                    "contain.text",
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.labels.fundTerm,
                  )
                  .findByLabelText("Info icon")
                  .trigger("mouseover")

                cy.root()
                  .parents("body")
                  .findByText(
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.tooltip.fundTerm,
                  )
                  .should("be.visible")

                cy.findAllByLabelText("assets")
                  .eq(2)
                  .findByLabelText("Info icon")
                  .trigger("mouseleave")

                cy.findAllByLabelText("assets")
                  .eq(3)
                  .should(
                    "contain.text",
                    userProposalsAbsoluteReturnDeals[i].assets[j]
                      .offeringPeriod,
                  )
                  .should(
                    "contain.text",
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.labels
                      .initialOfferingPeriod,
                  )
                  .findByLabelText("Info icon")
                  .trigger("mouseover")

                cy.root()
                  .parents("body")
                  .findByText(
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.tooltip
                      .initialOfferingPeriod,
                  )
                  .should("be.visible")

                cy.findAllByLabelText("assets")
                  .eq(3)
                  .findByLabelText("Info icon")
                  .trigger("mouseleave")

                cy.findAllByLabelText("assets")
                  .eq(4)
                  .should(
                    "contain.text",
                    userProposalsAbsoluteReturnDeals[i].assets[j].administrator,
                  )
                  .should(
                    "contain.text",
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.labels.administrator,
                  )

                cy.findAllByLabelText("assets")
                  .eq(5)
                  .should(
                    "contain.text",
                    userProposalsAbsoluteReturnDeals[i].assets[j].auditor,
                  )
                  .should(
                    "contain.text",
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.labels.auditor,
                  )

                const assetClassValue: String =
                  userProposalsAbsoluteReturnDeals[i].assets[j].assetClass

                cy.findAllByLabelText("assets")
                  .eq(6)
                  .should(
                    "contain.text",
                    assetClassValue.length > 0 ? assetClassValue : "-".trim(),
                  )
                  .should(
                    "contain.text",
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.labels.assetClasses,
                  )

                cy.findAllByLabelText("assets")
                  .eq(7)
                  .should(
                    "contain.text",
                    userProposalsAbsoluteReturnDeals[i].assets[j].shareClasses,
                  )
                  .should(
                    "contain.text",
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.labels.shareClasses,
                  )
                  .findByLabelText("Info icon")
                  .trigger("mouseover")

                cy.root()
                  .parents("body")
                  .findByText(
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.tooltip.shareClass,
                  )
                  .should("be.visible")

                cy.findAllByLabelText("assets")
                  .eq(7)
                  .findByLabelText("Info icon")
                  .trigger("mouseleave")

                cy.findAllByLabelText("assets")
                  .eq(8)
                  .should(
                    "contain.text",
                    userProposalsAbsoluteReturnDeals[i].assets[j].redemptions,
                  )
                  .should(
                    "contain.text",
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.labels.redemptions,
                  )
                  .findByLabelText("Info icon")
                  .trigger("mouseover")

                cy.root()
                  .parents("body")
                  .findByText(
                    personalisedProposalKeys.yourAllocationDetail
                      .absoluteReturnOpportunisticDetail.tooltip.redemption,
                  )
                  .should("be.visible")

                cy.findAllByLabelText("assets")
                  .eq(8)
                  .findByLabelText("Info icon")
                  .trigger("mouseleave")
              }
            })
        }
      })

      it("should show How your investment will work section", () => {
        cy.findAllByRole(
          "heading",
          personalisedProposalKeys.investmentWork.heading,
        )
          .eq(0)
          .scrollIntoView()
          .should("be.visible")

        cy.findByText(
          personalisedProposalKeys.investmentWork.labels.deploymentSchedule,
        )
          .scrollIntoView()
          .should("be.visible")

        cy.findByText(
          personalisedProposalKeys.investmentWork.labels.totalCommitted,
        )
          .siblings("p")
          .should("have.text", formatCurrency(proposalDetails.totalCommitted))

        cy.findByText(
          personalisedProposalKeys.investmentWork.labels.yearsToFullyDeploy,
        )
          .siblings("p")
          .should("have.text", proposalDetails.graphData.length)
      })

      // bug raised as pop up not visible on mobile screen

      it.skip("should open pop up for expert advice", () => {
        cy.findByRole("dialog")
          .findByText(personalisedProposalKeys.footer.popover.header)
          .should("be.visible")
      })

      // bug raised as pop up not visible on mobile screen
      it.skip("should navigate to schedule a call with RM process from a help pop up module", () => {
        cy.findByRole("dialog")
          .findByText(
            personalisedProposalKeys.footer.popover.button.scheduleCall,
          )
          .click()

        cy.location("pathname").should("equals", "/schedule-meeting")
      })

      it("should show year-wise deployment in tabular form", () => {
        cy.viewport("iphone-x", "landscape")
        cy.visit("/personalized-proposal")
        cy.fixture("userProposals").then((userProposal) => {
          proposalDetails = userProposal[0]
        })
        cy.wait([
          "@userProposals",
          "@proposalCapitalDeals",
          "@investmentGoalResponse",
          "@riskAssessmentResult",
          "@proposalDeals",
        ])
        let totalColumns = 0
        let totalDeploymentYearWise = [0, 0, 0]
        cy.findAllByRole("row").then((rows) => {
          cy.wrap(rows[0]).within((headerRow) => {
            totalColumns = headerRow.find("th").length
            cy.findByText(
              personalisedProposalKeys.investmentWork.chart.strategyName,
            )
              .scrollIntoView()
              .should("be.visible")
            cy.findByText(
              personalisedProposalKeys.investmentWork.chart.totalAmount,
            ).should("be.visible")
            cy.findByText(
              personalisedProposalKeys.investmentWork.chart.portfolioPercent,
            ).should("be.visible")
            for (let i = 1; i <= proposalDetails.graphData.length; i++) {
              cy.findByText(
                personalisedProposalKeys.investmentWork.chart[`year${i}`],
              ).should("be.visible")
            }
          })

          for (let stragtergyRow = 1; stragtergyRow < 5; stragtergyRow++) {
            let strategy: StrategiesType
            if (stragtergyRow == 1) {
              strategy = StrategiesType.CapitalYielding
            } else if (stragtergyRow == 2) {
              strategy = StrategiesType.CapitalGrowth
            } else if (stragtergyRow == 3) {
              strategy = StrategiesType.Opportunistic
            } else if (stragtergyRow == 4) {
              strategy = StrategiesType.AbsoluteReturn
            }
            cy.wrap(rows[stragtergyRow]).within(() => {
              let totalDeploymentStratergyWise = 0
              cy.findAllByRole("gridcell").then((tableCells) => {
                expect(tableCells[0]).to.have.text(
                  personalisedProposalKeys.investmentWork.legends[strategy],
                )

                for (let i = 0; i < proposalDetails.graphData.length; i++) {
                  expect(tableCells[i + 1]).to.have.text(
                    "$" +
                      nFormatter(
                        proposalDetails.strategies[strategy].deploymentYears[i],
                        2,
                      ),
                  )
                  totalDeploymentStratergyWise =
                    totalDeploymentStratergyWise +
                    proposalDetails.strategies[strategy].deploymentYears[i]

                  totalDeploymentYearWise[i] =
                    totalDeploymentYearWise[i] +
                    proposalDetails.strategies[strategy].deploymentYears[i]
                }

                expect(tableCells[totalColumns - 2]).to.have.text(
                  "$" + nFormatter(totalDeploymentStratergyWise, 2),
                )

                expect(tableCells[totalColumns - 1]).to.have.text(
                  `${(
                    proposalDetails.strategies[strategy].percentageAllocation *
                    100
                  ).toFixed(0)}%`,
                )
              })
            })
          }

          cy.wrap(rows[5]).within(() => {
            cy.findByText(personalisedProposalKeys.investmentWork.chart.total)
              .scrollIntoView()
              .should("be.visible")

            for (let i = 0; i < proposalDetails.graphData.length; i++) {
              cy.findByText(
                "$" + nFormatter(totalDeploymentYearWise[i], 2),
              ).should("be.visible")
            }

            cy.findByText(
              "$" +
                nFormatter(
                  totalDeploymentYearWise.reduce((a, b) => a + b, 0),
                  0,
                ),
            )

            cy.findByText("100%").should("be.visible")
          })
        })
      })

      it("should show projected earnings", () => {
        cy.findByLabelText("earningsHeading").should(
          "have.text",
          personalisedProposalKeys.earnings.heading,
        )
        cy.findByLabelText("earningsSubheading").should(
          "have.text",
          personalisedProposalKeys.earnings.subheading,
        )
      })

      it("should show statistics of The Family Office’s historical performance in distressed market conditions", () => {
        cy.visit("/personalized-proposal")
        cy.wait([
          "@userProposals",
          "@investmentGoalResponse",
          "@riskAssessmentResult",
          "@kycStatus",
          "@userSummary",
          "@relationshipManager",
          "@proposalsStatus",
          "@user",
        ])
        cy.findByLabelText("crisisLegends")
          .should(
            "contain.text",
            personalisedProposalKeys.investingWithTFO.chart.legends.sp500,
          )
          .should(
            "contain.text",
            personalisedProposalKeys.investingWithTFO.chart.legends.nikkei,
          )
          .should(
            "contain.text",
            personalisedProposalKeys.investingWithTFO.chart.legends.euroStoxx,
          )
          .should(
            "contain.text",
            personalisedProposalKeys.investingWithTFO.chart.legends.tfo,
          )
        cy.findByLabelText("financialCrisis")
          .scrollIntoView()
          .within(() => {
            cy.findByText(
              personalisedProposalKeys.investingWithTFO.chart.labels
                .financialCrisis,
            ).should("be.visible")
            cy.findByLabelText("barChart")
              .scrollIntoView()
              .should("have.length.greaterThan", 0)
              .should("be.visible")
          })
        cy.findByLabelText("rightCarousal")
          .scrollIntoView()
          .click({ force: true })
        cy.findByLabelText("europeanDebtCrisis")
          .scrollIntoView()
          .within(() => {
            cy.findByText(
              personalisedProposalKeys.investingWithTFO.chart.labels
                .europeanDebtCrisis,
            ).should("be.visible")
            cy.findByLabelText("barChart")
              .should("have.length.greaterThan", 0)
              .find("svg")
              .scrollIntoView()
              .should("be.visible")
          })
        // cy.findByLabelText("rightCarousal")
        //   .scrollIntoView()
        //   .click({ force: true })

        // cy.findByLabelText("coronavirusPandemic")
        //   .scrollIntoView()
        //   .within(() => {
        //     cy.findByText(
        //       personalisedProposalKeys.investingWithTFO.chart.labels
        //         .coronavirusPandemic,
        //     ).should("be.visible")
        //     cy.findByLabelText("barChart")
        //       .scrollIntoView()
        //       .should("have.length.greaterThan", 0)
        //       .should("be.visible")
        //   })
      })

      it("should navigate user back to dashboard on clicking Save& exit CTA", () => {
        cy.findByRole("link", { name: commonKeys.button.saveAndExit }).click()
        cy.location("pathname").should("equal", "/")
      })

      it("should open get Support pop up window from Get Support Link", () => {
        cy.visit("/personalized-proposal")

        cy.findByRole("button", { name: commonKeys.help.link.support }).click()
        cy.findByRole("button", {
          name: supportKeys.card.talkWithExperts.title,
        }).should("be.visible")

        cy.findByRole("button", { name: commonKeys.button.close }).click()
        cy.wait("@proposalDeals")
      })

      it("should navigate to schedule a call with RM process from Get Support Link if RM is not assigned", () => {
        cy.findByRole("button", {
          name: personalisedProposalKeys.discussWithExpert.button.scheduleCall,
        }).click()
        cy.location("pathname").should("equals", "/schedule-meeting")
      })

      it("should display proposal for user with KSA nationality", () => {
        cy.intercept("/api/user", { fixture: "saudiNationalityUser" })

        cy.visit("/personalized-proposal")

        cy.wait([
          "@userProposals",
          "@proposalCapitalDeals",
          "@investmentGoalResponse",
          "@proposalDeals",
          "@kycStatus",
          "@userSummary",
        ])

        cy.findByLabelText("disclaimer")
          .should(
            "contain.text",
            personalisedProposalKeys.disclaimer.info.text1KSA,
          )
          .within(() => {
            cy.findByRole("button", {
              name: personalisedProposalKeys.disclaimer.links.readMore,
            }).click()
          })

        cy.findByRole("dialog").should(
          "contain.text",
          personalisedProposalKeys.disclaimer.info.text1KSA,
        )
        cy.findByRole("dialog").should(
          "contain.text",
          personalisedProposalKeys.disclaimer.info.text8KSA,
        )
      })

      it("should be able to close disclaimer dialog box", () => {
        cy.findByRole("dialog")
          .find("footer")
          .findByRole("button", {
            name: personalisedProposalKeys.disclaimer.buttons.close,
          })
          .click()
        cy.findByRole("dialog").should("not.exist")
      })

      it("should display proposal for user other than KSA nationality", () => {
        cy.visit("/personalized-proposal")

        cy.findByLabelText("disclaimer")
          .should(
            "contain.text",
            personalisedProposalKeys.disclaimer.info.text1NonKSA,
          )
          .within(() => {
            cy.findByRole("button", {
              name: personalisedProposalKeys.disclaimer.links.readMore,
            }).click()
          })

        cy.findByRole("dialog").should(
          "contain.text",
          personalisedProposalKeys.disclaimer.info.text1NonKSA,
        )
        cy.findByRole("dialog").should(
          "contain.text",
          personalisedProposalKeys.disclaimer.info.text8NonKSA,
        )
      })

      it("should be able to close disclaimer dialog box using close icon", () => {
        cy.findByRole("dialog").find("header").findByLabelText("Close").click()
        cy.findByRole("dialog").should("not.exist")
      })
    },
  )
})

function getDealDescription(assetClass: PROPOSAL_ASSETCLASS_LIST): string {
  switch (assetClass) {
    case PROPOSAL_ASSETCLASS_LIST.REAL_ESTATE:
      return "capitalGrowthRealStateDesc"
    case PROPOSAL_ASSETCLASS_LIST.LEASEBACK:
      return "capitalYieldingLeasebackDesc"
    case PROPOSAL_ASSETCLASS_LIST.PRIVATE_CREDIT:
      return "capitalGrowthPrivateCreditDesc"
    case PROPOSAL_ASSETCLASS_LIST.PRIVATE_EQUITY:
      return "capitalGrowthPrivateEquityDesc"

    default:
      return ""
  }
}
