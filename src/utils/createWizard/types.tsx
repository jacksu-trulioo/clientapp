import React from "react"

type SetStepAction = React.Dispatch<React.SetStateAction<number>>

export type InitialWizardState = {
  initialStep?: number
  numberOfSteps: number
  firstStepNumber?: number
}

export type WizardContextState<T extends InitialWizardState> = T & {
  step: number
  setStep: SetStepAction
}

export type WizardContextType<T extends InitialWizardState> = React.Context<
  WizardContextState<T>
>
