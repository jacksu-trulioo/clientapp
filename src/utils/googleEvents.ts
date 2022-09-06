import { GTagEvent } from "./gtag"

const signUpAction: string = "Sign-up"
const loginAction: string = "Login"
const portfolioSimulatorAction: string = "Portfolio simulator"
const preProposalAction: string = "Pre-proposal conversion"
const investmentOpportunitiesAction: string = "Investment opportunities"
const resetPasswordAction: string = "Reset password"
const languageResetAction: string = "Language reset"
const changePasswordAction: string = "Change Password"
const insightAction: string = "Engagement with insights"
const proposalAction: string = "Proposal"
const scheduleCall: string = "Schedule Call"
const socialLoginAction: string = "Social Login"
const socialSignupAction: string = "Social Signup"
const playOpportunityVideo: string = "Opportunity Video"
const investmentGoalsStart = "Start Investment Goals"
const investorProfilestart = "Start Investor Profile"
const riskAssessmentStart = "Start Risk Assessment"
const leftNavigationSimulatorClick = "Left Navigation Simulator"
const leftNavigationPersonalizedProposalClick =
  "Left Navigation Personalized Proposal"
const leftNavigationOpportunitiesClick = "Left Navigation Opportunities"
const leftNavigationInsightsClick = "Left Navigation Insights Click"
const strategyAllocationTab = "Strategy Allocation Tab"
const viewStrategyDeal = "View Strategy Deal"
const automaticQualificationInitiated = "Automatic Qualification"
//KYC
const kycAction: string = "Kyc"
const personalInformationPage1: string =
  "KYC - Complete first Personal Information page"
const personalInformationPage2: string =
  "KYC - Complete second Personal Information page"
const addressDetailsPage: string = "KYC - Complete Address details page"
const additionalAddressDetailsPage: string =
  "KYC -  Complete Additional Address details page"
const idDocumentDetailsPage: string = "KYC - Complete ID Document details page"
const employmentDetailsPage: string = "KYC - Complete Employment details page"
const employerDetailsPage: string = "KYC - Complete Employer details page"
const incomeAndWealthDetailsPage: string =
  "KYC - Complete Income and Wealth details page"
const firstTaxationInfoPage: string =
  "KYC - Complete first Taxation Information page"
const secondTaxationInfoPage: string =
  "KYC - Complete second Taxation Information page"
const papConformationPage: string = "KYC - Complete PEP Confirmation page"
const currentWealthDistributionPage: string =
  "KYC - Complete Current Investments - Wealth Distribution page"
const currentConcentratedPage: string =
  "KYC - Complete Current Investments - Concentrated Positions page"
const investmentAdvisoryPage: string =
  "KYC - Complete Investment Advisory and Financial Instruments page"
const finantialTransactionPage: string =
  "KYC - Complete Financial Transactions page"
const passportInfoPage: string =
  "KYC - Complete Passport Information page upload"
const passportSignaturePage: string =
  "KYC - Complete Passport Signature page upload"
const idFront: string = "KYC - Complete ID Front upload"
const idBack: string = "KYC - Complete ID Back upload"
const livePhoto: string = "KYC - Complete Live Photo upload"
const scheduleVideoCall: string = "KYC - Complete video call scheduling"
const nationalSingleSignOn: string =
  "KYC - Complete entering credentials for National Single Sign on "
const enterOtpPage: string = "KYC - Complete entering the OTP"
const personalInformationSummaryPage: string =
  "KYC - Complete Personal Information Summary page"
const additionalInformationPage: string =
  "KYC - Complete Additional Personal Information page"

