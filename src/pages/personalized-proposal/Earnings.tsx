import {
  Container,
  Divider,
  Flex,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { SimulatorComposedChart } from "~/components"
import { Earnings } from "~/services/mytfo/types"

import EarningsGridView from "./EarningsGridView"

interface EarningProps {
  earnings?: Earnings[]
  earningsData: Earnings[]
  pdfGenerating: boolean
}

function EarningComponent(props: EarningProps) {
  let { earnings, earningsData, pdfGenerating = false } = props
  const { t } = useTranslation("personalizedProposal")

  if (!earnings && earningsData) {
    earnings = [...earningsData]
  }

  const earningArr = React.useMemo(() => {
    return earnings?.map((earning, index) => {
      return {
        ...earning,
        yearLabel: "Year " + (index + 1),
      }
    })
  }, [earnings])

  const isMobileView = useBreakpointValue({ base: true, md: false })

  return (
    <Container ps="0" mx="0" maxW="inherit">
      <Flex mt="5" mb="16" direction={{ base: "column", md: "column" }}>
        <Stack
          direction={{ base: "column", md: "column" }}
          spacing="6"
          p={{ base: 4, md: 0 }}
          w="100%"
        >
          <Text
            aria-label="earningsHeading"
            fontSize={{ base: "lg", md: "xl" }}
          >
            {t("earnings.heading")}
          </Text>
          <Text aria-label="earningsSubheading" fontSize="md" color="gray.400">
            {t("earnings.subheading")}
          </Text>
        </Stack>
        {pdfGenerating ? (
          <EarningsGridView data={earningArr?.slice(0, -1)} />
        ) : (
          <SimulatorComposedChart data={earningArr?.slice(0, -1)} />
        )}
      </Flex>
      {!isMobileView && (
        <Text color="gray.500">{t("earnings.footerText")}</Text>
      )}
      <Divider borderColor="gray.400" my="8"></Divider>
    </Container>
  )
}

export default EarningComponent
