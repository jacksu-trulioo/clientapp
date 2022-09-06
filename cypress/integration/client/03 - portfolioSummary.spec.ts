describe("Portfolio Summary", () => {
  let portfolioSummary
  let IlliquidStageskeys
  let commonKeys

  before(() => {
    cy.loginClient()
    cy.fixture("../../public/locales/en/portfolioSummary").then((keys) => {
      portfolioSummary = keys
    })
    cy.fixture("../../public/locales/en/IlliquidStages").then((keys) => {
      IlliquidStageskeys = keys
    })
    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })
  })

  context("Welcome", () => {
    it("should show Portfolio Summary Welcome Text", () => {
      cy.visit("/client")
      // Go to Portfolio Summary
      cy.findByRole("button", {
        name: new RegExp(commonKeys.nav.links.myPortfolio, "i"),
      }).click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /portfolio-summary/,
      )
      cy.findAllByText(
        /Welcome, Client #\d+ to your Portfolio Summary/i,
      ).should("be.visible")
    })
  })

  context("Recent Deal Activities", () => {
    it("should show recent deal activity for last 3 months", () => {
      // Go to Portfolio summary page
      // Overview of the client's recent activity
      cy.findByText(portfolioSummary.recentActivity.title, {
        timeout: 10000,
      }).should("be.visible")
      // Click on 3 Months button
      cy.findByRole("button", {
        name: "3 Months",
      }).click({ timeout: 8000 })
      cy.findByText("within 3 Months").should("be.visible")
      cy.findByRole("grid", {
        name: "Recent Activity",
      }).should("be.visible")
    })

    it("should show recent deal activity for last 6 months", () => {
      // Go to Portfolio summary page
      // Click on 6 Months button
      cy.findByRole("button", {
        name: "6 Months",
      }).click()
      cy.findByText("within 6 Months").should("be.visible")
      // Overview of the client's recent activity
      cy.findByText(portfolioSummary.recentActivity.title).should("be.visible")
      cy.findByRole("grid", {
        name: "Recent Activity",
      }).should("be.visible")
    })

    it("should show recent funding and money Invested(money in) - 3 months", () => {
      // Go to Portfolio summary
      // Click on 3 Months
      cy.findByRole("button", {
        name: "3 Months",
      }).click({ timeout: 8000 })
      cy.findByText("within 3 Months").should("be.visible")
      // Recent activity
      cy.findByText(portfolioSummary.recentActivity.recentFunding.title).should(
        "be.visible",
      )
      cy.findByRole("gridcell", {
        name: "Recent Funding",
      })
        .children()
        .children()
        .eq(2)
        .should("be.visible")
      cy.findByText(
        portfolioSummary.recentActivity.investedOpportunities,
      ).should("be.visible")
      cy.findByRole("gridcell", {
        name: "Money Invested",
      })
        .children()
        .children()
        .eq(2)
        .invoke("text")
        .then((text) => {
          let num = text.replace(/ /g, "")
          expect(num).to.match(/^[$0-9,]*$/)
        })
    })

    it("should show recent funding and money Invested (money in) - 6 months", () => {
      // Go to Portfolio summary
      // Click on 6 Months
      cy.findByRole("button", {
        name: "6 Months",
      }).click({ timeout: 4000 })
      cy.findByText("within 6 Months").should("be.visible")
      // Recent activity
      cy.findByText(portfolioSummary.recentActivity.recentFunding.title).should(
        "be.visible",
      )
      cy.findByRole("gridcell", {
        name: "Recent Funding",
      })
        .children()
        .children()
        .eq(2)
        .should("be.visible")
      cy.findByText(
        portfolioSummary.recentActivity.investedOpportunities,
      ).should("be.visible")
      cy.findByRole("gridcell", {
        name: "Money Invested",
      })
        .children()
        .children()
        .eq(2)
        .invoke("text")
        .then((text) => {
          let num = text.replace(/ /g, "")
          expect(num).to.match(/^[$0-9,]*$/)
        })
    })

    it("should show recent funding + money Invested and Distribution received as capital calls and income - 3 Months", () => {
      cy.reload()
      cy.intercept("GET", "/api/client/deals/recent-activities", (request) => {
        request.reply((response) => {
          response.body[0].distribution.capitalGain = 3540.78
          response.body[0].distribution.incomeDistribution = 745236.1
          return response
        })
      }).as("activities")
      cy.visit("/client/portfolio-summary")
      // Go to portfolio summary page
      cy.wait("@activities")
      cy.findByRole("button", {
        name: "3 Months",
      }).click({ timeout: 8000 })
      cy.findByText("within 3 Months").should("be.visible")
      // Recent activity
      cy.findByText(portfolioSummary.recentActivity.recentFunding.title).should(
        "be.visible",
      )
      cy.findByRole("gridcell", {
        name: "Recent Funding",
      })
        .children()
        .eq(1)
        .should("not.be.null")
      cy.findByText(
        portfolioSummary.recentActivity.investedOpportunities,
      ).should("be.visible")
      cy.findByRole("gridcell", {
        name: "Money Invested",
      })
        .children()
        .eq(1)
        .invoke("text")
        .then((text) => {
          let num = text.replace(/ /g, "")
          expect(num).to.match(/^[$0-9,]*$/)
        })
      cy.findByText(
        portfolioSummary.recentActivity.distributionReceived.title,
      ).should("be.visible")
      cy.findByText(
        portfolioSummary.recentActivity.distributionReceived.labels.income,
      ).should("be.visible")
      cy.findByText(
        portfolioSummary.recentActivity.distributionReceived.labels
          .capitalGains,
      ).should("be.visible")
    })

    it("should show recent funding + money Invested and Distribution received as capital calls and income - 6 Months", () => {
      // Go to portfolio summary page
      // Click on 6 months
      cy.reload()
      cy.intercept("GET", "/api/client/deals/recent-activities", (request) => {
        request.reply((response) => {
          response.body[1].distribution.capitalGain = 68415
          response.body[1].distribution.incomeDistribution = 9872486
          return response
        })
      }).as("distribution")
      cy.visit("/client/portfolio-summary")
      // cy.reload()
      cy.wait("@distribution")
      cy.findByRole("button", {
        name: "6 Months",
      }).click({ timeout: 4000 })
      cy.findByText("within 6 Months").should("be.visible")
      // Recent activity
      cy.findByText(portfolioSummary.recentActivity.recentFunding.title).should(
        "be.visible",
      )
      cy.findByRole("gridcell", {
        name: "Recent Funding",
      })
        .children()
        .eq(1)
        .should("not.be.null")
      cy.findByText(
        portfolioSummary.recentActivity.investedOpportunities,
      ).should("be.visible")
      cy.findByRole("gridcell", {
        name: "Money Invested",
      })
        .children()
        .eq(1)
        .invoke("text")
        .then((text) => {
          let num = text.replace(/ /g, "")
          expect(num).to.match(/^[$0-9,]*$/)
        })
      cy.findByText(
        portfolioSummary.recentActivity.distributionReceived.title,
      ).should("be.visible")
      cy.findByText(
        portfolioSummary.recentActivity.distributionReceived.labels.income,
      ).should("be.visible")
      cy.findByText(
        portfolioSummary.recentActivity.distributionReceived.labels
          .capitalGains,
      ).should("be.visible")
    })

    it("should show recent funding + money Invested and Distribution received in terms of income - 3 months", () => {
      // Go to portfolio summary page
      // Click on 3 months
      cy.reload()
      cy.intercept("GET", "/api/client/deals/recent-activities", (request) => {
        request.reply((response) => {
          response.body[0].distribution.capitalGain = 3540.78
          response.body[0].distribution.incomeDistribution = 745236.1
          return response
        })
      }).as("activities")
      cy.visit("/client/portfolio-summary")
      // cy.reload()
      cy.wait("@activities")
      cy.findByRole("button", {
        name: "3 Months",
      }).click({ timeout: 8000 })
      cy.findByText("within 3 Months").should("be.visible")
      // Recent activity
      cy.findByText(portfolioSummary.recentActivity.recentFunding.title).should(
        "be.visible",
      )
      cy.findByRole("gridcell", {
        name: "Recent Funding",
      })
        .children()
        .eq(1)
        .should("not.be.null")
      cy.findByText(
        portfolioSummary.recentActivity.investedOpportunities,
      ).should("be.visible")
      cy.findByRole("gridcell", {
        name: "Money Invested",
      })
        .children()
        .eq(1)
        .invoke("text")
        .then((text) => {
          let num = text.replace(/ /g, "")
          expect(num).to.match(/^[$0-9,]*$/)
        })
      cy.findByText(
        portfolioSummary.recentActivity.distributionReceived.title,
      ).should("be.visible")
      cy.findByText(
        portfolioSummary.recentActivity.distributionReceived.labels.income,
      ).should("be.visible")
      cy.findByRole("gridcell", {
        name: "Income Distributions",
      })
        .children()
        .eq(1)
        .invoke("text")
        .then((text) => {
          let num = text.replace(/ /g, "")
          expect(num).to.match(/^[$0-9,]*$/)
        })
    })

    it("should show recent funding + money Invested and Distribution received in terms of income - 6 months", () => {
      // Go to portfolio summary page
      cy.reload()
      cy.intercept("GET", "/api/client/deals/recent-activities", (request) => {
        request.reply((response) => {
          response.body[1].distribution.capitalGain = 68415
          response.body[1].distribution.incomeDistribution = 9872486
          return response
        })
      }).as("distribution")
      cy.visit("/client/portfolio-summary")
      cy.wait("@distribution")
      cy.findByRole("button", {
        name: "6 Months",
      }).click({ timeout: 4000 })
      cy.findByText("within 6 Months").should("be.visible")
      // Recent activity
      cy.findByText(portfolioSummary.recentActivity.recentFunding.title).should(
        "be.visible",
      )
      cy.findByRole("gridcell", {
        name: "Recent Funding",
      })
        .children()
        .eq(1)
        .should("not.be.null")
      cy.findByText(
        portfolioSummary.recentActivity.investedOpportunities,
      ).should("be.visible")
      cy.findByRole("gridcell", {
        name: "Money Invested",
      })
        .children()
        .eq(1)
        .invoke("text")
        .then((text) => {
          let num = text.replace(/ /g, "")
          expect(num).to.match(/^[$0-9,]*$/)
        })
      cy.findByText(
        portfolioSummary.recentActivity.distributionReceived.title,
      ).should("be.visible")
      cy.findByText(
        portfolioSummary.recentActivity.distributionReceived.labels.income,
      ).should("be.visible")
      cy.findByRole("gridcell", {
        name: "Income Distributions",
      })
        .children()
        .eq(1)
        .invoke("text")
        .then((text) => {
          let num = text.replace(/ /g, "")
          expect(num).to.match(/^[$0-9,]*$/)
        })
    })

    it("should show recent funding + money Invested and Distribution received in terms of capital gains- 3 Months", () => {
      // Go to potfolio summary
      // Click on 3 Months
      cy.reload()
      cy.intercept("GET", "/api/client/deals/recent-activities", (request) => {
        request.reply((response) => {
          response.body[0].distribution.capitalGain = 3540.78
          response.body[0].distribution.incomeDistribution = 745236.1
          return response
        })
      }).as("activities")
      cy.visit("/client/portfolio-summary")
      cy.wait("@activities")
      cy.findByRole("button", {
        name: "3 Months",
      }).click({ timeout: 8000 })
      cy.findByText("within 3 Months").should("be.visible")
      // Recent activity
      cy.findByText(portfolioSummary.recentActivity.recentFunding.title).should(
        "be.visible",
      )
      cy.findByRole("gridcell", {
        name: "Recent Funding",
      })
        .children()
        .eq(1)
        .should("not.be.null")
      cy.findByText(
        portfolioSummary.recentActivity.investedOpportunities,
      ).should("be.visible")
      cy.findByRole("gridcell", {
        name: "Money Invested",
      })
        .children()
        .eq(1)
        .invoke("text")
        .then((text) => {
          let num = text.replace(/ /g, "")
          expect(num).to.match(/^[$0-9,]*$/)
        })
      cy.findByText(
        portfolioSummary.recentActivity.distributionReceived.title,
      ).should("be.visible")
      cy.findByText(
        portfolioSummary.recentActivity.distributionReceived.labels
          .capitalGains,
      ).should("be.visible")
      cy.findByRole("gridcell", {
        name: "Capital Gains",
      })
        .children()
        .eq(1)
        .invoke("text")
        .then((text) => {
          let num = text.replace(/ /g, "")
          expect(num).to.match(/^[$0-9,]*$/)
        })
    })

    it("should show recent funding + money Invested and Distribution received in terms of capital gains- 6 Months", () => {
      // Go to potfolio summary
      // Click on 6 Months
      cy.reload()
      cy.intercept("GET", "/api/client/deals/recent-activities", (request) => {
        request.reply((response) => {
          response.body[1].distribution.capitalGain = 68415
          response.body[1].distribution.incomeDistribution = 9872486
          return response
        })
      }).as("distribution")
      cy.visit("/client/portfolio-summary")
      // cy.reload()
      cy.wait("@distribution")
      cy.findByRole("button", {
        name: "6 Months",
      }).click({ timeout: 8000 })
      cy.findByText("within 6 Months").should("be.visible")
      // Recent activity
      cy.findByText(portfolioSummary.recentActivity.recentFunding.title).should(
        "be.visible",
      )
      cy.findByRole("gridcell", {
        name: "Recent Funding",
      })
        .children()
        .eq(1)
        .should("not.be.null")
      cy.findByText(
        portfolioSummary.recentActivity.investedOpportunities,
      ).should("be.visible")
      cy.findByRole("gridcell", {
        name: "Money Invested",
      })
        .children()
        .eq(1)
        .invoke("text")
        .then((text) => {
          let num = text.replace(/ /g, "")
          expect(num).to.match(/^[$0-9,]*$/)
        })
      cy.findByText(
        portfolioSummary.recentActivity.distributionReceived.title,
      ).should("be.visible")
      cy.findByText(
        portfolioSummary.recentActivity.distributionReceived.labels
          .capitalGains,
      ).should("be.visible")
      cy.findByRole("gridcell", {
        name: "Capital Gains",
      })
        .children()
        .eq(1)
        .invoke("text")
        .then((text) => {
          let num = text.replace(/ /g, "")
          expect(num).to.match(/^[$0-9,]*$/)
        })
    })

    it("should not show recent activity - Empty state", () => {
      cy.visit("/client")
      // Go to portfolio summary page
      cy.get("#menu-button-user-menu-button").click()
      cy.findByRole("menuitem", {
        name: commonKeys.nav.links.setting,
      }).click()
      cy.findByRole("combobox").clear().type("82032{enter}")
      cy.wait(4000)
      cy.findByRole("button", {
        name: new RegExp(commonKeys.nav.links.myPortfolio, "i"),
      }).click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /portfolio-summary/,
      )
      // Recent activity section for a new client or a client who has no investments/distributions made in the last 6 months
      cy.findByRole("button", {
        name: "3 Months",
      }).should("not.exist")
      cy.findByRole("button", {
        name: "6 Months",
      }).should("not.exist")
      cy.findByText(portfolioSummary.recentActivity.title).should("not.exist")
      cy.findByText(portfolioSummary.recentActivity.recentFunding.title).should(
        "not.exist",
      )
      cy.findByText(
        portfolioSummary.recentActivity.investedOpportunities,
      ).should("not.exist")
    })
  })

  context("Objectives and Allocation", () => {
    it("should be able to download the table file", () => {
      // Click on download button
      cy.intercept("post", "/api/client/generate-excel-file").as("download")
      cy.findByRole("button", { name: commonKeys.button.download }).click()
      cy.wait("@download").its("response.statusCode").should("eq", 200)
      // Click on download button in allocation details
      cy.findByRole("button", {
        name: portfolioSummary.portfolioAllocation.button.viewAll,
      }).click()
      cy.location("pathname", { timeout: 2000 }).should(
        "match",
        /allocation-details/,
      )
      cy.intercept("post", "/api/client/generate-excel-file").as("download")
      cy.findByRole("button", { name: commonKeys.button.download }).click()
      cy.wait("@download").its("response.statusCode").should("eq", 200)
    })

    it("show the Portfolio Objectives & Allocation with pie chart", () => {
      cy.visit("/client")
      cy.get("#menu-button-user-menu-button").click()
      cy.findByRole("menuitem", {
        name: commonKeys.nav.links.setting,
      }).click()
      cy.findByRole("combobox").clear().type("37001{enter}")
      cy.wait(4000)
      cy.findByRole("button", {
        name: new RegExp(commonKeys.nav.links.myPortfolio, "i"),
      }).click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /portfolio-summary/,
      )
      // Go to Portfolio Objectives & Allocation in Portfolio Summary
      cy.findAllByText(portfolioSummary.portfolioObjectives.title).should(
        "be.visible",
      )
      // Hover on the pie chart
      cy.get(".highcharts-series")
        .children()
        .each((series) => {
          cy.wrap(series).trigger("mouseover", { force: true })
        })
      // Check table
      cy.findByRole("group", { name: "SPV Table Header" })
        .children()
        .then((headers) => {
          let {
            assetClass,
            dealName,
            spv,
            investmentDate,
            investmentAmount,
            marketValue,
            performanceContribution,
          } = portfolioSummary.portfolioAllocation.table.tableHeader

          let headersArr = Cypress.$.makeArray(headers).map(
            (el) => el.innerText,
          )
          expect(headersArr).deep.equal([
            assetClass,
            dealName,
            spv,
            investmentDate,
            investmentAmount,
            marketValue,
            performanceContribution,
          ])
          cy.findAllByRole("row", { name: /Deal Row \d+/i })
            .eq(0)
            .within(() => {
              cy.findAllByRole("cell").should(
                "have.length",
                headersArr.length - 1,
              )
            })

          cy.findAllByRole("group", { name: "SPV Box" })
          cy.findAllByRole("heading").should("be.visible")
          cy.findAllByRole("cell").should("be.visible")
        })
      // Click on any of the asset legend in the pie chart
      cy.get('path[name="Other Illiquid"]').click()
      cy.findAllByRole("group", { name: "SPV Box" })
        .eq(0)
        .findByRole("heading", { name: "Other Illiquid" })
        .should("be.visible")
    })

    it("should open the 'View all investment' button", () => {
      // Click on the 'View all investment' button
      cy.findByRole("button", {
        name: portfolioSummary.portfolioAllocation.button.viewAll,
      }).click()
      cy.location("pathname", { timeout: 2000 }).should(
        "match",
        /allocation-details/,
      )
      cy.findByRole("heading", { name: "Asset Class Listing" }).should(
        "be.visible",
      )
      // Check table
      cy.findByRole("group", { name: "SPV Table Header" })
        .children()
        .then((headers) => {
          let {
            assetClass,
            dealName,
            spv,
            investmentDate,
            investmentAmount,
            marketValue,
            performanceContribution,
          } = portfolioSummary.portfolioAllocation.table.tableHeader

          let headersArr = Cypress.$.makeArray(headers).map(
            (el) => el.innerText,
          )
          expect(headersArr).deep.equal([
            assetClass,
            dealName,
            spv,
            investmentDate,
            investmentAmount,
            marketValue,
            performanceContribution,
          ])
          cy.findAllByRole("row", { name: /Deal Row \d+/i })
            .eq(0)
            .within(() => {
              cy.findAllByRole("cell").should(
                "have.length",
                headersArr.length - 1,
              )
            })

          cy.findAllByRole("group", { name: "SPV Box" })
          cy.findAllByRole("heading").should("be.visible")
          cy.findAllByRole("cell").should("be.visible")
        })
      cy.findByRole("button", { name: commonKeys.button.back }).click()
    })

    it("should not open asset allocation page for non-core clients", () => {
      // Go to Portfolio Objectives & Allocation in Portfolio Summary
      cy.findAllByText(portfolioSummary.portfolioObjectives.title)
        .scrollIntoView()
        .should("be.visible")
      // Click view asset allocation
      cy.findByRole("heading", {
        name: portfolioSummary.portfolioObjectives.button,
      }).click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /asset-allocation/,
      )
      // On clicking on 'okay' button
      cy.findByRole("button", {
        name: "Ok",
      }).click()
      cy.findAllByText(portfolioSummary.portfolioObjectives.title).should(
        "be.visible",
      )
      // On clicking 'x' icon
      cy.findByRole("heading", {
        name: portfolioSummary.portfolioObjectives.button,
      }).click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /asset-allocation/,
      )
      cy.findByRole("button", {
        name: "Close",
      }).click()
      cy.findAllByText(portfolioSummary.portfolioObjectives.title).should(
        "be.visible",
      )
    })

    it("should open Asset Allocation page", () => {
      cy.visit("/client")
      // Go to  portfolio summary page
      cy.get("#menu-button-user-menu-button").click()
      cy.findByRole("menuitem", {
        name: commonKeys.nav.links.setting,
      }).click()
      cy.findByRole("combobox").clear().type("37071{enter}")
      cy.wait(4000)
      cy.findByRole("button", {
        name: new RegExp(commonKeys.nav.links.myPortfolio, "i"),
      }).click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /portfolio-summary/,
      )
      cy.findAllByText(portfolioSummary.portfolioObjectives.title).click()
      // Go to Objectives and allocations in portfolio summary page
      cy.findAllByText(portfolioSummary.portfolioObjectives.title).should(
        "be.visible",
      )
      cy.get(".highcharts-series")
        .children()
        .each((series) => {
          cy.wrap(series).trigger("mouseover", { force: true })
        })
      // On clicking "view asset allocation" link
      cy.findByRole("heading", {
        name: portfolioSummary.portfolioObjectives.button,
      }).click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /asset-allocation/,
      )
      cy.findByRole("button", { name: commonKeys.button.back }).click()
    })
  })

  context("CRR Synthesia Video", () => {
    it("show the CRR synthesia video", () => {
      cy.visit("/client")
      cy.get("#menu-button-user-menu-button").click()
      cy.findByRole("menuitem", {
        name: commonKeys.nav.links.setting,
      }).click()
      cy.findByRole("combobox").clear().type("92601{enter}")
      cy.wait(4000)
      cy.findByRole("button", {
        name: new RegExp(commonKeys.nav.links.myPortfolio, "i"),
      }).click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /portfolio-summary/,
      )
      // Go to Portfolio overview videos in Portfolio Summary
      cy.findByText(portfolioSummary.portfolioOverviewVideos.title)
        .scrollIntoView()
        .should("be.visible")
      // Click on the video
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
      // Disclaimer
      cy.findByText(portfolioSummary.portfolioOverviewVideos.disclaimer).should(
        "be.visible",
      )
      cy.findByText(/This video was created on/i).should("be.visible")
    })
  })

  context("Portfolio Overview Widgets", () => {
    it("should show cashflows", () => {
      // Click on Portfolio Summary
      // Go to Portfolio Overview
      cy.findByRole("heading", {
        name: portfolioSummary.portfolioOverview.title,
      })
        .scrollIntoView()
        .should("be.visible")
      cy.findByText(
        portfolioSummary.portfolioOverview.label.capitalCall,
      ).should("be.visible")
      cy.findByText(
        portfolioSummary.portfolioOverview.label.distributions,
      ).should("be.visible")
      // Cash Flows
      // On clicking the section
      cy.findByRole("heading", {
        name: portfolioSummary.portfolioOverview.label.cashFlows,
      })
        .should("be.visible")
        .parent()
        .children()
        .eq(1)
        .click()
      cy.location("pathname", { timeout: 4000 }).should("match", /cash-flows/)
      cy.findAllByText("Back").click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /portfolio-summary/,
      )
    })

    it("should show Performance", () => {
      // Click on Portfolio Summary
      // Go to Portfolio Overview
      cy.findByRole("heading", {
        name: portfolioSummary.portfolioOverview.title,
      })
        .scrollIntoView()
        .should("be.visible")
      // Performance
      // On clicking the section
      cy.findByRole("heading", {
        name: portfolioSummary.portfolioOverview.label.performance,
      })
        .should("be.visible")
        .parent()
        .children()
        .eq(1)
        .click()
      cy.location("pathname", { timeout: 4000 }).should("match", /performance/)
      cy.findAllByText("Back").click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /portfolio-summary/,
      )
    })

    it("should show Profit and Loss", () => {
      // Click on Portfolio Summary
      // Go to Portfolio Overview
      cy.findByRole("heading", {
        name: portfolioSummary.portfolioOverview.title,
      })
        .scrollIntoView()
        .should("be.visible")
      // Profit and Loss
      // ON clicking the section
      cy.findByRole("heading", {
        name: portfolioSummary.portfolioOverview.label.profitAndLoss,
      })
        .should("be.visible")
        .parent()
        .children()
        .eq(1)
        .click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /profit-and-loss/,
      )
      cy.findAllByText("Back").click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /portfolio-summary/,
      )
    })

    it("should show Portfolio Holdings", () => {
      // Click on Portfolio Summary
      // Go to Portfolio Overview
      cy.findByRole("heading", {
        name: portfolioSummary.portfolioOverview.title,
      })
        .scrollIntoView()
        .should("be.visible")
      // Portfolio Holding
      // On clicking the section
      cy.findByRole("heading", {
        name: portfolioSummary.portfolioOverview.label.portfolioHolding,
      })
        .should("be.visible")
        .parent()
        .children()
        .eq(1)
        .click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /total-investments/,
      )
      cy.findAllByText("Back").click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /portfolio-summary/,
      )
    })

    it("should show Total Commitments", () => {
      // Click on Portfolio Summary
      // Go to Portfolio Overview
      cy.findByRole("heading", {
        name: portfolioSummary.portfolioOverview.title,
      })
        .scrollIntoView()
        .should("be.visible")
      // Total Commitments
      // on clicking the section
      cy.findByRole("heading", {
        name: /Total Commitments/i,
      })
        .should("be.visible")
        .parent()
        .parent()
        .children()
        .eq(1)
        .click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /total-commitments/,
      )
      cy.findAllByText("Back").click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /portfolio-summary/,
      )
    })

    it("should show Market Indicators", () => {
      // Click on Portfolio Summary
      // Go to Portfolio Overview
      cy.findByRole("heading", {
        name: portfolioSummary.portfolioOverview.title,
      })
        .scrollIntoView()
        .should("be.visible")
      cy.findByText(
        portfolioSummary.portfolioOverview.label.capitalCall,
      ).should("be.visible")
      cy.findByText(
        portfolioSummary.portfolioOverview.label.distributions,
      ).should("be.visible")
      // Market Indicators
      // ON clicking the section
      cy.findByRole("heading", {
        name: portfolioSummary.portfolioOverview.label.marketIndicators,
      })
        .should("be.visible")
        .parent()
        .children()
        .eq(1)
        .click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /market-indicator/,
      )
      cy.findAllByText("Back").click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /portfolio-summary/,
      )
      cy.findAllByText(
        /Welcome, Client #\d+ to your Portfolio Summary/i,
      ).should("be.visible")
    })

    it("should show 'Check back later' popup", () => {
      cy.visit("/client")
      // Go to Portfolio summary page
      cy.get("#menu-button-user-menu-button").click()
      cy.findByRole("menuitem", {
        name: commonKeys.nav.links.setting,
      }).click()
      cy.findByRole("combobox").clear().type("82036{enter}")
      cy.wait(4000)
      cy.findByRole("button", {
        name: new RegExp(commonKeys.nav.links.myPortfolio, "i"),
      }).click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /portfolio-summary/,
      )
      // Go to portfolio overview
      cy.findByRole("heading", {
        name: portfolioSummary.portfolioOverview.title,
      })
        .scrollIntoView()
        .should("be.visible")
      cy.findByText(
        portfolioSummary.portfolioOverview.label.capitalCall,
      ).should("be.visible")
      cy.findByText(
        portfolioSummary.portfolioOverview.label.distributions,
      ).should("be.visible")
      // on clicking on any section which has no data
      cy.findByRole("heading", {
        name: portfolioSummary.portfolioOverview.label.cashFlows,
      })
        .should("be.visible")
        .parent()
        .children()
        .eq(1)
        .click()
      // on clicking "okay" button
      cy.findByRole("button", {
        name: "Ok",
      }).click()
      cy.findByRole("heading", {
        name: portfolioSummary.portfolioOverview.label.performance,
      })
        .should("be.visible")
        .parent()
        .children()
        .eq(1)
        .click()
      // on clicking on "x" icon
      cy.findByRole("button", {
        name: "Close",
      }).click()
      cy.get("#menu-button-user-menu-button").click()
      cy.findByRole("menuitem", {
        name: commonKeys.nav.links.setting,
      }).click()
      cy.findByRole("combobox").clear().type("37001{enter}")
      cy.wait(4000)
      cy.findByRole("button", {
        name: new RegExp(commonKeys.nav.links.myPortfolio, "i"),
      }).click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /portfolio-summary/,
      )
    })
  })

  context("Understanding Illiquid Inv. Stages", () => {
    it("should open the UIIS page", () => {
      // Go to portfolio summary page
      // Click on "Understanding Illiquid investment stages" banner
      cy.findByText(portfolioSummary.underStandingInvestment.title)
        .scrollIntoView()
        .should("be.visible")
        .click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /illiquid-stages/,
      )
      cy.findAllByText("Back").eq(0).click()
    })

    it("UIIS screen validations", () => {
      // Go to portfolio summary page
      // Click on  the Understanding Illiquid investment stages banner or the "learn more" button in the banner
      cy.findByRole("button", {
        name: portfolioSummary.underStandingInvestment.button,
      })
        .scrollIntoView()
        .should("be.visible")
        .click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /illiquid-stages/,
      )
      // Description of the stages
      cy.findByText(IlliquidStageskeys.articles.article1).should("be.visible")
      cy.findByText(IlliquidStageskeys.articles.article2).should("be.visible")
      cy.findByText(IlliquidStageskeys.articles.article3).should("be.visible")
      cy.findByRole("heading", {
        name: IlliquidStageskeys.seedStage.title,
      }).should("be.visible")
      cy.findByText(IlliquidStageskeys.seedStage.betweenYears).should(
        "be.visible",
      )
      cy.findByText(IlliquidStageskeys.seedStage.description).should(
        "be.visible",
      )
      cy.findByRole("heading", {
        name: IlliquidStageskeys.rootStage.title,
      }).should("be.visible")
      cy.findByText(IlliquidStageskeys.rootStage.betweenYears).should(
        "be.visible",
      )
      cy.findByText(IlliquidStageskeys.rootStage.description).should(
        "be.visible",
      )
      cy.findByRole("heading", {
        name: IlliquidStageskeys.growStage.title,
      }).should("be.visible")
      cy.findByText(IlliquidStageskeys.growStage.betweenYears).should(
        "be.visible",
      )
      cy.findByText(IlliquidStageskeys.growStage.description)
        .scrollIntoView()
        .should("be.visible")
      cy.findByRole("heading", {
        name: IlliquidStageskeys.harvest.title,
      }).should("be.visible")
      cy.findByText(IlliquidStageskeys.harvest.betweenYears).should(
        "be.visible",
      )
      cy.findByText(IlliquidStageskeys.harvest.description).should("be.visible")
      // Investment stages graph
    })
  })
})