const whoIsThisPortfolioFor: string = "Who is this portfolio for"
const shouldGenerateIncome: string = "Should Generate Income"
const TopUpInvestmentAnnually: string = "TopUpInvestmentAnnually"
const InvestmentGoals: string = "InvestmentGoals"
const additionalPreferences: string = "AdditionalPreferences"
const investmentAmount: string = "Investment Amount"
const annualIncrease: string = "Annual Increase"
const timeHorizon: string = " Time Horizon"
const annualIncreasePercent: string = "Annual Increase Percent"
const exclusiveOppAction: string = "Exclusive opp"
const simulatorAction: string = "Portfolio Simulator Tour"
const investmentOppAction: string = "Investment opp"
const webinarAction: string = "Webinar"
const exclusiveInsightsAction: string = "Exclusive insights"
const helpAction: string = "We'er here to help"
const exitTourModalAction: string = "Exit"
const onboardProfile: string = "Onboard Profile"
const playVideoOnSignupAction: string = "Play video"
const interestedUnterestedOpportunity: string =
  "Interested Uninterested Opportunity"
const otpSuccessfullySent: string = "OTP successfully Sent"
const generateProposalDashboard: string = "Generate Proposal Dashboard"
const updatePhoneNumberAction: string = "Update phone number"
const opportunitiesViewAllCTA: string = "Opp View all CTA"
const marketReactionViewEvent: string =
  "How Did Markets React After The Interest Rate Hikes? CTA"
const newMarketPhaseEvent: string =
  "A New Market Phase Amid Higher Inflation And Raising Interest Rates CTA"
const unlockButtonLeftNavigation: string =
  "How many users clicked on unlock from left navigation"

const downloadDealOnePagerCTA: string =
  "How many users downloaded deal one pager for a deal"

const inviteFriendCTA: string = "How many users invited friends"
const copyLinkForSharingCTA: string = "How many users copied the link"
const scheduleMeetingOppertunities: string =
  "Schedule a call from opportunity page"
const continuePreProposalJourney: string = "Continue pre-proposal journey"
const getProposal: string = "Get proposal"
const viewOpportunities: string = "View opporutinities"
const openDealTab: string = "Open tab"
const closedDealTab: string = "Close tab"

const joinNowCTA: string = "Joined the platform CTA"
export const SignUpStartEvent: GTagEvent = {
  category: "Start sign-up",
  action: signUpAction,
  label: "Sign up CTA",
}

export const SignUpAcceptedTermsConditionEvent: GTagEvent = {
  category: "Accepted T&Cs",
  action: signUpAction,
  label: "Accepted T&Cs",
}

export const SignUpEmailVerifiedEvent: GTagEvent = {
  category: "Email Verified",
  action: signUpAction,
  label: "Complete email verification",
}

export const SignUpRegisterSuccessfullyEvent: GTagEvent = {
  category: "Register successfully",
  action: signUpAction,
  label: "Complete registration CTA with all info filled",
}

export const LoginStartedEvent: GTagEvent = {
  action: loginAction,
  category: "Start login",
  label: "Login CTA",
}

export const LoginSuccessfullyEvent: GTagEvent = {
  action: loginAction,
  category: "Login successfully",
  label: "Land inside the app",
}

export const TrySimulatorEvent: GTagEvent = {
  category: "Try portfolio simulator",
  action: portfolioSimulatorAction,
  label: "Portfolio simulator CTA",
}

export const SimulatorUseEvent: GTagEvent = {
  category: "Use simulator",
  action: portfolioSimulatorAction,
  label: "Simulation updates",
}

export const StartPreProposalQsEvent: GTagEvent = {
  category: "Start the pre-proposal Qs",
  action: preProposalAction,
  label: "Start investing CTA",
}

export const CompleteInvestorProfileEvent: GTagEvent = {
  category: "Complete investor profile",
  action: preProposalAction,
  label: "Complete investor profile",
}

export const CompleteInvestorGoalsEvent: GTagEvent = {
  category: "Complete investor goals",
  action: preProposalAction,
  label: "Complete investor goals",
}

export const QualifiedAutomaticallyEvent: GTagEvent = {
  category: "Qualified automaticallys",
  action: preProposalAction,
  label: "Qualified automatically",
}

export const NeedManualQualificationEvent: GTagEvent = {
  category: "Need manual qualification",
  action: preProposalAction,
  label: "Need manual qualification",
}

export const InvestmentEnterTheUnlockFlowEvent: GTagEvent = {
  category: "Enter the unlock flow",
  action: investmentOpportunitiesAction,
  label: "Unlock CTA on dashboard",
}

