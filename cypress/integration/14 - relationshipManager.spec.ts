// exiting from RM screen is covered in detailed opportunitity rm scenario
import { ScheduleMeetingInput, User } from "../../src/services/mytfo/types"
import timeZones from "../../src/utils/data/timeZones"

let scheduleKeys
let commonKeys
let homeKeys
let timeZoneKeys

describe("Scheduling a call with TFO", () => {
  let meeting: ScheduleMeetingInput
  let user: User
  before(() => {
    cy.loginBE()
    cy.fixture("../../public/locales/en/scheduleMeeting").then((keys) => {
      scheduleKeys = keys
    })
    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })
    cy.fixture("../../public/locales/en/home").then((keys) => {
      homeKeys = keys
    })
    cy.fixture("../../public/locales/en/timeZones").then((keys) => {
      timeZoneKeys = keys
    })

    cy.fixture("user").then((mockedUser) => {
      user = mockedUser
    })

    cy.fixture("meetingDetails").then((meetingDetails) => {
      meeting = meetingDetails
    })
  })

  beforeEach(() => {
    cy.intercept("/api/user/relationship-manager", {
      fixture: "RMNotAssigned",
    }).as("relationshipManager")

    cy.intercept("/api/portfolio/opportunities", {
      fixture: "userOpportunityStatusUnverified",
    }).as("portfolioOpportunities")

    cy.intercept("/api/user/status", {
      fixture: "userStatusNotQualified",
    }).as("userQualificationStatus")

    cy.intercept("/api/portfolio/insights/dashboard", {
      fixture: "dashboardInsights",
    }).as("dashboardInsights")

    cy.intercept("/api/portfolio/webinars/upcomings", {
      fixture: "upcomingWebinars",
    }).as("upcomingWebinars")

    cy.intercept("/api/portfolio/insights/webinars/recent", {
      fixture: "recentWebinars",
    }).as("recentWebinars")

    cy.intercept("/api/user/qualifications/status", {
      fixture: "proposalJourneyNotStarted",
    }).as("userStatus")

    cy.intercept("/api/user", { fixture: "user" }).as("user")

    cy.intercept("/api/user/summary", {
      fixture: "userSummaryFreshUser",
    }).as("userSummary")

    cy.intercept("/api/user/proposals/status", {
      fixture: "proposalsStatusNotStarted",
    }).as("proposalsStatus")

    cy.intercept("/api/user/preference/disclaimer", {
      fixture: "userDisclaimerAccepted",
    }).as("userDisclaimerAccepted")

    cy.intercept("/api/user/investment-goals", {
      fixture: "investmentGoalQuizNotStarted",
    }).as("investmentGoalResponse")

    cy.intercept("/api/user/kyc/status", {
      fixture: "kycNotStarted",
    }).as("kycStatus")

    cy.intercept("/api/user/preference", {
      fixture: "userPreferenceENDefault",
    }).as("languagePreference")
  })

  context("desktop", () => {
    it("should able to navigate to RM screen to schedule a meeting", () => {
      cy.visit("/")

      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@user",
        "@upcomingWebinars",
        "@recentWebinars",
        "@userSummary",
        "@investmentGoalResponse",
        "@proposalsStatus",
        "@kycStatus",
        "@userDisclaimerAccepted",
      ])
      cy.findAllByLabelText("insightCardType").should("have.length", 3)
      cy.findByRole("button", {
        name: homeKeys.cta.simulatePortfolio.button,
      }).should("be.visible")
      cy.findAllByLabelText("opportunityCard").should("have.length", "2")

      cy.findByLabelText("spinner").should("not.exist")
      cy.findByLabelText("rmNotAssignedCard").within(() => {
        cy.findByText(scheduleKeys.button.call).click({ force: true })
      })
      cy.location("pathname").should("equal", "/schedule-meeting")
    })

    it("should display validation error message when user has not filled required information", () => {
      cy.findByRole("button", { name: scheduleKeys.button.call }).click()
      cy.findAllByText(commonKeys.errors.required).should("have.length", 2)
    })

    it("should autofill phone number", () => {
      const phoneNumber =
        user.profile.phoneCountryCode + " " + user.profile.phoneNumber
      cy.findByLabelText("phoneNumber").should("have.value", phoneNumber)
    })

    it("should be able to edit phone number", () => {
      meeting.location = "123456789"
      cy.findByRole("button", { name: "Edit" }).click()
      cy.findByLabelText("phoneCountryCode").should("not.be.disabled")
      cy.findByLabelText("phoneNumber")
        .should("not.be.disabled")
        .clear()
        .type(meeting.location)
    })

    it("should preselect timezone for GCC country Bahrain", () => {
      let expectedTimeZone = timeZones.find(
        (t) => t.value === timeZoneKeys["Arab-Standard-Time"],
      )

      cy.findAllByLabelText("timeZone")
        .eq(0)
        .should(
          "contain.text",
          `${expectedTimeZone.value} ${expectedTimeZone.offset}`,
        )
    })

    it("should select time zone", () => {
      meeting.timeZone = "Alaskan Standard Time GMT-09:00"
      cy.findAllByLabelText("timeZone").children("div").eq(0).click()
      cy.findByRole("button", {
        name: meeting.timeZone,
      }).click()
    })

    it("should select available time slot", () => {
      let date = new Date()
      meeting.startTime = new Date(
        date.setDate(date.getDate()),
      ).toLocaleDateString("en-GB")
      cy.intercept("POST", "/api/portfolio/meetings/calendar", (req) => {
        req.reply({
          body: {
            schedules: [
              {
                date: `${meeting.startTime
                  .split("T")[0]
                  .split("/")
                  .reverse()
                  .join("-")}`,
                hasFreeHour: true,
                hours: [
                  {
                    time: "01:00:00",
                    available: true,
                    status: "Free",
                  },
                  {
                    time: "10:00:00",
                    available: false,
                    status: "Tentative",
                  },
                  {
                    time: "12:00:00",
                    available: false,
                    status: "Busy",
                  },
                ],
              },
            ],
          },
        })
      }).as("calendarResponse")

      cy.findByLabelText("availableDate").click()

      cy.findByLabelText("availableDate")
        .get("div[aria-current='date']")
        .click()

      meeting.startTime = `${meeting.startTime}T01:00:00`

      cy.findByText(scheduleKeys.availableDate.label).click()
      cy.findAllByLabelText("timeSlot").eq(0).click()
    })

    it("should select the reason to call", () => {
      meeting.subject = scheduleKeys.callReason.options.TFO
      cy.findByLabelText("callReason")
        .findByText(commonKeys.select.placeholder)
        .click()
      cy.findByRole("button", { name: meeting.subject }).click()
    })

    it("should enter additional info", () => {
      meeting.content = Math.random().toString(36).slice(-5)
      cy.findByLabelText(scheduleKeys.additionalInfo.label).type(
        meeting.content,
      )
    })

    it("should have 255 character limit on additonal info textarea field ", () => {
      cy.findByLabelText(scheduleKeys.additionalInfo.label).should(
        "have.attr",
        "maxlength",
        "255",
      )
    })

    it("should show summary of the information entered on the right side of the form real time.", () => {
      const meetingDate = meeting.startTime
        .split("T")[0]
        .split("/")
        .reverse()
        .join("-")
      cy.findByLabelText("callDetailsSummary").within(() => {
        cy.findByLabelText("date").should("contain.text", meetingDate)
        cy.findByLabelText("timeZone").should("contain.text", "GMT-09:00")
        cy.findByLabelText("time").should(
          "contain.text",
          meeting.startTime.split("T")[1].substring(0, 4),
        )
        cy.findByLabelText("meetingType").should(
          "contain.text",
          meeting.isOnlineMeeting
            ? scheduleKeys.meetingType.options.virtualMeeting
            : scheduleKeys.meetingType.options.phoneCall,
        )
        cy.findByLabelText("contact").should(
          "contain.text",
          meeting.isOnlineMeeting ? user.email : meeting.location,
        )
        cy.findByLabelText("reason").should("contain.text", meeting.subject)
      })
    })

    it("should select meeting type as virtual meeting", () => {
      meeting.isOnlineMeeting = true
      cy.findAllByLabelText("meetingType")
        .findByText(scheduleKeys.meetingType.options.phoneCall)
        .click()
      cy.findByRole("button", {
        name: scheduleKeys.meetingType.options.virtualMeeting,
      }).click()
    })

    it("should not display phone number", () => {
      cy.findByLabelText("phoneNumber").should("not.exist")
    })

    it("should display autofilled non-editable email address", () => {
      meeting.location = user.email
      cy.findByLabelText("email")
        .should("be.visible")
        .should("be.disabled")
        .should("have.value", user.email)
    })

    it("should show summary of the information entered on the right side of the form real time when virtual meeting is opted.", () => {
      cy.findByLabelText("callDetailsSummary").within(() => {
        cy.findByLabelText("meetingType").should(
          "contain.text",
          meeting.isOnlineMeeting
            ? scheduleKeys.meetingType.options.virtualMeeting
            : scheduleKeys.meetingType.options.phoneCall,
        )
        cy.findByLabelText("contact").should(
          "contain.text",
          meeting.isOnlineMeeting ? user.email : meeting.location,
        )
      })
    })

    it("should schedule a call with RM", () => {
      cy.intercept("POST", "/api/portfolio/meetings/schedule", {
        fixture: "schedulePayload",
      }).as("scheduleResponse")

      cy.findByRole("button", { name: scheduleKeys.button.call }).click()
      cy.wait("@scheduleResponse")
      cy.findByRole("heading", {
        name: scheduleKeys.success.title,
      }).should("be.visible")
    })

    it("should navigate to dashboard on closing the scheduler window", () => {
      cy.intercept("/api/user/relationship-manager", {
        fixture: "RMAssigned",
      }).as("relationshipManager")
      cy.findByRole("button", { name: scheduleKeys.button.close }).click()
      cy.location("pathname").should("equal", "/")
      cy.wait([
        "@portfolioOpportunities",
        "@relationshipManager",
        "@userQualificationStatus",
        "@dashboardInsights",
        "@userStatus",
        "@upcomingWebinars",
        "@recentWebinars",
      ])
    })

    it("should view RM details on schedule meeting screen when RM is assigned to user", () => {
      cy.findByLabelText("rmCard").find("button").should("have.length", 2)

      cy.findByRole("button", {
        name: homeKeys.cta.relationshipManager.button.meeting,
      }).click({
        force: true,
      })
      cy.location("pathname").should("equal", "/schedule-meeting")

      cy.fixture("RMAssigned").then((json) => {
        let rmAssigned = json.manager.firstName + " " + json.manager.lastName

        cy.findByLabelText("rmName").should("contain.text", rmAssigned)
      })
    })

    it("should schedule meeting when RM is assigned to user", () => {
      let date = new Date()
      meeting.startTime = new Date(
        date.setDate(date.getDate()),
      ).toLocaleDateString("en-GB")
      cy.intercept("POST", "/api/portfolio/meetings/calendar", (req) => {
        req.reply({
          body: {
            schedules: [
              {
                date: `${meeting.startTime
                  .split("T")[0]
                  .split("/")
                  .reverse()
                  .join("-")}`,
                hasFreeHour: true,
                hours: [
                  {
                    time: "01:00:00",
                    available: true,
                    status: "Free",
                  },
                  {
                    time: "10:00:00",
                    available: false,
                    status: "Tentative",
                  },
                  {
                    time: "12:00:00",
                    available: false,
                    status: "Busy",
                  },
                ],
              },
            ],
          },
        })
      }).as("calendarResponse")
      meeting.timeZone = "Alaskan Standard Time GMT-09:00"
      cy.findAllByLabelText("timeZone").children("div").eq(0).click()
      cy.findByRole("button", {
        name: meeting.timeZone,
      }).click()

      cy.findByLabelText("availableDate").click()

      cy.findByLabelText("availableDate")
        .get("div[aria-current='date']")
        .click()
      meeting.startTime = `${meeting.startTime}T01:00:00`

      cy.findByText(scheduleKeys.availableDate.label).click()
      cy.findAllByLabelText("timeSlot").eq(0).click()
      meeting.subject = scheduleKeys.callReason.options.TFO
      cy.findByLabelText("callReason")
        .findByText(commonKeys.select.placeholder)
        .click()
      cy.findByRole("button", { name: meeting.subject }).click()
      cy.intercept("POST", "/api/portfolio/meetings/schedule", {
        fixture: "schedulePayload",
      }).as("scheduleResponse")

      cy.findByRole("button", {
        name: scheduleKeys.button.call,
      }).click()
      cy.wait("@scheduleResponse")
      cy.findByRole("heading", {
        name: scheduleKeys.success.title,
      }).should("be.visible")
    })

    it("should preselect timezone for GCC country UAE", () => {
      let expectedTimeZone = timeZones.find(
        (t) => t.value === timeZoneKeys["Arabian-Standard-Time"],
      )

      const zone = timeZoneKeys[expectedTimeZone.label]

      cy.intercept("/api/user", { fixture: "userUAEResidence" }).as("user")
      cy.visit("/schedule-meeting")

      cy.findAllByLabelText("timeZone")
        .eq(0)
        .should("contain.text", `${zone} ${expectedTimeZone.offset}`)
    })

    it("should preselect timezone for GCC country Saudi Arabia", () => {
      let expectedTimeZone = timeZones.find(
        (t) => t.value === timeZoneKeys["Arab-Standard-Time"],
      )
      cy.intercept("/api/user", { fixture: "userSaudiResidence" }).as("user")
      cy.visit("/schedule-meeting")

      cy.findAllByLabelText("timeZone")
        .eq(0)
        .should(
          "contain.text",
          `${expectedTimeZone.value} ${expectedTimeZone.offset}`,
        )
    })

    it("should preselect timezone for GCC country Qatar", () => {
      let expectedTimeZone = timeZones.find(
        (t) => t.value === timeZoneKeys["Arab-Standard-Time"],
      )
      cy.intercept("/api/user", { fixture: "userQatarResidence" }).as("user")
      cy.visit("/schedule-meeting")

      cy.findAllByLabelText("timeZone")
        .eq(0)
        .should(
          "contain.text",
          `${expectedTimeZone.value} ${expectedTimeZone.offset}`,
        )
    })

    it("should preselect timezone for GCC country Oman", () => {
      let expectedTimeZone = timeZones.find(
        (t) => t.value === timeZoneKeys["Arabian-Standard-Time"],
      )

      const zone = timeZoneKeys[expectedTimeZone.label]
      cy.intercept("/api/user", { fixture: "userOmanResidence" }).as("user")
      cy.visit("/schedule-meeting")

      cy.findAllByLabelText("timeZone")
        .eq(0)
        .should("contain.text", `${zone} ${expectedTimeZone.offset}`)
    })

    it("should preselect timezone for GCC country Kuwait", () => {
      let expectedTimeZone = timeZones.find(
        (t) => t.value === timeZoneKeys["Arab-Standard-Time"],
      )
      cy.intercept("/api/user", { fixture: "userKuwaitResidence" }).as("user")
      cy.visit("/schedule-meeting")

      cy.findAllByLabelText("timeZone")
        .eq(0)
        .should(
          "contain.text",
          `${expectedTimeZone.value} ${expectedTimeZone.offset}`,
        )
    })

    it("should preselect timezone for GCC country Bahrain", () => {
      let expectedTimeZone = timeZones.find(
        (t) => t.value === timeZoneKeys["Arab-Standard-Time"],
      )
      cy.intercept("/api/user", { fixture: "userKuwaitResidence" }).as("user")
      cy.visit("/schedule-meeting")

      cy.findAllByLabelText("timeZone")
        .eq(0)
        .should(
          "contain.text",
          `${expectedTimeZone.value} ${expectedTimeZone.offset}`,
        )
    })

    it("should preselect timezone for non GCC country India", () => {
      cy.intercept("/api/user", { fixture: "userIndiaResidence" }).as("user")
      cy.visit("/schedule-meeting")

      cy.findAllByLabelText("timeZone")
        .eq(0)
        .findByText(commonKeys.select.placeholder)
        .should("be.visible")
    })
  })

  context(
    "mobile",
    {
      viewportHeight: 812,
      viewportWidth: 375,
    },
    () => {
      it("should able to navigate to RM screen to schedule a meeting", () => {
        cy.visit("/")
        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@user",
          "@upcomingWebinars",
          "@recentWebinars",
        ])

        cy.findByRole("button", { name: scheduleKeys.button.call }).click({
          force: true,
        })
        cy.location("pathname").should("equal", "/schedule-meeting")
      })

      it("should autofill phone number", () => {
        cy.fixture("user").then((mockedUser) => {
          user = mockedUser
        })
        const phoneNumber =
          user.profile.phoneCountryCode + " " + user.profile.phoneNumber
        cy.findByLabelText("phoneNumber").should("have.value", phoneNumber)
      })

      it("should preselect timezone for GCC country Bahrain", () => {
        let expectedTimeZone = timeZones.find(
          (t) => t.value === timeZoneKeys["Arab-Standard-Time"],
        )

        cy.findAllByLabelText("timeZone")
          .eq(0)
          .should(
            "contain.text",
            `${expectedTimeZone.value} ${expectedTimeZone.offset}`,
          )
      })

      it("should select time zone", () => {
        cy.fixture("meetingDetails").then((meetingDetails) => {
          meeting = meetingDetails
        })
        meeting.timeZone = "Alaskan Standard Time GMT-09:00"
        cy.findAllByLabelText("timeZone").children("div").eq(0).click()
        cy.findByRole("button", {
          name: meeting.timeZone,
        }).click()
      })

      it("should enter available date", () => {
        var date = new Date()
        meeting.startTime = new Date(
          date.setDate(date.getDate()),
        ).toLocaleDateString("en-GB")

        cy.intercept("POST", "/api/portfolio/meetings/calendar", (req) => {
          req.reply({
            body: {
              schedules: [
                {
                  date: `${meeting.startTime
                    .split("T")[0]
                    .split("/")
                    .reverse()
                    .join("-")}`,
                  hasFreeHour: true,
                  hours: [
                    {
                      time: "01:00:00",
                      available: true,
                      status: "Free",
                    },
                    {
                      time: "10:00:00",
                      available: false,
                      status: "Tentative",
                    },
                    {
                      time: "12:00:00",
                      available: false,
                      status: "Busy",
                    },
                  ],
                },
              ],
            },
          })
        }).as("calendarResponse")

        cy.findByLabelText("availableDate").click()

        cy.findByLabelText("availableDate")
          .get("div[aria-current='date']")
          .click()
      })

      it("should select available time slot", () => {
        cy.intercept("POST", "/api/portfolio/meetings/calendar", (req) => {
          req.reply({
            body: {
              schedules: [
                {
                  date: `${meeting.startTime
                    .split("T")[0]
                    .split("/")
                    .reverse()
                    .join("-")}`,
                  hasFreeHour: true,
                  hours: [
                    {
                      time: "01:00:00",
                      available: true,
                      status: "Free",
                    },
                    {
                      time: "10:00:00",
                      available: false,
                      status: "Tentative",
                    },
                    {
                      time: "12:00:00",
                      available: false,
                      status: "Busy",
                    },
                  ],
                },
              ],
            },
          })
        }).as("calendarResponse")
        meeting.startTime = `${meeting.startTime}T01:00:00`

        cy.findByText(scheduleKeys.availableDate.label).click()
        cy.findAllByLabelText("timeSlot").eq(0).click()
      })

      it("should select the reason to call", () => {
        meeting.subject = scheduleKeys.callReason.options.TFO
        cy.findByLabelText("callReason")
          .findByText(commonKeys.select.placeholder)
          .click()
        cy.findByRole("button", { name: meeting.subject }).click()
      })

      it("should enter additional info", () => {
        meeting.content = Math.random().toString(36).slice(-5)
        cy.findByLabelText(scheduleKeys.additionalInfo.label).type(
          meeting.content,
        )
      })

      it("should show summary of the information entered on the right side of the form real time.", () => {
        const meetingDate = meeting.startTime
          .split("T")[0]
          .split("/")
          .reverse()
          .join("-")
        cy.findByLabelText("expand card").click()
        cy.findByLabelText("callDetailsSummary").within(() => {
          cy.findByLabelText("date").should("contain.text", meetingDate)
          cy.findByLabelText("timeZone").should("contain.text", "GMT-09:00")
          cy.findByLabelText("time").should(
            "contain.text",
            meeting.startTime.split("T")[1].substring(0, 4),
          )
          cy.findByLabelText("meetingType").should(
            "contain.text",
            meeting.isOnlineMeeting
              ? scheduleKeys.meetingType.options.virtualMeeting
              : scheduleKeys.meetingType.options.phoneCall,
          )
          cy.findByLabelText("contact").should(
            "contain.text",
            meeting.isOnlineMeeting ? user.email : meeting.location,
          )
          cy.findByLabelText("reason").should("contain.text", meeting.subject)
        })
      })

      it("should schedule a call with RM", () => {
        cy.intercept("POST", "/api/portfolio/meetings/schedule", {
          fixture: "schedulePayload",
        }).as("scheduleResponse")

        cy.findByRole("button", { name: scheduleKeys.button.call }).click()
        cy.wait("@scheduleResponse")
        cy.findByRole("heading", {
          name: scheduleKeys.success.title,
        }).should("be.visible")
      })

      it("should navigate to dashboard on closing the scheduler window", () => {
        cy.intercept("/api/user/relationship-manager", {
          fixture: "RMAssigned",
        }).as("relationshipManager")

        cy.findByRole("button", { name: scheduleKeys.button.close }).click()
        cy.location("pathname").should("equal", "/")

        cy.wait([
          "@portfolioOpportunities",
          "@relationshipManager",
          "@userQualificationStatus",
          "@dashboardInsights",
          "@userStatus",
          "@upcomingWebinars",
          "@recentWebinars",
        ])
      })

      it("should view RM details on schedule meeting screen when RM is assigned to user", () => {
        cy.findByLabelText("rmCard").find("button").should("have.length", 2)

        cy.findByRole("button", {
          name: homeKeys.cta.relationshipManager.button.meeting,
        }).click({
          force: true,
        })
        cy.location("pathname").should("equal", "/schedule-meeting")

        cy.fixture("RMAssigned").then((json) => {
          let rmAssigned = json.manager.firstName + " " + json.manager.lastName

          cy.findByLabelText("rmName").should("contain.text", rmAssigned)
        })
      })

      it("should preselect timezone for GCC country UAE", () => {
        let expectedTimeZone = timeZones.find(
          (t) => t.value === timeZoneKeys["Arabian-Standard-Time"],
        )

        const zone = timeZoneKeys[expectedTimeZone.label]

        cy.intercept("/api/user", { fixture: "userUAEResidence" }).as("user")
        cy.visit("/schedule-meeting")

        cy.findAllByLabelText("timeZone")
          .eq(0)
          .should("contain.text", `${zone} ${expectedTimeZone.offset}`)
      })

      it("should preselect timezone for GCC country Saudi Arabia", () => {
        let expectedTimeZone = timeZones.find(
          (t) => t.value === timeZoneKeys["Arab-Standard-Time"],
        )
        cy.intercept("/api/user", { fixture: "userSaudiResidence" }).as("user")
        cy.visit("/schedule-meeting")

        cy.findAllByLabelText("timeZone")
          .eq(0)
          .should(
            "contain.text",
            `${expectedTimeZone.value} ${expectedTimeZone.offset}`,
          )
      })

      it("should preselect timezone for GCC country Qatar", () => {
        let expectedTimeZone = timeZones.find(
          (t) => t.value === timeZoneKeys["Arab-Standard-Time"],
        )
        cy.intercept("/api/user", { fixture: "userQatarResidence" }).as("user")
        cy.visit("/schedule-meeting")

        cy.findAllByLabelText("timeZone")
          .eq(0)
          .should(
            "contain.text",
            `${expectedTimeZone.value} ${expectedTimeZone.offset}`,
          )
      })

      it("should preselect timezone for GCC country Oman", () => {
        let expectedTimeZone = timeZones.find(
          (t) => t.value === timeZoneKeys["Arabian-Standard-Time"],
        )

        const zone = timeZoneKeys[expectedTimeZone.label]
        cy.intercept("/api/user", { fixture: "userOmanResidence" }).as("user")
        cy.visit("/schedule-meeting")

        cy.findAllByLabelText("timeZone")
          .eq(0)
          .should("contain.text", `${zone} ${expectedTimeZone.offset}`)
      })

      it("should preselect timezone for GCC country Kuwait", () => {
        let expectedTimeZone = timeZones.find(
          (t) => t.value === timeZoneKeys["Arab-Standard-Time"],
        )
        cy.intercept("/api/user", { fixture: "userKuwaitResidence" }).as("user")
        cy.visit("/schedule-meeting")

        cy.findAllByLabelText("timeZone")
          .eq(0)
          .should(
            "contain.text",
            `${expectedTimeZone.value} ${expectedTimeZone.offset}`,
          )
      })

      it("should preselect timezone for GCC country Bahrain", () => {
        let expectedTimeZone = timeZones.find(
          (t) => t.value === timeZoneKeys["Arab-Standard-Time"],
        )
        cy.intercept("/api/user", { fixture: "userKuwaitResidence" }).as("user")
        cy.visit("/schedule-meeting")

        cy.findAllByLabelText("timeZone")
          .eq(0)
          .should(
            "contain.text",
            `${expectedTimeZone.value} ${expectedTimeZone.offset}`,
          )
      })

      it("should preselect timezone for non GCC country India", () => {
        cy.intercept("/api/user", { fixture: "userIndiaResidence" }).as("user")
        cy.visit("/schedule-meeting")

        cy.findAllByLabelText("timeZone")
          .eq(0)
          .findByText(commonKeys.select.placeholder)
          .should("be.visible")
      })
    },
  )
})
