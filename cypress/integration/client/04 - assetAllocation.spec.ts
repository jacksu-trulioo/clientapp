describe("Asset Allocation", () => {
  let assetAllocationKeys
  let portfolioSummaryKeys
  let commonKeys

  before(() => {
    cy.loginClient()
    cy.fixture("../../public/locales/en/assetAllocation").then((keys) => {
      assetAllocationKeys = keys
    })
    cy.fixture("../../public/locales/en/portfolioSummary").then((keys) => {
      portfolioSummaryKeys = keys
    })
    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })
  })

  it("should not open asset allocation page for non core client", () => {
    cy.visit("/client")
    // Go to Portfolio summary page
    cy.findByRole("button", {
      name: new RegExp(commonKeys.nav.links.myPortfolio, "i"),
    }).click()
    cy.location("pathname", { timeout: 15000 }).should(
      "match",
      /portfolio-summary/,
    )
    // Click on "view asset allocation" link or on clicking Asset Allocation from side menu
    cy.findByRole("heading", {
      name: portfolioSummaryKeys.portfolioObjectives.button,
      level: 2,
    }).click()
    cy.location("pathname", { timeout: 15000 }).should(
      "match",
      /asset-allocation/,
    )
    cy.findByText(commonKeys.client.errors.noDate.title).should("be.visible")
    cy.findByText(commonKeys.client.errors.noDate.description).should(
      "be.visible",
    )
    cy.findByRole("button", {
      name: commonKeys.client.errors.noDate.button,
    }).should("be.visible")
  })

  it("should go back to the portfolio summary page", () => {
    cy.visit("/client")
    // Go to portfolio summary page
    cy.findByRole("button", {
      name: new RegExp(commonKeys.nav.links.myPortfolio, "i"),
    }).click()
    cy.location("pathname", { timeout: 15000 }).should(
      "match",
      /portfolio-summary/,
    )
    // Go to Asset allocation page
    cy.findByRole("heading", {
      name: portfolioSummaryKeys.portfolioObjectives.button,
      level: 2,
    }).click()
    cy.location("pathname", { timeout: 15000 }).should(
      "match",
      /asset-allocation/,
    )
    // Click on "okay"
    cy.findByText(commonKeys.client.errors.noDate.title).should("be.visible")
    cy.findByText(commonKeys.client.errors.noDate.description).should(
      "be.visible",
    )
    cy.findByRole("button", {
      name: commonKeys.client.errors.noDate.button,
    }).click()
    cy.location("pathname", { timeout: 15000 }).should(
      "match",
      /portfolio-summary/,
    )
    // Click on "x" icon
    cy.findByRole("button", {
      name: new RegExp(commonKeys.nav.links.myPortfolio, "i"),
    }).click()
    cy.location("pathname", { timeout: 15000 }).should(
      "match",
      /portfolio-summary/,
    )
    cy.findByRole("link", {
      name: commonKeys.nav.links.assetAllocation,
    }).click()
    cy.location("pathname", { timeout: 15000 }).should(
      "match",
      /asset-allocation/,
    )
    cy.findByRole("button", {
      name: commonKeys.button.close,
    }).click()
  })

  it("should open Asset allocation page for a core client", () => {
    cy.visit("/client")
    cy.get("#menu-button-user-menu-button").click()
    cy.findByRole("menuitem", {
      name: commonKeys.nav.links.setting,
    }).click()
    cy.findByRole("combobox").clear().type("37071{enter}")
    cy.wait(4000)
    cy.findAllByText(/client id #37071/i).should("be.visible")
    // Go to Portfolio summary page
    cy.findByRole("button", {
      name: new RegExp(commonKeys.nav.links.myPortfolio, "i"),
    }).click()
    cy.location("pathname", { timeout: 15000 }).should(
      "match",
      /portfolio-summary/,
    )
    // Click on "view asset allocation" link
    cy.findByRole("heading", {
      name: portfolioSummaryKeys.portfolioObjectives.button,
      level: 2,
    }).click()
    cy.location("pathname", { timeout: 15000 }).should(
      "match",
      /asset-allocation/,
    )
    cy.findByText(assetAllocationKeys.objectives.title).should("be.visible")
    // Click on "Asset allocation" tab in the side menu
    cy.findByRole("button", {
      name: new RegExp(commonKeys.nav.links.myPortfolio, "i"),
    }).click()
    cy.findByRole("link", {
      name: commonKeys.nav.links.assetAllocation,
    }).click()
    cy.findByText(assetAllocationKeys.objectives.title).should("be.visible")
  })

  it("show the objectives and the target allocation", () => {
    cy.visit("/client/portfolio-summary")
    // Go to Asset allocation page from the portfolio summary
    cy.findByRole("heading", {
      name: portfolioSummaryKeys.portfolioObjectives.button,
      level: 2,
    }).click()
    cy.location("pathname", { timeout: 15000 }).should(
      "match",
      /asset-allocation/,
    )
    // "Your objectives" section
    cy.findByText(assetAllocationKeys.objectives.title).should("be.visible")
    cy.findByText(
      assetAllocationKeys.objectives.objectives.ObjectiveOneDescriptionOne,
    ).should("be.visible")
    cy.findByText(
      assetAllocationKeys.objectives.objectives.ObjectiveOneDescriptionTwo,
    ).should("be.visible")
    cy.findByText(
      assetAllocationKeys.objectives.objectives.ObjectiveTwoDescriptionTwo,
    ).should("be.visible")
    cy.findByText(/for the next generation/i).should("be.visible")
    // "Target allocation"
    cy.findAllByText(assetAllocationKeys.targetAssetAllocation.title).should(
      "be.visible",
    )
    cy.findAllByText(
      assetAllocationKeys.targetAssetAllocation.liquid.title,
    ).should("be.visible")
    cy.findAllByText(
      assetAllocationKeys.targetAssetAllocation.liquid.absoluteReturn.title,
    ).should("be.visible")
    cy.findAllByText(
      assetAllocationKeys.targetAssetAllocation.liquid.opportunistic.title,
    ).should("be.visible")
    cy.findAllByText(
      assetAllocationKeys.targetAssetAllocation.illiquid.title,
    ).should("be.visible")
    cy.findAllByText(
      assetAllocationKeys.targetAssetAllocation.illiquid.capitalYielding.title,
    ).should("be.visible")
    cy.findAllByText(
      assetAllocationKeys.targetAssetAllocation.illiquid.capitalGrowth.title,
    ).should("be.visible")
  })

  it("asset allocation over the year - Graphical representation", () => {
    // Go to Asset allocation in Portfolio Summary
    cy.visit("client/asset-allocation")
    cy.findByText(assetAllocationKeys.objectives.title).should("be.visible")
    // Asset allocation over the year
    cy.findByText(assetAllocationKeys.assetAllocationOvertheYears.title).should(
      "be.visible",
    )
    cy.findAllByText(
      assetAllocationKeys.assetAllocationOvertheYears.subtitle,
    ).should("be.visible")
    cy.findByText(/At the beginning, the asset allocation was/i).should(
      "be.visible",
    )
    cy.findAllByText(
      /of liquid and illiquid asset classes, respectively./i,
    ).should("be.visible")
    cy.findAllByText(
      /As illiquid commitments were deployed, the portfolio invested in/i,
    ).should("be.visible")
    // Graph representation
    cy.get(".highcharts-xaxis-labels").scrollIntoView().should("be.visible")
    cy.get(".highcharts-yaxis-labels").should("be.visible")
    cy.get(".highcharts-point").eq(4).trigger("mouseover").should("be.visible")
    // On Hovering the graph
    cy.get(".highcharts-point").each((series) => {
      cy.wrap(series).trigger("mouseover", { force: true })
    })
    // Click on a bar of any particular year
    cy.get(".highcharts-point").eq(24).trigger("mouseover").click()
    cy.findByRole("heading", { name: "assetsHeading" })
      .findByText(/^[12][0-9]{3}$/i)
      .should("be.visible")
  })
})
