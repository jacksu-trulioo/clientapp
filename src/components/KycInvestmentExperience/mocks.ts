import {
  KycInvestmentExperienceResponse,
  KycTransactionTransactionOptions,
} from "./types"

export const response: KycInvestmentExperienceResponse = {
  wealthDistribution: {
    cash: 20,
    bonds: 20,
    stockEquities: 10,
    hedgeFunds: 0,
    privateEquity: 0,
    realEstate: 50,
    other: 0,
  },
  holdConcentratedPosition: "yes",
  concentratedPositionDetails: "Family Business",
  receivedInvestmentAdvisory: "yes",
  investmentInFinancialInstruments: "yes",
  financialTransactions: [
    KycTransactionTransactionOptions.PRIVATE_EQUITY_OR_VENTURE_CAPITAL,
    KycTransactionTransactionOptions.HEDGE_FUNDS_OR_MANAGED_FUTURE_FUNDS,
  ],
}
