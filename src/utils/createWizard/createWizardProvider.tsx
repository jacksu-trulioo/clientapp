import React, { useMemo, useState } from "react"

import { InitialWizardState, WizardContextType } from "./types"

export function createWizardProvider<WizardState extends InitialWizardState>(
  WizardContext: WizardContextType<WizardState>,
  initialState: WizardState,
) {
  const WizardProvider: React.FC = ({ children }) => {
    const [step, setStep] = useState<number>(initialState.initialStep || 0)

    const value = useMemo(
      () => ({
        ...initialState,
        step,
        setStep,
      }),
      [step],
    )

    return (
      <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
    )
  }

  WizardProvider.displayName = "WizardProvider"

  return WizardProvider
}
