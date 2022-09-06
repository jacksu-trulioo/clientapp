import { Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { Radio } from "~/components"
import RadioGroupControl from "~/components/RadioGroupControl"

const InputContainer: React.FC = ({ children }) => {
  const isMobileView = useBreakpointValue({ base: true, md: false })
  return <Box width={isMobileView ? "100%" : "75%"}>{children}</Box>
}

const ReceivedInvestmentAdvisory: React.VFC = () => {
  const { t } = useTranslation("kyc")

  return (
    <Flex direction="column">
      <Box mb={8}>
        <Box mb={4}>
          <Text fontSize="medium" color="gray.400">
            {t(
              "investmentExperience.receivedInvestmentAdvisory.body.receivedInvestmentTitle",
            )}
          </Text>
        </Box>

        <RadioGroupControl name="receivedInvestmentAdvisory">
          <InputContainer>
            <Radio
              name="receivedInvestmentAdvisory"
              value="yes"
              variant="filled"
              width="full"
            >
              {t(
                "investmentExperience.receivedInvestmentAdvisory.body.radios.yes",
              )}
            </Radio>
          </InputContainer>
          <InputContainer>
            <Radio
              name="receivedInvestmentAdvisory"
              value="no"
              variant="filled"
              width="full"
            >
              {t(
                "investmentExperience.receivedInvestmentAdvisory.body.radios.no",
              )}
            </Radio>
          </InputContainer>
        </RadioGroupControl>
      </Box>

      <Box mb={4}>
        <Text fontSize="medium" color="gray.400">
          {t(
            "investmentExperience.receivedInvestmentAdvisory.body.investmentInFinancialInstrumentsTitle",
          )}
        </Text>
      </Box>

      <RadioGroupControl name="investmentInFinancialInstruments">
        <InputContainer>
          <Radio
            name="investmentInFinancialInstruments"
            value="yes"
            variant="filled"
            width="full"
          >
            {t(
              "investmentExperience.receivedInvestmentAdvisory.body.radios.yes",
            )}
          </Radio>
        </InputContainer>
        <InputContainer>
          <Radio
            name="investmentInFinancialInstruments"
            value="no"
            variant="filled"
            width="full"
          >
            {t(
              "investmentExperience.receivedInvestmentAdvisory.body.radios.no",
            )}
          </Radio>
        </InputContainer>
      </RadioGroupControl>
    </Flex>
  )
}

ReceivedInvestmentAdvisory.displayName =
  "KycInvestmentExperienceReceivedInvestmentAdvisory"

export default React.memo(ReceivedInvestmentAdvisory)
