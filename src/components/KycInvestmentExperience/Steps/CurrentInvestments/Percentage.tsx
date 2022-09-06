import { Box, Flex, Text } from "@chakra-ui/react"
import { useFormikContext } from "formik"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect, useMemo, useState } from "react"

import Toast, { ToastProps } from "~/components/Toast"

import { currentInvestmentsInputs } from "../../KycInvestmentExperience.schema"
import { KycInvestmentExperienceValues } from "../../types"

const ErrorBox: React.VFC<ToastProps> = (props) => {
  const { title } = props
  return (
    <Box my={4}>
      <Toast {...props} showCloseButton={false} title={title} />
    </Box>
  )
}

const Percentage: React.VFC = () => {
  const { values, touched } = useFormikContext<KycInvestmentExperienceValues>()
  const { t } = useTranslation("kyc")
  const [error, setError] = useState(false)
  const [errorSubmit, setErrorSubmit] = useState(false)

  const investments = [
    "wealthBonds",
    "wealthCash",
    "wealthHedgeFunds",
    "wealthOther",
    "wealthPrivateEquity",
    "wealthRealEstate",
    "wealthStockEquities",
  ]

  const sum = useMemo(
    () =>
      currentInvestmentsInputs.reduce(
        (acc, curr) => acc + ((values[curr] as number) || 0),
        0,
      ),
    [values],
  )

  useEffect(() => {
    if (Object.keys(touched).length === investments.length && sum === 0) {
      setErrorSubmit(true)
    } else {
      if (sum > 0) setErrorSubmit(false)
    }
  }, [touched])

  useEffect(() => {
    setError(sum > 100)
    if (Object.keys(touched).length === investments.length) {
      setErrorSubmit(sum > 0 ? false : true)
    }
  }, [sum])

  const allocated = useMemo(() => {
    const amount = 100 * (sum / 100)
    return amount <= 100 ? amount : 100
  }, [sum])

  const remaining = useMemo(() => {
    const amount = 100 - allocated
    return amount >= 0 ? amount : 0
  }, [allocated])

  return (
    <Flex my={8} direction="column" fontSize="sm">
      <Flex justify="space-between" width="full" mb={4}>
        <Text aria-label="allocatedPercentage" color="primary.500">
          {t(
            "investmentExperience.currentInvestments.body.allocatedPercentage",
            { amount: Number.parseFloat(allocated.toPrecision(2)) },
          )}
        </Text>
        <Text aria-label="remainingPercentage">
          {t(
            "investmentExperience.currentInvestments.body.remainingPercentage",
            { amount: Number.parseFloat(remaining.toPrecision(2)) },
          )}
        </Text>
      </Flex>
      {error && (
        <ErrorBox
          onClick={() => setError(false)}
          title={t("investmentExperience.currentInvestments.errors.max100")}
        />
      )}
      {errorSubmit && (
        <ErrorBox
          onClick={() => setErrorSubmit(false)}
          title={t(
            "investmentExperience.currentInvestments.errors.shouldBe100",
          )}
        />
      )}
      <Box width="full" bg="gray.800" height={5}>
        <Box height="100%" width={`${allocated}%`} bg="primary.500" />
      </Box>
    </Flex>
  )
}

Percentage.displayName = "KycInvestmentExperienceCurrentInvestmentsPercentage"

export default React.memo(Percentage)
