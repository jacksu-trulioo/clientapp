import { useCallback, useContext } from "react"

import { Step, StepperContext } from "./StepperProvider"

export function useStepper() {
  const { step, setStep, setAssetOrLiability, setBankAccountType, ...rest } =
    useContext(StepperContext)

  const next = useCallback(() => {
    setStep((prev) =>
      prev >= Step.FILL_DETAILS ? Step.FILL_DETAILS : prev + 1,
    )
  }, [setStep])

  const back = useCallback(() => {
    if (step === Step.ADD_BANK_ACCOUNTS) {
      setAssetOrLiability(undefined)
    }
    if (step === Step.FILL_DETAILS) {
      setBankAccountType(undefined)
    }
    setStep((prev) =>
      prev <= Step.ADD_ASSETS_OR_LIABILITIES
        ? Step.ADD_ASSETS_OR_LIABILITIES
        : prev - 1,
    )
  }, [setAssetOrLiability, setBankAccountType, setStep, step])

  return {
    step,
    next,
    back,
    setStep,
    setAssetOrLiability,
    setBankAccountType,
    ...rest,
  }
}
