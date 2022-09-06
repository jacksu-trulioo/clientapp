import { Matcher } from "@testing-library/dom"

import {
  AccountHolderRelationship,
  EmploymentActivity,
  EmploymentSector,
  Gender,
  KycPersonalInformation,
  KycPersonalInformationAddress,
  KycPersonalInformationCompanyDetails,
  KycPersonalInformationEmployerDetails,
  KycPersonalInformationEmploymentDetails,
  KycPersonalInformationIncomeDetails,
  KycPersonalInformationPepCheck,
  KycPersonalInformationTaxInformation,
  NameTitle,
  NoTinReason,
  PepCheck,
  TinInformation,
  User,
} from "../../src/services/mytfo/types"

describe("KYC - Manual updating of Personal Information for other than KSA national", () => {
  let kycKeys
  let commonKeys
  let userDetails: User
  let currentMonth: Matcher
  let currentYear: Matcher
  const pages = 13

  before(() => {
    cy.fixture("../../public/locales/en/kyc").then((keys) => {
      kycKeys = keys
    })

    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })

    cy.fixture("indiaNationalityUser").then((keys) => {
      userDetails = keys
    })

    cy.loginBE()

    let date = new Date()
    currentMonth = date.toLocaleString("en-us", { month: "long" })
    currentYear = date.toLocaleString("en-us", { year: "numeric" })
  })

  beforeEach(() => {
    cy.intercept("/api/user/preference", {
      fixture: "userPreferenceENDefault",
    }).as("languagePreference")

    cy.intercept("/api/user/relationship-manager", {
      fixture: "RMAssigned",
    }).as("relationshipManager")

    cy.intercept("/api/user", { fixture: "indiaNationalityUser" }).as("user")

    cy.intercept("/api/user/kyc/status", {
      fixture: "kycNotStarted",
    }).as("kycStatus")

    cy.intercept("/api/user/kyc/send-otp", {
      fixture: "sendOtp",
    }).as("sendOtp")

    cy.intercept("/api/user/kyc/personal-information", {
      fixture: "kycPersonalInformation",
    }).as("kycPersonalInformation")
  })

  context("desktop", () => {
    let currentPageIndex = 0
    let personalInformation: KycPersonalInformation = {}
    let address1: KycPersonalInformationAddress
    let employmentDetails: KycPersonalInformationEmploymentDetails = {}
    let companyDetails: KycPersonalInformationCompanyDetails = {}
    let incomeDetails: KycPersonalInformationIncomeDetails = {}
    let taxInformation: KycPersonalInformationTaxInformation = {}
    let listOfTins: TinInformation[] = []

    it("should start personal information flow", () => {
      cy.visit("/kyc")
      cy.findByRole("button", {
        name: kycKeys.chapterSelection.button.getStarted,
      }).click()

      cy.location("pathname").should("equal", "/kyc/personal-information")
    })

    it("should show progress in progressbar", () => {
      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )
    })

    it("should prefill firstName and lastName", () => {
      personalInformation.firstName = userDetails.profile.firstName
      personalInformation.lastName = userDetails.profile.lastName
      cy.findByLabelText("firstName", { selector: "input" }).should(
        "have.value",
        personalInformation.firstName,
      )
      cy.findByLabelText("lastName", { selector: "input" }).should(
        "have.value",
        personalInformation.lastName,
      )
    })

    it("should have disabled firstName and lastName", () => {
      personalInformation.firstName = userDetails.profile.firstName
      personalInformation.lastName = userDetails.profile.lastName
      cy.findByLabelText("firstName", { selector: "input" }).should(
        "be.disabled",
      )
      cy.findByLabelText("lastName", { selector: "input" }).should(
        "be.disabled",
      )
    })

    it("should get validation error on clicking next without entering mandatory fields", () => {
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findAllByText(commonKeys.errors.required).should("have.length", 2)
    })

    it("should enter personal information (title and middleName)", () => {
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      personalInformation.title = NameTitle.Mr
      cy.findByLabelText("title").type(
        commonKeys.select.options.title[personalInformation.title],
      )
      cy.findByRole("button", {
        name: commonKeys.select.options.title[personalInformation.title],
      }).click()

      personalInformation.middleName = "middleName"

      cy.findByLabelText("middleName", { selector: "input" }).type(
        personalInformation.middleName,
      )
    })

    it("should navigate to personal information (birthDetails) screen with increased progress bar", () => {
      currentPageIndex++
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )
    })

    it("should have prefilled nationality", () => {
      personalInformation.nationality = userDetails.profile.nationality

      cy.findByLabelText("nationality").should("contain.text", "India")
    })

    it("should enter personal information (birthDetails)", () => {
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      personalInformation.gender = Gender.Male
      cy.findByLabelText("gender").type(personalInformation.gender)
      cy.findByRole("button", { name: personalInformation.gender }).click()

      personalInformation.dateOfBirth = new Date("17/11/1980")

      cy.findAllByPlaceholderText("DD/MM/YYYY").eq(1).click()

      cy.findByText("2004").click()
      cy.findByText("1980").click()

      cy.findByText(currentMonth).click()
      cy.findByText("November").click()

      cy.findByText("17").click()

      personalInformation.countryOfBirth = "IN"

      cy.findByLabelText("countryOfBirth").type("India")

      cy.findByRole("button", { name: "India" }).click()

      personalInformation.placeOfBirth = "placeOfBirth"

      cy.findByLabelText("placeOfBirth", { selector: "input" }).type(
        personalInformation.placeOfBirth,
      )
    })

    it("should halt the flow if user selects other nationality as North Korea", () => {
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      personalInformation.otherNationality = "KP"
      cy.findByLabelText("otherNationality", { selector: "div" })
        .click()
        .type("North Korea")

      cy.findByRole("button", { name: "North Korea" }).click()

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.findByRole("dialog")
        .should("contain.text", kycKeys.sorryModal.heading)
        .should("be.visible")
    })

    it("should navigate back from sorry modal", () => {
      cy.findByRole("dialog")
        .findByRole("button", { name: kycKeys.sorryModal.button.goBack })
        .click()
    })

    it("should halt the flow if user selects other nationality as Iran", () => {
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      personalInformation.otherNationality = "IR"
      cy.findByLabelText("otherNationality", { selector: "div" })
        .click()
        .type("Iran")

      cy.findByRole("button", { name: "Iran" }).click()

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.findByRole("dialog")
        .should("contain.text", kycKeys.sorryModal.heading)
        .should("be.visible")
    })

    it("should close sorry modal", () => {
      cy.findByRole("dialog").findByLabelText("Close").click()
    })

    it("should halt the flow if user selects other nationality as US", () => {
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      personalInformation.otherNationality = "US"
      cy.findByLabelText("otherNationality", { selector: "div" })
        .click()
        .type("United States")

      cy.findByRole("button", { name: "United States" }).click()

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.findByRole("dialog")
        .should("contain.text", kycKeys.sorryModal.heading)
        .should("be.visible")
    })

    it("should close sorry modal", () => {
      cy.findByRole("dialog").findByLabelText("Close").click()
    })

    it("should enter other nationality", () => {
      personalInformation.otherNationality = "BH"

      cy.findByLabelText("otherNationality").type("Bahrain")

      cy.findByRole("button", { name: "Bahrain" }).click()
    })

    it("should navigate to address details screen with increased progress bar", () => {
      currentPageIndex++
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )
    })

    it("should get validation error on clicking next without entering mandatory address fields", () => {
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findAllByText(commonKeys.errors.required).should("have.length", 2)
    })

    it("should give format validation error in postcode", () => {
      cy.findByLabelText("address1.postcode").type("dwiu#$@")
    })

    it("should have prefilled Country of residence", () => {
      cy.findByLabelText("country").should("contain.text", "India")
    })

    it("should enter address Details", () => {
      personalInformation.address1 = {}
      address1 = {}
      address1.address = "myAddress"
      cy.findAllByLabelText("address1.address").type(address1.address)

      address1.city = "myCity"
      cy.findAllByLabelText("address1.city").type(address1.city)

      address1.postcode = "postcode1"
      cy.findByLabelText("address1.postcode").clear().type(address1.postcode)

      personalInformation.address1 = address1
    })

    it("should navigate to ID screen with increased progressbar", () => {
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      currentPageIndex++
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )
    })

    it("should enter ID details", () => {
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      personalInformation.nationalIdNumber = "1234567890"
      personalInformation.passportNumber = "India"

      cy.findAllByLabelText("nationalIdNumber", { selector: "input" }).type(
        personalInformation.nationalIdNumber,
      )
      cy.findAllByLabelText("passportNumber", { selector: "input" }).type(
        personalInformation.passportNumber,
      )
    })

    it("should navigate to next page for employment details with increased progressbar", () => {
      currentPageIndex++

      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )

      cy.findByText(
        kycKeys.personalInformation.KycEmploymentDetails.title,
      ).should("be.visible")
    })

    it("should select Employment Type as SelfEmployed", () => {
      personalInformation.employmentActivity = EmploymentActivity.SelfEmployed

      const employment =
        kycKeys.personalInformation.KycEmploymentDetails.select
          .employmentActivity.options[personalInformation.employmentActivity]
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      cy.findByLabelText("employmentActivity").type(employment)
      cy.findByRole("button", {
        name: employment,
      }).click()
    })

    it("should get validation error on clicking next without entering mandatory employment details fields", () => {
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findAllByText(commonKeys.errors.required).should("have.length", 4)
    })

    it("should enter employment details when employment type is SelfEmployed", () => {
      employmentDetails.employmentSector = EmploymentSector.education
      employmentDetails.yearsOfProfessionalExperience = 15
      employmentDetails.jobTitle = "Professor"
      employmentDetails.areYouDirectorOfListedCompany = "no"
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      cy.findByLabelText("employmentSector").type(
        employmentDetails.employmentSector,
      )
      cy.findByRole("button", {
        name: employmentDetails.employmentSector,
      }).click()

      cy.findAllByLabelText(
        "employmentDetails.yearsOfProfessionalExperience",
      ).type(employmentDetails.yearsOfProfessionalExperience.toString())
      cy.findAllByLabelText("employmentDetails.jobTitle").type(
        employmentDetails.jobTitle,
      )

      cy.findByRole("radiogroup").findByText("No").click()

      personalInformation.employmentDetails = employmentDetails
    })

    it("should navigate to next page for company details with increased progressbar", () => {
      currentPageIndex++
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )

      cy.findByText(
        kycKeys.personalInformation.KycEmployerDetails.title.companyDetails,
      )
    })

    it("should enter the company details", () => {
      companyDetails.country = "IN"
      companyDetails.nameOfCompany = "BHEL"
      companyDetails.address = "address"
      companyDetails.city = "Cochin"
      companyDetails.postcode = "111111"
      companyDetails.estimatedAnnualRevenue = "$1,000,000 - $5,000,000"
      companyDetails.estimatedNumberOfEmployees = "501 – 1000"

      cy.findByLabelText("country").type("India")
      cy.findByRole("button", { name: "India" }).click()

      cy.findByLabelText("employerDetails.nameOfCompany").type(
        companyDetails.nameOfCompany,
      )
      cy.findByLabelText("employerDetails.address").type(companyDetails.address)

      cy.findByLabelText("employerDetails.city").type(companyDetails.city)

      cy.findByLabelText("employerDetails.postcode").type(
        companyDetails.postcode,
      )

      cy.findByLabelText("estimatedNumberOfEmployees").type(
        companyDetails.estimatedNumberOfEmployees,
      )
      cy.findByRole("button", {
        name: companyDetails.estimatedNumberOfEmployees,
      }).click()

      cy.findByLabelText("estimatedAnnualRevenue").type(
        companyDetails.estimatedAnnualRevenue,
      )
      cy.findByRole("button", {
        name: companyDetails.estimatedAnnualRevenue,
      }).click()

      personalInformation.companyDetails = companyDetails
    })

    it("should be navigated to Income details page after providing employer details with increased progressbar", () => {
      currentPageIndex++
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

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
          kycKeys.personalInformation.kycIncomeDetails.heading,
        )
    })

    it("should able to navigate back to company details screen", () => {
      currentPageIndex--
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      cy.findByRole("button", { name: commonKeys.button.back }).click()

      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )

      cy.findAllByRole("heading", { level: 2 })
        .eq(0)
        .should(
          "have.text",
          kycKeys.personalInformation.KycEmployerDetails.title.companyDetails,
        )
    })

    it("should able to navigate back to for employment details with decreased progressbar", () => {
      currentPageIndex--
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      cy.findByRole("button", { name: commonKeys.button.back }).click()

      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )

      cy.findAllByRole("heading", { level: 2 })
        .eq(0)
        .should(
          "have.text",
          kycKeys.personalInformation.KycEmploymentDetails.title,
        )
    })

    it("should select Employment Type as ‘UnEmployed’", () => {
      personalInformation.employmentActivity = EmploymentActivity.Unemployed
      personalInformation.employmentDetails = null
      personalInformation.companyDetails = null
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      cy.findByLabelText("employmentActivity").type(
        personalInformation.employmentActivity,
      )
      cy.findByRole("button", {
        name: personalInformation.employmentActivity,
      }).click()
    })

    it("should be navigated directly to Income details page when user is unemployed with increased progressbar", () => {
      currentPageIndex = currentPageIndex + 2
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )

      cy.findByText(
        kycKeys.personalInformation.kycIncomeDetails.heading,
      ).should("be.visible")
    })

    it("should get validation error on clicking next without entering mandatory income details", () => {
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findAllByText(commonKeys.errors.required).should("have.length", 2)
      cy.findAllByText(commonKeys.errors.atleastOne).should("have.length", 2)
    })

    it("should be able to view tooltip for net worth in USD", () => {
      cy.findByLabelText("netWorth").find("svg").eq(0).trigger("mouseover")
      cy.findByText(
        kycKeys.personalInformation.kycIncomeDetails.select.netWorth.tooltip
          .text,
      ).should("be.visible")
      cy.findByLabelText("netWorth").find("svg").eq(0).trigger("mouseleave")
    })

    it("should be able to view tooltip for source of wealth", () => {
      cy.findByLabelText("sourceOfWealth")
        .find("svg")
        .eq(0)
        .trigger("mouseover")
      cy.findByText(
        kycKeys.personalInformation.kycIncomeDetails.select.sourceOfWealth
          .tooltip.text,
      ).should("be.visible")
      cy.findByLabelText("sourceOfWealth")
        .find("svg")
        .eq(0)
        .trigger("mouseleave")
    })

    it("should be able to view tooltip for source of funds", () => {
      cy.findByLabelText("sourceOfFunds").find("svg").eq(0).trigger("mouseover")
      cy.findByText(
        kycKeys.personalInformation.kycIncomeDetails.select.sourceOfFunds
          .tooltip.text,
      ).should("be.visible")
      cy.findByLabelText("sourceOfFunds")
        .find("svg")
        .eq(0)
        .trigger("mouseleave")
    })

    it("should enter income details", () => {
      incomeDetails.annualIncome =
        kycKeys.personalInformation.kycIncomeDetails.select.annualIncome.options.Above10000k

      incomeDetails.netWorth =
        kycKeys.personalInformation.kycIncomeDetails.select.netWorth.options.Above100000k

      incomeDetails.sourceOfWealth = [
        kycKeys.personalInformation.kycIncomeDetails.select.sourceOfWealth
          .options.Inheritance,
        kycKeys.personalInformation.kycIncomeDetails.select.sourceOfWealth
          .options.FamilyTrustIncome,
      ]
      incomeDetails.sourceOfFunds = [
        kycKeys.personalInformation.kycIncomeDetails.select.sourceOfFunds
          .options.Inheritance,
        kycKeys.personalInformation.kycIncomeDetails.select.sourceOfFunds
          .options.InvestmentIncome,
      ]

      cy.findByLabelText("annualIncome").type(incomeDetails.annualIncome)
      cy.findByRole("button", { name: incomeDetails.annualIncome }).click()

      cy.findByLabelText("netWorth").type(incomeDetails.netWorth)
      cy.findByRole("button", { name: incomeDetails.netWorth }).click()

      incomeDetails.sourceOfWealth.forEach((source) => {
        cy.findByLabelText("sourceOfWealth").type(source)
        cy.findByRole("button", { name: source }).click()
      })

      incomeDetails.sourceOfFunds.forEach((source) => {
        cy.findByLabelText("sourceOfFunds").type(source)
        cy.findByRole("button", { name: source }).click()
      })

      personalInformation.incomeDetails = incomeDetails
    })

    it("should be navigated to Tax information details page with increased progressbar", () => {
      currentPageIndex++
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

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
          kycKeys.personalInformation.kycTaxInformation.title,
        )
    })

    it("should preselect not taxable in US", () => {
      cy.findByRole("radiogroup")
        .findByText("No")
        .parent("span")
        .should("have.attr", "data-checked")
    })

    it("should be able to view tooltip for tax domicile", () => {
      cy.findByLabelText("locationOfMainTaxDomicile")
        .find("svg")
        .eq(0)
        .trigger("mouseover")
      cy.findByText(
        kycKeys.personalInformation.kycTaxInformation.select
          .locationOfMainTaxDomicile.tooltip.label,
      ).should("be.visible")
      cy.findByLabelText("locationOfMainTaxDomicile")
        .find("svg")
        .eq(0)
        .trigger("mouseleave")
    })

    it("should be able to view tooltip for tax residences", () => {
      cy.findAllByLabelText("Info icon").eq(0).trigger("mouseover")
      cy.findByText(
        kycKeys.personalInformation.kycTaxInformation.select
          .countriesOfTaxResidency.tooltip.label,
      ).should("be.visible")
      cy.findAllByLabelText("Info icon").eq(0).trigger("mouseleave")
    })

    it("should be able to view tooltip for US taxable", () => {
      cy.findAllByLabelText("Info icon").eq(0).trigger("mouseover")
      cy.findByText(
        kycKeys.personalInformation.kycTaxInformation.radio.taxableInUsa.label,
      ).should("be.visible")
      cy.findAllByLabelText("Info icon").eq(0).trigger("mouseleave")
    })

    it("should get validation error on clicking next without entering mandatory tax details", () => {
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findAllByText(commonKeys.errors.required).should("have.length", 2)
    })

    it("should halt journey if user selects tax domicile as North Korea", () => {
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      taxInformation.taxableInUSA = false
      taxInformation.locationOfMainTaxDomicile = "KP"

      let tinInformation: TinInformation = {}

      tinInformation.countriesOfTaxResidency = "OM"

      listOfTins.push(tinInformation)

      taxInformation.tinInformation = listOfTins

      cy.findByLabelText("locationOfMainTaxDomicile").type("North Korea")
      cy.findByRole("button", { name: "North Korea" }).click()

      cy.findByLabelText(
        "taxInformation.tinInformation[0].countriesOfTaxResidency",
      ).type("Oman")
      cy.findByRole("button", { name: "Oman" }).click()

      personalInformation.taxInformation = taxInformation

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.findByRole("dialog")
        .should("contain.text", kycKeys.sorryModal.heading)
        .should("be.visible")
    })

    it("should navigate back from sorry modal", () => {
      cy.findByRole("dialog")
        .findByRole("button", { name: kycKeys.sorryModal.button.goBack })
        .click()
    })

    it("should halt journey if user selects tax domicile as Iran", () => {
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      taxInformation.taxableInUSA = false
      taxInformation.locationOfMainTaxDomicile = "IR"

      cy.findByLabelText("locationOfMainTaxDomicile").type("Iran")
      cy.findByRole("button", { name: "Iran" }).click()

      personalInformation.taxInformation = taxInformation

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.findByRole("dialog")
        .should("contain.text", kycKeys.sorryModal.heading)
        .should("be.visible")
    })

    it("should navigate back from sorry modal", () => {
      cy.findByRole("dialog")
        .findByRole("button", { name: kycKeys.sorryModal.button.goBack })
        .click()
    })

    it("should halt journey if user selects tax domicile as US", () => {
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      taxInformation.taxableInUSA = false
      taxInformation.locationOfMainTaxDomicile = "US"

      cy.findByLabelText("locationOfMainTaxDomicile").type("United States")
      cy.findByRole("button", { name: "United States" }).click()

      personalInformation.taxInformation = taxInformation

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.findByRole("dialog")
        .should("contain.text", kycKeys.sorryModal.heading)
        .should("be.visible")
    })

    it("should navigate back from sorry modal", () => {
      cy.findByRole("dialog")
        .findByRole("button", { name: kycKeys.sorryModal.button.goBack })
        .click()
    })

    it("should halt journey if user selects tax residence as North Korea", () => {
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      taxInformation.taxableInUSA = false
      taxInformation.locationOfMainTaxDomicile = "OM"

      let tinInformation: TinInformation = {}

      tinInformation.countriesOfTaxResidency = "KP"

      listOfTins.push(tinInformation)

      taxInformation.tinInformation = listOfTins

      cy.findByLabelText("locationOfMainTaxDomicile").type("Oman")
      cy.findByRole("button", { name: "Oman" }).click()

      cy.findByLabelText(
        "taxInformation.tinInformation[0].countriesOfTaxResidency",
      ).type("North Korea")
      cy.findByRole("button", { name: "North Korea" }).click()

      personalInformation.taxInformation = taxInformation

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.findByRole("dialog")
        .should("contain.text", kycKeys.sorryModal.heading)
        .should("be.visible")
    })

    it("should navigate back from sorry modal", () => {
      cy.findByRole("dialog")
        .findByRole("button", { name: kycKeys.sorryModal.button.goBack })
        .click()
    })

    it("should halt journey if user selects tax residence as US", () => {
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      let tinInformation: TinInformation = {}

      tinInformation.countriesOfTaxResidency = "US"

      listOfTins = []

      listOfTins.push(tinInformation)

      taxInformation.tinInformation = listOfTins

      cy.findByLabelText(
        "taxInformation.tinInformation[0].countriesOfTaxResidency",
      ).type("United States")
      cy.findByRole("button", { name: "United States" }).click()

      personalInformation.taxInformation = taxInformation

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.findByRole("dialog")
        .should("contain.text", kycKeys.sorryModal.heading)
        .should("be.visible")
    })

    it("should navigate back from sorry modal", () => {
      cy.findByRole("dialog")
        .findByRole("button", { name: kycKeys.sorryModal.button.goBack })
        .click()
    })

    it("should halt journey if user selects tax residence as Iran", () => {
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      let tinInformation: TinInformation = {}

      tinInformation.countriesOfTaxResidency = "IR"
      listOfTins = []

      listOfTins.push(tinInformation)

      taxInformation.tinInformation = listOfTins

      cy.findByLabelText(
        "taxInformation.tinInformation[0].countriesOfTaxResidency",
      ).type("Iran")
      cy.findByRole("button", { name: "Iran" }).click()

      personalInformation.taxInformation = taxInformation

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.findByRole("dialog")
        .should("contain.text", kycKeys.sorryModal.heading)
        .should("be.visible")
    })

    it("should navigate back from sorry modal", () => {
      cy.findByRole("dialog")
        .findByRole("button", { name: kycKeys.sorryModal.button.goBack })
        .click()
    })

    it("should input tax information", () => {
      taxInformation.locationOfMainTaxDomicile = "BH"

      let tinInformation: TinInformation = {}

      tinInformation.countriesOfTaxResidency = "OM"
      tinInformation.haveNoTin = false
      tinInformation.globalTaxIdentificationNumber = null
      tinInformation.reasonForNoTin = null
      tinInformation.reasonForNoTinExplanation = null

      listOfTins = []

      listOfTins.push(tinInformation)

      taxInformation.tinInformation = listOfTins

      cy.findByLabelText("locationOfMainTaxDomicile").type("Bahrain")
      cy.findByRole("button", { name: "Bahrain" }).click()

      cy.findByLabelText(
        "taxInformation.tinInformation[0].countriesOfTaxResidency",
      ).type("Oman")
      cy.findByRole("button", { name: "Oman" }).click()

      personalInformation.taxInformation = taxInformation
    })

    it("should halt journey if user selects taxable in US", () => {
      taxInformation.taxableInUSA = true

      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      cy.findByRole("radiogroup").findByText("Yes").click()

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.findByRole("dialog")
        .should("contain.text", kycKeys.sorryModal.heading)
        .should("be.visible")
    })

    it("should navigate back from sorry modal", () => {
      cy.findByRole("dialog")
        .findByRole("button", { name: kycKeys.sorryModal.button.goBack })
        .click()
    })

    it("should add 3 tax residences", () => {
      cy.findByText(
        kycKeys.personalInformation.kycTaxInformation.button.addNew.label,
      ).click()

      let tinInformation1: TinInformation = {}
      tinInformation1.countriesOfTaxResidency = "PK"
      tinInformation1.haveNoTin = false
      tinInformation1.globalTaxIdentificationNumber = null
      tinInformation1.reasonForNoTin = null
      tinInformation1.reasonForNoTinExplanation = null

      listOfTins.push(tinInformation1)

      let tinInformation2: TinInformation = {}
      tinInformation2.countriesOfTaxResidency = "IN"
      tinInformation2.haveNoTin = false
      tinInformation2.globalTaxIdentificationNumber = null
      tinInformation2.reasonForNoTin = null
      tinInformation2.reasonForNoTinExplanation = null

      listOfTins.push(tinInformation2)

      taxInformation.tinInformation = listOfTins

      cy.findByLabelText(
        "taxInformation.tinInformation[1].countriesOfTaxResidency",
      ).type("Pakistan")
      cy.findByRole("button", { name: "Pakistan" }).click()

      cy.findByText(
        kycKeys.personalInformation.kycTaxInformation.button.addNew.label,
      ).click()

      cy.findByLabelText(
        "taxInformation.tinInformation[2].countriesOfTaxResidency",
      ).type("India")
      cy.findByRole("button", { name: "India" }).click()

      personalInformation.taxInformation = taxInformation
    })

    it("should check radio button as not taxable in US", () => {
      taxInformation.taxableInUSA = false

      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      cy.findByRole("radiogroup").findByText("No").click()
    })

    it("should not show option to add 4th tax residence", () => {
      cy.findByText(
        kycKeys.personalInformation.kycTaxInformation.button.addNew.label,
      ).should("not.exist")
    })

    it("should be navigated to Tax information screen 2 with increased progressbar", () => {
      currentPageIndex++
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

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
          kycKeys.personalInformation.kycTaxInformation.title,
        )
    })

    it("should give validation error without mentioning TIN details", () => {
      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.findAllByText(commonKeys.errors.required).should("have.length", 3)
    })

    it("should able to view tooltip for each TIN details", () => {
      const tooltipText = String(
        kycKeys.personalInformation.kycTaxInformation.input
          .globalTaxIdentificationNumber.tooltip.text,
      )
        .replace(/<link>/g, "")
        .replace("</link>", "")
      for (let i = 0; i < 3; i++) {
        cy.findAllByLabelText("Info icon")
          .eq(i)
          .then((tooltip) => {
            cy.wrap(tooltip).click()
            cy.wrap(tooltip)
              .parent()
              .siblings("div")
              .should("have.text", tooltipText)
          })
      }
    })

    it("should select all inputs as TIN not available", () => {
      for (let i = 0; i < 3; i++) {
        cy.findAllByText(
          kycKeys.personalInformation.kycTaxInformation.checkbox.haveTin.label,
        )
          .eq(i)
          .click()

        cy.findByLabelText(
          `taxInformation.tinInformation[${i}].reasonForNoTin`,
        ).type(
          kycKeys.personalInformation.kycTaxInformation.select.reasonForNoTin
            .options.NoTinRequired,
        )

        cy.findByRole("button", {
          name: kycKeys.personalInformation.kycTaxInformation.select
            .reasonForNoTin.options.NoTinRequired,
        }).click()

        listOfTins[i].haveNoTin = true
        listOfTins[i].reasonForNoTin = NoTinReason.NoTinRequired
      }

      personalInformation.taxInformation.tinInformation = listOfTins
    })

    it("should navigate to PEP check screen with increased progressbar without mentioning TIN details", () => {
      currentPageIndex = currentPageIndex + 4
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )

      cy.findAllByRole("heading", { level: 2 })
        .eq(0)
        .should("have.text", kycKeys.personalInformation.KycPepCheck.title)
    })

    it("should able to navigate back to TIN details screen with decreased progressbar", () => {
      currentPageIndex = currentPageIndex - 4
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      cy.findByRole("button", { name: commonKeys.button.back }).click()

      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )

      cy.findAllByRole("heading", { level: 2 })
        .eq(0)
        .should(
          "have.text",
          kycKeys.personalInformation.kycTaxInformation.title,
        )
    })

    it("should able to navigate back to Tax information screen with decreased progressbar", () => {
      currentPageIndex--
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      cy.findByRole("button", { name: commonKeys.button.back }).click()

      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )

      cy.findAllByRole("heading", { level: 2 })
        .eq(0)
        .should(
          "have.text",
          kycKeys.personalInformation.kycTaxInformation.title,
        )
    })

    it("should change tax residence", () => {
      taxInformation.locationOfMainTaxDomicile = "CN"
      cy.findByLabelText("locationOfMainTaxDomicile").type("China")
      cy.findByRole("button", { name: "China" }).click()

      listOfTins[2].haveNoTin = false
      listOfTins[2].reasonForNoTin = null
      listOfTins[2].globalTaxIdentificationNumber = null
      listOfTins[2].countriesOfTaxResidency = "BD"

      taxInformation.tinInformation = listOfTins

      cy.findByLabelText(
        "taxInformation.tinInformation[2].countriesOfTaxResidency",
      ).type("Bangladesh")
      cy.findByRole("button", { name: "Bangladesh" }).click()
    })

    it("should be navigated to Tax information screen 2 with increased progressbar", () => {
      currentPageIndex++
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

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
          kycKeys.personalInformation.kycTaxInformation.title,
        )
    })

    it("should change tin details for one residency", () => {
      const tindetails = "1234567"
      listOfTins[2].haveNoTin = false
      listOfTins[2].reasonForNoTin = null
      listOfTins[2].globalTaxIdentificationNumber = tindetails
      taxInformation.tinInformation = listOfTins

      cy.findByLabelText(
        "taxInformation.tinInformation[2].globalTaxIdentificationNumber",
      ).type(tindetails)
    })

    it("should navigate to PEP check screen with increased progressbar with TIN details", () => {
      currentPageIndex = currentPageIndex + 4
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )

      cy.findAllByRole("heading", { level: 2 })
        .eq(0)
        .should("have.text", kycKeys.personalInformation.KycPepCheck.title)
    })

    it("should give validation error without mentioning PEP details", () => {
      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.findAllByText(commonKeys.errors.required).should("have.length", 1)
    })

    it("should able to view tooltip for PEP details", () => {
      const tooltipText = String(
        kycKeys.personalInformation.KycPepCheck.tooltip.text,
      )

      cy.findByLabelText("Info icon").trigger("mouseover")

      cy.findByText(tooltipText).should("be.visible")

      cy.findByLabelText("Info icon").trigger("mouseleave")
    })

    it("should answer user is PEP", () => {
      let personalInformationCheck: KycPersonalInformationPepCheck = {}
      personalInformationCheck.optionValue = PepCheck.YesIamPep
      personalInformationCheck.dateOfAppointment = new Date(
        "2021-10-10T00:00:00",
      )
      cy.findByRole("group").find("label").eq(0).click()

      cy.findAllByPlaceholderText("DD/MM/YYYY").eq(1).click()

      cy.findByText(currentYear).click()
      cy.findByText("1980").click()

      cy.findByText(currentMonth).click()
      cy.findByText("October").click()

      cy.findByText("10").click()
    })

    it("should answer user is related to PEP", () => {
      let personalInformationCheck: KycPersonalInformationPepCheck = {}
      personalInformationCheck.optionValue = PepCheck.YesIamPepRelated
      personalInformationCheck.dateOfAppointment = new Date(
        "2021-10-10T00:00:00",
      )
      personalInformationCheck.fullLegalName = "John Doe"
      personalInformationCheck.accountHolderRelationship =
        AccountHolderRelationship.ParentOfPep
      personalInformationCheck.jurisdiction = "AFG"

      cy.findByRole("radiogroup").find("label").eq(2).click()
      cy.findByLabelText("pepCheck.fullLegalName").type(
        personalInformationCheck.fullLegalName,
      )

      cy.findByLabelText("accountHolderRelationship").type("Parent")
      cy.findByRole("button", { name: "Parent" }).click()

      cy.findByLabelText("jurisdiction").type("Afghanistan")
      cy.findByRole("button", { name: "Afghanistan" }).click()
    })

    it("should complete personal information section", () => {
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      cy.intercept("/api/user/kyc/status", {
        fixture: "kycStatusStep1Completed",
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
      let personalInformation: KycPersonalInformation = {}
      let address1: KycPersonalInformationAddress
      let employmentDetails: KycPersonalInformationEmploymentDetails = {}
      let lastEmployerDetails: KycPersonalInformationEmployerDetails = {}
      let employerDetails: KycPersonalInformationEmployerDetails = {}
      let incomeDetails: KycPersonalInformationIncomeDetails = {}
      let taxInformation: KycPersonalInformationTaxInformation = {}
      let listOfTins: TinInformation[] = []

      it("should start personal information flow", () => {
        cy.visit("/kyc")
        cy.get("footer")
          .findByRole("button", {
            name: kycKeys.chapterSelection.button.getStarted,
          })
          .click()

        cy.location("pathname").should("equal", "/kyc/personal-information")
      })

      it("should show progress in progressbar", () => {
        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )
      })

      it("should prefill firstName and lastName", () => {
        personalInformation.firstName = userDetails.profile.firstName
        personalInformation.lastName = userDetails.profile.lastName
        cy.findByLabelText("firstName", { selector: "input" }).should(
          "have.value",
          personalInformation.firstName,
        )
        cy.findByLabelText("lastName", { selector: "input" }).should(
          "have.value",
          personalInformation.lastName,
        )
      })

      it("should have disabled firstName and lastName", () => {
        personalInformation.firstName = userDetails.profile.firstName
        personalInformation.lastName = userDetails.profile.lastName
        cy.findByLabelText("firstName", { selector: "input" }).should(
          "be.disabled",
        )
        cy.findByLabelText("lastName", { selector: "input" }).should(
          "be.disabled",
        )
      })

      it("should get validation error on clicking next without entering mandatory fields", () => {
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findAllByText(commonKeys.errors.required).should("have.length", 2)
      })

      it("should enter personal information (title and middleName)", () => {
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        personalInformation.title = NameTitle.Mr
        cy.findByLabelText("title").type(
          commonKeys.select.options.title[personalInformation.title],
        )
        cy.findByRole("button", {
          name: commonKeys.select.options.title[personalInformation.title],
        }).click()

        personalInformation.middleName = "middleName"

        cy.findByLabelText("middleName", { selector: "input" }).type(
          personalInformation.middleName,
        )
      })

      it("should navigate to personal information (birthDetails) screen with increased progress bar", () => {
        currentPageIndex++
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )
      })

      it("should have prefilled nationality", () => {
        personalInformation.nationality = userDetails.profile.nationality

        cy.findByLabelText("nationality").should("contain.text", "India")
      })

      it("should enter personal information (birthDetails)", () => {
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        personalInformation.gender = Gender.Male
        cy.findByLabelText("gender").type(personalInformation.gender)
        cy.findByRole("button", { name: personalInformation.gender }).click()

        personalInformation.dateOfBirth = new Date("17/11/1980")

        cy.findAllByPlaceholderText("DD/MM/YYYY").eq(1).click()

        cy.findByText("2004").click()
        cy.findByText("1980").click()

        cy.findByText(currentMonth).click()
        cy.findByText("November").click()

        cy.findByText("17").click()

        personalInformation.countryOfBirth = "IN"

        cy.findByLabelText("countryOfBirth").type("India")

        cy.findByRole("button", { name: "India" }).click()

        personalInformation.placeOfBirth = "placeOfBirth"

        cy.findByLabelText("placeOfBirth", { selector: "input" }).type(
          personalInformation.placeOfBirth,
        )
      })

      it("should halt the flow if user selects other nationality as North Korea", () => {
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        personalInformation.otherNationality = "KP"
        cy.findByLabelText("otherNationality", { selector: "div" })
          .click()
          .type("North Korea")

        cy.findByRole("button", { name: "North Korea" }).click()

        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.findByRole("dialog")
          .should("contain.text", kycKeys.sorryModal.heading)
          .should("be.visible")
      })

      it("should navigate back from sorry modal", () => {
        cy.findByRole("dialog")
          .findByRole("button", { name: kycKeys.sorryModal.button.goBack })
          .click()
      })

      it("should halt the flow if user selects other nationality as Iran", () => {
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        personalInformation.otherNationality = "IR"
        cy.findByLabelText("otherNationality", { selector: "div" })
          .click()
          .type("Iran")

        cy.findByRole("button", { name: "Iran" }).click()

        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.findByRole("dialog")
          .should("contain.text", kycKeys.sorryModal.heading)
          .should("be.visible")
      })

      it("should close sorry modal", () => {
        cy.findByRole("dialog").findByLabelText("Close").click()
      })

      it("should halt the flow if user selects other nationality as US", () => {
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        personalInformation.otherNationality = "US"
        cy.findByLabelText("otherNationality", { selector: "div" })
          .click()
          .type("United States")

        cy.findByRole("button", { name: "United States" }).click()

        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.findByRole("dialog")
          .should("contain.text", kycKeys.sorryModal.heading)
          .should("be.visible")
      })

      it("should close sorry modal", () => {
        cy.findByRole("dialog").findByLabelText("Close").click()
      })

      it("should enter other nationality", () => {
        personalInformation.otherNationality = "BH"

        cy.findByLabelText("otherNationality").type("Bahrain")

        cy.findByRole("button", { name: "Bahrain" }).click()
      })

      it("should navigate to address details screen with increased progress bar", () => {
        currentPageIndex++
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )
      })

      it("should get validation error on clicking next without entering mandatory address fields", () => {
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findAllByText(commonKeys.errors.required).should("have.length", 2)
      })

      it("should give format validation error in postcode", () => {
        cy.findByLabelText("address1.postcode").type("dwiu#$@")
      })

      it("should have prefilled Country of residence", () => {
        cy.findByLabelText("country").should("contain.text", "India")
      })

      it("should enter address Details", () => {
        personalInformation.address1 = {}
        address1 = {}
        address1.address = "myAddress"
        cy.findAllByLabelText("address1.address").type(address1.address)

        address1.city = "myCity"
        cy.findAllByLabelText("address1.city").type(address1.city)

        address1.postcode = "postcode1"
        cy.findByLabelText("address1.postcode").clear().type(address1.postcode)

        personalInformation.address1 = address1
      })

      it("should navigate to ID screen with increased progressbar", () => {
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        currentPageIndex++
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )
      })

      it("should enter ID details", () => {
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        personalInformation.nationalIdNumber = "1234567890"
        personalInformation.passportNumber = "India"

        cy.findAllByLabelText("nationalIdNumber", { selector: "input" }).type(
          personalInformation.nationalIdNumber,
        )
        cy.findAllByLabelText("passportNumber", { selector: "input" }).type(
          personalInformation.passportNumber,
        )
      })

      it("should navigate to next page for employment details with increased progressbar", () => {
        currentPageIndex++
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )

        cy.findByText(
          kycKeys.personalInformation.KycEmploymentDetails.title,
        ).should("be.visible")
      })

      it("should select Employment Type as Retired", () => {
        personalInformation.employmentActivity = EmploymentActivity.Retired
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        cy.findByLabelText("employmentActivity").type(
          personalInformation.employmentActivity,
        )
        cy.findByRole("button", {
          name: personalInformation.employmentActivity,
        }).click()
      })

      it("should get validation error on clicking next without entering mandatory employment details fields", () => {
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findAllByText(commonKeys.errors.required).should("have.length", 3)
      })

      it("should enter employment details when employment type is Retired", () => {
        employmentDetails.sectorOfLastEmployment = EmploymentSector.education
        employmentDetails.yearsOfProfessionalExperience = 15
        employmentDetails.lastJobTitleHeld = "Professor"
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        cy.findByLabelText("sectorOfLastEmployment").type(
          employmentDetails.sectorOfLastEmployment,
        )
        cy.findByRole("button", {
          name: employmentDetails.sectorOfLastEmployment,
        }).click()

        cy.findAllByLabelText(
          "employmentDetails.yearsOfProfessionalExperience",
        ).type(employmentDetails.yearsOfProfessionalExperience.toString())

        cy.findAllByLabelText("employmentDetails.lastJobTitleHeld").type(
          employmentDetails.lastJobTitleHeld,
        )

        personalInformation.employmentDetails = employmentDetails
      })

      it("should navigate to next page for employer details with increased progress bar", () => {
        currentPageIndex++
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )

        cy.findByText(
          kycKeys.personalInformation.KycEmployerDetails.title
            .lastEmployerDetails,
        ).should("be.visible")
      })

      it("should get validation error on clicking next without entering mandatory employer details", () => {
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findAllByText(commonKeys.errors.required).should("have.length", 5)
      })

      it("should be able to enter last employer details", () => {
        lastEmployerDetails.country = "IN"
        lastEmployerDetails.nameOfCompany = "BHEL"
        lastEmployerDetails.address = "address"
        lastEmployerDetails.city = "Riyadh"
        lastEmployerDetails.postcode = "111111"

        cy.findByLabelText("country").type("India")
        cy.findByRole("button", { name: "India" }).click()

        cy.findByLabelText("employerDetails.nameOfCompany").type(
          lastEmployerDetails.nameOfCompany,
        )
        cy.findByLabelText("employerDetails.address").type(
          lastEmployerDetails.address,
        )
        cy.findByLabelText("employerDetails.city").type(
          lastEmployerDetails.city,
        )
        cy.findByLabelText("employerDetails.postcode").type(
          lastEmployerDetails.postcode,
        )

        personalInformation.employerDetails = lastEmployerDetails
      })

      it("should be navigated to Income details page after providing employer details with increased progressbar", () => {
        currentPageIndex++
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

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
            kycKeys.personalInformation.kycIncomeDetails.heading,
          )
      })

      it("should able to navigate back to last employer details screen with decreased progressbar", () => {
        currentPageIndex--
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        cy.findByRole("button", { name: commonKeys.button.back }).click()

        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )

        cy.findAllByRole("heading", { level: 2 })
          .eq(0)
          .should(
            "have.text",
            kycKeys.personalInformation.KycEmployerDetails.title
              .lastEmployerDetails,
          )
      })

      it("should able to navigate back to for employment details with decreased progressbar", () => {
        currentPageIndex--
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        cy.findByRole("button", { name: commonKeys.button.back }).click()

        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )

        cy.findAllByRole("heading", { level: 2 })
          .eq(0)
          .should(
            "have.text",
            kycKeys.personalInformation.KycEmploymentDetails.title,
          )
      })

      it("should select Employment Type as ‘Employee’", () => {
        personalInformation.employmentDetails = null
        personalInformation.employerDetails = null
        personalInformation.employmentActivity = EmploymentActivity.Employed
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        cy.findByLabelText("employmentActivity").type(
          personalInformation.employmentActivity,
        )
        cy.findByRole("button", {
          name: personalInformation.employmentActivity,
        }).click()
      })

      it("should get validation error on clicking next without entering mandatory employment details fields", () => {
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findAllByText(commonKeys.errors.required).should("have.length", 4)
      })

      it("should enter employment details when employment type is Employee", () => {
        employmentDetails.employmentSector = EmploymentSector.education
        employmentDetails.yearsOfProfessionalExperience = 15
        employmentDetails.jobTitle = "Professor"
        employmentDetails.areYouDirectorOfListedCompany = "no"
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        cy.findByLabelText("employmentSector").type(
          employmentDetails.employmentSector,
        )
        cy.findByRole("button", {
          name: employmentDetails.employmentSector,
        }).click()

        cy.findAllByLabelText(
          "employmentDetails.yearsOfProfessionalExperience",
        ).type(employmentDetails.yearsOfProfessionalExperience.toString())

        cy.findAllByLabelText("employmentDetails.jobTitle").type(
          employmentDetails.jobTitle,
        )

        cy.findByRole("radiogroup").findByText("No").click()

        personalInformation.employmentDetails = employmentDetails
      })

      it("should navigate to next page for employer details with increased progressbar", () => {
        currentPageIndex++
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

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
            kycKeys.personalInformation.KycEmployerDetails.title
              .employerDetails,
          )
      })

      it("should get validation error on clicking next without entering mandatory employer details", () => {
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findAllByText(commonKeys.errors.required).should("have.length", 7)
      })

      it("should be able to enter employer details", () => {
        employerDetails.country = "IN"
        employerDetails.nameOfCompany = "BHEL"
        employerDetails.address = "address"
        employerDetails.city = "Riyadh"
        employerDetails.postcode = "111111"
        employerDetails.phoneNumber = "111111111"
        employerDetails.phoneCountryCode = "+91"
        cy.findByLabelText("country").type("India")
        cy.findByRole("button", { name: "India" }).click()

        cy.findByLabelText("employerDetails.nameOfCompany").type(
          employerDetails.nameOfCompany,
        )
        cy.findByLabelText("employerDetails.address").type(
          employerDetails.address,
        )
        cy.findByLabelText("employerDetails.city").type(employerDetails.city)
        cy.findByLabelText("employerDetails.postcode").type(
          employerDetails.postcode,
        )
        cy.findByLabelText("phoneCountryCode").type(
          employerDetails.phoneCountryCode,
        )
        cy.findByRole("button", {
          name: "IN +91",
        }).click({ force: true })

        cy.findByLabelText("employerDetails.phoneNumber").type(
          employerDetails.phoneNumber,
        )

        personalInformation.employerDetails = employerDetails
      })

      it("should be navigated to Income details page after providing employer details with increased progressbar", () => {
        currentPageIndex++
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

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
            kycKeys.personalInformation.kycIncomeDetails.heading,
          )
      })

      it("should get validation error on clicking next without entering mandatory income details", () => {
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findAllByText(commonKeys.errors.required).should("have.length", 2)
        cy.findAllByText(commonKeys.errors.atleastOne).should("have.length", 2)
      })

      it("should be able to view tooltip for net worth in USD", () => {
        cy.findByLabelText("netWorth").find("svg").eq(0).trigger("mouseover")
        cy.findByText(
          kycKeys.personalInformation.kycIncomeDetails.select.netWorth.tooltip
            .text,
        ).should("be.visible")
        cy.findByLabelText("netWorth").find("svg").eq(0).trigger("mouseleave")
      })

      it("should be able to view tooltip for source of wealth", () => {
        cy.findByLabelText("sourceOfWealth")
          .find("svg")
          .eq(0)
          .trigger("mouseover")
        cy.findByText(
          kycKeys.personalInformation.kycIncomeDetails.select.sourceOfWealth
            .tooltip.text,
        ).should("be.visible")
        cy.findByLabelText("sourceOfWealth")
          .find("svg")
          .eq(0)
          .trigger("mouseleave")
      })

      it("should be able to view tooltip for source of funds", () => {
        cy.findByLabelText("sourceOfFunds")
          .find("svg")
          .eq(0)
          .trigger("mouseover")
        cy.findByText(
          kycKeys.personalInformation.kycIncomeDetails.select.sourceOfFunds
            .tooltip.text,
        ).should("be.visible")
        cy.findByLabelText("sourceOfFunds")
          .find("svg")
          .eq(0)
          .trigger("mouseleave")
      })

      it("should enter income details", () => {
        incomeDetails.annualIncome =
          kycKeys.personalInformation.kycIncomeDetails.select.annualIncome.options.Above10000k

        incomeDetails.netWorth =
          kycKeys.personalInformation.kycIncomeDetails.select.netWorth.options.Above100000k

        incomeDetails.sourceOfWealth = [
          kycKeys.personalInformation.kycIncomeDetails.select.sourceOfWealth
            .options.Inheritance,
          kycKeys.personalInformation.kycIncomeDetails.select.sourceOfWealth
            .options.FamilyTrustIncome,
        ]
        incomeDetails.sourceOfFunds = [
          kycKeys.personalInformation.kycIncomeDetails.select.sourceOfFunds
            .options.Inheritance,
          kycKeys.personalInformation.kycIncomeDetails.select.sourceOfFunds
            .options.InvestmentIncome,
        ]

        cy.findByLabelText("annualIncome").type(incomeDetails.annualIncome)
        cy.findByRole("button", { name: incomeDetails.annualIncome }).click()

        cy.findByLabelText("netWorth").type(incomeDetails.netWorth)
        cy.findByRole("button", { name: incomeDetails.netWorth }).click()

        incomeDetails.sourceOfWealth.forEach((source) => {
          cy.findByLabelText("sourceOfWealth").type(source)
          cy.findByRole("button", { name: source }).click()
        })

        incomeDetails.sourceOfFunds.forEach((source) => {
          cy.findByLabelText("sourceOfFunds").type(source)
          cy.findByRole("button", { name: source }).click()
        })

        personalInformation.incomeDetails = incomeDetails
      })

      it("should be navigated to Tax information details page", () => {
        currentPageIndex++
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

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
            kycKeys.personalInformation.kycTaxInformation.title,
          )
      })

      it("should preselect not taxable in US", () => {
        cy.findByRole("radiogroup")
          .findByText("No")
          .parent("span")
          .should("have.attr", "data-checked")
      })

      it("should be able to view tooltip for tax domicile", () => {
        cy.findByLabelText("locationOfMainTaxDomicile")
          .find("svg")
          .eq(0)
          .trigger("mouseover")
        cy.findByText(
          kycKeys.personalInformation.kycTaxInformation.select
            .locationOfMainTaxDomicile.tooltip.label,
        ).should("be.visible")
        cy.findByLabelText("locationOfMainTaxDomicile")
          .find("svg")
          .eq(0)
          .trigger("mouseleave")
      })

      it("should be able to view tooltip for tax residences", () => {
        cy.findAllByLabelText("Info icon").eq(0).trigger("mouseover")
        cy.findByText(
          kycKeys.personalInformation.kycTaxInformation.select
            .countriesOfTaxResidency.tooltip.label,
        ).should("be.visible")
        cy.findAllByLabelText("Info icon").eq(0).trigger("mouseleave")
      })

      it("should be able to view tooltip for US taxable", () => {
        cy.findAllByLabelText("Info icon").eq(0).trigger("mouseover")
        cy.findByText(
          kycKeys.personalInformation.kycTaxInformation.radio.taxableInUsa
            .label,
        ).should("be.visible")
        cy.findAllByLabelText("Info icon").eq(0).trigger("mouseleave")
      })

      it("should get validation error on clicking next without entering mandatory tax details", () => {
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findAllByText(commonKeys.errors.required).should("have.length", 2)
      })

      it("should halt journey if user selects tax domicile as North Korea", () => {
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        taxInformation.taxableInUSA = false
        taxInformation.locationOfMainTaxDomicile = "KP"

        let tinInformation: TinInformation = {}

        tinInformation.countriesOfTaxResidency = "OM"

        listOfTins.push(tinInformation)

        taxInformation.tinInformation = listOfTins

        cy.findByLabelText("locationOfMainTaxDomicile").type("North Korea")
        cy.findByRole("button", { name: "North Korea" }).click()

        cy.findByLabelText(
          "taxInformation.tinInformation[0].countriesOfTaxResidency",
        ).type("Oman")
        cy.findByRole("button", { name: "Oman" }).click()

        personalInformation.taxInformation = taxInformation

        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.findByRole("dialog")
          .should("contain.text", kycKeys.sorryModal.heading)
          .should("be.visible")
      })

      it("should navigate back from sorry modal", () => {
        cy.findByRole("dialog")
          .findByRole("button", { name: kycKeys.sorryModal.button.goBack })
          .click()
      })

      it("should halt journey if user selects tax domicile as Iran", () => {
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        taxInformation.taxableInUSA = false
        taxInformation.locationOfMainTaxDomicile = "IR"

        cy.findByLabelText("locationOfMainTaxDomicile").type("Iran")
        cy.findByRole("button", { name: "Iran" }).click()

        personalInformation.taxInformation = taxInformation

        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.findByRole("dialog")
          .should("contain.text", kycKeys.sorryModal.heading)
          .should("be.visible")
      })

      it("should navigate back from sorry modal", () => {
        cy.findByRole("dialog")
          .findByRole("button", { name: kycKeys.sorryModal.button.goBack })
          .click()
      })

      it("should halt journey if user selects tax domicile as US", () => {
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        taxInformation.taxableInUSA = false
        taxInformation.locationOfMainTaxDomicile = "US"

        cy.findByLabelText("locationOfMainTaxDomicile").type("United States")
        cy.findByRole("button", { name: "United States" }).click()

        personalInformation.taxInformation = taxInformation

        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.findByRole("dialog")
          .should("contain.text", kycKeys.sorryModal.heading)
          .should("be.visible")
      })

      it("should navigate back from sorry modal", () => {
        cy.findByRole("dialog")
          .findByRole("button", { name: kycKeys.sorryModal.button.goBack })
          .click()
      })

      it("should halt journey if user selects tax residence as North Korea", () => {
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        taxInformation.taxableInUSA = false
        taxInformation.locationOfMainTaxDomicile = "OM"

        let tinInformation: TinInformation = {}

        tinInformation.countriesOfTaxResidency = "KP"

        listOfTins.push(tinInformation)

        taxInformation.tinInformation = listOfTins

        cy.findByLabelText("locationOfMainTaxDomicile").type("Oman")
        cy.findByRole("button", { name: "Oman" }).click()

        cy.findByLabelText(
          "taxInformation.tinInformation[0].countriesOfTaxResidency",
        ).type("North Korea")
        cy.findByRole("button", { name: "North Korea" }).click()

        personalInformation.taxInformation = taxInformation

        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.findByRole("dialog")
          .should("contain.text", kycKeys.sorryModal.heading)
          .should("be.visible")
      })

      it("should navigate back from sorry modal", () => {
        cy.findByRole("dialog")
          .findByRole("button", { name: kycKeys.sorryModal.button.goBack })
          .click()
      })

      it("should halt journey if user selects tax residence as US", () => {
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        let tinInformation: TinInformation = {}

        tinInformation.countriesOfTaxResidency = "US"

        listOfTins = []

        listOfTins.push(tinInformation)

        taxInformation.tinInformation = listOfTins

        cy.findByLabelText(
          "taxInformation.tinInformation[0].countriesOfTaxResidency",
        ).type("United States")
        cy.findByRole("button", { name: "United States" }).click()

        personalInformation.taxInformation = taxInformation

        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.findByRole("dialog")
          .should("contain.text", kycKeys.sorryModal.heading)
          .should("be.visible")
      })

      it("should navigate back from sorry modal", () => {
        cy.findByRole("dialog")
          .findByRole("button", { name: kycKeys.sorryModal.button.goBack })
          .click()
      })

      it("should halt journey if user selects tax residence as Iran", () => {
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        let tinInformation: TinInformation = {}

        tinInformation.countriesOfTaxResidency = "IR"
        listOfTins = []

        listOfTins.push(tinInformation)

        taxInformation.tinInformation = listOfTins

        cy.findByLabelText(
          "taxInformation.tinInformation[0].countriesOfTaxResidency",
        ).type("Iran")
        cy.findByRole("button", { name: "Iran" }).click()

        personalInformation.taxInformation = taxInformation

        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.findByRole("dialog")
          .should("contain.text", kycKeys.sorryModal.heading)
          .should("be.visible")
      })

      it("should navigate back from sorry modal", () => {
        cy.findByRole("dialog")
          .findByRole("button", { name: kycKeys.sorryModal.button.goBack })
          .click()
      })

      it("should input tax information", () => {
        taxInformation.locationOfMainTaxDomicile = "BH"

        let tinInformation: TinInformation = {}

        tinInformation.countriesOfTaxResidency = "OM"
        tinInformation.haveNoTin = false
        tinInformation.globalTaxIdentificationNumber = null
        tinInformation.reasonForNoTin = null
        tinInformation.reasonForNoTinExplanation = null

        listOfTins = []

        listOfTins.push(tinInformation)

        taxInformation.tinInformation = listOfTins

        cy.findByLabelText("locationOfMainTaxDomicile").type("Bahrain")
        cy.findByRole("button", { name: "Bahrain" }).click()

        cy.findByLabelText(
          "taxInformation.tinInformation[0].countriesOfTaxResidency",
        ).type("Oman")
        cy.findByRole("button", { name: "Oman" }).click()

        personalInformation.taxInformation = taxInformation
      })

      it("should halt journey if user selects taxable in US", () => {
        taxInformation.taxableInUSA = true

        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        cy.findByRole("radiogroup").findByText("Yes").click()

        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.findByRole("dialog")
          .should("contain.text", kycKeys.sorryModal.heading)
          .should("be.visible")
      })

      it("should navigate back from sorry modal", () => {
        cy.findByRole("dialog")
          .findByRole("button", { name: kycKeys.sorryModal.button.goBack })
          .click()
      })

      it("should add 3 tax residences", () => {
        cy.findByText(
          kycKeys.personalInformation.kycTaxInformation.button.addNew.label,
        ).click()

        let tinInformation1: TinInformation = {}
        tinInformation1.countriesOfTaxResidency = "PK"
        tinInformation1.haveNoTin = false
        tinInformation1.globalTaxIdentificationNumber = null
        tinInformation1.reasonForNoTin = null
        tinInformation1.reasonForNoTinExplanation = null

        listOfTins.push(tinInformation1)

        let tinInformation2: TinInformation = {}
        tinInformation2.countriesOfTaxResidency = "IN"
        tinInformation2.haveNoTin = false
        tinInformation2.globalTaxIdentificationNumber = null
        tinInformation2.reasonForNoTin = null
        tinInformation2.reasonForNoTinExplanation = null

        listOfTins.push(tinInformation1)

        taxInformation.tinInformation = listOfTins

        cy.findByLabelText(
          "taxInformation.tinInformation[1].countriesOfTaxResidency",
        ).type("Pakistan")
        cy.findByRole("button", { name: "Pakistan" }).click()

        cy.findByText(
          kycKeys.personalInformation.kycTaxInformation.button.addNew.label,
        ).click()

        cy.findByLabelText(
          "taxInformation.tinInformation[2].countriesOfTaxResidency",
        ).type("India")
        cy.findByRole("button", { name: "India" }).click()

        personalInformation.taxInformation = taxInformation
      })

      it("should check radio button as not taxable in US", () => {
        taxInformation.taxableInUSA = false

        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        cy.findByRole("radiogroup").findByText("No").click()
      })

      it("should not show option to add 4th tax residence", () => {
        cy.findByText(
          kycKeys.personalInformation.kycTaxInformation.button.addNew.label,
        ).should("not.exist")
      })

      it("should be navigated to Tax information screen 2 with increased progressbar", () => {
        currentPageIndex++
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

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
            kycKeys.personalInformation.kycTaxInformation.title,
          )
      })

      it("should give validation error without mentioning TIN details", () => {
        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.findAllByText(commonKeys.errors.required).should("have.length", 3)
      })

      it("should able to view tooltip for each TIN details", () => {
        const tooltipText = String(
          kycKeys.personalInformation.kycTaxInformation.input
            .globalTaxIdentificationNumber.tooltip.text,
        )
          .replace(/<link>/g, "")
          .replace("</link>", "")
        for (let i = 0; i < 3; i++) {
          cy.findAllByLabelText("Info icon")
            .eq(i)
            .then((tooltip) => {
              cy.wrap(tooltip).click()
              cy.wrap(tooltip)
                .parent()
                .siblings("div")
                .should("have.text", tooltipText)
            })
        }

        cy.findAllByText(
          kycKeys.personalInformation.kycTaxInformation.input
            .globalTaxIdentificationNumber.label,
        )
          .eq(0)
          .click()
      })

      it("should select all inputs as TIN not available", () => {
        for (let i = 0; i < 3; i++) {
          cy.findAllByText(
            kycKeys.personalInformation.kycTaxInformation.checkbox.haveTin
              .label,
          )
            .eq(i)
            .click()

          cy.findByLabelText(
            `taxInformation.tinInformation[${i}].reasonForNoTin`,
          ).type(
            kycKeys.personalInformation.kycTaxInformation.select.reasonForNoTin
              .options.NoTinRequired,
          )

          cy.findByRole("button", {
            name: kycKeys.personalInformation.kycTaxInformation.select
              .reasonForNoTin.options.NoTinRequired,
          }).click()

          listOfTins[i].haveNoTin = true
          listOfTins[i].reasonForNoTin = NoTinReason.NoTinRequired
        }

        personalInformation.taxInformation.tinInformation = listOfTins
      })

      it("should navigate to PEP check screen with increased progressbar without mentioning TIN details", () => {
        currentPageIndex = currentPageIndex + 4
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )

        cy.findAllByRole("heading", { level: 2 })
          .eq(0)
          .should("have.text", kycKeys.personalInformation.KycPepCheck.title)
      })

      it("should able to navigate back to TIN details screen with decreased progressbar", () => {
        currentPageIndex = currentPageIndex - 4
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        cy.findByRole("button", { name: commonKeys.button.back }).click()

        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )

        cy.findAllByRole("heading", { level: 2 })
          .eq(0)
          .should(
            "have.text",
            kycKeys.personalInformation.kycTaxInformation.title,
          )
      })

      it("should enter tin details for one residency", () => {
        cy.findAllByText(
          kycKeys.personalInformation.kycTaxInformation.checkbox.haveTin.label,
        )
          .eq(1)
          .click()
        const tindetails = "1234567"
        cy.findByLabelText(
          "taxInformation.tinInformation[1].globalTaxIdentificationNumber",
        ).type(tindetails)

        listOfTins[1].haveNoTin = false
        listOfTins[1].reasonForNoTin = null
        listOfTins[1].globalTaxIdentificationNumber = tindetails
        taxInformation.tinInformation = listOfTins
      })

      it("should navigate to PEP check screen with increased progressbar with TIN details", () => {
        currentPageIndex = currentPageIndex + 4
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )

        cy.findAllByRole("heading", { level: 2 })
          .eq(0)
          .should("have.text", kycKeys.personalInformation.KycPepCheck.title)
      })

      it("should give validation error without mentioning PEP details", () => {
        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.findAllByText(commonKeys.errors.required).should("have.length", 1)
      })

      it("should able to view tooltip for PEP details", () => {
        const tooltipText = String(
          kycKeys.personalInformation.KycPepCheck.tooltip.text,
        )

        cy.findByLabelText("Info icon").click()

        cy.findByText(tooltipText).should("be.visible")
      })

      it("should answer user is PEP", () => {
        let personalInformationCheck: KycPersonalInformationPepCheck = {}
        personalInformationCheck.optionValue = PepCheck.YesIamPep
        personalInformationCheck.dateOfAppointment = new Date(
          "2021-10-10T00:00:00",
        )
        cy.findByRole("group").find("label").eq(0).click()

        cy.findAllByPlaceholderText("DD/MM/YYYY").eq(1).click()

        cy.findByText(currentYear).click()
        cy.findByText("1980").click()

        cy.findByText(currentMonth).click()
        cy.findByText("October").click()

        cy.findByText("10").click()
      })

      it("should answer user is related to PEP", () => {
        let personalInformationCheck: KycPersonalInformationPepCheck = {}
        personalInformationCheck.optionValue = PepCheck.YesIamPepRelated
        personalInformationCheck.dateOfAppointment = new Date(
          "2021-10-10T00:00:00",
        )
        personalInformationCheck.fullLegalName = "John Doe"
        personalInformationCheck.accountHolderRelationship =
          AccountHolderRelationship.ParentOfPep
        personalInformationCheck.jurisdiction = "AFG"

        cy.findByRole("radiogroup").find("label").eq(2).click()
        cy.findByLabelText("pepCheck.fullLegalName").type(
          personalInformationCheck.fullLegalName,
        )

        cy.findByLabelText("accountHolderRelationship").type("Parent")
        cy.findByRole("button", { name: "Parent" }).click()

        cy.findByLabelText("jurisdiction").type("Afghanistan")
        cy.findByRole("button", { name: "Afghanistan" }).click()
      })

      it("should complete personal information section", () => {
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        cy.intercept("/api/user/kyc/status", {
          fixture: "kycStatusStep1Completed",
        }).as("kycStatus")

        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.location("pathname").should("equal", "/kyc")
      })
    },
  )
})
