describe("Subscription", () => {
  let faker = require("faker")
  let opportunitiesKeys
  let subscriptionKeys
  let commonKeys
  let redemptionKeys

  before(() => {
    cy.loginClient()

    cy.fixture("../../public/locales/en/opportunities").then((keys) => {
      opportunitiesKeys = keys
    })
    cy.fixture("../../public/locales/en/subscription").then((keys) => {
      subscriptionKeys = keys
    })
    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })
    cy.fixture("../../public/locales/en/redemption").then((keys) => {
      redemptionKeys = keys
    })
  })

  context("Investment Cart", () => {
    it("Should show investment cart with the deals added to the cart", () => {
      // Go to opportunities or all deals or interested deals page
      cy.visit("/client")
      cy.findByRole("button", {
        name: "Opportunities",
      }).click()
      cy.findByRole("link", {
        name: commonKeys.nav.links.allDeals,
        timeout: 20000,
      }).click()
      cy.location("pathname").should("match", /opportunities/)
      cy.findByText(opportunitiesKeys.index.page.title, {
        timeout: 20000,
      }).should("be.visible")
      // Click on "view details" button of any deal
      cy.findAllByRole("button", {
        name: commonKeys.button.viewDetails,
        timeout: 20000,
      })
        .eq(1)
        .click({ timeout: 20000 })
      // Click on "add to cart"
      cy.addToCartDeal()
      // Click on "investment cart" button which is present in all the mentioned pages
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      cy.findByRole("heading", {
        name: commonKeys.client.investmentCart.title,
        timeout: 20000,
      }).should("be.visible")
    })

    it("Should open the investment cart page", () => {
      // Go to opportunities or all deals or interested deals page
      cy.visit("/client/opportunities")
      // Click on "view details" button of any deal
      cy.findAllByRole("button", {
        name: commonKeys.button.viewDetails,
        timeout: 20000,
      })
        .eq(1)
        .click()
      cy.wait(2000)
      // Click on "investment cart" button which is present in all the mentioned pages
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.findByRole("main", {
        name: "Investment Cart Main",
        timeout: 20000,
      }).then((body) => {
        if (body.find('[aria-label="Empty Investment Cart"]').length > 0) {
          cy.findByText(subscriptionKeys.investmentCart.emptyCart.title).should(
            "be.visible",
          )
          cy.findByText(
            subscriptionKeys.investmentCart.emptyCart.description,
          ).should("be.visible")
        } else {
          cy.findByRole("heading", {
            name: commonKeys.client.investmentCart.title,
          }).should("be.visible")
        }
      })
    })

    it("Screen validations", () => {
      cy.removeDeal()
      // Click on investment cart button
      cy.visit("/client/opportunities")
      cy.findAllByRole("button", {
        name: commonKeys.button.viewDetails,
        timeout: 20000,
      })
        .eq(1)
        .click()
      cy.addToCartDeal()
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      // Header section
      cy.findByRole("button", {
        name: commonKeys.button.exit,
        timeout: 20000,
      }).should("be.visible")
      // Deals and / or programs  and more info
      cy.findAllByLabelText(/More info/i).click({ multiple: true })
      cy.findAllByText(
        `${subscriptionKeys.investmentCart.moreInfoDropdown.sponsor}:`,
      ).should("be.visible")
      cy.findAllByText(
        `${subscriptionKeys.investmentCart.moreInfoDropdown.country}:`,
      ).should("be.visible")
      cy.findAllByText(
        `${subscriptionKeys.investmentCart.moreInfoDropdown.sector}:`,
      ).should("be.visible")
      cy.findAllByText(
        `${subscriptionKeys.investmentCart.moreInfoDropdown.expectedReturn}:`,
      ).should("be.visible")
      cy.findAllByText(
        `${subscriptionKeys.investmentCart.moreInfoDropdown.expectedExit}:`,
      ).should("be.visible")
      cy.findAllByText(
        `${subscriptionKeys.investmentCart.moreInfoDropdown.assetClass}:`,
      ).should("be.visible")
      // check box
      cy.findAllByRole("dialog", {
        name: "Remove Deal",
        timeout: 20000,
      })
        .scrollIntoView()
        .should("be.visible")
      // "x" icon
      cy.findAllByRole("dialog", {
        name: "Remove Deal",
        timeout: 20000,
      })
        .eq(0)
        .click({ multiple: true })
      cy.findByRole("button", {
        name: "No",
      }).click()
      // Footer
      cy.findByText(
        commonKeys.client.orderManagementCTAs.redeemButtonText,
      ).should("be.visible")
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).should("be.visible")
    })

    it("Should remove deal through confirmation pop up", () => {
      // Click on investment cart button
      cy.visit("/client/opportunities")
      cy.findAllByRole("button", {
        name: commonKeys.button.viewDetails,
        timeout: 20000,
      })
        .eq(1)
        .click()
      cy.addToCartDeal()
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      // click on "x" icon in the deal card
      cy.findAllByRole("dialog", {
        name: "Remove Deal",
        timeout: 20000,
      })
        .eq(0)
        .click({ multiple: true })
      // On clicking no
      cy.findByRole("button", {
        name: "No",
        timeout: 20000,
      }).click()
      // On clicking yes
      cy.findAllByRole("dialog", {
        name: "Remove Deal",
        timeout: 20000,
      })
        .eq(0)
        .click({ multiple: true })
      cy.findByRole("button", {
        name: "Yes",
        timeout: 20000,
      }).click()
    })

    it("Should close the investment cart", () => {
      // Click on "investment cart" button which is present in all the opportunities pages
      cy.visit("/client/opportunities")
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      cy.findByRole("main", {
        name: "Investment Cart Main",
        timeout: 20000,
      }).then((body) => {
        if (body.find('[aria-label="Empty Investment Cart"]').length > 0) {
          cy.findByText(
            subscriptionKeys.investmentCart.emptyCart.title,
            subscriptionKeys.investmentCart.emptyCart.description,
          ).should("be.visible")
          cy.findByText(
            subscriptionKeys.investmentCart.emptyCart.description,
          ).should("be.visible")
        } else {
          cy.findByRole("heading", {
            name: commonKeys.client.investmentCart.title,
          }).should("be.visible")
        }
      })
      // on clicking commonKeys.button.exit
      cy.findByRole("button", {
        name: commonKeys.button.exit,
      }).click()
      cy.findAllByText(opportunitiesKeys.index.page.title).should("be.visible")
    })

    it("on clicking on 'redeem' at the footer section > client will be taken to the redemption flow's first screen", () => {
      // Click on "investment cart" button which is present in all the opportunities pages
      cy.visit("/client/opportunities")
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
        timeout: 20000,
      }).click()
      cy.wait(2000)
      // Click on Redeem button present in the footer
      cy.findByText(
        commonKeys.client.orderManagementCTAs.redeemButtonText,
      ).click()
      cy.findByRole("heading", {
        name: redemptionKeys.myLiquidHolding.title,
      }).should("be.visible")
    })
  })

  context("Empty investment cart", () => {
    it("Should go back to opportunities page or redemption - liquid holding page", () => {
      // Go to investment cart
      cy.visit("/client/opportunities")
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
        timeout: 20000,
      }).click()
      cy.wait(2000)
      // If the cart is empty
      cy.findByRole("main", {
        name: "Investment Cart Main",
        timeout: 20000,
      }).then((body) => {
        if (body.find('[aria-label="Empty Investment Cart"]').length > 0) {
          cy.findByText(
            subscriptionKeys.investmentCart.emptyCart.title,
            subscriptionKeys.investmentCart.emptyCart.description,
          ).should("be.visible")
          cy.findByText(
            subscriptionKeys.investmentCart.emptyCart.description,
          ).should("be.visible")
        } else {
          cy.findByRole("heading", {
            name: commonKeys.client.investmentCart.title,
          }).should("be.visible")
        }
      })

      // On clicking  "Back to opportunities" button
      cy.findByRole("main", {
        name: "Investment Cart Main",
        timeout: 20000,
      }).then((body) => {
        if (body.find('[aria-label="Empty Investment Cart"]').length > 0) {
          cy.findByRole("button", {
            name: subscriptionKeys.confirmation.opportunitiesCTA,
          }).click()
        } else {
          cy.findByRole("button", {
            name: commonKeys.button.exit,
          }).click()
        }
      })
      cy.findAllByText(opportunitiesKeys.index.page.title, {
        timeout: 20000,
      }).should("be.visible")
      // On clicking "Redeem" link
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
        timeout: 20000,
      }).click()
      cy.wait(2000)
      cy.findByText(commonKeys.client.orderManagementCTAs.redeemButtonText, {
        timeout: 20000,
      }).click()
      cy.findByRole("heading", {
        name: redemptionKeys.myLiquidHolding.title,
        timeout: 20000,
      }).should("be.visible")
    })
  })

  context("Subscription Details", () => {
    it("should give appropriate error messages while entering subscription amount for deals and/or programs  an no decimal values should be entered", () => {
      // Go to opportunities or all deals or interested deals page
      cy.visit("/client")
      cy.findByRole("button", { name: "Opportunities" }).click()
      cy.findByRole("link", {
        name: commonKeys.nav.links.allDeals,
        timeout: 20000,
      }).click()
      cy.location("pathname").should("match", /opportunities/)
      cy.findByText(opportunitiesKeys.index.page.title, {
        timeout: 10000,
      }).should("be.visible")
      // Click on "view details" button of any deal
      cy.findAllByRole("button", {
        name: commonKeys.button.viewDetails,
        timeout: 20000,
      })
        .eq(1)
        .click()
      // Click on "add to cart"
      cy.addToCartDeal()
      // Click on "investment cart" button which is present in all the mentioned pages
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      cy.findByRole("button", {
        name: commonKeys.button.next,
        timeout: 20000,
      }).click()
      // On entering $ amount more than the limit
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box)
          .click()
          .type(faker.datatype.number({ min: 100000000, max: 1000000000 }))
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findAllByRole("alert", { name: "maximum deal" }).should("be.visible")
      })
      // On entering $ amount less than the limit
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box)
          .click()
          .clear()
          .type(faker.datatype.number({ min: 100, max: 1000 }))
        cy.findByRole("button", { name: commonKeys.button.next }).click()
        cy.findAllByRole("alert", { name: "minimum deal" }).should("be.visible")
      })
      // On entering an invalid $amount
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box).click().clear().type(faker.random.alpha(5))
      })
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box).click().should("be.empty")
      })
      // On entering decimal point in the $ amount text field
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box).click().clear().type("8.5.2.2.5")
      })
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box).should("have.value", "85,225")
      })
    })

    it("should be able to successfully go ahead to the  order summary page  for one deal", () => {
      cy.removeDeal()
      // add a deal to the cart
      cy.visit("/client/opportunities")
      cy.findAllByRole("button", {
        name: commonKeys.button.viewDetails,
        timeout: 20000,
      })
        .eq(1)
        .click()
      cy.addToCartDeal()
      // Click on view investment cart
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      // Click on next
      cy.findByRole("button", {
        name: commonKeys.button.next,
        timeout: 20000,
      }).click()
      // Enter valid $ amount for the selected deal
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box)
          .click()
          .clear()
          .type(faker.datatype.number({ min: 100000, max: 100000000 }))
      })
      // click on next
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findAllByText(subscriptionKeys.orderSummary.heading).should(
        "be.visible",
        { timeout: 20000 },
      )
    })

    it("should be able to successfully go ahead to the  order summary page  for 2 deals", () => {
      cy.removeDeal()
      // add 2 deals to the cart
      cy.visit("/client/opportunities")
      cy.findAllByRole("button", {
        name: commonKeys.button.viewDetails,
        timeout: 20000,
      })
        .eq(1)
        .click()
      cy.addToCartDeal()
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.wait(2000)
      cy.findAllByRole("button", {
        name: commonKeys.button.viewDetails,
        timeout: 20000,
      })
        .eq(2)
        .click()
      cy.addToCartDeal()
      // Click on view investment cart
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      // Click on next
      cy.findByRole("button", {
        name: commonKeys.button.next,
        timeout: 20000,
      }).click()
      // Enter valid $ amount for the selected deal
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box)
          .click()
          .clear()
          .type(faker.datatype.number({ min: 100000, max: 100000000 }))
      })
      // click on next
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findAllByText(subscriptionKeys.orderSummary.heading).should(
        "be.visible",
        { timeout: 20000 },
      )
    })

    it("should be able to successfully go ahead to the program details page  for a program", () => {
      cy.removeDeal()
      // add a program to the cart
      cy.visit("/client/opportunities")
      cy.findAllByText(/Program/i)
        .eq(0)
        .click()
      cy.addToCartProgram()
      // Click on view investment cart
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      // Click on next
      cy.findByRole("button", {
        name: commonKeys.button.next,
        timeout: 20000,
      }).click()
      // Enter valid $ amount for the selected program
      cy.findAllByRole("textbox").type(
        faker.datatype.number({ min: 100000, max: 100000000 }),
      )
      // on clicking the checkbox
      cy.findByText(/10 deals/i).click()
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByRole("heading", {
        name: subscriptionKeys.programDetails.headng,
        level: 2,
        timeout: 10000,
      })
        .scrollIntoView()
        .should("be.visible")
      // On selecting the Number of deals you wish to subscribe to
      cy.get('input[type="checkbox"]').eq(1).click({ force: true })
      // click on next
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByRole("heading", {
        name: subscriptionKeys.orderSummary.heading,
        level: 2,
        timeout: 10000,
      })
        .scrollIntoView()
        .should("be.visible")
    })

    it("should be able to successfully go ahead to the program details/ order summary page  for a deal + a program", () => {
      // add a deal and a program to the cart
      cy.visit("/client/opportunities")
      cy.findAllByRole("button", { name: commonKeys.button.viewDetails })
        .eq(1)
        .click()
      cy.wait(2000)
      cy.addToCartDeal()
      // Click on view investment cart
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      // Click on next
      cy.findByRole("button", {
        name: commonKeys.button.next,
        timeout: 20000,
      }).click()
      // Enter valid $ amount for the selected program
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box)
          .click()
          .type(faker.datatype.number({ min: 100000, max: 100000000 }))
      })
      // on clicking the checkbox
      cy.get('input[type="checkbox"]').click({ force: true })
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByRole("heading", {
        name: subscriptionKeys.programDetails.headng,
        level: 2,
        timeout: 10000,
      })
        .scrollIntoView()
        .should("be.visible")
      // On selecting the Number of deals you wish to subscribe to
      cy.findAllByRole("checkbox").eq(0).click({ force: true })
      // click on next
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findByRole("heading", {
        name: subscriptionKeys.orderSummary.heading,
        level: 2,
        timeout: 10000,
      })
        .scrollIntoView()
        .should("be.visible")
    })
  })

  context.only("Program Details", () => {
    it("should show the program details page and its data points", () => {
      cy.removeDeal()
      cy.visit("/client/opportunities")
      cy.findAllByText(/Program/i)
        .eq(0)
        .click()
      cy.addToCartProgram()
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      // After entering the subscription details for programs, click next button
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box)
          .click()
          .type(faker.datatype.number({ min: 100000, max: 100000000 }))
      })
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      // Click on a default selected deal's checkbox
      cy.get('input[type="checkbox"]').eq(2).should("be.disabled")
      // Click on the "i" icon of a default deal
      cy.findByRole("dialog", {
        name: "Info",
      }).click({ force: true })
      cy.findByText(subscriptionKeys.programDetails.newDealPopup.title).should(
        "be.visible",
      )
      cy.findByText(
        subscriptionKeys.programDetails.newDealPopup.description,
      ).should("be.visible")
      cy.findByRole("button", {
        name: "Close",
      }).click()
      // Click on the deal's checkboxes  that you wish to proceed with
      cy.get('input[type="checkbox"]').eq(4).click({ force: true })
      // Click on "more info" below the deal name
      cy.findAllByLabelText(/More info/i)
        .eq(4)
        .click()
      cy.findAllByText(
        `${subscriptionKeys.investmentCart.moreInfoDropdown.sponsor}:`,
      ).should("be.visible")
      cy.findAllByText(
        `${subscriptionKeys.investmentCart.moreInfoDropdown.country}:`,
      ).should("be.visible")
      cy.findAllByText(
        `${subscriptionKeys.investmentCart.moreInfoDropdown.sector}:`,
      ).should("be.visible")
      cy.findAllByText(
        `${subscriptionKeys.investmentCart.moreInfoDropdown.expectedReturn}:`,
      ).should("be.visible")
      cy.findAllByText(
        `${subscriptionKeys.investmentCart.moreInfoDropdown.expectedExit}:`,
      ).should("be.visible")
      cy.findAllByText(
        `${subscriptionKeys.investmentCart.moreInfoDropdown.assetClass}:`,
      ).should("be.visible")
      // Deal counters
      cy.findByLabelText("Deals selected").contains("2/5")
      // On clicking next button
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      cy.findByRole("heading", {
        name: subscriptionKeys.orderSummary.heading,
        level: 2,
      }).should("be.visible")
    })

    it("Deal counter based on the deal distribution selected - Five deals", () => {
      cy.removeDeal()
      cy.visit("/client/opportunities")
      cy.findAllByText(/Program/i)
        .eq(1)
        .click()
      cy.findByRole("button", { name: "Order Management" })
        .children()
        .eq(1)
        .invoke("text")
        .then((txt) => {
          if (txt.trim() == "Add to Cart") {
            cy.findByRole("button", { name: "Add to Cart" }).click()
            cy.findByRole("button", { name: "Sharia'h" }).click()
          }
        })
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box)
          .click()
          .type(faker.datatype.number({ min: 100000, max: 100000000 }))
      })
      // On selecting "Five deals - 20% concentration of the commitment amount will be allocated to each deal" on the subscription details page
      cy.findByText(/Five deals/i).click()
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      // If there are 5 or more deals provided in the program
      cy.findByLabelText("Deals selected").contains("0/5")
      cy.get('input[type="checkbox"]').each(($elem, index) => {
        if (index < 5) {
          cy.wrap($elem).parent().click()
        }
      })
      cy.findByLabelText("Deals selected").contains("5/5")
    })

    it("Deal counter based on the deal distribution selected - Ten deals", () => {
      cy.removeDeal()
      cy.visit("/client/opportunities")
      cy.findAllByText(/Program/i)
        .eq(1)
        .click()
      cy.addToCartProgram()
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box)
          .click()
          .type(faker.datatype.number({ min: 100000, max: 100000000 }))
      })
      // On selecting "Ten deals - 10% concentration of the commitment amount will be allocated to each deal" on the subscription details page
      cy.findByText(/10 deals/i).click()
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      // If there are 10 or more deals provided in the program
      cy.findByLabelText("Deals selected").scrollIntoView().contains("0/10")
      cy.get('input[type="checkbox"]').each(($elem, index) => {
        if (index < 10) {
          cy.wrap($elem).parent().click()
        }
      })
      let Boxcount
      cy.findByLabelText("Deals selected")
        .invoke("text")
        .then((count) => {
          Boxcount = count.split("/")
          if (Boxcount[1] >= 10) {
            expect(Boxcount[0]).to.eq("10")
          } else {
            expect(Boxcount[0]).to.eq(Boxcount[1].trim())
          }
        })
    })

    it("Deal counter based on the deal distribution selected - Twenty deals", () => {
      cy.removeDeal()
      cy.visit("/client/opportunities")
      cy.findAllByText(/Program/i)
        .eq(1)
        .click()
      cy.addToCartProgram()
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box)
          .click()
          .type(faker.datatype.number({ min: 100000, max: 100000000 }))
      })
      // On selecting "Twenty deals - 5% concentration of the commitment amount will be allocated to each deal" on the subscription details page
      cy.findByText(/20 deals/i).click()
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      // If there are 20 or more deals provided in the program
      cy.get('input[type="checkbox"]').each(($elem, index) => {
        if (index < 20) {
          cy.wrap($elem).parent().click()
        }
      })
      let Boxcount
      cy.findByLabelText("Deals selected")
        .invoke("text")
        .then((count) => {
          Boxcount = count.split("/")
          if (Boxcount[1] >= 20) {
            expect(Boxcount[0]).to.eq("20")
          } else {
            expect(Boxcount[0]).to.eq(Boxcount[1].trim())
          }
        })
    })

    it("Should go to the previous page ", () => {
      // On clicking on "exit"
      cy.removeDeal()
      cy.visit("/client/opportunities")
      cy.findAllByText(/Program/i)
        .eq(1)
        .click()
      cy.findByRole("button", { name: "Order Management" })
        .children()
        .eq(1)
        .invoke("text")
        .then((txt) => {
          if (txt.trim() == "Add to Cart") {
            cy.findByRole("button", { name: "Add to Cart" }).click()
            cy.findByRole("button", { name: "Sharia'h" }).click()
          }
        })
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box)
          .click()
          .type(faker.datatype.number({ min: 100000, max: 100000000 }))
      })
      cy.findByRole("button", {
        name: commonKeys.button.exit,
      }).click()
      cy.findByRole("heading", {
        name: "opportunityTitle",
        level: 2,
      }).should("be.visible")
    })
  })

  context("Order Summary", () => {
    it("Should show the appropriate values and go to confirmation page for a deal and a program (0 deals selected)", () => {
      cy.visit("/client/opportunities")
      cy.findAllByRole("button", {
        name: commonKeys.button.viewDetails,
        timeout: 20000,
      })
        .eq(1)
        .click()
      cy.addToCartDeal()
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.wait(2000)
      cy.findAllByText(/Program/i)
        .eq(1)
        .click()
      cy.addToCartProgram()
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box)
          .click()
          .type(faker.datatype.number({ min: 100000, max: 100000000 }))
      })
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      // On selecting 0 deals from a selected program
      cy.get('input[type="checkbox"]').should("not.be.checked")
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      cy.findByRole("cell", {
        name: "Program Total Amount",
      })
        .invoke("text")
        .then((program) => {
          let splitTextArr = program.split("$")
          var cuma = splitTextArr[1].split(",")
          var amount = ""
          cuma.forEach((program) => {
            amount += program
          })
          expect(Number(amount)).to.eql(0)
        })
      // Program Immediate investment
      cy.findAllByLabelText("Program Total Amount").should("be.visible")
      // Deal Immediate investment
      cy.findAllByLabelText("Total Deal Amount").should("be.visible")
      // Total Immediate investment
      cy.findAllByLabelText("Total Immediate Amount").should("be.visible")
      // click on the check box "I confirm that I am an authorized signatory of this account""
      cy.findByLabelText("authSignatory").parent().click()
      // click on the check box "I agree with the terms and conditions"
      cy.findByLabelText("agreeTerms").parent().click()
      // Click on "confirm" button
      cy.findByRole("button", {
        name: commonKeys.client.orderManagementCTAs.confirmButtonText,
      }).click()
      cy.findByText(subscriptionKeys.confirmation.heading).should("be.visible")
      cy.findByText(subscriptionKeys.confirmation.successMsg).should(
        "be.visible",
      )
    })

    it("Should show the appropriate values and error messages where required for a deal and a program (0 deals selected)", () => {
      cy.visit("/client/opportunities")
      cy.findAllByRole("button", {
        name: commonKeys.button.viewDetails,
        timeout: 20000,
      })
        .eq(1)
        .click()
      cy.addToCartDeal()
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.wait(2000)
      cy.findAllByText(/Program/i)
        .eq(1)
        .click()
      cy.addToCartProgram()
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box)
          .click()
          .type(faker.datatype.number({ min: 100000, max: 100000000 }))
      })
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      // On selecting 0 deals from a selected program
      cy.get('input[type="checkbox"]').should("not.be.checked")
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      cy.findByRole("cell", {
        name: "Program Total Amount",
      })
        .invoke("text")
        .then((program) => {
          let splitTextArr = program.split("$")
          var cuma = splitTextArr[1].split(",")
          var amount = ""
          cuma.forEach((program) => {
            amount += program
          })
          expect(Number(amount)).to.eql(0)
        })
      // Program Immediate investment
      cy.findAllByLabelText("Program Total Amount").should("be.visible")
      // Deal Immediate investment
      cy.findAllByLabelText("Total Deal Amount").should("be.visible")
      // Total Immediate investment
      cy.findAllByLabelText("Total Immediate Amount").should("be.visible")
      // on unchecking the checkbox "I confirm that I am an authorized signatory of this account"" and click on "confirm "button
      cy.findByLabelText("authSignatory").should("not.be.checked")
      // on unchecking the checkbox "I agree with the terms and conditions" and click on "confirm "button
      cy.findByLabelText("agreeTerms").should("not.be.checked")
      // Click on "confirm" button
      cy.findByRole("button", {
        name: commonKeys.client.orderManagementCTAs.confirmButtonText,
      }).click()
      cy.findByText(commonKeys.client.authSignatory.error).should("be.visible")
      cy.findByText(commonKeys.client.agreeTerms.error).should("be.visible")
    })

    it("Should show the appropriate values and go to confirmation page for a deal ", () => {
      cy.removeDeal()
      cy.visit("/client/opportunities")
      cy.findAllByRole("button", {
        name: commonKeys.button.viewDetails,
        timeout: 20000,
      })
        .eq(1)
        .click()
      cy.addToCartDeal()
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box)
          .click()
          .type(faker.datatype.number({ min: 100000, max: 100000000 }))
      })
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      // Deal name and amount invested
      cy.findAllByLabelText("Deal Name").should("not.be.empty")
      // Deal Immediate investment
      cy.findAllByLabelText("Deal Amount").should("not.be.empty")
      // Total Immediate investment
      cy.findAllByLabelText("Total Immediate Amount").should("not.be.empty")
      // click on the check box "I confirm that I am an authorized signatory of this account"
      cy.findByLabelText("authSignatory").parent().click()
      // click on the check box "I agree with the terms and conditions"
      cy.findByLabelText("agreeTerms").parent().click()
      // Click on "confirm" button
      cy.findByRole("button", {
        name: commonKeys.client.orderManagementCTAs.confirmButtonText,
      }).click()
      cy.findByText(subscriptionKeys.confirmation.heading).should("be.visible")
      cy.findByText(subscriptionKeys.confirmation.successMsg).should(
        "be.visible",
      )
    })

    it("Should show the appropriate values and error messages where required for a deal ", () => {
      cy.visit("/client/opportunities")
      cy.findAllByRole("button", {
        name: commonKeys.button.viewDetails,
        timeout: 20000,
      })
        .eq(1)
        .click()
      cy.addToCartDeal()
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box)
          .click()
          .type(faker.datatype.number({ min: 100000, max: 100000000 }))
      })
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      // Deal name and amount invested
      cy.findAllByLabelText("Deal Name").should("be.visible")
      cy.findAllByLabelText("Deal Amount").should("not.be.empty")
      // Deal Immediate investment
      cy.findAllByLabelText("Total Deal Amount").should("not.be.empty")
      // Total Immediate investment
      cy.findAllByLabelText("Total Immediate Amount").should("not.be.empty")
      // on unchecking the checkbox "I confirm that I am an authorized signatory of this account" and click on "confirm "button
      cy.findByLabelText("authSignatory").should("not.be.checked")
      // on unchecking the checkbox "I agree with the terms and conditions" and click on "confirm "button
      cy.findByLabelText("agreeTerms").should("not.be.checked")
      // Click on "confirm" button
      cy.findByRole("button", {
        name: commonKeys.client.orderManagementCTAs.confirmButtonText,
      }).click()
      cy.findByText(commonKeys.client.authSignatory.error).should("be.visible")
      cy.findByText(commonKeys.client.agreeTerms.error).should("be.visible")
    })

    it("Should show the appropriate values and go to confirmation page for a program (0 deals selected)", () => {
      cy.removeDeal()
      cy.visit("/client/opportunities")
      cy.findAllByText(/Program/i)
        .eq(1)
        .click()
      cy.addToCartProgram()
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box)
          .click()
          .type(faker.datatype.number({ min: 100000, max: 100000000 }))
      })
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      // On selecting 0 deals from a selected program
      cy.get('input[type="checkbox"]').should("not.be.checked")
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      cy.findByRole("cell", {
        name: "Program Total Amount",
      })
        .invoke("text")
        .then((program) => {
          let splitTextArr = program.split("$")
          var cuma = splitTextArr[1].split(",")
          var amount = ""
          cuma.forEach((program) => {
            amount += program
          })
          expect(Number(amount)).to.eql(0)
        })
      // Program Immediate investment
      cy.findAllByLabelText("Program Total Amount").should("be.visible")
      // Total Immediate investment
      cy.findAllByLabelText("Total Immediate Amount").should("be.visible")
      // click on the check box "I confirm that I am an authorized signatory of this account"
      cy.findByLabelText("authSignatory").parent().click()
      // click on the check box "I agree with the terms and conditions"
      cy.findByLabelText("agreeTerms").parent().click()
      // Click on "confirm" button
      cy.findByRole("button", {
        name: commonKeys.client.orderManagementCTAs.confirmButtonText,
      }).click()
      cy.findByText(subscriptionKeys.confirmation.heading).should("be.visible")
      cy.findByText(subscriptionKeys.confirmation.successMsg).should(
        "be.visible",
      )
    })

    it("Should show the appropriate values and error messages where required for a program (0 deals selected)", () => {
      cy.visit("/client/opportunities")
      cy.findAllByText(/Program/i)
        .eq(1)
        .click()
      cy.addToCartProgram()
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box)
          .click()
          .type(faker.datatype.number({ min: 100000, max: 100000000 }))
      })
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      // On selecting 0 deals from a selected program
      cy.get('input[type="checkbox"]').should("not.be.checked")
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      cy.findByRole("cell", {
        name: "Program Total Amount",
      })
        .invoke("text")
        .then((program) => {
          let splitTextArr = program.split("$")
          var cuma = splitTextArr[1].split(",")
          var amount = ""
          cuma.forEach((program) => {
            amount += program
          })
          expect(Number(amount)).to.eql(0)
        })
      // Program Immediate investment
      cy.findAllByLabelText("Program Total Amount").should("be.visible")
      // Total Immediate investment
      cy.findAllByLabelText("Total Immediate Amount").should("be.visible")
      // on unchecking the checkbox "I confirm that I am an authorized signatory of this account" and click on "confirm "button
      cy.findByLabelText("authSignatory").should("not.be.checked")
      // on unchecking the checkbox "I agree with the terms and conditions" and click on "confirm "button
      cy.findByLabelText("agreeTerms").should("not.be.checked")
      // Click on "confirm" button
      cy.findByRole("button", {
        name: commonKeys.client.orderManagementCTAs.confirmButtonText,
      }).click()
      cy.findByText(commonKeys.client.authSignatory.error).should("be.visible")
      cy.findByText(commonKeys.client.agreeTerms.error).should("be.visible")
    })

    it("Should show the appropriate values and go to confirmation page for a deal and a program ", () => {
      cy.removeDeal()
      cy.visit("/client/opportunities")
      cy.findAllByRole("button", {
        name: commonKeys.button.viewDetails,
        timeout: 20000,
      })
        .eq(1)
        .click()
      cy.addToCartDeal()
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.wait(2000)
      cy.findAllByText(/Program/i)
        .eq(1)
        .click()
      cy.addToCartProgram()
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box)
          .click()
          .type(faker.datatype.number({ min: 100000, max: 100000000 }))
      })
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      // On selecting any no. of deals from a selected program
      cy.get('input[type="checkbox"]').each(($elem, index) => {
        if (index < 4) {
          cy.wrap($elem).parent().click()
        }
      })
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      // Program Immediate investment
      cy.findAllByLabelText("Program Total Amount").should("be.visible")
      // Deal Immediate investment
      cy.findAllByLabelText("Total Deal Amount").should("be.visible")
      // Total Immediate investment
      cy.findAllByLabelText("Total Immediate Amount").should("be.visible")
      // click on the check box "I confirm that I am an authorized signatory of this account"
      cy.findByLabelText("authSignatory").parent().click()
      // click on the check box "I agree with the terms and conditions"
      cy.findByLabelText("agreeTerms").parent().click()
      // Click on "confirm" button
      cy.findByRole("button", {
        name: commonKeys.client.orderManagementCTAs.confirmButtonText,
      }).click()
      cy.findByText(subscriptionKeys.confirmation.heading).should("be.visible")
      cy.findByText(subscriptionKeys.confirmation.successMsg).should(
        "be.visible",
      )
    })

    it("Should show the appropriate values and error messages where required for a deal and a program", () => {
      cy.visit("/client/opportunities")
      cy.findAllByRole("button", {
        name: commonKeys.button.viewDetails,
        timeout: 20000,
      })
        .eq(1)
        .click()
      cy.addToCartDeal()
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.wait(2000)
      cy.findAllByText(/Program/i)
        .eq(1)
        .click()
      cy.addToCartProgram()
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box)
          .click()
          .type(faker.datatype.number({ min: 100000, max: 100000000 }))
      })
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      // On selecting any no. of deals from a selected program
      cy.get('input[type="checkbox"]').each(($elem, index) => {
        if (index < 4) {
          cy.wrap($elem).parent().click()
        }
      })
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      // Program Immediate investment
      cy.findAllByLabelText("Program Total Amount").should("be.visible")
      // Deal Immediate investment
      cy.findAllByLabelText("Total Deal Amount").should("be.visible")
      // Total Immediate investment
      cy.findAllByLabelText("Total Immediate Amount").should("be.visible")
      // on unchecking the checkbox "I confirm that I am an authorized signatory of this account"" and click on "confirm "button
      cy.findByLabelText("authSignatory").should("not.be.checked")
      // on unchecking the checkbox "I agree with the terms and conditions" and click on "confirm "button
      cy.findByLabelText("agreeTerms").should("not.be.checked")
      // Click on "confirm" button
      cy.findByRole("button", {
        name: commonKeys.client.orderManagementCTAs.confirmButtonText,
      }).click()
      cy.findByText(commonKeys.client.authSignatory.error).should("be.visible")
      cy.findByText(commonKeys.client.agreeTerms.error).should("be.visible")
    })

    it("Should show the appropriate values and go to confirmation page for a program ", () => {
      cy.removeDeal()
      cy.visit("/client/opportunities")
      cy.findAllByText(/Program/i)
        .eq(1)
        .click()
      cy.addToCartProgram()
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box)
          .click()
          .type(faker.datatype.number({ min: 100000, max: 100000000 }))
      })
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      // On selecting any no. of deals from a selected program
      cy.get('input[type="checkbox"]').each(($elem, index) => {
        if (index < 6) {
          cy.wrap($elem).parent().click()
        }
      })
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      // Program Immediate investment
      cy.findAllByLabelText("Program Total Amount").should("be.visible")
      // Total Immediate investment
      cy.findAllByLabelText("Total Immediate Amount").should("be.visible")
      // click on the check box "I confirm that I am an authorized signatory of this account"
      cy.findByLabelText("authSignatory").parent().click()
      // click on the check box "I agree with the terms and conditions"
      cy.findByLabelText("agreeTerms").parent().click()
      // Click on "confirm" button
      cy.findByRole("button", {
        name: commonKeys.client.orderManagementCTAs.confirmButtonText,
      }).click()
      cy.findByText(subscriptionKeys.confirmation.heading).should("be.visible")
      cy.findByText(subscriptionKeys.confirmation.successMsg).should(
        "be.visible",
      )
    })

    it("Should show the appropriate values and error messages where required for a program", () => {
      cy.visit("/client/opportunities")
      cy.findAllByRole("button", {
        name: commonKeys.button.viewDetails,
        timeout: 20000,
      })
        .eq(1)
        .click()
      cy.addToCartDeal()
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.wait(2000)
      cy.findAllByText(/Program/i)
        .eq(1)
        .click()
      cy.addToCartProgram()
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box)
          .click()
          .type(faker.datatype.number({ min: 100000, max: 100000000 }))
      })
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      // On selecting any no. of deals from a selected program
      cy.get('input[type="checkbox"]').each(($elem, index) => {
        if (index < 3) {
          cy.wrap($elem).parent().click()
        }
      })
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      // Program Immediate investment
      cy.findAllByLabelText("Program Amount").should("not.be.empty")
      // Total Immediate investment
      cy.findAllByLabelText("Total Immediate Amount").should("not.be.empty")
      // on unchecking box "I confirm that I am an authorized signatory of this account"
      cy.findByLabelText("authSignatory").should("not.be.checked")
      // click on the check box "I agree with the terms and conditions"
      cy.findByLabelText("agreeTerms").parent().click()
      // Click on "confirm" button
      cy.findByRole("button", {
        name: commonKeys.client.orderManagementCTAs.confirmButtonText,
      }).click()
      cy.findByText(commonKeys.client.authSignatory.error).should("be.visible")
    })

    it("Should show the appropriate values and error messages where required for a program", () => {
      cy.removeDeal()
      cy.visit("/client/opportunities")
      cy.findAllByRole("button", {
        name: commonKeys.button.viewDetails,
        timeout: 20000,
      })
        .eq(1)
        .click()
      cy.addToCartDeal()
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.wait(2000)
      cy.findAllByText(/Program/i)
        .eq(1)
        .click()
      cy.addToCartProgram()
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box)
          .click()
          .type(faker.datatype.number({ min: 100000, max: 100000000 }))
      })
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      // On selecting any no. of deals deals from a selected program
      cy.get('input[type="checkbox"]').each(($elem, index) => {
        if (index < 3) {
          cy.wrap($elem).parent().click()
        }
      })
      cy.findByRole("button", { name: commonKeys.button.next }).click()
      // Program Immediate investment
      cy.findAllByLabelText("Program Amount").should("not.be.empty")
      // Total Immediate investment
      cy.findAllByLabelText("Total Immediate Amount").should("not.be.empty")
      // click on the check box "I confirm that I am an authorized signatory of this account"
      cy.findByLabelText("authSignatory").parent().click()
      // on unchecking the checkbox "I agree with the terms and conditions" and click on "confirm "button
      cy.findByLabelText("agreeTerms").should("not.be.checked")
      // Click on "confirm" button
      cy.findByRole("button", {
        name: commonKeys.client.orderManagementCTAs.confirmButtonText,
      }).click()
      cy.findByText(commonKeys.client.agreeTerms.error).should("be.visible")
    })

    it("should check the calculations for the subscription investment amount for whole rounded value", () => {
      // Add a program and a deal in the investment cart
      cy.visit("/client/opportunities")
      cy.findAllByRole("button", {
        name: commonKeys.button.viewDetails,
        timeout: 20000,
      })
        .eq(1)
        .click()
      cy.addToCartDeal()
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.wait(2000)
      cy.findAllByText(/Program/i)
        .eq(1)
        .click()
      cy.addToCartProgram()
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      // Click on commonKeys.button.next button
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      // Enter a whole number/rounded value e.g. $ 1,000,000
      cy.textbox()
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box).click().clear().type("5000000")
      })
      // Select the deal concentration as 5 Deals 20% concentration
      cy.findByText(/Five deals/i).click()
      // click on commonKeys.button.next button
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      // Select any allowed no. of deals provided in the program
      cy.get('input[type="checkbox"]').each(($elem, index) => {
        if (index < 5) {
          cy.wrap($elem).parent().click()
        }
      })
      // Click on commonKeys.button.next button
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      // Check the calculations
      cy.orderSummaryCalculationCheck()
      // Click on the check boxes
      cy.findByLabelText("authSignatory").parent().click()
      cy.findByLabelText("agreeTerms").parent().click()
      // Click on "confirm" button
      cy.findByRole("button", {
        name: commonKeys.client.orderManagementCTAs.confirmButtonText,
      }).click()
      // Check the calculations
      cy.confirmCalculationCheck(5000000)
    })

    it("should check the calculations for the subscription investment amount for random value", () => {
      // Add a program and a deal in the investment cart
      cy.visit("/client/opportunities")
      cy.findAllByRole("button", {
        name: commonKeys.button.viewDetails,
        timeout: 20000,
      })
        .eq(1)
        .click()
      cy.addToCartDeal()
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.wait(2000)
      cy.findAllByRole("button", {
        name: commonKeys.button.viewDetails,
        timeout: 20000,
      })
        .eq(0)
        .click()
      cy.addToCartDeal()
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.wait(2000)
      cy.findAllByText(/Program/i)
        .eq(1)
        .click()
      cy.addToCartProgram()
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.wait(2000)
      // Click on commonKeys.button.next button
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      cy.textbox()
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box).click().clear().type("718280")
      })
      // Select the deal concentration as 5 Deals 20% concentration
      cy.findAllByText(/10 deals/i).click({ multiple: true })
      // click on commonKeys.button.next button
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      // Select any allowed no. of deals provided in the program
      cy.get('input[type="checkbox"]').each(($elem, index) => {
        if (index < 6) {
          cy.wrap($elem).parent().click()
        }
      })
      // Click on commonKeys.button.next button
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      // // Check the calculations
      cy.orderSummaryCalculationCheck()
      // Click on the check boxes
      cy.findByLabelText("authSignatory").parent().click()
      cy.findByLabelText("agreeTerms").parent().click()
      // Click on "confirm" button
      cy.findByRole("button", {
        name: commonKeys.client.orderManagementCTAs.confirmButtonText,
      }).click()
      // Check the calculations
      cy.confirmCalculationCheck(718280)
    })
  })

  context("Confirmation", () => {
    it("Should go back to opportunities", () => {
      cy.visit("/client/opportunities")
      cy.findAllByRole("button", {
        name: commonKeys.button.viewDetails,
        timeout: 20000,
      })
        .eq(1)
        .click()
      cy.addToCartDeal()
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.wait(2000)
      cy.findAllByText(/Program/i)
        .eq(1)
        .click()
      cy.addToCartProgram()
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.findByRole("button", {
        name: commonKeys.button.next,
        timeout: 20000,
      }).click()
      cy.textbox()
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box).click().clear().type("4563210")
      })
      cy.findByText(/Five deals/i).click()
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      cy.get('input[type="checkbox"]').each(($elem, index) => {
        if (index < 5) {
          cy.wrap($elem).parent().click()
        }
      })
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      cy.orderSummaryCalculationCheck()
      cy.findByLabelText("authSignatory").parent().click()
      cy.findByLabelText("agreeTerms").parent().click()
      // On clicking "confirm" button in order summary page
      cy.findByRole("button", {
        name: commonKeys.client.orderManagementCTAs.confirmButtonText,
      }).click()
      cy.confirmCalculationCheck(4563210)
      // On clicking "go back to opportunities" button
      cy.findByRole("button", {
        name: subscriptionKeys.confirmation.opportunitiesCTA,
      }).click()
      cy.location("pathname", { timeout: 15000 }).should(
        "match",
        /opportunities/,
      )
      cy.findByText(opportunitiesKeys.index.page.title).should("be.visible")
    })

    it("Screen validations", () => {
      cy.visit("/client/opportunities")
      cy.findAllByRole("button", {
        name: commonKeys.button.viewDetails,
        timeout: 20000,
      })
        .eq(1)
        .click()
      cy.addToCartDeal()
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.wait(2000)
      cy.findAllByText(/Program/i)
        .eq(1)
        .click()
      cy.addToCartProgram()
      cy.findByRole("button", {
        name: commonKeys.client.investmentCart.title,
      }).click()
      cy.findByRole("button", {
        name: commonKeys.button.next,
        timeout: 20000,
      }).click()
      cy.textbox()
      cy.findAllByRole("textbox").each((box) => {
        cy.wrap(box).click().clear().type("958745")
      })
      cy.findByText(/Five deals/i).click()
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      cy.get('input[type="checkbox"]').each(($elem, index) => {
        if (index < 5) {
          cy.wrap($elem).parent().click()
        }
      })
      cy.findByRole("button", {
        name: commonKeys.button.next,
      }).click()
      cy.orderSummaryCalculationCheck()
      cy.findByLabelText("authSignatory").parent().click()
      cy.findByLabelText("agreeTerms").parent().click()
      cy.findByRole("button", {
        name: commonKeys.client.orderManagementCTAs.confirmButtonText,
      }).click()
      cy.confirmCalculationCheck(958745)
      // List of deals subscribed in the programs
      cy.findAllByLabelText("Program Deal Name").should("be.visible")
      // List of deals invested in
      cy.findAllByLabelText("Deal Name").should("be.visible")
      // Total Immediate Amount
      cy.findByText(/Total Immediate Investment/i).should("be.visible")
      // Total Investment Amount
      cy.findByText(/Total Investment Amount/i).should("be.visible")
      // Note of confirmation
      cy.findByRole("definition", {
        name: "Note of confirmation",
      }).should("be.visible")
      // Disclaimer
      cy.findByRole("heading", {
        name: "Disclaimer",
      }).should("be.visible")
      cy.findAllByLabelText("Disclaimer").should("be.visible")
    })
  })
})
