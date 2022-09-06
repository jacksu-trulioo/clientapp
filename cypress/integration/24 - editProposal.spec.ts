import {
  AdditionalPreference,
  InvestmentGoal,
  InvestorProfileGoals,
  PortfolioOwner,
  RiskAssessmentScore,
} from "../../src/services/mytfo/types"
import { formatCurrencyWithCommas } from "../../src/utils/formatCurrency"

describe("Edit proposal: As a user who completed the pre-proposal journey and is qualified, would be able to see two proposal", () => {
  let personalisedProposalKeys
  let selectedOption: number
  let proposalKeys
  let commonKeys
  let investmentGoalDetails: InvestorProfileGoals
  let riskAssessmentScore: RiskAssessmentScore

  before(() => {
    cy.fixture("../../public/locales/en/personalizedProposal").then((keys) => {
      personalisedProposalKeys = keys
    })

    cy.fixture("investmentGoalCompletedResponse").then(
      (investmentGoalCompletedResponse) => {
        investmentGoalDetails = investmentGoalCompletedResponse
      },
    )

    cy.fixture("retakeRiskAssessmentResult").then(
      (riskAssessmentScoreResponse) => {
        riskAssessmentScore = riskAssessmentScoreResponse
      },
    )

    cy.fixture("../../public/locales/en/proposal").then((keys) => {
      proposalKeys = keys
    })

    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
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

    cy.intercept("/api/user/investment-goals", {
      fixture: "investmentGoalCompletedResponse",
    }).as("investmentGoalResponse")

    cy.intercept("/api/user/proposals/status", {
      fixture: "proposalsStatusGenerated",
    }).as("proposalsStatus")

    cy.intercept("/api/user/kyc/status", {
      fixture: "kycNotStarted",
    }).as("kycStatus")

    cy.intercept("/api/user/proposals", { fixture: "userProposals" }).as(
      "userProposals",
    )

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

    cy.intercept("/api/user/preference", {
      fixture: "userPreferenceENDefault",
    }).as("userPreference")

    cy.intercept("/api/user/risk-assessment/retake-result", {
      fixture: "retakeRiskAssessmentResult",
    }).as("retakeRiskAssessmentResult")

    cy.intercept("/api/user/retake-risk-assessment", {
      fixture: "retakeRiskAssessmentResult",
    }).as("retakeRiskAssessmentResult")
  })

  context("desktop", () => {
    it("should autofill user preproposal response", () => {
      cy.visit("/personalized-proposal")

      cy.wait([
        "@userPreference",
        "@userSummary",
        "@userProposals",
        "@user",
        "@proposalsStatus",
        "@kycStatus",
        "@investmentGoalResponse",
        "@retakeRiskAssessmentResult",
        "@proposalCapitalDeals",
      ])

      cy.findByRole("button", {
        name: personalisedProposalKeys.header.button.editDetails,
      }).click()

      cy.findAllByLabelText("editProposalModal")
        .eq(1)
        .within(() => {
          cy.findByRole("group", { name: "whoIsPortfolioFor" }).should(
            "contains.text",
            investmentGoalDetails.whoIsPortfolioFor,
          )

          cy.findByLabelText("investmentGoals").within(() => {
            investmentGoalDetails.investmentGoals.forEach((goal) => {
              cy.findByText(goal).should("be.visible")
            })
          })

          cy.findByLabelText("Time horizon slider").should(
            "contains.text",
            investmentGoalDetails.investmentDurationInYears,
          )

          cy.findByLabelText("additionalPreferences").within(() => {
            investmentGoalDetails.additionalPreferences.forEach(
              (preference) => {
                cy.findByText(preference).should("be.visible")
              },
            )
          })

          cy.findByLabelText("riskLevel").should(
            "contains.text",
            riskAssessmentScore.data.scoreDescription,
          )

          cy.findByLabelText("investmentAmountInUSD").should(
            "have.value",
            formatCurrencyWithCommas(
              investmentGoalDetails.investmentAmountInUSD.toString(),
            ),
          )

          cy.findByLabelText("topUpInvestmentAnnually").should(
            "contains.text",
            Number(investmentGoalDetails.annualInvestmentTopUpAmountInUSD) > 0
              ? "Yes"
              : "No",
          )

          cy.findByLabelText("annualInvestmentTopUpAmountInUSD").should(
            "have.value",
            formatCurrencyWithCommas(
              investmentGoalDetails.annualInvestmentTopUpAmountInUSD.toString(),
            ),
          )

          cy.findByLabelText("shouldGenerateIncome").should(
            "contains.text",
            personalisedProposalKeys.updateProposal.incomeGeneratingLabel[
              investmentGoalDetails.shouldGenerateIncome
            ],
          )

          cy.findByLabelText("desiredIncomePercentage").should(
            "have.text",
            `${
              Math.round(
                ((investmentGoalDetails.desiredAnnualIncome * 100) /
                  Number(investmentGoalDetails.investmentAmountInUSD)) *
                  2,
              ) / 2
            } %`,
          )
        })
    })

    it("should navigate user to the risk questionnaire journey using Retake assessment CTA", () => {
      cy.intercept("/api/user/proposals/updateProposal", {
        body: {},
      }).as("updateProposal")
      cy.findAllByLabelText("editProposalModal")
        .eq(1)
        .within(() => {
          cy.findByRole("link", {
            name: personalisedProposalKeys.updateProposal.labels.riskAssessment,
          }).click()
        })

      cy.location("pathname").should(
        "equal",
        "/personalized-proposal/start-risk-assessment",
      )
    })

    it("should start risk assessment journey for user again", () => {
      cy.findByRole("link", {
        name: personalisedProposalKeys.startRiskAssessment.getStarted,
      }).click()

      cy.location("hash").should("equal", "#1")

      cy.findByRole("heading", {
        name: proposalKeys.riskAssessment.question[1].title,
      }).should("be.visible")
    })

    it("should be able to choose options for Q1", () => {
      selectedOption = Math.ceil(Math.random() * 3)
      cy.findByRole("radiogroup").find("label").eq(selectedOption).click()
    })

    it("should be able to navigate to Q2", () => {
      cy.intercept("/api/user/risk-assessment", {
        body: {
          q1: selectedOption + 1,
        },
      })

      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByText(proposalKeys.riskAssessment.question[2].description)
    })

    it("should navigate user back on the edit details screen without any change to previous risk assessment result", () => {
      cy.findByRole("link", {
        name: proposalKeys.riskAssessment.links.backToProposal,
      }).click()
      cy.location("pathname").should("equal", "/personalized-proposal")
    })

    it("should see the desired annual income amount to the automatically recalculated on updating investment amount", () => {
      const updatedInvestmentAmountInUSD = 300000

      cy.findAllByLabelText("investmentAmountInUSD")
        .eq(1)
        .clear()
        .type(String(updatedInvestmentAmountInUSD))

      cy.findAllByLabelText("desiredIncomePercentage")
        .eq(1)
        .then((element) => {
          const desiredIncomePercentage = element.text().split(" ")[0]
          const desiredIncome = formatCurrencyWithCommas(
            Math.round(
              (Number(desiredIncomePercentage) * updatedInvestmentAmountInUSD) /
                100,
            ).toString(),
          )
          cy.findByText(
            `${personalisedProposalKeys.updateProposal.labels.correspondance}${desiredIncome}`,
          ).should("be.visible")
        })
    })

    it("should close edit menu by clicking the cross button", () => {
      cy.findAllByLabelText("editProposalModal")
        .eq(1)
        .within(() => {
          cy.findByRole("button", { name: "Close" }).click()
        })

      cy.findAllByLabelText("editProposalModal").should("not.exist")
    })

    it("should edit details using edit CTA", () => {
      cy.findByRole("button", {
        name: personalisedProposalKeys.header.button.editDetails,
      }).click()

      cy.findAllByLabelText("editProposalModal")
        .eq(1)
        .within(() => {
          cy.findByRole("group", { name: "whoIsPortfolioFor" }).type(
            personalisedProposalKeys.updateProposal.goals[
              PortfolioOwner.ImmediateFamily
            ],
          )

          cy.findByRole("button", {
            name: personalisedProposalKeys.updateProposal.goals[
              PortfolioOwner.ImmediateFamily
            ],
          }).click()

          cy.findByLabelText("investmentGoals").type(
            personalisedProposalKeys.updateProposal.goalLabels[
              InvestmentGoal.MaintainLifestyle
            ],
          )

          cy.findByRole("button", {
            name: personalisedProposalKeys.updateProposal.goalLabels[
              InvestmentGoal.MaintainLifestyle
            ],
          }).click()

          cy.findByLabelText("Time horizon slider").type("{rightarrow}")

          cy.findByLabelText("additionalPreferences").type(
            AdditionalPreference.None,
          )

          cy.findByRole("button", {
            name: AdditionalPreference.None,
          }).click()

          cy.findByLabelText("investmentAmountInUSD").clear().type("5000000")

          cy.findByLabelText("topUpInvestmentAnnually").type("No")

          cy.findByRole("button", {
            name: "No",
          }).click()

          cy.findByLabelText("shouldGenerateIncome").type("No")

          cy.findByRole("button", {
            name: "No",
          }).click()
        })
    })

    it("should reset changes made by user using Reset CTA", () => {
      cy.findAllByLabelText("editProposalModal")
        .eq(1)
        .within(() => {
          cy.findByRole("button", {
            name: personalisedProposalKeys.updateProposal.links.resetChanges,
          }).click()

          cy.findByRole("group", { name: "whoIsPortfolioFor" }).should(
            "contains.text",
            investmentGoalDetails.whoIsPortfolioFor,
          )

          cy.findByLabelText("investmentGoals").within(() => {
            investmentGoalDetails.investmentGoals.forEach((goal) => {
              cy.findByText(goal).should("be.visible")
            })
          })

          cy.findByLabelText("Time horizon slider").should(
            "contains.text",
            investmentGoalDetails.investmentDurationInYears,
          )

          cy.findByLabelText("additionalPreferences").within(() => {
            investmentGoalDetails.additionalPreferences.forEach(
              (preference) => {
                cy.findByText(preference).should("be.visible")
              },
            )
          })

          cy.findByLabelText("riskLevel").should(
            "contains.text",
            riskAssessmentScore.data.scoreDescription,
          )

          cy.findByLabelText("investmentAmountInUSD").should(
            "have.value",
            formatCurrencyWithCommas(
              investmentGoalDetails.investmentAmountInUSD.toString(),
            ),
          )

          cy.findByLabelText("topUpInvestmentAnnually").should(
            "contains.text",
            Number(investmentGoalDetails.annualInvestmentTopUpAmountInUSD) > 0
              ? "Yes"
              : "No",
          )

          cy.findByLabelText("annualInvestmentTopUpAmountInUSD").should(
            "have.value",
            formatCurrencyWithCommas(
              investmentGoalDetails.annualInvestmentTopUpAmountInUSD.toString(),
            ),
          )

          cy.findByLabelText("shouldGenerateIncome").should(
            "contains.text",
            personalisedProposalKeys.updateProposal.incomeGeneratingLabel[
              investmentGoalDetails.shouldGenerateIncome
            ],
          )

          cy.findByLabelText("desiredIncomePercentage").should(
            "have.text",
            `${
              Math.round(
                ((investmentGoalDetails.desiredAnnualIncome * 100) /
                  Number(investmentGoalDetails.investmentAmountInUSD)) *
                  2,
              ) / 2
            } %`,
          )
        })
    })

    it("should update details using edit CTA", () => {
      cy.intercept("/api/user/proposals/updateProposal", {
        fixture: "updateProposal",
      }).as("updateProposal")

      cy.findAllByLabelText("editProposalModal")
        .eq(1)
        .within(() => {
          cy.findByRole("group", { name: "whoIsPortfolioFor" }).type(
            personalisedProposalKeys.updateProposal.goals[
              PortfolioOwner.ImmediateFamily
            ],
          )

          cy.findByRole("button", {
            name: personalisedProposalKeys.updateProposal.goals[
              PortfolioOwner.ImmediateFamily
            ],
          }).click()

          cy.findByLabelText("investmentGoals").type(
            personalisedProposalKeys.updateProposal.goalLabels[
              InvestmentGoal.MaintainLifestyle
            ],
          )

          cy.findByRole("button", {
            name: personalisedProposalKeys.updateProposal.goalLabels[
              InvestmentGoal.MaintainLifestyle
            ],
          }).click()

          cy.findByLabelText("Time horizon slider").type("{rightarrow}")

          cy.findByLabelText("additionalPreferences").type(
            AdditionalPreference.None,
          )

          cy.findByRole("button", {
            name: AdditionalPreference.None,
          }).click()

          cy.findByLabelText("investmentAmountInUSD").clear().type("5000000")

          cy.findAllByRole("button", {
            name: personalisedProposalKeys.updateProposal.buttons
              .updateProposal,
          }).click()
        })

      cy.location("pathname").should("equals", "/personalized-proposal")

      cy.findAllByLabelText("editProposalModal").should("not.exist")
    })

    it("should display API error message if backend fails while updating proposals", () => {
      cy.intercept("/api/user/proposals/updateProposal", {
        statusCode: 500,
      }).as("updateProposal")

      cy.findByRole("button", {
        name: personalisedProposalKeys.header.button.editDetails,
      }).click()

      cy.findAllByRole("button", {
        name: personalisedProposalKeys.updateProposal.buttons.updateProposal,
      })
        .eq(1)
        .click()

      cy.findByLabelText("toastMessage")
        .should(
          "contain.text",
          personalisedProposalKeys.updateProposal.errors.apiError.title,
        )
        .should(
          "contain.text",
          personalisedProposalKeys.updateProposal.errors.apiError.description,
        )
    })
  })

  context(
    "mobile",
    {
      viewportHeight: 844,
      viewportWidth: 390,
    },
    () => {
      it("should autofill user preproposal response", () => {
        cy.visit("/personalized-proposal")

        cy.wait([
          "@userPreference",
          "@userSummary",
          "@userProposals",
          "@user",
          "@proposalsStatus",
          "@kycStatus",
          "@investmentGoalResponse",
          "@retakeRiskAssessmentResult",
        ])

        cy.findByRole("button", {
          name: personalisedProposalKeys.header.button.editDetails,
        }).click()

        cy.findAllByLabelText("editProposalModal")
          .eq(1)
          .within(() => {
            cy.findByRole("group", { name: "whoIsPortfolioFor" }).should(
              "contains.text",
              investmentGoalDetails.whoIsPortfolioFor,
            )

            cy.findByLabelText("investmentGoals").within(() => {
              investmentGoalDetails.investmentGoals.forEach((goal) => {
                cy.findByText(goal).should("be.visible")
              })
            })

            cy.findByLabelText("Time horizon slider").should(
              "contains.text",
              investmentGoalDetails.investmentDurationInYears,
            )

            cy.findByLabelText("additionalPreferences").within(() => {
              investmentGoalDetails.additionalPreferences.forEach(
                (preference) => {
                  cy.findByText(preference).should("be.visible")
                },
              )
            })

            cy.findByLabelText("riskLevel").should(
              "contains.text",
              riskAssessmentScore.data.scoreDescription,
            )

            cy.findByLabelText("investmentAmountInUSD").should(
              "have.value",
              formatCurrencyWithCommas(
                investmentGoalDetails.investmentAmountInUSD.toString(),
              ),
            )

            cy.findByLabelText("topUpInvestmentAnnually").should(
              "contains.text",
              Number(investmentGoalDetails.annualInvestmentTopUpAmountInUSD) > 0
                ? "Yes"
                : "No",
            )

            cy.findByLabelText("annualInvestmentTopUpAmountInUSD").should(
              "have.value",
              formatCurrencyWithCommas(
                investmentGoalDetails.annualInvestmentTopUpAmountInUSD.toString(),
              ),
            )

            cy.findByLabelText("shouldGenerateIncome").should(
              "contains.text",
              personalisedProposalKeys.updateProposal.incomeGeneratingLabel[
                investmentGoalDetails.shouldGenerateIncome
              ],
            )

            cy.findByLabelText("desiredIncomePercentage").should(
              "have.text",
              `${
                Math.round(
                  ((investmentGoalDetails.desiredAnnualIncome * 100) /
                    Number(investmentGoalDetails.investmentAmountInUSD)) *
                    2,
                ) / 2
              } %`,
            )
          })
      })

      it("should navigate user to the risk questionnaire journey using Retake assessment CTA", () => {
        cy.intercept("/api/user/proposals/updateProposal", {
          body: {},
        }).as("updateProposal")
        cy.findAllByLabelText("editProposalModal")
          .eq(1)
          .within(() => {
            cy.findByRole("link", {
              name: personalisedProposalKeys.updateProposal.labels
                .riskAssessment,
            }).click()
          })

        cy.location("pathname").should(
          "equal",
          "/personalized-proposal/start-risk-assessment",
        )
      })

      it("should start risk assessment journey for user again", () => {
        cy.findByRole("link", {
          name: personalisedProposalKeys.startRiskAssessment.getStarted,
        }).click()

        cy.location("hash").should("equal", "#1")

        cy.findByRole("heading", {
          name: proposalKeys.riskAssessment.question[1].title,
        }).should("be.visible")
      })

      it("should be able to choose options for Q1", () => {
        selectedOption = Math.ceil(Math.random() * 3)
        cy.findByRole("radiogroup").find("label").eq(selectedOption).click()
      })

      it("should be able to navigate to Q2", () => {
        cy.intercept("/api/user/risk-assessment", {
          body: {
            q1: selectedOption + 1,
          },
        })

        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findByText(proposalKeys.riskAssessment.question[2].description)
      })

      it("should navigate user back on the edit details screen without any change to previous risk assessment result", () => {
        cy.findByRole("link", {
          name: proposalKeys.riskAssessment.links.backToProposal,
        }).click()
        cy.location("pathname").should("equal", "/personalized-proposal")
      })

      it("should see the desired annual income amount to the automatically recalculated on updating investment amount", () => {
        const updatedInvestmentAmountInUSD = 300000

        cy.findAllByLabelText("investmentAmountInUSD")
          .eq(1)
          .clear()
          .type(String(updatedInvestmentAmountInUSD))

        cy.findAllByLabelText("desiredIncomePercentage")
          .eq(1)
          .then((element) => {
            const desiredIncomePercentage = element.text().split(" ")[0]
            const desiredIncome = formatCurrencyWithCommas(
              Math.round(
                (Number(desiredIncomePercentage) *
                  updatedInvestmentAmountInUSD) /
                  100,
              ).toString(),
            )

            cy.wrap(element)
              .parents("div")
              .siblings("p")
              .should(
                "have.text",
                `${personalisedProposalKeys.updateProposal.labels.correspondance}${desiredIncome}`,
              )
          })
      })

      it("should close edit menu by clicking the cross button", () => {
        cy.findAllByLabelText("editProposalModal")
          .eq(1)
          .within(() => {
            cy.findByRole("button", { name: "Close" }).click()
          })

        cy.findAllByLabelText("editProposalModal").should("not.exist")
      })

      it("should edit details using edit CTA", () => {
        cy.findByRole("button", {
          name: personalisedProposalKeys.header.button.editDetails,
        }).click()

        cy.findAllByLabelText("editProposalModal")
          .eq(1)
          .within(() => {
            cy.findByRole("group", { name: "whoIsPortfolioFor" }).type(
              personalisedProposalKeys.updateProposal.goals[
                PortfolioOwner.ImmediateFamily
              ],
            )

            cy.findByRole("button", {
              name: personalisedProposalKeys.updateProposal.goals[
                PortfolioOwner.ImmediateFamily
              ],
            }).click()

            cy.findByLabelText("investmentGoals").type(
              personalisedProposalKeys.updateProposal.goalLabels[
                InvestmentGoal.MaintainLifestyle
              ],
            )

            cy.findByRole("button", {
              name: personalisedProposalKeys.updateProposal.goalLabels[
                InvestmentGoal.MaintainLifestyle
              ],
            }).click()

            cy.findByLabelText("Time horizon slider").type("{rightarrow}")

            cy.findByLabelText("additionalPreferences").type(
              AdditionalPreference.None,
            )

            cy.findByRole("button", {
              name: AdditionalPreference.None,
            }).click()

            cy.findByLabelText("investmentAmountInUSD").clear().type("5000000")

            cy.findByLabelText("topUpInvestmentAnnually").type("No")

            cy.findByRole("button", {
              name: "No",
            }).click()

            cy.findByLabelText("shouldGenerateIncome").type("No")

            cy.findByRole("button", {
              name: "No",
            }).click()
          })
      })

      it("should reset changes made by user using Reset CTA", () => {
        cy.findAllByLabelText("editProposalModal")
          .eq(1)
          .within(() => {
            cy.findByRole("button", {
              name: personalisedProposalKeys.updateProposal.links.resetChanges,
            }).click()

            cy.findByRole("group", { name: "whoIsPortfolioFor" }).should(
              "contains.text",
              investmentGoalDetails.whoIsPortfolioFor,
            )

            cy.findByLabelText("investmentGoals").within(() => {
              investmentGoalDetails.investmentGoals.forEach((goal) => {
                cy.findByText(goal).should("be.visible")
              })
            })

            cy.findByLabelText("Time horizon slider").should(
              "contains.text",
              investmentGoalDetails.investmentDurationInYears,
            )

            cy.findByLabelText("additionalPreferences").within(() => {
              investmentGoalDetails.additionalPreferences.forEach(
                (preference) => {
                  cy.findByText(preference).should("be.visible")
                },
              )
            })

            cy.findByLabelText("riskLevel").should(
              "contains.text",
              riskAssessmentScore.data.scoreDescription,
            )

            cy.findByLabelText("investmentAmountInUSD").should(
              "have.value",
              formatCurrencyWithCommas(
                investmentGoalDetails.investmentAmountInUSD.toString(),
              ),
            )

            cy.findByLabelText("topUpInvestmentAnnually").should(
              "contains.text",
              Number(investmentGoalDetails.annualInvestmentTopUpAmountInUSD) > 0
                ? "Yes"
                : "No",
            )

            cy.findByLabelText("annualInvestmentTopUpAmountInUSD").should(
              "have.value",
              formatCurrencyWithCommas(
                investmentGoalDetails.annualInvestmentTopUpAmountInUSD.toString(),
              ),
            )

            cy.findByLabelText("shouldGenerateIncome").should(
              "contains.text",
              personalisedProposalKeys.updateProposal.incomeGeneratingLabel[
                investmentGoalDetails.shouldGenerateIncome
              ],
            )

            cy.findByLabelText("desiredIncomePercentage").should(
              "have.text",
              `${
                Math.round(
                  ((investmentGoalDetails.desiredAnnualIncome * 100) /
                    Number(investmentGoalDetails.investmentAmountInUSD)) *
                    2,
                ) / 2
              } %`,
            )
          })
      })

      it("should update details using edit CTA", () => {
        cy.intercept("/api/user/proposals/updateProposal", {
          fixture: "updateProposal",
        }).as("updateProposal")

        cy.findAllByLabelText("editProposalModal")
          .eq(1)
          .within(() => {
            cy.findByRole("group", { name: "whoIsPortfolioFor" }).type(
              personalisedProposalKeys.updateProposal.goals[
                PortfolioOwner.ImmediateFamily
              ],
            )

            cy.findByRole("button", {
              name: personalisedProposalKeys.updateProposal.goals[
                PortfolioOwner.ImmediateFamily
              ],
            }).click()

            cy.findByLabelText("investmentGoals").type(
              personalisedProposalKeys.updateProposal.goalLabels[
                InvestmentGoal.MaintainLifestyle
              ],
            )

            cy.findByRole("button", {
              name: personalisedProposalKeys.updateProposal.goalLabels[
                InvestmentGoal.MaintainLifestyle
              ],
            }).click()

            cy.findByLabelText("Time horizon slider").type("{rightarrow}")

            cy.findByLabelText("additionalPreferences").type(
              AdditionalPreference.None,
            )

            cy.findByRole("button", {
              name: AdditionalPreference.None,
            }).click()

            cy.findByLabelText("investmentAmountInUSD").clear().type("5000000")

            cy.findAllByRole("button", {
              name: personalisedProposalKeys.updateProposal.buttons
                .updateProposal,
            }).click()
          })

        cy.location("pathname").should("equals", "/personalized-proposal")

        cy.findAllByLabelText("editProposalModal").should("not.exist")
      })

      it("should display API error message if backend fails while updating proposals", () => {
        cy.intercept("/api/user/proposals/updateProposal", {
          statusCode: 500,
        }).as("updateProposal")

        cy.findByRole("button", {
          name: personalisedProposalKeys.header.button.editDetails,
        }).click()

        cy.findAllByRole("button", {
          name: personalisedProposalKeys.updateProposal.buttons.updateProposal,
        })
          .eq(1)
          .click()

        cy.findByLabelText("toastMessage")
          .should(
            "contain.text",
            personalisedProposalKeys.updateProposal.errors.apiError.title,
          )
          .should(
            "contain.text",
            personalisedProposalKeys.updateProposal.errors.apiError.description,
          )
      })
    },
  )
})
