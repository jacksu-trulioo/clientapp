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
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react"
import ky from "ky"
import moment from "moment"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useEffect, useState } from "react"
import useSWR from "swr"

import {
  ClientLayout,
  ConfirmModalBox,
  DesktopMultiRowTable,
  DownloadButton,
  FeedbackModal,
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
import siteConfig from "~/config"
import { useUser } from "~/hooks/useUser"
import { DatesObj, GroupByDeal, Industry } from "~/services/mytfo/clientTypes"
import {
  FeedbackSubmissionScreen,
  FilterDataType,
} from "~/services/mytfo/types"
import {
  formatShortDate,
  getQuarterDate,
} from "~/utils/clientUtils/dateUtility"
import {
  getFeedbackCookieStatus,
  setFeedbackCookieStatus,
} from "~/utils/clientUtils/feedbackCookieUtilities"
import {
  roundCurrencyValue,
  triggerInvestmentSortFilterEvent,
} from "~/utils/clientUtils/globalUtilities"
import { downloadBlob } from "~/utils/downloadBlob"
import { downloadedExcel, screenSpentTime } from "~/utils/googleEventsClient"
import { clientEvent } from "~/utils/gtag"

type InvestListingData = {
  groupByDeals: GroupByDeal[]
  investmentVehicleList: string[]
}

type TimePeriod = { value: string; label: string }[]

type ChipDataType = {
  label: string | number
  value: string | number
}

type InvestmentListingPropsType = {
  isFilter: boolean
  filterOptions: FilterDataType[]
  applyFilter: Function
  closeFilter: Function
  updateFilter: Function
  onReset: () => void
}

const InvestmentListing = () => {
  const { user } = useUser()
  const { t, lang } = useTranslation("investmentListing")
  const [isLoading, setIsLoading] = useState(true)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [invListingData, setInvListingData] = useState<GroupByDeal[]>()
  const [timePeriod, setTimePeriod] = useState<TimePeriod>()
  const [selectedQuarterData, setSelectedQuarterData] = useState<GroupByDeal>()
  const [isFilter, setIsFilter] = useState<boolean>(false)
  const [activeFilterOptions, setActiveFilterOptions] = useState<
    ChipDataType[]
  >([])
  const [downloadConfirmation, setDownloadConfirmation] = useState(false)
  const [error, setError] = useState(false)
  const [selectedOrderOption, setSelectedOrderOption] = useState("asc")
  const [selectedSortOption, setSelectedSortOption] =
    useState("investmentVehicle")
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
      selectedOption: selectedSortOption,
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
      selectedOption: selectedOrderOption,
    },
    {
      filterName: t("common:filters.filterTypes.investmentVehicle.title"),
      filterNameKey: "investmentVehicle",
      filterOptions: [],
      filterType: "checkbox",
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
  const {
    isOpen: isFeedbackModalOpen,
    onOpen: onFeedbackModalOpen,
    onClose: onFeedbackModalClose,
  } = useDisclosure()

  const { data: lastValuationDate } = useSWR(
    `/api/client/get-last-valuation-date`,
  )

  useEffect(() => {
    if (!lastValuationDate) {
      setError(true)
    }
  }, [lastValuationDate])

  const isTabView = useMediaQuery([
    "(max-width: 1200px)",
    "(display-mode: browser)",
  ])

  const getTabView = () => {
    var tabView = false
    isTabView.forEach((item, index) => {
      if (index == 0 && item) {
        tabView = item
      }
    })
    return tabView
  }

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
        "Investment Listing",
        duration.asSeconds().toString(),
        user?.mandateId as string,
        user?.email as string,
      )
    }
  }, [])

  useEffect(() => {
    getInvListingData(true)
  }, [])

  const getInvListingData = async (
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
        .post("/api/client/investments/investment-listing", {
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
      if (isOnLoad) {
        var invVehicleFilterOptionIndex = filterOptions.findIndex(
          ({ filterNameKey }) => {
            return filterNameKey == "investmentVehicle"
          },
        )
        if (invVehicleFilterOptionIndex >= 0) {
          var option = filterOptions
          option[invVehicleFilterOptionIndex].filterOptions =
            listingData?.investmentVehicleList.map((investmentName) => {
              return {
                value: investmentName,
                label: investmentName,
                isSelected: false,
              }
            })
          setFilterOptions([...option])
        }
      }
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
    if (dealId) {
      router.push(`${path}/${dealId}`)
    } else {
      router.push(`${path}`)
    }
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
    let sortOption: string = ""

    filterOptions
      .filter((x) => {
        return x.filterType == "radio"
      })
      .forEach((y) => {
        if (y.filterNameKey == "sortBy") {
          sortOption = y.selectedOption as string
          setSelectedSortOption(y.selectedOption || "")
        } else if (y.filterNameKey == "orderBy") {
          setSelectedOrderOption(y.selectedOption || "")
        }
      })
    setFilterOptions([...filterOptions])
    updateChips(filterOptions)
    getInvListingData(false, filterOptions)
    setIsFilter(false)

    triggerInvestmentSortFilterEvent(
      filterOptions,
      sortOption,
      user?.mandateId as string,
      user?.email as string,
    )
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
    await getInvListingData(true, filterOptions)
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
    getInvListingData(false, filterOptions)
  }

  const updateFilter = (filterOptionsData: FilterDataType[]) => {
    setFilterOptions([...filterOptionsData])
  }

  const scrollToTop = () => {
    const input = document.getElementById("scrollTop")
    const element: HTMLElement = input!

    element.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const downloadTableDataInExcel = async (type?: string) => {
    let values: string[] = []
    let key: string[] = []
    if (type != "all") {
      let filterdata = filterOptions
      filterdata.forEach((tableFilter) => {
        let findCheckedOptions = tableFilter.filterOptions
          .filter(({ isSelected }) => {
            return isSelected
          })
          .map(({ value }) => {
            values.push(value as string)
          })

        if (findCheckedOptions.length) {
          key.push(tableFilter.filterNameKey as string)
        }
      })
    }
    let response = await ky.post("/api/client/generate-excel-file", {
      json: {
        type: "investmentListing",
        filterKeys: key,
        filterValues: values,
        quarter: selectedQuarterData?.timeperiod.quarter,
        orderBy: filterOptions.find(({ filterNameKey }) => {
          return filterNameKey == "sortBy"
        })?.selectedOption,
      },
    })
    let fileData = await response.blob()
    let fileName = `${user?.mandateId}-Investment-Listing`
    downloadBlob(window.URL.createObjectURL(fileData), fileName)
    clientEvent(
      downloadedExcel,
      "Investment Listing",
      fileName,
      user?.mandateId as string,
      user?.email as string,
    )
    if (
      getFeedbackCookieStatus(siteConfig.clientFeedbackSessionVariableName) ==
      "true"
    ) {
      setTimeout(() => {
        onFeedbackModalOpen()
      }, 500)
    }
  }

  const checkFiltersForDownload = () => {
    if (activeFilterOptions.length) {
      setDownloadConfirmation(true)
    } else {
      downloadTableDataInExcel()
    }
  }

  return (
    <ClientLayout title={t("page.title")} description={t("page.description")}>
      {error && !isPageLoading && !isLoading ? (
        <ModalBox
          isOpen={error}
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
        <Fragment>
          {" "}
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
              <Fragment>
                {" "}
                <Flex
                  justifyContent="space-between"
                  mb={{ lgp: "30px", md: "24px", base: "24px" }}
                  d={{ lgp: "flex", md: "block", base: "block" }}
                  alignItems={{ lgp: "center" }}
                >
                  <Box
                    w={{ lgp: "100%", md: "100%", base: "100%" }}
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
                                router.push("/client/total-investments")
                              }
                              color="primary.500"
                            >
                              {t("common:nav.links.totalInvestments")}
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
                        {rendeSubTitle()}
                      </Box>
                    </Box>
                  </Box>
                </Flex>
                {timePeriod?.length ? (
                  <Box
                    aria-label="subTitle"
                    role={"heading"}
                    w={{ lgp: "100%", md: "100%", base: "100%" }}
                  >
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
                <Flex
                  justifyContent={{ base: "space-between", md: "flex-end" }}
                  alignItems="center"
                  m={{ base: "30px 0 30px", md: "30px 0 0" }}
                >
                  {selectedQuarterData?.deals.length ? (
                    <Box display={{ base: "none", lgp: "block" }}>
                      <DownloadButton
                        onDownloadClick={checkFiltersForDownload}
                      />
                    </Box>
                  ) : (
                    false
                  )}

                  <Link
                    textDecoration="underline"
                    onClick={openFilter}
                    color="primary.500"
                  >
                    <Flex p="0 12px">
                      <FilterIcon m="0 5px" color="primary.500" ml="12px" />
                      <Text
                        aria-label={t("common:client.sortByFilter")}
                        role={"button"}
                        fontSize="14px"
                        color="primary.500"
                      >
                        {t("common:client.sortByFilter")}
                      </Text>
                    </Flex>
                  </Link>
                </Flex>
                <Box
                  mb="32px"
                  d="flex"
                  alignItems="end"
                  justifyContent="space-between"
                  flexDir={{
                    base: "column-reverse",
                    lgp: "inherit",
                    md: "inherit",
                  }}
                >
                  <Box
                    mb="35px"
                    d={activeFilterOptions?.length > 0 ? "none" : "block"}
                  ></Box>

                  {activeFilterOptions?.length > 0 && (
                    <FilterChips
                      onClose={onFilterRemove}
                      onClear={onChipClear}
                      data={activeFilterOptions}
                    />
                  )}
                </Box>
                {selectedQuarterData?.deals.length ? (
                  selectedQuarterData?.deals.map(
                    ({ investmentVehicle, region, investments }, j) => (
                      <>
                        <Box key={j} mb="16px">
                          <Box
                            mt={{ lgp: "32px", base: "24px" }}
                            mb={{ base: "8px", md: "8px", lgp: "0" }}
                          >
                            <Text
                              aria-label="SPV Name Header"
                              role={"heading"}
                              fontSize={{ lgp: "14px", base: "18px" }}
                              fontWeight={{ lgp: "400", base: "700" }}
                            >
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
                                <Box aria-label="Deal Box" role={"group"}>
                                  <Box
                                    aria-label="Deal Name"
                                    role={"contentinfo"}
                                    onClick={() =>
                                      goToDetailPage(
                                        "/client/investment-detail",
                                        id,
                                      )
                                    }
                                    pt="16px"
                                    mb="8px"
                                  >
                                    <Text
                                      fontSize="14px"
                                      fontWeight="400"
                                      color="gray.400"
                                      cursor="pointer"
                                      textAlign={
                                        lang.includes("ar") ? "end" : "start"
                                      }
                                      dir={"ltr"}
                                    >
                                      {name}
                                    </Text>
                                  </Box>
                                  <Box
                                    aria-label="Deal Detail"
                                    role={"group"}
                                    mb="16px"
                                  >
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
                                                fontSize: getTabView()
                                                  ? "16px"
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
                                                fontSize: getTabView()
                                                  ? "16px"
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
                                                fontSize: getTabView()
                                                  ? "16px"
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
                                                fontSize: getTabView()
                                                  ? "16px"
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
                                                textAlign: lang.includes("ar")
                                                  ? "start"
                                                  : "end",
                                                fontWeight: "400",
                                                fontSize: getTabView()
                                                  ? "16px"
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
                                                fontSize: getTabView()
                                                  ? "16px"
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
                                              value: `${holdingPeriod} ${
                                                holdingPeriod >= 2
                                                  ? "Years"
                                                  : "Year"
                                              }`,
                                              size: 4,
                                              style: {
                                                textAlign: "end",
                                                fontWeight: "400",
                                                fontSize: getTabView()
                                                  ? "16px"
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
                      </>
                    ),
                  )
                ) : (
                  <NoDataFound isHeader isIcon isDescription />
                )}
              </Fragment>
            )}
            {filterOptions && (
              <InvestmentListingFilter
                filterOptions={filterOptions}
                closeFilter={closeFilter}
                applyFilter={applyFilter}
                onReset={onChipClear}
                isFilter={isFilter}
                updateFilter={updateFilter}
              />
            )}
            {downloadConfirmation && (
              <ConfirmModalBox
                isOpen={true}
                onClose={() => {
                  setDownloadConfirmation(false)
                }}
                bodyContent={t(`common:client.downloadPreference.bodyText`)}
                firstButtonText={t(
                  `common:client.downloadPreference.preferences.mySelection`,
                )}
                secondButtonText={t(
                  `common:client.downloadPreference.preferences.allData`,
                )}
                firstButtonOnClick={() => {
                  downloadTableDataInExcel()
                  setDownloadConfirmation(false)
                }}
                secondButtonOnClick={() => {
                  downloadTableDataInExcel("all")
                  setDownloadConfirmation(false)
                }}
              />
            )}
            <FeedbackModal
              hideReferalOption={true}
              isOpen={isFeedbackModalOpen}
              onClose={() => {
                onFeedbackModalClose()
                setFeedbackCookieStatus(
                  siteConfig.clientFeedbackSessionVariableName,
                  false,
                  siteConfig.clientFeedbackSessionExpireDays,
                )
              }}
              submissionScreen={
                FeedbackSubmissionScreen.ClientDownloadTableData
              }
            />
          </PageContainer>
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
    if (sesison?.mandateId) {
      return {
        props: {},
      }
    }
    return {
      notFound: true,
    }
  },
})
