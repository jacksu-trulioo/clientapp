import moment from "moment"

context("desktop", () => {
  describe("Dashboard", () => {
    let clientDashboard
    let insightsKeys
    let commonKeys

    before(() => {
      cy.loginClient()

      cy.fixture("../../public/locales/en/clientDashboard").then((keys) => {
        clientDashboard = keys
      })
      cy.fixture("../../public/locales/en/insights").then((keys) => {
        insightsKeys = keys
      })
      cy.fixture("../../public/locales/en/common").then((keys) => {
        commonKeys = keys
      })
    })

    context("Portfolio - Performance Metrics", () => {
      it("Should show the Performance Metrics", () => {
        // Go to dashboard
        cy.visit("/client")
        // Check performance metrics for data
        // (1) Total (AUM)
        // (2) Overall Performance
        //     - YTD
        //     - ITD
        //     - Annualized
        // (3) Net Change (ITD)
        // (4) IRR - for fully exited details
        // Check rounding of dollars
        cy.findByText(clientDashboard.portfolio.portfolioMetricesData.totalAum)
          .parent()
          .parent()
          .findAllByText(/\$/i, { timeout: 5000 })
          .invoke("text")
          .then((text) => {
            let splitTextArr = text.split("$")
            for (let i = 1; i < splitTextArr.length; i++) {
              let num = Number(splitTextArr[i].replace(/,/g, ""))
              expect(num).to.match(/^[0-9]*$/)
            }
          })
        cy.findAllByText(/\%/i)
          .invoke("text")
          .then((text) => {
            let splitTextArr = text.split("%")
            for (let i = 0; i < 4; i++) {
              let dec = splitTextArr[i].replace(/[^\d.-]/g, "")
              expect(dec).to.match(/^(\d+(\.\d{0,2})?|\.?\d{1})$/)
            }
          })
      })

      it("Should show performance chart", () => {
        // Go to Dashboard
        // Go to performance chart
        cy.wait(1000)
        cy.get(".highcharts-background").should("be.visible")
        // Performance chart defines
        cy.findByText(
          clientDashboard.portfolio.performanceData.cumulativePerformance,
        ).should("be.visible")
        cy.findByText(
          clientDashboard.portfolio.performanceData.periodPerformance,
        ).should("be.visible")
        cy.get(".highcharts-xaxis-labels").scrollIntoView().should("be.visible")
        cy.get(".highcharts-yaxis-labels").should("be.visible")
        // on hover
        cy.get(".highcharts-point")
          .eq(4)
          .trigger("mouseover")
          .should("be.visible")
        // The performance chart provides data
        cy.findByRole("heading", {
          name: "Valuation date",
        }).should("not.be.empty")
      })

      it("Should open Portfolio Summary page", () => {
        // Go to dashboard
        // Click on "show portfolio summary" link
        cy.findByText("Show portfolio summary").click()
        cy.findAllByText(/Welcome, Client #\d+ to your Portfolio Summary/i, {
          timeout: 20000,
        }).should("be.visible")
      })

      it("'Portfolio activity - Calendar'", () => {
        // Go to dashboard
        // selected Deal in the calender
        cy.visit("/client")
        cy.get(".react-datepicker").scrollIntoView().should("be.visible")
        cy.request({
          method: "GET",
          url: "/api/client/miscellaneous/portfolio-activity",
        }).then((res) => {
          let str = JSON.stringify(res.body[0].date)
          const calenderDate = moment(new Date(str)).format(
            "dddd, MMMM Do, yyyy",
          )
          const dealDate = moment(new Date(str)).format("MMM DD")
          cy.get(`div[aria-label='Choose ${calenderDate}']`)
            .children()
            .eq(0)
            .invoke("text")
            .then((count) => {
              cy.findAllByText(dealDate).should("have.length", count)
            })
        })
        // Deal Description
        cy.findAllByRole("button", { name: "Deal Detail" }).each((expand) => {
          cy.wrap(expand).click()
          cy.findAllByRole("paragraph", { name: "Deal Description" }).should(
            "not.be.empty",
          )
        })
      })
    })

    context("Insights", () => {
      it("should show the latest insights", () => {
        cy.visit("/client")
        // Go to latest insight section in the dashboard
        cy.findByText(clientDashboard.insights.title)
          .scrollIntoView()
          .should("be.visible")
        // Click on "See all insights" link in the dashboard
        cy.findByText(clientDashboard.insights.button).click()
        cy.findByRole("heading", {
          name: insightsKeys.page.marketArchive.heading,
          level: 2,
          timeout: 20000,
        }).should("be.visible")
      })

      it("should play the video/podcast", () => {
        // Go to dashboard
        cy.visit("/client")
        // Go to latest insights
        cy.findByText(clientDashboard.insights.title)
          .scrollIntoView()
          .should("be.visible")
        // Click on the video
        cy.findByRole("gridcell", {
          name: "Insights Card",
        })
          .children()
          .then((elem) => {
            for (let i = 0; i < elem.length; i++) {
              cy.findByRole("gridcell", { name: "Insights Card" })
                .children()
                .eq(i)
                .click()
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
              cy.findByRole("button", {
                name: commonKeys.button.back,
              }).click()
            }
          })
      })

      it("should open the article page", () => {
        // Go to dashboard
        cy.visit("/client")
        // Go to Latest insights
        cy.findByText(clientDashboard.insights.title)
          .scrollIntoView()
          .should("be.visible")
        // Click on any article from the reference articles/insights
        cy.findByRole("gridcell", {
          name: "Insights Card",
        })
          .children()
          .eq(0)
          .click()
        cy.findAllByText(insightsKeys.page.podcasts.heading).should(
          "be.visible",
        )
        cy.findByRole("heading", {
          name: "Weekly Market Podcast with David Darst",
        }).should("be.visible")
      })
    })

    context("Opportunities", () => {
      it("should show opportunities deal cards", () => {
        // Go to dashboard
        cy.visit("/client")
        // Go to opportunities section
        cy.findAllByText(/Opportunities/i).should("be.visible")
      })

      it("should open the deal sheet", () => {
        // Go to dashboard
        // Go to opportunities
        // Click on view details
        cy.findByText(clientDashboard.opportunities.title)
          .scrollIntoView()
          .should("be.visible")
        cy.findAllByText(commonKeys.button.viewDetails).should("be.visible")
        // Click the deal card
        cy.findAllByText(commonKeys.button.viewDetails).eq(1).click()
        cy.location("pathname", { timeout: 15000 }).should(
          "match",
          /opportunities/i,
        )
        cy.findByRole("button", {
          name: commonKeys.button.back,
        }).click()
        cy.location("pathname", { timeout: 15000 }).should("match", /client/)
        cy.findAllByText(/client id #\d+/i).should("be.visible")
      })

      it("should open the opportunities landing page", () => {
        // Go to dashboard
        // Go to opportunities section
        cy.findByText(clientDashboard.opportunities.title)
          .scrollIntoView()
          .should("be.visible")
        // On clicking on "view details"
        // On clicking the deal card
        cy.findAllByText(commonKeys.button.viewDetails).eq(1).click()
        cy.location("pathname", { timeout: 15000 }).should(
          "match",
          /opportunities/i,
        )
        cy.findByRole("button", {
          name: commonKeys.button.back,
        }).click()
        cy.location("pathname", { timeout: 15000 }).should("match", /client/)
        cy.findByText(/client id #\d+/i).should("be.visible")
      })
    })
  })
})