export const InvestmentEnterTheUnlockFlowFromopportunitiesTabEvent: GTagEvent =
  {
    category: "Enter the unlock flow",
    action: investmentOpportunitiesAction,
    label: "Unlock CTA on opportunities tab",
  }

export const InvestmentStartUnlockFlowEvent: GTagEvent = {
  category: "Start unlock flow",
  action: investmentOpportunitiesAction,
  label: "Start CTA on first page of the unlock flow",
}

export const InvestmentQualifiedAutomaticallyEvent: GTagEvent = {
  category: "Qualified automaticallys",
  action: investmentOpportunitiesAction,
  label: "Qualified automatically",
}

export const InvestmentNeedManualQualificationEvent: GTagEvent = {
  category: "Need manual qualification",
  action: investmentOpportunitiesAction,
  label: "Need manual qualification",
}

export const InvestmentViewOpportuntiesDetailsEvent: GTagEvent = {
  category: "View a specific opportunity in details",
  action: investmentOpportunitiesAction,
  label: "Click View details CTA",
}

export const ForgetPasswordEvent: GTagEvent = {
  category: "Choose forget password",
  action: resetPasswordAction,
  label: "Forget password CTA",
}

export const ForgetPasswordSendEmailVerificationEvent: GTagEvent = {
  category: "Send email verification",
  action: resetPasswordAction,
  label: "Send email CTA",
}

export const ForgetPasswordEmailVerifiedEvent: GTagEvent = {
  category: "Email verified",
  action: resetPasswordAction,
  label: "Email verified CTA",
}

export const ForgetPasswordChangeSuccessEvent: GTagEvent = {
  category: "Password change success",
  action: resetPasswordAction,
  label: "Password change success",
}

export const ProfileSelectionEvent: GTagEvent = {
  category: "Go to profile",
  action: "Profile section",
  label: "Profile CTA",
}

export const LanguageChangeSuccessEvent: GTagEvent = {
  category: "Language change success",
  action: languageResetAction,
  label: "Changed language",
}

export const StartChangePasswordEvent: GTagEvent = {
  category: "Start change password",
  action: changePasswordAction,
  label: "Change password CTA",
}

export const PasswordChangeSuccessEvent: GTagEvent = {
  category: "Password change success",
  action: changePasswordAction,
  label: "Confirm CTA and password change success",
}

export const StartToViewInsightsFromInsightTabEvent: GTagEvent = {
  category: "Start to view insights",
  action: insightAction,
  label: "Entered the insight tab",
}

export const StartToViewInsightsFromDashboardEvent: GTagEvent = {
  category: "Start to view insights",
  action: insightAction,
  label: "Click on see more from dashboard",
}

export const ViewInsightDetailsFromDashboardEvent: GTagEvent = {
  category: "View insight details",
  action: insightAction,
  label: "Entered a knowledge content details from dashboard",
}

export const ViewInsightDetailsFromInsightTabEvent: GTagEvent = {
  category: "View insight details",
  action: insightAction,
  label: "Entered a knowledge content details from insight tab",
}
export const ContactedClientServiceMessageEvent: GTagEvent = {
  category: "Left a message",
  action: "Contacted Client Service",
  label: "Submit CTA on the pop up",
}

export const EmailSentForScheduledACallWithClientServiceEvent: GTagEvent = {
  category: "Scheduled a call successfully",
  action: "Schedule a call",
  label: "Email sent for scheduled a call",
}

export const OpenEditWindowEvent: GTagEvent = {
  category: "User invoking the edit window ",
  action: proposalAction,
  label: "Clicking 'Edit details' CTA",
}

export const UpdateProposalEvent: GTagEvent = {
  category: "Update the proposal",
  action: proposalAction,
  label: "'Update proposal' CTA",
}

export const RetakeassessmentEvent: GTagEvent = {
  category: "Retaking the risk assessment ",
  action: proposalAction,
  label: "Click Retake assessment",
}

