require("dotenv").config({ path: ".env.local" })

if (process.env.NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY) {
  let appInsights = require("applicationinsights")
  appInsights
    .setup(process.env.NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY)
    .setAutoCollectConsole(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectHeartbeat(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectRequests(true)
    .setAutoDependencyCorrelation(true)
    .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
    .setSendLiveMetrics(true)
    .setUseDiskRetryCaching(true)
  appInsights.defaultClient.setAutoPopulateAzureProperties(true)
  appInsights.start()
}
