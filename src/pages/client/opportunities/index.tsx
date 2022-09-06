import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import { Box, Heading, Link, Text } from "@chakra-ui/layout"
import { Divider, Flex, useBreakpointValue } from "@chakra-ui/react"
import ky from "ky"
import moment from "moment"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useEffect, useState } from "react"
import useSWR from "swr"

import {
  CaretRightIcon,
  ClientLayout,
  InvestmentCartIcon,
  NoDataFound,
  OpportunityCard,
  PageContainer,
  SkeletonOpportunityCard,
} from "~/components"
import { useUser } from "~/hooks/useUser"
import {
  InvestmentCartDealDetails,
  OpportunitiesProps,
  OpportunitiesResponseType,
} from "~/services/mytfo/clientTypes"
import { FilterDataType } from "~/services/mytfo/types"
import { screenSpentTime } from "~/utils/googleEventsClient"
import { clientEvent } from "~/utils/gtag"

function Opportunities() {
  const { t, lang } = useTranslation("opportunities")
  const [isLoading, setIsLoading] = useState(true)
  const [opportunitiesData, setOpportunitiesData] =
    useState<OpportunitiesProps[]>()
  const [subscribedOpportunities, setSubscribedOpportunities] =
    useState<OpportunitiesProps[]>()

  const [opportunitiesMoreBtnShowIs, setOpportunitiesMoreBtnShow] =
    useState(false)
  const [subsOppMoreBtnShowIs, setSubsOppMoreBtnShow] = useState(false)

  const isLessThan1280 = useBreakpointValue({
    base: false,
    md: false,
    lgp: false,
    "2xl": true,
    xl: true,
  })

  const [filterOptions] = useState<FilterDataType[]>([
    {
      filterName: t("common:filters.filterTypes.order.title"),
      filterNameKey: "orderBy",
      filterOptions: [
        {
          label: t("common:filters.filterTypes.order.options.ascending"),
          value: "asc",
        },
        {
          label: t("common:filters.filterTypes.order.options.descending"),
          value: "desc",
        },
      ],
      filterType: "radio",
      selectedOption: "asc",
    },
    {
      filterName: t("common:filters.filterTypes.sort.title"),
      filterNameKey: "sortBy",
      filterOptions: [
        {
          label: t("common:filters.filterTypes.sort.options.alphabetically"),
          value: "alphabetically",
        },
        {
          label: t("common:filters.filterTypes.sort.options.recency"),
          value: "recency",
        },
      ],
      filterType: "radio",
      selectedOption: "recency",
    },
    {
      filterName: t("common:filters.filterTypes.assetClass.title"),
      filterNameKey: "assetClass",
      filterOptions: [],
      filterType: "checkbox",
    },
    {
      filterName: t("common:filters.filterTypes.shariah.title"),
      filterNameKey: "isShariah",
      filterOptions: [
        {
          isSelected: false,
          value: 1,
          label: t("common:filters.filterTypes.shariah.options.shariah"),
        },
      ],
      filterType: "checkbox",
    },
    {
      filterName: t("common:filters.filterTypes.sector.title"),
      filterNameKey: "sector",
      filterOptions: [],
      filterType: "checkbox",
    },
    {
      filterName: t("common:filters.filterTypes.sponsor.title"),
      filterNameKey: "sponsor",
      filterOptions: [],
      filterType: "checkbox",
    },
  ])

  const { data: investmentCartCount } = useSWR<InvestmentCartDealDetails[]>(
    `/api/client/deals/investment-cart`,
  )

  useEffect(() => {
    getOpportunities(true)
  }, [])

  const { user } = useUser()

  useEffect(() => {
    const openTime = moment(new Date())
    return () => {
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        screenSpentTime,
        "Opportunities Landing Page",
        duration.asSeconds().toString(),
        user?.mandateId as string,
        user?.email as string,
      )
    }
  }, [])

  const getOpportunities = async (
    isOnLoad: boolean,
    filterOptionData?: FilterDataType[],
  ) => {
    setIsLoading(true)
    var values: string[] = []
    var key: string[] = []

    var filterdata = filterOptionData?.length ? filterOptionData : filterOptions
    filterdata.forEach(({ filterOptions, filterNameKey }) => {
      var findCheckedOptions = filterOptions
        .filter(({ isSelected }) => {
          return isSelected
        })
        .map(({ value }) => {
          values.push(value as string)
        })

      if (findCheckedOptions.length) {
        key.push(filterNameKey as string)
      }
    })

    try {
      var response = await ky
        .post(`/api/client/deals/opportunities?langCode=${lang}`, {
          json: {
            filterKeys: key,
            filterValues: values,
            sortBy: filterOptions.find(({ filterNameKey }) => {
              return filterNameKey == "sortBy"
            })?.selectedOption,
            orderBy: filterOptions.find(({ filterNameKey }) => {
              return filterNameKey == "orderBy"
            })?.selectedOption,
          },
        })
        .json<OpportunitiesResponseType>()

      setOpportunitiesData(response?.data)
      let subscribedDeals = response?.data.filter((element) => {
        return element.isInvested
      })
      setSubscribedOpportunities(subscribedDeals)

      setIsLoading(false)
      if (isOnLoad) {
        var assetClassIndex = filterOptions.findIndex(({ filterNameKey }) => {
          return filterNameKey == "assetClass"
        })
        var sectorIndex = filterOptions.findIndex(({ filterNameKey }) => {
          return filterNameKey == "sector"
        })
        var sponsorIndex = filterOptions.findIndex(({ filterNameKey }) => {
          return filterNameKey == "sponsor"
        })
        var option = filterOptions
        if (assetClassIndex >= 0) {
          option[assetClassIndex].filterOptions =
            response?.filterValues.assetClass.map(
              ({ assetClass, assetClassAr }) => {
                return {
                  value: assetClass,
                  label: lang.includes("en") ? assetClass : assetClassAr,
                  isSelected: false,
                }
              },
            )
        }
        if (sectorIndex >= 0) {
          option[sectorIndex].filterOptions = response?.filterValues.sector.map(
            ({ sector, sectorAr }) => {
              return {
                value: sector,
                label: lang.includes("en") ? sector : sectorAr,
                isSelected: false,
              }
            },
          )
        }
        if (sponsorIndex >= 0) {
          option[sponsorIndex].filterOptions =
            response?.filterValues.sponsor.map(({ sponsor }) => {
              return {
                value: sponsor,
                label: sponsor,
                isSelected: false,
              }
            })
        }
      }
    } catch (error) {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isLessThan1280) {
      if (opportunitiesData && opportunitiesData?.length > 3) {
        setOpportunitiesMoreBtnShow(true)
      } else {
        setOpportunitiesMoreBtnShow(false)
      }
      if (subscribedOpportunities && subscribedOpportunities?.length > 3) {
        setSubsOppMoreBtnShow(true)
      } else {
        setSubsOppMoreBtnShow(false)
      }
    } else {
      if (opportunitiesData && opportunitiesData?.length > 2) {
        setOpportunitiesMoreBtnShow(true)
      } else {
        setOpportunitiesMoreBtnShow(false)
      }
      if (subscribedOpportunities && subscribedOpportunities?.length > 2) {
        setSubsOppMoreBtnShow(true)
      } else {
        setSubsOppMoreBtnShow(false)
      }
    }
  }, [isLessThan1280, subscribedOpportunities, opportunitiesData])

  return (
    <>
      <ClientLayout
        title={t("index.page.title")}
        description={t("index.page.description")}
      >
        <PageContainer
          isLoading={isLoading}
          as="section"
          maxW="full"
          px="0"
          mt={{ base: 8, md: 8, lg: 0 }}
          filter={isLoading ? "blur(3px)" : "none"}
        >
          {isLoading ? (
            <SkeletonOpportunityCard flex="1" mb="25px" mt="20px" />
          ) : (
            <Fragment>
              <Box>
                <Flex
                  justifyContent="space-between"
                  flexDirection="row"
                  alignItems="center"
                >
                  <Heading
                    fontSize="30px"
                    fontWeight="400"
                    mb="8px"
                    textAlign={{ base: "start", md: "start" }}
                  >
                    {t("opportunities:client.title")}
                  </Heading>
                  <Box display={{ base: "none", lgp: "block" }}>
                    <Text
                      aria-label="Investment Cart"
                      role={"button"}
                      display={{ base: "none", md: "block" }}
                      fontSize="16px"
                      fontWeight="500"
                      color="primary.500"
                      mb="8"
                      textAlign={{ base: "start", md: "start" }}
                      onClick={() => router.push("/client/subscription")}
                      cursor="pointer"
                    >
                      <InvestmentCartIcon me="2" />
                      {t(`common:client.investmentCart.title`)} (
                      {investmentCartCount?.length})
                    </Text>
                  </Box>
                </Flex>
                <Text
                  fontSize="18px"
                  fontWeight="400"
                  color="gray.400"
                  textAlign={{ base: "start", md: "start" }}
                >
                  {t("client.description")}
                </Text>
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  m={{ base: "50px 0 16px 0", md: "50px 0 34px 0" }}
                  d={{ base: "block", md: "flex" }}
                >
                  <Heading
                    fontSize="24px"
                    fontWeight="400"
                    color="contrast.200"
                  >
                    {t(`client.labels.allDeals`)}
                  </Heading>
                  {opportunitiesMoreBtnShowIs && (
                    <Link
                      _hover={{
                        textDecoration: "none",
                      }}
                      onClick={() => {
                        router.push("/client/opportunities/all-deals")
                      }}
                    >
                      <Flex
                        alignItems="center"
                        mt={{ base: "16px", md: "0" }}
                        justifyContent={{ base: "flex-end", md: "flex-start" }}
                      >
                        <Text
                          fontSize="14px"
                          color="primary.500"
                          textDecoration="underline"
                        >
                          {t("common:button.seeMore")}
                        </Text>
                        <CaretRightIcon
                          m="0 5px"
                          color="primary.500"
                          transform={
                            lang.includes("en")
                              ? "rotate(0)"
                              : "rotate(-180deg)"
                          }
                          position="relative"
                          transformOrigin="center"
                        />
                      </Flex>
                    </Link>
                  )}
                </Flex>
              </Box>
              {opportunitiesData?.length ? (
                <OpportunityCard
                  opportunities={opportunitiesData}
                  showHeading={false}
                  showAll={false}
                />
              ) : (
                <NoDataFound isDescription isIcon isHeader />
              )}
              {subscribedOpportunities?.length ? (
                <>
                  <Divider
                    my="6"
                    borderBottomWidth="2px"
                    borderColor="gray.800"
                    opacity="1"
                  />
                  <Box>
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      m={{ base: "50px 0 16px 0", md: "50px 0 34px 0" }}
                      d={{ base: "block", md: "flex" }}
                    >
                      <Heading
                        fontSize="24px"
                        fontWeight="400"
                        color="contrast.200"
                      >
                        {t("opportunities:client.subscribedDeals.title")}
                      </Heading>
                      {subsOppMoreBtnShowIs && (
                        <Link
                          _hover={{
                            textDecoration: "none",
                          }}
                          onClick={() => {
                            router.push(
                              "/client/opportunities/subscribed-deals",
                            )
                          }}
                        >
                          <Flex
                            alignItems="center"
                            mt={{ base: "16px", md: "0" }}
                            justifyContent={{
                              base: "flex-end",
                              md: "flex-start",
                            }}
                          >
                            <Text
                              fontSize="14px"
                              color="primary.500"
                              textDecoration="underline"
                            >
                              {t("common:button.seeMore")}
                            </Text>
                            <CaretRightIcon
                              m="0 5px"
                              color="primary.500"
                              transform={
                                lang.includes("en")
                                  ? "rotate(0)"
                                  : "rotate(-180deg)"
                              }
                              position="relative"
                              transformOrigin="center"
                            />
                          </Flex>
                        </Link>
                      )}
                    </Flex>
                  </Box>
                  {subscribedOpportunities?.length ? (
                    <OpportunityCard
                      opportunities={subscribedOpportunities}
                      showHeading={false}
                      showAll={false}
                    />
                  ) : (
                    <NoDataFound isDescription isIcon isHeader />
                  )}
                </>
              ) : (
                false
              )}
            </Fragment>
          )}
        </PageContainer>
      </ClientLayout>
    </>
  )
}

export default Opportunities

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