export const ScheduleCallEvent: GTagEvent = {
  category: "Confirm schedule",
  action: scheduleCall,
  label: "Confirm schedule CTA",
}

export const AcceptProposalEvent: GTagEvent = {
  category: "Accepting the proposal",
  action: proposalAction,
  label: "'Accept proposal and start investing' CTA",
}

export const PersonalizedProposalLandingEvent: GTagEvent = {
  category: "Single proposal generation",
  action: proposalAction,
  label: "Direct landing to the proposal page",
}

export const CheckingShortLongProposalEvent: GTagEvent = {
  category: "Generation of short and long term proposal",
  action: proposalAction,
  label: "Invoking the selection window with short and long term options",
}

export const SelectShortLongProposalEvent: GTagEvent = {
  category: "User selecting a particular proposal type",
  action: proposalAction,
  label: "User selecting the short term proposal card and click 'Continue' CTA",
}

export const SelectIncomeGrowthProposalEvent: GTagEvent = {
  category: "User selecting a particular proposal type",
  action: proposalAction,
  label: "User selecting the yield  proposal card and click 'Continue' CTA",
}

export const CheckingIncomeGrowthProposal: GTagEvent = {
  category: "Generation of Growth and Yield proposals",
  action: proposalAction,
  label:
    "Invoking the selection window with Growth and Yield proposals options",
}

//KYC
export const StartKycPersonalInformationNationalSignOn: GTagEvent = {
  category: "Start national single sign on",
  action: kycAction,
  label: "'National Single sign on' CTA in the steps homepage window for KSA",
}

export const StartKycPersonalInformationManualEntry: GTagEvent = {
  category: "Start the manual entry",
  action: kycAction,
  label:
    "'Manual entry' option in the steps homepage window (for both KSA / other nationalities)",
}

export const StartKycInvestmentExperience: GTagEvent = {
  category: "Start investment experience",
  action: kycAction,
  label: "'Get Started' CTA of the investment experience section",
}

export const StartKycIdVerificationDesktopFlow: GTagEvent = {
  category: "Start the ID verification process using desktop flow",
  action: kycAction,
  label: "Continue on computer' CTA in the steps homepage",
}

export const StartKycIdVerificationHybridFlow: GTagEvent = {
  category: "Start the ID verification process using hybrid flow",
  action: kycAction,
  label: "Verify on mobile' CTA in the steps homepage",
}

export const SwitchingKycDesktopFlowToHybridFlow: GTagEvent = {
  category: "Start the ID verification process using desktop flow",
  action: kycAction,
  label: "Continue on computer' CTA in the steps homepage",
}

export const SwitchingKycHybridFlowToDesktopFlow: GTagEvent = {
  category: "Start the ID verification process using hybrid flow",
  action: kycAction,
  label: "Verify on mobile' CTA in the steps homepage",
}

export const OnboardingJourneyComplete: GTagEvent = {
  category: "Complete the KYC onboarding journey",
  action: kycAction,
  label: "Receipt of the success screen for the KYC flow",
}

export const googleLoginEvent: GTagEvent = {
  category: "Login using Google",
  action: socialLoginAction,
  label: "Google login option in the login page ",
}

export const twitterLoginEvent: GTagEvent = {
  category: "Login using Twitter",
  action: socialLoginAction,
  label: "Twitter login option in the login page ",
}

export const linkedInLoginEvent: GTagEvent = {
  category: "Login using LinkedIn",
  action: socialLoginAction,
  label: "LinkedIn login option in the login page ",
}

export const googleSignupEvent: GTagEvent = {
  category: "Signup using Google",
  action: socialSignupAction,
  label: "Google Signup option in the Signup page ",
}

export const twitterSignupEvent: GTagEvent = {
  category: "Signup using Twitter",
  action: socialSignupAction,
  label: "Twitter Signup option in the Signup page ",
}

export const linkedInSignupEvent: GTagEvent = {
  category: "Signup using LinkedIn",
  action: socialSignupAction,
  label: "LinkedIn Signup option in the Signup page ",
}

