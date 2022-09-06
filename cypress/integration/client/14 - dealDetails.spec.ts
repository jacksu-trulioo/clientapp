describe("Deal Details", () => {
  let opportunitiesKeys
  let scheduleMeetingKeys
  let commonKeys
  let clientDashboardKeys

  before(() => {
    cy.fixture("../../public/locales/en/opportunities").then((keys) => {
      opportunitiesKeys = keys
    })
    cy.fixture("../../public/locales/en/scheduleMeeting").then((keys) => {
      scheduleMeetingKeys = keys
    })
    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })
    cy.fixture("../../public/locales/en/clientDashboard").then((keys) => {
      clientDashboardKeys = keys
    })

    cy.loginClient()
  })

  it("Should open the deal sheet", () => {
    // Go to dashboard -> opportunities section
    cy.visit("/client")
    cy.findAllByText(clientDashboardKeys.opportunities.title, {
      timeout: 5000,
    })
      .scrollIntoView()
      .should("be.visible")
    // Click on view details button of a deal card OR Go to opportunities and click on "view details" button of any deal
    cy.findAllByRole("button", {
      name: commonKeys.button.viewDetails,
    })
      .eq(1)
      .click()
    cy.findByText(opportunitiesKeys.index.text.breakdown).should("be.visible")
    cy.findAllByText(opportunitiesKeys.index.card.labels.sponsor).should(
      "be.visible",
    )
    cy.findAllByText(opportunitiesKeys.index.card.labels.assetClass).should(
      "be.visible",
    )
    cy.findAllByText(opportunitiesKeys.index.card.labels.sector).should(
      "be.visible",
    )
    cy.findByText(opportunitiesKeys.index.card.labels.expectedExit).should(
      "be.visible",
    )
    cy.findByText(opportunitiesKeys.index.card.labels.expectedReturn).should(
      "be.visible",
    )
    cy.findByText(opportunitiesKeys.index.card.labels.country).should(
      "be.visible",
    )
    // Go to All deals under opportunities and click on "view details" button of any deal
    cy.findAllByRole("button", {
      name: new RegExp(commonKeys.nav.links.opportunities, "i"),
    })
      .eq(0)
      .click()
    cy.findByRole("link", {
      name: commonKeys.nav.links.allDeals,
    }).click()
    cy.location("pathname").should("match", /opportunities/)
    cy.findByRole("heading", {
      name: opportunitiesKeys.client.title,
      level: 2,
    }).should("be.visible")
    cy.findAllByRole("button", {
      name: commonKeys.button.viewDetails,
    })
      .eq(1)
      .click()
    cy.findByText(opportunitiesKeys.index.text.breakdown).should("be.visible")
    cy.findAllByText(opportunitiesKeys.index.card.labels.sponsor).should(
      "be.visible",
    )
    cy.findAllByText(opportunitiesKeys.index.card.labels.assetClass).should(
      "be.visible",
    )
    cy.findAllByText(opportunitiesKeys.index.card.labels.sector).should(
      "be.visible",
    )
    cy.findByText(opportunitiesKeys.index.card.labels.expectedExit).should(
      "be.visible",
    )
    cy.findByText(opportunitiesKeys.index.card.labels.expectedReturn).should(
      "be.visible",
    )
    cy.findByText(opportunitiesKeys.index.card.labels.country).should(
      "be.visible",
    )
    // Go to Interested deals under opportunities and click on "view details" button of any deal
    cy.findAllByRole("button", {
      name: new RegExp(commonKeys.nav.links.opportunities, "i"),
    })
      .eq(0)
      .click()
    cy.findByRole("link", {
      name: commonKeys.nav.links.interestedDeals,
    }).click()
    cy.location("pathname").should("match", /opportunities/)
    cy.findByRole("heading", {
      name: opportunitiesKeys.client.title,
      level: 2,
    }).should("be.visible")
    cy.findAllByRole("button", {
      name: commonKeys.button.viewDetails,
    })
      .eq(1)
      .click()
    cy.findByText(opportunitiesKeys.index.text.breakdown).should("be.visible")
    cy.findAllByText(opportunitiesKeys.index.card.labels.sponsor).should(
      "be.visible",
    )
    cy.findAllByText(opportunitiesKeys.index.card.labels.assetClass).should(
      "be.visible",
    )
    cy.findAllByText(opportunitiesKeys.index.card.labels.sector).should(
      "be.visible",
    )
    cy.findByText(opportunitiesKeys.index.card.labels.expectedExit).should(
      "be.visible",
    )
    cy.findByText(opportunitiesKeys.index.card.labels.expectedReturn).should(
      "be.visible",
    )
    cy.findByText(opportunitiesKeys.index.card.labels.country).should(
      "be.visible",
    )
  })

  it("deal sheet screen validtions", () => {
    // Go to opportunities
    cy.visit("/client/opportunities/")
    // Click on "view details" button
    cy.findAllByText(commonKeys.button.seeMore).eq(0).click()
    cy.wait(2000)
    cy.findAllByRole("button", {
      name: commonKeys.button.viewDetails,
    })
      .eq(5)
      .click()
    // Check "view details" Data Details
    // Media
    cy.findByRole("img", {
      name: "Hero Image",
    }).should("not.be.null")
    cy.findByRole("img", {
      name: "Play Icon",
    }).click()
    cy.get("video")
      .should("have.prop", "paused", true)
      .and("have.prop", "ended", false)
      .then(($video) => {
        $video[0].play()
      })
    cy.get("video")
      .should("have.prop", "paused", false)
      .and("have.prop", "ended", false)
    cy.wait(3000)
    cy.get("video").then(($video) => {
      $video[0].pause()
    })
    cy.get("video").should(($video) => {
      expect($video[0].duration).to.be.gt(0)
    })
    cy.findAllByRole("button", {
      name: commonKeys.button.close,
    }).click()
    // Deal name
    cy.findByRole("heading", {
      name: "opportunityTitle",
    }).should("not.be.null")
    // Deal description
    cy.findByRole("paragraph", {
      name: "opportunityDescription",
    }).should("not.be.null")
    // Interested/not interested button
    cy.findByRole("button", {
      name: "Interested",
    }).then((button) => {
      if (button.find('[aria-label="Interested"]').length > 0) {
        cy.findByRole("button", {
          name: "Interested",
        }).click()
        cy.findByRole("button", {
          name: opportunitiesKeys.client.modal.interested.buttons.ok,
        }).click()
      } else {
        cy.findByRole("button", {
          name: "Interested",
        }).click()
        cy.findByRole("button", {
          name: opportunitiesKeys.client.modal.notInterested.buttons.later,
        }).click()
      }
    })
    // Add to cart button
    cy.findByRole("button", {
      name: "Order Management",
    })
      .children()
      .eq(1)
      .invoke("text")
      .then((txt) => {
        if (txt.trim() == "Add to Cart") {
          cy.findByRole("button", {
            name: "Add to Cart",
          }).click()
        }
      })
    cy.findByRole("button", {
      name: "Added to Cart",
    }).should("be.visible")
    // Breakdowns
    // 1. Sponsor
    // 2. Asset class
    // 3. Sector
    // 4. Expected return
    // 5. Expected exit
    // 6. Country
    cy.findByText(opportunitiesKeys.index.text.breakdown).should("be.visible")
    cy.findAllByText(opportunitiesKeys.index.card.labels.sponsor).should(
      "be.visible",
    )
    cy.findAllByText(opportunitiesKeys.index.card.labels.assetClass).should(
      "be.visible",
    )
    cy.findAllByText(opportunitiesKeys.index.card.labels.sector).should(
      "be.visible",
    )
    cy.findByText(opportunitiesKeys.index.card.labels.expectedExit).should(
      "be.visible",
    )
    cy.findByText(opportunitiesKeys.index.card.labels.expectedReturn).should(
      "be.visible",
    )
    cy.findByText(opportunitiesKeys.index.card.labels.country).should(
      "be.visible",
    )
    // Download button
    cy.findByRole("button", {
      name: opportunitiesKeys.client.button.download,
    }).click()
    cy.wait(5000)
    // Print button
    cy.findByRole("button", {
      name: opportunitiesKeys.client.button.print,
    }).click()
    // Other Info
    cy.get('div[arial-label="Other Info"]').children().should("not.be.null")
    // special message after the other info section
    cy.findByRole("paragraph", {
      name: "Message",
    }).should("not.be.null")
    // See other opportunities
    cy.findByRole("grid", {
      name: "Opportunities Card",
    })
      .children()
      .should("be.visible")
  })

  it("Should open the media", () => {
    // Go to opportunities or all deals or interested deals page
    cy.visit("/client")
    cy.findByRole("button", {
      name: /Opportunities/i,
    }).click()
    cy.findByRole("link", {
      name: commonKeys.nav.links.allDeals,
    }).click()
    cy.location("pathname").should("match", /opportunities/)
    cy.findAllByText(commonKeys.button.seeMore).eq(0).click()
    cy.findByRole("heading", {
      name: opportunitiesKeys.client.title,
      level: 2,
    }).should("be.visible")
    // Click on "view details" button
    cy.findAllByRole("button", {
      name: commonKeys.button.viewDetails,
    })
      .eq(3)
      .click()
    // Click on the media shown on the top of the deal sheet page
    cy.findByRole("img", {
      name: "Hero Image",
    }).should("not.be.null")
    cy.findByRole("img", {
      name: "Play Icon",
    }).click()
    cy.get("video")
      .should("have.prop", "paused", true)
      .and("have.prop", "ended", false)
      .then(($video) => {
        $video[0].play()
      })
    cy.get("video")
      .should("have.prop", "paused", false)
      .and("have.prop", "ended", false)
    cy.wait(3000)
    cy.get("video").then(($video) => {
      $video[0].pause()
    })
    cy.get("video").should(($video) => {
      expect($video[0].duration).to.be.gt(0)
    })
    cy.findAllByRole("button", {
      name: commonKeys.button.close,
    }).click()
  })

  it("Should redirect to schedule call on marking deal as interested", () => {
    // Go to opportunities or all deals or interested deals page
    cy.visit("/client")
    cy.findByRole("button", {
      name: /Opportunities/i,
    }).click()
    cy.findByRole("link", {
      name: commonKeys.nav.links.allDeals,
    }).click()
    cy.location("pathname").should("match", /opportunities/)
    cy.findAllByText(commonKeys.button.seeMore).eq(0).click()
    cy.findByRole("heading", {
      name: opportunitiesKeys.client.title,
      level: 2,
    }).should("be.visible")
    // Click on "view details" button
    cy.findAllByRole("button", {
      name: commonKeys.button.viewDetails,
    })
      .eq(3)
      .click()
    // Click on "interested" button
    cy.findByRole("button", {
      name: "Interested",
    }).then((button) => {
      if (button.find('[aria-label="Interested"]').length > 0) {
        cy.findByRole("button", {
          name: "Interested",
        }).click()
        cy.findByRole("button", {
          name: opportunitiesKeys.client.modal.interested.buttons.ok,
        }).click()
      }
      // On clicking "later"
      else {
        cy.findByRole("button", {
          name: "Interested",
        }).click()
        cy.findByRole("button", {
          name: opportunitiesKeys.client.modal.notInterested.buttons.later,
        }).click()
      }
    })
    // On clicking "schedule now"
    cy.findByRole("button", {
      name: "Interested",
    }).then((button) => {
      if (button.find('[aria-label="Not Interested"]').length > 0) {
        cy.findByRole("button", {
          name: "Interested",
        }).click()
        cy.findByRole("button", {
          name: "Schedule Now",
        }).click()
        cy.findByText(scheduleMeetingKeys.rmAssigned.header.subtitle).should(
          "be.visible",
        )
      } else {
        cy.findByRole("button", {
          name: "Interested",
        }).click()
        cy.findByRole("button", {
          name: opportunitiesKeys.client.modal.interested.buttons.ok,
        }).click()
      }
    })
  })

  it("should go back to the previous page or the opportunities landing page", () => {
    // Go to opportunities or all deals or interested deals page
    cy.visit("/client")
    cy.findAllByRole("button", {
      name: new RegExp(commonKeys.nav.links.opportunities, "i"),
    })
      .eq(0)
      .click()
    cy.findByRole("link", {
      name: commonKeys.nav.links.allDeals,
    }).click()
    cy.location("pathname").should("match", /opportunities/)
    cy.findAllByText(commonKeys.button.seeMore).eq(0).click()
    cy.findByRole("heading", {
      name: opportunitiesKeys.client.title,
      level: 2,
    }).should("be.visible")
    // Click on "view details" button in the card
    cy.findAllByRole("button", {
      name: commonKeys.button.viewDetails,
    })
      .eq(1)
      .click()
    cy.wait(2000)
    // click on "back" present in the breadcrumb
    cy.findByRole("button", {
      name: "Back",
    }).click()
    cy.findByRole("heading", {
      name: opportunitiesKeys.client.title,
      level: 2,
    }).should("be.visible")
  })
})
