import { Box, Flex, Text } from "@chakra-ui/react"
import { useField } from "formik"
import useTranslation from "next-translate/useTranslation"
import React, { useMemo } from "react"

import { Checkbox, CheckboxGroupControl } from "~/components"

import { KycTransactionTransactionOptions } from "../../types"

const TransactionsInformation: React.VFC = () => {
  const { t } = useTranslation("kyc")

  const [field, , { setValue, setTouched }] = useField("financialTransactions")

  const NOT_CARRIED_OUT_ANY =
    KycTransactionTransactionOptions.NOT_CARRIED_OUT_ANY

  const selectAllList = React.useMemo(() => {
    return Object.values(KycTransactionTransactionOptions).filter(
      (value) => value !== NOT_CARRIED_OUT_ANY,
    )
  }, [NOT_CARRIED_OUT_ANY])

  const isOptionDisabled = useMemo(
    () => field.value?.includes(NOT_CARRIED_OUT_ANY),
    [NOT_CARRIED_OUT_ANY, field.value],
  )

  React.useEffect(() => {
    if (isOptionDisabled && field.value?.length > 1) {
      setTouched(true)
      setValue([NOT_CARRIED_OUT_ANY])
    }
  }, [field.value, NOT_CARRIED_OUT_ANY, isOptionDisabled, setTouched, setValue])

  return (
    <Flex direction="column">
      <Box mb={4}>
        <Text fontSize="medium" color="gray.400">
          {t("investmentExperience.transactionsInformation.body.title")}
        </Text>
      </Box>
      <CheckboxGroupControl
        name="financialTransactions"
        variant="filled"
        showSelectAll
        isSelectAllDisabled={isOptionDisabled}
        selectAllList={selectAllList}
      >
        {Object.values(KycTransactionTransactionOptions).map((option) => (
          <Checkbox
            key={option}
            value={option}
            isDisabled={isOptionDisabled && option !== NOT_CARRIED_OUT_ANY}
          >
            <Text>
              {t(
                `investmentExperience.transactionsInformation.body.choices.${option}`,
              )}
            </Text>
          </Checkbox>
        ))}
      </CheckboxGroupControl>
    </Flex>
  )
}

TransactionsInformation.displayName =
  "KycInvestmentExperienceTransactionsInformation"

export default React.memo(TransactionsInformation)