export const watchOpportunityVideo: GTagEvent = {
  category: "View the video embedded in a specific opportunity ",
  action: playOpportunityVideo,
  label: "View the video available",
}

export const articleDetailsPage: GTagEvent = {
  category: "Start viewing a particular article",
  action: insightAction,
  label: "View the article details page",
}

export const webinarDetailsPage: GTagEvent = {
  category: "Start viewing a particular Webinars",
  action: insightAction,
  label: "View the webinar details page",
}

export const whitepaperDetailsPage: GTagEvent = {
  category: "Start viewing a particular whitepapers",
  action: insightAction,
  label: "View the whitepaper details page",
}

export const managementViewsDetailsPage: GTagEvent = {
  category: "Start viewing a particular management views",
  action: insightAction,
  label: "View the management view details page",
}

export const marketUpdateDetailsPage: GTagEvent = {
  category: "Start viewing a particular market updates",
  action: insightAction,
  label: "View the market update details page",
}

export const leftNavigationPortfolioSimulator: GTagEvent = {
  category: "Use the Portfolio simulator link in left navigation",
  action: leftNavigationSimulatorClick,
  label: "Click on the portfolio simulator CTA in the left navigation",
}

export const leftNavigationPersonalizedProposal: GTagEvent = {
  category: "Use the proposal link in left navigation",
  action: leftNavigationPersonalizedProposalClick,
  label: "Click on the proposal CTA in the left navigation",
}

export const leftNavigationOpportunities: GTagEvent = {
  category: "Use the opportunities link in left navigation",
  action: leftNavigationOpportunitiesClick,
  label: "Click on the opportunities CTA in the left navigation",
}

export const leftNavigationInsights: GTagEvent = {
  category: "Use the insights link in left navigation",
  action: leftNavigationInsightsClick,
  label: "Click on the insights CTA in the left navigation",
}

export const strategyAllocationDetail: GTagEvent = {
  category: "Check each strategy in the proposal",
  action: strategyAllocationTab,
  label: "Click on the tab of available in the proposal",
}

export const clickDealMoreCTA: GTagEvent = {
  category: "Check each deal in the proposal",
  action: viewStrategyDeal,
  label: "Click on the 'More' CTA of",
}

export const startInvestmentGoals: GTagEvent = {
  category: "Start investment goals",
  action: investmentGoalsStart,
  label: "'Continue' CTA for Investment Goals",
}

export const startInvestorProfile: GTagEvent = {
  category: "Start investment goals",
  action: investorProfilestart,
  label: "'Continue' CTA for Investor profile",
}

export const startRiskAssessment: GTagEvent = {
  category: "Start investment goals",
  action: riskAssessmentStart,
  label: "'Continue' CTA for Risk assessment ",
}

export const automaticQualification: GTagEvent = {
  category: "Qualified automatically",
  action: automaticQualificationInitiated,
  label: "Qualified automatically",
}

export const CompleteFirstPersonalInformationPage: GTagEvent = {
  category: "Complete the first Personal Information page",
  action: personalInformationPage1,
  label: "Next' CTA on the first Personal Information page",
}

export const CompleteSecondPersonalInformationPage: GTagEvent = {
  category: "Complete the second Personal Information page",
  action: personalInformationPage2,
  label: "Next' CTA on the second Personal Information page",
}

export const CompleteAddressDetailsPage: GTagEvent = {
  category: "Complete the Address details page",
  action: addressDetailsPage,
  label: "Next' CTA on the Address details page",
}

export const CompleteAdditionalAddressDetailsPage: GTagEvent = {
  category: "Complete the Additional Address details page",
  action: additionalAddressDetailsPage,
  label: "Next' CTA on the Additional Address details page",
}

export const CompleteIdDocumentDetailsPage: GTagEvent = {
  category: "Complete the ID Document details page",
  action: idDocumentDetailsPage,
  label: "Next' CTA on the ID Document details page",
}

export const CompleteEmploymentDetailsPage: GTagEvent = {
  category: "Complete the Employment details page",
  action: employmentDetailsPage,
  label: "Next' CTA on the Employment details page",
}

