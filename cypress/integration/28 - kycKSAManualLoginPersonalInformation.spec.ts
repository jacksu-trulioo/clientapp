import { Matcher } from "@testing-library/dom"

import {
  EmploymentActivity,
  EmploymentSector,
  Gender,
  KycPersonalInformation,
  KycPersonalInformationAddress,
  KycPersonalInformationCompanyDetails,
  KycPersonalInformationEmployerDetails,
  KycPersonalInformationEmploymentDetails,
  NameTitle,
  User,
} from "../../src/services/mytfo/types"

describe("KYC - Manual updating of Personal Information for KSA national", () => {
  let kycKeys
  let commonKeys
  let userDetails: User
  const pages = 14
  let currentMonth: Matcher

  before(() => {
    cy.fixture("../../public/locales/en/kyc").then((keys) => {
      kycKeys = keys
    })

    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })

    cy.fixture("saudiNationalityUser").then((keys) => {
      userDetails = keys
    })

    cy.loginBE()

    let date = new Date()
    currentMonth = date.toLocaleString("en-us", { month: "long" })
  })

  beforeEach(() => {
    cy.intercept("/api/user/preference", {
      fixture: "userPreferenceENDefault",
    }).as("languagePreference")

    cy.intercept("/api/user/relationship-manager", {
      fixture: "RMAssigned",
    }).as("relationshipManager")

    cy.intercept("/api/user", { fixture: "saudiNationalityUser" }).as("user")

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
    let address2: KycPersonalInformationAddress
    let employmentDetails: KycPersonalInformationEmploymentDetails = {}
    let lastEmployerDetails: KycPersonalInformationEmployerDetails = {}
    let companyDetails: KycPersonalInformationCompanyDetails = {}

    it("should display Single Sign on for Saudi Arabia national", () => {
      cy.visit("/kyc")
      cy.findByRole("button", {
        name: kycKeys.chapterSelection.button.enterManually,
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

    it("should enter personal information (title and middleName) for Saudi Arabia national", () => {
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

    it("should have prefilled nationality as Saudi Arabia", () => {
      personalInformation.nationality = "SA"

      cy.findByLabelText("nationality").should("contain.text", "Saudi Arabia")
    })

    it("should enter personal information (birthDetails) for Saudi Arabia national", () => {
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

      personalInformation.countryOfBirth = "SA"

      cy.findByLabelText("countryOfBirth").type("Saudi Arabia")

      cy.findByRole("button", { name: "Saudi Arabia" }).click()

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
      cy.findAllByText(commonKeys.errors.required).should("have.length", 4)
    })

    it("should give format validation error in postcode", () => {
      cy.findByLabelText("address1.postcode").type("dwiu#$@")
    })

    it("should have prefilled Country of residence", () => {
      cy.findByLabelText("country").should("contain.text", "Saudi Arabia")
    })

    it("should enter address Details for Saudi Arabia national", () => {
      personalInformation.address1 = {}
      address1 = {}
      address1.buildingNumber = "buildingNumber"

      cy.findByLabelText("address1.buildingNumber").type(
        address1.buildingNumber,
      )

      address1.streetName = "myStreet"
      cy.findAllByLabelText("address1.streetName").type(address1.streetName)

      address1.district = "myDistrict"
      cy.findAllByLabelText("address1.district").type(address1.district)

      address1.city = "myCity"
      cy.findAllByLabelText("address1.city").type(address1.city)

      address1.postcode = "postcode1"
      cy.findByLabelText("address1.postcode").clear().type(address1.postcode)

      personalInformation.address1 = address1
    })

    it("should navigate to other address details screen with increased progressbar", () => {
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

    it("should proceed to ID documents screen if user has no residence outside Saudi Arabia", () => {
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")
      personalInformation.hasResidenceAddressOutsideSaudiArabia = false
      cy.findByRole("radiogroup").findByText("No").click()
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      currentPageIndex++
    })

    it("should increase progress bar for ID documents screen", () => {
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )

      cy.findAllByRole("heading", { level: 2 })
        .eq(0)
        .should(
          "have.text",
          kycKeys.personalInformation.kycPersonalInfoNationalId.heading,
        )
    })

    it("should able to navigate back to other address deatails screen", () => {
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      currentPageIndex--
      cy.findByText(
        kycKeys.personalInformation.kycPersonalInfoOtherAddress
          .descriptionIdDetails,
      ).should("be.visible")
    })

    it("should decrease progressbar", () => {
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )
    })

    it("should able to enter other address details as Yes", () => {
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")
      personalInformation.hasResidenceAddressOutsideSaudiArabia = true
      cy.findByRole("radiogroup").findByText("Yes").click()
    })

    it("should get validation error on clicking next without entering mandatory fields", () => {
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findAllByText(commonKeys.errors.required).should("have.length", 3)
    })

    it("should provide details for other residence outside Saudi Arabia", () => {
      personalInformation.address2 = {}
      address2 = {}
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      address2.address = "myAddress"
      cy.findAllByLabelText("address2.address").type(address2.address)

      address2.city = "myCity"
      cy.findAllByLabelText("address2.city").type(address2.city)

      address2.postcode = "postcode2"
      cy.findByLabelText("address2.postcode").clear().type(address2.postcode)

      address2.country = "BH"

      cy.findByLabelText("country").type("Bahrain")
      cy.findByRole("button", { name: "Bahrain" }).click()

      personalInformation.address2 = address2
    })

    it("should navigate to ID screen", () => {
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
      personalInformation.passportNumber = "SaudiArabi"

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

      cy.wait("@kycPersonalInformation")
      cy.wait("@kycPersonalInformation")

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
      cy.findAllByText(commonKeys.errors.required).should("have.length", 7)
    })

    it("should be able to enter last employer details", () => {
      lastEmployerDetails.country = "SA"
      lastEmployerDetails.nameOfCompany = "Saudia"
      lastEmployerDetails.buildingNumber = "buildingNumber"
      lastEmployerDetails.streetName = "streetName"
      lastEmployerDetails.district = "district"
      lastEmployerDetails.city = "Riyadh"
      lastEmployerDetails.postcode = "111111"

      cy.findByLabelText("country").type("Saudi Arabia")
      cy.findByRole("button", { name: "Saudi Arabia" }).click()

      cy.findByLabelText("employerDetails.nameOfCompany").type(
        lastEmployerDetails.nameOfCompany,
      )
      cy.findByLabelText("employerDetails.buildingNumber").type(
        lastEmployerDetails.buildingNumber,
      )
      cy.findByLabelText("employerDetails.streetName").type(
        lastEmployerDetails.streetName,
      )
      cy.findByLabelText("employerDetails.district").type(
        lastEmployerDetails.district,
      )
      cy.findByLabelText("employerDetails.city").type(lastEmployerDetails.city)
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

    it("should select Employment Type as SelfEmployed", () => {
      personalInformation.employerDetails = null
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

      cy.findAllByLabelText("employmentDetails.jobTitle").type(
        employmentDetails.jobTitle,
      )

      cy.findAllByLabelText(
        "employmentDetails.yearsOfProfessionalExperience",
      ).type(employmentDetails.yearsOfProfessionalExperience.toString())

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
      companyDetails.country = "SA"
      companyDetails.nameOfCompany = "Saudia"
      companyDetails.buildingNumber = "buildingNumber"
      companyDetails.streetName = "streetName"
      companyDetails.district = "district"
      companyDetails.city = "Riyadh"
      companyDetails.postcode = "111111"
      companyDetails.estimatedAnnualRevenue = "$1,000,000 - $5,000,000"
      companyDetails.estimatedNumberOfEmployees = "501 – 1000"

      cy.findByLabelText("country").type("Saudi Arabia")
      cy.findByRole("button", { name: "Saudi Arabia" }).click()

      cy.findByLabelText("employerDetails.nameOfCompany").type(
        companyDetails.nameOfCompany,
      )
      cy.findByLabelText("employerDetails.buildingNumber").type(
        companyDetails.buildingNumber,
      )
      cy.findByLabelText("employerDetails.streetName").type(
        companyDetails.streetName,
      )
      cy.findByLabelText("employerDetails.district").type(
        companyDetails.district,
      )
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
      let address2: KycPersonalInformationAddress
      let employmentDetails: KycPersonalInformationEmploymentDetails = {}
      let lastEmployerDetails: KycPersonalInformationEmployerDetails = {}
      let companyDetails: KycPersonalInformationCompanyDetails = {}

      it("should display Single Sign on for Saudi Arabia national", () => {
        cy.visit("/kyc")
        cy.get("footer")
          .findByRole("button", {
            name: kycKeys.chapterSelection.button.enterManually,
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

      it("should enter personal information (title and middleName) for Saudi Arabia national", () => {
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

      it("should have prefilled nationality as Saudi Arabia", () => {
        personalInformation.nationality = "SA"

        cy.findByLabelText("nationality").should("contain.text", "Saudi Arabia")
      })

      it("should enter personal information (birthDetails) for Saudi Arabia national", () => {
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

        personalInformation.countryOfBirth = "SA"

        cy.findByLabelText("countryOfBirth").type("Saudi Arabia")

        cy.findByRole("button", { name: "Saudi Arabia" }).click()

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
        cy.findAllByText(commonKeys.errors.required).should("have.length", 4)
      })

      it("should give format validation error in postcode", () => {
        cy.findByLabelText("address1.postcode").type("dwiu#$@")
      })

      it("should have prefilled Country of residence", () => {
        cy.findByLabelText("country").should("contain.text", "Saudi Arabia")
      })

      it("should enter address Details for Saudi Arabia national", () => {
        personalInformation.address1 = {}
        address1 = {}
        address1.buildingNumber = "buildingNumber"

        cy.findByLabelText("address1.buildingNumber").type(
          address1.buildingNumber,
        )

        address1.streetName = "myStreet"
        cy.findAllByLabelText("address1.streetName").type(address1.streetName)

        address1.district = "myDistrict"
        cy.findAllByLabelText("address1.district").type(address1.district)

        address1.city = "myCity"
        cy.findAllByLabelText("address1.city").type(address1.city)

        address1.postcode = "postcode1"
        cy.findByLabelText("address1.postcode").clear().type(address1.postcode)

        personalInformation.address1 = address1
      })

      it("should navigate to other address details screen with increased progressbar", () => {
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

      it("should proceed to ID documents screen if user has no residence outside Saudi Arabia", () => {
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")
        personalInformation.hasResidenceAddressOutsideSaudiArabia = false
        cy.findByRole("radiogroup").findByText("No").click()
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        currentPageIndex++
      })
      it("should increase progress bar for ID documents screen", () => {
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )

        cy.findAllByRole("heading", { level: 2 })
          .eq(0)
          .should(
            "have.text",
            kycKeys.personalInformation.kycPersonalInfoNationalId.heading,
          )
      })

      it("should able to navigate back to other address details screen", () => {
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")
        cy.findByRole("button", { name: commonKeys.button.back }).click()
        currentPageIndex--
        cy.findByText(
          kycKeys.personalInformation.kycPersonalInfoOtherAddress
            .descriptionIdDetails,
        ).should("be.visible")
      })

      it("should decrease progressbar", () => {
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )
      })

      it("should able to enter other address details as Yes", () => {
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")
        personalInformation.hasResidenceAddressOutsideSaudiArabia = true
        cy.findByRole("radiogroup").findByText("Yes").click()
      })

      it("should get validation error on clicking next without entering mandatory fields", () => {
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findAllByText(commonKeys.errors.required).should("have.length", 3)
      })

      it("should provide details for other residence outside Saudi Arabia", () => {
        personalInformation.address2 = {}
        address2 = {}
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        address2.address = "myAddress"
        cy.findAllByLabelText("address2.address").type(address2.address)

        address2.city = "myCity"
        cy.findAllByLabelText("address2.city").type(address2.city)

        address2.postcode = "postcode2"
        cy.findByLabelText("address2.postcode").clear().type(address2.postcode)

        address2.country = "BH"

        cy.findByLabelText("country").type("Bahrain")
        cy.findByRole("button", { name: "Bahrain" }).click()

        personalInformation.address2 = address2
      })

      it("should navigate to ID screen", () => {
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
        personalInformation.passportNumber = "SaudiArabi"

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

        cy.wait("@kycPersonalInformation")
        cy.wait("@kycPersonalInformation")

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
        cy.findAllByText(commonKeys.errors.required).should("have.length", 7)
      })

      it("should be able to enter last employer details", () => {
        lastEmployerDetails.country = "SA"
        lastEmployerDetails.nameOfCompany = "Saudia"
        lastEmployerDetails.buildingNumber = "buildingNumber"
        lastEmployerDetails.streetName = "streetName"
        lastEmployerDetails.district = "district"
        lastEmployerDetails.city = "Riyadh"
        lastEmployerDetails.postcode = "111111"

        cy.findByLabelText("country").type("Saudi Arabia")
        cy.findByRole("button", { name: "Saudi Arabia" }).click()

        cy.findByLabelText("employerDetails.nameOfCompany").type(
          lastEmployerDetails.nameOfCompany,
        )
        cy.findByLabelText("employerDetails.buildingNumber").type(
          lastEmployerDetails.buildingNumber,
        )
        cy.findByLabelText("employerDetails.streetName").type(
          lastEmployerDetails.streetName,
        )
        cy.findByLabelText("employerDetails.district").type(
          lastEmployerDetails.district,
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

      it("should select Employment Type as SelfEmployed", () => {
        personalInformation.employerDetails = null
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

        cy.findAllByLabelText("employmentDetails.jobTitle").type(
          employmentDetails.jobTitle,
        )

        cy.findAllByLabelText(
          "employmentDetails.yearsOfProfessionalExperience",
        ).type(employmentDetails.yearsOfProfessionalExperience.toString())

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
        companyDetails.country = "SA"
        companyDetails.nameOfCompany = "Saudia"
        companyDetails.buildingNumber = "buildingNumber"
        companyDetails.streetName = "streetName"
        companyDetails.district = "district"
        companyDetails.city = "Riyadh"
        companyDetails.postcode = "111111"
        companyDetails.estimatedAnnualRevenue = "$1,000,000 - $5,000,000"
        companyDetails.estimatedNumberOfEmployees = "501 – 1000"

        cy.findByLabelText("country").type("Saudi Arabia")
        cy.findByRole("button", { name: "Saudi Arabia" }).click()

        cy.findByLabelText("employerDetails.nameOfCompany").type(
          companyDetails.nameOfCompany,
        )
        cy.findByLabelText("employerDetails.buildingNumber").type(
          companyDetails.buildingNumber,
        )
        cy.findByLabelText("employerDetails.streetName").type(
          companyDetails.streetName,
        )
        cy.findByLabelText("employerDetails.district").type(
          companyDetails.district,
        )
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
    },
  )
})
