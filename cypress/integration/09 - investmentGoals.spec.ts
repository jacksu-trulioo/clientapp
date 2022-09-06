import faker from "faker"

import {
  AdditionalPreference,
  InvestmentGoal,
  InvestorProfileGoals,
  PortfolioOwner,
} from "../../src/services/mytfo/types"
import { formatCurrencyWithCommas } from "../../src/utils/formatCurrency"

let intialInvestmentAmount: string
let investmentGoals: InvestmentGoal[] = []
let additionalPreferences: AdditionalPreference[] = []
let annualTopUp: string
let proposalKeys
let commonKeys
const pages = 8

describe("Investment Goals -  to personalize proposal.", () => {
  let investmentProfileGoals: InvestorProfileGoals
  before(() => {
    cy.loginBE()

    cy.fixture("../../public/locales/en/proposal").then((keys) => {
      proposalKeys = keys
    })

    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })

    cy.fixture("investmentGoalQuizNotStarted").then((mockedGoals) => {
      investmentProfileGoals = mockedGoals
    })
  })

  beforeEach(() => {
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

    cy.intercept("/api/user/investment-goals", {
      fixture: "investmentGoalQuizNotStarted",
    }).as("investmentGoalResponse")

    cy.intercept("/api/user/qualifications/status", {
      fixture: "proposalJourneyNotStarted",
    }).as("userStatus")

    cy.intercept("/api/user/status", {
      fixture: "userStatusQualified",
    }).as("userQualificationStatus")

    cy.intercept("/api/user/relationship-manager", {
      fixture: "RMNotAssigned",
    }).as("relationshipManager")

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

    cy.intercept("/api/user/preference/disclaimer", {
      fixture: "userDisclaimerAccepted",
    }).as("userDisclaimerAccepted")

    cy.intercept("/api/user/proposals/status", {
      fixture: "proposalsStatusNotStarted",
    }).as("proposalsStatus")

    cy.intercept("/api/user/qualifications/status", {
      fixture: "proposalInvestmentGoalsNotStarted",
    }).as("userStatus")

    cy.intercept("/api/user/risk-assessment", {
      fixture: "riskAssessmentQuizNotStarted",
    }).as("riskAssessmentResponse")
  })

  context("desktop", () => {
    let currentPageIndex = 0

    it("should be able to start investment goal section", () => {
      cy.visit("/proposal")

      cy.wait(["@userStatus", "@userQualificationStatus"])

      cy.findByText(commonKeys.button.continue).click()

      cy.location("pathname", { timeout: 10000 }).should(
        "equal",
        "/proposal/investment-goals",
      )
    })

    it("should show progress in progressbar", () => {
      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )
    })

    it("should show step name in header", () => {
      cy.get("header").findByText(
        proposalKeys.chapterSelection.chapterTwo.stepper.title,
      )
      cy.get("header").findByText("2")
    })

    it("should be able to invoke Save & Exit from Q1", () => {
      cy.findByRole("button", { name: commonKeys.button.saveAndExit }).click()
      cy.findByRole("dialog")
        .children("header")
        .should("have.text", commonKeys.modal.saveAndExit.title)
    })

    it("should be able to cancel Save & Exit from Q1", () => {
      cy.findByRole("button", { name: commonKeys.button.cancel }).click()
      cy.findByRole("heading", {
        name: proposalKeys.investmentGoals.question[1].title,
      }).should("be.visible")
    })

    it("should be able to Save & Exit from Q1", () => {
      cy.findByRole("button", { name: commonKeys.button.saveAndExit }).click()
      cy.findByRole("link", { name: commonKeys.button.saveAndExit }).click()
      cy.location("pathname", { timeout: 10000 }).should("equal", "/")
    })

    it("should be able to start proposal from Question 1 after again reaching to proposal screen", () => {
      cy.visit("/proposal")

      cy.wait(["@userStatus", "@userQualificationStatus"])

      cy.findByText(commonKeys.button.continue).click()

      cy.location("pathname", { timeout: 10000 }).should(
        "equal",
        "/proposal/investment-goals",
      )
    })

    it("should navigate to dashboard when user clicks on logo", () => {
      cy.findByLabelText("logo").click()
      cy.findByRole("dialog")
        .findByRole("button", { name: commonKeys.button.saveAndExit })
        .click()
      cy.location("pathname", { timeout: 10000 }).should("equal", "/")
    })

    it("should be able to start proposal from Question 1 after again reaching to proposal screen", () => {
      cy.visit("/proposal")

      cy.wait(["@userStatus", "@userQualificationStatus"])

      cy.findByText(commonKeys.button.continue).click()

      cy.location("pathname", { timeout: 10000 }).should(
        "equal",
        "/proposal/investment-goals",
      )
    })

    it("should not navigate to next statement without answering current statement", () => {
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      cy.findByText(commonKeys.errors.required).should("be.visible")
    })

    it("should insert details in other option is selected for Q1", () => {
      investmentProfileGoals.whoIsPortfolioFor = PortfolioOwner["Other"]
      investmentProfileGoals.whoIsPortfolioForOtherDetails =
        faker.random.words(1)
      cy.findByRole("radiogroup").find("label").eq(3).click()
      cy.findByPlaceholderText(
        proposalKeys.investmentGoals.question[1].options.placeholders
          .insertDetails,
      ).type(investmentProfileGoals.whoIsPortfolioForOtherDetails)
    })

    it("should be able to navigate to Q2", () => {
      cy.intercept("/api/user/investment-goals", {
        body: investmentProfileGoals,
      }).as("goalsResponse")
      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.findByRole("heading", { level: 2 }).should(
        "have.text",
        proposalKeys.investmentGoals.question[2].title,
      )
      currentPageIndex++
    })

    it("should show increased progress in progressbar", () => {
      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )
    })

    it("should be able to invoke Save & Exit from Q2", () => {
      cy.findByRole("button", { name: commonKeys.button.saveAndExit }).click()
      cy.findByRole("link", { name: commonKeys.button.saveAndExit }).click()
      cy.location("pathname", { timeout: 10000 }).should("equal", "/")

      currentPageIndex = 0
    })

    it("should prefill the user response for Q1 before save & exit action ", () => {
      cy.intercept("/api/user/investment-goals", {
        body: investmentProfileGoals,
      }).as("goalsResponse")

      cy.visit("/proposal")

      cy.wait(["@userStatus", "@userQualificationStatus"])

      cy.findByText(commonKeys.button.continue).click()

      cy.location("pathname", { timeout: 10000 }).should(
        "equal",
        "/proposal/investment-goals",
      )

      cy.findByRole("radiogroup")
        .find("label")
        .eq(3)
        .find("span")
        .should("have.attr", "data-checked")

      cy.findByPlaceholderText(
        proposalKeys.investmentGoals.question[1].options.placeholders
          .insertDetails,
      ).should(
        "have.text",
        investmentProfileGoals.whoIsPortfolioForOtherDetails,
      )

      cy.findByRole("radiogroup")
        .find("label")
        .eq(3)
        .find("span")
        .should("have.attr", "data-checked")

      cy.findByPlaceholderText(
        proposalKeys.investmentGoals.question[1].options.placeholders
          .insertDetails,
      ).should(
        "have.text",
        investmentProfileGoals.whoIsPortfolioForOtherDetails,
      )

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      currentPageIndex++
    })

    it("should insert details when other option is selected for Q2", () => {
      cy.findByRole("group").find("label").eq(5).click()
      cy.findByPlaceholderText(
        proposalKeys.investmentGoals.question[1].options.placeholders
          .insertDetails,
      ).type(faker.random.words(1))
    })

    it("should be able to navigate back to Q1 from Q2", () => {
      cy.intercept("/api/user/investment-goals", {
        body: investmentProfileGoals,
      }).as("goalsResponse")

      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.findByRole("heading", { level: 2 }).should(
        "have.text",
        proposalKeys.investmentGoals.question[1].title,
      )

      currentPageIndex--
    })

    it("should show decreased progress in progressbar", () => {
      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )
    })

    it("should able to change response of Q1", () => {
      cy.findByRole("radiogroup").find("label").eq(3).click()

      investmentProfileGoals.whoIsPortfolioFor = PortfolioOwner.Other
      investmentProfileGoals.whoIsPortfolioForOtherDetails = null
    })

    it("should be able to navigate again to Q2", () => {
      cy.intercept("/api/user/investment-goals", {
        body: investmentProfileGoals,
      }).as("goalsResponse")

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.wait("@goalsResponse")
      cy.findByRole("heading", { level: 2 }).should(
        "have.text",
        proposalKeys.investmentGoals.question[2].title,
      )
      currentPageIndex++
    })

    it("should be able to select multiple options for Q2", () => {
      investmentGoals.push(
        InvestmentGoal.MaintainLifestyle,
        InvestmentGoal.BuildGlobalPortfolio,
      )

      investmentProfileGoals.investmentGoals = investmentGoals

      const set = new Set([2, 3])

      set.forEach((element: number) => {
        cy.findByRole("group").find("label").eq(element).click()
      })
    })

    it("should be able to navigate to Q4", () => {
      investmentProfileGoals.investmentDurationInYears = 7

      cy.intercept("/api/user/investment-goals", {
        body: investmentProfileGoals,
      }).as("goalsResponse")

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.wait("@goalsResponse")
      cy.findByText(proposalKeys.investmentGoals.question[4].title).should(
        "be.visible",
      )
      currentPageIndex++
    })

    it("should show increased progress in progressbar", () => {
      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )
    })

    it("should display description when Time horizon selected less than equal to 7 years", () => {
      cy.findByText(
        proposalKeys.investmentGoals.question[4].options.short.title,
      ).should("be.visible")
    })

    it("should display description when Time horizon selected less than 25 years", () => {
      cy.findAllByRole("slider").eq(0).type("{rightarrow}".repeat(2))

      cy.findByText(
        proposalKeys.investmentGoals.question[4].options.long.title,
      ).should("be.visible")
    })

    it("should display description when Time horizon selected 25 years", () => {
      cy.findAllByRole("slider").eq(0).type("{rightarrow}".repeat(18))
      cy.findByText(
        proposalKeys.investmentGoals.question[4].options.indefinite.description,
      ).should("be.visible")
      cy.findByText(
        String(
          proposalKeys.investmentGoals.question[4].options.indefinite.title,
        ).trim(),
      ).should("be.visible")
    })

    it("should be able to navigate to Q5", () => {
      cy.intercept("/api/user/investment-goals", {
        body: investmentProfileGoals,
      }).as("goalsResponse")

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.wait("@goalsResponse")
      cy.findByText(proposalKeys.investmentGoals.question[5].title).should(
        "be.visible",
      )
      currentPageIndex++
    })

    it("should show increased progress in progressbar", () => {
      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )
    })

    it("should get validation error message if initial investment is entered less than $100,000", () => {
      cy.findByPlaceholderText(
        proposalKeys.investmentGoals.question[5].text.placeholder,
      ).type("99")
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.contains(
        proposalKeys.investmentGoals.question[5].errors.minDescription,
      ).should("be.visible")
    })

    it("should get validation error message if initial investment is entered more than $25,000,000", () => {
      cy.findByPlaceholderText(
        proposalKeys.investmentGoals.question[5].text.placeholder,
      )
        .clear()
        .type("250000001")
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.contains(
        proposalKeys.investmentGoals.question[5].errors.maxDescription,
      ).should("be.visible")
    })

    it("should enter initial investment amount", () => {
      intialInvestmentAmount = "10000000"
      cy.findByPlaceholderText(
        proposalKeys.investmentGoals.question[5].text.placeholder,
      )
        .clear()
        .type(intialInvestmentAmount)

      investmentProfileGoals.investmentAmountInUSD = intialInvestmentAmount
    })

    it("should give validation error if annual topup for annual investment is greater than 25,000,000", () => {
      annualTopUp = "100000000"
      cy.findByRole("radiogroup")
        .findByText(proposalKeys.investmentGoals.question[5].options.yes.title)
        .click()
      cy.findAllByPlaceholderText(
        proposalKeys.investmentGoals.question[5].text.placeholder,
      )
        .eq(1)
        .type(annualTopUp)
        .parent()
        .siblings("div")
        .should(
          "have.text",
          proposalKeys.investmentGoals.question[5].errors.maxDescription,
        )
    })

    it("should able to enter annual topup if user has opted yes for annual investment", () => {
      annualTopUp = "100000"
      cy.findAllByPlaceholderText(
        proposalKeys.investmentGoals.question[5].text.placeholder,
      )
        .eq(1)
        .clear()
        .type(annualTopUp)

      investmentProfileGoals.annualInvestmentTopUpAmountInUSD = annualTopUp
    })

    it("should be able to navigate to Q3", () => {
      cy.intercept("/api/user/investment-goals", {
        body: investmentProfileGoals,
      }).as("goalsResponse")

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.wait("@goalsResponse")
      cy.findByRole("heading", { level: 2 }).should(
        "have.text",
        proposalKeys.investmentGoals.question[3].title,
      )
      currentPageIndex++
    })

    it("should show increased progress in progressbar", () => {
      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )
    })

    it("should be able to choose option for Q3 as Yes", () => {
      cy.findByRole("radiogroup").find("label").eq(0).click()
      investmentProfileGoals.shouldGenerateIncome = "yes"
    })

    it("should be able to input desired annual income using slider", () => {
      cy.findAllByRole("slider").eq(0).type("{rightarrow}", { force: true })
      cy.findByLabelText("desiredAnnualIncome").then((percentage) => {
        const annualIncomePercentage = Number(
          percentage.text().replace("%", ""),
        )
        const annualIncome = formatCurrencyWithCommas(
          Math.round(
            (Number(investmentProfileGoals.investmentAmountInUSD) *
              annualIncomePercentage) /
              100,
          ).toString(),
        )
        cy.findByText(
          `${proposalKeys.investmentGoals.question[3].correspondence}${annualIncome}`,
        ).should("be.visible")

        investmentProfileGoals.desiredAnnualIncome = Number(annualIncome)
      })
    })

    it("should be able to navigate to Q6 if value selected is more than $10 Million", () => {
      investmentProfileGoals.investmentAmountInUSD = 11000000
      investmentProfileGoals.topUpInvestmentAnnually = "yes"
      investmentProfileGoals.annualInvestmentTopUpAmountInUSD = annualTopUp
      investmentProfileGoals.investmentDurationInYears = 25

      cy.intercept("/api/user/investment-goals", {
        body: investmentProfileGoals,
      }).as("goalsResponse")

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.wait("@goalsResponse")
      cy.findByText(
        proposalKeys.investmentGoals.question[6].description,
      ).should("be.visible")
      currentPageIndex++
    })

    it("should show increased progress in progressbar", () => {
      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )
    })

    it("should be able to select multiple options for Q6", () => {
      const set = new Set([3, 4])
      set.forEach((element: number) => {
        cy.findByRole("group").find("label").eq(element).click()
      })
    })

    it("should be able to navigate back to Q3 from Q6", () => {
      cy.intercept("/api/user/investment-goals", {
        body: investmentProfileGoals,
      }).as("goalsResponse")
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.findByRole("heading", { level: 2 }).should(
        "have.text",
        proposalKeys.investmentGoals.question[3].title,
      )
      currentPageIndex--
    })

    it("should be able to navigate directly to Q7 if value selected is less than $10 Million", () => {
      investmentProfileGoals.annualInvestmentTopUpAmountInUSD = 300000
      investmentProfileGoals.investmentAmountInUSD = 3000000

      cy.intercept("/api/user/investment-goals", {
        body: investmentProfileGoals,
      }).as("goalsResponse")

      cy.reload()

      cy.wait("@goalsResponse")

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.wait("@goalsResponse")

      cy.findByRole("heading", {
        name: proposalKeys.investmentGoals.question[7].title,
      }).should("be.visible")
      currentPageIndex = currentPageIndex + 2
    })

    it("should show increased progress in progressbar", () => {
      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )
    })

    it("should be able to select multiple options for Q7", () => {
      const set = new Set([1, 2])
      set.forEach((element: number) => {
        cy.findAllByRole("group").eq(0).find("label").eq(element).click()
      })
      additionalPreferences.push(
        AdditionalPreference.Ethical,
        AdditionalPreference.ShariahCompliant,
      )
    })

    it("should be able to navigate directly to Q8", () => {
      investmentProfileGoals.additionalPreferences = additionalPreferences

      cy.intercept("/api/user/investment-goals", {
        body: investmentProfileGoals,
      }).as("goalsResponse")

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.wait("@goalsResponse")

      cy.findByRole("heading", {
        name: proposalKeys.investmentGoals.question[8].title,
      }).should("be.visible")
      currentPageIndex = currentPageIndex + 1
    })

    it("should show increased progress in progressbar", () => {
      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )
    })

    it("should be able to select option for Q8", () => {
      cy.findByRole("radiogroup")
        .findByText(proposalKeys.investmentGoals.question[8].options.yes)
        .click()
    })

    it("should be able to complete investment goals", () => {
      investmentProfileGoals.esgCompliant = "yes"
      cy.intercept("/api/user/qualifications/status", {
        fixture: "proposalRiskAssessmentNotStarted",
      }).as("userStatus")

      cy.intercept("/api/user/investment-goals", {
        body: investmentProfileGoals,
      }).as("goalsResponse")

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.wait("@goalsResponse")
      cy.findByText(proposalKeys.chapterSelection.chapterTwo.title)
        .parent()
        .findByText(commonKeys.button.continue)
        .should("not.exist")
      cy.findByText(proposalKeys.chapterSelection.chapterThree.title)
        .parent()
        .findByText(commonKeys.button.continue)
        .should("be.visible")
    })
  })

  context(
    "mobile",
    {
      viewportHeight: 812,
      viewportWidth: 375,
    },
    () => {
      let currentPageIndex = 0

      it("should be able to start investment goal section", () => {
        cy.fixture("investmentGoalQuizNotStarted").then((mockedGoals) => {
          investmentProfileGoals = mockedGoals
        })

        cy.visit("/proposal")

        cy.wait(["@userStatus", "@userQualificationStatus"])

        cy.get("footer")
          .findByRole("button", { name: commonKeys.button.continue })
          .click()

        cy.wait("@investmentGoalResponse")
        cy.location("pathname", { timeout: 10000 }).should(
          "equal",
          "/proposal/investment-goals",
        )
      })

      it("should show progress in progressbar", () => {
        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )
      })

      it("should show step name in header", () => {
        cy.get("header").findByText(
          proposalKeys.chapterSelection.chapterTwo.stepper.title,
        )
        cy.get("header").findByText("2")
      })

      it("should not navigate to next statement without answering current statement", () => {
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findByText(commonKeys.errors.required).should("be.visible")
      })

      it("should insert details in other option is selected for Q1", () => {
        investmentProfileGoals.whoIsPortfolioFor = PortfolioOwner["Other"]
        investmentProfileGoals.whoIsPortfolioForOtherDetails =
          faker.random.words(1)
        cy.findByRole("radiogroup").find("label").eq(3).click()
        cy.findByPlaceholderText(
          proposalKeys.investmentGoals.question[1].options.placeholders
            .insertDetails,
        ).type(investmentProfileGoals.whoIsPortfolioForOtherDetails)
      })

      it("should be able to navigate to Q2", () => {
        cy.intercept("/api/user/investment-goals", {
          body: investmentProfileGoals,
        }).as("goalsResponse")
        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.wait("@goalsResponse")
        cy.findByRole("heading", { level: 2 }).should(
          "have.text",
          proposalKeys.investmentGoals.question[2].title,
        )
        currentPageIndex++
      })

      it("should show increased progress in progressbar", () => {
        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )
      })

      it("should insert details in other option is selected for Q2", () => {
        cy.findByRole("group").find("label").eq(5).click()
        cy.findByPlaceholderText(
          proposalKeys.investmentGoals.question[1].options.placeholders
            .insertDetails,
        ).type(faker.random.words(1), { force: true })
      })

      it("should be able to navigate back to Q1 from Q2", () => {
        cy.intercept("/api/user/investment-goals", {
          body: investmentProfileGoals,
        }).as("goalsResponse")
        cy.findByRole("button", { name: commonKeys.button.back }).click()
        cy.findByRole("heading", { level: 2 }).should(
          "have.text",
          proposalKeys.investmentGoals.question[1].title,
        )
        currentPageIndex--
      })

      it("should show decreased progress in progressbar", () => {
        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )
      })

      it("should able to change response of Q1", () => {
        cy.findByRole("radiogroup").find("label").eq(1).click()

        investmentProfileGoals.whoIsPortfolioFor =
          PortfolioOwner.ImmediateFamily
        investmentProfileGoals.whoIsPortfolioForOtherDetails = null
      })

      it("should be able to navigate again to Q2", () => {
        cy.intercept("/api/user/investment-goals", {
          body: investmentProfileGoals,
        }).as("goalsResponse")
        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.wait("@goalsResponse")
        cy.findByRole("heading", { level: 2 }).should(
          "have.text",
          proposalKeys.investmentGoals.question[2].title,
        )
        currentPageIndex++
      })

      it("should be able to select multiple options for Q2", () => {
        investmentGoals.push(
          InvestmentGoal.MaintainLifestyle,
          InvestmentGoal.BuildGlobalPortfolio,
        )

        investmentProfileGoals.investmentGoals = investmentGoals

        const set = new Set([1, 4])

        set.forEach((element: number) => {
          cy.findByRole("group").find("label").eq(element).click()
        })
      })

      it("should be able to navigate to Q4", () => {
        investmentProfileGoals.investmentDurationInYears = 7

        cy.intercept("/api/user/investment-goals", {
          body: investmentProfileGoals,
        }).as("goalsResponse")

        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.wait("@goalsResponse")
        cy.findByRole("heading", { level: 2 }).should(
          "have.text",
          proposalKeys.investmentGoals.question[4].title,
        )
        currentPageIndex++
      })

      it("should show increased progress in progressbar", () => {
        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )
      })

      it("should display description when Time horizon selected less than equal to 7 years", () => {
        cy.findByText(
          proposalKeys.investmentGoals.question[4].options.short.title,
        ).should("be.visible")
      })

      it("should display description when Time horizon selected less than 25 years", () => {
        cy.findAllByRole("slider").eq(0).type("{rightarrow}".repeat(2))

        cy.findByText(
          proposalKeys.investmentGoals.question[4].options.long.title,
        ).should("be.visible")
      })

      it("should display description when Time horizon selected 25 years", () => {
        cy.findAllByRole("slider").eq(0).type("{rightarrow}".repeat(18))
        cy.findByText(
          proposalKeys.investmentGoals.question[4].options.indefinite
            .description,
        ).should("be.visible")
        cy.findByText(
          String(
            proposalKeys.investmentGoals.question[4].options.indefinite.title,
          ).trim(),
        ).should("be.visible")
      })

      it("should be able to navigate to Q5", () => {
        cy.intercept("/api/user/investment-goals", {
          body: investmentProfileGoals,
        }).as("goalsResponse")

        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.wait("@goalsResponse")
        cy.findByRole("heading", { level: 2 }).should(
          "have.text",
          proposalKeys.investmentGoals.question[5].title,
        )
        currentPageIndex++
      })

      it("should show increased progress in progressbar", () => {
        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )
      })

      it("should get validation error message if initial investment is entered less than $100,000", () => {
        cy.findByPlaceholderText(
          proposalKeys.investmentGoals.question[5].text.placeholder,
        ).type("99999")
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.contains(
          proposalKeys.investmentGoals.question[5].errors.minDescription,
        ).should("be.visible")
      })

      it("should get validation error message if initial investment is entered more than $25,000,000", () => {
        cy.findByPlaceholderText(
          proposalKeys.investmentGoals.question[5].text.placeholder,
        )
          .clear()
          .type("250000001")
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.contains(
          proposalKeys.investmentGoals.question[5].errors.maxDescription,
        ).should("be.visible")
      })

      it("should enter initial investment amount", () => {
        intialInvestmentAmount = "10000000"
        cy.findByPlaceholderText(
          proposalKeys.investmentGoals.question[5].text.placeholder,
        )
          .clear()
          .type(intialInvestmentAmount)
        investmentProfileGoals.investmentAmountInUSD = intialInvestmentAmount
      })

      it("should give validation error if annual topup for annual investment is greater than 25,000,000", () => {
        annualTopUp = "100000000"
        cy.findByRole("radiogroup")
          .findByText(
            proposalKeys.investmentGoals.question[5].options.yes.title,
          )
          .click()
        cy.findAllByPlaceholderText(
          proposalKeys.investmentGoals.question[5].text.placeholder,
        )
          .eq(1)
          .type(annualTopUp)
          .parent()
          .siblings("div")
          .should(
            "have.text",
            proposalKeys.investmentGoals.question[5].errors.maxDescription,
          )
      })

      it("should able to enter annual topup if user has opted yes for annual investment", () => {
        annualTopUp = "100000"
        cy.findAllByPlaceholderText(
          proposalKeys.investmentGoals.question[5].text.placeholder,
        )
          .eq(1)
          .clear()
          .type(annualTopUp)

        investmentProfileGoals.annualInvestmentTopUpAmountInUSD = annualTopUp
      })

      it("should be able to navigate to Q3", () => {
        cy.intercept("/api/user/investment-goals", {
          body: investmentProfileGoals,
        }).as("goalsResponse")

        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.wait("@goalsResponse")
        cy.findByText(proposalKeys.investmentGoals.question[3].title).should(
          "be.visible",
        )
        currentPageIndex++
      })

      it("should show increased progress in progressbar", () => {
        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )
      })

      it("should be able to choose option for Q3 as Yes", () => {
        investmentProfileGoals.shouldGenerateIncome = "yes"
        cy.findByRole("radiogroup").find("label").eq(0).click()
      })

      it("should be able to input desired annual income using slider", () => {
        cy.findAllByRole("slider").eq(0).type("{rightarrow}", { force: true })
        cy.findByLabelText("desiredAnnualIncome").then((percentage) => {
          const annualIncomePercentage = Number(
            percentage.text().replace("%", ""),
          )
          const annualIncome = formatCurrencyWithCommas(
            Math.round(
              (Number(investmentProfileGoals.investmentAmountInUSD) *
                annualIncomePercentage) /
                100,
            ).toString(),
          )
          cy.findByText(
            `${proposalKeys.investmentGoals.question[3].correspondence}${annualIncome}`,
          ).should("be.visible")

          investmentProfileGoals.desiredAnnualIncome = Number(annualIncome)
        })
      })

      it("should be able to navigate to Q6 if value selected is more than $10 Million", () => {
        investmentProfileGoals.investmentAmountInUSD = 11000000
        investmentProfileGoals.topUpInvestmentAnnually = "yes"
        investmentProfileGoals.annualInvestmentTopUpAmountInUSD = annualTopUp
        investmentProfileGoals.investmentDurationInYears = 25

        cy.intercept("/api/user/investment-goals", {
          body: investmentProfileGoals,
        }).as("goalsResponse")

        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.wait("@goalsResponse")
        cy.findByText(
          proposalKeys.investmentGoals.question[6].description,
        ).should("be.visible")
        currentPageIndex++
      })

      it("should show increased progress in progressbar", () => {
        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )
      })

      it("should be able to select multiple options for Q6", () => {
        const set = new Set([1, 2])

        set.forEach((element: number) => {
          cy.findByRole("group").find("label").eq(element).click()
        })
      })

      it("should be able to navigate back to Q3 from Q6", () => {
        cy.intercept("/api/user/investment-goals", {
          body: investmentProfileGoals,
        }).as("goalsResponse")

        cy.findByRole("button", { name: commonKeys.button.back }).click()
        cy.findAllByRole("heading", { level: 2 })
          .eq(0)
          .should("have.text", proposalKeys.investmentGoals.question[3].title)
        currentPageIndex--
      })

      it("should be able to navigate directly to Q7 if value selected is less than $10 Million", () => {
        investmentProfileGoals.annualInvestmentTopUpAmountInUSD = 300000
        investmentProfileGoals.investmentAmountInUSD = 300000

        cy.intercept("/api/user/investment-goals", {
          body: investmentProfileGoals,
        }).as("goalsResponse")

        cy.reload()

        cy.wait("@goalsResponse")

        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.findByRole("heading", {
          name: proposalKeys.investmentGoals.question[7].title,
        }).should("be.visible")
        currentPageIndex = currentPageIndex + 2
      })

      it("should show increased progress in progressbar", () => {
        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )
      })

      it("should be able to select multiple options for Q7", () => {
        const set = new Set([2, 3])

        set.forEach((element: number) => {
          cy.findAllByRole("group").eq(0).find("label").eq(element).click()
        })

        additionalPreferences.push(
          AdditionalPreference.Ethical,
          AdditionalPreference.ShariahCompliant,
        )
      })

      it("should be able to navigate directly to Q8", () => {
        investmentProfileGoals.additionalPreferences = additionalPreferences

        cy.intercept("/api/user/investment-goals", {
          body: investmentProfileGoals,
        }).as("goalsResponse")

        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.wait("@goalsResponse")

        cy.findByRole("heading", {
          level: 2,
        }).should("have.text", proposalKeys.investmentGoals.question[8].title)
        currentPageIndex = currentPageIndex + 1
      })

      it("should show increased progress in progressbar", () => {
        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )
      })

      it("should be able to select option for Q8", () => {
        cy.findByRole("radiogroup")
          .findByText(proposalKeys.investmentGoals.question[8].options.yes)
          .click()
      })

      it("should be able to complete investment goals", () => {
        investmentProfileGoals.esgCompliant = "yes"
        cy.intercept("/api/user/qualifications/status", {
          fixture: "proposalRiskAssessmentNotStarted",
        }).as("userStatus")

        cy.intercept("/api/user/investment-goals", {
          body: investmentProfileGoals,
        }).as("goalsResponse")

        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.wait("@goalsResponse")
        cy.findByText("Define investment goals")
          .parent()
          .parent()
          .siblings("div")
          .eq(0)
          .findByLabelText("Check Icon")
          .should("be.visible")

        cy.findByText(commonKeys.button.continue).should("be.visible")
      })
    },
  )
})
