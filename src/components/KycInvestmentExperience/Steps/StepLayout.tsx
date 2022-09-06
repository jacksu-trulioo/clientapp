import useTranslation from "next-translate/useTranslation"
import React, { ReactElement } from "react"

import { SideBySideLayout } from "~/components"

import { useKycInvestmentExperienceWizard } from "../KycInvestmentExperienceContext"
import { KycInvestmentExperienceStep } from "../types"

const titlesMap: Record<number, string> = {
  [KycInvestmentExperienceStep.CURRENT_INVESTMENT]: "currentInvestments",
  [KycInvestmentExperienceStep.HOLDING_INFORMATION]: "holdingInformation",
  [KycInvestmentExperienceStep.RECEIVED_INVESTMENT_ADVISORY]:
    "receivedInvestmentAdvisory",
  [KycInvestmentExperienceStep.TRANSACTIONS_INFORMATION]:
    "transactionsInformation",
}

type Props = {
  children: ReactElement[]
}

const StepLayout: React.FC<Props> = ({ children }) => {
  const { t } = useTranslation("kyc")
  const { step } = useKycInvestmentExperienceWizard()

  return (
    <SideBySideLayout
      title={t(`investmentExperience.${titlesMap[step]}.sidebar.title`)}
      subtitle={t(`investmentExperience.${titlesMap[step]}.sidebar.subtitle`)}
      hasSeparator
    >
      {children[step]}
    </SideBySideLayout>
  )
}

StepLayout.displayName = "KycInvestmentExperienceStepLayout"

export default React.memo<React.ComponentProps<typeof StepLayout>>(StepLayout)
