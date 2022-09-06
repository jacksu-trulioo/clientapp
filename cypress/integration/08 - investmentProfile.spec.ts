import {
  InterestedInvestments,
  PriorInvestment,
  Profile,
  User,
} from "../../src/services/mytfo/types"

let selectedOption: string
let proposalKeys
let commonKeys

describe("Investment Profile - personal details to build a personalised proposal", () => {
  let user: User
  let profile: Profile
  let interestedInvestments: InterestedInvestments[] = []
  let priorInvestment: PriorInvestment[] = []
  before(() => {
    cy.loginBE()
    cy.fixture("user").then((mockedUser) => {
      user = mockedUser
      profile = user.profile
    })

    cy.fixture("../../public/locales/en/proposal").then((keys) => {
      proposalKeys = keys
    })

    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })
  })

  beforeEach(() => {
    cy.intercept("/api/user/qualifications/status", {
      fixture: "proposalJourneyNotStarted",
    }).as("userStatus")

    cy.intercept("/api/user/status", {
      fixture: "userStatusNotQualified",
    }).as("userQualificationStatus")

    cy.intercept("/api/user/profile", {
      fixture: "investmentProfileQuizNotStarted",
    }).as("investmentProfileResponse")

    cy.intercept("/api/user/preference", {
      fixture: "userPreferenceENDefault",
    }).as("languagePreference")

    cy.intercept("/api/user", { fixture: "user" }).as("user")

    cy.intercept("/api/user/relationship-manager", {
      fixture: "RMNotAssigned",
    }).as("relationshipManager")

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

    cy.intercept("/api/user/kyc/status", {
      fixture: "kycNotStarted",
    }).as("kycStatus")

    cy.intercept("/api/user/summary", {
      fixture: "userSummary",
    }).as("userSummary")

    cy.intercept("/api/user/preference/disclaimer", {
      fixture: "userDisclaimerAccepted",
    }).as("userDisclaimerAccepted")

    cy.intercept("/api/user/proposals/status", {
      fixture: "proposalsStatusNotStarted",
    }).as("proposalsStatus")

    cy.intercept("/api/user/risk-assessment", {
      fixture: "riskAssessmentQuizNotStarted",
    }).as("riskAssessmentResponse")
  })

  context("desktop", () => {
    it("should be able to start investment profile section", () => {
      cy.visit("/proposal")

      cy.findByText(proposalKeys.chapterSelection.button.getStarted).click()
      cy.location("pathname").should("equal", "/proposal/investor-profile")
    })

    it("should show progress in progressbar", () => {
      cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "16")
    })

    it("should show step name in header", () => {
      cy.get("header").findByText(proposalKeys.investorProfile.page.description)
      cy.get("header").findByText("1")
    })

    it("should populate primary phone number by default", () => {
      cy.findByLabelText("phoneCountryCode").should(
        "contain.text",
        user.profile.phoneCountryCode,
      )
      cy.findByLabelText("phoneNumber", { selector: "input" }).should(
        "have.value",
        user.profile.phoneNumber,
      )
    })

    it("should be able to edit phone number", () => {
      cy.findByLabelText("phoneCountryCode").should("not.be.disabled")
      cy.findByLabelText("phoneNumber", { selector: "input" }).should(
        "not.be.disabled",
      )
    })

    it("should display region when user selects KSA as nationality", () => {
      user.profile.nationality = "Saudi Arabia"
      cy.findByLabelText("nationality").type(user.profile.nationality)
      cy.findByRole("button", { name: user.profile.nationality }).click()
      cy.findByLabelText("region").should("be.visible")

      // for API country code is being sent
      profile.nationality = "SA"
      user.profile.nationality = "SA"
    })

    it("should able to select region when user selects KSA as nationality", () => {
      profile.region = "KSA-E"
      user.profile.region = "KSA-E"
      cy.findByLabelText("region").type("Eastern Province")
      cy.findByRole("button", {
        name: "Eastern Province",
      }).click()
    })

    it("should able to respond to CMA compliance when user selects KSA as nationality", () => {
      profile.isDefinedSophisticatedByCMA = true
      user.profile.isDefinedSophisticatedByCMA = true
      cy.findAllByRole("radiogroup")
        .eq(0)
        .findByText(
          proposalKeys.investorProfile.personalInformation.radio
            .isDefinedSophisticatedByCMA.options.yes.title,
        )
        .click()
    })

    it("should display error message if User is a US citizen", () => {
      profile.isTaxableInUS = true
      user.profile.isTaxableInUS = true

      cy.intercept("/api/user/profile", {
        body: profile,
      }).as("investorProfile")
      cy.intercept("GET", "/api/user", {
        body: user,
      }).as("userProfile")

      cy.findAllByRole("radiogroup")
        .eq(1)
        .findByText(
          proposalKeys.investorProfile.personalInformation.radio
            .isDefinedSophisticatedByCMA.options.yes.title,
        )
        .click()
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.wait(["@investorProfile", "@userProfile"])
      cy.findByRole("heading", {
        name: proposalKeys.sorryModal.heading,
      }).should("be.visible")
    })

    it("should able to go back from disqualified pop up", () => {
      cy.findByRole("button", {
        name: proposalKeys.sorryModal.button.goBack,
      }).click()
      cy.findByRole("heading", {
        name: proposalKeys.investorProfile.personalInformation.title,
      })
        .scrollIntoView()
        .should("be.visible")
    })

    it("should able to view tooltip for US taxable", () => {
      let tooltipText = String(
        proposalKeys.investorProfile.personalInformation.radio.isTaxableInUS
          .popover,
      )
        .replace(/<0>/g, "")
        .replace(/<1>/g, "")
        .replace(/<2>/g, "")
        .replace(/<3>/g, "")
        .replace(/<4>/g, "")
        .replace(/<5>/g, "")
        .replace(/<6>/g, "")
        .replace("</0>", "")
        .replace("</1>", "")
        .replace("</2>", "")
        .replace("</3>", "")
        .replace("</4>", "")
        .replace("</4>", "")
        .replace("</5>", "")
        .replace("</6>", "")
        .replace("</6>", "")
      cy.findByLabelText("Info icon").trigger("mouseover")
      cy.findByRole("tooltip").should("have.text", tooltipText)
      cy.findByLabelText("Info icon").trigger("mouseleave")
    })

    it("should able to respond if USA taxable when user selects KSA as nationality", () => {
      cy.findAllByRole("radiogroup")
        .eq(1)
        .findByText(
          proposalKeys.investorProfile.personalInformation.radio.isTaxableInUS
            .options.no.title,
        )
        .click()
    })

    it("should navigate to Investment amount statement", () => {
      profile.isTaxableInUS = false
      user.profile.isTaxableInUS = false
      profile.isDefinedSophisticatedByCMA = true
      user.profile.isDefinedSophisticatedByCMA = true

      cy.intercept("/api/user/profile", {
        body: profile,
      }).as("investorProfile")
      cy.intercept("GET", "/api/user", {
        body: user,
      }).as("userProfile")

      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.wait(["@investorProfile", "@userProfile"])

      cy.location("hash").should("equal", "#amount")
      cy.findAllByRole("heading", {
        level: 2,
      })
        .eq(0)
        .should(
          "have.text",
          proposalKeys.investorProfile.minimumInvestment.title,
        )
    })

    it("should show increased progress in progressbar", () => {
      cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "33")
    })

    it("should be able to invoke Save & Exit from Q2", () => {
      cy.findByRole("button", { name: commonKeys.button.saveAndExit }).click()

      cy.findByRole("link", { name: commonKeys.button.saveAndExit }).click()
      cy.location("pathname").should("equal", "/")
    })

    it("should prefill the user response for Q1 before save & exit action ", () => {
      cy.intercept("GET", "/api/user", {
        body: user,
      }).as("user")

      cy.visit("/proposal")
      cy.wait(["@userStatus", "@userQualificationStatus", "@user"])
      cy.findByText(proposalKeys.chapterSelection.button.getStarted).click()

      cy.location("pathname").should("equal", "/proposal/investor-profile")
      cy.findByLabelText("nationality").should("contain.text", "Saudi Arabia")

      cy.findByLabelText("region").should("contain.text", "Eastern Province")
      cy.intercept("/api/user/profile", {
        body: profile,
      }).as("investorProfile")

      cy.intercept("GET", "/api/user", {
        body: user,
      }).as("userProfile")

      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.wait(["@investorProfile", "@userProfile"])
    })

    it("should not navigate to next statement without answering current statement", () => {
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByText(commonKeys.errors.required).should("be.visible")
    })

    it("should show investment amount as $100,000 when user selects KSA as nationality", () => {
      cy.findByRole("group").siblings("p").should("contain.text", "$100,000")
    })

    it("should be able to navigate back to Q1 from Q2", () => {
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.findByText(
        proposalKeys.investorProfile.personalInformation.title,
      ).should("be.visible")
    })

    it("should show decreased progress in progressbar", () => {
      cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "16")
    })

    it("should not display region field when user change nationality other tha KSA", () => {
      user.profile.nationality = "Bangladesh"
      profile.region = null
      user.profile.region = null
      cy.findByLabelText("nationality").type(user.profile.nationality)
      cy.findByRole("button", { name: user.profile.nationality }).click()
      cy.findByLabelText("region").should("not.exist")
      profile.nationality = "BD"
      user.profile.nationality = "BD"
    })

    it("should display CBB compliance field when user change nationality other tha KSA", () => {
      profile.isAccreditedByCBB = true
      user.profile.isAccreditedByCBB = true
      profile.isDefinedSophisticatedByCMA = null
      user.profile.isDefinedSophisticatedByCMA = null
      cy.findAllByRole("radiogroup")
        .eq(0)
        .findByText(
          proposalKeys.investorProfile.personalInformation.radio
            .isAccreditedByCBB.options.yes.title,
        )
        .click()
    })

    it("should able to respond if USA taxable when user change nationality other tha KSA", () => {
      cy.findAllByRole("radiogroup")
        .eq(1)
        .findByText(
          proposalKeys.investorProfile.personalInformation.radio.isTaxableInUS
            .options.no.title,
        )
        .click()
    })

    it("should able to navigate again to Investment amount statement", () => {
      cy.intercept("/api/user/profile", {
        body: profile,
      }).as("investorProfile")
      cy.intercept("GET", "/api/user", {
        body: user,
      }).as("userProfile")

      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.wait(["@investorProfile", "@userProfile"])

      cy.location("hash").should("equal", "#amount")
      cy.findAllByRole("heading", {
        level: 2,
      })
        .eq(0)
        .should(
          "have.text",
          proposalKeys.investorProfile.minimumInvestment.title,
        )
    })

    it("should show increased progress in progressbar", () => {
      cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "33")
    })

    it("should show investment amount as $100,000 when user change nationality other tha KSA", () => {
      cy.findByRole("group").siblings("p").should("contain.text", "$100,000")
    })

    it("should display non-qualified pop up when user selected not committed to investment amount ", () => {
      user.profile.investorSurvey = {}
      /* tslint:disable-next-line */
      // @ts-ignore
      user.profile.investorSurvey.investMinimumAmount = false
      /* tslint:disable-next-line */
      // @ts-ignore
      profile.investorSurvey.investMinimumAmount = false

      cy.intercept("/api/user/profile", {
        body: profile,
      }).as("investorProfile")

      cy.intercept("GET", "/api/user", {
        body: user,
      }).as("userProfile")

      cy.findByText(
        proposalKeys.investorProfile.minimumInvestment.options.no.title,
      ).click()
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.wait(["@investorProfile", "@userProfile"])
      cy.findByRole("heading", {
        name: proposalKeys.sorryModal.heading,
      }).should("be.visible")
    })

    it("should able to go back from disqualified pop up to investment amount question", () => {
      cy.intercept("GET", "/api/user", {
        body: user,
      }).as("userProfile")
      cy.findByRole("button", {
        name: proposalKeys.sorryModal.button.goBack,
      }).click()
      cy.findAllByRole("heading", { level: 2 })
        .eq(0)
        .should(
          "have.text",
          proposalKeys.investorProfile.minimumInvestment.title,
        )
    })

    it("should able to input intended investment when user selects Yes for investment amount", () => {
      user.profile.investorSurvey.whenToStartInvestment = "ThisMonth"
      profile.investorSurvey.whenToStartInvestment = "ThisMonth"
      /* tslint:disable-next-line */
      // @ts-ignore
      user.profile.investorSurvey.investMinimumAmount = true
      /* tslint:disable-next-line */
      // @ts-ignore
      profile.investorSurvey.investMinimumAmount = true
      cy.findByText(
        proposalKeys.investorProfile.minimumInvestment.options.yes.title,
      ).click()
      cy.findByText(commonKeys.select.placeholder).type("This Month")
      cy.findByRole("button", {
        name: proposalKeys.investorProfile.minimumInvestment.select.timeFrame
          .options.thisMonth,
      }).click()
    })

    it("should able to navigate again to interested investments statement", () => {
      cy.intercept("/api/user/profile", {
        body: profile,
      }).as("investorProfile")

      cy.intercept("GET", "/api/user", {
        body: user,
      }).as("userProfile")
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.wait(["@investorProfile", "@userProfile"])

      cy.location("hash").should("equal", "#interested-investments")
      cy.findAllByRole("heading", { level: 2 })
        .eq(0)
        .should(
          "have.text",
          proposalKeys.investorProfile.interestedInvestment.title,
        )
    })

    it("should show increased progress in progressbar", () => {
      cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "50")
    })

    it("should not navigate to next question without adding comment for other option", () => {
      interestedInvestments.push(InterestedInvestments.Other)

      profile.investorSurvey.interestedInvestments = interestedInvestments

      cy.findByRole("group").find("label").eq(6).click()

      cy.intercept("/api/user/profile", {
        body: profile,
      }).as("investorProfile")

      cy.intercept("GET", "/api/user", {
        body: user,
      }).as("userProfile")

      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByText(commonKeys.errors.required).should("be.visible")
    })

    it("should add information for Others option", () => {
      profile.investorSurvey.otherInterestedInvDetails = "details"
      cy.findByPlaceholderText(
        proposalKeys.investorProfile.interestedInvestment
          .otherInterestedInvestmentDetails.placeholder,
      ).type(profile.investorSurvey.otherInterestedInvDetails)
    })

    it("should able to navigate to Investment experience statement", () => {
      user.profile.investorSurvey.interestedInvestments = interestedInvestments
      profile.investorSurvey.interestedInvestments = interestedInvestments
      cy.intercept("/api/user/profile", {
        body: profile,
      }).as("investorProfile")

      cy.intercept("GET", "/api/user", {
        body: user,
      }).as("userProfile")

      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.wait(["@investorProfile", "@userProfile"])
      cy.findByRole("heading", {
        name: proposalKeys.investorProfile.investmentExperience.title,
      }).should("be.visible")
    })

    it("should be able to navigate back to Q2 from Q3", () => {
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.findByText(
        proposalKeys.investorProfile.interestedInvestment.title,
      ).should("be.visible")
    })

    it("should insert details in other option is selected for Q2", () => {
      selectedOption = Math.random().toString(36).slice(-5)
      cy.findByPlaceholderText(
        proposalKeys.investorProfile.interestedInvestment
          .otherInterestedInvestmentDetails.placeholder,
      ).type(selectedOption)
    })

    it("should be able to select multiple options for interested investments", () => {
      // to get number of options to select
      const set = new Set()

      for (let index = 0; index < 2; index++) {
        set.add(Math.floor(Math.random() * 4) + 1)
      }

      set.forEach((element: number) => {
        cy.findAllByRole("group")
          .eq(0)
          .find("label")
          .eq(element)
          .then(($option) => {
            interestedInvestments.push(
              InterestedInvestments[$option.text().replace(/\s/g, "")],
            )
          })
          .click()
      })
    })

    it("should able to navigate to Investment experience statement", () => {
      user.profile.investorSurvey.interestedInvestments = interestedInvestments
      profile.investorSurvey.interestedInvestments = interestedInvestments
      cy.intercept("/api/user/profile", {
        body: profile,
      }).as("investorProfile")

      cy.intercept("GET", "/api/user", {
        body: user,
      }).as("userProfile")

      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.wait(["@investorProfile", "@userProfile"])
      cy.findByRole("heading", {
        name: proposalKeys.investorProfile.investmentExperience.title,
      }).should("be.visible")
    })

    it("should show increased progress in progressbar", () => {
      cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "66")
    })

    it("should able to select response of investment experience", () => {
      cy.findByRole("radiogroup")
        .find("label")
        .eq(Math.ceil(Math.random() * 3))
        .then(($option) => {
          selectedOption = $option.text()
        })
        .click()
    })

    it("should able to navigate to prior Investment experience statement", () => {
      user.profile.investorSurvey.investmentExperience = selectedOption
      profile.investorSurvey.investmentExperience = selectedOption

      cy.intercept("/api/user/profile", {
        body: profile,
      }).as("investorProfile")

      cy.intercept("GET", "/api/user", {
        body: user,
      }).as("userProfile")

      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.wait(["@investorProfile", "@userProfile"])
      cy.findByText(
        proposalKeys.investorProfile.priorExperience.placeholderQuestion,
      ).should("be.visible")
    })

    it("should be able to select multiple options for investment experience", () => {
      // to get number of options to select
      const set = new Set()

      for (let index = 0; index < 2; index++) {
        set.add(Math.floor(Math.random() * 4) + 1)
      }

      set.forEach((element: number) => {
        cy.findAllByRole("group")
          .eq(0)
          .find("label")
          .eq(element)
          .then(($option) => {
            priorInvestment.push(
              PriorInvestment[$option.text().replace(/\s/g, "")],
            )
          })
          .click()
      })
    })

    it("should be able to select other for investment experience without entering comments", () => {
      cy.findAllByRole("group")
        .eq(0)
        .find("label")
        .eq(5)
        .then(($option) => {
          priorInvestment.push(
            PriorInvestment[$option.text().replace(/\s/g, "")],
          )
        })
        .click()
    })

    it("should be able to complete investment profile", () => {
      user.profile.investorSurvey.priorInvExperience = priorInvestment
      profile.investorSurvey.priorInvExperience = priorInvestment

      cy.intercept("/api/user/qualifications/status", {
        fixture: "proposalInvestmentGoalsNotStarted",
      }).as("userStatus")

      cy.intercept("/api/user/profile", {
        body: profile,
      }).as("investorProfile")

      cy.intercept("/api/user/status", {
        fixture: "userStatusQualified",
      }).as("userQualificationStatus")

      cy.intercept("GET", "/api/user", {
        body: user,
      }).as("userProfile")

      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.wait(["@investorProfile", "@userProfile"])
      cy.wait("@userStatus")
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
  })

  context(
    "mobile",
    {
      viewportHeight: 812,
      viewportWidth: 375,
    },
    () => {
      before(() => {
        cy.fixture("user").then((mockedUser) => {
          user = mockedUser
          profile = user.profile
        })
      })

      it("should be able to start investment profile section", () => {
        cy.visit("/proposal")
        cy.wait(["@userStatus", "@user"])
        cy.get("footer")
          .findByRole("button", {
            name: proposalKeys.chapterSelection.button.getStarted,
          })
          .click()
        cy.location("pathname").should("equal", "/proposal/investor-profile")
      })

      it("should show step name in header", () => {
        cy.get("header").findByText(
          proposalKeys.investorProfile.page.description,
        )
        cy.get("header").findByText("1")
      })

      it("should show progress in progressbar", () => {
        cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "16")
      })

      it("should populate primary phone number by default", () => {
        cy.findByLabelText("phoneCountryCode").should(
          "contain.text",
          user.profile.phoneCountryCode,
        )
        cy.findByLabelText("phoneNumber", { selector: "input" }).should(
          "have.value",
          user.profile.phoneNumber,
        )
      })

      it("should be able to edit phone number", () => {
        cy.findByLabelText("phoneCountryCode").should("not.be.disabled")
        cy.findByLabelText("phoneNumber", { selector: "input" }).should(
          "not.be.disabled",
        )
      })

      it("should display region when user selects KSA as nationality", () => {
        user.profile.nationality = "Saudi Arabia"
        cy.findByLabelText("nationality").type(user.profile.nationality)
        cy.findByRole("button", { name: user.profile.nationality }).click()
        cy.findByLabelText("region").should("be.visible")
        // for API country code is being sent
        profile.nationality = "SA"
        user.profile.nationality = "SA"
      })

      it("should able to select region when user selects KSA as nationality", () => {
        profile.region = "KSA-E"
        user.profile.region = "KSA-E"
        cy.findByLabelText("region").type("Eastern Province")
        cy.findByRole("button", {
          name: "Eastern Province",
        }).click()
      })

      it("should able to respond to CMA compliance when user selects KSA as nationality", () => {
        profile.isDefinedSophisticatedByCMA = true
        user.profile.isDefinedSophisticatedByCMA = true
        cy.findAllByRole("radiogroup")
          .eq(0)
          .findByText(
            proposalKeys.investorProfile.personalInformation.radio
              .isDefinedSophisticatedByCMA.options.yes.title,
          )
          .click()
      })

      it("should display error message if User is a US citizen", () => {
        profile.isTaxableInUS = true
        user.profile.isTaxableInUS = true

        cy.intercept("/api/user/profile", {
          body: profile,
        }).as("investorProfile")
        cy.intercept("GET", "/api/user", {
          body: user,
        }).as("userProfile")

        cy.findAllByRole("radiogroup")
          .eq(1)
          .findByText(
            proposalKeys.investorProfile.personalInformation.radio
              .isDefinedSophisticatedByCMA.options.yes.title,
          )
          .click()
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.wait(["@investorProfile", "@userProfile"])
        cy.findByRole("heading", {
          name: proposalKeys.sorryModal.heading,
        }).should("be.visible")
      })

      it("should able to go back from disqualified pop up", () => {
        cy.findByRole("button", {
          name: proposalKeys.sorryModal.button.goBack,
        }).click()
        cy.findByRole("heading", {
          name: proposalKeys.investorProfile.personalInformation.title,
        })
          .scrollIntoView()
          .should("be.visible")
      })

      it("should able to view tooltip for US taxable", () => {
        let tooltipText = String(
          proposalKeys.investorProfile.personalInformation.radio.isTaxableInUS
            .popover,
        )
          .replace(/<0>/g, "")
          .replace(/<1>/g, "")
          .replace(/<2>/g, "")
          .replace(/<3>/g, "")
          .replace(/<4>/g, "")
          .replace(/<5>/g, "")
          .replace(/<6>/g, "")
          .replace("</0>", "")
          .replace("</1>", "")
          .replace("</2>", "")
          .replace("</3>", "")
          .replace("</4>", "")
          .replace("</4>", "")
          .replace("</5>", "")
          .replace("</6>", "")
          .replace("</6>", "")
        cy.findByLabelText("Info icon").trigger("mouseover")
        cy.findByRole("tooltip").should("have.text", tooltipText)
        cy.findByLabelText("Info icon").trigger("mouseleave")
      })

      it("should able to respond if USA taxable when user selects KSA as nationality", () => {
        cy.findAllByRole("radiogroup")
          .eq(1)
          .findByText(
            proposalKeys.investorProfile.personalInformation.radio.isTaxableInUS
              .options.no.title,
          )
          .click({ force: true })
      })

      it("should navigate to Investment amount statement", () => {
        profile.isTaxableInUS = false
        user.profile.isTaxableInUS = false
        profile.isDefinedSophisticatedByCMA = true
        user.profile.isDefinedSophisticatedByCMA = true

        cy.intercept("/api/user/profile", {
          body: profile,
        }).as("investorProfile")
        cy.intercept("GET", "/api/user", {
          body: user,
        }).as("userProfile")

        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.wait(["@investorProfile", "@userProfile"])
        cy.findByText(
          proposalKeys.investorProfile.minimumInvestment.minimumAmount,
        ).should("be.visible")
      })

      it("should show increased progress in progressbar", () => {
        cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "33")
      })

      it("should be able to invoke Save & Exit from Q2", () => {
        cy.findByRole("button", { name: commonKeys.button.saveAndExit }).click()
        cy.findByRole("link", {
          name: commonKeys.button.saveAndExit,
        }).click()
        cy.location("pathname").should("equal", "/")
      })

      it("should prefill the user response for Q1 before save & exit action ", () => {
        cy.intercept("GET", "/api/user", {
          body: user,
        }).as("userProfile")

        cy.visit("/proposal")
        cy.wait(["@userStatus", "@userQualificationStatus", "@userProfile"])
        cy.get("footer")
          .findByRole("button", {
            name: proposalKeys.chapterSelection.button.getStarted,
          })
          .click()
        cy.findByLabelText("nationality").should("contain.text", "Saudi Arabia")

        cy.findByLabelText("region").should("contain.text", "Eastern Province")
        cy.intercept("/api/user/profile", {
          body: profile,
        }).as("investorProfile")

        cy.intercept("GET", "/api/user", {
          body: user,
        }).as("userProfile")

        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.wait(["@investorProfile", "@userProfile"])
      })

      it("should not navigate to next statement without answering current statement", () => {
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findByText(commonKeys.errors.required).should("be.visible")
      })

      it("should show investment amount as $100,000 when user selects KSA as nationality", () => {
        cy.findByRole("group").siblings("p").should("contain.text", "$100,000")
      })

      it("should be able to navigate back to Q1 from Q2", () => {
        cy.findByRole("button", { name: commonKeys.button.back }).click()
        cy.findAllByRole("heading", { level: 2 })
          .eq(0)
          .should(
            "have.text",
            proposalKeys.investorProfile.personalInformation.title,
          )
      })

      it("should show decreased progress in progressbar", () => {
        cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "16")
      })

      it("should not display region field when user change nationality other tha KSA", () => {
        user.profile.nationality = "Bangladesh"
        profile.region = null
        user.profile.region = null
        cy.findByLabelText("nationality").type(user.profile.nationality)
        cy.findByRole("button", { name: user.profile.nationality }).click()
        cy.findByLabelText("region").should("not.exist")
        profile.nationality = "BD"
        user.profile.nationality = "BD"
      })

      it("should display CBB compliance field when user change nationality other tha KSA", () => {
        profile.isAccreditedByCBB = true
        user.profile.isAccreditedByCBB = true
        profile.isDefinedSophisticatedByCMA = null
        user.profile.isDefinedSophisticatedByCMA = null
        cy.findAllByRole("radiogroup")
          .eq(0)
          .findByText(
            proposalKeys.investorProfile.personalInformation.radio
              .isAccreditedByCBB.options.yes.title,
          )
          .click()
      })

      it("should able to respond if USA taxable when user change nationality other tha KSA", () => {
        cy.findAllByRole("radiogroup")
          .eq(1)
          .findByText("No")
          .click({ force: true })
      })

      it("should able to navigate again to Investment amount statement", () => {
        cy.intercept("/api/user/profile", {
          body: profile,
        }).as("investorProfile")
        cy.intercept("GET", "/api/user", {
          body: user,
        }).as("userProfile")

        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.wait(["@investorProfile", "@userProfile"])
        cy.findByText(
          proposalKeys.investorProfile.minimumInvestment.minimumAmount,
        ).should("be.visible")
      })

      it("should show increased progress in progressbar", () => {
        cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "33")
      })

      it("should show investment amount as $100,000 when user change nationality other tha KSA", () => {
        cy.findByRole("group").siblings("p").should("contain.text", "$100,000")
      })

      it("should display non-qualified pop up when user selected not committed to investment amount ", () => {
        user.profile.investorSurvey = {}
        /* tslint:disable-next-line */
        // @ts-ignore
        user.profile.investorSurvey.investMinimumAmount = false
        /* tslint:disable-next-line */
        // @ts-ignore
        profile.investorSurvey.investMinimumAmount = false

        cy.intercept("/api/user/profile", {
          body: profile,
        }).as("investorProfile")

        cy.intercept("GET", "/api/user", {
          body: user,
        }).as("userProfile")

        cy.findByText("No").click()
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.wait(["@investorProfile", "@userProfile"])
        cy.findAllByRole("heading", {
          name: proposalKeys.sorryModal.heading,
        })
          .eq(0)
          .should("be.visible")
      })

      it("should able to go back from disqualified pop up to investment amount question", () => {
        cy.intercept("GET", "/api/user", {
          body: user,
        }).as("userProfile")
        cy.findByRole("button", {
          name: proposalKeys.sorryModal.button.goBack,
        }).click()
        cy.findAllByRole("heading", { level: 2 })
          .eq(0)
          .should(
            "have.text",
            proposalKeys.investorProfile.minimumInvestment.title,
          )
      })

      it("should able to input intended investment when user selects Yes for investment amount", () => {
        user.profile.investorSurvey.whenToStartInvestment = "ThisMonth"
        profile.investorSurvey.whenToStartInvestment = "ThisMonth"
        /* tslint:disable-next-line */
        // @ts-ignore
        user.profile.investorSurvey.investMinimumAmount = true
        /* tslint:disable-next-line */
        // @ts-ignore
        profile.investorSurvey.investMinimumAmount = true
        cy.findByText(
          proposalKeys.investorProfile.minimumInvestment.options.yes.title,
        ).click()
        cy.findByText(commonKeys.select.placeholder).type("This Month")
        cy.findByRole("button", {
          name: proposalKeys.investorProfile.minimumInvestment.select.timeFrame
            .options.thisMonth,
        }).click()
      })

      it("should able to navigate again to interested investments statement", () => {
        cy.intercept("/api/user/profile", {
          body: profile,
        }).as("investorProfile")

        cy.intercept("GET", "/api/user", {
          body: user,
        }).as("userProfile")
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.wait(["@investorProfile", "@userProfile"])
        cy.findByText(
          proposalKeys.investorProfile.interestedInvestment.text,
        ).should("be.visible")
      })

      it("should show increased progress in progressbar", () => {
        cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "50")
      })

      it("should insert details in other option is selected for Q1", () => {
        cy.findByRole("group").find("label").eq(6).click({ force: true })
        selectedOption = Math.random().toString(36).slice(-5)
        cy.findByPlaceholderText(
          proposalKeys.investorProfile.interestedInvestment
            .otherInterestedInvestmentDetails.placeholder,
        ).type(selectedOption, { force: true })
      })

      it("should be able to select multiple options for interested investments", () => {
        // to get number of options to select
        const set = new Set()

        for (let index = 0; index < 2; index++) {
          set.add(Math.floor(Math.random() * 4) + 1)
        }

        set.forEach((element: number) => {
          cy.findAllByRole("group")
            .eq(0)
            .find("label")
            .eq(element)
            .then(($option) => {
              interestedInvestments.push(
                InterestedInvestments[$option.text().replace(/\s/g, "")],
              )
            })
            .click()
        })
      })

      it("should able to navigate to Investment experience statement", () => {
        user.profile.investorSurvey.interestedInvestments =
          interestedInvestments
        profile.investorSurvey.interestedInvestments = interestedInvestments
        cy.intercept("/api/user/profile", {
          body: profile,
        }).as("investorProfile")

        cy.intercept("GET", "/api/user", {
          body: user,
        }).as("userProfile")

        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.wait(["@investorProfile", "@userProfile"])
        cy.findByText(
          proposalKeys.investorProfile.investmentExperience.placeholderQuestion,
        ).should("be.visible")
      })

      it("should show increased progress in progressbar", () => {
        cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "66")
      })

      it("should able to select response of investment experience", () => {
        cy.findByRole("radiogroup")
          .find("label")
          .eq(Math.ceil(Math.random() * 3))
          .then(($option) => {
            selectedOption = $option.text()
          })
          .click()
      })

      it("should able to navigate to prior Investment experience statement", () => {
        user.profile.investorSurvey.investmentExperience = selectedOption
        profile.investorSurvey.investmentExperience = selectedOption

        cy.intercept("/api/user/profile", {
          body: profile,
        }).as("investorProfile")

        cy.intercept("GET", "/api/user", {
          body: user,
        }).as("userProfile")

        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.wait(["@investorProfile", "@userProfile"])
        cy.findByText(
          proposalKeys.investorProfile.priorExperience.placeholderQuestion,
        ).should("be.visible")
      })

      it("should be able to select multiple options for investment experience", () => {
        // to get number of options to select
        const set = new Set()

        for (let index = 0; index < 2; index++) {
          set.add(Math.floor(Math.random() * 4) + 1)
        }

        set.forEach((element: number) => {
          cy.findAllByRole("group")
            .eq(0)
            .find("label")
            .eq(element)
            .then(($option) => {
              priorInvestment.push(
                PriorInvestment[$option.text().replace(/\s/g, "")],
              )
            })
            .click()
        })
      })

      it("should be able to complete investment profile", () => {
        user.profile.investorSurvey.priorInvExperience = priorInvestment
        profile.investorSurvey.priorInvExperience = priorInvestment

        cy.intercept("/api/user/qualifications/status", {
          fixture: "proposalInvestmentGoalsNotStarted",
        }).as("userStatus")

        cy.intercept("/api/user/profile", {
          body: profile,
        }).as("investorProfile")

        cy.intercept("GET", "/api/user", {
          body: user,
        }).as("userProfile")

        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.wait(["@investorProfile", "@userProfile"])
        cy.wait("@userStatus")
        cy.findByText(proposalKeys.chapterSelection.button.getStarted).should(
          "not.exist",
        )

        cy.findByText("Complete your investor profile")
          .parent()
          .parent()
          .siblings("div")
          .eq(0)
          .findByLabelText("Check Icon")
          .should("be.visible")
        cy.findByRole("button", {
          name: commonKeys.button.continue,
        }).should("be.visible")
      })
    },
  )
})
