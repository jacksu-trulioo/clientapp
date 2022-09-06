import faker from "faker"
Cypress.Commands.add(
  "scheduleMeet",
  ({
    timeZone,
    datePickerAriaLabel,
    fillTime,
    meetingType,
    callReason,
    phoneNumberPrefix,
    lang,
  }) => {
    cy.fixture(`../../public/locales/${lang}/scheduleMeeting`).then(
      (scheduleMeetingKeys) => {
        if (timeZone) {
          cy.findByText(/ * GMT\+*/i).click()
          cy.findByRole("button", { name: timeZone }).click()
        }
        if (datePickerAriaLabel) {
          cy.findAllByPlaceholderText(
            scheduleMeetingKeys.availableDate.placeholder,
          )
            .eq(0)
            .click()
          cy.findByLabelText(datePickerAriaLabel).click()
          cy.wait(2000)
          if (fillTime == "random") {
            cy.findByText(scheduleMeetingKeys.availableTimeSlots.label).should(
              "be.visible",
            )
            cy.findAllByLabelText("timeSlot").then((timeSlot) => {
              let timeSlotIndex = faker.datatype.number(timeSlot.length)
              cy.wrap(timeSlot)
                .eq(timeSlotIndex - 1)
                .click()
            })
          }
          if (fillTime && fillTime != "random") {
            cy.findByText(fillTime).click()
          }
        }
        if (meetingType == "phoneCall") {
          cy.findAllByText(scheduleMeetingKeys.meetingType.options.phoneCall)
            .eq(0)
            .click()
          cy.findByRole("button", {
            name: scheduleMeetingKeys.meetingType.options[meetingType],
          }).click()
          cy.findByRole("button", {
            name: scheduleMeetingKeys.button.edit,
          }).click()
          cy.findByRole("group", { name: "phoneCountryCode" }).click()
          cy.findByRole("button", { name: phoneNumberPrefix }).click()
          cy.findByRole("textbox", { name: /phoneNumber/i }).type(
            faker.phone.phoneNumber("#########"),
          )
        }
        if (meetingType == "virtualMeeting") {
          cy.findAllByText(scheduleMeetingKeys.meetingType.options.phoneCall)
            .eq(0)
            .click()
          cy.findByRole("button", {
            name: scheduleMeetingKeys.meetingType.options[meetingType],
          }).click()
        }
        if (callReason) {
          cy.findByText(/Please select/i).click()
          cy.findByRole("button", {
            name: scheduleMeetingKeys.callReason.options[callReason],
          }).click()
        }
        cy.findByRole("button", {
          name: scheduleMeetingKeys.button.call,
        }).click()
      },
    )
  },
)
