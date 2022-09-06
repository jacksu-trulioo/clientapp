import React, { useMemo } from "react"

import { Step } from "./StepperProvider"
import { useStepper } from "./useStepper"

type Props = {
  steps: Record<Step, React.ReactElement>
}

export function Stepper({ steps }: Props) {
  const { step } = useStepper()

  return useMemo(
    () => steps[step] || steps[Step.ADD_ASSETS_OR_LIABILITIES],
    [step, steps],
  )
}

Stepper.displayName = "Stepper"
