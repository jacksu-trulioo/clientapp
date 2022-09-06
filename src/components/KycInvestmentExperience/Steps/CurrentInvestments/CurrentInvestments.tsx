import { Flex, SimpleGrid, Text } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React, { useMemo } from "react"

import { currentInvestmentsInputs } from "../../KycInvestmentExperience.schema"
import Input from "./Input"
import Percentage from "./Percentage"

const CurrentInvestments: React.VFC = () => {
  const { t } = useTranslation("kyc")

  const inputs = useMemo(
    () =>
      currentInvestmentsInputs.map((item) => <Input key={item} name={item} />),
    [],
  )
  return (
    <Flex direction="column" mb={{ base: 12 }}>
      <Text fontSize="sm" color="gray.400">
        {t("investmentExperience.currentInvestments.body.title")}
      </Text>
      <Percentage />
      <SimpleGrid spacing={8} columns={{ base: 2, md: 2, lg: 3 }}>
        {inputs}
      </SimpleGrid>
    </Flex>
  )
}

CurrentInvestments.displayName = "KycInvestmentExperienceCurrentInvestments"

export default React.memo(CurrentInvestments)
