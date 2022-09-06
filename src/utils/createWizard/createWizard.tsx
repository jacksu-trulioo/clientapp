import { createContext } from "react"

import { createUseWizard } from "./createUseWizard"
import { createWithWizardHOC } from "./createWithWizardHOC"
import { createWizardProvider } from "./createWizardProvider"
import { InitialWizardState, WizardContextState } from "./types"

export function createWizard<WizardState extends InitialWizardState>(
  initialState: WizardState,
) {
  const WizardContext = createContext<WizardContextState<WizardState>>(
    initialState as WizardContextState<WizardState>,
  )

  const WizardProvider = createWizardProvider(WizardContext, initialState)

  const useWizard = createUseWizard(WizardContext)

  const withWizard = createWithWizardHOC(WizardProvider)

  return { WizardProvider, WizardContext, useWizard, withWizard }
}
