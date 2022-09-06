import { ReactPlugin } from "@microsoft/applicationinsights-react-js"
import { ApplicationInsights } from "@microsoft/applicationinsights-web"

let reactPlugin: ReactPlugin
let appInsights: ApplicationInsights

const IS_BROWSER = typeof window !== "undefined"

const initializeAppInsights = () => {
  if (process.env.NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY && IS_BROWSER) {
    reactPlugin = new ReactPlugin()

    appInsights = new ApplicationInsights({
      config: {
        instrumentationKey:
          process.env.NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY,
        maxBatchInterval: 0,
        disableFetchTracking: false,
        extensions: [reactPlugin],
      },
    })
    appInsights.loadAppInsights()
  }
}

export { initializeAppInsights, reactPlugin }
