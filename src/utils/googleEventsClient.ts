import { ClientGTagEvent, ClientUniGTagEvent } from "./gtag"

const selectOpportunityDashboardAction: string = "dealSelectedClient"
const sortInvestmentsAction: string = "dealsCurrentSortClient"
const openInsightsArticlesAction: string = "featureArticleOpenedClient"
const InsightsMarketArchiveArticlesAction: string =
  "featureArticleOpenedMarArcPageClient"
const mandateIdSwitchAction: string = "selectMandateIDClient"
const filterInvestmentsAction: string = "dealsFilteredClient"
const sortCommitmentsAction: string = "commitmentsCurrentSortClient"
const filterCommitmentsAction: string = "commitmentsFilteredClient"
const clickSynthesiaAction: string = "isClickSynthesiaClient"
const clickOnOpportunitiesFromNavBarAction: string =
  "isOpportunitiesLandingPageClient"
const viewAllDealsOpportunitiesLandingPageAction: string =
  "isClickViewAllDealsClient"
const tappedRMEmailAction: string = "relationshipManagerEmailTappedClient"
const tappedRMPhoneAction: string = "relationshipManagerPhoneTappedClient"
const loadMorePerformanceAction: string = "loadMorePerformanceClient"
const viewDetailsOpportunitiesLandingPageAction: string =
  "checkedNewOpportunityClient"
const tapInterestInOpportunitiesAction: string = "dealAddedToInterestedClient"
const tapImageVideoOfDealAction: string = "tapMediaInNewOpportunityClient"
const clickInvestmentCartAction: string = "dealSheetAddedToCartClient"
const addToInvestmentCartAction: string = "dealAddedToCartClient"
const removeItemFromCartAction: string = "dealRemovedFromInvestmentCartClient"
const loginAction: string = "loginSuccessfulWithCredentialsClient"
const timeOpenArticleAction: string = "featureArticleOpeningTimeClient"
const timeOpenArticleFromMarketArchiveAction: string =
  "featureArticleOpeningTimeMarArcPageClient"
const tapNotInterestInOpportunitiesAction: string =
  "dealRemovedFromInterestedClient"
const scheduleAMeetingSelectedTimeAction: string =
  "scheduleAMeetingSelectedTimeClient"
const scheduleAMeetingSelectedOptionAction: string =
  "scheduleAMeetingSelectedOptionClient"
const viewDocumentAction: string = "docCenterViewsClient"
const downloadDocumentAction: string = "docCenterDownloadsClient"
const clickRedeemInvCartAction: string = "dealRedemptionPg1Client"
const confirmDealRedemptionAction: string = "dealRedemptionPg2Client"
const clickExitRedemptionPg1Action: string =
  "exitBeforeDealsRedemptionPg1Client"
const featureArticleReadingTimeAction: string =
  "featureArticleReadingTimeClient"
const readDealSheetTimeAction: string = "dealSheetReadingTimeClient"
const scheduleMeetingOpeTimeAction: string = "scheduleAMeetingOpeningTimeClient"
const screenSpentTimeSynthesiaAction: string = "screenSpentTimeSynthesiaClient"
const screenSpentTimeAction: string = "screenSpentTimeClient"
const exitScreen1SubscriptionPageAction: string =
  "exitBeforeDealsSubscriptionPg2Client"
const exitScreen2SubscriptionPageAction: string =
  "exitBeforeDealsSubscriptionPg3Client"
const exitScreen4SubscriptionPageAction: string =
  "exitBeforeDealsSubscriptionPg4Client"
const clickedNextScreen1SubscriptionPageAction: string =
  "dealsSubscriptionPg2Client"
const clickedNextScreen2SubscriptionPageAction: string =
  "dealsSubscriptionPg3Client"
const clickedConfirmScreen4SubscriptionPageAction: string =
  "dealsSubscriptionPg4Client"
