import { useFormikContext } from "formik"
import React, { useCallback } from "react"

import { ModalHeader, SaveAndExitButton } from "~/components"

import { useStepper } from "./Stepper"
import { useStepperStoredState } from "./Stepper/useStepperStoredState"
import { FillDetailsValues } from "./Steps/FillDetails"

type Props = {
  onSave?: () => void
}

const Header: React.FC<Props> = ({ onSave }) => {
  const { values } = useFormikContext<FillDetailsValues>()
  const { step, assetOrLiability, bankAccountType } = useStepper()
  const { set } = useStepperStoredState()

  const onClick = useCallback(() => {
    set({
      step,
      assetOrLiability,
      bankAccountType,
      details: values,
    })
    if (onSave) {
      onSave()
    }
  }, [set, step, assetOrLiability, bankAccountType, values, onSave])

  return (
    <ModalHeader
      boxShadow="0 0 0 4px var(--chakra-colors-gray-900)"
      headerRight={<SaveAndExitButton onSaveButtonProps={{ onClick }} />}
    />
  )
}

Header.displayName = "AssetAndLiabilityWizardHeader"

export default Header
