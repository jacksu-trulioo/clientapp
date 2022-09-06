import useTranslation from "next-translate/useTranslation"
import * as Yup from "yup"

import { useKycInvestmentExperienceWizard } from "./KycInvestmentExperienceContext"
import {
  KycInvestmentExperienceStep,
  KycInvestmentExperienceValues,
} from "./types"

export const currentInvestmentsInputs: (keyof KycInvestmentExperienceValues)[] =
  [
    "wealthCash",
    "wealthBonds",
    "wealthStockEquities",
    "wealthHedgeFunds",
    "wealthPrivateEquity",
    "wealthRealEstate",
    "wealthOther",
  ]

export function useKycInvestmentExperienceSchema() {
  const { t } = useTranslation("kyc")
  const { step } = useKycInvestmentExperienceWizard()

  if (step === KycInvestmentExperienceStep.CURRENT_INVESTMENT) {
    const wealthSchema = currentInvestmentsInputs.reduce(
      (acc, name) => ({
        ...acc,
        [name]: Yup.number()
          .integer(t("common:errors.onlyInteger"))
          .min(0, t("common:errors.minNumberAllowed"))
          .max(
            100,
            t("investmentExperience.currentInvestments.errors.inputMax100"),
          ),
      }),
      {},
    )
    return Yup.object().shape({
      ...wealthSchema,
    })
  }

  if (step === KycInvestmentExperienceStep.HOLDING_INFORMATION) {
    return Yup.object().shape({
      holdConcentratedPosition: Yup.string()
        .required(t("common:errors.required"))
        .nullable(),
      concentratedPositionDetails: Yup.string().when(
        "holdConcentratedPosition",
        {
          is: "yes",
          then: Yup.string().required(t("common:errors.required")).nullable(),
          otherwise: Yup.string().nullable(),
        },
      ),
    })
  }

  if (step === KycInvestmentExperienceStep.RECEIVED_INVESTMENT_ADVISORY) {
    return Yup.object().shape({
      investmentInFinancialInstruments: Yup.string()
        .required(t("common:errors.required"))
        .nullable(),
      receivedInvestmentAdvisory: Yup.string()
        .required(t("common:errors.required"))
        .nullable(),
    })
  }

  if (step === KycInvestmentExperienceStep.TRANSACTIONS_INFORMATION) {
    return Yup.object().shape({
      financialTransactions: Yup.array().min(1, t("common:errors.atleastOne")),
    })
  }

  return Yup.object().shape({})
}
