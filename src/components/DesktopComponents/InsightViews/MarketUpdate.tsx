import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/accordion"
import { Box, Divider, Flex, Heading, Text } from "@chakra-ui/layout"
import { Button, useBreakpointValue } from "@chakra-ui/react"
import moment from "moment"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useEffect, useState } from "react"

import { ChakraUIMarkDownRenderer, CheckCircleIcon } from "~/components"
import { useUser } from "~/hooks/useUser"
import { MonthlyMarketUpdate } from "~/services/mytfo/types"
import { readFeatureArticleTime } from "~/utils/googleEventsClient"
import { clientEvent } from "~/utils/gtag"

type MarketUpdatePropsType = {
  marketUpdate: MonthlyMarketUpdate
}

const MarketUpdateView = ({ marketUpdate }: MarketUpdatePropsType) => {
  const { t, lang } = useTranslation("insights")
  const { user } = useUser()
  const [isDownloaded, setIsDownloaded] = useState(false)
  const isMobileView = useBreakpointValue({ base: true, md: false })

  useEffect(() => {
    const openTime = moment(new Date())
    let title = marketUpdate?.title as string

    return () => {
      moment.locale(lang.includes("en") ? "en" : "ar")
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        readFeatureArticleTime,
        title,
        duration.asSeconds().toString(),
        user?.mandateId as string,
        user?.email as string,
      )
    }
  }, [])

  const renderDate = () => {
    moment.locale("en")

    return `${
      marketUpdate.publishDate
        ? moment(marketUpdate.publishDate).format("MMM DD YYYY")
        : ""
    } | ${marketUpdate?.estimatedDuration}`
  }

  const downloadLink = () => {
    if (typeof window != "undefined" && marketUpdate?.downloadLink) {
      window.open(marketUpdate.downloadLink, "_blank")
      if (!isDownloaded) setIsDownloaded(true)
    }
  }

  return (
    <Fragment>
      <Text mb={{ base: 4, md: 6 }} color="secondary.500" fontWeight="bold">
        {t(`tag.${marketUpdate?.insightType}`)}
      </Text>
      <Heading size="lg" mb={{ base: 10, md: 6 }}>
        {marketUpdate?.title}
      </Heading>
      <Text
        color="gray.400"
        fontSize="xs"
        mb={{ base: 10, md: 8 }}
        fontFamily="'Gotham'"
      >
        {renderDate()}
      </Text>

      <Text fontSize="xl" color="gray.500" mb="10">
        <ChakraUIMarkDownRenderer>
          {marketUpdate?.description || ""}
        </ChakraUIMarkDownRenderer>
      </Text>

      <Divider borderColor="gray.800" mb="12" border="1px" />
      <Accordion allowToggle w="full" mb="12">
        {marketUpdate?.contents &&
          marketUpdate?.contents.map((content) => (
            <AccordionItem
              aria-label="content"
              borderBottom="1px solid"
              borderBottomColor="gray.800"
              mb="0"
              key={content.title}
            >
              <h2>
                <AccordionButton
                  bg="transparent"
                  p="0"
                  _hover={{ bg: "transparent" }}
                >
                  <Flex justifyContent="space-between" py="6" width="full">
                    <Text textAlign="start" fontSize="xl">
                      {content.title}
                    </Text>
                    <AccordionIcon />
                  </Flex>
                </AccordionButton>
              </h2>

              <AccordionPanel bg="transparent">
                <ChakraUIMarkDownRenderer>
                  {content.description}
                </ChakraUIMarkDownRenderer>
              </AccordionPanel>
            </AccordionItem>
          ))}
      </Accordion>
      {isDownloaded && (
        <Flex justify="flex-start" align="center" mb="6">
          <CheckCircleIcon color="primary.500" w="8" h="8" />
          <Heading color="gray.500" size="sm">
            {t("page.marketUpdates.downloadedMarketUpdate")}
          </Heading>
        </Flex>
      )}
      {marketUpdate?.downloadLink && (
        <Button
          colorScheme="primary"
          mb="12"
          isFullWidth={isMobileView}
          variant={isDownloaded ? "outline" : "solid"}
          onClick={downloadLink}
        >
          {isDownloaded
            ? t("common:button.downloadAgain")
            : t("common:button.downloadMarketUpdate")}
        </Button>
      )}
      {marketUpdate?.disclaimer && (
        <Box mb="12">
          <Heading as="h3" fontSize="2xl" mb="8" fontStyle="italic">
            {t("label.disclaimer")}
          </Heading>
          <Text fontSize="xs" color="gray.500">
            <ChakraUIMarkDownRenderer>
              {marketUpdate.disclaimer}
            </ChakraUIMarkDownRenderer>
          </Text>
        </Box>
      )}
    </Fragment>
  )
}

export default MarketUpdateView
