import { useCallback, useContext } from "react"

import { InitialWizardState, WizardContextType } from "./types"

export function createUseWizard<WizardState extends InitialWizardState>(
  context: WizardContextType<WizardState>,
) {
  function useWizardState() {
    const {
      step,
      numberOfSteps,
      firstStepNumber = 0,
      setStep,
      ...rest
    } = useContext(context)

    const isFirst = step === firstStepNumber
    const isLast = step === numberOfSteps - 1

    const next = useCallback(() => {
      setStep((prev) => (isLast ? prev : prev + 1))
    }, [setStep, isLast])

    const back = useCallback(() => {
      setStep((prev) => (isFirst ? firstStepNumber : prev - 1))
    }, [firstStepNumber, isFirst, setStep])

    return {
      step,
      isLast,
      isFirst,
      numberOfSteps,
      firstStepNumber,
      next,
      back,
      setStep,
      ...rest,
    }
  }

  return useWizardState
}