const utmCaptureAction: string = "utmCapturedClient"
const languageToggleAction: string = "languageToggled"
const referralLinkGeneratedAction: string = "referralLinkGeneratedClient"
const feedbackInitiatedAction: string = "feedbackInitiatedClient"
const downloadedExcelAction: string = "downloadedExcelClient"

export const selectOpportunityDashboard: ClientUniGTagEvent = {
  action: selectOpportunityDashboardAction,
  label: "Selects any deal / opportunity on the dashboard",
}

export const sortInvestments: ClientUniGTagEvent = {
  action: sortInvestmentsAction,
  label: "Sort in Investments",
}

export const openInsightsArticles: ClientUniGTagEvent = {
  action: openInsightsArticlesAction,
  label: "Opens any featured articles in the insights landing page",
}

export const openInsightsMarketArchiveArticles: ClientUniGTagEvent = {
  action: InsightsMarketArchiveArticlesAction,
  label:
    "Opens any featured articles in the insights -> market archive section",
}

export const mandateIdSwitch: ClientUniGTagEvent = {
  action: mandateIdSwitchAction,
  label: "Switches the mandateID in the Settings page",
}

export const filterInvestments: ClientUniGTagEvent = {
  action: filterInvestmentsAction,
  label: "Filter in Investments",
}

export const sortCommitments: ClientUniGTagEvent = {
  action: sortCommitmentsAction,
  label: "Sort in Commitments",
}

export const filterCommitments: ClientUniGTagEvent = {
  action: filterCommitmentsAction,
  label: "Filter in Commitments",
}

export const clickOnSynthesia: ClientUniGTagEvent = {
  action: clickSynthesiaAction,
  label: "clicks on the Synthesia Video on dashboard",
}

export const clickOnOpportunitiesFromNavBar: ClientUniGTagEvent = {
  action: clickOnOpportunitiesFromNavBarAction,
  label:
    "Clicks on the opportunities tab on the nav panel and lands on the opportunities landing page",
}

export const viewAllDealsOpportunitiesLandingPage: ClientUniGTagEvent = {
  action: viewAllDealsOpportunitiesLandingPageAction,
  label: "User clicks on the view all deals on the opportunities landing page",
}

export const tappedRMEmail: ClientUniGTagEvent = {
  action: tappedRMEmailAction,
  label: "Users tapped the RM email",
}

export const tappedRMPhone: ClientUniGTagEvent = {
  action: tappedRMPhoneAction,
  label: "Users tapped the RM phone",
}

export const loadMorePerformance: ClientUniGTagEvent = {
  action: loadMorePerformanceAction,
  label: "User taps on “load more” in performance",
}

export const viewDetailsOpportunitiesLandingPage: ClientUniGTagEvent = {
  action: viewDetailsOpportunitiesLandingPageAction,
  label: "User clicks view details on an opportunity in landing page",
}

export const tapInterestInOpportunities: ClientUniGTagEvent = {
  action: tapInterestInOpportunitiesAction,
  label: "User tap interest at a deal in landing page",
}

export const tapImageVideoOfDeal: ClientUniGTagEvent = {
  action: tapImageVideoOfDealAction,
  label: "User tap image/video of a deal in landing page",
}

export const clickInvestmentCart: ClientUniGTagEvent = {
  action: clickInvestmentCartAction,
  label: "User clicks on Investment Cart in deal details page",
}

export const addToInvestmentCart: ClientUniGTagEvent = {
  action: addToInvestmentCartAction,
  label: "User clicks on add to cart button",
}

export const removeItemFromInvestmentCart: ClientUniGTagEvent = {
  action: removeItemFromCartAction,
  label:
    "Cross button clicked to remove a deal / program from the investment cart",
}

export const login: ClientGTagEvent = {
  action: loginAction,
}

export const timeOpenArticle: ClientGTagEvent = {
  action: timeOpenArticleAction,
}

export const timeOpenArticleFromMarketArchive: ClientGTagEvent = {
  action: timeOpenArticleFromMarketArchiveAction,
}

