import { createWizard } from "~/utils/createWizard"

export const {
  withWizard: withKycInvestmentExperienceWizard,
  useWizard: useKycInvestmentExperienceWizard,
} = createWizard({
  numberOfSteps: 4,
})
