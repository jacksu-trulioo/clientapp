describe("Side Menu", () => {
  let assetAllocationKeys
  let performanceKeys
  let profitAndLossKeys
  let totalInvestmentKeys
  let totalCommitmentKeys
  let cashFlowKeys
  let opportunitiesKeys
  let marketIndicatorKeys
  let insightskeys
  let documentCenterkeys
  let authKeys
  let commonKeys

  before(() => {
    cy.loginClient()
    cy.fixture("../../public/locales/en/assetAllocation").then((keys) => {
      assetAllocationKeys = keys
    })
    cy.fixture("../../public/locales/en/performance").then((keys) => {
      performanceKeys = keys
    })
    cy.fixture("../../public/locales/en/profitAndLoss").then((keys) => {
      profitAndLossKeys = keys
    })
    cy.fixture("../../public/locales/en/totalInvestment").then((keys) => {
      totalInvestmentKeys = keys
    })
    cy.fixture("../../public/locales/en/totalCommitment").then((keys) => {
      totalCommitmentKeys = keys
    })
    cy.fixture("../../public/locales/en/cashflow").then((keys) => {
      cashFlowKeys = keys
    })
    cy.fixture("../../public/locales/en/opportunities").then((keys) => {
      opportunitiesKeys = keys
    })
    cy.fixture("../../public/locales/en/marketIndicators").then((keys) => {
      marketIndicatorKeys = keys
    })
    cy.fixture("../../public/locales/en/insights").then((keys) => {
      insightskeys = keys
    })
    cy.fixture("../../public/locales/en/documentCenter").then((keys) => {
      documentCenterkeys = keys
    })
    cy.fixture("../../public/locales/en/auth").then((keys) => {
      authKeys = keys
    })
    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })
  })

  it("Should open Dashboard page", () => {
    // Should open Dashboard page
    cy.visit("/client")
    cy.findByRole("link", {
      name: commonKeys.nav.links.dashboard,
    }).click()
    cy.location("pathname", { timeout: 15000 }).should("match", /client/)
    cy.findAllByText(/client id #\d+/i).should("be.visible")
  })

  it("Should open Portfolio Summary landing page", () => {
    // On clicking My Portfolio in the sidebar
    cy.findByRole("button", {
      name: new RegExp(commonKeys.nav.links.myPortfolio, "i"),
    }).click()
    cy.location("pathname", { timeout: 15000 }).should(
      "match",
      /portfolio-summary/i,
    )
    cy.findAllByText(/Welcome, Client #\d+ to your Portfolio Summary/i).should(
      "be.visible",
    )
  })

  it("Should open the Asset Allocation page", () => {
    // On clicking Asset Allocation under portfolio summary in the sidebar
    cy.get("#menu-button-user-menu-button").click()
    cy.findByRole("menuitem", {
      name: commonKeys.nav.links.setting,
    }).click()
    cy.findByRole("combobox").clear().type("37071{enter}")
    cy.wait(4000)
    cy.findByRole("button", {
      name: new RegExp(commonKeys.nav.links.myPortfolio, "i"),
    }).click()
    cy.wait(2000)
    cy.findByRole("link", {
      name: commonKeys.nav.links.assetAllocation,
    }).click()
    cy.location("pathname", { timeout: 15000 }).should(
      "match",
      /asset-allocation/,
    )
    cy.findByText(assetAllocationKeys.objectives.title).should("be.visible")
  })

  it("Should open the Performance page", () => {
    // On clicking Performance under portfolio summary in sidebar
    cy.findByRole("link", {
      name: commonKeys.nav.links.performance,
    }).click()
    cy.location("pathname", { timeout: 15000 }).should("match", /performance/)
    cy.findAllByText(performanceKeys.heading).should("be.visible")
  })

  it("Should open the Profit and Loss page", () => {
    // On clicking Profit and Loss under portfolio summary in sidebar
    cy.findByRole("link", {
      name: commonKeys.nav.links.profitLoss,
    }).click()
    cy.location("pathname", { timeout: 15000 }).should(
      "match",
      /profit-and-loss/,
    )
    cy.findAllByText(profitAndLossKeys.heading).should("be.visible")
  })

  it("Should open Market Indicators page", () => {
    // On clicking Market Indicator under portfolio summary in sidebar
    cy.findByRole("link", {
      name: commonKeys.nav.links.marketIndicators,
    }).click()
    cy.location("pathname", { timeout: 15000 }).should(
      "match",
      /market-indicator/,
    )
    cy.findAllByText(marketIndicatorKeys.page.title).should("be.visible")
  })

  it("Should open the Total Investments", () => {
    // On clicking Total Investments under portfolio summary in sidebar
    cy.findByRole("link", {
      name: commonKeys.nav.links.totalInvestments,
    }).click()
    cy.location("pathname").should("match", /total-investments/)
    cy.findAllByText(totalInvestmentKeys.heading, { timeout: 15000 }).should(
      "be.visible",
    )
  })

  it("Should open the Total Commitments page", () => {
    // On clicking Total Commitments under portfolio summary in sidebar
    cy.findByRole("link", {
      name: commonKeys.nav.links.totalCommitments,
    }).click()
    cy.location("pathname", { timeout: 15000 }).should(
      "match",
      /total-commitments/,
    )
    cy.findByRole("heading", {
      name: totalCommitmentKeys.heading,
    }).should("be.visible")
  })

  it("Should open the Cashflows page", () => {
    // On clicking Cashflows under portfolio summary in sidebar
    cy.findByRole("link", {
      name: commonKeys.nav.links.cashFlows,
    }).click()
    cy.location("pathname", { timeout: 15000 }).should("match", /cash-flows/)
    cy.findByText(cashFlowKeys.heading)
  })

  it("Should open the Insights overview page", () => {
    // On clicking Insights in the sidebar
    cy.findByRole("link", {
      name: commonKeys.nav.links.insights,
    }).click()
    cy.location("pathname", { timeout: 15000 }).should("match", /insights/)
    cy.wait(2000)
    cy.findAllByText(insightskeys.page.index.title).eq(1).should("be.visible")
  })

  it("Should open the Market Simplified page", () => {
    // On clicking Market Simplified under Insights in sidebar
    cy.findByRole("link", {
      name: commonKeys.nav.links.marketsSimplified,
    }).click()
    cy.location("pathname", { timeout: 15000 }).should(
      "match",
      /markets-simplified/,
    )
    cy.findByText(/Markets Simplified:/i).should("be.visible")
  })

  it("Should open the Market Archive page", () => {
    // On clicking Market Archive under Insights in sidebar
    cy.findByRole("link", {
      name: commonKeys.nav.links.marketArchive,
    }).click()
    cy.location("pathname", { timeout: 15000 }).should(
      "match",
      /markets-archive/,
    )
    cy.findByRole("heading", {
      name: insightskeys.page.marketArchive.title,
    }).should("be.visible")
  })

  it("Should open the Opportunities Page", () => {
    // On clicking Opportunities in the sidebar
    cy.findByRole("button", {
      name: /Opportunities/i,
    }).click()
    cy.location("pathname", { timeout: 15000 }).should("match", /opportunities/)
    cy.findByRole("heading", {
      name: opportunitiesKeys.client.title,
      level: 2,
    }).should("be.visible")
  })

  it("Should open the All Deals page", () => {
    // On clicking All Deals under Opportunities in sidebar
    cy.findByRole("link", {
      name: commonKeys.nav.links.allDeals,
    }).click()
    cy.location("pathname", { timeout: 15000 }).should("match", /opportunities/)
    cy.findByRole("heading", {
      name: opportunitiesKeys.client.title,
      level: 2,
    }).should("be.visible")
  })

  it("Should Open the Interested Deals page", () => {
    // On clicking Interested Deal under Opportunities in sidebar
    cy.findByRole("link", {
      name: commonKeys.nav.links.interestedDeals,
    }).click()
    cy.location("pathname", { timeout: 15000 }).should(
      "match",
      /interested-deals/,
    )
    cy.findByRole("heading", {
      name: opportunitiesKeys.client.labels.interested,
      level: 2,
    }).should("be.visible")
  })

  it("Should open My Documents page", () => {
    // On clicking My Documents in the sidebar
    cy.get("#menu-button-user-menu-button").click()
    cy.findByRole("menuitem", {
      name: commonKeys.nav.links.setting,
    }).click()
    cy.findByRole("combobox").clear().type("37001{enter}")
    cy.wait(4000)
    cy.findByRole("link", {
      name: commonKeys.nav.links.myDocuments,
    }).click()
    cy.location("pathname", { timeout: 15000 }).should("match", /my-documents/)
    cy.findByRole("heading", { name: documentCenterkeys.heading }).should(
      "be.visible",
    )
  })

  it("Should collapse the Sidebar", () => {
    // On clicking the "<<" icon
    cy.get('button[aria-label="Close Sidebar"]').click()
    cy.findByRole("link", {
      name: commonKeys.nav.links.dashboard,
    }).should("not.exist")
    cy.findByRole("link", {
      name: commonKeys.nav.links.myPortfolio,
    }).should("not.exist")
    cy.findByRole("link", {
      name: commonKeys.nav.links.insights,
    }).should("not.exist")
    cy.findByRole("link", {
      name: commonKeys.nav.links.opportunities,
    }).should("not.exist")
    cy.findByRole("link", {
      name: commonKeys.nav.links.myDocuments,
    }).should("not.exist")
  })

  it("Should expand the Sidebar", () => {
    // On clicking the ">>" icon in collapsed side bar
    cy.get('button[aria-label="Open Sidebar"]').click()
    cy.findByRole("link", {
      name: commonKeys.nav.links.dashboard,
    }).should("be.visible")
    cy.findByRole("link", {
      name: commonKeys.nav.links.myPortfolio,
    }).should("be.visible")
    cy.findByRole("link", {
      name: commonKeys.nav.links.insights,
    }).should("be.visible")
    cy.findByRole("link", {
      name: commonKeys.nav.links.opportunities,
    }).should("be.visible")
    cy.findByRole("link", {
      name: commonKeys.nav.links.myDocuments,
    }).should("be.visible")
  })
  it.skip("(Yet To Be Develop)Should redirect to TFO site ", () => {
    // On clicking TFO logo
  })
  it.skip("Should Sign Out (Responsive)", () => {
    // On clicking Sign out
    cy.visit("/client")
    cy.location("pathname", { timeout: 15000 }).should("match", /client/)
    cy.findAllByText(/client id #\d+/i).should("be.visible")
    cy.get("#menu-button-user-menu-button").click()
    cy.wait(1000)
    cy.findByRole("menuitem", {
      name: "Sign out",
    }).click()
    cy.location("pathname", { timeout: 15000 }).should("match", /login/)
    cy.findByText(authKeys.login.subheading).should("be.visible")
  })
})