export const CompleteEmployerDetailsPage: GTagEvent = {
  category: "Complete the Employer details page",
  action: employerDetailsPage,
  label: "Next' CTA on the Employer details page",
}

export const CompleteIncomeAndWealthDetailsPage: GTagEvent = {
  category: "Complete the Income and Wealth details page",
  action: incomeAndWealthDetailsPage,
  label: "Next' CTA on the Income and Wealth details page",
}

export const CompleteFirstTaxationInformationPage: GTagEvent = {
  category: "Complete the first Taxation Information page",
  action: firstTaxationInfoPage,
  label: "Next' CTA on the first Taxation Information page",
}

export const CompleteSecondTaxationInformationPage: GTagEvent = {
  category: "Complete the second Taxation Information page",
  action: secondTaxationInfoPage,
  label: "Next' CTA on the second Taxation Information page",
}

export const CompletePepConfirmationPage: GTagEvent = {
  category: "Complete the PEP Confirmation page",
  action: papConformationPage,
  label: "Next' CTA on the PEP Confirmation page",
}

export const CompleteWealthDistributionPage: GTagEvent = {
  category: "Complete the Current Investments - Wealth Distribution page",
  action: currentWealthDistributionPage,
  label: "Next' CTA on the Current Investments - Wealth Distribution page",
}

export const CompleteConcentratedPositionsPage: GTagEvent = {
  category: "Complete the Current Investments - Concentrated Positions  page",
  action: currentConcentratedPage,
  label: "Next' CTA on theCurrent Investments - Concentrated Positions  page",
}

export const CompleteInvestmentAdvisoryPage: GTagEvent = {
  category: "Complete the Investment Advisory and Financial Instruments page",
  action: investmentAdvisoryPage,
  label: "Next' CTA on the Investment Advisory and Financial Instruments page",
}

export const CompleteFinancialTransactionPage: GTagEvent = {
  category: "Complete the Financial Transactions page",
  action: finantialTransactionPage,
  label: "Next' CTA on the Financial Transactions page",
}

export const CompletePassportInformationPage: GTagEvent = {
  category: "Complete the Passport Information page upload",
  action: passportInfoPage,
  label: "Next' CTA on the Passport Information page upload",
}

export const CompletePassportSignaturePage: GTagEvent = {
  category: "Complete the Passport Signature page upload",
  action: passportSignaturePage,
  label: "Next' CTA on the Passport Signature page upload",
}

export const CompleteIdFrontPage: GTagEvent = {
  category: "Complete the ID Front upload",
  action: idFront,
  label: "Next' CTA on the ID Front upload",
}

export const CompleteIdBackPage: GTagEvent = {
  category: "Complete the ID Back upload",
  action: idBack,
  label: "Next' CTA on the ID Back upload",
}

export const CompleteLivePhotoPage: GTagEvent = {
  category: "Complete the Live Photo upload",
  action: livePhoto,
  label: "Next' CTA on the Live Photo upload",
}

export const CompleteSchedulingVideoCallPage: GTagEvent = {
  category: "Complete scheduling the video call",
  action: scheduleVideoCall,
  label: "Next' CTA on the scheduler page",
}

export const CompleteNationalSsoPage: GTagEvent = {
  category: "Complete entering credentials for National Single Sign on",
  action: nationalSingleSignOn,
  label: "Next' CTA on the  National Single Sign on credentials page",
}

export const CompleteNationalSsoOtpPage: GTagEvent = {
  category: "Complete entering the OTP",
  action: enterOtpPage,
  label: "Next' CTA on the  National Single Sign on OTP page",
}

export const CompleteSummaryPage: GTagEvent = {
  category: "Complete Personal Information Summary page",
  action: personalInformationSummaryPage,
  label: "Next' CTA on the  Personal Information Summary page",
}

export const CompleteAdditionalInformationPage: GTagEvent = {
  category: "Complete Additional Personal Information page",
  action: additionalInformationPage,
  label: "Next' CTA on the Additional Personal Information page",
}