export const tapNotInterestInOpportunities: ClientUniGTagEvent = {
  action: tapNotInterestInOpportunitiesAction,
  label: "User tap not interest in a deal in landing page",
}

export const selectScheduleMeetingSlot: ClientUniGTagEvent = {
  action: scheduleAMeetingSelectedTimeAction,
  label: "Slot which user selects for scheduling a meeting",
}

export const selectScheduleMeetingOption: ClientUniGTagEvent = {
  action: scheduleAMeetingSelectedOptionAction,
  label: "Meeting Option which users selects for scheduling a meeting",
}

export const viewDocument: ClientUniGTagEvent = {
  action: viewDocumentAction,
  label: "View document in document center",
}

export const downloadDocument: ClientUniGTagEvent = {
  action: downloadDocumentAction,
  label: "Download document in document center",
}

export const clickRedeemInvCart: ClientUniGTagEvent = {
  action: clickRedeemInvCartAction,
  label: "Clicks on Redeem after entering cart",
}

export const confirmDealRedemption: ClientUniGTagEvent = {
  action: confirmDealRedemptionAction,
  label: "Confirm on screen2 in Redemption page",
}

export const clickExitRedemptionPg1: ClientUniGTagEvent = {
  action: clickExitRedemptionPg1Action,
  label: "Clicks on Exit on screen1 in Redemption page",
}

export const readFeatureArticleTime: ClientUniGTagEvent = {
  action: featureArticleReadingTimeAction,
  label: "Time user stayed on feature article",
}

export const readDealSheetTime: ClientUniGTagEvent = {
  action: readDealSheetTimeAction,
  label: "Time spending on the deal sheet (Deal details) page",
}

export const openScheduleMeetingTime: ClientUniGTagEvent = {
  action: scheduleMeetingOpeTimeAction,
  label: "Time at which user opens the schedule meeting",
}

export const screenSpentTimeSynthesia: ClientUniGTagEvent = {
  action: screenSpentTimeSynthesiaAction,
  label: "Time spending on the Synthesia Video screen",
}

export const screenSpentTime: ClientUniGTagEvent = {
  action: screenSpentTimeAction,
  label: "Time spending on the screen",
}

export const exitScreen1SubscriptionPage: ClientUniGTagEvent = {
  action: exitScreen1SubscriptionPageAction,
  label: "User clicks on Exit on screen1 in Subscriptions page",
}

export const exitScreen2SubscriptionPage: ClientUniGTagEvent = {
  action: exitScreen2SubscriptionPageAction,
  label: "User clicks on Exit on screen2 in Subscriptions page",
}

export const exitScreen4SubscriptionPage: ClientUniGTagEvent = {
  action: exitScreen4SubscriptionPageAction,
  label: "User clicks on Exit on screen4 in Subscriptions page",
}

export const clickedNextScreen1SubscriptionPage: ClientUniGTagEvent = {
  action: clickedNextScreen1SubscriptionPageAction,
  label: "User clicks on Next on screen1 in Subscriptions page",
}

export const clickedNextScreen2SubscriptionPage: ClientUniGTagEvent = {
  action: clickedNextScreen2SubscriptionPageAction,
  label: "User clicks on Next on screen2 in Subscriptions page",
}

export const clickedConfirmScreen4SubscriptionPage: ClientUniGTagEvent = {
  action: clickedConfirmScreen4SubscriptionPageAction,
  label: "User clicks on confirm on screen4 in Subscriptions page",
}

export const utmCapture: ClientGTagEvent = {
  action: utmCaptureAction,
}

export const languageToggle: ClientUniGTagEvent = {
  action: languageToggleAction,
  label: "User clicks on language toggle",
}

export const feedbackInitiated: ClientUniGTagEvent = {
  action: feedbackInitiatedAction,
  label: "User submitted the feedback",
}

export const referralLink: ClientGTagEvent = {
  action: referralLinkGeneratedAction,
}

export const downloadedExcel: ClientGTagEvent = {
  action: downloadedExcelAction,
}
