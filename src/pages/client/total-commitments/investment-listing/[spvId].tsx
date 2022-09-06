import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import {
  Box,
  Flex,
  Hide,
  Link,
  ListItem,
  OrderedList,
  Show,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"
import ky from "ky"
import moment from "moment"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useEffect, useState } from "react"
import useSWR from "swr"

import {
  ClientLayout,
  DesktopMultiRowTable,
  FilterChips,
  FilterDrawer,
  FilterIcon,
  ModalBox,
  NoDataFound,
  PageContainer,
  QuarterTabs,
  ScrollTop,
  SkeletonCard,
} from "~/components"
import { useUser } from "~/hooks/useUser"
import { DatesObj, GroupByDeal, Industry } from "~/services/mytfo/clientTypes"
import { FilterDataType } from "~/services/mytfo/types"
import {
  formatShortDate,
  getQuarterDate,
} from "~/utils/clientUtils/dateUtility"
import { roundCurrencyValue } from "~/utils/clientUtils/globalUtilities"
import { screenSpentTime } from "~/utils/googleEventsClient"
import { clientEvent } from "~/utils/gtag"

type InvestListingData = {
  groupByDeals: GroupByDeal[]
}

type TimePeriod = { value: string; label: string }[]

type InvestmentListingProps = {
  spvId: string
}

type InvestmentListingPropsType = {
  isFilter: boolean
  filterOptions: FilterDataType[]
  applyFilter: Function
  closeFilter: Function
  updateFilter: Function
  onReset: () => void
}

type ChipDataType = {
  label: string | number
  value: string | number
}

