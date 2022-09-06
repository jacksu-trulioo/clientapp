import {
  Box,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/react"
import { format } from "date-fns"
import NextImage from "next/image"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import { ChakraUIMarkDownRenderer, InsightCard, Layout } from "~/components"
import { Insight, Webinar } from "~/services/mytfo/types"

function WebinarScreen() {
  const { t, lang } = useTranslation("insights")
  const router = useRouter()
  const isMobileView = useBreakpointValue({ base: true, lg: false })
  const isOnlyMobileView = useBreakpointValue({ base: true, md: false })

  const id = router.query?.id

  const { data: webinar, error: webinarError } = useSWR<Webinar>(
    [`/api/portfolio/insights/webinar?id=${id}`, lang],
    (url, lang) =>
      fetch(url, {
        headers: {
          "Accept-Language": lang,
        },
      }).then((res) => res.json()),
  )

  const isWebinarLoading = !webinar && !webinarError

  const { data: otherWebinars, error } = useSWR<Insight[]>(
    webinar
      ? [`/api/portfolio/insights/webinars/top?excludingId=${webinar.id}`, lang]
      : null,
    (url, lang) =>
      fetch(url, {
        headers: {
          "Accept-Language": lang,
        },
      }).then((res) => res.json()),
  )

  if (isWebinarLoading || webinarError || error) {
    return null
  }

  return (
    <Layout
      title={t("page.webinars.title")}
      description={t("page.webinars.description")}
      heroImage={webinar?.bannerImage}
    >
      <Container
        as="section"
        maxW="full"
        px="0"
        {...(isMobileView && !webinar?.bannerImage && { mt: 5 })}
      >
        <Text mb={{ base: 4, md: 6 }} color="secondary.500" fontWeight="bold">
          {t(`tag.${webinar?.insightType}`)}
        </Text>
        <Heading size="lg" mb={{ base: 10, md: 6 }}>
          {webinar?.title}
        </Heading>
        <Text
          color="gray.400"
          fontSize="xs"
          mb={{ base: 10, md: 8 }}
          fontFamily="Gotham"
        >
          {`${
            webinar?.publishDate
              ? format(new Date(webinar?.publishDate), "MMM dd yyyy")
              : ""
          } | ${webinar?.estimatedDuration}`}
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
        {otherWebinars && otherWebinars.length > 0 && (
          <>
            <Divider borderColor="gray.800" mb="12" />

            <Heading as="h3" fontSize="2xl" mb="8">
              {t("label.relatedContent")}
            </Heading>
          </>
        )}

        <Grid
          templateColumns={`repeat(${isOnlyMobileView ? 1 : 3}, 1fr)`}
          width="full"
          gap={{ base: "8", md: "6", lg: "8" }}
          mb="12"
        >
          {otherWebinars &&
            otherWebinars.length > 0 &&
            otherWebinars
              ?.slice(0, 3)
              .map((insight) => (
                <InsightCard insight={insight} key={insight?.id} />
              ))}
        </Grid>
      </Container>
    </Layout>
  )
}

export default WebinarScreen