export const changeWhoIsPortfolioFor: GTagEvent = {
  category: "Update who is this portfolio for",
  action: whoIsThisPortfolioFor,
  label: "Editing who is this portfolio for parameter",
}

export const changeShouldGenerateIncome: GTagEvent = {
  category: "Update should generate income",
  action: shouldGenerateIncome,
  label: "Editing should generate income parameter",
}

export const changeTopUpInvestmentAnnually: GTagEvent = {
  category: "Update TopUpInvestmentAnnually",
  action: TopUpInvestmentAnnually,
  label: "Editing TopUpInvestmentAnnually parameter",
}

export const changeInvestmentGoals: GTagEvent = {
  category: "Update InvestmentGoals",
  action: InvestmentGoals,
  label: "Editing InvestmentGoals parameter",
}

export const changeAdditionalPreferences: GTagEvent = {
  category: "Update additionalPreferences",
  action: additionalPreferences,
  label: "Editing additionalPreferences parameter",
}

export const changeInvestmentAmount: GTagEvent = {
  category: "Update Investment Amount",
  action: investmentAmount,
  label: "Editing Investment Amount parameter",
}

export const changeAnnualIncrease: GTagEvent = {
  category: "Update Annual Increase",
  action: annualIncrease,
  label: "Editing Annual Increase parameter",
}

export const changeTimeHorizon: GTagEvent = {
  category: "Update Time Horizon",
  action: timeHorizon,
  label: "Editing Time Horizon parameter",
}

export const changeAnnualIncreasePercent: GTagEvent = {
  category: "Update Annual Increase Percent",
  action: annualIncreasePercent,
  label: "Editing  Annual Increase Percent",
}

export const openExclusiveOppModal: GTagEvent = {
  category: "Next",
  action: exclusiveOppAction,
  label: "Opp Next CTA",
}

export const openPortfolioSimulatorModal: GTagEvent = {
  category: "Next",
  action: simulatorAction,
  label: "PS Next CTA",
}

export const openInvestmentOppModal: GTagEvent = {
  category: "Next",
  action: investmentOppAction,
  label: "Invet Next CTA",
}

export const openWebinarModal: GTagEvent = {
  category: "Next",
  action: webinarAction,
  label: "Webinar Next CTA",
}

export const openExclusiveInsightsModal: GTagEvent = {
  category: "Next",
  action: exclusiveInsightsAction,
  label: "Insights Next CTA",
}

export const openHelpModal: GTagEvent = {
  category: "Next",
  action: helpAction,
  label: "Help Next CTA",
}

export const exitExclusiveOppModal: GTagEvent = {
  category: "Exit",
  action: exitTourModalAction,
  label: "Exit + Exclusive Opp modal",
}

export const exitPortfolioSimulatorModal: GTagEvent = {
  category: "Exit",
  action: exitTourModalAction,
  label: "Exit + Portfolio Simulator modal",
}

export const exitInvestmentOppModal: GTagEvent = {
  category: "Exit",
  action: exitTourModalAction,
  label: "Exit + Investment Opp modal",
}

export const exitWebinarModal: GTagEvent = {
  category: "Exit",
  action: exitTourModalAction,
  label: "Exit + Webinar modal",
}

export const exitExclusiveInsightsModal: GTagEvent = {
  category: "Exit",
  action: exitTourModalAction,
  label: "Exit + Exclusive Insights modal",
}

export const exitHelpModal: GTagEvent = {
  category: "Exit",
  action: exitTourModalAction,
  label: "Exit + Help modal",
}

export const profileOnboardingEvent: GTagEvent = {
  category: "Start filling details",
  action: onboardProfile,
  label: "click Continue CTA",
}
export const playVideoOnSignup: GTagEvent = {
  category: "Play",
  action: playVideoOnSignupAction,
  label: "See how it works CTA",
}

export const markOportunityInterested: GTagEvent = {
  category: "Interest",
  action: interestedUnterestedOpportunity,
  label: "Mark the deal as Interested",
}

export const markOportunityUnInterested: GTagEvent = {
  category: "Interest",
  action: interestedUnterestedOpportunity,
  label: "Mark the deal as not interested",
}

