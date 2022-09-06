import { Button, Stack, useBreakpointValue } from "@chakra-ui/react"
import { useFormikContext } from "formik"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import ModalFooter from "../ModalFooter"
import { useKycInvestmentExperienceWizard } from "./KycInvestmentExperienceContext"
import {
  KycInvestmentExperienceStep,
  KycInvestmentExperienceValues,
} from "./types"
import { valuesAreValid } from "./utils"

type Props = {
  onSubmit: (values: KycInvestmentExperienceValues) => void
}

function canGoNext(
  step: KycInvestmentExperienceStep,
  values: KycInvestmentExperienceValues,
) {
  if (step === KycInvestmentExperienceStep.CURRENT_INVESTMENT) {
    return valuesAreValid(values)
  }
  if (step === KycInvestmentExperienceStep.HOLDING_INFORMATION) {
    return !!values.holdConcentratedPosition
  }
  if (step === KycInvestmentExperienceStep.RECEIVED_INVESTMENT_ADVISORY) {
    return (
      !!values.receivedInvestmentAdvisory &&
      !!values.investmentInFinancialInstruments
    )
  }
  if (step === KycInvestmentExperienceStep.TRANSACTIONS_INFORMATION) {
    return (
      values.financialTransactions && values.financialTransactions.length > 0
    )
  }
  return true
}

const Footer: React.VFC<Props> = () => {
  const { t } = useTranslation("common")
  const { step, isFirst, back } = useKycInvestmentExperienceWizard()
  const { values, submitForm, isSubmitting, setFieldTouched } =
    useFormikContext<KycInvestmentExperienceValues>()
  const isNextEnabled = canGoNext(step, values)
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const showError = (step: KycInvestmentExperienceStep) => {
    if (step === KycInvestmentExperienceStep.CURRENT_INVESTMENT) {
      const investments = [
        "wealthBonds",
        "wealthCash",
        "wealthHedgeFunds",
        "wealthOther",
        "wealthPrivateEquity",
        "wealthRealEstate",
        "wealthStockEquities",
      ]
      investments.forEach((key: string) => {
        setFieldTouched(key, true)
      })
    }
    if (step === KycInvestmentExperienceStep.HOLDING_INFORMATION) {
      setFieldTouched("holdConcentratedPosition", true)
    }
    if (step === KycInvestmentExperienceStep.RECEIVED_INVESTMENT_ADVISORY) {
      setFieldTouched("investmentInFinancialInstruments", true)
      setFieldTouched("receivedInvestmentAdvisory", true)
    }
    if (step === KycInvestmentExperienceStep.TRANSACTIONS_INFORMATION) {
      setFieldTouched("financialTransactions", true)
    }
  }
  return (
    <ModalFooter position="fixed" bottom="0">
      <Stack
        isInline
        spacing={{ base: 4, md: 8 }}
        px={{ base: 0, md: 3 }}
        flex="1"
        justifyContent="flex-end"
      >
        {!isFirst && (
          <Button
            key="back"
            minW={{ base: "auto", md: "110px" }}
            colorScheme="primary"
            variant="outline"
            onClick={back}
            isFullWidth={isMobileView}
          >
            {t("button.back")}
          </Button>
        )}
        <Button
          key="next"
          colorScheme="primary"
          variant="solid"
          minW={{ base: "auto", md: "110px" }}
          onClick={() => {
            if (isNextEnabled) {
              submitForm()
            } else {
              showError(step)
            }
          }}
          isLoading={isSubmitting}
          isFullWidth={isMobileView}
          type="submit"
        >
          {t("button.next")}
        </Button>
      </Stack>
    </ModalFooter>
  )
}

Footer.displayName = "KycInvestmentExperienceFooter"

export default React.memo(Footer)
