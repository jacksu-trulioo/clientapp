import { getSession } from "@auth0/nextjs-auth0"
import { IncomingMessage, ServerResponse } from "http"
import ky from "ky"
import { NextApiRequest, NextApiResponse } from "next"

import siteConfig from "~/config"
import getDocumentDetails from "~/services/mytfo/client/documents/getDocumentDetails"
import getClientIp from "~/utils/getClientIp"

import changePassword from "./auth/changePassword"
import getToken from "./auth/getToken"
import login from "./auth/login"
import onBoardProfile from "./auth/onBoardProfile"
import requestPasswordReset from "./auth/requestPasswordReset"
import resendEmailVerification from "./auth/resendEmailVerification"
import sendOtp from "./auth/sendOtp"
import signup from "./auth/signup"
import updatePassword from "./auth/updatePassword"
import verificationEmail from "./auth/verificationEmail"
import verifyOtp from "./auth/verifyOtp"
import accountSummaries from "./client/account/accountSummaries"
import getClientProfile from "./client/account/get-profile"
import mandateAuthenticator from "./client/account/mandate-authentication"
import clientLogin from "./client/auth/login"
import getCashFlowDetails from "./client/cashflow/cashflowDetails"
import getTotalCommitmentDetails from "./client/commitment/getTotalCommitmentDetails"
import getDistributionDetails from "./client/deals/dealDistributionDetails"
import getClientDeals from "./client/deals/deals"
import getDistributionCapital from "./client/deals/distributionCapital"
import getRedemptionFund from "./client/deals/funds"
import getClientOpportunities from "./client/deals/getClientOpportunities"
import getCommitmentRelatedDeals from "./client/deals/getCommitmentRelatedDeals"
import getdealDetails from "./client/deals/getDealDetails"
import getInvestmentCart from "./client/deals/getInvestmentCart"
import getClientMeetingCalendar from "./client/deals/getMeetingCalendar"
import getPopupData from "./client/deals/getPopupData"
import getProgramDeals from "./client/deals/getProgramDeals"
import getSubscriptionDetails from "./client/deals/getSubscriptionDetails"
import getRedeemDetails from "./client/deals/redeemDetails"
import removeExpiredDealFromCart from "./client/deals/removeExpiredDeal"
import clientScheduleMeeting from "./client/deals/scheduleMeeting"
import updateClientOpportunities from "./client/deals/updateClientOpportunities"
import updatePopupData from "./client/deals/updatePopupData"
import getLastValuationDate from "./client/getLastValuationDate"
import getCardCategories from "./client/insights/getCardCategories"
import getClientArticles from "./client/insights/getClientArticles"
import getClientInsightDetails from "./client/insights/getClientInsightDetails"
import getClientManagementViews from "./client/insights/getClientManagementViews"
import getClientMonthlyMarketUpdates from "./client/insights/getClientMonthlyMarketUpdates"
import getClientPodcastVideos from "./client/insights/getClientPodcastVideos"
import getClientWebinars from "./client/insights/getClientWebinars"
import getClientWhitePapers from "./client/insights/getClientWhitePapers"
import getDisclaimerContent from "./client/insights/getDisclaimerContent"
import getHighlights from "./client/insights/getHighlights"
import getLatestInsights from "./client/insights/getLatestInsights"
import getTopWeekly from "./client/insights/getTopWeekly"
import getWatchlist from "./client/insights/getWatchlist"
import getWebinarGuestList from "./client/insights/getWebinarGuestList"
import crrData from "./client/miscellaneous/crrData"
import getGlossaries from "./client/miscellaneous/getGlossaries"
import getMarketAll from "./client/miscellaneous/getMarketAll"
import getPortfolioAcitivity from "./client/miscellaneous/getPortflioActivity"
import getTopDeals from "./client/performance/getQuarterWiseTopDeals"
import performanceDetails from "./client/performance/performanceDetails"
import profitLossDetails from "./client/profitloss/profitLossDetails"
import getClientUser from "./client/user/getUser"
import cancelMeeting from "./portfolio/cancelMeeting"
import getArticle from "./portfolio/getArticle"
import getArticles from "./portfolio/getArticles"
import getDashboardInsights from "./portfolio/getDashboardInsights"
import getFAQs from "./portfolio/getFAQs"
import getInsights from "./portfolio/getInsights"
import getManagementView from "./portfolio/getManagementView"
import getManagementViews from "./portfolio/getManagementViews"
import getMarketUpdate from "./portfolio/getMarketUpdate"
import getMarketUpdates from "./portfolio/getMarketUpdates"
import getMeetingCalendar from "./portfolio/getMeetingCalendar"
import getMeetingDetails from "./portfolio/getMeetingDetails"
import getMeetingInfo from "./portfolio/getMeetingInfo"
import getOpportunities from "./portfolio/getOpportunities"
import getOpportunity from "./portfolio/getOpportunity"
import getSampleDeals from "./portfolio/getSampleDeals"
import getTopArticles from "./portfolio/getTopArticles"
import getTopManagementViews from "./portfolio/getTopManagementViews"
import getTopMarketUpdates from "./portfolio/getTopMarketUpdates"
import getTopWebinars from "./portfolio/getTopWebinars"
import getTopWhitepapers from "./portfolio/getTopWhitepapers"
import getWebinar from "./portfolio/getWebinar"
import getWebinars from "./portfolio/getWebinars"
import getWhitepaper from "./portfolio/getWhitepaper"
import getWhitePapers from "./portfolio/getWhitepapers"
import getUpcomingWebinars from "./portfolio/insights/getUpcomingWebinars"
import getPastWebinars from "./portfolio/insights/webinars/getPastWebinars"
import getDeals from "./portfolio/proposal/deals"
import getDealInfo from "./portfolio/proposal/getDealsInfo"
import scheduleMeeting from "./portfolio/scheduleMeeting"
import simulatePortfolio from "./portfolio/simulatePortfolio"
import updateScheduledMeeting from "./portfolio/updateScheduledMeeting"
import addLogActivity from "./user/addLogActivity"
import createProfile from "./user/createProfile"
import getAbsherCitizenInfo from "./user/getAbsherCitizenInfo"
import getAcceptedProposal from "./user/getAcceptedProposal"
import getContactProposal from "./user/getContactProposal"
import getContactSummary from "./user/getContactSummary"
import getDisclaimer from "./user/getDisclaimer"
import getInteresetedOpportunities from "./user/getInteresetedOpportunities"
import getInvestorProfileGoals from "./user/getInvestorProfileGoals"
import getKycDocumentVerificationStatus from "./user/getKycDocumentVerificationStatus"
import getKycHybridFlowFlag from "./user/getKycHybridFlow"
import getKycInvestmentExperience from "./user/getKycInvestmentExperience"
import getKycPersonalInformation from "./user/getKycPersonalInformation"
import getKycStatus from "./user/getKycStatus"
import getLocation from "./user/getLocation"
import getOnboardingId from "./user/getOnboardingId"
import getPreference from "./user/getPreference"
import getProfile from "./user/getProfile"
import getProfileTrackerInfo from "./user/getProfileTrackerInfo"
import getProposalContactStatus from "./user/getProposalContactStatus"
import getProposals from "./user/getProposals"
import getProposalsStatus from "./user/getProposalsStatus"
import getProspects from "./user/getProspects"
import getQualificationsStatus from "./user/getQualificationsStatus"
import getRelationshipManager from "./user/getRelationshipManager"
import getRelationshipManagerDetails from "./user/getRelationshipManagerDetails"
import getRetakeRiskAssessment from "./user/getRetakeRiskAssessment"
import getRetakeRiskAssessmentResult from "./user/getRetakeRiskAssessmentResult"
import getRiskAssessment from "./user/getRiskAssessment"
import getRiskAssessmentResult from "./user/getRiskAssessmentResult"
import getShortCode from "./user/getShortCode"
import getStatus from "./user/getStatus"
import getSummary from "./user/getSummary"
import getTrackUnlockOpportunityFlow from "./user/getTrackUnlockOpportunityFlow"
import getUser from "./user/getUser"
import postProposals from "./user/postProposals"
import proposalReviewed from "./user/proposalReviewed"
import resetKycDocumentVerificationStatus from "./user/resetKycDocumentVerificationStatus"
import sendOtpForAbsher from "./user/sendOtpForAbsher"
import submitAcceptedProposal from "./user/submitAcceptedProposal"
import submitEmailEnquiry from "./user/submitEmailEnquiry"
import submitFeedback from "./user/submitFeedback"
import submitKycDocument from "./user/submitKycDocument"
import submitPreference from "./user/submitPreference"
import submitTrackUnlockOpportunityFlow from "./user/submitTrackUnlockOpportunityFlow"
import updateContactProposal from "./user/updateContactProposal"
import updateDisclaimer from "./user/updateDisclaimer"
import updateGeoLocationConsent from "./user/updateGeoLocationConsent"
import updateInterestedOpportunity from "./user/updateInterestedOpportunity"
import updateInvestorProfileGoals from "./user/updateInvestorProfileGoals"
import updateKycHybridFlow from "./user/updateKycHybridFlow"
import updateKycInvestmentExperience from "./user/updateKycInvestmentExperience"
import updateKycPersonalInformation from "./user/updateKycPersonalInformation"
import updateLoginState from "./user/updateLoginState"
import updatePhoneNumber from "./user/updatePhoneNumber"
import updatePreference from "./user/updatePreference"
import updateProfile from "./user/updateProfile"
import updateProposal from "./user/updateProposal"
import updateRiskAssessment from "./user/updateRiskAssessment"
import updateRiskAssessmentRetake from "./user/updateRiskAssessmentRetake"
import updateSimulatorInfo from "./user/updateSimulatorInfo"
import updateUserContact from "./user/updateUserContact"
import validateOtpForAbsher from "./user/validateOtpForAbsher"

