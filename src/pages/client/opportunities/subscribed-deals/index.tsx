import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import { Box, Heading, Text } from "@chakra-ui/layout"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
} from "@chakra-ui/react"
import ky from "ky"
import moment from "moment"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useEffect, useState } from "react"
import useSWR from "swr"

import {
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

  const [subscribedOpportunities, setSubscribedOpportunities] =
    useState<OpportunitiesProps[]>()
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
    let values: string[] = []
    let key: string[] = []

    let filterdata = filterOptionData?.length ? filterOptionData : filterOptions
    filterdata.forEach(({ filterOptions, filterNameKey }) => {
      let findCheckedOptions = filterOptions
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
      let response = await ky
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

      let subscribedDeals = response?.data.filter((element) => {
        return element.isInvested
      })

      setSubscribedOpportunities(subscribedDeals)
      setIsLoading(false)
      if (isOnLoad) {
        let assetClassIndex = filterOptions.findIndex(({ filterNameKey }) => {
          return filterNameKey == "assetClass"
        })
        let sectorIndex = filterOptions.findIndex(({ filterNameKey }) => {
          return filterNameKey == "sector"
        })
        let sponsorIndex = filterOptions.findIndex(({ filterNameKey }) => {
          return filterNameKey == "sponsor"
        })
        let option = filterOptions
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
              <Breadcrumb
                fontSize="12px"
                m="8px 0"
                d={{ base: "none", md: "block", lgp: "block" }}
              >
                <BreadcrumbItem>
                  <BreadcrumbLink
                    color="primary.500"
                    href="./"
                    _focus={{ boxShadow: "none" }}
                    fontSize="12px"
                  >
                    {t("index.heading")}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink
                    fontSize="12px"
                    dir="ltr"
                    fontFamily="'Gotham'"
                    _hover={{ textDecoration: "none" }}
                    cursor="default"
                  >
                    {t("opportunities:client.subscribedDeals.title")}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
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
                      <InvestmentCartIcon />{" "}
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
                  m="50px 0 34px 0"
                >
                  <Heading
                    fontSize="24px"
                    fontWeight="400"
                    color="contrast.200"
                  >
                    {t("opportunities:client.subscribedDeals.title")}
                  </Heading>
                </Flex>
              </Box>
              {subscribedOpportunities?.length ? (
                <OpportunityCard
                  opportunities={subscribedOpportunities}
                  showHeading={false}
                  showAll={true}
                />
              ) : (
                <NoDataFound isDescription isIcon isHeader />
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
