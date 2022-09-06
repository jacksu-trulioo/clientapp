import "@testing-library/cypress/add-commands"
import "@cypress/code-coverage/support"
import "./auth0Client"
import "./clientAuth0WebAuth"
import "./getUserInfo"
import "./getClientUserInfo"
import "./getUserTokens"
import "./getMandateId"
import "./login"
import "./logout"
import "./loginBE"
import "./loginClient"
import "./clientCommands/checkDollarRounding"
import "./clientCommands/checkPercentageDecimal"
import "./clientCommands/scheduleMeet"
import "./loginSocial"
import "./clientCommands/filterBy"
import "./clientCommands/subscription"
import "./clientCommands/apiTesting"

import chaiJsonSchema from "chai-json-schema-ajv"
chai.use(chaiJsonSchema)

beforeEach(() => {
  Cypress.Cookies.defaults({
    preserve: ["appSession.0", "appSession.1", "appSession"],
  })
})

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on("uncaught:exception", (err) => {
  /* returning false here prevents Cypress from failing the test */
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false
  }
})
