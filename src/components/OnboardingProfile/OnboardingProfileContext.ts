import { createWizard } from "~/utils/createWizard"

export const {
  withWizard: withOnboardingProfileWizard,
  useWizard: useOnboardingProfileWizard,
} = createWizard({
  numberOfSteps: 2,
})
