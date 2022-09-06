const { _ } = Cypress

describe("All Deals", () => {
  let opportunitiesKeys
  let commonKeys
  let clientDashboardKeys

  before(() => {
    cy.fixture("../../public/locales/en/opportunities").then((keys) => {
      opportunitiesKeys = keys
    })
    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })
    cy.fixture("../../public/locales/en/clientDashboard").then((keys) => {
      clientDashboardKeys = keys
    })

    cy.loginClient()
  })

  it("Should open opportunities landing page with deal cards", () => {
    // Go to dashboard and click on "see more" link next to the opportunities header section
    cy.visit("/client")
    cy.findAllByText(clientDashboardKeys.opportunities.title, {
      timeout: 5000,
    })
      .scrollIntoView()
      .should("be.visible")
    cy.findByText(clientDashboardKeys.opportunities.button.seeMore).click()
    cy.findByRole("heading", {
      name: opportunitiesKeys.client.title,
      level: 2,
    }).should("be.visible")
    cy.findByRole("button", {
      name: commonKeys.button.back,
    }).click()
    cy.location("pathname", { timeout: 10000 }).should("match", /client/)
    cy.findByText(/client id #\d+/i).should("be.visible")
    // Click on opportunities in the side bar
    cy.findByRole("button", {
      name: /Opportunities/i,
    }).click()
    cy.location("pathname", { timeout: 10000 }).should("match", /opportunities/)
    cy.findByRole("heading", {
      name: opportunitiesKeys.client.title,
      level: 2,
    }).should("be.visible")
  })

  it("Should open an Opportunities deal sheet", () => {
    // Click on Opportunities in the sidenav
    cy.visit("/client")
    cy.findByRole("button", {
      name: /Opportunities/i,
    }).click()
    cy.findByRole("link", {
      name: commonKeys.nav.links.allDeals,
    }).click()
    cy.location("pathname").should("match", /opportunities/)
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

  it("Should filter out deals as per selected options - Sort by and Asset class", () => {
    // Go to opportunities landing page
    cy.intercept({
      method: "POST",
      url: "/api/client/deals/opportunities?langCode=en",
    }).as("deals")
    cy.visit("/client")
    cy.findByRole("button", {
      name: /Opportunities/i,
    }).click()
    cy.findByRole("link", {
      name: commonKeys.nav.links.allDeals,
    }).click()
    cy.location("pathname").should("match", /opportunities/)
    cy.findAllByText(commonKeys.button.seeMore).eq(0).click()
    // Click on "Sort & Filter" button
    cy.findAllByText(commonKeys.client.sortByFilter).click()
    cy.findByText(commonKeys.filters.title).should("be.visible")
    cy.findByRole("group", {
      name: commonKeys.filters.filterTypes.order.title,
    }).should("be.visible")
    cy.findByRole("group", {
      name: commonKeys.filters.filterTypes.sort.title,
    }).should("be.visible")
    cy.findByRole("group", {
      name: commonKeys.filters.filterTypes.assetClass.title,
    }).should("be.visible")
    cy.findByRole("group", {
      name: commonKeys.filters.filterTypes.shariah.title,
    }).should("be.visible")
    cy.findByRole("group", {
      name: commonKeys.filters.filterTypes.sector.title,
    }).should("be.visible")
    cy.findByRole("group", {
      name: commonKeys.filters.filterTypes.sponsor.title,
    }).should("be.visible")
    // On selecting sort by "alphabetically" and any asset class(es)
    cy.findByRole("group", {
      name: commonKeys.filters.filterTypes.sort.title,
    })
      .contains(/Alphabetically/i)
      .click()
    cy.findByRole("button", {
      name: commonKeys.filters.button.applyChange,
    }).click()
    cy.wait("@deals", { timeout: 10000 }).then((interception) => {
      let arr = []
      interception.response.body.data.forEach((singleData) => {
        arr.push(singleData.opportunityName)
      })
      var sortdata = _.sortBy(arr)
      cy.findAllByRole("grid", {
        name: "Deals Card",
      })
        .findAllByRole("heading", {
          level: 2,
        })
        .eq(0)
        .should("contain", sortdata[0])
    })
  })

  it("Should filter out deals as per selected options - Sector and Sponsor", () => {
    // Go to opportunities landing page
    cy.visit("/client")
    cy.findByRole("button", {
      name: /Opportunities/i,
    }).click()
    cy.location("pathname").should("match", /opportunities/)
    cy.findAllByText(commonKeys.button.seeMore).eq(0).click()
    // Click on "Sort & Filter" button
    cy.findAllByText(commonKeys.client.sortByFilter).click()
    cy.findByText(commonKeys.filters.title).should("be.visible")
    // On selecting any sector and any sponsor
    cy.findByRole("group", {
      name: commonKeys.filters.filterTypes.sector.title,
    })
      .contains(/Diversified/i)
      .click()
    cy.findByRole("group", {
      name: commonKeys.filters.filterTypes.sponsor.title,
    })
      .contains(/Multiple/i)
      .click()
    cy.findByRole("button", {
      name: commonKeys.filters.button.applyChange,
    }).click()
    cy.findByText(/Multifamily/i).should("not.exist")
    cy.findByText(/Broadshore Capital Partners/i).should("not.exist")
  })

  it("Should filter out deals as per selected options - Sort by and Sponsor", () => {
    // Go to opportunities landing page
    cy.visit("/client")
    cy.findByRole("button", {
      name: /Opportunities/i,
    }).click()
    cy.location("pathname").should("match", /opportunities/)
    cy.findAllByText(commonKeys.button.seeMore).eq(0).click()
    // Click on "Sort & Filter" button
    cy.findAllByText(commonKeys.client.sortByFilter).click()
    cy.findByText(commonKeys.filters.title).should("be.visible")
    // On selecting Sort by "alphabetically" and any sponsor
    cy.findByRole("group", {
      name: commonKeys.filters.filterTypes.sort.title,
    })
      .contains(/Alphabetically/i)
      .click()
    cy.findByRole("group", {
      name: commonKeys.filters.filterTypes.sponsor.title,
    })
      .contains(/KKR/i)
      .click()
    cy.findByRole("button", {
      name: commonKeys.filters.button.applyChange,
    }).click()
    cy.findByText(/Broadshore Capital Partners/i).should("not.exist")
  })

  it("Should filter out deals as per selected options - Sector and Asset class", () => {
    // Go to opportunities landing page
    cy.visit("/client")
    cy.findByRole("button", {
      name: /Opportunities/i,
    }).click()
    cy.location("pathname").should("match", /opportunities/)
    cy.findAllByText(commonKeys.button.seeMore).eq(0).click()
    // Click on "Sort & Filter" button
    cy.findAllByText(commonKeys.client.sortByFilter).click()
    cy.findByText(commonKeys.filters.title).should("be.visible")
    // On selecting any sector and any Asset class(es)
    cy.findByRole("group", {
      name: commonKeys.filters.filterTypes.sector.title,
    })
      .contains(/Multifamily/i)
      .click()
    cy.findByRole("group", {
      name: commonKeys.filters.filterTypes.assetClass.title,
    })
      .contains(/Real Estate Equity/i)
      .click()
    cy.findByRole("button", {
      name: commonKeys.filters.button.applyChange,
    }).click()
    cy.findAllByText(/Real Estate Equity/i).should("be.visible")
    cy.findAllByText(/Multifamily/i).should("be.visible")
  })

  it("Should show no result if the applied filter doesn't have any deal related to it", () => {
    // Go to opportunities
    cy.visit("/client")
    cy.findByRole("button", {
      name: /Opportunities/i,
    }).click()
    cy.location("pathname").should("match", /opportunities/)
    cy.findAllByText(commonKeys.button.seeMore).eq(0).click()
    // Click on "Sort & Filter" button
    cy.findAllByText(commonKeys.client.sortByFilter).click()
    cy.findByText(commonKeys.filters.title).should("be.visible")
    cy.findByRole("group", {
      name: commonKeys.filters.filterTypes.order.title,
    }).should("be.visible")
    cy.findByRole("group", {
      name: commonKeys.filters.filterTypes.sort.title,
    }).should("be.visible")
    cy.findByRole("group", {
      name: commonKeys.filters.filterTypes.assetClass.title,
    }).should("be.visible")
    cy.findByRole("group", {
      name: commonKeys.filters.filterTypes.shariah.title,
    }).should("be.visible")
    cy.findByRole("group", {
      name: commonKeys.filters.filterTypes.sector.title,
    }).should("be.visible")
    cy.findByRole("group", {
      name: commonKeys.filters.filterTypes.sponsor.title,
    }).should("be.visible")
    // when no selected options are available
    cy.findByRole("group", {
      name: commonKeys.filters.filterTypes.assetClass.title,
    })
      .contains(/Equities/i)
      .click()
    cy.findByRole("group", {
      name: commonKeys.filters.filterTypes.sector.title,
    })
      .contains(/Financials/i)
      .click()
    cy.findByRole("group", {
      name: commonKeys.filters.filterTypes.sponsor.title,
    })
      .contains(/KKR/i)
      .click()
    cy.findByRole("button", {
      name: commonKeys.filters.button.applyChange,
    }).click()
    cy.findByText(commonKeys.client.notFound.title).should("be.visible")
  })
})
