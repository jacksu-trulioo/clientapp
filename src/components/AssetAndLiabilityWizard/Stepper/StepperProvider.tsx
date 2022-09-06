import React, { createContext, useState } from "react"

import { AssetOrLiability, BankAccountType } from "../types"

export enum Step {
  ADD_ASSETS_OR_LIABILITIES = 0,
  ADD_BANK_ACCOUNTS = 1,
  FILL_DETAILS = 2,
}

export type StepperContextType = {
  step: Step
  bankAccountType?: AssetOrLiability
  assetOrLiability?: BankAccountType
  setStep: React.Dispatch<React.SetStateAction<Step>>
  setBankAccountType: React.Dispatch<
    React.SetStateAction<AssetOrLiability | undefined>
  >
  setAssetOrLiability: React.Dispatch<
    React.SetStateAction<BankAccountType | undefined>
  >
}

export const StepperContext = createContext<StepperContextType>({
  step: 0,
} as StepperContextType)

export const StepperProvider: React.FC = ({ children }) => {
  const [step, setStep] = useState<Step>(Step.ADD_ASSETS_OR_LIABILITIES)
  const [assetOrLiability, setAssetOrLiability] = useState<AssetOrLiability>()
  const [bankAccountType, setBankAccountType] = useState<BankAccountType>()

  return (
    <StepperContext.Provider
      value={{
        step,
        bankAccountType,
        assetOrLiability,
        setStep,
        setBankAccountType,
        setAssetOrLiability,
      }}
    >
      {children}
    </StepperContext.Provider>
  )
}

StepperProvider.displayName = "StepperProvider"
