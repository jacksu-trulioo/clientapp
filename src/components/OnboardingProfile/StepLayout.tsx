import React, { ReactElement } from "react"

import { useOnboardingProfileWizard } from "./OnboardingProfileContext"

type Props = {
  children: ReactElement[]
}

const StepLayout = ({ children }: Props) => {
  const { step } = useOnboardingProfileWizard()

  return children[step]
}

StepLayout.displayName = "OnboardingProfileStepLayout"

export default React.memo(StepLayout)
