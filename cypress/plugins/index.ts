import encrypt from "../support/encrypt"

const plugins: Cypress.PluginConfig = (on, config) => {
  // Enable code coverage collection.
  require("@cypress/code-coverage/task")(on, config)

  on("task", { encrypt })

  return config
}

export default plugins
