import { currentInvestmentsInputs } from "./KycInvestmentExperience.schema"
import {
  KycInvestmentExperienceResponse,
  KycInvestmentExperienceStep,
  KycInvestmentExperienceValues,
} from "./types"

function parseNumber(value: unknown) {
  const number = Number(value)
  if (Number.isNaN(number) || number === 0) {
    return undefined
  }

  return number
}

export function parseKycInvestmentResponse(
  response: Partial<KycInvestmentExperienceResponse>,
  step: number,
): KycInvestmentExperienceValues {
  if (step === KycInvestmentExperienceStep.CURRENT_INVESTMENT) {
    return {
      wealthCash: parseNumber(response?.wealthDistribution?.cash),
      wealthBonds: parseNumber(response?.wealthDistribution?.bonds),
      wealthRealEstate: parseNumber(response?.wealthDistribution?.realEstate),
      wealthHedgeFunds: parseNumber(response?.wealthDistribution?.hedgeFunds),
      wealthPrivateEquity: parseNumber(
        response?.wealthDistribution?.privateEquity,
      ),
      wealthStockEquities: parseNumber(
        response?.wealthDistribution?.stockEquities,
      ),
      wealthOther: parseNumber(response?.wealthDistribution?.other),
    }
  }
  if (step === KycInvestmentExperienceStep.HOLDING_INFORMATION) {
    return {
      holdConcentratedPosition: response?.holdConcentratedPosition,
      concentratedPositionDetails: response?.concentratedPositionDetails,
    }
  }
  if (step === KycInvestmentExperienceStep.RECEIVED_INVESTMENT_ADVISORY) {
    return {
      receivedInvestmentAdvisory: response?.receivedInvestmentAdvisory,
      investmentInFinancialInstruments:
        response?.investmentInFinancialInstruments,
    }
  }
  if (step === KycInvestmentExperienceStep.TRANSACTIONS_INFORMATION) {
    return {
      financialTransactions: response?.financialTransactions || [],
    }
  }
  return {
    wealthCash: parseNumber(response?.wealthDistribution?.cash),
    wealthBonds: parseNumber(response?.wealthDistribution?.bonds),
    wealthRealEstate: parseNumber(response?.wealthDistribution?.realEstate),
    wealthHedgeFunds: parseNumber(response?.wealthDistribution?.hedgeFunds),
    wealthPrivateEquity: parseNumber(
      response?.wealthDistribution?.privateEquity,
    ),
    wealthStockEquities: parseNumber(
      response?.wealthDistribution?.stockEquities,
    ),
    wealthOther: parseNumber(response?.wealthDistribution?.other),
    holdConcentratedPosition: response?.holdConcentratedPosition,
    concentratedPositionDetails: response?.concentratedPositionDetails,
    receivedInvestmentAdvisory: response?.receivedInvestmentAdvisory,
    investmentInFinancialInstruments:
      response?.investmentInFinancialInstruments,
    financialTransactions: response?.financialTransactions || [],
  }
}

export function prepareKycInvestmentRequest(
  request: KycInvestmentExperienceValues,
): KycInvestmentExperienceResponse {
  const payload = {} as KycInvestmentExperienceResponse
  const {
    wealthBonds,
    wealthCash,
    wealthHedgeFunds,
    wealthOther,
    wealthPrivateEquity,
    wealthRealEstate,
    wealthStockEquities,
    holdConcentratedPosition,
    concentratedPositionDetails,
    receivedInvestmentAdvisory,
    investmentInFinancialInstruments,
    financialTransactions,
  } = request

  if (
    wealthBonds ||
    wealthCash ||
    wealthHedgeFunds ||
    wealthOther ||
    wealthPrivateEquity ||
    wealthRealEstate ||
    wealthStockEquities
  ) {
    payload.wealthDistribution = {
      cash: wealthCash || 0,
      bonds: wealthBonds || 0,
      stockEquities: wealthStockEquities || 0,
      hedgeFunds: wealthHedgeFunds || 0,
      privateEquity: wealthPrivateEquity || 0,
      realEstate: wealthRealEstate || 0,
      other: wealthOther || 0,
    }
  }

  if (holdConcentratedPosition) {
    payload.holdConcentratedPosition = holdConcentratedPosition

    if (holdConcentratedPosition === "yes") {
      payload.concentratedPositionDetails = concentratedPositionDetails
    }
  }

  if (receivedInvestmentAdvisory || investmentInFinancialInstruments) {
    payload.receivedInvestmentAdvisory = receivedInvestmentAdvisory
    payload.investmentInFinancialInstruments = investmentInFinancialInstruments
  }

  if (financialTransactions) {
    payload.financialTransactions = financialTransactions || []
  }

  return payload
}

export function valuesAreValid(values: KycInvestmentExperienceValues) {
  const sum = currentInvestmentsInputs.reduce(
    (acc, curr) => acc + ((values[curr] as number) || 0),
    0,
  )

  return sum === 100
}
