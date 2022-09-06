import { Box, Flex, FormLabel, HStack, StackDivider } from "@chakra-ui/react"
import { useFormikContext } from "formik"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect } from "react"

import {
  AutocompleteControl,
  Form,
  InputControl,
  SliderControl,
} from "~/components"

import { accountTypes, countries, currencies } from "../mocks"
import StepLayout from "./StepLayout"

export type FillDetailsValues = {
  bankName: string
  accountType: string
  country: string
  currency: string
  balance: number
  interestRate: number
}

const FillDetails: React.FC = () => {
  const { t } = useTranslation("wealthAddAssets")
  const { handleReset } = useFormikContext()

  useEffect(() => {
    return handleReset
  }, [handleReset])

  return (
    <StepLayout
      title={t("steps.fillDetails.title")}
      description={t("steps.fillDetails.description")}
    >
      <Box w="50%">
        <Form>
          <InputControl
            name="bankName"
            label={t("steps.fillDetails.inputs.bankName.label")}
            inputProps={{
              placeholder: t("steps.fillDetails.inputs.bankName.placeholder"),
            }}
          />
          <Box w="full">
            <AutocompleteControl
              name="accountType"
              label={t("steps.fillDetails.inputs.accountType.label")}
              placeholder={t(
                "steps.fillDetails.inputs.accountType.placeholder",
              )}
              items={accountTypes}
              valueExtractor={(accountType) => accountType.value}
            />
          </Box>
          <Box w="full">
            <AutocompleteControl
              name="country"
              label={t("steps.fillDetails.inputs.country.label")}
              placeholder={t("steps.fillDetails.inputs.country.placeholder")}
              items={countries}
              valueExtractor={(country) => country.value}
            />
          </Box>
          <HStack w="full" divider={<StackDivider borderColor="transparent" />}>
            <AutocompleteControl
              name="currency"
              label={t("steps.fillDetails.inputs.country.label")}
              placeholder={t("steps.fillDetails.inputs.currency.placeholder")}
              items={currencies}
              valueExtractor={(currency) => currency.value}
            />

            <InputControl
              name="balance"
              label={t("steps.fillDetails.inputs.balance.label")}
              inputProps={{
                placeholder: t("steps.fillDetails.inputs.country.placeholder"),
              }}
            />
          </HStack>
          <SliderControl
            name="interestRate"
            label={(value) => (
              <Flex justify="space-between">
                <FormLabel>
                  {t("steps.fillDetails.inputs.interestRate.label")}
                </FormLabel>
                <FormLabel>{value || 0} %</FormLabel>
              </Flex>
            )}
            sliderProps={{
              colorScheme: "primary",
              min: 0,
              max: 100,
              step: 1,
            }}
          />
        </Form>
      </Box>
    </StepLayout>
  )
}

FillDetails.displayName = "FillDetails"

export default FillDetails
