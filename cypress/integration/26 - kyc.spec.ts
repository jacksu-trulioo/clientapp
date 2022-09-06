import { KycDocumentVerificationStatus } from "../../src/services/mytfo/types"

describe("KYC - Chapter Selection: ", () => {
  let kycKeys
  let kycKSAUserInformation: KycDocumentVerificationStatus
  let kycNonKSAUserInformation: KycDocumentVerificationStatus
  let commonKeys

  before(() => {
    cy.fixture("../../public/locales/en/kyc").then((keys) => {
      kycKeys = keys
    })

    cy.fixture("kycDocumentVerification").then((statusInformation) => {
      kycKSAUserInformation = statusInformation
    })

    cy.fixture("kycDocumentVerificationStatus").then((statusInformation) => {
      kycNonKSAUserInformation = statusInformation
    })

    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })

    cy.loginBE()
  })

  beforeEach(() => {
    cy.intercept("/api/user/preference", {
      fixture: "userPreferenceProposal",
    }).as("languagePreference")

    cy.intercept("/api/user", { fixture: "saudiNationalityUser" }).as("user")

    cy.intercept("/api/user/kyc/status", {
      fixture: "kycNotStarted",
    }).as("kycStatus")

    cy.intercept("/api/user/kyc/personal-information", {
      fixture: "kycPersonalInformation",
    }).as("kycPersonalInformation")

    cy.intercept("/api/user/kyc/hybrid-flow", {
      fixture: "kycNotHybridFlow",
    }).as("kycHybridFlow")

    cy.intercept("/api/user/relationship-manager", {
      fixture: "RMAssigned",
    }).as("relationshipManager")

    cy.intercept("/api/user/kyc/document-verification", {
      fixture: "kycDocumentVerification",
    }).as("kycDocumentVerification")

    cy.intercept("/api/user/summary", {
      fixture: "userSummaryWithLastProposalDate",
    }).as("userSummary")

    cy.intercept("/api/user/investment-goals", {
      fixture: "investmentGoalCompletedResponse",
    }).as("investmentGoalResponse")

    cy.intercept("/api/user/preference/disclaimer", {
      fixture: "userDisclaimerAccepted",
    }).as("userDisclaimerAccepted")
  })

  context("desktop", () => {
    it("should display CTAs for KSA national when KYC journey is not started", () => {
      cy.visit("/kyc")
      cy.findByRole("button", {
        name: kycKeys.chapterSelection.button.nationalSingleSignOn,
      }).should("be.visible")
      cy.findByRole("button", {
        name: kycKeys.chapterSelection.button.enterManually,
      }).should("be.visible")
    })

    it("should change CTA to Edit when Personal Information section is completed", () => {
      cy.intercept("/api/user/kyc/status", {
        fixture: "kycStatusStep1Completed",
      }).as("kycStatus")

      cy.reload()

      cy.findByRole("button", {
        name: kycKeys.chapterSelection.button.nationalSingleSignOn,
      }).should("not.exist")
      cy.findByRole("button", {
        name: kycKeys.chapterSelection.button.enterManually,
      }).should("not.exist")

      cy.findByText(kycKeys.chapterSelection.chapterTwo.stepper.title)
        .parent()
        .findByRole("button", {
          name: commonKeys.button.continue,
        })
        .should("be.visible")

      cy.findByText(kycKeys.chapterSelection.chapterOne.stepper.title)
        .parent()
        .findByRole("link", { name: commonKeys.nav.links.edit })
        .should("be.visible")
    })

    it("should start personal information section again on Edit CTA action", () => {
      cy.findByRole("link", { name: commonKeys.nav.links.edit }).click()
      cy.location("pathname").should("equal", "/kyc/personal-information")
    })

    it("should change CTA to Edit when Investment experience section is completed", () => {
      cy.intercept("/api/user/kyc/status", {
        fixture: "kycStatusStep2Completed",
      }).as("kycStatus")

      cy.visit("/kyc")

      cy.findByText(kycKeys.chapterSelection.chapterOne.stepper.title)
        .parent()
        .findByRole("link", { name: commonKeys.nav.links.edit })
        .should("be.visible")

      cy.findByText(kycKeys.chapterSelection.chapterTwo.stepper.title)
        .parent()
        .findByRole("link", { name: commonKeys.nav.links.edit })
        .should("be.visible")
    })

    it("should show CTAs for continue to either from mobile or desktop for ID verification", () => {
      cy.findByText(kycKeys.chapterSelection.chapterThree.title)
        .parent()
        .within(() => {
          cy.findByRole("button", {
            name: kycKeys.chapterSelection.button.verifyOnMobile,
          }).should("be.visible")
          // cy.findByRole("button", {
          //   name: kycKeys.chapterSelection.button.continueOnComputer,
          // }).should("be.visible")
        })
    })

    it("should provide with a pop-up window for QR code", () => {
      cy.findByRole("button", {
        name: kycKeys.chapterSelection.button.verifyOnMobile,
      }).click()

      cy.findByRole("heading", {
        name: kycKeys.qrCodeGenerationModal.heading,
      }).should("be.visible")
    })

    it.skip("should show CTAs to continue on desktop or on mobile", () => {
      cy.findByRole("button", { name: "Get Started" }).should("be.visible")
      cy.findByRole("button", { name: "Verify on mobile" }).should("be.visible")
    })

    it("should close the pop-up window", () => {
      cy.intercept("/api/user/kyc/status", {
        fixture: "kycStatusStep2Completed",
      }).as("kycStatus")
      cy.findByLabelText("Close", { selector: "button" }).click()

      cy.findByRole("heading", { name: "Verify ID on your computer" }).should(
        "not.exist",
      )
    })

    it.skip("should continue flow on desktop", () => {
      cy.intercept("/api/user/kyc/status", {
        fixture: "kycStatusStep2Completed",
      }).as("kycStatus")

      cy.findByRole("button", {
        name: kycKeys.chapterSelection.button.continueOnComputer,
      }).click()
      cy.findByRole("button", { name: "Get Started" }).click()
      cy.location("pathname").should("equal", "/kyc/id-verification")
    })

    it("should display QR code pop-up when proceeding to mobile verification", () => {
      cy.findByRole("button", {
        name: kycKeys.chapterSelection.button.verifyOnMobile,
      }).click()

      // cy.findByRole("button", { name: "Verify on mobile" }).click()

      // cy.findByText(kycKeys.qrCodeGenerationModal.heading).should("be.visible")
    })

    it("should show pop up on how to scan QR code", () => {
      cy.findByRole("button", {
        name: kycKeys.qrCodeGenerationModal.linkCTA,
      }).click()

      cy.findAllByRole("heading", { level: 2 })
        .eq(1)
        .should("have.text", kycKeys.howToScanQrModal.heading)
    })

    it("should close the how to scan pop-up window using close icon", () => {
      cy.findByLabelText("Close", { selector: "button" }).click()

      cy.findByRole("button", {
        name: kycKeys.qrCodeGenerationModal.linkCTA,
      }).should("be.visible")
    })

    it("should close the how to scan pop-up window using Ok button", () => {
      cy.findByRole("button", {
        name: kycKeys.qrCodeGenerationModal.linkCTA,
      }).click()

      cy.findByRole("button", {
        name: kycKeys.howToScanQrModal.linkCTA,
      }).click()

      cy.findByRole("button", {
        name: kycKeys.qrCodeGenerationModal.linkCTA,
      }).should("be.visible")
    })

    it("should navigate user to Verify ID on your mobile after user scanned on mobile for KSA user", () => {
      cy.intercept("/api/user/kyc/hybrid-flow", {
        fixture: "kycHybridFlow",
      }).as("kycHybridFlow")

      cy.intercept("/api/user/kyc/document-verification", {
        fixture: "kycDocumentVerification",
      }).as("kycDocumentVerification")

      cy.wait(["@kycHybridFlow", "@kycDocumentVerification"])

      cy.location("pathname").should("equal", "/kyc/document-verification")

      cy.findByRole("heading", { level: 2 }).should(
        "have.text",
        kycKeys.documentVerification.heading,
      )
    })

    it("should show status of all docs required for KSA user", () => {
      let passportInfoStatus =
        kycKSAUserInformation.passportFront === true
          ? kycKeys.documentVerification.status.complete
          : kycKeys.documentVerification.status.required
      let passportSignatureInfoStatus =
        kycKSAUserInformation.passportSignature === true
          ? kycKeys.documentVerification.status.complete
          : kycKeys.documentVerification.status.required
      let nationalIdFrontStatus =
        kycKSAUserInformation.nationalIdFront === true
          ? kycKeys.documentVerification.status.complete
          : kycKeys.documentVerification.status.required
      let nationalIdBackStatus =
        kycKSAUserInformation.nationalIdBack === true
          ? kycKeys.documentVerification.status.complete
          : kycKeys.documentVerification.status.required
      let livePhotoStatus =
        kycKSAUserInformation.livePhoto === true
          ? kycKeys.documentVerification.status.complete
          : kycKeys.documentVerification.status.required

      cy.findByText(kycKeys.documentVerification.statusInfo.passportFront)
        .siblings("p")
        .should("have.text", passportInfoStatus)

      cy.findByText(kycKeys.documentVerification.statusInfo.passportSignature)
        .siblings("p")
        .should("have.text", passportSignatureInfoStatus)

      cy.findByText(kycKeys.documentVerification.statusInfo.nationalIdFront)
        .siblings("p")
        .should("have.text", nationalIdFrontStatus)

      cy.findByText(kycKeys.documentVerification.statusInfo.nationalIdBack)
        .siblings("p")
        .should("have.text", nationalIdBackStatus)

      cy.findByText(kycKeys.documentVerification.statusInfo.livePhoto)
        .siblings("p")
        .should("have.text", livePhotoStatus)

      cy.findByText(kycKeys.documentVerification.statusInfo.callScheduled)
        .siblings("p")
        .should("have.text", kycKeys.documentVerification.status.required)
    })

    it("should navigate back to Kyc stepper screen on Back button CTA", () => {
      cy.intercept("/api/user/kyc/status", {
        fixture: "kycStatusStep2Completed",
      }).as("kycStatus")

      cy.findByRole("button", { name: commonKeys.button.back }).click()

      cy.findByRole("button", {
        name: kycKeys.confirmModal.actions.goBack,
      }).click()

      cy.location("pathname").should("equal", "/kyc")
    })

    it("should navigate user to Verify ID on your mobile after user scanned on mobile for non KSA user", () => {
      cy.intercept("/api/user/kyc/hybrid-flow", {
        fixture: "kycHybridFlow",
      }).as("kycHybridFlow")

      cy.intercept("/api/user/kyc/document-verification", {
        fixture: "kycDocumentVerificationStatus",
      }).as("kycDocumentVerification")

      cy.intercept("/api/user", { fixture: "indiaNationalityUser" }).as("user")

      cy.visit("/kyc/document-verification")

      cy.findByRole("heading", { level: 2 }).should(
        "have.text",
        kycKeys.documentVerification.heading,
      )
    })

    it("should show status of all docs required for non KSA user", () => {
      cy.intercept("/api/user/kyc/document-verification", {
        fixture: "kycDocumentVerificationStatus",
      }).as("kycDocumentVerification")
      let passportInfoStatus =
        kycNonKSAUserInformation.passportFront === true
          ? kycKeys.documentVerification.status.complete
          : kycKeys.documentVerification.status.required
      let nationalIdFrontStatus =
        kycNonKSAUserInformation.nationalIdFront === true
          ? kycKeys.documentVerification.status.complete
          : kycKeys.documentVerification.status.required
      let nationalIdBackStatus =
        kycNonKSAUserInformation.nationalIdBack === true
          ? kycKeys.documentVerification.status.complete
          : kycKeys.documentVerification.status.required
      let livePhotoStatus =
        kycNonKSAUserInformation.livePhoto === true
          ? kycKeys.documentVerification.status.complete
          : kycKeys.documentVerification.status.required

      cy.findByText(kycKeys.documentVerification.statusInfo.passportFront)
        .siblings("p")
        .should("have.text", passportInfoStatus)

      cy.findByText(
        kycKeys.documentVerification.statusInfo.passportSignature,
      ).should("not.exist")

      cy.findByText(kycKeys.documentVerification.statusInfo.nationalIdFront)
        .siblings("p")
        .should("have.text", nationalIdFrontStatus)

      cy.findByText(kycKeys.documentVerification.statusInfo.nationalIdBack)
        .siblings("p")
        .should("have.text", nationalIdBackStatus)

      cy.findByText(kycKeys.documentVerification.statusInfo.livePhoto)
        .siblings("p")
        .should("have.text", livePhotoStatus)

      cy.findByText(kycKeys.documentVerification.statusInfo.callScheduled)
        .siblings("p")
        .should("have.text", kycKeys.documentVerification.status.required)
    })

    it("should navigate to dashboard screen on save & exit CTA", () => {
      cy.intercept("/api/user/kyc/status", {
        fixture: "kycStatusStep2Completed",
      }).as("kycStatus")

      cy.findByRole("button", { name: commonKeys.button.saveAndExit }).click()
      cy.findByRole("button", { name: commonKeys.button.exit }).click()

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
      it("should display CTAs for KSA national when Kyc journey is not started", () => {
        cy.visit("/kyc")
        cy.findByRole("button", {
          name: kycKeys.chapterSelection.button.nationalSingleSignOn,
        }).should("be.visible")
        cy.findByRole("button", {
          name: kycKeys.chapterSelection.button.enterManually,
        }).should("be.visible")
      })

      it("should change CTA to Edit when Personal Information section is completed", () => {
        cy.intercept("/api/user/kyc/status", {
          fixture: "kycStatusStep1Completed",
        }).as("kycStatus")

        cy.reload()

        cy.findByRole("button", {
          name: kycKeys.chapterSelection.button.nationalSingleSignOn,
        }).should("not.exist")
        cy.findByRole("button", {
          name: kycKeys.chapterSelection.button.enterManually,
        }).should("not.exist")

        cy.get("footer")
          .findByRole("button", {
            name: commonKeys.button.continue,
          })
          .should("be.visible")

        cy.findByText(kycKeys.chapterSelection.chapterOne.stepper.title)
          .parent()
          .findByRole("link", { name: commonKeys.nav.links.edit })
          .should("be.visible")
      })

      it("should start personal information section again on Edit CTA action", () => {
        cy.findByRole("link", { name: commonKeys.nav.links.edit }).click()
        cy.location("pathname").should("equal", "/kyc/personal-information")
      })

      it("should change CTA to Edit when Investment experience section is completed", () => {
        cy.intercept("/api/user/kyc/status", {
          fixture: "kycStatusStep2Completed",
        }).as("kycStatus")

        cy.visit("/kyc")

        cy.findByText(kycKeys.chapterSelection.chapterOne.stepper.title)
          .parent()
          .findByRole("link", { name: commonKeys.nav.links.edit })
          .should("be.visible")

        cy.findByText(kycKeys.chapterSelection.chapterTwo.stepper.title)
          .parent()
          .findByRole("link", { name: commonKeys.nav.links.edit })
          .should("be.visible")
      })

      it("should show CTAs for continue to from mobile for ID verification", () => {
        cy.get("footer")
          .findByRole("button", {
            name: commonKeys.button.continue,
          })
          .should("be.visible")
      })

      it("should stop session if user continues document verification from desktop after scanning QR code", () => {
        cy.intercept("/api/user/kyc/hybrid-flow", {
          fixture: "kycHybridFlow",
        }).as("kycHybridFlow")
        cy.intercept("/api/auth/logout?lang=en", { statusCode: 200 }).as(
          "logout",
        )

        cy.visit("/kyc/id-verification?isHybridFlow=yes")

        cy.wait("@kycHybridFlow")

        cy.intercept("/api/user/kyc/hybrid-flow", {
          fixture: "kycNotHybridFlow",
        }).as("kycNotHybridFlow")

        cy.location("pathname").should("equal", "/kyc/session-stopped")
      })
    },
  )
})