export const otpSentSuccessfully: GTagEvent = {
  category: "Verify now",
  action: otpSuccessfullySent,
  label: "Verify now link",
}

export const AppleLoginEvent: GTagEvent = {
  category: "Login using LinkedIn",
  action: socialLoginAction,
  label: "Apple login option in the login page ",
}

export const AppleSignupEvent: GTagEvent = {
  category: "Signup using LinkedIn",
  action: socialSignupAction,
  label: "Apple Signup option in the Signup page ",
}

export const GenerateProposalEventFromDashboard: GTagEvent = {
  category: "Generate Proposal Dashboard",
  action: generateProposalDashboard,
  label: "Generate Proposal Dashboard CTA ",
}

export const UpdatePhoneNumberEvent: GTagEvent = {
  category: "Update Phone number",
  action: updatePhoneNumberAction,
  label: "How many users updated there phone number",
}

export const ProposalSelection: GTagEvent = {
  category: "User selecting a particular proposal type",
  action: proposalAction,
  label: "",
}

export const ViewSpecificOpportunityDetail: GTagEvent = {
  category: "",
  action: "",
  label: "",
}

export const ViewAllOpportunities: GTagEvent = {
  category: "Opp View all CTA",
  action: opportunitiesViewAllCTA,
  label: "Opp View all CTA",
}

export const MarketReactionView: GTagEvent = {
  category: "How Did Markets React After The Interest Rate Hikes? CTA",
  action: marketReactionViewEvent,
  label: "How Did Markets React After The Interest Rate Hikes? CTA",
}

export const NewMarketPhase: GTagEvent = {
  category:
    "	A New Market Phase Amid Higher Inflation And Raising Interest Rates CTA",
  action: newMarketPhaseEvent,
  label:
    "A New Market Phase Amid Higher Inflation And Raising Interest Rates CTA",
}

export const unlokButtonSideNav: GTagEvent = {
  category: "Unlock left navigation CTA",
  action: unlockButtonLeftNavigation,
  label: "Unlock left navigation CTA",
}

export const timeSpentPerComponent: GTagEvent = {
  category: "",
  action: "",
  label: "",
}

export const viewSanitizedDeals: GTagEvent = {
  category: "",
  action: "",
  label: "",
}

export const joinNow: GTagEvent = {
  category: "Joined the platform CTA",
  action: joinNowCTA,
  label: "	Joined the platform CTA",
}

export const downloadDealOnePager: (deal: string) => GTagEvent = (deal) => ({
  category: "Download Deal one pager",
  action: downloadDealOnePagerCTA,
  label: `Download ${deal}`,
})

export const inviteFriend: GTagEvent = {
  category: "Invite friend CTA",
  action: inviteFriendCTA,
  label: "Invite friend CTA",
}

export const copyLinkForSharing: GTagEvent = {
  category: "Copy link",
  action: copyLinkForSharingCTA,
  label: "Copy link",
}

export const clickedScheduleMeetingOpportunities: GTagEvent = {
  category: "Schedule a call CTA",
  action: scheduleMeetingOppertunities,
  label: "Schedule a call CTA",
}

export const continuedPreProposalJourney: GTagEvent = {
  category: "Continue pre-proposal journey",
  action: continuePreProposalJourney,
  label: "Continue pre-proposal journey",
}

export const clickedGetProposal: GTagEvent = {
  category: "Continue pre-proposal journey from opporutinities",
  action: getProposal,
  label: "Continue pre-proposal journey from opporutinities",
}

export const clickedViewOpportunities: GTagEvent = {
  category: "View unlocked opporutunities CTA",
  action: viewOpportunities,
  label: "View unlocked opporutunities CTA",
}

export const clickedOpenDealTab: GTagEvent = {
  category: "Open CTA",
  action: openDealTab,
  label: "Open CTA",
}

export const clickedClosedDealTab: GTagEvent = {
  category: "Closed CTA",
  action: closedDealTab,
  label: "Closed CTA",
}
