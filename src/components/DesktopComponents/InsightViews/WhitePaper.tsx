import { Box, Divider, Flex, Heading, Text, VStack } from "@chakra-ui/layout"
import { Button, useBreakpointValue } from "@chakra-ui/react"
import moment from "moment"
import useTranslation from "next-translate/useTranslation"
import { Fragment, useEffect, useState } from "react"

import { ChakraUIMarkDownRenderer, CheckCircleIcon } from "~/components"
import { useUser } from "~/hooks/useUser"
import { Whitepaper } from "~/services/mytfo/types"
import { readFeatureArticleTime } from "~/utils/googleEventsClient"
import { clientEvent } from "~/utils/gtag"

type WhitePaperPropsType = {
  whitepaper: Whitepaper
}

const WhitePaperView = ({ whitepaper }: WhitePaperPropsType) => {
  const { t, lang } = useTranslation("insights")
  const [isDownloaded, setIsDownloaded] = useState(false)
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const { user } = useUser()

  useEffect(() => {
    const openTime = moment(new Date())
    let title = whitepaper?.title

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

  const downloadLink = () => {
    if (typeof window != "undefined" && whitepaper?.downloadLink) {
      window.open(whitepaper.downloadLink, "_blank")
      if (!isDownloaded) setIsDownloaded(true)
    }
  }

  const renderDate = () => {
    moment.locale("en")

    return `${
      whitepaper.publishDate
        ? moment(whitepaper.publishDate).format("MMM DD YYYY")
        : ""
    } | ${whitepaper?.estimatedDuration}`
  }

  return (
    <Fragment>
      <Text mb={{ base: 4, md: "8px" }} color="secondary.500" fontWeight="bold">
        {t(`tag.${whitepaper?.insightType}`)}
      </Text>
      <Heading fontSize="30px" mb={{ base: 10, md: "8px" }}>
        {t(`tag.Whitepaper`)}
      </Heading>
      <Text
        color="gray.400"
        fontSize="xs"
        mb={{ base: 10, md: "8px" }}
        fontFamily="'Gotham'"
      >
        {renderDate()}
      </Text>

      <Text fontSize="xl" color="gray.500" mb="10">
        <ChakraUIMarkDownRenderer>
          {whitepaper?.description || ""}
        </ChakraUIMarkDownRenderer>
      </Text>

      <Divider borderColor="gray.800" mb="12" border="1px" />
      <VStack mb="12" spacing="12" width="full" align="flex-start">
        {whitepaper?.contents &&
          whitepaper?.contents?.map((content) => (
            <Box
              me={{ base: "10", md: "3" }}
              minW={{ base: "12", md: "72px" }}
              justifyItems="flex-start"
              key={content.title}
            >
              <Heading size="sm" mb={{ base: 10, md: 6 }}>
                {content.title}
              </Heading>
              <ChakraUIMarkDownRenderer>
                {content.description}
              </ChakraUIMarkDownRenderer>
            </Box>
          ))}
      </VStack>
      {isDownloaded && (
        <Flex justify="flex-start" align="center" mb="6">
          <CheckCircleIcon color="primary.500" w="8" h="8" />
          <Heading color="gray.500" size="sm">
            {t("page.whitepapers.downloadedWhitepaper")}
          </Heading>
        </Flex>
      )}
      <Button
        colorScheme="primary"
        mb="12"
        isFullWidth={isMobileView}
        variant={isDownloaded ? "outline" : "solid"}
        onClick={downloadLink}
      >
        {isDownloaded
          ? t("common:button.downloadAgain")
          : t("common:button.downloadWhitepaper")}
      </Button>
      {whitepaper?.disclaimer && (
        <Box mb="12">
          <Heading as="h3" fontSize="2xl" mb="8" fontStyle="italic">
            {t("label.disclaimer")}
          </Heading>
          <Text fontSize="xs" color="gray.500">
            <ChakraUIMarkDownRenderer>
              {whitepaper.disclaimer}
            </ChakraUIMarkDownRenderer>
          </Text>
        </Box>
      )}
    </Fragment>
  )
}

export default WhitePaperView
