describe("Cashflow", () => {
  let cashFlowKeys
  let commonKeys

  before(() => {
    cy.loginClient()

    cy.fixture("../../public/locales/en/cashflow").then((keys) => {
      cashFlowKeys = keys
    })
    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })
  })

  it("should be able to download the table file", () => {
    cy.visit("/client/cash-flows")
    // Click on download button
    cy.intercept("post", "/api/client/generate-excel-file").as("download")
    cy.findByRole("button", { name: commonKeys.button.download }).click()
    cy.wait("@download").its("response.statusCode").should("eq", 200)
    // Check the region
    cy.findAllByRole("button", {
      name: /TFO */i,
    })
      .eq(2)
      .click()
    cy.findAllByRole("region", { name: /TFO */i }).should("be.visible")
    cy.findByRole("columnheader", { name: "Distributions" })
      .scrollIntoView()
      .should("be.visible")
  })

  it("should show the summary of actual YTD and ITD distributions and capital calls", () => {
    // Go to Cashflows
    cy.visit("/client/cash-flows")
    // Summary of actual YTD and ITD distributions and capital calls
    cy.findAllByText(cashFlowKeys.heading)
    cy.findByText(cashFlowKeys.description)
    cy.findByRole("heading", {
      name: cashFlowKeys.actualized.title,
    })
    cy.findAllByText(/\d+ YTD Distribution/i)
    cy.findAllByText(/ITD Distribution/i)
    cy.findAllByText(/\d+ YTD Capital Call/i)
    cy.findAllByText(/ITD Capital Call/i)
  })

  it("should show the BIGGEST INVESTMENTS VEHICLE DISTRIBUTIONS table as per the quarters", () => {
    // Go to cashflows
    cy.visit("/client/cash-flows")
    // Go to "BIGGEST INVESTMENTS VEHICLE DISTRIBUTIONS" table
    cy.findByRole("heading", {
      name: cashFlowKeys.investmentVehicle.title,
    }).should("be.visible")
    cy.findByRole("heading", {
      name: /Q3 - \d+/i,
    })
      .scrollIntoView()
      .should("be.visible")
    cy.findAllByRole("heading", {
      name: cashFlowKeys.investmentVehicle.tableHeader.totalAmount,
    })
      .eq(0)
      .scrollIntoView()
      .should("be.visible")
    cy.findAllByRole("heading", {
      name: cashFlowKeys.investmentVehicle.tableHeader.spv,
    })
      .eq(0)
      .should("be.visible")
    cy.findByRole("heading", {
      name: /Q2 - \d+/i,
    })
      .scrollIntoView()
      .should("be.visible")

    cy.findAllByRole("heading", {
      name: cashFlowKeys.investmentVehicle.tableHeader.totalAmount,
    })
      .eq(1)
      .should("be.visible")
    cy.findAllByRole("heading", {
      name: cashFlowKeys.investmentVehicle.tableHeader.spv,
    })
      .eq(1)
      .should("be.visible")
    cy.findByRole("heading", {
      name: /Q1 - \d+/i,
    }).should("be.visible")
    cy.findAllByRole("heading", {
      name: cashFlowKeys.investmentVehicle.tableHeader.totalAmount,
    })
      .eq(2)
      .should("be.visible")
    cy.findAllByRole("heading", {
      name: cashFlowKeys.investmentVehicle.tableHeader.spv,
    })
      .eq(2)
      .should("be.visible")
    cy.findByRole("heading", {
      name: /Q4 - \d+/i,
    })
      .scrollIntoView()
      .should("be.visible")
    cy.findAllByRole("heading", {
      name: cashFlowKeys.investmentVehicle.tableHeader.totalAmount,
    })
      .eq(3)
      .should("be.visible")
    cy.findAllByRole("heading", {
      name: cashFlowKeys.investmentVehicle.tableHeader.spv,
    })
      .eq(3)
      .should("be.visible")
    cy.findAllByRole("grid")
      .should("not.be.null")
      .each((grid) => {
        cy.wrap(grid).children().eq(1).should("not.be.null")
      })
  })

  it('should sort by "order"', () => {
    // Go to cashflow page
    cy.visit("/client/cash-flows")
    // Go to "BIGGEST INVESTMENTS VEHICLE DISTRIBUTIONS" table
    cy.findByRole("heading", {
      name: cashFlowKeys.investmentVehicle.title,
    }).should("be.visible")
    // Click on "sort by" button above the table
    cy.findAllByText(/Sort by/i)
      .eq(0)
      .click()
    // Click on any of the option from "order" category
    cy.findByText(
      commonKeys.filters.filterTypes.order.options.descending,
    ).click()
    cy.findByRole("button", {
      name: commonKeys.filters.button.applyChange,
    }).click()
    cy.findByRole("heading", {
      name: /Q2 - \d+/i,
    }).should("be.visible")
  })

  it("should clear the applied filters", () => {
    // Go to cashflow page
    cy.visit("/client/cash-flows")
    // Click on "sort by" button above the cashflow table
    cy.findAllByText(/Sort by/i)
      .eq(0)
      .click()
    // select required order and click on "apply changes" button
    cy.findByText(
      commonKeys.filters.filterTypes.order.options.descending,
    ).click()
    cy.findByRole("button", {
      name: commonKeys.filters.button.applyChange,
    }).click()
    // Click on "Reset" in the header of the filter section
    cy.findAllByText(/Sort by/i)
      .eq(0)
      .click()
    cy.findByRole("button", {
      name: /Reset/i,
    }).click()
    cy.findByRole("heading", {
      name: /Q4 - \d+/i,
    })
      .scrollIntoView()
      .should("be.visible")
  })
})
