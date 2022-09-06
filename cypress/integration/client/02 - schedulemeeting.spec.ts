import faker from "faker"
import moment from "moment"
context("desktop", () => {
  let scheduleMeetingKeys
  let date
  before(() => {
    cy.loginClient()
    cy.fixture("../../public/locales/en/scheduleMeeting").then((keys) => {
      scheduleMeetingKeys = keys
    })
  })
  describe("Schedule Meeting", () => {
    beforeEach(() => {
      date = moment(faker.date.soon()).format("dddd, MMMM Do, YYYY")
      cy.visit("/client")
      cy.findByRole("button", {
        name: scheduleMeetingKeys.header.title,
      }).click()
      cy.location("pathname", { timeout: 15000 }).should(
        "match",
        /schedule-meeting/,
      )
      cy.intercept("POST", "/api/client/meetings/schedule", (req) => {
        if (req.body.meetingType == "PHONE_CALL") {
          req.reply({
            statusCode: 200,
            fixture: "scheduleMeet/phone.json",
          })
        }
        if (req.body.meetingType == "VIRTUAL_MEETING") {
          req.reply({
            statusCode: 200,
            fixture: "scheduleMeet/virtual.json",
          })
        }
      }).as("scheduleMeet")
    })
    it("should schedule a phone call with All valid data points -{Date, time, Meeting type- phone call, Reason}", () => {
      cy.scheduleMeet({
        timeZone: /Arab Standard Time GMT\+03:00/i,
        datePickerAriaLabel: `Choose ${date}`,
        fillTime: "random",
        meetingType: "phoneCall",
        callReason: "TFO",
        phoneNumberPrefix: /SA \+966/i,
        lang: "en",
      })
      cy.findByRole("heading", { name: "Call scheduled" }).should("be.visible")
    })
    it.skip("(NOT YET READY) should not schedule a phone call on selecting all data points except the date i.e. when no more time slot for the day is available", () => {
      // cy.clock()
      cy.scheduleMeet({
        timeZone: /Arab Standard Time GMT\+03:00/i,
        datePickerAriaLabel: `Choose ${date}`,
        fillTime: "random",
        meetingType: "phoneCall",
        callReason: "TFO",
        phoneNumberPrefix: /SA \+966/i,
        lang: "en",
      })
    })
    it("should not schedule phone call on selecting all data points except the time", () => {
      cy.scheduleMeet({
        timeZone: /Arab Standard Time GMT\+03:00/i,
        datePickerAriaLabel: `Choose ${date}`,
        fillTime: "",
        meetingType: "phoneCall",
        callReason: "TFO",
        phoneNumberPrefix: /SA \+966/i,
        lang: "en",
      })
      cy.findAllByText("This field is required").should("be.visible")
    })
    it("should not schedule a phone call on selecting all data points except Reason", () => {
      cy.scheduleMeet({
        timeZone: /Arab Standard Time GMT\+03:00/i,
        datePickerAriaLabel: `Choose ${date}`,
        fillTime: "random",
        meetingType: "phoneCall",
        callReason: "",
        phoneNumberPrefix: /SA \+966/i,
        lang: "en",
      })
      cy.findAllByText("This field is required").should("be.visible")
    })
    it.skip("[NEED CLARITY] should schedule a phone call on selecting meeting type as Phone Call", () => {
      cy.scheduleMeet({
        timeZone: /Arab Standard Time GMT\+03:00/i,
        datePickerAriaLabel: `Choose ${date}`,
        fillTime: "random",
        meetingType: "phoneCall",
        callReason: "TFO",
        phoneNumberPrefix: /SA \+966/i,
        lang: "en",
      })
    })
    it("should schedule a virtual meeting on selecting meeting type as Virtual meeting", () => {
      cy.scheduleMeet({
        timeZone: /Arab Standard Time GMT\+03:00/i,
        datePickerAriaLabel: `Choose ${date}`,
        fillTime: "random",
        meetingType: "virtualMeeting",
        callReason: "TFO",
        phoneNumberPrefix: /SA \+966/i,
        lang: "en",
      })
      cy.findByRole("heading", { name: "Call scheduled" }).should("be.visible")
    })
    it.skip("(NOT YET READY) should not schedule a virtual meeting on selecting all data points except the date i.e. when no more time slot for the day is available", () => {})
    it("should not schedule a virtual meeting on selecting all data points except the time", () => {
      cy.scheduleMeet({
        timeZone: /Arab Standard Time GMT\+03:00/i,
        datePickerAriaLabel: `Choose ${date}`,
        fillTime: "",
        meetingType: "virtualMeeting",
        callReason: "TFO",
        phoneNumberPrefix: /SA \+966/i,
        lang: "en",
      })
      cy.findAllByText("This field is required").should("be.visible")
    })
    it("should not schedule a virtual meeting on selecting all data points except Reason", () => {
      cy.scheduleMeet({
        timeZone: /Arab Standard Time GMT\+03:00/i,
        datePickerAriaLabel: `Choose ${date}`,
        fillTime: "random",
        meetingType: "virtualMeeting",
        callReason: "",
        phoneNumberPrefix: /SA \+966/i,
        lang: "en",
      })
      cy.findAllByText("This field is required").should("be.visible")
    })
    it("should close the Schedule meeting modal on clicking the close button in the header", () => {
      cy.findByText("Exit").click()
      cy.location("pathname", { timeout: 15000 }).should("match", /client/)
    })
  })
})
