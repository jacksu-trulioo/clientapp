describe("Performance", () => {
  let performancekeys
  let commonKeys

  before(() => {
    cy.loginClient()
    cy.fixture("../../public/locales/en/performance").then((keys) => {
      performancekeys = keys
    })
    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })
  })

  context("Overall Performance Charts", () => {
    it("should show the overall performance chart", () => {
      // Go to Performance in Portfolio Summary
      cy.visit("/client")
      cy.findByRole("button", {
        name: new RegExp(commonKeys.nav.links.myPortfolio, "i"),
      }).click()
      cy.findByRole("link", {
        name: commonKeys.nav.links.performance,
      }).click()
      cy.findAllByText(performancekeys.page.title).should("be.visible")
      // Overall Performance section
      cy.findByText(performancekeys.labels.overallPerformance).should(
        "be.visible",
      )
      cy.findByText(performancekeys.labels.cumulativePerformance).should(
        "be.visible",
      )
      cy.findByText(performancekeys.labels.periodPerformance).should(
        "be.visible",
      )
      cy.get(".highcharts-xaxis-labels").should("be.visible")
      cy.get(".highcharts-yaxis-labels").should("be.visible")
      // Hover on the graph
      cy.get(".highcharts-point")
        .eq(4)
        .trigger("mouseover")
        .should("be.visible")
      // On switching the Quarters by clicking on the quarter/ITD tab
      cy.findByRole("button", {
        name: /Q3/i,
      }).click()
      cy.get(".highcharts-point")
        .eq(2)
        .trigger("mouseover")
        .should("be.visible")
      // On selecting any Quarter
      cy.findByRole("button", {
        name: /Q2/i,
      }).click()
      cy.get(".highcharts-point")
        .eq(5)
        .trigger("mouseover")
        .should("be.visible")
      // On selecting ITD
      cy.findByRole("button", {
        name: commonKeys.client.quarters.ITD,
      }).click()
      cy.get(".highcharts-point")
        .eq(3)
        .trigger("mouseover")
        .should("be.visible")
    })
  })

  context("Detailed Performance Stats", () => {
    it("should show the detailed performance of the portfolio", () => {
      // Go to Performance in Portfolio Summary
      cy.visit("/client/performance")
      // Go to Detailed Performance section
      cy.findByText(performancekeys.detailedPerformance.title).should(
        "be.visible",
      )
      cy.findAllByText(performancekeys.labels.inceptionToDate)
        .eq(1)
        .should("be.visible")
      cy.findAllByText(performancekeys.labels.valueStart).should("be.visible")
      cy.findByText(performancekeys.labels.valueEnd).should("be.visible")
      cy.findAllByText(performancekeys.labels.inceptionToDate)
        .eq(1)
        .should("be.visible")
      cy.findAllByText(performancekeys.labels.netChange)
        .eq(0)
        .should("be.visible")
      cy.findByText("Liquid").scrollIntoView().should("be.visible")
      cy.findByText("Illiquid").should("be.visible")
      cy.findByText(performancekeys.labels.illiquidGreaterThanTwoYear).should(
        "be.visible",
      )
      cy.findByText(performancekeys.labels.sharpRatio).should("be.visible")
      cy.findByText(performancekeys.labels.riskVolatility).should("be.visible")
      cy.findByText(performancekeys.labels.annualized).should("be.visible")
      cy.findAllByText(performancekeys.labels.additions)
        .eq(0)
        .should("be.visible")
      cy.findAllByText(/\%/i)
        .invoke("text")
        .then((text) => {
          let array = text.toString().split("%")
          let realdigit = array.map(Number)
          for (let i = 0; i < realdigit.length - 1; i++) {
            var num = realdigit[i]
            expect(num).to.match(/^-?[0-9]*(\.[0-9]{0,1})?$/)
          }
        })
      cy.findAllByText(/\$/i)
        .invoke("text")
        .then((text) => {
          let splitTextArr = text
            .split("$")
            .join()
            .split(/\s+/)
            .join("")
            .split("-")
          for (let i = 1; i < splitTextArr.length; i++) {
            var num = splitTextArr[i]
            expect(num).to.match(/^[0-9,]*$/)
          }
        })
    })
  })

  context("Monthly Performance", () => {
    it("should be able to download the table file", () => {
      cy.visit("/client/performance")
      // Click on download button
      cy.intercept("post", "/api/client/generate-excel-file").as("download")
      cy.findByRole("button", { name: commonKeys.button.download }).click()
      cy.wait("@download").its("response.statusCode").should("eq", 200)
    })

    it("should show the monthly performance table", () => {
      // Go to Performance in Portfolio Summary
      cy.visit("/client/performance")
      cy.findByText(
        performancekeys.monthlyPerformanceTable.header.monthlyPerformance,
      )
        .scrollIntoView()
        .should("be.visible")
      // Select  wanted  Quarter/ITD
      cy.findByRole("button", {
        name: /Q2/i,
      }).click()
      // Monthly performance table section
      cy.findAllByText(
        performancekeys.monthlyPerformanceTable.header.additionsWithdrawals,
      )
        .eq(1)
        .scrollIntoView()
        .should("be.visible")
      cy.findAllByText(performancekeys.monthlyPerformanceTable.header.netChange)
        .eq(1)
        .should("be.visible")
      cy.findAllByText(
        performancekeys.monthlyPerformanceTable.header.performance,
      )
        .eq(2)
        .should("be.visible")
      cy.findByText(
        performancekeys.monthlyPerformanceTable.header.cumulPerformance,
      ).should("be.visible")
    })
  })

  context("Detailed Performance (Top Movers)", () => {
    it("should show the top movers - deals and the change", () => {
      // Go to Performance in Portfolio Summary
      cy.visit("/client/performance")
      // Go to Top Movers - Deals table
      cy.findByText(performancekeys.topMoverTable.header.topMoverDeals)
        .scrollIntoView()
        .should("be.visible")
      // Positive Change in performance
      // Negative change in performance
      cy.findByText(performancekeys.topMoverTable.header.change).should(
        "be.visible",
      )
      cy.get("ul[role='list']")
        .eq(1)
        .children()
        .should("have.lengthOf.greaterThan", 5)
      cy.findByText(performancekeys.labels.loadMore).should("be.visible")
      // Click on "load more" button
      for (let i = 0; i < 5; i++) {
        cy.findByRole("button", {
          name: performancekeys.labels.loadMore,
        }).click()
      }
      cy.get("ul[role='list']")
        .eq(1)
        .children()
        .should("have.lengthOf.greaterThan", 15)
      cy.findByText(performancekeys.labels.loadMore)
        .scrollIntoView()
        .should("be.visible")
    })
  })
})
