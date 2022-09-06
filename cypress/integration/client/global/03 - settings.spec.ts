describe("Settings", () => {
  let settingkeys
  let scheduleMeeting
  let authKeys
  let clientDashboard
  let clientDashboardkey
  let commonKeys

  before(() => {
    cy.loginClient()
    cy.fixture("../../public/locales/en/setting").then((keys) => {
      settingkeys = keys
    })
    cy.fixture("../../public/locales/en/scheduleMeeting").then((keys) => {
      scheduleMeeting = keys
    })
    cy.fixture("../../public/locales/en/auth").then((keys) => {
      authKeys = keys
    })
    cy.fixture("../../public/locales/ar/clientDashboard").then((keys) => {
      clientDashboard = keys
    })
    cy.fixture("../../public/locales/en/clientDashboard").then((keys) => {
      clientDashboardkey = keys
    })
    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })
  })

  context("Settings Landing Page", () => {
    it("should open settings page", () => {
      cy.visit("/client")
      // Click on the client ID
      cy.get("#menu-button-user-menu-button").click()
      cy.findByRole("menuitem", {
        name: commonKeys.nav.links.signout,
      }).should("be.visible")
      // Click on "settings" buton
      cy.findByRole("menuitem", {
        name: commonKeys.nav.links.setting,
      }).click()
      cy.wait(2000)
      cy.location("pathname", { timeout: 4000 }).should("match", /setting/)
      cy.findByText(settingkeys.heading).should("be.visible")
    })

    it("should Call RM /Financial Advisor", () => {
      // Go to settings
      // Click on the phone number in the schedule call card
      cy.findByRole("link", {
        name: settingkeys.rmDetail.options.call,
      }).should("be.visible")
    })

    it("should open mail browser", () => {
      // Go to settings
      // Click on the email id present in the schedule call card
      cy.findByRole("link", {
        name: settingkeys.rmDetail.options.email,
      }).should("be.visible")
    })

    it("should open schedule meeting modal", () => {
      // Go to settings
      // Click on "schedule a meeting"
      cy.findByText(settingkeys.rmDetail.options.scheduleMeeting).click()
      cy.location("pathname", { timeout: 4000 }).should(
        "match",
        /schedule-meeting/,
      )
      cy.findByRole("paragraph", {
        name: scheduleMeeting.rmAssigned.header.title,
      }).should("not.be.null")
      cy.findByRole("button", {
        name: "Close schedule meeting modal",
      }).click()
    })

    it("should be able to switch accounts/IDs", () => {
      // Go to settings
      // Go to "Viewing account"
      // click on the text field
      // click on the client id dropdown
      // Click on any ID present in the list
      cy.findByRole("combobox").clear().type("37031{enter}")
      cy.wait(4000)
      cy.findAllByText("Client ID #37031").should("be.visible")
      cy.wait(2000)
      cy.get("#menu-button-user-menu-button").click()
      cy.findByRole("menuitem", {
        name: commonKeys.nav.links.setting,
      }).click()
      cy.wait(2000)
      cy.location("pathname", { timeout: 4000 }).should("match", /setting/)
      cy.findByRole("combobox").clear().type("37001{enter}")
      cy.wait(4000)
      cy.findAllByText("Client ID #37001").should("be.visible")
    })

    it("should change the site to Arabic", () => {
      cy.visit("/client")
      // Go to settings page
      cy.get("#menu-button-user-menu-button").click()
      cy.findByRole("menuitem", {
        name: commonKeys.nav.links.setting,
      }).click()
      cy.wait(2000)
      cy.location("pathname", { timeout: 4000 }).should("match", /setting/)
      cy.findByText(settingkeys.heading).should("be.visible")
      cy.findAllByText(`${settingkeys.language.subTitle}:`).should("be.visible")
      // Click on Arabic toggle under language preferences and click on save
      cy.findAllByText(settingkeys.language.ar).last().click()
      cy.findByRole("button", { name: commonKeys.button.save }).click()
      cy.location("pathname", { timeout: 4000 }).should("match", /client/)
      cy.findByText(clientDashboard.description).should("be.visible")
      // To check if the language is saved- click on menu and click on sign out
      // Enter username/email and password and click on login button
    })

    it("should change the site to English", () => {
      cy.visit("/client")
      // Go to settings page
      cy.get("#menu-button-user-menu-button").click()
      cy.findByRole("menuitem", {
        name: commonKeys.nav.links.setting,
      }).click()
      cy.wait(2000)
      cy.location("pathname", { timeout: 4000 }).should("match", /setting/)
      cy.findByText(settingkeys.heading).should("be.visible")
      cy.findAllByText(`${settingkeys.language.subTitle}:`).should("be.visible")
      // Click on English toggle under language preferences and click on save
      cy.findAllByText(settingkeys.language.en).last().click()
      cy.findByRole("button", { name: commonKeys.button.save }).click()
      cy.location("pathname", { timeout: 4000 }).should("match", /client/)
      cy.findByText(clientDashboardkey.description).should("be.visible")
      // To check if the language is saved- click on menu and click on sign out
      // Enter username/email and password and click on login button
    })

    it.skip("(YET TO DEVELOP)should open change password page", () => {
      // Go to settings
      // Click on "change password" button
    })
  })

  context("Terms and Conditions", () => {
    it("should open the Terms of Services and then close the modal", () => {
      // Click on the client ID on the Top Nav bar and click the settings button
      cy.get("#menu-button-user-menu-button").click()
      cy.findByRole("menuitem", {
        name: commonKeys.nav.links.setting,
      }).click()
      cy.wait(2000)
      cy.location("pathname", { timeout: 4000 }).should("match", /setting/)
      // Go to "more" section
      // Click on "Terms of Services"
      cy.findByRole("button", {
        name: settingkeys.more.button.terms,
      }).click()
      cy.findByText(authKeys.signup.tos.title).should("be.visible")
      // On clicking the "x" icon
      cy.findByRole("button", {
        name: commonKeys.button.close,
      }).click()
    })
  })

  context("Disclaimer", () => {
    it("should open the disclaimer and then close the modal", () => {
      // Click on the client ID on the Top Nav bar and click the settings button
      // Go to "more" section
      // Click on "Disclaimer"
      cy.findByRole("button", {
        name: settingkeys.more.button.disclaimer,
      }).click()
      cy.findByRole("heading", {
        name: "Disclaimer",
      }).should("be.visible")
      // On clicking the "x" icon
      cy.findByRole("button", {
        name: commonKeys.button.close,
      }).click()
    })
  })

  context("Invite your friends", () => {
    it("should copy the Invite link", () => {
      // Click on the client ID on the Top Nav bar and click the settings button
      cy.visit("/client")
      cy.get("#menu-button-user-menu-button").click()
      // click on Invite your friends
      cy.findByRole("menuitem", {
        name: commonKeys.nav.links.shareInvite,
      }).click()
      cy.findByText(commonKeys.shareInviteModal.cta.copyLink).click()
      cy.findByText(commonKeys.shareInviteModal.message).should("be.visible")
      // Close the Dailog box
      cy.findByRole("button", {
        name: commonKeys.button.close,
      }).click()
      cy.wait(1000)
      // cancel
      cy.get("#menu-button-user-menu-button").click()
      cy.findByRole("menuitem", {
        name: commonKeys.nav.links.shareInvite,
      }).click()
      cy.findByText(commonKeys.shareInviteModal.cta.cancel).click()
    })
  })
})
