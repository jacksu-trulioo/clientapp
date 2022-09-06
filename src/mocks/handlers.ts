import getAllocationsHandler from "./api/getAllocations.handler"
import getAllocationSpecificStrategyDetail from "./api/getAllocationSpecificStrategyDetail.handler"
import getAllocationStrategies from "./api/getAllocationStrategies.hander"
import getKycPersonalInformationHandler from "./api/getKycPersonalInformation.handler"
import getPastWebinarsHandler from "./api/getPastWebinars.handler"
import getProposalsStatusHandler from "./api/getProposalStatus.handler"
import getRecentWebinarsHandler from "./api/getRecentWebinars.handler"
import getRiskAssessmentResultHandler from "./api/getRiskAssessmentResult.handler"
import getUpcomingWebinarsHandler from "./api/getUpcomingWebinars.handler"
import insightsHandler from "./api/insights.handler"
import opportunitiesHandler from "./api/opportunities.handler"
import getQualificationsStatusHandler from "./api/qualificationsStatus.handler"
import relationshipManagerHandler from "./api/relationshipManager.handler"
import sampleDealsHandler from "./api/sampleDeals.handler"
import simulatorHandler from "./api/simulator.handler"
import statusHandler from "./api/status.handler"
import updateKycPersonalInformationHandler from "./api/updateKycPersonalInformation.handler"

export const handlers = [
  getPastWebinarsHandler,
  getRecentWebinarsHandler,
  getUpcomingWebinarsHandler,
  getQualificationsStatusHandler,
  getRiskAssessmentResultHandler,
  opportunitiesHandler,
  relationshipManagerHandler,
  sampleDealsHandler,
  simulatorHandler,
  statusHandler,
  insightsHandler,
  getAllocationsHandler,
  getKycPersonalInformationHandler,
  updateKycPersonalInformationHandler,
  getAllocationStrategies,
  getAllocationSpecificStrategyDetail,
  getProposalsStatusHandler,
]
