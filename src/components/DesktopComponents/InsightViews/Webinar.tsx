import { Box, Divider, Flex, Heading, Text, VStack } from "@chakra-ui/layout"
import moment from "moment"
import NextImage from "next/image"
import useTranslation from "next-translate/useTranslation"
import { Fragment, useEffect } from "react"

import { ChakraUIMarkDownRenderer } from "~/components"
import { useUser } from "~/hooks/useUser"
import { Webinar } from "~/services/mytfo/types"
import { readFeatureArticleTime } from "~/utils/googleEventsClient"
import { clientEvent } from "~/utils/gtag"

type WebinarPropsType = {
  webinar: Webinar
}

const WebinarView = ({ webinar }: WebinarPropsType) => {
  const { t, lang } = useTranslation("insights")
  const { user } = useUser()

  useEffect(() => {
    const openTime = moment(new Date())
    let title = webinar?.title as string

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
      webinar.publishDate
        ? moment(webinar.publishDate).format("MMM DD YYYY")
        : ""
    } | ${webinar?.estimatedDuration}`
  }

  return (
    <Fragment>
      <Text mb={{ base: 4, md: "8px" }} color="secondary.500" fontWeight="bold">
        {t(`tag.Webinar`)}
      </Text>
      <Heading fontSize="30px" mb={{ base: 10, md: "8px" }}>
        {webinar?.title}
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
          {webinar?.description || ""}
        </ChakraUIMarkDownRenderer>
      </Text>

      {webinar?.video && (
        <Box position="relative" height="50vw" maxH="558px">
          <iframe
            key={webinar?.video}
            aria-label="video"
            src={webinar?.video}
            frameBorder="0"
            width="100%"
            height="100%"
            allowFullScreen
            title={webinar?.title}
          />
        </Box>
      )}

      {webinar?.guests && (
        <Box mb="10">
          {webinar?.guests?.map((guest) => {
            return (
              <>
                {guest.title && (
                  <>
                    <Box aria-label="guests" p="5" key={guest?.title}>
                      <Flex direction="row">
                        <Box
                          w="60px"
                          sx={{
                            "& img": {
                              borderRadius: "md",
                            },
                          }}
                        >
                          {guest?.picture && (
                            <NextImage
                              src={guest?.picture}
                              alt={guest?.title}
                              objectFit="cover"
                              width="60px"
                              height="60px"
                            />
                          )}
                        </Box>

                        <VStack alignItems="flex-start" ms="4" spacing="1">
                          <Text color="gray.400" fontSize="xs">
                            {guest.type}
                          </Text>
                          <Text color="white" fontSize="sm">
                            {guest.name}
                          </Text>
                          <Text color="gray.400" fontSize="xs">
                            {guest.title}
                          </Text>
                        </VStack>
                      </Flex>
                    </Box>
                    <Divider borderColor="gray.800" />
                  </>
                )}
              </>
            )
          })}
        </Box>
      )}
      {webinar?.contents && (
        <Box mb="12">
          {webinar?.contents?.map((content) => {
            return (
              <Box mb="8" key={content?.title}>
                <Heading as="h3" fontSize="2xl" mb="4">
                  {content?.title}
                </Heading>

                <ChakraUIMarkDownRenderer>
                  {content?.description}
                </ChakraUIMarkDownRenderer>
              </Box>
            )
          })}
        </Box>
      )}

      {webinar?.disclaimer && (
        <Box mb="12">
          <Heading as="h3" fontSize="2xl" mb="8" fontStyle="italic">
            {t("label.disclaimer")}
          </Heading>
          <Text fontSize="xs" color="gray.500">
            <ChakraUIMarkDownRenderer>
              {webinar.disclaimer}
            </ChakraUIMarkDownRenderer>
          </Text>
        </Box>
      )}
    </Fragment>
  )
}

export default WebinarView
