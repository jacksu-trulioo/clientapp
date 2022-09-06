describe("Total Commitments", () => {
  let totalCommitmentKeys
  let investmentListingKeys
  let commonKeys
  let investmentDetailKeys

  before(() => {
    cy.loginClient()
    cy.fixture("../../public/locales/en/totalCommitment").then((keys) => {
      totalCommitmentKeys = keys
    })
    cy.fixture("../../public/locales/en/investmentListing").then((keys) => {
      investmentListingKeys = keys
    })
    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })
    cy.fixture("../../public/locales/en/investmentDetail").then((keys) => {
      investmentDetailKeys = keys
    })
  })

  it("should be able to download the table file", () => {
    cy.visit("/client/total-commitments")
    // Click on download button
    cy.intercept("post", "/api/client/generate-excel-file").as("download")
    cy.findByRole("button", { name: commonKeys.button.download }).click()
    cy.wait("@download").its("response.statusCode").should("eq", 200)
    // Use sort by and click download button
    cy.findByText(commonKeys.client.sortByFilter).click()
    cy.findByText(/50% - 99%/).click()
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

  it("should open the deal details page by clicking on a deal name in the investment listing page coming from Total Commitments page", () => {
    // Go to Total Commitments
    cy.visit("/client/total-commitments")
    // Click on "view related investments" button at the bottom of the asset fund/ SPV table
    cy.findAllByText(totalCommitmentKeys.commitmentsList.tableBody.button)
      .eq(0)
      .click()
    cy.findByRole("heading", {
      name: investmentListingKeys.heading,
    }).should("be.visible")
    cy.findByRole("button", {
      name: commonKeys.button.back,
    }).click()
    cy.findByRole("heading", {
      name: totalCommitmentKeys.heading,
    }).should("be.visible")
    // Click on any deal name from the list
    cy.findAllByRole("link", {
      name: totalCommitmentKeys.commitmentsList.tableBody.button,
    })
      .eq(0)
      .click()
    cy.findByRole("contentinfo", {
      name: "Deal Name",
    }).click()
    cy.location("pathname").should("match", /investment-detail/)
    cy.wait(3000)
    cy.findAllByText(investmentDetailKeys.page.title).should("be.visible")
  })

  it("should open the Investment Listing page from Total Commitments page", () => {
    // Go to Total Commitments page
    cy.visit("/client/total-commitments")
    // Go to "Your Commitments" table
    cy.findAllByText(totalCommitmentKeys.commitmentsList.tableBody.button)
      .eq(9)
      .click() // Click on "view related Investments"
    cy.findByRole("heading", {
      name: investmentListingKeys.heading,
    }).should("be.visible")
    cy.findByRole("button", {
      name: commonKeys.button.back,
    }).click()
    cy.findByRole("heading", {
      name: investmentListingKeys.heading,
    }).should("be.visible")
  })

  it("should show the committed and uncalled amount", () => {
    // Go to total commitment page
    cy.visit("/client/total-commitments")
    // Welcome text date
    cy.findByRole("heading", {
      name: totalCommitmentKeys.heading,
    }).should("be.visible")
    cy.findByText(
      /An overview of commitments to your illiquid programs as of/i,
    ).should("be.visible")
    // Total Committed and Total Uncalled amount
    cy.findByRole("heading", {
      name: totalCommitmentKeys.totalCommitted,
    }).should("be.visible")
    cy.findByRole("heading", {
      name: totalCommitmentKeys.totalUncalled,
    }).should("be.visible")
    cy.findAllByRole("group", {
      name: "totalCommitted",
    })
      .children()
      .eq(1)
      .invoke("text")
      .then((text) => {
        let num = text.replace(/ /g, "")
        expect(num).to.match(/^[$0-9,]*$/)
      })
    cy.findAllByRole("group", {
      name: "totalUncalled",
    })
      .children()
      .eq(1)
      .invoke("text")
      .then((text) => {
        let num = text.replace(/ /g, "")
        expect(num).to.match(/^[$0-9,]*$/)
      })
  })

  it("should show the commitments list table", () => {
    // Go to Total Commitments page
    cy.visit("/client/total-commitments")
    // Go to "Commitments list" table
    cy.findByText(totalCommitmentKeys.commitmentsList.title, {
      timeout: 10000,
    }).should("be.visible")
    // SPV Name and deployed percent
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
  })

  it("should be able to filter data by the percent deployed", () => {
    // Go to Total commitment page
    cy.visit("/client/total-commitments")
    // click on "sort & filter" button
    cy.findByText(commonKeys.client.sortByFilter).click()
    // select the "order" you wish the list to be organized and the "% deployed"
    cy.findByText(
      commonKeys.filters.filterTypes.order.options.descending,
    ).click()
    cy.findByText(/50% - 99%/).click()
    cy.findByRole("button", {
      name: commonKeys.filters.button.applyChange,
    }).click()
    cy.findByText(/50% - 99%/).should("be.visible")
  })

  it("should clear the applied filters", () => {
    // Go to total commitment page
    // Click on "sort & filters" button above the commitment table
    cy.findByText(commonKeys.client.sortByFilter).click()
    // select required filters and click on "apply changes" button
    cy.findByText(/0% - 49%/).click()
    cy.findByRole("button", {
      name: commonKeys.filters.button.applyChange,
    }).click()
    // Click on "clear all filters" tab next to applied filter chips
    cy.findByText(commonKeys.filters.button.clearAllFilter).click()
    // Click on "clear" in the header of the filter section and click on "apply changes"
    cy.findByText(commonKeys.client.sortByFilter).click()
    cy.findByText(/100%/).click()
    cy.findByRole("button", {
      name: commonKeys.filters.button.applyChange,
    }).click()
    cy.findByText(/100%/).should("be.visible")
    cy.findByText(commonKeys.client.sortByFilter).click()
    cy.findByRole("button", {
      name: /Reset/,
    }).click()
    cy.findAllByText(/100%/).should("not.exist")
  })
})
