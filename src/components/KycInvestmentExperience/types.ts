export enum KycInvestmentExperienceStep {
  CURRENT_INVESTMENT = 0,
  HOLDING_INFORMATION = 1,
  RECEIVED_INVESTMENT_ADVISORY = 2,
  TRANSACTIONS_INFORMATION = 3,
}

export enum KycTransactionTransactionOptions {
  PRIVATE_EQUITY_OR_VENTURE_CAPITAL = "PrivateEquityOrVentureCapital",
  HEDGE_FUNDS_OR_MANAGED_FUTURE_FUNDS = "HedgeFundsOrManagedFutureFunds",
  DERIVATIVES_OR_CFD_OR_OPTIONS_OR_LEVERAGE_CERTIFICATES = "DerivativesOrCfdOrOptionsOrLeverageCertificates",
  COMMODITIES_OR_COMMODITIES_CERTIFICATES = "CommoditiesOrCommoditiesCertificates",
  NOT_CARRIED_OUT_ANY = "NotCarriedOutAny",
}

export type KycInvestmentExperienceValues = {
  wealthCash?: number
  wealthBonds?: number
  wealthStockEquities?: number
  wealthHedgeFunds?: number
  wealthPrivateEquity?: number
  wealthRealEstate?: number
  wealthOther?: number
  holdConcentratedPosition?: string
  concentratedPositionDetails?: string
  receivedInvestmentAdvisory?: string
  investmentInFinancialInstruments?: string
  financialTransactions?: KycTransactionTransactionOptions[]
}

export type KycInvestmentExperienceResponse = {
  wealthDistribution?: {
    cash?: number
    bonds?: number
    stockEquities?: number
    hedgeFunds?: number
    privateEquity?: number
    realEstate?: number
    other?: number
  }
  holdConcentratedPosition?: string
  concentratedPositionDetails?: string
  receivedInvestmentAdvisory?: string
  investmentInFinancialInstruments?: string
  financialTransactions?: KycTransactionTransactionOptions[]
}