const InvestmentListing = ({ spvId }: InvestmentListingProps) => {
  const { user } = useUser()
  const { t, lang } = useTranslation("investmentListing")
  const [isLoading, setIsLoading] = useState(true)
  const [invListingData, setInvListingData] = useState<GroupByDeal[]>()
  const [timePeriod, setTimePeriod] = useState<TimePeriod>()
  const [selectedQuarterData, setSelectedQuarterData] = useState<GroupByDeal>()
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isFilter, setIsFilter] = useState<boolean>(false)
  const [selectedOrderOption, setSelectedOrderOption] = useState("asc")
  const [error, setError] = useState(false)
  const [selectedSortOption, setSelectedSortOption] =
    useState("investmentVehicle")
  const [activeFilterOptions, setActiveFilterOptions] = useState<
    ChipDataType[]
  >([])
  const [filterOptions, setFilterOptions] = useState<FilterDataType[]>([
    {
      filterName: t("common:filters.filterTypes.sort.title"),
      filterNameKey: "sortBy",
      filterOptions: [
        {
          label: t("common:filters.filterTypes.sort.options.investmentVehicle"),
          value: "investmentVehicle",
        },
        {
          label: t("common:filters.filterTypes.sort.options.region"),
          value: "region",
        },
      ],
      filterType: "radio",
      selectedOption: "investmentVehicle",
    },
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
      filterName: t("common:filters.filterTypes.region.title"),
      filterNameKey: "region",
      filterOptions: [
        {
          isSelected: false,
          value: "asia",
          label: t("common:filters.filterTypes.region.options.asia"),
        },
        {
          isSelected: false,
          value: "europe",
          label: t("common:filters.filterTypes.region.options.europe"),
        },
        {
          isSelected: false,
          value: "global",
          label: t("common:filters.filterTypes.region.options.global"),
        },
        {
          isSelected: false,
          value: "northAmerica",
          label: t("common:filters.filterTypes.region.options.northAmerica"),
        },
      ],
      filterType: "checkbox",
    },
  ])

  const { data: lastValuationDate, error: valuationDateError } = useSWR(
    `/api/client/get-last-valuation-date`,
  )

  useEffect(() => {
    if (valuationDateError) {
      setError(true)
    }
  }, [valuationDateError])

  useEffect(() => {
    getInvListingData()
  }, [])

  useEffect(() => {
    const openTime = moment(new Date())
    return () => {
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        screenSpentTime,
        "Commitments Listing",
        duration.asSeconds().toString(),
        user?.mandateId as string,
        user?.email as string,
      )
    }
  }, [])

  const getInvListingData = async (filterOptionData?: FilterDataType[]) => {
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
        .post(`/api/client/deals/commitment-related-deals?spvId=${spvId}`, {
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
        .json()

      var listingData = response as InvestListingData

      setTimePeriod(
        listingData?.groupByDeals
          .map(({ timeperiod }) => {
            return {
              value: `${timeperiod.quarter}`,
              label: `${t(
                `common:client.quarters.quarter_${timeperiod.quarter}`,
              )} ${timeperiod.year}`,
            }
          })
          .reverse(),
      )

      setSelectedQuarterData(listingData?.groupByDeals[0])
      setInvListingData(listingData?.groupByDeals)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      setError(true)
    }
  }

  const changeActiveFilter = (value: string | number) => {
    var findData = invListingData?.find((data) => {
      return data.timeperiod.quarter == value
    })
    if (findData) {
      setSelectedQuarterData(findData)
    }
  }

  const goToDetailPage = (path: string, dealId?: number | string) => {
    router.push(`${path}${dealId ? `/${dealId}` : ""}`)
  }

  const getIndustry = (industry: Industry[]) => {
    return industry.find((x) => {
      return x.langCode.toLowerCase() == lang
    })?.value
  }

  const rendeSubTitle = () => {
    var getDates: DatesObj

    var quarterDates = getQuarterDate(
      selectedQuarterData?.timeperiod.quarter as number,
      selectedQuarterData?.timeperiod.year as number,
    )

    var differenceChecker = moment(lastValuationDate.lastValuationDate).diff(
      moment(quarterDates?.toDate),
      "days",
    )

    getDates = {
      fromDate: formatShortDate(quarterDates?.fromDate as string, lang),
      toDate:
        differenceChecker < 0
          ? formatShortDate(lastValuationDate.lastValuationDate as string, lang)
          : formatShortDate(quarterDates?.toDate as string, lang),
    }

    return t(`description`, {
      fromDate: getDates.fromDate,
      toDate: getDates.toDate,
    })
  }

  const openFilter = () => {
    setIsFilter(true)
  }

  const closeFilter = () => {
    setIsFilter(false)
    filterOptions.forEach((x) => {
      if (x.filterType == "checkbox") {
        x.filterOptions.forEach((y) => {
          var activeFilterCheck = activeFilterOptions.find((z) => {
            return z.value == y.value
          })
          if (activeFilterCheck) {
            y.isSelected = true
          } else {
            y.isSelected = false
          }
        })
      } else if (x.filterType == "radio") {
        if (x.filterNameKey == "sortBy") {
          x.selectedOption = selectedSortOption
        } else if (x.filterNameKey == "orderBy") {
          x.selectedOption = selectedOrderOption
        }
      }
    })
    setFilterOptions([...filterOptions])
  }

  const applyFilter = async () => {
    filterOptions
      .filter((x) => {
        return x.filterType == "radio"
      })
      .forEach((y) => {
        if (y.filterNameKey == "sortBy") {
          setSelectedSortOption(y.selectedOption || "")
        } else if (y.filterNameKey == "orderBy") {
          setSelectedOrderOption(y.selectedOption || "")
        }
      })
    setFilterOptions([...filterOptions])
    updateChips(filterOptions)
    getInvListingData(filterOptions)
    setIsFilter(false)
  }

  const updateChips = (filterOptionsData?: FilterDataType[]) => {
    var data = filterOptionsData?.length ? filterOptionsData : filterOptions
    var chipsData: ChipDataType[] = []
    data.forEach(({ filterOptions }) => {
      filterOptions
        .filter(({ isSelected }) => {
          return isSelected
        })
        .forEach(({ value, label }) => {
          chipsData.push({
            value,
            label,
          })
        })
    })
    if (chipsData?.length) {
      setActiveFilterOptions([...chipsData])
    } else {
      setActiveFilterOptions([])
    }
  }

  const onChipClear = async () => {
    filterOptions.forEach((x) => {
      if (x.filterType == "checkbox") {
        x.filterOptions.forEach((y) => {
          y.isSelected = false
        })
      } else if (x.filterType == "radio") {
        x.selectedOption =
          x.filterNameKey == "sortBy" ? "investmentVehicle" : "asc"
      }
    })
    setFilterOptions([...filterOptions])
    updateChips(filterOptions)
    await getInvListingData(filterOptions)
  }

  const onFilterRemove = (value: string | number) => {
    filterOptions.every((filterData, i) => {
      var index = filterData?.filterOptions.findIndex((option) => {
        return option.value == value
      })
      if (index >= 0) {
        filterOptions[i].filterOptions[index].isSelected = false
        return false
      } else {
        return true
      }
    })

    setFilterOptions([...filterOptions])
    updateChips(filterOptions)
    getInvListingData(filterOptions)
  }

  const updateFilter = (filterOptionsData: FilterDataType[]) => {
    setFilterOptions([...filterOptionsData])
  }

  useEffect(() => {
    if (isLoading) {
      setIsPageLoading(true)
    } else {
      setIsPageLoading(false)
    }
  }, [isLoading])

  const scrollToTop = () => {
    const input = document.getElementById("scrollTop")
    const element: HTMLElement = input!

    element.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const isTabView = useBreakpointValue({
    base: true,
    md: true,
    lg: false,
    lgp: false,
    xl: false,
    "2xl": false,
  })

  return (
    <ClientLayout title={t("page.title")} description={t("page.description")}>
      {error && !isPageLoading && !isLoading ? (
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
          mt={{ base: 0, md: 0, lgp: 0 }}
          filter={isPageLoading ? "blur(3px)" : "none"}
        >
          {isLoading ? (
            <SkeletonCard flex="1" mb="25px" mt="20px" />
          ) : (
            <Fragment>
              {" "}
              <Flex
                justifyContent="space-between"
                mb={{ lgp: "64px", md: "24px", base: "24px" }}
                d={{ lgp: "flex", md: "block", base: "block" }}
                alignItems={{ lgp: "center" }}
              >
                <Box
                  w={{ lgp: "40%", md: "100%", base: "100%" }}
                  mb={{ lgp: "0", md: "18px", base: "18px" }}
                >
                  <Box>
                    <Box
                      as="nav"
                      fontStyle="normal"
                      mb={{ base: "0", md: "0px", lgp: "0" }}
                      fontSize="12px"
                      fontWeight="400"
                      d={{ base: "none", md: "block", lgp: "block" }}
                    >
                      <OrderedList m="8px 0">
                        <ListItem display="inline-flex" alignItems="center">
                          {" "}
                        </ListItem>
                        <ListItem display="inline-flex" alignItems="center">
                          <Link
                            onClick={() =>
                              router.push("/client/total-commitments")
                            }
                            color="primary.500"
                          >
                            {t(`common:nav.links.totalCommitments`)}
                          </Link>
                          <Box as="span" marginInline="0.5rem">
                            /
                          </Box>
                        </ListItem>
                        <ListItem
                          display="inline-flex"
                          alignItems="center"
                          _hover={{ textDecoration: "underline" }}
                        >
                          {t("page.title")}
                        </ListItem>
                      </OrderedList>
                    </Box>
                  </Box>
                  <Box>
                    <Box
                      as="h4"
                      color="contrast.200"
                      fontWeight="400"
                      fontSize="30px"
                      mb="8px"
                    >
                      {t("heading")}
                    </Box>
                    <Box
                      as="h4"
                      color="gray.400"
                      fontWeight="400"
                      lineHeight="24px"
                      fontSize="18px"
                    >
                      {lastValuationDate ? rendeSubTitle() : false}
                    </Box>
                  </Box>
                </Box>
                {timePeriod?.length ? (
                  <Box w={{ lgp: "60%", md: "100%", base: "100%" }}>
                    <Hide below="lgp">
                      <Flex
                        space="34px"
                        style={{
                          justifyContent: lang.includes("en")
                            ? "right"
                            : "left",
                        }}
                        d={{ base: "none", md: "none", lgp: "flex" }}
                      >
                        <QuarterTabs
                          changeActiveFilter={changeActiveFilter}
                          activeOption={selectedQuarterData?.timeperiod.quarter}
                          options={timePeriod}
                          viewType="desktop"
                        />
                      </Flex>
                    </Hide>
                    <Show below="lgp">
                      <QuarterTabs
                        changeActiveFilter={changeActiveFilter}
                        activeOption={selectedQuarterData?.timeperiod.quarter}
                        options={timePeriod}
                        viewType="mobile"
                      />
                    </Show>
                  </Box>
                ) : (
                  false
                )}
              </Flex>
              <Box
                m="30px 0"
                d="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text fontSize="18px" fontWeight="400" color="contrast.200">
                  {t("investmentTable.title")}
                </Text>
                <Link
                  _hover={{
                    textDecoration: "none",
                  }}
                  onClick={openFilter}
                >
                  <Flex alignItems="center">
                    <FilterIcon
                      m="0 5px"
                      width="25px"
                      height="25px"
                      color="primary.500"
                    />{" "}
                    <Text
                      fontSize="14px"
                      color="primary.500"
                      textDecor="underline"
                    >
                      {t("common:client.sortByFilter")}{" "}
                    </Text>
                  </Flex>
                </Link>
              </Box>
              <Box mb="30px">
                {activeFilterOptions?.length > 0 && (
                  <FilterChips
                    onClose={onFilterRemove}
                    onClear={onChipClear}
                    data={activeFilterOptions}
                  />
                )}
              </Box>
              {selectedQuarterData?.deals.length ? (
                <Fragment>
                  {selectedQuarterData?.deals.map(
                    ({ investmentVehicle, region, investments }, j) => (
                      <Box key={j}>
                        <Box>
                          <Text fontSize="14px" fontWeight="400">
                            {investmentVehicle
                              ? investmentVehicle
                              : t(`common:client.regions.${region}`)}
                          </Text>
                        </Box>
                        {investments.map(
                          (
                            {
                              id,
                              name,
                              bookValue,
                              marketValue,
                              distributionAmount,
                              region,
                              industry,
                              holdingPeriod,
                            },
                            i,
                          ) => (
                            <Fragment key={i}>
                              <Box>
                                <Box
                                  onClick={() =>
                                    goToDetailPage(
                                      "/client/investment-detail",
                                      id,
                                    )
                                  }
                                  mt={i == 0 ? "16px" : "32px"}
                                  mb="8px"
                                  cursor="pointer"
                                >
                                  <Text
                                    aria-label="Deal Name"
                                    role={"contentinfo"}
                                    fontSize="14px"
                                    fontWeight="400"
                                    color="gray.400"
                                  >
                                    {name}
                                  </Text>
                                </Box>
                                <Box aria-label="Deal Detail" role={"group"}>
                                  <DesktopMultiRowTable
                                    tableGridSize={8}
                                    tableBody={[
                                      {
                                        data: [
                                          {
                                            value: t(
                                              "investmentTable.tableHeader.bookValue",
                                            ),
                                            size: 4,
                                            style: {
                                              textAlign: "left",
                                              fontWeight: "400",
                                              fontSize: "14px",
                                              lineHeight: "120%",
                                              color: "contrast.200",
                                              paddingRight: "0",
                                            },
                                          },
                                          {
                                            value: `$${roundCurrencyValue(
                                              bookValue,
                                            )}`,
                                            size: 4,
                                            style: {
                                              textAlign: "end",
                                              fontWeight: "400",
                                              fontSize: isTabView
                                                ? "14px"
                                                : "20px",
                                              lineHeight: "120%",
                                              color: "contrast.200",
                                              paddingRight: "0",
                                            },
                                          },
                                        ],
                                      },
                                      {
                                        data: [
                                          {
                                            value: t(
                                              "investmentTable.tableHeader.marketValue",
                                            ),
                                            size: 4,
                                            style: {
                                              textAlign: "left",
                                              fontWeight: "400",
                                              fontSize: "14px",
                                              lineHeight: "120%",
                                              color: "contrast.200",
                                              paddingRight: "0",
                                            },
                                          },
                                          {
                                            value: `$${roundCurrencyValue(
                                              marketValue,
                                            )}`,
                                            size: 4,
                                            style: {
                                              textAlign: "end",
                                              fontWeight: "400",
                                              fontSize: isTabView
                                                ? "14px"
                                                : "20px",
                                              lineHeight: "120%",
                                              color: "contrast.200",
                                              paddingRight: "0",
                                            },
                                          },
                                        ],
                                      },
                                      {
                                        data: [
                                          {
                                            value: t(
                                              "investmentTable.tableHeader.distributions",
                                            ),
                                            size: 4,
                                            style: {
                                              textAlign: "left",
                                              fontWeight: "400",
                                              fontSize: "14px",
                                              lineHeight: "120%",
                                              color: "contrast.200",
                                              paddingRight: "0",
                                            },
                                          },
                                          {
                                            value: `$${roundCurrencyValue(
                                              distributionAmount,
                                            )}`,
                                            size: 4,
                                            style: {
                                              textAlign: "end",
                                              fontWeight: "400",
                                              fontSize: isTabView
                                                ? "14px"
                                                : "20px",
                                              lineHeight: "120%",
                                              color: "contrast.200",
                                              paddingRight: "0",
                                            },
                                          },
                                        ],
                                      },
                                      {
                                        data: [
                                          {
                                            value: t(
                                              "investmentTable.tableHeader.type",
                                            ),
                                            size: 4,
                                            style: {
                                              textAlign: "left",
                                              fontWeight: "400",
                                              fontSize: "14px",
                                              lineHeight: "120%",
                                              color: "contrast.200",
                                              paddingRight: "0",
                                            },
                                          },
                                          {
                                            value: investmentVehicle,
                                            size: 4,
                                            style: {
                                              textAlign: "end",
                                              fontWeight: "400",
                                              fontSize: isTabView
                                                ? "14px"
                                                : "20px",
                                              lineHeight: "120%",
                                              color: "contrast.200",
                                              paddingRight: "0",
                                            },
                                          },
                                        ],
                                      },
                                      {
                                        data: [
                                          {
                                            value: t(
                                              "investmentTable.tableHeader.region",
                                            ),
                                            size: 4,
                                            style: {
                                              textAlign: "left",
                                              fontWeight: "400",
                                              fontSize: "14px",
                                              lineHeight: "120%",
                                              color: "contrast.200",
                                              paddingRight: "0",
                                            },
                                          },
                                          {
                                            value: t(
                                              `common:client.regions.${region}`,
                                            ),
                                            size: 4,
                                            style: {
                                              textAlign: "end",
                                              fontWeight: "400",
                                              fontSize: isTabView
                                                ? "14px"
                                                : "20px",
                                              lineHeight: "120%",
                                              color: "contrast.200",
                                              paddingRight: "0",
                                            },
                                          },
                                        ],
                                      },
                                      {
                                        data: [
                                          {
                                            value: t(
                                              "investmentTable.tableHeader.sector",
                                            ),
                                            size: 4,
                                            style: {
                                              textAlign: "left",
                                              fontWeight: "400",
                                              fontSize: "14px",
                                              lineHeight: "120%",
                                              color: "contrast.200",
                                              paddingRight: "0",
                                            },
                                          },
                                          {
                                            value: getIndustry(industry),
                                            size: 4,
                                            style: {
                                              textAlign: "end",
                                              fontWeight: "400",
                                              fontSize: isTabView
                                                ? "14px"
                                                : "20px",
                                              lineHeight: "120%",
                                              color: "contrast.200",
                                              paddingRight: "0",
                                            },
                                          },
                                        ],
                                      },
                                      {
                                        data: [
                                          {
                                            value: t(
                                              "investmentTable.tableHeader.holdingPeriod",
                                            ),
                                            size: 4,
                                            style: {
                                              textAlign: "left",
                                              fontWeight: "400",
                                              fontSize: "14px",
                                              lineHeight: "120%",
                                              color: "contrast.200",
                                              paddingRight: "0",
                                            },
                                          },
                                          {
                                            value: `${holdingPeriod} Years`,
                                            size: 4,
                                            style: {
                                              textAlign: "end",
                                              fontWeight: "400",
                                              fontSize: isTabView
                                                ? "14px"
                                                : "20px",
                                              lineHeight: "120%",
                                              color: "contrast.200",
                                              paddingRight: "0",
                                            },
                                          },
                                        ],
                                      },
                                    ]}
                                  />
                                </Box>
                              </Box>
                            </Fragment>
                          ),
                        )}
                      </Box>
                    ),
                  )}
                  <Box
                    position="fixed"
                    right="3%"
                    bottom="2%"
                    zIndex="100"
                    cursor="pointer"
                    onClick={() => scrollToTop()}
                  >
                    <ScrollTop />
                  </Box>
                </Fragment>
              ) : (
                <Box mt={"15px"}>
                  <NoDataFound isDescription isHeader isIcon />
                </Box>
              )}
            </Fragment>
          )}

          <InvestmentListingFilter
            filterOptions={filterOptions}
            closeFilter={closeFilter}
            applyFilter={applyFilter}
            onReset={onChipClear}
            isFilter={isFilter}
            updateFilter={updateFilter}
          />
        </PageContainer>
      )}
    </ClientLayout>
  )
}

export default InvestmentListing

const InvestmentListingFilter = ({
  isFilter,
  filterOptions,
  applyFilter,
  closeFilter,
  updateFilter,
  onReset,
}: InvestmentListingPropsType) => {
  const updateFilterData = (filterData: FilterDataType[]) => {
    updateFilter(filterData)
  }

  const resetFilter = () => {
    onReset()
  }

  return (
    <FilterDrawer
      updateFilterData={updateFilterData}
      isOpen={isFilter}
      filterData={filterOptions}
      onApply={() => applyFilter()}
      onClose={() => closeFilter()}
      onReset={resetFilter}
    />
  )
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async function (ctx) {
    const sesison = getSession(ctx.req, ctx.res)
    if (sesison?.mandateId && ctx?.params?.spvId) {
      return {
        props: {
          spvId: ctx?.params?.spvId,
        }, // will be passed to the page component as props
      }
    }
    return {
      notFound: true,
    }
  },
})
