import {
  AddressNotMatchTaxResidence,
  EmploymentActivity,
  EmploymentSector,
  KycAbsherCitizenInfo,
  KycPersonalInformation,
  KycPersonalInformationAddress,
  KycPersonalInformationEmployerDetails,
  KycPersonalInformationEmploymentDetails,
  KycPersonalInformationIncomeDetails,
  KycPersonalInformationPepCheck,
  KycPersonalInformationTaxInformation,
  KycReasonablenessCheck,
  NameTitle,
  NationalityNotMatchTaxResidence,
  NoTinReason,
  PepCheck,
  PhoneNumberNotMatchTaxResidence,
  TinInformation,
} from "../../src/services/mytfo/types"

describe("KYC - SSO updates for Personal Information of KSA national", () => {
  let kycKeys
  let kycTestData
  let commonKeys
  let absherDetails: KycAbsherCitizenInfo
  let personalInformation: KycPersonalInformation
  let additionalAddress: KycPersonalInformationAddress
  let employmentDetails: KycPersonalInformationEmploymentDetails
  let employerDetails: KycPersonalInformationEmployerDetails
  let incomeDetails: KycPersonalInformationIncomeDetails = {}
  let taxInformation: KycPersonalInformationTaxInformation = {}
  let reasonablenessCheck: KycReasonablenessCheck = {}

  const pages = 12

  before(() => {
    cy.fixture("../../public/locales/en/kyc").then((keys) => {
      kycKeys = keys
    })

    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })

    cy.fixture("kycTestData").then((keys) => {
      kycTestData = keys
    })

    cy.fixture("nationalIdCitizenInfo").then((keys) => {
      absherDetails = keys
    })

    cy.fixture("saudiNationalPersonalInfo").then((keys) => {
      personalInformation = keys
    })

    cy.loginBE()
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
    employmentDetails = {}
    employerDetails = {}
    let listOfTins: TinInformation[] = []

    it("should display Single Sign on for Saudi Arabia national", () => {
      cy.visit("/kyc")
      cy.findByRole("button", {
        name: kycKeys.chapterSelection.button.nationalSingleSignOn,
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

    it("should enter national Id and date of birth as per Hijri calender for Saudi Arabia national", () => {
      cy.findByLabelText("nationalIdNumber", { selector: "input" }).type(
        kycTestData.arabicNational.nationalId,
      )

      cy.findByLabelText("monthOfBirth").type("05")

      cy.findByRole("button", { name: "05" }).click()

      cy.findByLabelText("yearOfBirth").type("1392")
      cy.findByRole("button", { name: "1392" }).click()
    })

    it("should navigate to OTP screen with no change in progressbar", () => {
      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.wait("@sendOtp")

      cy.findByRole("progressbar").should(
        "have.attr",
        "aria-valuenow",
        Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
      )

      cy.findByText(
        kycKeys.personalInformation.kycSSOId.text.otpMessage,
      ).should("be.visible")
    })

    it("should get validation error on clicking next without entering OTP", () => {
      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.findByText(commonKeys.errors.required).should("be.visible")
    })

    it("should display count down to indicate the remaining time available to enter the OTP", () => {
      cy.findByRole("group")
        .siblings("p")
        .eq(1)
        .should(
          "contain.text",
          kycKeys.personalInformation.kycSSOId.text.otpExpiryMessage,
        )
    })

    it("should get an error message on entering invalid otp", () => {
      cy.intercept("/api/user/kyc/validate-otp", {
        fixture: "invalidateNationalIdOtp",
      }).as("invalidateOtp")
      for (let i = 0; i < 6; i++) {
        cy.findAllByLabelText("Please enter your pin code").eq(i).type("1")
      }

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.findByText(
        kycKeys.personalInformation.kycSSOId.input.otp.errors.otpInvalid,
      ).should("be.visible")
    })

    it("should resend OTP on entering invalid otp", () => {
      cy.clock(new Date().getTime())

      cy.findByRole("button", {
        name: kycKeys.personalInformation.kycSSOId.button.resendOtp,
      }).click()

      cy.tick(1000 /*ms*/ * 300 /*secs*/ * 1 /*min*/ + 300 /*ms*/)
    })

    it("should get an error message for expired otp after 300 seconds", () => {
      cy.findByRole("group")
        .findByText(
          kycKeys.personalInformation.kycSSOId.input.otp.errors.otpExpired,
        )
        .should("be.visible")
    })

    it("should resend OTP on expiring time to enter otp", () => {
      cy.findByRole("button", {
        name: kycKeys.personalInformation.kycSSOId.button.resendOtp,
      }).click()
    })

    it("should enter valid otp", () => {
      for (let i = 0; i < 6; i++) {
        cy.findAllByLabelText("Please enter your pin code")
          .eq(i)
          .type(kycTestData.arabicNational.otp[i])
      }
    })

    it("should navigate to personal information summary screen with increased progressbar", () => {
      cy.intercept("/api/user/kyc/personal-information", {
        body: personalInformation,
      }).as("kycPersonalInformation")

      cy.intercept("/api/user/kyc/citizen-info", {
        fixture: "nationalIdCitizenInfo",
      }).as("citizenInfo")

      cy.intercept("/api/user/kyc/validate-otp", {
        fixture: "validateNationalIdOtp",
      }).as("validateOtp")

      currentPageIndex++
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
          kycKeys.personalInformation.kycAbsherCitizenDetails.heading,
        )
    })

    it("should display user information retrieved from national Id", () => {
      cy.findByText(
        kycKeys.personalInformation.kycAbsherCitizenDetails.labels.firstName,
      )
        .siblings("p")
        .should("have.text", absherDetails.englishFirstName)

      cy.findByText(
        kycKeys.personalInformation.kycAbsherCitizenDetails.labels.middleName,
      )
        .siblings("p")
        .should("have.text", absherDetails.englishSecondName)

      cy.findByText(
        kycKeys.personalInformation.kycAbsherCitizenDetails.labels.lastName,
      )
        .siblings("p")
        .should("have.text", absherDetails.englishLastName)

      cy.findByText(
        kycKeys.personalInformation.kycAbsherCitizenDetails.labels.gender,
      )
        .siblings("p")
        .should("have.text", absherDetails.gender === "M" ? "Male" : "Female")

      cy.findByText(
        kycKeys.personalInformation.kycAbsherCitizenDetails.labels.dateOfBirth,
      )
        .siblings("p")
        .should(
          "have.text",
          absherDetails.dateOfBirth.toString().replace(/-/g, "/"),
        )

      cy.findByText(
        kycKeys.personalInformation.kycAbsherCitizenDetails.labels.nationality,
      )
        .siblings("p")
        .should("have.text", "Saudi Arabia")

      cy.findByText(
        kycKeys.personalInformation.kycAbsherCitizenDetails.labels
          .nationalIdNumber,
      )
        .siblings("p")
        .should("have.text", kycTestData.arabicNational.nationalId)

      cy.findByText(
        kycKeys.personalInformation.kycAbsherCitizenDetails.labels
          .buildingNumber,
      )
        .siblings("p")
        .should("have.text", absherDetails.buildingNumber)

      cy.findByText(
        kycKeys.personalInformation.kycAbsherCitizenDetails.labels.streetName,
      )
        .siblings("p")
        .should("have.text", absherDetails.streetName)

      cy.findByText(
        kycKeys.personalInformation.kycAbsherCitizenDetails.labels.district,
      )
        .siblings("p")
        .should("have.text", absherDetails.district)

      cy.findByText(
        kycKeys.personalInformation.kycAbsherCitizenDetails.labels.city,
      )
        .siblings("p")
        .should("have.text", absherDetails.city)

      cy.findByText(
        kycKeys.personalInformation.kycAbsherCitizenDetails.labels.postcode,
      )
        .siblings("p")
        .should("have.text", absherDetails.postCode)

      cy.findByText(
        kycKeys.personalInformation.kycAbsherCitizenDetails.labels.country,
      )
        .siblings("p")
        .should("have.text", "Saudi Arabia")
    })

    it("should navigate to next page for additional details with increased progressbar", () => {
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

      cy.findByRole("heading", { level: 2 }).should(
        "have.text",
        kycKeys.personalInformation.KycAbsherOtherDetails.heading,
      )
    })

    it("should get validation error on clicking next without entering mandatory fields", () => {
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findAllByText(commonKeys.errors.required).should("have.length", 5)
    })

    it("should get validation error on entering passport number with more than 10 characters", () => {
      cy.findByLabelText("passportNumber").type("123456789456123")
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByLabelText("passport").should(
        "contain.text",
        String(commonKeys.errors.maxLength).replace("${max}", "10"),
      )
    })

    it("should get validation error on entering incorrect format for place of birth", () => {
      cy.findByLabelText("placeOfBirth", { selector: "input" }).type("dwiu#$@")
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByLabelText("placeOfBirth", { selector: "div" }).should(
        "contain.text",
        commonKeys.errors.alphaEnglishNumericSpaceAllowed,
      )
    })

    it("should get validation error on entering non- latin characters for place of birth", () => {
      cy.findByLabelText("placeOfBirth", { selector: "input" })
        .clear()
        .type("الأحرف اللاتينية")
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByLabelText("placeOfBirth", { selector: "div" })
        .findByText(commonKeys.errors.alphaEnglishNumericSpaceAllowed)
        .should("be.visible")
    })

    it("should not list Saudi Arabia in other nationality for Saudi National", () => {
      cy.findByLabelText("otherNationality", { selector: "div" }).type("{home}")

      cy.findAllByRole("button")
        .filter("[tabindex='-1']")
        .then(($elements) => {
          var listOfCountries = Cypress._.map($elements, (el) => el.innerText)

          cy.wrap(Cypress._.sortBy(listOfCountries)).should(
            "not.include",
            "Saudi Arabia",
          )
          cy.findByText(listOfCountries[0]).click()
        })
    })

    it("should give format validation error in postcode", () => {
      cy.findByRole("radiogroup").findByText("Yes").click()
      cy.findByLabelText("address2.postcode", { selector: "input" }).type(
        "dwiu#$@",
      )

      cy.findByRole("button", { name: commonKeys.button.next }).click()

      cy.findByLabelText("postcode", { selector: "div" }).should(
        "contain.text",
        commonKeys.errors.alphaEnglishNumericSpaceAllowed,
      )
    })

    it("should enter additional information", () => {
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

      personalInformation.countryOfBirth = "Saudi Arabia"

      cy.findByLabelText("countryOfBirth").type(
        personalInformation.countryOfBirth,
      )
      cy.findByRole("button", {
        name: personalInformation.countryOfBirth,
      }).click()

      personalInformation.placeOfBirth = "Riyadh"
      cy.findByLabelText("placeOfBirth", { selector: "input" })
        .clear()
        .type(personalInformation.placeOfBirth)

      personalInformation.passportNumber = "SAUDIARBIA"
      cy.findByLabelText("passportNumber")
        .clear()
        .type(personalInformation.passportNumber)

      personalInformation.hasResidenceAddressOutsideSaudiArabia = true

      personalInformation.address2 = {}
      additionalAddress = {}
      additionalAddress.address = "theAddress"

      cy.findByLabelText("address2.address").type(additionalAddress.address)
      additionalAddress.city = "myCity"
      cy.findAllByLabelText("address2.city").type(additionalAddress.city)
      additionalAddress.postcode = "postcode2"
      cy.findByLabelText("address2.postcode")
        .clear()
        .type(additionalAddress.postcode)
      additionalAddress.country = "BH"
      cy.findByLabelText("country").type(additionalAddress.country)
      cy.findAllByRole("button", { name: "Bahrain" }).eq(0).click()

      personalInformation.address2 = additionalAddress
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

      cy.findByRole("dialog").should("contain.text", kycKeys.sorryModal.heading)
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

    it("should navigate to next page for employment details with increased progress bar", () => {
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

    it("should select Employment Type as ‘UnEmployed’", () => {
      personalInformation.employmentActivity = EmploymentActivity.Unemployed
      personalInformation.employmentDetails = null
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

    it("should able to navigate back to employment details screen with decreased progressbar", () => {
      currentPageIndex = currentPageIndex - 2
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

      cy.findByText(
        kycKeys.personalInformation.KycEmployerDetails.title.employerDetails,
      ).should("be.visible")
    })

    it("should get validation error on clicking next without entering mandatory employer details", () => {
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findAllByText(commonKeys.errors.required).should("have.length", 9)
    })

    it("should be able to enter employer details", () => {
      employerDetails.country = "SA"
      employerDetails.nameOfCompany = "Saudia"
      employerDetails.buildingNumber = "buildingNumber"
      employerDetails.streetName = "streetName"
      employerDetails.district = "district"
      employerDetails.city = "Riyadh"
      employerDetails.postcode = "111111"
      employerDetails.phoneNumber = "111111111"
      employerDetails.phoneCountryCode = "+966"
      cy.findByLabelText("country").type("Saudi Arabia")
      cy.findByRole("button", { name: "Saudi Arabia" }).click()

      cy.findByLabelText("employerDetails.nameOfCompany").type(
        employerDetails.nameOfCompany,
      )
      cy.findByLabelText("employerDetails.buildingNumber").type(
        employerDetails.buildingNumber,
      )
      cy.findByLabelText("employerDetails.streetName").type(
        employerDetails.streetName,
      )
      cy.findByLabelText("employerDetails.district").type(
        employerDetails.district,
      )
      cy.findByLabelText("employerDetails.city").type(employerDetails.city)
      cy.findByLabelText("employerDetails.postcode").type(
        employerDetails.postcode,
      )
      cy.findByLabelText("phoneCountryCode").type(
        employerDetails.phoneCountryCode,
      )
      cy.findByRole("button", {
        name: "SA +966",
      }).click()

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

      cy.findByText(
        kycKeys.personalInformation.kycIncomeDetails.heading,
      ).should("be.visible")
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

    it("should input tax information", () => {
      taxInformation.locationOfMainTaxDomicile = "BD"

      let tinInformation: TinInformation = {}

      tinInformation.countriesOfTaxResidency = "OM"
      tinInformation.haveNoTin = false
      tinInformation.globalTaxIdentificationNumber = null
      tinInformation.reasonForNoTin = null
      tinInformation.reasonForNoTinExplanation = null

      listOfTins.push(tinInformation)

      taxInformation.tinInformation = listOfTins

      cy.findByLabelText("locationOfMainTaxDomicile").type("Bangladesh")
      cy.findByRole("button", { name: "Bangladesh" }).click()

      cy.findByLabelText(
        "taxInformation.tinInformation[0].countriesOfTaxResidency",
      ).type("Oman")
      cy.findByRole("button", { name: "Oman" }).click()

      personalInformation.taxInformation = taxInformation

      reasonablenessCheck.addressNotMatchTaxResidence = {}
      reasonablenessCheck.phoneNumberNotMatchTaxResidence = {}
      reasonablenessCheck.nationalityNotMatchTaxResidence = {}

      reasonablenessCheck.addressNotMatchTaxResidence.isValid = true
      reasonablenessCheck.phoneNumberNotMatchTaxResidence.isValid = true
      reasonablenessCheck.nationalityNotMatchTaxResidence.isValid = true

      personalInformation.reasonablenessCheck = reasonablenessCheck
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

    it("should select input as TIN not available", () => {
      console.log(listOfTins)
      cy.findAllByText(
        kycKeys.personalInformation.kycTaxInformation.checkbox.haveTin.label,
      )
        .eq(0)
        .click()

      cy.findByLabelText(
        `taxInformation.tinInformation[${0}].reasonForNoTin`,
      ).type(
        kycKeys.personalInformation.kycTaxInformation.select.reasonForNoTin
          .options.NoTinRequired,
      )

      cy.findByRole("button", {
        name: kycKeys.personalInformation.kycTaxInformation.select
          .reasonForNoTin.options.NoTinRequired,
      }).click()

      listOfTins[0].haveNoTin = true
      listOfTins[0].reasonForNoTin = NoTinReason.NoTinRequired

      personalInformation.taxInformation.tinInformation = listOfTins
    })

    it("should navigate to Reasonableness check screen with increased progressbar without mentioning TIN details", () => {
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
        kycKeys.personalInformation.kycReasonablenessCheck.radio
          .addressNotMatchTaxResidence.label,
      ).should("be.visible")
    })

    it("should response as Other for Reasonalbleness Check on address", () => {
      let otherText = "random reason"
      cy.findByRole("radiogroup")
        .findByText(
          kycKeys.personalInformation.kycReasonablenessCheck.radio
            .addressNotMatchTaxResidence.options.AddressNotMatchTaxResidence5,
        )
        .click()
      cy.findByLabelText(
        "reasonablenessCheck.addressNotMatchTaxResidence.otherText",
      ).type(otherText)

      personalInformation.reasonablenessCheck.addressNotMatchTaxResidence.checkValue =
        AddressNotMatchTaxResidence.AddressNotMatchTaxResidence5

      personalInformation.reasonablenessCheck.addressNotMatchTaxResidence.otherText =
        otherText
    })

    it("should navigate to Reasonableness check screen for mismatch in phone number with increased progressbar", () => {
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
        kycKeys.personalInformation.kycReasonablenessCheck.radio
          .phoneNumberNotMatchTaxResidence.label,
      ).should("be.visible")
    })

    it("should response as Other for Reasonalbleness Check on phoneNumber", () => {
      let otherText = "random reason"
      cy.findByRole("radiogroup")
        .findByText(
          kycKeys.personalInformation.kycReasonablenessCheck.radio
            .phoneNumberNotMatchTaxResidence.options
            .PhoneNumberNotMatchTaxResidence2,
        )
        .click()

      cy.findByLabelText(
        "reasonablenessCheck.phoneNumberNotMatchTaxResidence.otherText",
      ).type(otherText)

      personalInformation.reasonablenessCheck.phoneNumberNotMatchTaxResidence.checkValue =
        PhoneNumberNotMatchTaxResidence.PhoneNumberNotMatchTaxResidence2

      personalInformation.reasonablenessCheck.phoneNumberNotMatchTaxResidence.otherText =
        otherText
    })

    it("should navigate to Reasonableness check screen for mismatch in nationality with increased progressbar", () => {
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
        kycKeys.personalInformation.kycReasonablenessCheck.radio
          .nationalityNotMatchTaxResidence.label,
      ).should("be.visible")
    })

    it("should response as Other for Reasonalbleness Check on nationality", () => {
      let otherText = "random reason"
      cy.findByRole("radiogroup")
        .findByText(
          kycKeys.personalInformation.kycReasonablenessCheck.radio
            .nationalityNotMatchTaxResidence.options
            .NationalityNotMatchTaxResidence4,
        )
        .click()

      cy.findByLabelText(
        "reasonablenessCheck.nationalityNotMatchTaxResidence.otherText",
      ).type(otherText)

      personalInformation.reasonablenessCheck.nationalityNotMatchTaxResidence.checkValue =
        NationalityNotMatchTaxResidence.NationalityNotMatchTaxResidence1

      personalInformation.reasonablenessCheck.nationalityNotMatchTaxResidence.otherText =
        otherText
    })

    it("should navigate to PEP check screen with increased progressbar", () => {
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
        .should("have.text", kycKeys.personalInformation.KycPepCheck.title)
    })

    it("should answer user is not PEP", () => {
      let personalInformationCheck: KycPersonalInformationPepCheck = {}
      personalInformationCheck.optionValue = PepCheck.NoIamNotPep
      cy.findByText(
        kycKeys.personalInformation.KycPepCheck.radio.options.NoIamNotPep.title,
      ).click()
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
      employmentDetails = {}
      employerDetails = {}
      let currentPageIndex = 0
      let listOfTins: TinInformation[] = []

      it("should display Single Sign on for Saudi Arabia national", () => {
        cy.fixture("saudiNationalPersonalInfo").then((keys) => {
          personalInformation = keys
        })
        cy.visit("/kyc")
        cy.get("footer")
          .findByRole("button", {
            name: kycKeys.chapterSelection.button.nationalSingleSignOn,
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

      it("should enter national Id and date of birth as per Hijri calender for Saudi Arabia national", () => {
        cy.findByLabelText("nationalIdNumber", { selector: "input" }).type(
          kycTestData.arabicNational.nationalId,
        )

        cy.findByLabelText("monthOfBirth").type("05")

        cy.findByRole("button", { name: "05" }).click()

        cy.findByLabelText("yearOfBirth").type("1392")
        cy.findByRole("button", { name: "1392" }).click()
      })

      it("should navigate to OTP screen with no change in progressbar", () => {
        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.wait("@sendOtp")

        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          Math.floor(((currentPageIndex + 1) / (pages + 1)) * 100),
        )

        cy.findByText(
          kycKeys.personalInformation.kycSSOId.text.otpMessage,
        ).should("be.visible")
      })

      it("should get validation error on clicking next without entering OTP", () => {
        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.findByText(commonKeys.errors.required).should("be.visible")
      })

      it("should display count down to indicate the remaining time available to enter the OTP", () => {
        cy.findByRole("group")
          .siblings("p")
          .eq(1)
          .should(
            "contain.text",
            kycKeys.personalInformation.kycSSOId.text.otpExpiryMessage,
          )
      })

      it("should get an error message on entering invalid otp", () => {
        cy.intercept("/api/user/kyc/validate-otp", {
          fixture: "invalidateNationalIdOtp",
        }).as("invalidateOtp")
        for (let i = 0; i < 6; i++) {
          cy.findAllByLabelText("Please enter your pin code").eq(i).type("1")
        }

        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.findByText(
          kycKeys.personalInformation.kycSSOId.input.otp.errors.otpInvalid,
        ).should("be.visible")
      })

      it("should close alert message", () => {
        cy.findByLabelText("Close").click()
        cy.findByText(
          kycKeys.personalInformation.kycSSOId.input.otp.errors.otpInvalid,
        ).should("not.exist")
      })

      it("should resend OTP on entering invalid otp", () => {
        cy.clock(new Date().getTime())

        cy.findByRole("button", {
          name: kycKeys.personalInformation.kycSSOId.button.resendOtp,
        }).click()

        cy.tick(1000 /*ms*/ * 300 /*secs*/ * 1 /*min*/ + 300 /*ms*/)
      })

      it("should get an error message for expired otp after 300 seconds", () => {
        cy.findByRole("group")
          .findByText(
            kycKeys.personalInformation.kycSSOId.input.otp.errors.otpExpired,
          )
          .should("be.visible")
      })

      it("should resend OTP on expiring time to enter otp", () => {
        cy.findByRole("button", {
          name: kycKeys.personalInformation.kycSSOId.button.resendOtp,
        }).click()
      })

      it("should enter valid otp", () => {
        for (let i = 0; i < 6; i++) {
          cy.findAllByLabelText("Please enter your pin code")
            .eq(i)
            .type(kycTestData.arabicNational.otp[i])
        }
      })

      it("should navigate to personal information summary screen with increased progressbar", () => {
        cy.intercept("/api/user/kyc/personal-information", {
          body: personalInformation,
        }).as("kycPersonalInformation")

        cy.intercept("/api/user/kyc/citizen-info", {
          fixture: "nationalIdCitizenInfo",
        }).as("citizenInfo")

        cy.intercept("/api/user/kyc/validate-otp", {
          fixture: "validateNationalIdOtp",
        }).as("validateOtp")

        currentPageIndex++
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
            kycKeys.personalInformation.kycAbsherCitizenDetails.heading,
          )
      })

      it("should display user information retrieved from national Id", () => {
        cy.findByText(
          kycKeys.personalInformation.kycAbsherCitizenDetails.labels.firstName,
        )
          .siblings("p")
          .should("have.text", absherDetails.englishFirstName)

        cy.findByText(
          kycKeys.personalInformation.kycAbsherCitizenDetails.labels.middleName,
        )
          .siblings("p")
          .should("have.text", absherDetails.englishSecondName)

        cy.findByText(
          kycKeys.personalInformation.kycAbsherCitizenDetails.labels.lastName,
        )
          .siblings("p")
          .should("have.text", absherDetails.englishLastName)

        cy.findByText(
          kycKeys.personalInformation.kycAbsherCitizenDetails.labels.gender,
        )
          .siblings("p")
          .should("have.text", absherDetails.gender === "M" ? "Male" : "Female")

        cy.findByText(
          kycKeys.personalInformation.kycAbsherCitizenDetails.labels
            .dateOfBirth,
        )
          .siblings("p")
          .should(
            "have.text",
            absherDetails.dateOfBirth.toString().replace(/-/g, "/"),
          )

        cy.findByText(
          kycKeys.personalInformation.kycAbsherCitizenDetails.labels
            .nationality,
        )
          .siblings("p")
          .should("have.text", "Saudi Arabia")

        cy.findByText(
          kycKeys.personalInformation.kycAbsherCitizenDetails.labels
            .nationalIdNumber,
        )
          .siblings("p")
          .should("have.text", kycTestData.arabicNational.nationalId)

        cy.findByText(
          kycKeys.personalInformation.kycAbsherCitizenDetails.labels
            .buildingNumber,
        )
          .siblings("p")
          .should("have.text", absherDetails.buildingNumber)

        cy.findByText(
          kycKeys.personalInformation.kycAbsherCitizenDetails.labels.streetName,
        )
          .siblings("p")
          .should("have.text", absherDetails.streetName)

        cy.findByText(
          kycKeys.personalInformation.kycAbsherCitizenDetails.labels.district,
        )
          .siblings("p")
          .should("have.text", absherDetails.district)

        cy.findByText(
          kycKeys.personalInformation.kycAbsherCitizenDetails.labels.city,
        )
          .siblings("p")
          .should("have.text", absherDetails.city)

        cy.findByText(
          kycKeys.personalInformation.kycAbsherCitizenDetails.labels.postcode,
        )
          .siblings("p")
          .should("have.text", absherDetails.postCode)

        cy.findByText(
          kycKeys.personalInformation.kycAbsherCitizenDetails.labels.country,
        )
          .siblings("p")
          .should("have.text", "Saudi Arabia")
      })

      it("should navigate to next page for additional details with increased progressbar", () => {
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

        cy.findByRole("heading", { level: 2 }).should(
          "have.text",
          kycKeys.personalInformation.KycAbsherOtherDetails.heading,
        )
      })

      it("should get validation error on clicking next without entering mandatory fields", () => {
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findAllByText(commonKeys.errors.required).should("have.length", 5)
      })

      it("should get validation error on entering passport number with more than 10 characters", () => {
        cy.findByLabelText("passportNumber").type("123456789456123")
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findByLabelText("passport").should(
          "contain.text",
          String(commonKeys.errors.maxLength).replace("${max}", "10"),
        )
      })

      it("should get validation error on entering incorrect format for place of birth", () => {
        cy.findByLabelText("placeOfBirth", { selector: "input" }).type(
          "dwiu#$@",
        )
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findByLabelText("placeOfBirth", { selector: "div" }).should(
          "contain.text",
          commonKeys.errors.alphaEnglishNumericSpaceAllowed,
        )
      })

      it("should get validation error on entering non- latin characters for place of birth", () => {
        cy.findByLabelText("placeOfBirth", { selector: "input" })
          .clear()
          .type("الأحرف اللاتينية")
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findByLabelText("placeOfBirth", { selector: "div" })
          .findByText(commonKeys.errors.alphaEnglishNumericSpaceAllowed)
          .should("be.visible")
      })

      it("should not list Saudi Arabia in other nationality for Saudi National", () => {
        cy.findByLabelText("otherNationality", { selector: "div" }).type(
          "{home}",
        )

        cy.findAllByRole("button")
          .filter("[tabindex='-1']")
          .then(($elements) => {
            var listOfCountries = Cypress._.map($elements, (el) => el.innerText)

            cy.wrap(Cypress._.sortBy(listOfCountries)).should(
              "not.include",
              "Saudi Arabia",
            )
            cy.findByText(listOfCountries[0]).click()
          })
      })

      it("should give format validation error in postcode", () => {
        cy.findByRole("radiogroup").findByText("Yes").click()
        cy.findByLabelText("address2.postcode", { selector: "input" }).type(
          "dwiu#$@",
        )

        cy.findByRole("button", { name: commonKeys.button.next }).click()

        cy.findByLabelText("postcode", { selector: "div" }).should(
          "contain.text",
          commonKeys.errors.alphaEnglishNumericSpaceAllowed,
        )
      })

      it("should enter additional information", () => {
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

        personalInformation.countryOfBirth = "Saudi Arabia"

        cy.findByLabelText("countryOfBirth").type(
          personalInformation.countryOfBirth,
        )
        cy.findByRole("button", {
          name: personalInformation.countryOfBirth,
        }).click()

        personalInformation.placeOfBirth = "Riyadh"
        cy.findByLabelText("placeOfBirth", { selector: "input" })
          .clear()
          .type(personalInformation.placeOfBirth)

        personalInformation.passportNumber = "SAUDIARBIA"
        cy.findByLabelText("passportNumber")
          .clear()
          .type(personalInformation.passportNumber)

        personalInformation.hasResidenceAddressOutsideSaudiArabia = true

        personalInformation.address2 = {}
        additionalAddress = {}
        additionalAddress.address = "theAddress"

        cy.findByLabelText("address2.address").type(additionalAddress.address)
        additionalAddress.city = "myCity"
        cy.findAllByLabelText("address2.city").type(additionalAddress.city)
        additionalAddress.postcode = "postcode2"
        cy.findByLabelText("address2.postcode")
          .clear()
          .type(additionalAddress.postcode)
        additionalAddress.country = "BH"
        cy.findByLabelText("country").type(additionalAddress.country)
        cy.findAllByRole("button", { name: "Bahrain" }).eq(0).click()

        personalInformation.address2 = additionalAddress
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

        cy.findByRole("dialog").should(
          "contain.text",
          kycKeys.sorryModal.heading,
        )
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

      it("should navigate to next page for employment details with increased progress bar", () => {
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

      it("should select Employment Type as ‘UnEmployed’", () => {
        personalInformation.employmentActivity = EmploymentActivity.Unemployed
        personalInformation.employmentDetails = null
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

      it("should able to navigate back to employment details screen with decreased progressbar", () => {
        currentPageIndex = currentPageIndex - 2
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
        cy.findAllByText(commonKeys.errors.required).should("have.length", 9)
      })

      it("should be able to enter employer details", () => {
        employerDetails.country = "SA"
        employerDetails.nameOfCompany = "Saudia"
        employerDetails.buildingNumber = "buildingNumber"
        employerDetails.streetName = "streetName"
        employerDetails.district = "district"
        employerDetails.city = "Riyadh"
        employerDetails.postcode = "111111"
        employerDetails.phoneNumber = "111111111"
        employerDetails.phoneCountryCode = "+966"
        cy.findByLabelText("country").type("Saudi Arabia")
        cy.findByRole("button", { name: "Saudi Arabia" }).click()

        cy.findByLabelText("employerDetails.nameOfCompany").type(
          employerDetails.nameOfCompany,
        )
        cy.findByLabelText("employerDetails.buildingNumber").type(
          employerDetails.buildingNumber,
        )
        cy.findByLabelText("employerDetails.streetName").type(
          employerDetails.streetName,
        )
        cy.findByLabelText("employerDetails.district").type(
          employerDetails.district,
        )
        cy.findByLabelText("employerDetails.city").type(employerDetails.city)
        cy.findByLabelText("employerDetails.postcode").type(
          employerDetails.postcode,
        )
        cy.findByLabelText("phoneCountryCode").type(
          employerDetails.phoneCountryCode,
        )
        cy.findByRole("button", {
          name: "SA +966",
        }).click()

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

      it("should input tax information", () => {
        taxInformation.locationOfMainTaxDomicile = "BD"

        let tinInformation: TinInformation = {}

        tinInformation.countriesOfTaxResidency = "OM"
        tinInformation.haveNoTin = false
        tinInformation.globalTaxIdentificationNumber = null
        tinInformation.reasonForNoTin = null
        tinInformation.reasonForNoTinExplanation = null

        listOfTins.push(tinInformation)

        taxInformation.tinInformation = listOfTins

        cy.findByLabelText("locationOfMainTaxDomicile").type("Bangladesh")
        cy.findByRole("button", { name: "Bangladesh" }).click()

        cy.findByLabelText(
          "taxInformation.tinInformation[0].countriesOfTaxResidency",
        ).type("Oman")
        cy.findByRole("button", { name: "Oman" }).click()

        personalInformation.taxInformation = taxInformation

        reasonablenessCheck.addressNotMatchTaxResidence = {}
        reasonablenessCheck.phoneNumberNotMatchTaxResidence = {}
        reasonablenessCheck.nationalityNotMatchTaxResidence = {}

        reasonablenessCheck.addressNotMatchTaxResidence.isValid = true
        reasonablenessCheck.phoneNumberNotMatchTaxResidence.isValid = true
        reasonablenessCheck.nationalityNotMatchTaxResidence.isValid = true

        personalInformation.reasonablenessCheck = reasonablenessCheck
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

      it("should select input as TIN not available", () => {
        console.log(listOfTins)
        cy.findAllByText(
          kycKeys.personalInformation.kycTaxInformation.checkbox.haveTin.label,
        )
          .eq(0)
          .click()

        cy.findByLabelText(
          `taxInformation.tinInformation[${0}].reasonForNoTin`,
        ).type(
          kycKeys.personalInformation.kycTaxInformation.select.reasonForNoTin
            .options.NoTinRequired,
        )

        cy.findByRole("button", {
          name: kycKeys.personalInformation.kycTaxInformation.select
            .reasonForNoTin.options.NoTinRequired,
        }).click()

        listOfTins[0].haveNoTin = true
        listOfTins[0].reasonForNoTin = NoTinReason.NoTinRequired

        personalInformation.taxInformation.tinInformation = listOfTins
      })

      it("should navigate to Reasonableness check screen with increased progressbar without mentioning TIN details", () => {
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
          kycKeys.personalInformation.kycReasonablenessCheck.radio
            .addressNotMatchTaxResidence.label,
        ).should("be.visible")
      })

      it("should response as Other for Reasonalbleness Check on address", () => {
        let otherText = "random reason"
        cy.findByRole("radiogroup")
          .findByText(
            kycKeys.personalInformation.kycReasonablenessCheck.radio
              .addressNotMatchTaxResidence.options.AddressNotMatchTaxResidence5,
          )
          .click()
        cy.findByLabelText(
          "reasonablenessCheck.addressNotMatchTaxResidence.otherText",
        ).type(otherText)

        personalInformation.reasonablenessCheck.addressNotMatchTaxResidence.checkValue =
          AddressNotMatchTaxResidence.AddressNotMatchTaxResidence5

        personalInformation.reasonablenessCheck.addressNotMatchTaxResidence.otherText =
          otherText
      })

      it("should navigate to Reasonableness check screen for mismatch in phone number with increased progressbar", () => {
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
          kycKeys.personalInformation.kycReasonablenessCheck.radio
            .phoneNumberNotMatchTaxResidence.label,
        ).should("be.visible")
      })

      it("should response as Other for Reasonalbleness Check on phoneNumber", () => {
        let otherText = "random reason"
        cy.findByRole("radiogroup")
          .findByText(
            kycKeys.personalInformation.kycReasonablenessCheck.radio
              .phoneNumberNotMatchTaxResidence.options
              .PhoneNumberNotMatchTaxResidence2,
          )
          .click()

        cy.findByLabelText(
          "reasonablenessCheck.phoneNumberNotMatchTaxResidence.otherText",
        ).type(otherText)

        personalInformation.reasonablenessCheck.phoneNumberNotMatchTaxResidence.checkValue =
          PhoneNumberNotMatchTaxResidence.PhoneNumberNotMatchTaxResidence2

        personalInformation.reasonablenessCheck.phoneNumberNotMatchTaxResidence.otherText =
          otherText
      })

      it("should navigate to Reasonableness check screen for mismatch in nationality with increased progressbar", () => {
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
          kycKeys.personalInformation.kycReasonablenessCheck.radio
            .nationalityNotMatchTaxResidence.label,
        ).should("be.visible")
      })

      it("should response as Other for Reasonalbleness Check on nationality", () => {
        let otherText = "random reason"
        cy.findByRole("radiogroup")
          .findByText(
            kycKeys.personalInformation.kycReasonablenessCheck.radio
              .nationalityNotMatchTaxResidence.options
              .NationalityNotMatchTaxResidence4,
          )
          .click()

        cy.findByLabelText(
          "reasonablenessCheck.nationalityNotMatchTaxResidence.otherText",
        ).type(otherText)

        personalInformation.reasonablenessCheck.nationalityNotMatchTaxResidence.checkValue =
          NationalityNotMatchTaxResidence.NationalityNotMatchTaxResidence1

        personalInformation.reasonablenessCheck.nationalityNotMatchTaxResidence.otherText =
          otherText
      })

      it("should navigate to PEP check screen with increased progressbar", () => {
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
          .should("have.text", kycKeys.personalInformation.KycPepCheck.title)
      })

      it("should answer user is not PEP", () => {
        let personalInformationCheck: KycPersonalInformationPepCheck = {}
        personalInformationCheck.optionValue = PepCheck.NoIamNotPep
        cy.findByText(
          kycKeys.personalInformation.KycPepCheck.radio.options.NoIamNotPep
            .title,
        ).click()
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
