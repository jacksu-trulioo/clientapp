describe("Total Investments", () => {
  let totalInvestmentKeys
  let investmentListingKeys
  let totalCommitmentKeys
  let investmentDetailKeys
  let commonKeys

  before(() => {
    cy.fixture("../../public/locales/en/totalInvestment").then((keys) => {
      totalInvestmentKeys = keys
    })

    cy.fixture("../../public/locales/en/investmentListing").then((keys) => {
      investmentListingKeys = keys
    })

    cy.fixture("../../public/locales/en/totalCommitment").then((keys) => {
      totalCommitmentKeys = keys
    })

    cy.fixture("../../public/locales/en/investmentDetail").then((keys) => {
      investmentDetailKeys = keys
    })

    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })

    cy.loginClient()
  })

  it("should show the total value table", () => {
    // Go to Total Investment Page
    cy.visit("/client/total-investments")
    cy.findAllByText(totalInvestmentKeys.page.title, { timeout: 10000 }).should(
      "be.visible",
    )
    cy.findByRole("grid", { name: "Recent Activity" }).should("be.visible")
    // Illiquid
    cy.findByText("Illiquid").should("be.visible")
    cy.findByText("Illiquid")
      .siblings()
      .invoke("text")
      .then((text) => {
        let num = text.replace(/ /g, "")
        expect(num).to.match(/^[$0-9,]*$/)
      })
    // Liquid
    cy.findByText("Liquid").should("be.visible")
    cy.findByText("Liquid")
      .siblings()
      .invoke("text")
      .then((text) => {
        let num = text.replace(/ /g, "")
        expect(num).to.match(/^[$0-9,]*$/)
      })
    // Cash
    cy.findByText("Cash").should("be.visible")
    cy.findByText("Cash")
      .siblings()
      .invoke("text")
      .then((text) => {
        let num = text.replace(/ /g, "")
        expect(num).to.match(/^[$0-9,]*$/)
      })
    // Cash in Transit
    cy.findByText("Cash In Transit").should("be.visible")
    cy.findByText("Cash In Transit")
      .siblings()
      .invoke("text")
      .then((text) => {
        let num = text.replace(/ /g, "")
        expect(num).to.match(/^[-$0-9,]*$/)
      })
  })

  it("should show the Investments & Holding periods, Sector Composition donut chart", () => {
    cy.intercept("POST", "/api/client/investments/total-investments").as(
      "totalInvestments",
    )
    cy.intercept(
      "GET",
      "/api/client/investments/total-investments-chart?langCode=en",
    ).as("totalInvestmentschart")
    // Go to Total Investment  Page
    cy.visit("/client/total-investments")

    cy.findAllByText(totalInvestmentKeys.page.title, { timeout: 10000 }).should(
      "be.visible",
    )
    // Total Investments
    cy.findByRole("group", { name: "totalInvestments", timeout: 10000 })
      .children()
      .eq(1)
      .should("be.visible")
    // Avg. Holding Period
    cy.findByRole("group", { name: "holdingPeriod" })
      .children()
      .eq(1)
      .should("be.visible")
    // Sector Composition of the portfolio
    cy.wait(2000)
    cy.get(".recharts-surface").should("be.visible")
    // On hovering on the donut chart
    cy.get(".recharts-sector").each((series) => {
      cy.wrap(series).trigger("mouseover", { force: true })
    })
    // Chart Index
    cy.wait("@totalInvestmentschart", { timeout: 10000 }).then(
      (interception) => {
        let res = interception.response
        res.body.pieChartData.forEach((data) => {
          cy.findByRole("heading", {
            name: data.name,
          }).should("be.visible")
        })
      },
    )
  })

  it("should show Invested locations", () => {
    // Go to Total Investment page
    cy.visit("/client/total-investments")
    cy.findAllByText(totalInvestmentKeys.page.title, { timeout: 10000 }).should(
      "be.visible",
    )

    // Your Investment locations
    let totalPercent = 0

    cy.findByRole("grid", { name: "investmentLocations", timeout: 20000 })
      .children()
      .each((region) => {
        cy.wrap(region).within(() => {
          cy.get("p")
            .eq(1)
            .invoke("text")
            .then((percent) => {
              let floatPercent = parseFloat(percent)
              totalPercent = totalPercent + floatPercent
            })
        })
      })
      .then(() => {
        expect(totalPercent).to.be.equal(100)
      })
  })

  it("show Investment table", () => {
    // Go to Total Investment page
    cy.visit("/client/total-investments")
    cy.findAllByText(totalInvestmentKeys.page.title, { timeout: 10000 }).should(
      "be.visible",
    )

    // Your Investment Table
    cy.findByRole("group", { name: "SPV Table Header" })
      .children()
      .then((headers) => {
        let {
          investmentName,
          dealName,
          spv,
          investmentDate,
          investmentAmount,
          marketValue,
          performanceContribution,
        } = totalInvestmentKeys.yourInvestments.table.tableHeader

        let headersArr = Cypress.$.makeArray(headers).map((el) => el.innerText)
        expect(headersArr).deep.equal([
          investmentName,
          dealName,
          spv,
          investmentDate,
          investmentAmount,
          marketValue,
          performanceContribution,
        ])

        // List of deals
        cy.findAllByRole("row", { name: /Deal Row \d+/i })
          .eq(0)
          .within(() => {
            cy.findAllByRole("cell").should(
              "have.length",
              headersArr.length - 1,
            )
          })

        // SPV Header and SPV Name inside table should match
        cy.findAllByRole("group", { name: "SPV Box" })
          .eq(0)
          .findByRole("heading", { name: "SPV Name Header" })
          .invoke("text")
          .then((name) => {
            cy.findAllByRole("cell", { name: "SPV" })
              .eq(0)
              .should("contain.text", name)
          })
      })
  })

  it("should open deal details page", () => {
    // Go to Total Investments page
    cy.visit("/client/total-investments")
    cy.findAllByText(totalInvestmentKeys.page.title, { timeout: 10000 }).should(
      "be.visible",
    )

    // Go to investment table
    cy.findAllByRole("cell", { name: "Deal Name" })
      .eq(0)
      .invoke("text")
      .then((deal) => {
        // Click on any deal
        cy.findAllByRole("cell", { name: "Deal Name" }).eq(0).click()
        cy.findByRole("heading", {
          name: deal,
          level: 4,
          timeout: 10000,
        }).should("be.visible")
      })
  })

  it("should view Investment listing Page", () => {
    // Go to Total investment page
    cy.visit("/client/total-investments")
    cy.findAllByText(totalInvestmentKeys.page.title, { timeout: 10000 }).should(
      "be.visible",
    )

    // Go to the end of the page
    // Click on "View all Investments" button
    let { viewAllInvestment } = totalInvestmentKeys.yourInvestments.button
    let { heading } = investmentListingKeys
    cy.findByRole("button", { name: viewAllInvestment })
      .scrollIntoView()
      .click()
    cy.findByRole("heading", {
      name: heading,
      level: 4,
      timeout: 10000,
    }).should("be.visible")
  })

  it('should filter invested deals based on the "sorting by -Region" and "Investment Vehicle" Categories', () => {
    // Go to Total Investment
    cy.visit("/client/total-investments")
    cy.findAllByText(totalInvestmentKeys.page.title, { timeout: 10000 }).should(
      "be.visible",
    )
    // Go to Your Investments table
    // Click on Sort & Filter button
    cy.findByRole("button", { name: commonKeys.client.sortByFilter }).click()
    // Select region value in "sort by"
    cy.findByRole("radio", {
      name: commonKeys.filters.filterTypes.sort.options.region,
    })
      .parent()
      .click()
    // Select any required investment vehicle
    cy.findByRole("checkbox", { name: "AGPE" }).parent().click()
    // Click on "Apply Changes"
    cy.findByRole("button", {
      name: commonKeys.filters.button.applyChange,
    }).click()
    cy.findAllByRole("button", { name: "filterChip", timeout: 10000 }).should(
      "contain.text",
      "AGPE",
    )
    cy.findAllByRole("heading", { name: "SPV Name Header" }).contains("Asia")
    cy.findAllByRole("cell", { name: "SPV" }).each((spv) => {
      cy.wrap(spv).should("have.text", "AGPE")
    })
  })

  it('should filter invested deals based on the  "Order" and filter "region" Categories', () => {
    // Go to Total Investment
    cy.visit("/client/total-investments")
    cy.findAllByText(totalInvestmentKeys.page.title, { timeout: 10000 }).should(
      "be.visible",
    )

    // Go to Your Investments table
    // Click on Sort & Filter button
    cy.findByRole("button", { name: commonKeys.client.sortByFilter }).click()
    // Select any value in "order by"
    cy.findByRole("radio", {
      name: commonKeys.filters.filterTypes.order.options.descending,
    })
      .parent()
      .click()
    // Select any required region/location
    cy.findByRole("checkbox", {
      name: commonKeys.filters.filterTypes.region.options.asia,
    })
      .parent()
      .click()
    // Click on "Apply Changes"
    cy.findByRole("button", {
      name: commonKeys.filters.button.applyChange,
    }).click()
    cy.findAllByRole("heading", { name: "SPV Name Header", timeout: 10000 })
      .eq(0)
      .should("have.text", "PECO")
    cy.findAllByRole("group", { name: "SPV Box" })
      .eq(0)
      .findAllByRole("cell", { name: "Deal Name" })
      .then((dealName) => {
        let dealsArr = Cypress.$.makeArray(dealName).map((el) => el.innerText)
        let deals = [
          "PECO - Class AZ Baby Jasper Max Ltd",
          "PECO - Class AM Saehwa Intl Machinery Co.",
          "PECO - Class AL Triplex Intel Bioscience",
        ]
        expect(dealsArr).to.be.deep.eq(deals)
      })
  })

  it("should clear the applied filters", () => {
    // Go to total investment page
    cy.visit("/client/total-investments")
    cy.findAllByText(totalInvestmentKeys.page.title, { timeout: 10000 }).should(
      "be.visible",
    )
    // Click on "filters" button above the investment table
    // select required filters and click on "apply changes" button
    cy.filterBy({ checkbox: [/Access/i, /AGPE/i, /AGRECO/i, /Europe/i] })
    cy.findAllByRole("button", { name: "filterChip", timeout: 10000 }).should(
      "have.length",
      4,
    )
    // Click on "clear all filters" tab next to applied filter chips
    cy.findByRole("button", {
      name: new RegExp(commonKeys.filters.button.clearAllFilter, "i"),
    }).click()
    cy.findAllByRole("button", { name: "filterChip", timeout: 10000 }).should(
      "not.exist",
    )
    // Click on "clear" in the header of the filter section and click on "apply changes"
    cy.filterBy({ checkbox: [/Access/i, /AGPE/i, /AGRECO/i, /Europe/i] })
    cy.findAllByRole("button", { name: "filterChip", timeout: 10000 }).should(
      "have.length",
      4,
    )
    cy.findByRole("button", { name: commonKeys.client.sortByFilter }).click()
    cy.findByRole("button", { name: /Reset/i }).click()
    cy.findAllByRole("button", { name: "filterChip", timeout: 10000 }).should(
      "not.exist",
    )
  })

  context("Investment Listing", () => {
    it("should be able to download the table file", () => {
      cy.visit("/client/total-investments")
      // Click on download button
      cy.intercept("post", "/api/client/generate-excel-file").as("download")
      cy.findByRole("button", { name: commonKeys.button.download }).click()
      cy.wait("@download").its("response.statusCode").should("eq", 200)
      // Use sort by and click download button
      cy.findByRole("button", { name: commonKeys.client.sortByFilter }).click()
      cy.findByRole("checkbox", { name: "AGPE" }).parent().click()
      cy.findByRole("button", {
        name: commonKeys.filters.button.applyChange,
      }).click()
      // Click on myselection
      cy.findByRole("button", { name: commonKeys.button.download }).click()
      cy.findByRole("button", {
        name: commonKeys.client.downloadPreference.preferences.mySelection,
      }).click()
      cy.wait("@download").its("response.statusCode").should("eq", 200)
      // Click on All data
      cy.findByRole("button", { name: commonKeys.button.download }).click()
      cy.findByRole("button", {
        name: commonKeys.client.downloadPreference.preferences.allData,
      }).click()
      cy.wait("@download").its("response.statusCode").should("eq", 200)
    })

    it("should be able to download the table file in ivestment listing", () => {
      cy.visit("/client/total-investments")
      cy.findByRole("button", {
        name: totalInvestmentKeys.yourInvestments.button.viewAllInvestment,
      }).click()
      // Click on download button
      cy.intercept("post", "/api/client/generate-excel-file").as("download")
      cy.findByRole("button", { name: commonKeys.button.download }).click()
      cy.wait("@download").its("response.statusCode").should("eq", 200)
      // Use sort by and click download button
      cy.findByRole("button", { name: commonKeys.client.sortByFilter }).click()
      cy.findByRole("checkbox", { name: "Duna" }).parent().click()
      cy.findByRole("button", {
        name: commonKeys.filters.button.applyChange,
      }).click()
      // Click on myselection
      cy.findByRole("button", { name: commonKeys.button.download }).click()
      cy.findByRole("button", {
        name: commonKeys.client.downloadPreference.preferences.mySelection,
      }).click()
      cy.wait("@download").its("response.statusCode").should("eq", 200)
      // Click on All data
      cy.findByRole("button", { name: commonKeys.button.download }).click()
      cy.findByRole("button", {
        name: commonKeys.client.downloadPreference.preferences.allData,
      }).click()
      cy.wait("@download").its("response.statusCode").should("eq", 200)
    })

    it("should open the Investment Listing page from Total Investment page", () => {
      // Go to Total Investment page
      cy.visit("/client/total-investments")
      cy.findAllByText(totalInvestmentKeys.page.title, {
        timeout: 10000,
      }).should("be.visible")

      // Click on "View all investments" button
      cy.findByRole("button", {
        name: totalInvestmentKeys.yourInvestments.button.viewAllInvestment,
        timeout: 10000,
      }).click()
      cy.findByRole("heading", {
        name: investmentListingKeys.heading,
        timeout: 10000,
      }).should("be.visible")
    })

    it("should show 'your investments' table", () => {
      // Go to Total Investment
      cy.visit("/client/total-investments")
      cy.findAllByText(totalInvestmentKeys.page.title, {
        timeout: 10000,
      }).should("be.visible")

      // Click on "view all investments" button at the bottom of the page
      cy.findByRole("button", {
        name: totalInvestmentKeys.yourInvestments.button.viewAllInvestment,
      }).click()

      cy.wait(2000)
      // Go to "Your Investments" table
      cy.findAllByRole("heading", {
        name: "SPV Name Header",
        timeout: 10000,
      }).should("be.visible")

      cy.findAllByRole("group", { name: "Deal Detail" })
        .eq(0)
        .findAllByRole("grid")
        .children()
        .should("be.visible")
        .should("have.length", 14)
    })

    it("should open the deal details page by clicking on a deal name in the investment listing page coming from Total Investment page", () => {
      // Go to Total Investment
      // Click on "view all investments" button at the bottom of the page
      // Click on any deal name from the list
      cy.findAllByRole("contentinfo", { name: "Deal Name" })
        .eq(0)
        .then((deal) => {
          cy.wrap(deal)
            .invoke("text")
            .then((dealName) => {
              cy.wrap(deal).click()
              cy.findByRole("heading", {
                name: dealName,
                level: 4,
                timeout: 20000,
              }).should("be.visible")
            })
        })
    })

    it("should open the Investment Listing page from Total Commitments page", () => {
      // Go to Total Commitments page
      cy.visit("/client/total-commitments")
      cy.findByRole("heading", {
        name: totalCommitmentKeys.heading,
        level: 2,
        timeout: 10000,
      }).should("be.visible")

      // Go to "Your Commitments" table
      cy.findAllByRole("group", { name: "Deal Box" }).should(
        "have.length.above",
        1,
      )

      cy.findAllByRole("grid")
        .should("not.be.null")
        .each((grid) => {
          cy.wrap(grid).children().eq(1).should("not.be.null")
        })

      cy.findAllByRole("link", { name: "Deal Name" }).should("be.visible")

      // Click on "view related Investments"
      cy.findAllByRole("link", { name: "Deal Name" })
        .eq(0)
        .invoke("text")
        .then((dealName) => {
          let wordToFind = dealName.match(/(?<=\bTFO\s)(\w+)/g)
          cy.findAllByRole("link", { name: "View Related Investments" })
            .eq(0)
            .click()
          cy.wait(2000)
          cy.findAllByRole("contentinfo", { name: "Deal Name" })
            .eq(0)
            .should("contain.text", wordToFind)
        })
    })

    it("should show the date range and data values as per the quarter / ITD selected", () => {
      cy.intercept("POST", "/api/client/investments/investment-listing").as(
        "investmentListing",
      )
      // Go to Investment listing page
      cy.visit("/client/total-investments/investment-listing")
      cy.findByRole("heading", {
        name: investmentListingKeys.heading,
        timeout: 20000,
      }).should("be.visible")

      // Click on any quarter
      cy.wait("@investmentListing").then((interception) => {
        let res = interception.response
        let groupByDeals = res.body.groupByDeals

        groupByDeals.forEach(({ timeperiod, deals }) => {
          let quarter = timeperiod.quarter
          let regExp = new RegExp(`Q${quarter}`, "i")
          cy.findByRole("button", { name: regExp }).click()
          deals[0].investments.forEach((dealDetails, index) => {
            cy.findAllByRole("group", { name: "Deal Box" })
              .eq(index)
              .scrollIntoView()
              .findByText(dealDetails.name, { timeout: 10000 })
              .should("be.visible")
          })
        })
      })
    })

    it('should filter invested deals based on the "sorting by -Region" and "Investment Vehicle" Categories', () => {
      cy.intercept("POST", "/api/client/investments/investment-listing").as(
        "investmentListing",
      )

      // Go to Investment Listing Page
      cy.visit("/client/total-investments/investment-listing")
      cy.findByRole("heading", {
        name: investmentListingKeys.heading,
        timeout: 10000,
      }).should("be.visible")

      cy.wait("@investmentListing")

      // Click on Sort & Filter button
      cy.findByRole("button", { name: commonKeys.client.sortByFilter }).click()

      // Select region value in "sort by"
      cy.findByRole("radio", {
        name: commonKeys.filters.filterTypes.sort.options.region,
      })
        .parent()
        .click()

      // Select any required investment vehicle
      cy.findByRole("checkbox", { name: /Access/i })
        .parent()
        .click()

      // Click on "Apply Changes"
      cy.findByRole("button", { name: commonKeys.filters.button.applyChange })
        .parent()
        .click()

      cy.findAllByRole("heading", {
        name: /SPV Name Header/i,
        timeout: 10000,
      })
        .eq(0)
        .should("have.text", "Asia")

      cy.findAllByRole("contentinfo", {
        name: "Deal Name",
      }).each((deal) => {
        cy.wrap(deal).should("contain.text", "Access")
      })
    })

    it('should filter invested deals based on the  "Order" and filter "region" Categories', () => {
      cy.intercept("POST", "/api/client/investments/investment-listing").as(
        "investmentListing",
      )

      // Go to Investment Listing Page
      cy.visit("/client/total-investments/investment-listing")
      cy.findByRole("heading", {
        name: investmentListingKeys.heading,
        timeout: 10000,
      }).should("be.visible")

      cy.wait("@investmentListing")

      // Click on Sort & Filter button
      // Select  any value in "order by"
      // Select any required region/location
      // Click on "Apply Changes"
      cy.filterBy({
        radio: [commonKeys.filters.filterTypes.order.options.descending],
        checkbox: [commonKeys.filters.filterTypes.region.options.asia],
      })

      cy.wait("@investmentListing")

      cy.findAllByRole("heading", { name: "SPV Name Header" })
        .eq(0)
        .should("have.text", "PECO")
    })

    it("should clear the applied filters", () => {
      cy.intercept("POST", "/api/client/investments/investment-listing").as(
        "investmentListing",
      )
      // Go to Investment Listing page
      cy.visit("/client/total-investments/investment-listing")
      cy.findByRole("heading", {
        name: investmentListingKeys.heading,
        timeout: 10000,
      }).should("be.visible")
      cy.wait("@investmentListing")
      // Click on "filters" button above the investment table
      // select required filters and click on "apply changes" button
      cy.filterBy({ checkbox: [/Access/i, /AGPE/i, /AGRECO/i, /Europe/i] })
      cy.findAllByRole("button", { name: "filterChip", timeout: 10000 }).should(
        "have.length",
        4,
      )
      // Click on "clear all filters" tab next to applied filter chips
      cy.findByRole("button", {
        name: /clear all filters/i,
      }).click()
      cy.findAllByRole("button", { name: "filterChip", timeout: 10000 }).should(
        "not.exist",
      )
      // Click on "clear" in the header of the filter section and click on "apply changes"
      cy.filterBy({ checkbox: [/Access/i, /AGPE/i, /AGRECO/i, /Europe/i] })
      cy.findAllByRole("button", { name: "filterChip", timeout: 10000 }).should(
        "have.length",
        4,
      )
      cy.findByRole("button", { name: commonKeys.client.sortByFilter }).click()
      cy.findByRole("button", { name: commonKeys.filters.button.reset }).click()
      cy.findAllByRole("button", { name: "filterChip", timeout: 10000 }).should(
        "not.exist",
      )
    })
  })

  context("Investment Details", () => {
    it("should open the deal details page by clicking on a deal name in the investment listing page coming from Total Investment page", () => {
      // Go to Total Investment
      cy.visit("/client/total-investments")
      cy.findAllByText(totalInvestmentKeys.page.title, {
        timeout: 10000,
      }).should("be.visible")
      // Click on "view all investments" button at the bottom of the page
      cy.findByRole("button", {
        name: totalInvestmentKeys.yourInvestments.button.viewAllInvestment,
        timeout: 10000,
      }).click()
      // Click on any deal name from the list
      cy.findAllByRole("contentinfo", { name: "Deal Name", timeout: 10000 })
        .eq(0)
        .then((deal) => {
          cy.wrap(deal)
            .invoke("text")
            .then((dealName) => {
              cy.wrap(deal).click()
              cy.findByRole("heading", {
                name: dealName,
                level: 4,
                timeout: 20000,
              }).should("be.visible")
            })
        })
    })

    it("should open the deal details page by clicking on a deal name in the investment listing page coming from Total Commitments page", () => {
      // Go to Total commitment page
      cy.visit("/client/total-commitments")
      cy.findByRole("heading", {
        name: totalCommitmentKeys.heading,
        level: 2,
        timeout: 10000,
      }).should("be.visible")
      // Click on "view related investments" button
      cy.findAllByRole("link", { name: "Deal Name" })
        .eq(0)
        .invoke("text")
        .then((dealName) => {
          let wordToFind = dealName.match(/(?<=\bTFO\s)(\w+)/g)
          cy.findAllByRole("link", { name: "View Related Investments" })
            .eq(0)
            .click()
          cy.wait(2000)
          cy.findAllByRole("contentinfo", { name: "Deal Name" })
            .eq(0)
            .should("contain.text", wordToFind)
        })
      // Click on any deal name
      cy.findAllByRole("contentinfo", { name: "Deal Name", timeout: 10000 })
        .eq(0)
        .then((deal) => {
          cy.wrap(deal)
            .invoke("text")
            .then((dealName) => {
              cy.wrap(deal).click()
              cy.findByRole("heading", {
                name: dealName,
                level: 4,
                timeout: 10000,
              }).should("be.visible")
            })
        })
    })

    it("should show the deal properties", () => {
      cy.intercept("POST", "/api/client/investments/investment-listing").as(
        "investmentListing",
      )
      // Go to Investment Listing page
      cy.visit("/client/total-investments/investment-listing")
      cy.findByRole("heading", {
        name: investmentListingKeys.heading,
        timeout: 10000,
      }).should("be.visible")
      cy.wait("@investmentListing")
      // Click on any deal name
      cy.findAllByRole("contentinfo", { name: "Deal Name", timeout: 10000 })
        .eq(0)
        .then((deal) => {
          cy.wrap(deal)
            .invoke("text")
            .then((dealName) => {
              cy.wrap(deal).click()
              cy.findByRole("heading", {
                name: dealName,
                level: 4,
                timeout: 20000,
              }).should("be.visible")
            })
        })
      // Deals properties
      cy.findByRole("group", { name: "Initial Investment Date" })
        .children()
        .eq(1)
        .should("be.visible")
      cy.findByRole("group", { name: "Price Date" })
        .children()
        .eq(1)
        .should("be.visible")
      cy.findByRole("group", { name: "Holding Period" })
        .children()
        .eq(1)
        .should("be.visible")
      cy.findByRole("group", { name: "Sponsor/Partner" })
        .children()
        .eq(1)
        .should("be.visible")
      cy.findByRole("group", { name: "Strategy" })
        .children()
        .eq(1)
        .should("be.visible")
    })

    it("should show the deal details table", () => {
      // Go to Investment Listing page
      // Click on any deal name
      // Deal detail table
      cy.findAllByRole("grid").then((header) => {
        let {
          bookValue,
          marketValue,
          initialBookValue,
          shares,
          performanceContribution,
          multiple,
          netChange,
          valueStart,
          valueEnd,
          returnOfCapital,
          gainLoss,
          income,
        } = investmentDetailKeys.investmentTable.tableHeader
        let headerArr = Cypress.$.makeArray(header).map((el) =>
          el.childNodes[0].textContent.replace(/^\s+/g, ""),
        )
        expect(headerArr).deep.equal([
          bookValue,
          marketValue,
          initialBookValue,
          shares,
          performanceContribution,
          multiple,
          netChange,
          valueStart,
          valueEnd,
          returnOfCapital,
          gainLoss,
          income,
        ])
      })
      // On selecting the required quarter
      let quarterTab = [
        { name: "Q1", date: "Mar 31" },
        { name: "Q2", date: "Jun 30" },
        { name: "Q3", date: "Aug 31" },
        { name: "Q4", date: "Dec 31" },
      ]

      quarterTab.forEach((quarter) => {
        let regExp = new RegExp(`${quarter.name}`, "i")
        cy.findByRole("button", { name: regExp }).click()
        cy.findByRole("contentinfo", { name: "Quarter Date" }).should(
          "contain.text",
          quarter.date,
        )
      })
    })

    it("should show information about the invested region and relevant images", () => {
      // Go to Total investment and click on "view all investment" button
      // Click on any deal
      // Go to region
      cy.findByRole("contentinfo", { name: "Region" }).should("be.visible")
      cy.findByRole("contentinfo", { name: "Description" }).should("be.visible")
      // Click on any image in under Gallery section // TODO: Pending from TFO side to resolve the S3 links
    })
  })
})
