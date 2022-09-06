import { Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react"
import { useFormikContext } from "formik"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { Radio, TextareaControl } from "~/components"
import RadioGroupControl from "~/components/RadioGroupControl"

import { KycInvestmentExperienceValues } from "../../types"

const InputContainer: React.FC = ({ children }) => {
  const isMobileView = useBreakpointValue({ base: true, md: false })
  return <Box width={isMobileView ? "100%" : "75%"}>{children}</Box>
}

const HoldingInformation: React.VFC = () => {
  const { t } = useTranslation("kyc")
  const { values } =
    useFormikContext<
      Pick<
        KycInvestmentExperienceValues,
        "holdConcentratedPosition" | "concentratedPositionDetails"
      >
    >()

  return (
    <Flex direction="column">
      <Box mb={4}>
        <Text fontSize="medium" color="gray.400">
          {t("investmentExperience.holdingInformation.body.title")}
        </Text>
      </Box>

      <RadioGroupControl name="holdConcentratedPosition" mb={4}>
        <InputContainer>
          <Radio
            name="holdConcentratedPosition"
            value="yes"
            variant="filled"
            width="full"
          >
            {t("investmentExperience.holdingInformation.body.yes")}
          </Radio>
          {values.holdConcentratedPosition === "yes" && (
            <TextareaControl
              name="concentratedPositionDetails"
              placeholder={t(
                "investmentExperience.holdingInformation.body.details",
              )}
              mt={4}
            />
          )}
        </InputContainer>
        <InputContainer>
          <Radio
            name="holdConcentratedPosition"
            value="no"
            variant="filled"
            width="full"
          >
            {t("investmentExperience.holdingInformation.body.no")}
          </Radio>
        </InputContainer>
      </RadioGroupControl>
    </Flex>
  )
}

HoldingInformation.displayName = "KycInvestmentExperienceHoldingInformation"

export default React.memo(HoldingInformation)