type ApiHandler<T, U> = (baseHttpClient: typeof ky, params: U) => Promise<T>

type MyTfoClientOptions = {
  authRequired: boolean
  overrideLanguage?: string
  msType?: string
  additionalHeader?: AdditionalHeaderOptions[]
}

type AdditionalHeaderOptions = {
  key: string
  value: string
}

const {
  api: { baseUrl: prefixUrl },
} = siteConfig

export class MyTfoClient {
  // API services to expose on the client.
  public auth
  public portfolio
  public user
  public clientAuth
  public clientAccount
  public clientUser
  public clientDeals
  public clientPerformance
  public clientMiscellaneous
  public clientInsights
  public lastValuationDate
  public clientProfitLoss
  public clientCashFlows
  public clientCommitment
  public clientDocumentCenter

  constructor(
    req: NextApiRequest | IncomingMessage,
    res: NextApiResponse | ServerResponse,
    opts: MyTfoClientOptions = {
      authRequired: true,
      overrideLanguage: undefined,
      msType: undefined,
      additionalHeader: [],
    },
  ) {
    const baseUrl =
      opts?.msType == "PwC"
        ? process.env.NEXT_CLIENT_BASE_URL
        : opts.msType == "maverick"
        ? process.env.NEXT_CLIENT_AZURE_MS_BASE_URL
        : prefixUrl

    const baseHttpClient = ky.create({
      prefixUrl: baseUrl,
      retry: 0,
      hooks: {
        beforeRequest: [
          (request) => {
            if (opts.overrideLanguage) {
              request.headers.set("Accept-Language", opts.overrideLanguage)
            } else {
              const ref = req?.headers?.referer
              const locale =
                req.headers["accept-language"] === "ar" ||
                ref?.includes("/ar/") ||
                ref?.endsWith("/ar")
                  ? "ar"
                  : "en"

              request.headers.set("Accept-Language", locale)
            }

            if (!opts.authRequired) {
              return
            }

            const session = getSession(req, res)

            if (!session) {
              throw new Error("missing valid session")
            }

            const { mandateId, accessToken } = session

            request.headers.set("Authorization", `Bearer ${accessToken}`)

            if (opts.msType == "PwC") {
              if (process.env.NEXT_CLIENT_OSP_SUBSCRIPTION_KEY) {
                request.headers.set(
                  "Ocp-Apim-Subscription-Key",
                  process.env.NEXT_CLIENT_OSP_SUBSCRIPTION_KEY,
                )
              } else {
                throw new Error("Ocp-Apim-Subscription-Key is missing in .env")
              }
            } else if (opts.msType == "maverick") {
              request.headers.set("countrycode", "BH")
              request.headers.set("identifier", "auth0")
              request.headers.set("mandateid", mandateId)
            }

            if (opts.additionalHeader?.length) {
              opts.additionalHeader?.map(({ key, value }) => {
                request.headers.set(key, value)
              })
            }

            // Prevent falsely triggering Auth0 brute-force protection and suspicious
            // IP throttling by sending the user's IP address to Auth0.
            // See https://auth0.com/docs/authorization/flows/avoid-common-issues-with-resource-owner-password-flow-and-attack-protection#send-the-user-s-ip-address-from-your-server.
            const clientIp = getClientIp(req)
            if (clientIp) {
              request.headers.set("auth0-forwarded-for", clientIp)
            }

            // Country code set by the API gateway
            const IP_LOCATION_HEADER = "x-ip-location"
            if (req.headers[IP_LOCATION_HEADER]) {
              request.headers.set(
                IP_LOCATION_HEADER,
                req.headers[IP_LOCATION_HEADER] as string,
              )
            }
          },
        ],
      },
    })

    const withApiClient =
      <T, U>(handler: ApiHandler<T, U>) =>
      async (params: U = {} as U): Promise<T> => {
        return handler(baseHttpClient, params)
      }

    this.auth = {
      login: withApiClient(login),
      signup: withApiClient(signup),
      changePassword: withApiClient(changePassword),
      requestPasswordReset: withApiClient(requestPasswordReset),
      resendEmailVerification: withApiClient(resendEmailVerification),
      updatePassword: withApiClient(updatePassword),
      verificationEmail: withApiClient(verificationEmail),
      onBoardProfile: withApiClient(onBoardProfile),
      getToken: withApiClient(getToken),
      sendOtp: withApiClient(sendOtp),
      verifyOtp: withApiClient(verifyOtp),
    }
    this.portfolio = {
      simulatePortfolio: withApiClient(simulatePortfolio),
      getSampleDeals: withApiClient(getSampleDeals),
      getOpportunities: withApiClient(getOpportunities),
      getFAQs: withApiClient(getFAQs),
      getMeetingCalendar: withApiClient(getMeetingCalendar),
      scheduleMeeting: withApiClient(scheduleMeeting),
      getDashboardInsights: withApiClient(getDashboardInsights),
      getInsights: withApiClient(getInsights),
      getOpportunity: withApiClient(getOpportunity),
      getArticles: withApiClient(getArticles),
      getWhitePapers: withApiClient(getWhitePapers),
      getManagementViews: withApiClient(getManagementViews),
      getWebinars: withApiClient(getWebinars),
      getPastWebinars: withApiClient(getPastWebinars),
      getUpcomingWebinars: withApiClient(getUpcomingWebinars),
      getMarketUpdates: withApiClient(getMarketUpdates),
      getArticle: withApiClient(getArticle),
      getTopArticle: withApiClient(getTopArticles),
      getManagementView: withApiClient(getManagementView),
      getTopManagementViews: withApiClient(getTopManagementViews),
      getWebinar: withApiClient(getWebinar),
      getTopWebinars: withApiClient(getTopWebinars),
      getMarketUpdate: withApiClient(getMarketUpdate),
      getTopMarketUpdates: withApiClient(getTopMarketUpdates),
      getWhitepaper: withApiClient(getWhitepaper),
      getTopWhitepapers: withApiClient(getTopWhitepapers),
      getDeals: withApiClient(getDeals),
      getDealInfo: withApiClient(getDealInfo),
      cancelMeeting: withApiClient(cancelMeeting),
      getMeetingDetails: withApiClient(getMeetingDetails),
      getMeetingInfo: withApiClient(getMeetingInfo),
      updateScheduledMeeting: withApiClient(updateScheduledMeeting),
    }
    this.user = {
      getLocation: withApiClient(getLocation),
      createProfile: withApiClient(createProfile),
      getInvestorProfileGoals: withApiClient(getInvestorProfileGoals),
      getProfile: withApiClient(getProfile),
      getQualificationsStatus: withApiClient(getQualificationsStatus),
      getRelationshipManagerDetails: withApiClient(
        getRelationshipManagerDetails,
      ),
      getRiskAssessment: withApiClient(getRiskAssessment),
      getRiskAssessmentResult: withApiClient(getRiskAssessmentResult),
      getUser: withApiClient(getUser),
      updateInvestorProfileGoals: withApiClient(updateInvestorProfileGoals),
      updateProfile: withApiClient(updateProfile),
      updateRiskAssessment: withApiClient(updateRiskAssessment),
      getStatus: withApiClient(getStatus),
      submitEmailEnquiry: withApiClient(submitEmailEnquiry),
      submitPreference: withApiClient(submitPreference),
      updatePreference: withApiClient(updatePreference),
      getPreference: withApiClient(getPreference),
      getSummary: withApiClient(getSummary),
      getProposals: withApiClient(getProposals),
      getKycPersonalInformation: withApiClient(getKycPersonalInformation),
      updateKycPersonalInformation: withApiClient(updateKycPersonalInformation),
      updateKycInvestmentExperience: withApiClient(
        updateKycInvestmentExperience,
      ),
      sendOtpForAbsher: withApiClient(sendOtpForAbsher),
      validateOtpForAbsher: withApiClient(validateOtpForAbsher),
      postProposal: withApiClient(postProposals),
      getAbsherCitizenInfo: withApiClient(getAbsherCitizenInfo),
      getAcceptedProposal: withApiClient(getAcceptedProposal),
      submitAcceptedProposal: withApiClient(submitAcceptedProposal),
      getProposalsStatus: withApiClient(getProposalsStatus),
      getProposalContactStatus: withApiClient(getProposalContactStatus),
      getKycStatus: withApiClient(getKycStatus),
      updateProposal: withApiClient(updateProposal),
      updateContactProposal: withApiClient(updateContactProposal),
      getRetakeRiskAssessment: withApiClient(getRetakeRiskAssessment),
      updateRiskAssessmentRetake: withApiClient(updateRiskAssessmentRetake),
      getKycInvestmentExperience: withApiClient(getKycInvestmentExperience),
      submitKycDocument: withApiClient(submitKycDocument),
      getKycDocumentVerificationStatus: withApiClient(
        getKycDocumentVerificationStatus,
      ),
      getRetakRiskAssessmentResult: withApiClient(
        getRetakeRiskAssessmentResult,
      ),
      getDisclaimer: withApiClient(getDisclaimer),
      updateDisclaimer: withApiClient(updateDisclaimer),
      getKycHybridFlowFlag: withApiClient(getKycHybridFlowFlag),
      updateKycHybridFlowFlag: withApiClient(updateKycHybridFlow),
      getOnboardingId: withApiClient(getOnboardingId),
      updateGeoLocationConsent: withApiClient(updateGeoLocationConsent),
      resetKycDocumentVerificationStatus: withApiClient(
        resetKycDocumentVerificationStatus,
      ),
      updateSimulatorInfo: withApiClient(updateSimulatorInfo),
      getProfileTrackerInfo: withApiClient(getProfileTrackerInfo),
      updateLoginState: withApiClient(updateLoginState),
      submitTrackUnlockOpportunityFlow: withApiClient(
        submitTrackUnlockOpportunityFlow,
      ),
      getTrackUnlockOpportunityFlow: withApiClient(
        getTrackUnlockOpportunityFlow,
      ),
      getInteresetedOpportunities: withApiClient(getInteresetedOpportunities),
      updateInterestedOpportunity: withApiClient(updateInterestedOpportunity),
      updatePhoneNumber: withApiClient(updatePhoneNumber),
      getContactProposal: withApiClient(getContactProposal),
      getContactSummary: withApiClient(getContactSummary),
      getRelationshipManager: withApiClient(getRelationshipManager),
      getShortCode: withApiClient(getShortCode),
      submitFeedback: withApiClient(submitFeedback),
      addLogActivity: withApiClient(addLogActivity),
      updateUserContact: withApiClient(updateUserContact),
      getProspects: withApiClient(getProspects),
      proposalReviewed: withApiClient(proposalReviewed),
    }
    this.clientAuth = {
      login: withApiClient(clientLogin),
    }
    this.clientAccount = {
      mandateAuthenticator: withApiClient(mandateAuthenticator),
      getAccountSummaries: withApiClient(accountSummaries),
      profile: withApiClient(getClientProfile),
    }
    this.clientUser = {
      getUser: withApiClient(getClientUser),
    }
    this.clientPerformance = {
      getPerformanceDetails: withApiClient(performanceDetails),
      getTopDeals: withApiClient(getTopDeals),
    }
    this.clientDeals = {
      getDistributionDetails: withApiClient(getDistributionDetails),
      getClientOpportunities: withApiClient(getClientOpportunities),
      meetingCalendar: withApiClient(getClientMeetingCalendar),
      scheduleMeeting: withApiClient(clientScheduleMeeting),
      getClientDeals: withApiClient(getClientDeals),
      getDistributionCapital: withApiClient(getDistributionCapital),
      getPopupData: withApiClient(getPopupData),
      postPopUpDetails: withApiClient(updatePopupData),
      updateClientOpportunities: withApiClient(updateClientOpportunities),
      removeExpiredDealFromInvCart: withApiClient(removeExpiredDealFromCart),
      getRedemptionFund: withApiClient(getRedemptionFund),
      getRedeemDetails: withApiClient(getRedeemDetails),
      getInvestmentCart: withApiClient(getInvestmentCart),
      getDealDetails: withApiClient(getdealDetails),
      getCommitmentRelatedDeals: withApiClient(getCommitmentRelatedDeals),
      getProgramDeals: withApiClient(getProgramDeals),
      getSubscriptionDetails: withApiClient(getSubscriptionDetails),
    }
    this.clientCommitment = {
      getTotalCommitmentDetails: withApiClient(getTotalCommitmentDetails),
    }
    this.clientMiscellaneous = {
      crrAsset: withApiClient(crrData),
      getMarketAll: withApiClient(getMarketAll),
      getGlossaries: withApiClient(getGlossaries),
      getPortfolioAcitivity: withApiClient(getPortfolioAcitivity),
    }
    this.clientInsights = {
      getLatestInsights: withApiClient(getLatestInsights),
      getHighlights: withApiClient(getHighlights),
      getTopWeekly: withApiClient(getTopWeekly),
      getCardCategories: withApiClient(getCardCategories),
      getWatchlist: withApiClient(getWatchlist),
      getClientPodcastVideos: withApiClient(getClientPodcastVideos),
      getClientArticles: withApiClient(getClientArticles),
      getClientWebinars: withApiClient(getClientWebinars),
      getClientWhitePapers: withApiClient(getClientWhitePapers),
      getClientManagementViews: withApiClient(getClientManagementViews),
      getClientMonthlyMarketUpdates: withApiClient(
        getClientMonthlyMarketUpdates,
      ),
      getClientInsightDetails: withApiClient(getClientInsightDetails),
      getDisclaimerContent: withApiClient(getDisclaimerContent),
      getWebinarGuestList: withApiClient(getWebinarGuestList),
    }
    this.lastValuationDate = {
      getLastValuationDate: withApiClient(getLastValuationDate),
    }
    this.clientProfitLoss = {
      getProfitLossDetails: withApiClient(profitLossDetails),
    }
    this.clientCashFlows = {
      getCashFlowDetails: withApiClient(getCashFlowDetails),
    }
    this.clientDocumentCenter = {
      getDocumentDetails: withApiClient(getDocumentDetails),
    }
  }
}
