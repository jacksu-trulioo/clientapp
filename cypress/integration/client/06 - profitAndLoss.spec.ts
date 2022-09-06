describe("Profit & Loss", () => {
  let profitAndLossKeys
  let commonKeys

  before(() => {
    cy.loginClient()

    cy.fixture("../../public/locales/en/profitAndLoss").then((keys) => {
      profitAndLossKeys = keys
    })
    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })
  })

  context("Top widget", () => {
    it("show the net change and the drawdowns", () => {
      // Go to Profit Loss in Portfolio Summary
      cy.visit("/client/profit-and-loss")
      // Welcome text and Quarter/ITD  dates
      cy.findAllByText(profitAndLossKeys.heading).should("be.visible")
      cy.findAllByText(
        /An overview of realized and unrealized portfolio gains and losses from/i,
      ).should("be.visible")
      cy.findAllByText(
        /(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Sept|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)|(\b)(\d+([st|nd|rd|th]+)\b)|(19[7-9]\d|2\d{3})/,
      ).should("be.visible")
      cy.findAllByText(/USD/).should("be.visible")
      // Net Change and cumulative performance percentage
      cy.findByText(profitAndLossKeys.labels.netChange).should("be.visible")
      // positive net change
      // negative net change
      // maximum drawdown for the illiquid portfolio
      cy.findByText(profitAndLossKeys.drawDown.title).should("be.visible")
      cy.findByText(profitAndLossKeys.drawDown.description).should("be.visible")
      // maximum drawdown in the same time frame
      cy.findByText(profitAndLossKeys.indexDrwadown.title).should("be.visible")
      cy.findByText(profitAndLossKeys.indexDrwadown.description).should(
        "be.visible",
      )
    })
  })
  context("Table & Filters", () => {
    it("should be able to download the table file", () => {
      cy.visit("/client/profit-and-loss")
      // Click on download button
      cy.intercept("post", "/api/client/generate-excel-file").as("download")
      cy.findByRole("button", { name: commonKeys.button.download }).click()
      cy.wait("@download").its("response.statusCode").should("eq", 200)
    })

    it("show the asset class total table", () => {
      // Go to Profit Loss in Portfolio Summary
      cy.visit("/client/profit-and-loss")
      // Asset Class totals table
      cy.findByText(profitAndLossKeys.assetClassTotal.title).should(
        "be.visible",
      )
      cy.get("div[aria-label='Commission Expenses']").should("be.visible")
      // Select Quarter/ITD
      cy.findByText(/Sep 30/i).should("not.exist")
      cy.findByRole("button", {
        name: /Q3/i,
      }).click()
      cy.findByText(/Sep 30/i)
        .scrollIntoView()
        .should("be.visible")
      // Positive relative change
      // Negative relative change
    })
    it("show the investment asset classes table", () => {
      // Go to Profit Loss in Portfolio Summary
      cy.visit("/client/profit-and-loss")
      // Investment Asset Classes table
      cy.findByText(profitAndLossKeys.assetClassTotal.title).should(
        "be.visible",
      )
      cy.get("div[aria-label='Commission Expenses']").should("be.visible")
      // Select Quarter/ITD
      cy.findByRole("button", {
        name: commonKeys.client.quarters.ITD,
      }).click()
      // Positive relative change
      // Negative relative change
    })
  })
})
