import { KycInvestmentExperience } from "../../src/services/mytfo/types"

describe("KYC - Investment Experience: ", () => {
  let kycKeys
  let commonKeys
  let investmentExperience: KycInvestmentExperience
  const pages = 4

  before(() => {
    cy.fixture("../../public/locales/en/kyc").then((keys) => {
      kycKeys = keys
    })

    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })

    cy.fixture("investmentExperienceJourneyNotStarted").then((keys) => {
      investmentExperience = keys
    })
    cy.loginBE()
  })
  beforeEach(() => {
    cy.intercept("/api/user/preference", {
      fixture: "userPreferenceENDefault",
    }).as("languagePreference")

    cy.intercept("/api/user", { fixture: "saudiNationalityUser" }).as("user")

    cy.intercept("/api/user/kyc/status", {
      fixture: "kycStatusStep1Completed",
    }).as("kycStatus")

    cy.intercept("/api/user/kyc/investment-experience", {
      fixture: "investmentExperienceJourneyNotStarted",
    }).as("kycInvestmentExperience")

    cy.intercept("/api/user/relationship-manager", {
      fixture: "RMAssigned",
    }).as("relationshipManager")

    cy.intercept("/api/user/kyc/personal-information", {
      fixture: "kycPersonalInformation",
    }).as("kycPersonalInformation")
  })

  context("desktop", () => {
    let currentPageIndex = 0

    it("should start investment experience flow", () => {
      cy.visit("/kyc")
      cy.findByRole("button", {
        name: kycKeys.chapterSelection.button.continueOnComputer,
      }).click()

      cy.location("pathname").should("equal", "/kyc/investment-experience")
    })

    it("should show progress in progressbar", () => {
      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )
    })

    it("should display wealth allocation % age based on components", () => {
      let remainingAllocation = 100
      let currentAllocation = 0
      for (let i = 0; i < 5; i++) {
        cy.findAllByRole("group").eq(i).type("5")
        currentAllocation = currentAllocation + 5
        remainingAllocation = 100 - currentAllocation
      }

      let allocatedPercentageText = String(
        kycKeys.investmentExperience.currentInvestments.body
          .allocatedPercentage,
      ).replace("{{amount}}", currentAllocation.toString())
      let remainingPercentageText = String(
        kycKeys.investmentExperience.currentInvestments.body
          .remainingPercentage,
      ).replace("{{amount}}", remainingAllocation.toString())

      cy.findByLabelText("allocatedPercentage").should(
        "have.text",
        allocatedPercentageText,
      )
      cy.findByLabelText("remainingPercentage").should(
        "have.text",
        remainingPercentageText,
      )

      investmentExperience.wealth = {}

      investmentExperience.wealth.cash = 5
      investmentExperience.wealth.stockEquities = 5
      investmentExperience.wealth.hedgeFunds = 5
      investmentExperience.wealth.privateEquity = 5
      investmentExperience.wealth.bonds = 5
    })

    it("should throw validation error if user enters more than 100% in component", () => {
      cy.findAllByRole("group").eq(6).clear().type("200")
      cy.findAllByRole("group").eq(5).click()
      cy.findByText(
        kycKeys.investmentExperience.currentInvestments.errors.inputMax100,
      ).should("be.visible")
    })

    it.skip("should throw validation error if user enters other than integer in component", () => {
      cy.findAllByRole("group").eq(6).type(".5")
      cy.findAllByRole("group").eq(5).click()

      cy.findByText(commonKeys.errors.onlyInteger).should("be.visible")
    })

    it("should allocation wealth percentage to 100%", () => {
      for (let i = 2; i < 7; i++) {
        cy.findAllByRole("group").eq(i).clear().type("18")
      }

      let allocatedPercentageText = String(
        kycKeys.investmentExperience.currentInvestments.body
          .allocatedPercentage,
      ).replace("{{amount}}", "100")
      let remainingPercentageText = String(
        kycKeys.investmentExperience.currentInvestments.body
          .remainingPercentage,
      ).replace("{{amount}}", "0")

      cy.findByLabelText("allocatedPercentage").should(
        "have.text",
        allocatedPercentageText,
      )
      cy.findByLabelText("remainingPercentage").should(
        "have.text",
        remainingPercentageText,
      )

      investmentExperience.wealth.hedgeFunds = 18
      investmentExperience.wealth.privateEquity = 18
      investmentExperience.wealth.stockEquities = 18
      investmentExperience.wealth.realEstate = 18
      investmentExperience.wealth.other = 18
    })

    it("should throw error if user allocates more than 100%", () => {
      cy.findAllByRole("group").eq(6).clear().type("20")

      investmentExperience.wealth.other = 20

      cy.findByText(
        kycKeys.investmentExperience.currentInvestments.errors.max100,
      ).should("be.visible")
    })

    it("should correct %age to 100%", () => {
      cy.findAllByRole("group").eq(6).clear().type("18")

      investmentExperience.wealth.other = 18
    })

    it("should navigate to current investments screen with increased progress bar", () => {
      currentPageIndex++
      cy.intercept("/api/user/kyc/investment-experience", {
        body: investmentExperience,
      }).as("kycInvestmentExperience")
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )

      cy.findAllByRole("heading", { level: 2 })
        .eq(0)
        .should(
          "have.text",
          kycKeys.investmentExperience.currentInvestments.sidebar.title,
        )
    })

    it("should respond to current investment details", () => {
      cy.findByRole("radiogroup")
        .findByText(kycKeys.investmentExperience.holdingInformation.body.yes)
        .click()
      investmentExperience.concentratedPositionDetails = "my details"
      investmentExperience.holdConcentratedPosition = "yes"

      cy.findByPlaceholderText(
        kycKeys.investmentExperience.holdingInformation.body.details,
      ).type(investmentExperience.concentratedPositionDetails)
    })

    it("should navigate to Financial Experience screen with increased progress bar", () => {
      currentPageIndex++
      cy.intercept("/api/user/kyc/investment-experience", {
        body: investmentExperience,
      }).as("kycInvestmentExperience")
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )

      cy.findAllByRole("heading", { level: 2 })
        .eq(0)
        .should(
          "have.text",
          kycKeys.investmentExperience.receivedInvestmentAdvisory.sidebar.title,
        )
    })

    it("should respond to financial investment details screen 1", () => {
      cy.findAllByRole("radiogroup")
        .eq(0)
        .findByText(
          kycKeys.investmentExperience.receivedInvestmentAdvisory.body.radios
            .yes,
        )
        .click()
      cy.findAllByRole("radiogroup")
        .eq(1)
        .findByText(
          kycKeys.investmentExperience.receivedInvestmentAdvisory.body.radios
            .yes,
        )
        .click()
      investmentExperience.investmentInFinancialInstruments = "yes"
      investmentExperience.receivedInvestmentAdvisory = "yes"
    })

    it("should navigate to Financial Experience screen 2 with increased progress bar", () => {
      currentPageIndex++
      cy.intercept("/api/user/kyc/investment-experience", {
        body: investmentExperience,
      }).as("kycInvestmentExperience")
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )

      cy.findAllByRole("heading", { level: 2 })
        .eq(0)
        .should(
          "have.text",
          kycKeys.investmentExperience.receivedInvestmentAdvisory.sidebar.title,
        )
    })

    it("should enter details for investment experience over last 5 years", () => {
      investmentExperience.financialTransactions = [
        "CommoditiesOrCommoditiesCertificates",
        "DerivativesOrCfdOrOptionsOrLeverageCertificates",
        "HedgeFundsOrManagedFutureFunds",
        "PrivateEquityOrVentureCapital",
      ]

      for (let i = 0; i < 4; i++) {
        cy.findByRole("group").find("div").eq(i).click()
      }
    })

    it("should complete investment experience section", () => {
      cy.intercept("/api/user/kyc/investment-experience", {
        body: investmentExperience,
      }).as("kycInvestmentExperience")

      cy.intercept("/api/user/kyc/status", {
        fixture: "kycStatusStep2Completed",
      }).as("kycStatus")

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.location("pathname").should("equal", "/kyc")
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

      it("should start investment experience flow", () => {
        cy.fixture("investmentExperienceJourneyNotStarted").then((keys) => {
          investmentExperience = keys
        })
        cy.visit("/kyc")
        cy.get("footer")
          .findByRole("button", {
            name: kycKeys.chapterSelection.button.continueOnComputer,
          })
          .click()

        cy.location("pathname").should("equal", "/kyc/investment-experience")
      })

      it("should show progress in progressbar", () => {
        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )
      })

      it("should display wealth allocation % age based on components", () => {
        let remainingAllocation = 100
        let currentAllocation = 0
        for (let i = 0; i < 5; i++) {
          cy.findAllByRole("group").eq(i).type("5")
          currentAllocation = currentAllocation + 5
          remainingAllocation = 100 - currentAllocation
        }

        let allocatedPercentageText = String(
          kycKeys.investmentExperience.currentInvestments.body
            .allocatedPercentage,
        ).replace("{{amount}}", currentAllocation.toString())
        let remainingPercentageText = String(
          kycKeys.investmentExperience.currentInvestments.body
            .remainingPercentage,
        ).replace("{{amount}}", remainingAllocation.toString())

        cy.findByLabelText("allocatedPercentage").should(
          "have.text",
          allocatedPercentageText,
        )
        cy.findByLabelText("remainingPercentage").should(
          "have.text",
          remainingPercentageText,
        )

        investmentExperience.wealth = {}

        investmentExperience.wealth.cash = 5
        investmentExperience.wealth.stockEquities = 5
        investmentExperience.wealth.hedgeFunds = 5
        investmentExperience.wealth.privateEquity = 5
        investmentExperience.wealth.bonds = 5
      })

      it("should throw validation error if user enters more than 100% in component", () => {
        cy.findAllByRole("group").eq(6).find("input").clear().type("200")
        cy.findAllByRole("group").eq(5).click()
        cy.findByText(
          kycKeys.investmentExperience.currentInvestments.errors.inputMax100,
        ).should("be.visible")
      })

      it.skip("should throw validation error if user enters other than integer in component", () => {
        cy.findAllByRole("group").eq(6).find("input").clear().type("1.5")
        cy.findAllByRole("group").eq(5).click()

        cy.findByText(commonKeys.errors.onlyInteger).should("be.visible")
      })

      it("should allocation wealth percentage to 100%", () => {
        for (let i = 2; i < 7; i++) {
          cy.findAllByRole("group").eq(i).find("input").clear().type("18")
        }

        let allocatedPercentageText = String(
          kycKeys.investmentExperience.currentInvestments.body
            .allocatedPercentage,
        ).replace("{{amount}}", "100")
        let remainingPercentageText = String(
          kycKeys.investmentExperience.currentInvestments.body
            .remainingPercentage,
        ).replace("{{amount}}", "0")

        cy.findByLabelText("allocatedPercentage").should(
          "have.text",
          allocatedPercentageText,
        )
        cy.findByLabelText("remainingPercentage").should(
          "have.text",
          remainingPercentageText,
        )

        investmentExperience.wealth.hedgeFunds = 18
        investmentExperience.wealth.privateEquity = 18
        investmentExperience.wealth.stockEquities = 18
        investmentExperience.wealth.realEstate = 18
        investmentExperience.wealth.other = 18
      })

      it("should throw error if user allocates more than 100%", () => {
        cy.findAllByRole("group").eq(6).find("input").clear().type("20")

        investmentExperience.wealth.other = 20

        cy.findByText(
          kycKeys.investmentExperience.currentInvestments.errors.max100,
        ).should("be.visible")
      })

      it("should correct %age to 100%", () => {
        cy.findAllByRole("group").eq(6).find("input").clear().type("18")

        investmentExperience.wealth.other = 18
      })

      it("should navigate to current investments screen with increased progress bar", () => {
        currentPageIndex++
        cy.intercept("/api/user/kyc/investment-experience", {
          body: investmentExperience,
        }).as("kycInvestmentExperience")
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )

        cy.findAllByRole("heading", { level: 2 })
          .eq(0)
          .should(
            "have.text",
            kycKeys.investmentExperience.currentInvestments.sidebar.title,
          )
      })

      it("should respond to current investment details", () => {
        cy.findByRole("radiogroup")
          .findByText(kycKeys.investmentExperience.holdingInformation.body.yes)
          .click()
        investmentExperience.concentratedPositionDetails = "my details"
        investmentExperience.holdConcentratedPosition = "yes"

        cy.findByPlaceholderText(
          kycKeys.investmentExperience.holdingInformation.body.details,
        ).type(investmentExperience.concentratedPositionDetails)
      })

      it("should navigate to Financial Experience screen with increased progress bar", () => {
        currentPageIndex++
        cy.intercept("/api/user/kyc/investment-experience", {
          body: investmentExperience,
        }).as("kycInvestmentExperience")
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )

        cy.findAllByRole("heading", { level: 2 })
          .eq(0)
          .should(
            "have.text",
            kycKeys.investmentExperience.receivedInvestmentAdvisory.sidebar
              .title,
          )
      })

      it("should respond to financial investment details screen 1", () => {
        cy.findAllByRole("radiogroup")
          .eq(0)
          .findByText(
            kycKeys.investmentExperience.receivedInvestmentAdvisory.body.radios
              .yes,
          )
          .click()
        cy.findAllByRole("radiogroup")
          .eq(1)
          .findByText(
            kycKeys.investmentExperience.receivedInvestmentAdvisory.body.radios
              .yes,
          )
          .click()
        investmentExperience.investmentInFinancialInstruments = "yes"
        investmentExperience.receivedInvestmentAdvisory = "yes"
      })

      it("should navigate to Financial Experience screen 2 with increased progress bar", () => {
        currentPageIndex++
        cy.intercept("/api/user/kyc/investment-experience", {
          body: investmentExperience,
        }).as("kycInvestmentExperience")
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )

        cy.findAllByRole("heading", { level: 2 })
          .eq(0)
          .should(
            "have.text",
            kycKeys.investmentExperience.receivedInvestmentAdvisory.sidebar
              .title,
          )
      })

      it("should enter details for investment experience over last 5 years", () => {
        investmentExperience.financialTransactions = [
          "CommoditiesOrCommoditiesCertificates",
          "DerivativesOrCfdOrOptionsOrLeverageCertificates",
          "HedgeFundsOrManagedFutureFunds",
          "PrivateEquityOrVentureCapital",
        ]

        for (let i = 0; i < 4; i++) {
          cy.findByRole("group").find("div").eq(i).click()
        }
      })

      it("should complete investment experience section", () => {
        cy.intercept("/api/user/kyc/investment-experience", {
          body: investmentExperience,
        }).as("kycInvestmentExperience")

        cy.intercept("/api/user/kyc/status", {
          fixture: "kycStatusStep2Completed",
        }).as("kycStatus")

        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.location("pathname").should("equal", "/kyc")
      })
    },
  )
})
