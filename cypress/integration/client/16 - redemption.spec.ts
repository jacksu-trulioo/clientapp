const faker = require("faker")

describe("Redemption", () => {
  let redemptionkeys
  let opportunitiesKeys
  let commonKeys
  let scheduleMeetingKeys

  before(() => {
    cy.loginClient()

    cy.fixture("../../public/locales/en/redemption").then((keys) => {
      redemptionkeys = keys
    })
    cy.fixture("../../public/locales/en/opportunities").then((keys) => {
      opportunitiesKeys = keys
    })
    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })
    cy.fixture("../../public/locales/en/scheduleMeeting").then((keys) => {
      scheduleMeetingKeys = keys
    })
  })

  context("Redemption - Liquid Holdings", () => {
    it("should open liquid holdings page through investment cart", () => {
      cy.visit("/client")
      // Should go to investment cart
      cy.findByRole("button", { name: /Opportunities/i }).click()
      cy.findByRole("link", {
        name: opportunitiesKeys.client.labels.allDeals,
      }).click()
      cy.location("pathname").should("match", /opportunities/)
      cy.findByText(opportunitiesKeys.index.page.title, {
        timeout: 10000,
      }).should("be.visible")
      cy.findAllByRole("button", { name: commonKeys.button.viewDetails })
        .eq(1)
        .click()
      cy.wait(2000)
      cy.findByRole("button", { name: "Order Management" })
        .children()
        .eq(1)
        .invoke("text")
        .then((txt) => {
          if (txt.trim() == "Add to Cart") {
            cy.findByRole("button", {
              name: opportunitiesKeys.client.button.addToCart,
            }).click()
          }
        })
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.location("pathname", { timeout: 4000 }).should("match", /subscription/)
      cy.wait(2000)
      cy.findByRole("main", {
        name: "Investment Cart Main",
      }).should("be.visible")
      cy.findByRole("heading", {
        name: "Investment cart",
      }).should("be.visible")
      cy.findAllByLabelText("More Info").should("be.visible")
      // On clicking the "redeem" link
      cy.findByText("Redeem").click()
      cy.wait(2000)
      cy.location("pathname", { timeout: 4000 }).should("match", /redemption/)
      cy.findByRole("button", {
        name: commonKeys.button.exit,
      }).click()
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      cy.findAllByRole("dialog", { name: "Remove Deal" }).each(() => {
        cy.findAllByRole("dialog", { name: "Remove Deal" }).eq(0).click()
        cy.findByRole("button", { name: "Yes", timeout: 5000 }).click()
        cy.wait(2000)
      })
      cy.findByRole("button", {
        name: "Back to opportunities",
      }).click()
    })

    it("should open liquid holdings page through empty investment cart", () => {
      // Should go to investment cart without adding any deal and/or program
      cy.wait(2000)
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.location("pathname", { timeout: 4000 }).should("match", /subscription/)
      cy.findByRole("main", {
        name: "Investment Cart Main",
      }).should("be.visible")
      cy.findByText(/Your investment cart is empty/i).should("be.visible")
      cy.findByText(/There are no deals in your investment cart/i).should(
        "be.visible",
      )
      // On clicking the "redeem" link
      cy.findByText("Redeem").click()
      cy.location("pathname", { timeout: 4000 }).should("match", /redemption/)
    })

    it("screen validations", () => {
      // About your liquid holdings
      cy.findByRole("heading", {
        name: redemptionkeys.myLiquidHolding.title,
      }).should("be.visible")
      cy.findByText(redemptionkeys.myLiquidHolding.description).should(
        "be.visible",
      )
      cy.findByRole("heading", {
        name: redemptionkeys.aboutLiquids.title,
      }).should("be.visible")
      cy.findByText(/The figures shown are accurate as of/i).should(
        "be.visible",
      )
      // Liquid asset
      cy.findByRole("group", {
        name: "Liquid asset",
      }).should("be.visible")
      // On selecting a liquid asset
      cy.findByRole("group", {
        name: "Liquid asset",
      })
        .children()
        .eq(0)
        .click()
      cy.findByRole("group", {
        name: "Liquid asset",
      })
        .children()
        .eq(1)
        .click()
      // Top Header section
      cy.findByText(redemptionkeys.myLiquidHolding.header).should("be.visible")
      cy.findByRole("button", {
        name: commonKeys.button.exit,
      }).should("be.visible")
      // Footer section
      cy.findByText("Need support?").should("be.visible")
      cy.findByText(redemptionkeys.supportSection.subTitle).click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /schedule-meeting/,
      )
      cy.findByText(scheduleMeetingKeys.page.title).should("be.visible")
      cy.findByRole("button", {
        name: "Close schedule meeting modal",
      }).click()
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).should("be.visible")
    })

    it("should exit from liquid holdings page", () => {
      // Click on redeem link in investment cart
      // Click on save & exit button
      cy.findByRole("button", {
        name: commonKeys.button.exit,
      }).click()
      cy.location("pathname").should("match", /opportunities/)
      cy.findByRole("heading", {
        name: opportunitiesKeys.client.title,
      }).should("be.visible")
    })

    it("should go to the redemption details page", () => {
      cy.wait(2000)
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.findByText("Redeem").click()
      // select the liquid asset you wish to redeem from
      cy.findByRole("group", {
        name: "Liquid asset",
      })
        .children()
        .eq(1)
        .click()
      // Click on commonKeys.button.next button
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
    })
  })

  context("Redemption - Details", () => {
    it("screen validations", () => {
      // About your holdings
      cy.findByRole("heading", {
        name: redemptionkeys.redemptionDetails.title,
      }).should("be.visible")
      cy.findByText(redemptionkeys.redemptionDetails.description).should(
        "be.visible",
      )
      cy.findByRole("heading", {
        name: "About your liquid holdings",
      }).should("be.visible")
      // Redemption amount
      cy.findByRole("textbox", {
        name: "redeemAmount",
      }).each((box) => {
        cy.wrap(box)
          .click()
          .type(faker.datatype.number({ min: 10000000, max: 10000000 }))
      })
      // Reason of redemption
      cy.findByRole("group", {
        name: "reason",
      })
        .children()
        .eq(1)
        .click()
        .contains("Partial redemption for capital call")
        .click()
      // Balance table
      cy.findByRole("gridcell", {
        name: "Available Balance",
      })
        .invoke("text")
        .then((text) => {
          let num = text.replace(/ /g, "")
          expect(num).to.match(/^[$0-9,]*$/)
        })
      cy.findByRole("gridcell", {
        name: "Redemption amount",
      })
        .invoke("text")
        .then((text) => {
          let num = text.replace(/ /g, "")
          expect(num).to.match(/^[$0-9,]*$/)
        })
      cy.findByRole("gridcell", {
        name: "Remaining balance",
      })
        .invoke("text")
        .then((text) => {
          let num = text.replace(/ /g, "")
          expect(num).to.match(/^[$0-9,]*$/)
        })
      // Authorized signatory checkbox
      cy.findByRole("checkbox", {
        name: "authorizedSignatory",
      })
        .children()
        .eq(0)
        .click()
      // T&Cs checkbox
      cy.findByRole("checkbox", {
        name: "acceptTerms",
      })
        .children()
        .eq(0)
        .click()
      // Terms and condition modal
      cy.findByRole("button", {
        name: "terms and conditions",
      }).click()
      cy.findByRole("heading", { name: "Terms and Conditions" }).should(
        "be.visible",
      )
      cy.findByRole("button", { name: commonKeys.button.close }).click()
      // Top header section
      cy.findByText(redemptionkeys.redemptionDetails.header).should(
        "be.visible",
      )
      cy.findByRole("button", {
        name: commonKeys.button.exit,
      }).should("be.visible")
      // Footer section
      cy.findByRole("button", { name: "Redeem Amount" }).should("be.visible")
      cy.findByRole("button", { name: commonKeys.button.back }).should(
        "be.visible",
      )
      cy.findByText("Need support?").should("be.visible")
      cy.findByText(redemptionkeys.supportSection.subTitle).click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /schedule-meeting/,
      )
      cy.findByText(scheduleMeetingKeys.page.title).should("be.visible")
      cy.findByRole("button", {
        name: "Close schedule meeting modal",
      }).click()
    })

    it("should show valid error messages", () => {
      // After selecting the liquid asset and clicking on next button in liquid holdings page
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      // On clicking next by selecting all the checkboxes & entering values without entering the redemption amount
      cy.findByRole("group", {
        name: "reason",
      })
        .children()
        .eq(1)
        .click()
        .contains("Partial redemption for capital call")
        .click()
      cy.findByRole("checkbox", {
        name: "authorizedSignatory",
      })
        .children()
        .eq(0)
        .click()
      cy.findByRole("checkbox", {
        name: "acceptTerms",
      })
        .children()
        .eq(0)
        .click()
      cy.findByRole("button", {
        name: "Redeem Amount",
      }).click()
      cy.findByText(redemptionkeys.redemptionDetails.header).should(
        "be.visible",
      )
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      // On clicking next by selecting all the checkboxes & entering values without selecting the redemption reason
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      cy.findByRole("textbox", {
        name: "redeemAmount",
      }).each((box) => {
        cy.wrap(box)
          .click()
          .type(faker.datatype.number({ min: 10000000, max: 10000000 }))
      })

      cy.findByRole("checkbox", {
        name: "authorizedSignatory",
      })
        .children()
        .eq(0)
        .click()
      cy.findByRole("checkbox", {
        name: "acceptTerms",
      })
        .children()
        .eq(0)
        .click()
      cy.findByRole("button", {
        name: "Redeem Amount",
      }).click()
      cy.findByText("Select a reason for redemption").should("be.visible")
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      // on clicking by selecting all the checkboxes & entering values without selecting the checkbox "I confirm that I am an authorized signatory of this account"
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      cy.findByRole("textbox", {
        name: "redeemAmount",
      }).each((box) => {
        cy.wrap(box)
          .click()
          .type(faker.datatype.number({ min: 10000000, max: 10000000 }))
      })
      cy.findByRole("group", {
        name: "reason",
      })
        .children()
        .eq(1)
        .click()
        .contains("Partial redemption for capital call")
        .click()
      cy.findByRole("checkbox", {
        name: "acceptTerms",
      })
        .children()
        .eq(0)
        .click()
      cy.findByRole("button", {
        name: "Redeem Amount",
      }).click()
      cy.findByText(commonKeys.client.authSignatory.error).should("be.visible")
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      // on clicking next by selecting all the checkboxes & entering values without selecting the checkbox  "I agree with the terms and conditions"
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      cy.findByRole("textbox", {
        name: "redeemAmount",
      }).each((box) => {
        cy.wrap(box)
          .click()
          .type(faker.datatype.number({ min: 10000000, max: 10000000 }))
      })
      cy.findByRole("group", {
        name: "reason",
      })
        .children()
        .eq(1)
        .click()
        .contains("Partial redemption for capital call")
        .click()
      cy.findByRole("checkbox", {
        name: "authorizedSignatory",
      })
        .children()
        .eq(0)
        .click()
      cy.findByRole("button", {
        name: "Redeem Amount",
      }).click()
      cy.findByText(commonKeys.client.agreeTerms.error).should("be.visible")
      cy.findByRole("button", { name: commonKeys.button.back }).click()
    })

    it("should enter and select valid data points and go to confirmation", () => {
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      // click on redeem all present below the redemption amount text field
      cy.findByRole("textbox", {
        name: "redeemAmount",
      }).clear()
      cy.findByRole("button", {
        name: redemptionkeys.redemptionDetails.redeemAll,
      }).click()
      cy.wait(2000)
      cy.findByRole("textbox", {
        name: "redeemAmount",
      }).clear()
      // enter the amount you wish to redeem (for testing purpose do not redeem anything more than $5)
      cy.findByRole("textbox", {
        name: "redeemAmount",
      }).type("1")
      cy.findByRole("gridcell", {
        name: "Available Balance",
      })
        .invoke("text")
        .then((text) => {
          let num = text.replace(/ /g, "")
          expect(num).to.match(/^[$0-9,]*$/)
        })
      cy.findByText("-$1").should("be.visible")
      cy.findByRole("gridcell", {
        name: "Remaining balance",
      })
        .invoke("text")
        .then((text) => {
          let num = text.replace(/ /g, "")
          expect(num).to.match(/^[$0-9,]*$/)
        })
      // Select any reason of redemption
      cy.findByRole("group", {
        name: "reason",
      })
        .children()
        .eq(1)
        .click()
        .contains("Partial redemption for capital call")
        .click()
      // The Balance table
      cy.findByRole("gridcell", {
        name: "Available Balance",
      })
        .invoke("text")
        .then((text) => {
          let num = text.replace(/ /g, "")
          expect(num).to.match(/^[$0-9,]*$/)
        })
      cy.findByText("-$1").should("be.visible")
      cy.findByRole("gridcell", {
        name: "Remaining balance",
      })
        .invoke("text")
        .then((text) => {
          let num = text.replace(/ /g, "")
          expect(num).to.match(/^[$0-9,]*$/)
        })
      // On selecting the checkbox "I confirm that I am an authorized signatory of this account"
      cy.findByRole("checkbox", {
        name: "authorizedSignatory",
      })
        .children()
        .eq(0)
        .click()
      // On selecting the checkbox  "I agree with the terms and conditions"
      cy.findByRole("checkbox", {
        name: "acceptTerms",
      })
        .children()
        .eq(0)
        .click()
      // click on "redeem amount"
      cy.findByRole("button", {
        name: "Redeem Amount",
      }).click()
    })
  })

  context("Redemption - Confirmation", () => {
    it("screen validations", () => {
      // The asset name
      cy.findByText(redemptionkeys.confirmation.successMsg).should("be.visible")
      cy.findByRole("heading", { name: "Asset Name" }).should("be.visible")
      // The Balance table
      cy.findByRole("gridcell", {
        name: "Available Balance",
      })
        .invoke("text")
        .then((text) => {
          let num = text.replace(/ /g, "")
          expect(num).to.match(/^[$0-9,]*$/)
        })
      cy.findByText("-$1").should("be.visible")
      cy.findByRole("gridcell", {
        name: "Remaining Balance",
      })
        .invoke("text")
        .then((text) => {
          let num = text.replace(/ /g, "")
          expect(num).to.match(/^[$0-9,]*$/)
        })
      // Note of confirmation
      cy.findByText(/The figures shown are accurate as of/i).should(
        "be.visible",
      )
      cy.findByText(redemptionkeys.confirmation.emailConfirmationText).should(
        "be.visible",
      )
      cy.findByText(redemptionkeys.confirmation.processText).should(
        "be.visible",
      )
    })

    it("should go back to opportunities", () => {
      // On clicking "confirm" button in redemption details page
      // On clicking "go back to opportunities" button
      cy.wait(2000)
      cy.findByRole("button", {
        name: "Back To Opportunities",
      }).click()
      cy.location("pathname").should("match", /opportunities/)
      cy.findByRole("heading", {
        name: "Investment Opportunities",
      }).should("be.visible")
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.findByText("Redeem").click()
      cy.findByRole("group", {
        name: "Liquid asset",
      })
        .children()
        .eq(1)
        .click()
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      cy.findByRole("textbox", {
        name: "redeemAmount",
      }).type("1")
      cy.findByRole("group", {
        name: "reason",
      })
        .children()
        .eq(1)
        .click()
        .contains("Partial redemption for capital call")
        .click()
      cy.findByRole("checkbox", {
        name: "authorizedSignatory",
      })
        .children()
        .eq(0)
        .click()

      cy.findByRole("checkbox", {
        name: "acceptTerms",
      })
        .children()
        .eq(0)
        .click()
      cy.findByRole("button", {
        name: "Redeem Amount",
      }).click()
      // On clicking commonKeys.button.exit button in redemption conformation page
      cy.wait(2000)
      cy.findByText(redemptionkeys.confirmation.successMsg).should("be.visible")
      cy.findByRole("button", {
        name: commonKeys.button.exit,
      }).click()
    })

    it("should show no redemption UI and go back to opportunities", () => {
      cy.visit("/client")
      cy.get("#menu-button-user-menu-button").click()
      cy.findByRole("menuitem", {
        name: commonKeys.nav.links.setting,
      }).click()
      cy.findByRole("combobox").clear().type("37829{enter}")
      cy.wait(4000)
      cy.findByRole("button", { name: /Opportunities/i }).click()
      cy.findByRole("link", {
        name: opportunitiesKeys.client.labels.allDeals,
      }).click()
      cy.location("pathname").should("match", /opportunities/)
      cy.findByText(opportunitiesKeys.index.page.title, {
        timeout: 10000,
      }).should("be.visible")
      // On clicking redeem link in investment cart with no liquid assets
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.location("pathname", { timeout: 4000 }).should("match", /subscription/)
      cy.wait(2000)
      cy.findByText(/Your investment cart is empty/i).should("be.visible")
      cy.findByText("Redeem").click()
      cy.wait(2000)
      cy.location("pathname", { timeout: 4000 }).should("match", /redemption/)
      cy.findByText("My liquid holdings").should("be.visible")
      cy.findByText(redemptionkeys.empty.title).should("be.visible")
      cy.findByRole("img").should("be.visible")
      // On clicking "back to opportunities" button
      cy.findByRole("button", {
        name: "Back To Opportunities",
      }).click()
      cy.location("pathname").should("match", /opportunities/)
    })
  })
})
