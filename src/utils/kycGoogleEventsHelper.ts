import {
  CompleteAdditionalAddressDetailsPage,
  CompleteAdditionalInformationPage,
  CompleteAddressDetailsPage,
  CompleteConcentratedPositionsPage,
  CompleteEmployerDetailsPage,
  CompleteEmploymentDetailsPage,
  CompleteFinancialTransactionPage,
  CompleteFirstPersonalInformationPage,
  CompleteFirstTaxationInformationPage,
  CompleteIdBackPage,
  CompleteIdDocumentDetailsPage,
  CompleteIdFrontPage,
  CompleteIncomeAndWealthDetailsPage,
  CompleteInvestmentAdvisoryPage,
  CompleteLivePhotoPage,
  CompleteNationalSsoPage,
  CompletePassportInformationPage,
  CompletePassportSignaturePage,
  CompletePepConfirmationPage,
  CompleteSecondPersonalInformationPage,
  CompleteSecondTaxationInformationPage,
  CompleteSummaryPage,
  CompleteWealthDistributionPage,
} from "~/utils/googleEvents"
import { event, GTagEvent } from "~/utils/gtag"

type typeKycPages = {
  [key: string]: GTagEvent[]
}

type typeKycPagesMapper = {
  [key: string]: GTagEvent
}

const kycPersonalInformation = [
  CompleteFirstPersonalInformationPage,
  CompleteSecondPersonalInformationPage,
  CompleteAddressDetailsPage,
  CompleteAdditionalAddressDetailsPage,
  CompleteIdDocumentDetailsPage,
  CompleteEmploymentDetailsPage,
  CompleteEmployerDetailsPage,
  CompleteIncomeAndWealthDetailsPage,
  CompleteFirstTaxationInformationPage,
  CompleteSecondTaxationInformationPage,
  CompletePepConfirmationPage,
  CompleteNationalSsoPage,
  CompleteSummaryPage,
  CompleteAdditionalInformationPage,
]

const pageToEventMapper: typeKycPagesMapper = {
  name: kycPersonalInformation[0],
  "kyc-country-dob": kycPersonalInformation[1],
  address: kycPersonalInformation[2],
  "other-address": kycPersonalInformation[3],
  "national-id": kycPersonalInformation[4],
  "employment-details": kycPersonalInformation[5],
  "employer-details": kycPersonalInformation[6],
  "income-details": kycPersonalInformation[7],
  "tax-information1": kycPersonalInformation[8],
  "tax-information2": kycPersonalInformation[9],
  "pep-check": kycPersonalInformation[10],
  sso: kycPersonalInformation[11],
  "citizen-details": kycPersonalInformation[12],
  "absher-additional": kycPersonalInformation[13],
}

const kycInvestmentExperience = [
  CompleteWealthDistributionPage,
  CompleteConcentratedPositionsPage,
  CompleteInvestmentAdvisoryPage,
  CompleteFinancialTransactionPage,
]

const kycIdVerification = [
  CompletePassportInformationPage,
  CompletePassportSignaturePage,
  CompleteIdFrontPage,
  CompleteIdBackPage,
  CompleteLivePhotoPage,
]

const pages: typeKycPages = {
  kycInvestmentExperience: kycInvestmentExperience,
  kycIdVerification: kycIdVerification,
}
export function triggerEventWithStep(step: number, page: string) {
  const kycGoogleEvents = pages[page]
  return event(kycGoogleEvents[step])
}

export function triggerEventWithPageName(currentPage: string) {
  return event(pageToEventMapper[currentPage])
}
