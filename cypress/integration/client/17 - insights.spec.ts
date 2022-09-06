describe("Insights", () => {
  let insightskeys
  let commonKeys

  before(() => {
    cy.loginClient()

    cy.fixture("../../public/locales/en/insights").then((keys) => {
      insightskeys = keys
    })
    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })
  })

  context("Insights Landing page", () => {
    it("should open insights page", () => {
      cy.visit("/client")
      // open insights from sidenav
      cy.findByRole("button", {
        name: /Insights/i,
      }).click()
      cy.location("pathname", { timeout: 4000 }).should("match", /insights/)
      cy.findByText(insightskeys.page.index.title).should("be.visible")
      cy.findByText(insightskeys.page.index.subheading).should("be.visible")
      // show a summary of the market
      cy.findAllByRole("grid", { name: /Indices/i }).within(() => {
        cy.findAllByRole("gridcell").should("be.visible")
      })
      cy.findAllByRole("grid", { name: /Stocks & Bonds/i }).within(() => {
        cy.findAllByRole("gridcell").should("be.visible")
      })
    })

    it("should show highlight section", () => {
      // 1st card should not show left arrow
      cy.findByRole("contentinfo", { name: "highlightsContent" }).should(
        "be.visible",
      )
      cy.findByRole("slider", { name: "highlightsSlider" })
        .get(".slick-prev")
        .should("have.class", "slick-disabled")
      cy.findByRole("slider", { name: "highlightsSlider" })
        .get(".slick-next")
        .click()
      cy.wait(1000)
      // In between - both the sides should show the arrows
      cy.findByRole("contentinfo", { name: "highlightsContent" }).should(
        "be.visible",
      )
      cy.findByRole("slider", { name: "highlightsSlider" })
        .get(".slick-prev")
        .should("be.visible")
      cy.findByRole("slider", { name: "highlightsSlider" })
        .get(".slick-next")
        .should("be.visible")
      // last card should not show right arrow
      for (let i = 0; i < 13; i++) {
        cy.findByRole("slider", { name: "highlightsSlider" })
          .get(".slick-next")
          .click({ timeout: 2000 })
      }
      cy.wait(2000)
      cy.findByRole("slider", { name: "highlightsSlider" })
        .get(".slick-prev")
        .should("be.visible")
      cy.findByRole("contentinfo", { name: "highlightsContent" }).should(
        "be.visible",
      )
      cy.findByRole("slider", { name: "highlightsSlider" })
        .get(".slick-next")
        .should("have.class", "slick-disabled")
    })

    it("should show the article page", () => {
      // Click on any article card shown
      cy.findAllByRole("article").eq(0).click()
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
      cy.findByRole("button", { name: commonKeys.button.back }).click()
    })

    it("should open market simplified and market archive", () => {
      // Click on market simplified button
      cy.findByRole("button", {
        name: "View Markets Simplified",
      }).click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /markets-simplified/,
      )
      cy.findByText(/Markets Simplified:/i).should("be.visible")
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.wait(2000)
      // Click on market archive button
      cy.findByRole("button", {
        name: "View Markets Archive",
      }).click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /markets-archive/,
      )
      cy.findByRole("heading", {
        name: insightskeys.page.marketArchive.heading,
      }).should("be.visible")
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.wait(2000)
    })
  })

  context("Market Simplified", () => {
    it("should show highlight section", () => {
      cy.visit("/client")
      cy.findByRole("button", {
        name: /Insights/i,
      }).click()
      cy.location("pathname", { timeout: 4000 }).should("match", /insights/)
      cy.findByText(insightskeys.page.index.title).should("be.visible")
      cy.findByRole("button", {
        name: "View Markets Simplified",
      }).click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /markets-simplified/,
      )
      cy.findByText(/Markets Simplified:/i).should("be.visible")
      // 1st card should not show left arrow
      cy.findAllByRole("contentinfo", { name: "highlightsContent" }).should(
        "be.visible",
      )
      cy.findByRole("slider", { name: "highlightsSliderPrev" }).should(
        "not.exist",
      )
      // In between - both the sides should show the arrow
      cy.findByRole("slider", { name: "highlightsSliderNext" }).click()
      cy.findAllByRole("contentinfo", { name: "highlightsContent" }).should(
        "be.visible",
      )
      cy.findByRole("slider", { name: "highlightsSliderPrev" }).should(
        "be.visible",
      )
      cy.findByRole("slider", { name: "highlightsSliderNext" }).should(
        "be.visible",
      )
      // last card should not show right arrow
      for (let i = 0; i < 10; i++) {
        cy.findByRole("slider", { name: "highlightsSliderNext" }).click({
          timeout: 4000,
        })
      }
      cy.findAllByRole("contentinfo", { name: "highlightsContent" }).should(
        "be.visible",
      )
      cy.findByRole("slider", { name: "highlightsSliderPrev" }).should(
        "be.visible",
      )
      cy.findByRole("slider", { name: "highlightsSliderNext" }).should(
        "not.exist",
      )
    })

    it("should show the categories section ", () => {
      // should show the header
      cy.findByText("Categories").should("be.visible")
      // should show company/Title and values
      cy.findAllByRole("heading").should("be.visible")
      cy.findAllByRole("gridcell").should("be.visible")
    })

    it("should show the contents", () => {
      // Clicking on the right arrow
      cy.findByRole("slider", { name: "PrevSlider" }).should("not.exist")
      cy.findByRole("slider", { name: "NextSlider" }).click()
      cy.findAllByRole("heading").should("be.visible")
      cy.findAllByRole("gridcell").should("be.visible")
      // Clicking on the left arrow
      cy.findByRole("slider", { name: "NextSlider" }).should("not.exist")
      cy.findByRole("slider", { name: "PrevSlider" }).click()
      cy.findAllByRole("heading").should("be.visible")
      cy.findAllByRole("gridcell").should("be.visible")
    })

    it("should show the indices tab content", () => {
      // Click on indices tab
      cy.findByText("Watchlist").should("be.visible")
      cy.findByRole("button", { name: "Indices" }).click()
      // Should show the contents
      cy.findByRole("heading", { name: "Indices" }).should("be.visible")
      cy.findAllByRole("row").should("be.visible")
    })

    it("should show the stock tab content", () => {
      // Click on stock tab
      cy.findByRole("button", { name: "Stock" }).click()
      // Should show the contents
      cy.findByRole("heading", { name: "Stock" }).should("be.visible")
      cy.findAllByRole("row").should("be.visible")
    })

    it("should show the bonds tab content", () => {
      // Click on bonds tab
      cy.findByRole("button", { name: "Bonds" }).click()
      // Should show the contents
      cy.findByRole("group", { name: "Bonds" }).should("be.visible")
    })

    it("should show the fx tab content", () => {
      // Click on fx tab
      cy.findByRole("button", { name: "FX" }).click()
      // Should show the contents
      cy.findByRole("heading", { name: "FX" }).should("be.visible")
      cy.findAllByRole("row").should("be.visible")
      // Click on Back button
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.location("pathname", { timeout: 4000 }).should("match", /insights/)
      cy.findByText("Insights").should("be.visible")
    })
  })

  context("Market Archive", () => {
    it("should open market archive page", () => {
      cy.visit("/client")
      // Open market archive page
      cy.findByRole("button", {
        name: /Insights/i,
      }).click()
      cy.location("pathname", { timeout: 4000 }).should("match", /insights/)
      cy.findByText(insightskeys.page.index.title).should("be.visible")
      cy.findByRole("button", {
        name: "View Markets Archive",
      }).click()
      // Should show market archive text
      cy.findByRole("heading", { name: "Market Archive" }).should("be.visible")
      cy.findByText(insightskeys.page.marketArchive.description).should(
        "be.visible",
      )
    })

    it("should open podcasts", () => {
      // Click on any podcast
      cy.findAllByRole("article", { name: "Weekly Market Podcasts" })
        .eq(0)
        .click()
      cy.findByRole("heading").should("be.visible")
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
      // Click on Back button
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.findByRole("heading", {
        name: insightskeys.page.podcasts.heading,
      }).should("be.visible")
      // Click on 'see more' of podcast
      cy.findAllByText(commonKeys.button.seeMore).eq(0).click()
      cy.wait(2000)
      cy.findAllByRole("article", {
        name: "Weekly Market Podcasts",
      })
        .eq(2)
        .click()
      // Click on market archive in breadcrumb
      cy.wait(2000)
      cy.findAllByRole("listitem").eq(2).click()
      cy.findByRole("heading", {
        name: insightskeys.page.podcasts.heading,
      }).should("be.visible")
    })

    it("should open articles", () => {
      // Click on any article
      cy.findAllByRole("article", { name: "Article" }).eq(0).click()
      cy.findByRole("img", { name: "Hero Image" }).should("be.visible")
      cy.findAllByRole("heading").should("be.visible")
      // Click on arrow button(accordian)
      cy.findAllByRole("button", { name: "Accordion" }).eq(0).click()
      cy.findByRole("region").scrollIntoView().should("be.visible")
      // Click on Back button
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.findByRole("heading", { name: "Articles" }).should("be.visible")
      // Click on 'see more' of article
      cy.findAllByText(commonKeys.button.seeMore).eq(1).click()
      cy.wait(2000)
      cy.findAllByRole("article", { name: "Article" }).eq(2).click()
      // Click on market archive in breadcrumb
      cy.wait(2000)
      cy.findAllByRole("listitem").eq(2).click()
      cy.findByRole("heading", { name: "Articles" }).should("be.visible")
    })

    it("should open webinars", () => {
      // Click on any webinar
      cy.findByRole("heading", { name: "Webinars" })
        .scrollIntoView()
        .should("be.visible")
      cy.findAllByRole("article", { name: "Webinar" }).eq(0).click()
      cy.wait(2000)
      cy.findAllByRole("heading").should("be.visible")
      // Click on the video
      // Click on Back button
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.findByRole("heading", { name: "Webinars" })
        .scrollIntoView()
        .should("be.visible")
      // Click on 'see more' of webinar
      // Click on market archive in breadcrumb
      cy.findAllByRole("article", { name: "Webinar" }).eq(1).click()
      cy.wait(2000)
      cy.findAllByRole("listitem").eq(2).click()
      cy.findByRole("heading", { name: "Webinars" })
        .scrollIntoView()
        .should("be.visible")
    })

    it("should open whitepapers", () => {
      // Click on any whitepaper
      cy.findByRole("heading", { name: "Whitepapers" })
        .scrollIntoView()
        .should("be.visible")
      cy.findAllByRole("article", { name: "Whitepaper" }).eq(0).click()
      cy.wait(2000)
      cy.findAllByRole("heading").should("be.visible")
      // Click on download whitepaper button
      cy.findByRole("button", { name: "Download whitepaper" }).click()
      cy.wait(2000)
      cy.findByRole("heading", {
        name: "Thanks for downloading our whitepaper.",
      }).should("be.visible")
      cy.findByRole("button", { name: "Download Again" }).should("be.visible")
      // Click on Back button
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.findByRole("heading", { name: "Whitepapers" })
        .scrollIntoView()
        .should("be.visible")
      // Click on 'see more' of whitepaper
      // Click on market archive in breadcrumb
      cy.findAllByRole("article", { name: "Whitepaper" }).eq(1).click()
      cy.wait(2000)
      cy.findAllByRole("listitem").eq(2).click()
      cy.findByRole("heading", { name: "Whitepapers" })
        .scrollIntoView()
        .should("be.visible")
    })

    it("should open management views", () => {
      // Click on any management view
      cy.findByRole("heading", { name: "Management Views" })
        .scrollIntoView()
        .should("be.visible")
      cy.findAllByRole("article", { name: "Management View" }).eq(0).click()
      cy.wait(2000)
      cy.findAllByRole("heading").should("be.visible")
      // Click on the video
      // Click on Back button
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.findByRole("heading", { name: "Management Views" })
        .scrollIntoView()
        .should("be.visible")
      // Click on 'see more' of management view
      cy.findAllByText(commonKeys.button.seeMore).eq(2).click()
      cy.wait(2000)
      cy.findAllByRole("article", { name: "Management View" }).eq(2).click()
      // Click on market archive in breadcrumb
      cy.wait(2000)
      cy.findAllByRole("listitem").eq(2).click()
      cy.findByRole("heading", { name: "Management Views" })
        .scrollIntoView()
        .should("be.visible")
    })

    it("should open market updates", () => {
      // Click on any market update
      cy.findByRole("heading", { name: "Market Updates" })
        .scrollIntoView()
        .should("be.visible")
      cy.findAllByRole("article", { name: "Market Update" }).eq(0).click()
      cy.wait(2000)
      cy.findAllByRole("heading").should("be.visible")
      // Click on download market update button
      cy.findByRole("button", { name: "Download market update" }).click()
      cy.wait(2000)
      cy.findByRole("heading", {
        name: "Thanks for downloading our market update.",
      }).should("be.visible")
      cy.findByRole("button", { name: "Download Again" }).should("be.visible")
      // Click on Back button
      cy.findByRole("button", { name: commonKeys.button.back }).click()
      cy.findByRole("heading", { name: "Market Updates" })
        .scrollIntoView()
        .should("be.visible")
      // Click on 'see more' of market update
      // Click on market archive in breadcrumb
      cy.findAllByRole("article", { name: "Market Update" }).eq(0).click()
      cy.wait(2000)
      cy.findAllByRole("listitem").eq(2).click()
      cy.findByRole("heading", { name: "Market Updates" })
        .scrollIntoView()
        .should("be.visible")
    })
  })
})
