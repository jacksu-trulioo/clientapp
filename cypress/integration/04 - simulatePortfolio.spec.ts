import { SimulatedPortfolio, User } from "../../src/services/mytfo/types"
import formatCurrency from "../../src/utils/formatCurrency"
import formatPercentage from "../../src/utils/formatPercentage"
import formatYearName from "../../src/utils/formatYearName"

let selectedYears: string
let selectedRiskFilter: string
let simulatorKeys
let commonKeys
let minimumInvestmentAmount = "$100,000"

describe("Simulate Portfolio", () => {
  let user: User
  let simulatorJson: SimulatedPortfolio
  before(() => {
    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })

    cy.fixture("../../public/locales/en/simulator").then((keys) => {
      simulatorKeys = keys
    })

    cy.fixture("user").then((userDetails) => {
      user = userDetails
    })

    cy.loginBE()
  })

  beforeEach(() => {
    cy.intercept("/api/user", { fixture: "user" }).as("user")

    cy.intercept("/api/user/investment-goals", {
      fixture: "investmentGoalQuizNotStarted",
    }).as("investmentGoalResponse")

    cy.intercept("/api/user/kyc/status", {
      fixture: "kycNotStarted",
    }).as("kycStatus")

    cy.intercept("/api/user/preference", {
      fixture: "userPreferenceENDefault",
    }).as("languagePreference")

    cy.intercept("/api/user/relationship-manager", {
      fixture: "RMNotAssigned",
    }).as("relationshipManager")

    cy.intercept("/api/user/qualifications/status", {
      fixture: "proposalJourneyNotStarted",
    }).as("userStatus")

    cy.intercept("/api/user/status", {
      fixture: "userStatusNotQualified",
    }).as("userQualificationStatus")

    cy.intercept("/api/portfolio/simulator", {
      fixture: "portfolioSimulator",
    }).as("simulator")

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

    cy.intercept("/api/user/summary", {
      fixture: "userSummaryFreshUser",
    }).as("userSummary")

    cy.intercept("/api/user/proposals/status", {
      fixture: "proposalsStatusNotStarted",
    }).as("proposalsStatus")

    cy.intercept("/api/user/preference/disclaimer", {
      fixture: "userDisclaimerAccepted",
    }).as("userDisclaimerAccepted")

    cy.intercept("/api/user/risk-assessment", {
      fixture: "riskAssessmentQuizNotStarted",
    }).as("riskAssessmentResponse")
  })

  context("desktop", () => {
    it("should show default investment amount as $100,000", () => {
      cy.visit("/portfolio/simulator")

      cy.wait("@simulator").then((interception) => {
        simulatorJson = JSON.parse(JSON.stringify(interception.response.body))
      })

      cy.findByLabelText("spinner").should("not.exist")

      cy.findByRole("button", {
        name: simulatorKeys.controls.button.simulate,
      }).should("not.be.disabled")

      cy.findByPlaceholderText(
        simulatorKeys.controls.input.investmentAmount.placeholder,
      ).should("have.value", "100,000")
    })

    it("should display tooltip about Investment amount", () => {
      let tooltipText: string =
        simulatorKeys.controls.input.investmentAmount.tooltip
      tooltipText = tooltipText.replace(
        "{{minInvestmentAmount}}",
        minimumInvestmentAmount,
      )
      cy.findAllByLabelText("Info icon").eq(0).trigger("mouseover")
      cy.findByText(tooltipText)
      cy.findAllByLabelText("Info icon").eq(0).trigger("mouseleave")
    })

    it("should show default Time Horizon as 10 years", () => {
      cy.findByLabelText("Time horizon slider")
        .find("p")
        .should("have.text", "10 years")
    })

    it("should show default Risk Tolerance as Balanced", () => {
      cy.findByLabelText("Risk tolerance slider")
        .find("p")
        .should(
          "have.text",
          simulatorKeys.controls.slider.riskTolerance.level[3].name,
        )
    })

    it("should display tooltip about Shariah Compliance", () => {
      cy.findAllByLabelText("Info icon").eq(1).trigger("mouseover")
      cy.findByText(simulatorKeys.controls.checkbox.shariahCompliant.tooltip)
      cy.findAllByLabelText("Info icon").eq(1).trigger("mouseleave")
    })

    it("should simulate portfolio", () => {
      cy.intercept("/api/portfolio/simulator", {
        fixture: "portfolioSimulatorUpdatedFilters",
      }).as("simulator")

      cy.findByPlaceholderText(
        simulatorKeys.controls.input.investmentAmount.placeholder,
      )
        .clear()
        .type("4000000{enter}")

      cy.wait("@simulator")

      cy.findByLabelText("spinner").should("not.exist")
      cy.findByRole("button", { name: "Simulate" }).should("not.be.disabled")

      cy.findAllByRole("slider").eq(0).type("{rightarrow}")

      cy.wait("@simulator")

      cy.findByLabelText("spinner").should("not.exist")

      cy.findByRole("button", {
        name: simulatorKeys.controls.button.simulate,
      }).should("not.be.disabled")

      cy.findAllByRole("slider").eq(1).type("{rightarrow}")

      cy.wait("@simulator")

      cy.findByLabelText("spinner").should("not.exist")
      cy.findByRole("button", { name: simulatorKeys.controls.button.simulate })
        .should("not.be.disabled")
        .click()

      cy.wait("@simulator").then((interception) => {
        simulatorJson = JSON.parse(JSON.stringify(interception.response.body))
      })
      cy.findByLabelText("spinner").should("not.exist")
    })

    it("should display Time Horizon selected in Your Projections pane", () => {
      cy.findByLabelText("Time horizon slider")
        .find("p")
        .then(($selectedTimeHorizon) => {
          const selectedYears = $selectedTimeHorizon.text().split(" ")[0]
          let projectionSummary: string = simulatorKeys.projections.summary
          projectionSummary = projectionSummary.replace(/  /g, " ")
          projectionSummary = projectionSummary.replace(/<\d>/g, "")
          projectionSummary = projectionSummary.replace(/<\/\d>/g, "")
          projectionSummary = projectionSummary.replace(
            "{{firstName}}",
            user.profile.firstName,
          )
          projectionSummary = projectionSummary.replace(
            "{{years}}",
            selectedYears,
          )
          projectionSummary = projectionSummary.replace(
            "{{yearsText}}",
            formatYearName(simulatorJson.graphData.length - 1, "en"),
          )
          projectionSummary = projectionSummary.replace(
            "{{projectedValue}}",
            formatCurrency(simulatorJson.projectedValue),
          )
          projectionSummary = projectionSummary.replace(
            "{{averageIncome}}",
            formatCurrency(simulatorJson.averageIncome),
          )
          projectionSummary = projectionSummary.replace(
            "{{roi}}",
            formatPercentage(simulatorJson.roi),
          )
          projectionSummary = projectionSummary.replace(
            "{{expectedReturn}}",
            formatPercentage(simulatorJson.expectedReturn),
          )
          projectionSummary = projectionSummary.replace(
            "{{expectedYield}}",
            formatPercentage(simulatorJson.expectedYield),
          )
          cy.contains(projectionSummary.split("<2/>")[0])
          cy.contains(projectionSummary.split("<2/>")[2])
        })
    })

    it("should display cumulative payout yield in Projections chart", () => {
      cy.findByText(
        simulatorKeys.legends.cumulativeYieldPaidOut,
      ).scrollIntoView()
      cy.findByText(simulatorKeys.legends.cumulativeYieldPaidOut).should(
        "be.visible",
      )
    })

    it("should display Portfolio Value in Projections chart", () => {
      cy.findByText(simulatorKeys.legends.portfolioValue).scrollIntoView()
      cy.findByText(simulatorKeys.legends.portfolioValue).should("be.visible")
    })

    it("should display Allocations distribution categories", () => {
      for (var i = 0; i < simulatorJson.allocations.length; i++) {
        const categoryName = simulatorJson.allocations[i].categorization
        const categoryPercentage = Math.floor(
          simulatorJson.allocations[i].percentage * 100,
        )

        let sampleDeals = simulatorJson.allocations[i].sampleDeals
        let assetClassList = []

        for (let j = 0; j < sampleDeals.length; j++) {
          assetClassList.push(sampleDeals[j].assetClass)
        }

        const assetClasses = Array.from(new Set(assetClassList)).join("  |  ")

        cy.findAllByLabelText("allocationCategory")
          .eq(i)
          .then(($categoryElement) => {
            const text = $categoryElement.text()
            expect(text).to.contain(categoryName)
            expect(text).to.contain(`${categoryPercentage}%`)
            expect(text).to.contain(assetClasses)
          })
      }
    })

    it("should able to simulate portfolio without Shariah compliance", () => {
      cy.findByText(
        simulatorKeys.controls.checkbox.shariahCompliant.label,
      ).click()

      cy.findByLabelText("spinner").should("not.exist")
      cy.findByRole("button", { name: simulatorKeys.controls.button.simulate })
        .should("not.be.disabled")
        .click()
      cy.wait("@simulator").its("response.statusCode").should("eq", 200)
    })

    it("should display error on entering investment amount less than 100000", () => {
      let minimumAmountAllowed: string =
        simulatorKeys.controls.input.investmentAmount.minHint

      cy.findByPlaceholderText(
        simulatorKeys.controls.input.investmentAmount.placeholder,
      )
        .clear()
        .type("29000")
      cy.findByRole("button", { name: simulatorKeys.controls.button.simulate })
        .eq(0)
        .click()
      cy.findByPlaceholderText(
        simulatorKeys.controls.input.investmentAmount.placeholder,
      ).scrollIntoView()
      cy.findByText(
        minimumAmountAllowed.replace("{{minInvestmentAmount}}", "100000"),
      ).should("be.visible")
    })

    it("should display error on entering investment amount more than 1000000", () => {
      cy.findByPlaceholderText(
        simulatorKeys.controls.input.investmentAmount.placeholder,
      )
        .clear()
        .type("29000000")
      cy.findByRole("button", { name: simulatorKeys.controls.button.simulate })
        .eq(0)
        .click()
      cy.findByPlaceholderText(
        simulatorKeys.controls.input.investmentAmount.placeholder,
      ).scrollIntoView()

      let maximumAmountAllowed: string =
        simulatorKeys.controls.input.investmentAmount.maxHint

      cy.findByText(
        maximumAmountAllowed.replace("{{maxInvestmentAmount}}", "20000000"),
      ).should("be.visible")
    })

    it("should display error on not entering investment amount", () => {
      cy.findByPlaceholderText(
        simulatorKeys.controls.input.investmentAmount.placeholder,
      ).clear()
      cy.findByRole("button", { name: simulatorKeys.controls.button.simulate })
        .eq(0)
        .click()
      cy.findByPlaceholderText(
        simulatorKeys.controls.input.investmentAmount.placeholder,
      ).scrollIntoView()

      cy.contains(commonKeys.errors.required).should("be.visible")
    })

    it("should be navigated to preproposal screen when unlock opportunity flow is completed", () => {
      cy.intercept("/api/user/qualifications/status", {
        fixture: "proposalInvestmentGoalsNotStarted",
      }).as("userStatus")
      cy.visit("/portfolio/simulator")
      cy.findByText(simulatorKeys.footer.button.startInvesting)
        .scrollIntoView()
        .click()

      cy.location("pathname").should("equal", "/proposal")
    })

    it("should able to Exit from Simulator screen", () => {
      cy.visit("/portfolio/simulator")
      cy.findByLabelText("Close simulator modal").click()
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
      it("should simulate portfolio ", () => {
        cy.intercept("/api/portfolio/simulator", {
          fixture: "portfolioSimulatorUpdatedFilters",
        }).as("simulator")

        cy.visit("/portfolio/simulator")

        cy.wait(["@user", "@relationshipManager", "@simulator"])

        cy.findByPlaceholderText(
          simulatorKeys.controls.input.investmentAmount.placeholder,
        )
          .clear()
          .type("4000000")

        cy.findAllByRole("slider").eq(0).type("{rightarrow}")

        cy.findByLabelText("Time horizon slider")
          .find("p")
          .then(($selectedTimeHorizon) => {
            selectedYears = $selectedTimeHorizon.text().split(" ")[0]
          })

        cy.findAllByRole("slider").eq(1).type("{rightarrow}")

        cy.findByLabelText("Risk tolerance slider")
          .find("p")
          .then(($selectedRiskTolerance) => {
            selectedRiskFilter = $selectedRiskTolerance.text()
          })

        cy.findByRole("button", {
          name: simulatorKeys.controls.button.simulate,
        })
          .should("not.be.disabled")
          .click()

        cy.wait("@simulator").then((interception) => {
          simulatorJson = JSON.parse(JSON.stringify(interception.response.body))
        })
      })

      it("should display Time Horizon selected in Your Projections pane", () => {
        let projectionSummary: string = simulatorKeys.projections.summary
        projectionSummary = projectionSummary.replace(/  /g, " ")
        projectionSummary = projectionSummary.replace(/<\d>/g, "")
        projectionSummary = projectionSummary.replace(/<\/\d>/g, "")
        projectionSummary = projectionSummary.replace(
          "{{firstName}}",
          user.profile.firstName,
        )
        projectionSummary = projectionSummary.replace(
          "{{years}}",
          selectedYears,
        )
        projectionSummary = projectionSummary.replace(
          "{{yearsText}}",
          formatYearName(simulatorJson.graphData.length - 1, "en"),
        )
        projectionSummary = projectionSummary.replace(
          "{{projectedValue}}",
          formatCurrency(simulatorJson.projectedValue),
        )
        projectionSummary = projectionSummary.replace(
          "{{averageIncome}}",
          formatCurrency(simulatorJson.averageIncome),
        )
        projectionSummary = projectionSummary.replace(
          "{{roi}}",
          formatPercentage(simulatorJson.roi),
        )
        projectionSummary = projectionSummary.replace(
          "{{expectedReturn}}",
          formatPercentage(simulatorJson.expectedReturn),
        )
        projectionSummary = projectionSummary.replace(
          "{{expectedYield}}",
          formatPercentage(simulatorJson.expectedYield),
        )
        cy.contains(projectionSummary.split("<2/>")[0])
        cy.contains(projectionSummary.split("<2/>")[2])
      })

      it("should display the filters selected on projections and allocations page", () => {
        cy.findByText("$4,000,000").should("be.visible")
        cy.findByText(selectedYears).should("be.visible")
        cy.findByText(selectedRiskFilter).should("be.visible")
        cy.findByText(
          simulatorKeys.controls.mobileMenu.shariahCompliant,
        ).should("be.visible")
      })

      it("should display Allocations distribution categories", () => {
        for (var i = 0; i < simulatorJson.allocations.length; i++) {
          const categoryName = simulatorJson.allocations[i].categorization
          const categoryPercentage = Math.floor(
            simulatorJson.allocations[i].percentage * 100,
          )

          let sampleDeals = simulatorJson.allocations[i].sampleDeals
          let assetClassList = []

          for (let j = 0; j < sampleDeals.length; j++) {
            assetClassList.push(sampleDeals[j].assetClass)
          }

          const assetClasses = Array.from(new Set(assetClassList)).join("  |  ")

          cy.findAllByLabelText("allocationCategory")
            .eq(i)
            .then(($categoryElement) => {
              const text = $categoryElement.text()
              expect(text).to.contain(categoryName)
              expect(text).to.contain(`${categoryPercentage}%`)
              expect(text).to.contain(assetClasses)
            })
        }
      })

      it("should able to change filters", () => {
        cy.findByRole("button", { name: commonKeys.button.change }).click()
        cy.findByRole("button", {
          name: simulatorKeys.controls.button.simulate,
        }).should("be.visible")
      })

      it("should able to simulate portfolio without Shariah compliance", () => {
        cy.findByText("Make my portfolio Shariah compliant").click()
        cy.intercept("/api/portfolio/simulator", {
          fixture: "portfolioSimulatorUpdatedFilters",
        }).as("simulator")

        cy.findByRole("button", {
          name: simulatorKeys.controls.button.simulate,
        })
          .should("not.be.disabled")
          .click()
        cy.wait("@simulator").its("response.statusCode").should("eq", 200)
      })

      it("should display filters selected without Shariah Compliance", () => {
        cy.findByText("$4,000,000").should("be.visible")
        cy.findByText(selectedYears).should("be.visible")
        cy.findByText(selectedRiskFilter).should("be.visible")
        cy.findByText(
          simulatorKeys.controls.mobileMenu.nonShariahCompliant,
        ).should("be.visible")
      })

      it("should display error on entering investment amount less than 100000", () => {
        let minimumAmountAllowed: string =
          simulatorKeys.controls.input.investmentAmount.minHint
        cy.findByRole("button", { name: commonKeys.button.change }).click()
        cy.findAllByRole("group").should("have.length", 4)
        cy.findByPlaceholderText(
          simulatorKeys.controls.input.investmentAmount.placeholder,
        )
          .clear()
          .type("29000")
        cy.findByRole("button", {
          name: simulatorKeys.controls.button.simulate,
        })
          .eq(0)
          .click()
        cy.findByPlaceholderText(
          simulatorKeys.controls.input.investmentAmount.placeholder,
        ).scrollIntoView()
        cy.findByText(
          minimumAmountAllowed.replace("{{minInvestmentAmount}}", "100000"),
        ).should("be.visible")
      })

      it("should display error on entering investment amount more than 1000000", () => {
        cy.findAllByRole("group").should("have.length", 4)
        cy.findByPlaceholderText(
          simulatorKeys.controls.input.investmentAmount.placeholder,
        )
          .clear()
          .type("29000000")
        cy.findByRole("button", {
          name: simulatorKeys.controls.button.simulate,
        })
          .eq(0)
          .click()
        cy.findByPlaceholderText(
          simulatorKeys.controls.input.investmentAmount.placeholder,
        ).scrollIntoView()

        let maximumAmountAllowed: string =
          simulatorKeys.controls.input.investmentAmount.maxHint

        cy.findByText(
          maximumAmountAllowed.replace("{{maxInvestmentAmount}}", "20000000"),
        ).should("be.visible")
      })

      it("should display error on not entering investment amount", () => {
        cy.findAllByRole("group").should("have.length", 4)
        cy.findByPlaceholderText(
          simulatorKeys.controls.input.investmentAmount.placeholder,
        ).clear()
        cy.findByRole("button", {
          name: simulatorKeys.controls.button.simulate,
        })
          .eq(0)
          .click()
        cy.findByPlaceholderText(
          simulatorKeys.controls.input.investmentAmount.placeholder,
        ).scrollIntoView()

        cy.contains(commonKeys.errors.required).should("be.visible")
      })

      it("should display tooltip about Investment amount", () => {
        let tooltipText: string =
          simulatorKeys.controls.input.investmentAmount.tooltip
        tooltipText = tooltipText.replace(
          "{{minInvestmentAmount}}",
          minimumInvestmentAmount,
        )
        cy.findAllByLabelText("Info icon").should("have.length", 2)
        cy.findAllByLabelText("Info icon").eq(0).trigger("mouseover")
        cy.findByText(tooltipText)
        cy.findAllByLabelText("Info icon").eq(0).click()
      })

      it("should close Simulate portfolio filter using Close button", () => {
        cy.findByRole("button", { name: /Close/i }).click()
        cy.findByPlaceholderText(
          simulatorKeys.controls.input.investmentAmount.placeholder,
        ).should("not.exist")
        cy.findByRole("button", { name: /Change/i }).should("be.visible")
      })

      it("should close Simulate portfolio using Close Icon", () => {
        cy.findByLabelText("Close simulator modal").click()
        cy.location("pathname").should("eq", "/")
      })

      it("should be navigated to preproposal screen when unlock opportunity flow is completed", () => {
        cy.intercept("/api/user/qualifications/status", {
          fixture: "proposalInvestmentGoalsNotStarted",
        }).as("userStatus")
        cy.visit("/portfolio/simulator")

        cy.findByRole("button", { name: commonKeys.button.close }).click()

        cy.findByText(simulatorKeys.footer.button.startInvesting)
          .scrollIntoView()
          .click()

        cy.location("pathname").should("equal", "/proposal")
      })
    },
  )
})
