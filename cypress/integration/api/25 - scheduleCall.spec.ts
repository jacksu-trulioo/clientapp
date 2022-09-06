/// <reference types ="Cypress" />

describe("schedule call", () => {
  let mandatesList
  let scheduleCall

  let reqBody = {
    agenda: [],
    clientEmail: "xyz1234@email.com",
    endDateTime: "2022-07-14T13:30:00+03:00",
    startDateTime: "2022-07-14T10:30+03:00",
    reminderMinutesBeforeStart: 0,
    timeZone: "Arab Standard Time",
    meetingType: "PHONE_CALL",
    payload: {
      phoneNumber: "+919199999999",
    },
  }

  before(() => {
    cy.loginClient().then((mandates) => {
      mandatesList = mandates
    })

    cy.fixture("api/scheduleCall/scheduleCall").then((json) => {
      scheduleCall = json
    })
  })

  context("POST | /api/client/meetings/schedule", () => {
    it("should give 200 success", () => {
      cy.request({
        method: "POST",
        url: "/api/client/meetings/schedule",
        body: reqBody,
      }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it("should fail if no appsession token in cookie", () => {
      cy.testByClearCookie(
        {
          method: "POST",
          url: "/api/client/meetings/schedule",
          body: reqBody,
          failOnStatusCode: false,
        },
        "appSession",
      )
    })

    it("should validate json schema", () => {
      let singleMandate = [mandatesList[0]]
      let obj = {
        mandatesList: singleMandate,
        requestObj: {
          method: "POST",
          url: "/api/client/meetings/schedule",
          body: reqBody,
        },
        jsonSchema: scheduleCall,
      }
      cy.checkJsonSchemaForAllClient(obj)
    })
  })
})
