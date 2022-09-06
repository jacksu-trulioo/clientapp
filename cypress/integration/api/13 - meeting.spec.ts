/// <reference types ="Cypress" />
import moment from "moment"

describe("Schedule Meeting", () => {
  let mandatesList
  let calender
  let endDate = moment().add(1, "months").format("YYYY-MM-DD")
  let startDate = moment().format("YYYY-MM-DD")
  let reqBodyCalendar = {
    endDate,
    startDate,
    timeZone: "Asia/Riyadh",
  }
  let reqBodySchedule = {
    endDate: "2022-07-06",
    startDate: "2022-06-06",
    timeZone: "Asia/Riyadh",
  }

  before(() => {
    cy.loginClient().then((mandates) => {
      mandatesList = mandates
    })

    cy.fixture("api/meetings/calender").then((json) => {
      calender = json
    })
  })

  context("POST | /api/client/meetings/calendar", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "POST",
        url: "/api/client/meetings/calendar",
        body: reqBodyCalendar,
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "POST",
          url: "/api/client/meetings/calendar",
          body: reqBodyCalendar,
          failOnStatusCode: false,
        },
        "appSession",
      )
    })

    it("should validate json schema", () => {
      let obj = {
        mandatesList,
        requestObj: {
          method: "POST",
          url: "/api/client/meetings/calendar",
          body: reqBodyCalendar,
        },
        jsonSchema: calender,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })

  context.skip(
    "[Skipped because it will send lots of email for meeting] POST | /api/client/meetings/schedule",
    () => {
      it("should give 200 success", () => {
        cy.request({
          method: "POST",
          url: "/api/client/meetings/schedule",
          body: reqBodySchedule,
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(200)
        })
      })

      it("should fail if no appsession token in cookie", () => {
        cy.testByClearCookie(
          {
            method: "POST",
            url: "/api/client/meetings/schedule",
            body: reqBodySchedule,
            failOnStatusCode: false,
          },
          "appSession",
        )
      })

      it("should validate json schema", () => {
        let obj = {
          mandatesList,
          requestObj: {
            method: "POST",
            url: "/api/client/meetings/schedule",
            body: reqBodySchedule,
          },
          jsonSchema: calender, // TODO: Need to update this to match schedule schema
        }
        cy.checkJsonSchemaForAllClient(obj)
      })
    },
  )
})
