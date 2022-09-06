describe("Market Indicators", () => {
  let portfolioSummaryKeys
  let commonKeys
  let marketIndicatorsKeys

  before(() => {
    cy.loginClient()
    cy.fixture("../../public/locales/en/portfolioSummary").then((keys) => {
      portfolioSummaryKeys = keys
    })
    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })
    cy.fixture("../../public/locales/en/marketIndicators").then((keys) => {
      marketIndicatorsKeys = keys
    })
  })

  it("Should open the market indicator page from Portfolio summary", () => {
    // Go to portfolio summary page
    cy.visit("/client/portfolio-summary")
    // Go to Portfolio overview section
    cy.findByText(portfolioSummaryKeys.portfolioOverview.title)
      .eq(0)
      .scrollIntoView()
      .should("be.visible")
    // Click on market indicator
    cy.findByRole("heading", {
      name: portfolioSummaryKeys.portfolioOverview.label.marketIndicators,
    })
      .parent()
      .children()
      .eq(1)
      .click()
    cy.location("pathname", { timeout: 15000 }).should(
      "match",
      /market-indicator/i,
    )
    cy.findAllByText(marketIndicatorsKeys.page.title).should("be.visible")
  })

  it("Should show the Market sentiment", () => {
    // Go to market Indicator page from the menu or portfolio summary overview
    cy.visit("/client")
    cy.findByRole("button", {
      name: new RegExp(commonKeys.nav.links.myPortfolio, "i"),
    }).click()
    cy.findByRole("link", {
      name: commonKeys.nav.links.marketIndicators,
    }).click()
    // Go to Market Sentiment
    cy.findAllByText(marketIndicatorsKeys.labels.market_sentiment).should(
      "be.visible",
    )
    cy.findAllByRole("listitem", {
      name: "Description",
    })
      .eq(1)
      .should("be.visible")
    // Graphic representation
    cy.findAllByLabelText("Graph")
      .eq(0)
      .should("have.css", "background-color")
      .and("eq", "rgb(183, 76, 69)")
  })

  it("Should show the Market Valuations", () => {
    // Go to market Indicator page from the menu or portfolio summary overview
    cy.visit("/client")
    cy.findByRole("button", {
      name: new RegExp(commonKeys.nav.links.myPortfolio, "i"),
    }).click()
    cy.findByRole("link", {
      name: commonKeys.nav.links.marketIndicators,
    }).click()
    // Go to Market Valuations
    cy.findAllByText(marketIndicatorsKeys.labels.market_valuations).should(
      "be.visible",
    )
    cy.findAllByRole("listitem", {
      name: "Description",
    })
      .eq(2)
      .should("be.visible")
    // Graphic representation
    cy.findAllByLabelText("Graph")
      .eq(1)
      .should("have.css", "background-color")
      .and("eq", "rgb(183, 76, 69)")
  })

  it("should show the Macroeconomic market data", () => {
    // Go to market Indicator page from the menu or portfolio summary overview
    cy.visit("/client")
    cy.findByRole("button", {
      name: new RegExp(commonKeys.nav.links.myPortfolio, "i"),
    }).click()
    cy.findByRole("link", {
      name: commonKeys.nav.links.marketIndicators,
    }).click()
    // Go to Macroeconomic
    cy.findAllByText(marketIndicatorsKeys.labels.macroeconomic).should(
      "be.visible",
    )
    cy.findAllByRole("listitem", {
      name: "Description",
    })
      .eq(0)
      .should("be.visible")
    // Graphic representation
    cy.findAllByLabelText("Graph")
      .eq(2)
      .should("have.css", "background-color")
      .and("eq", "rgb(183, 76, 69)")
  })
})
