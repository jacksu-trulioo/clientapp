import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react"
import moment from "moment"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect, useState } from "react"
import useSWR from "swr"

import {
  ClientLayout,
  MarketIndicatorsChart,
  ModalBox,
  PageContainer,
  SkeletonCard,
} from "~/components"
import { useUser } from "~/hooks/useUser"
import { formatChar } from "~/utils/clientUtils/globalUtilities"
import { screenSpentTime } from "~/utils/googleEventsClient"
import { clientEvent } from "~/utils/gtag"

type MarketData = {
  summaryTitle: string
  summaryText: string

  allMarkets: [
    {
      title: string
      badText: string
      goodText: string
      spectrum: {
        start: {
          value: number
          date: string
        }
        end: {
          value: number
          date: string
        }
      }
      description: string
    },
  ]
}

const MarketIndicator = () => {
  const { t, lang } = useTranslation("marketIndicators")
  const [isPageLoading, setIsPageLoading] = useState(true)
  const { data: marketData, error } = useSWR<MarketData>(
    `/api/client/miscellaneous/market-all`,
  )
  const isLoading = !marketData && !error
  const { user } = useUser()

  useEffect(() => {
    if (isLoading) {
      setIsPageLoading(true)
    } else {
      setIsPageLoading(false)
    }
  }, [isLoading])

  useEffect(() => {
    const openTime = moment(new Date())
    return () => {
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        screenSpentTime,
        "Market Indicator",
        duration.asSeconds().toString(),
        user?.mandateId as string,
        user?.email as string,
      )
    }
  }, [])

  return (
    <ClientLayout title={t("page.title")} description={t("page.description")}>
      {!marketData && !isPageLoading && !isLoading ? (
        <ModalBox
          isOpen={true}
          modalDescription={t("common:client.errors.noDate.description")}
          modalTitle={t("common:client.errors.noDate.title")}
          primaryButtonText={t("common:client.errors.noDate.button")}
          onClose={() => {
            router.push("/client/portfolio-summary")
          }}
          onPrimaryClick={() => {
            router.push("/client/portfolio-summary")
          }}
        />
      ) : (
        <PageContainer
          isLoading={isPageLoading}
          as="section"
          maxW="full"
          px="0"
          mt={{ base: 8, md: 8, lgp: 0 }}
          filter={isPageLoading ? "blur(3px)" : "none"}
        >
          {isLoading ? (
            <SkeletonCard flex="1" mb="25px" mt="20px" />
          ) : (
            <>
              <Box>
                <Text
                  fontSize="30px"
                  pb="8px"
                  color="#ffffff"
                  fontWeight="400"
                  lineHeight="120%"
                  mt={{ base: "20px", md: "20px", lgp: "0" }}
                >
                  {t("heading")}
                  {/* {marketData?.summaryTitle} */}
                </Text>
              </Box>
              <Box>
                <Text fontSize="18px" color="#C7C7C7" fontWeight="400">
                  {t("description")}
                  {/* {marketData?.summaryText} */}
                </Text>
              </Box>
              <Box my="80px">
                {marketData?.allMarkets.map((item, index) => (
                  <Box key={index}>
                    <Heading fontSize="14px" fontWeight="700" color="white">
                      {/* {t("labels.macroeconomic")} */}

                      {t(
                        `labels.${item.title.replace(" ", "_").toLowerCase()}`,
                      )}
                    </Heading>
                    <Box padding="24px 0 40px">
                      <Grid
                        templateColumns={{
                          base: "repeat(1, 1fr)",
                          md: "repeat(2, 1fr)",
                        }}
                        gap="15px"
                        alignItems="center"
                      >
                        <GridItem>
                          <Box py="25px" bgColor="gray.800">
                            <Box
                              px={{
                                base: "16px",
                                md: lang.includes("en") ? "50px" : "65px",
                              }}
                            >
                              <Flex
                                justifyContent="space-between"
                                style={{ direction: "ltr" }}
                              >
                                <Text
                                  fontWeight="bold"
                                  fontSize="18px"
                                  color="contrast.200"
                                >
                                  {t(
                                    `labels.${item.badText
                                      .replace(" ", "_")
                                      .toLowerCase()}`,
                                  )}
                                </Text>
                                <Text
                                  fontWeight="bold"
                                  fontSize="18px"
                                  color="contrast.200"
                                >
                                  {/* {t("labels.positive")} */}

                                  {t(
                                    `labels.${item.goodText
                                      .replace(" ", "_")
                                      .toLowerCase()}`,
                                  )}
                                </Text>
                              </Flex>
                            </Box>
                            <Box pt="50px" pb="25px">
                              <MarketIndicatorsChart
                                marketSpectrumData={item.spectrum}
                              />
                            </Box>
                          </Box>
                        </GridItem>
                        <GridItem>
                          <Box pl={{ base: "8px", md: "40px" }} dir="ltr">
                            <UnorderedList>
                              <ListItem
                                aria-label="Description"
                                role={"listitem"}
                                fontWeight="400"
                                fontSize="18px"
                                color="contrast.200"
                                lineHeight="1.5"
                              >
                                {formatChar(item.description)}
                              </ListItem>
                            </UnorderedList>
                          </Box>
                        </GridItem>
                      </Grid>
                    </Box>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </PageContainer>
      )}
    </ClientLayout>
  )
}

export default MarketIndicator

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async function (ctx) {
    const sesison = getSession(ctx.req, ctx.res)
    if (sesison?.mandateId) {
      return {
        props: {}, // will be passed to the page component as props
      }
    }
    return {
      notFound: true,
    }
  },
})
