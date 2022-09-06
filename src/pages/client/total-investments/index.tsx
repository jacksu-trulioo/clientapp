import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Hide,
  Link,
  Show,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import ky from "ky"
import moment from "moment"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useEffect, useState } from "react"
import useSWR from "swr"

import {
  Card,
  ChartAssets,
  ClientLayout,
  ConfirmModalBox,
  DownloadButton,
  FeedbackModal,
  FilterChips,
  FilterDrawer,
  FilterIcon,
  InvestmentDealsTable,
  InvestmentLocation,
  ModalBox,
  NoDataFound,
  PageContainer,
  PieChart,
  ResponsiveTable,
  SkeletonCard,
} from "~/components"
import siteConfig from "~/config"
import { useUser } from "~/hooks/useUser"
import {
  AccountSummariesHoldings,
  FeedbackSubmissionScreen,
  FilterDataType,
} from "~/services/mytfo/types"
import { formatShortDate } from "~/utils/clientUtils/dateUtility"
import {
  getFeedbackCookieStatus,
  setFeedbackCookieStatus,
} from "~/utils/clientUtils/feedbackCookieUtilities"
import {
  absoluteConvertCurrencyWithDollar,
  percentTwoDecimalPlace,
  roundCurrencyValue,
  triggerInvestmentSortFilterEvent,
} from "~/utils/clientUtils/globalUtilities"
import { downloadBlob } from "~/utils/downloadBlob"
import {
  downloadedExcel,
  screenSpentTime,
  sortInvestments,
} from "~/utils/googleEventsClient"
import { clientEvent, clientUniEvent } from "~/utils/gtag"

type TotalInvestmentData = {
  investmentVehicleList: []
  investments: [
    {
      region: string
      investmentVehicle: string
      deals: dataTypeForDeal[]
      style: { textAlign: string }
    },
  ]
}

type TotalInvestmentChartData = {
  cashInTransit: AccountSummariesHoldings
  lastValuationDate: string
  avgHoldingPeriod: number
  deals: number
  pieChartData: [{ name: string; value: number; color: string }]
  regionPercentage: LocationDataItem
}

type dataTypeForDeal = {
  id: number
  name: string
  investmentVehicle: string
  initialInvestmentDate: string
  bookValue: number
  marketValue: number
  performance: {
    percent: number
  }
}

type LocationDataItem = {
  perAsia: number
  perEurope: number
  perGlobal: number
  perNorthAmerica: number
}

type ChipDataType = {
  label: string | number
  value: string | number
}

type TotalInvestmentFilterPropsType = {
  isFilter: boolean
  filterOptions: FilterDataType[]
  applyFilter: Function
  closeFilter: Function
  updateFilter: Function
  onReset: () => void
}

type SectorAndRegionSectionProps = {
  chartData?: TotalInvestmentChartData
}

const TotalInvestment = () => {
  const { user } = useUser()
  const { lang, t } = useTranslation("totalInvestment")
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isFilterLoading, setIsFilterLoading] = useState(true)
  const [isFilter, setIsFilter] = useState<boolean>(false)
  const [totalInvData, setTotalInvData] = useState<TotalInvestmentData>()
  const [error, setError] = useState(false)
  const [activeFilterOptions, setActiveFilterOptions] = useState<
    ChipDataType[]
  >([])
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
  const [downloadConfirmation, setDownloadConfirmation] = useState(false)
  const {
    isOpen: isFeedbackModalOpen,
    onOpen: onFeedbackModalOpen,
    onClose: onFeedbackModalClose,
  } = useDisclosure()

  const { data: chartData, error: chartDataError } =
    useSWR<TotalInvestmentChartData>(
      `/api/client/investments/total-investments-chart?langCode=${lang}`,
      { revalidateOnFocus: false, revalidateOnReconnect: false },
    )

  const isChartDataLoading = !chartData && !chartDataError

  useEffect(() => {
    const openTime = moment(new Date())
    return () => {
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        screenSpentTime,
        "Total Investments",
        duration.asSeconds().toString(),
        user?.mandateId as string,
        user?.email as string,
      )
    }
  }, [])

  useEffect(() => {
    if (isLoading) {
      setIsPageLoading(true)
    } else {
      setIsPageLoading(false)
    }
  }, [isLoading, isChartDataLoading])

  useEffect(() => {
    getTotalInvData(true)
  }, [])

  const getTotalInvData = async (
    isOnLoad: boolean,
    filterOptionData?: FilterDataType[],
  ) => {
    setIsFilterLoading(true)
    let values: string[] = []
    let key: string[] = []
    let filterdata = filterOptionData?.length ? filterOptionData : filterOptions
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

    try {
      let response = await ky
        .post("/api/client/investments/total-investments", {
          json: {
            langCode: lang,
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
        .json<TotalInvestmentData>()
      setTotalInvData(response)
      setIsLoading(false)
      setIsFilterLoading(false)
      if (isOnLoad) {
        let invVehicleFilterOptionIndex = filterOptions.findIndex(
          ({ filterNameKey }) => {
            return filterNameKey == "investmentVehicle"
          },
        )
        if (invVehicleFilterOptionIndex >= 0) {
          let option = filterOptions
          option[invVehicleFilterOptionIndex].filterOptions =
            response?.investmentVehicleList.map((investmentName) => {
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

  const goToDetailPage = (path: string, dealId?: number | string) => {
    if (dealId) {
      router.push(`${path}/${dealId}`)
    } else {
      router.push(`${path}`)
    }
  }

  const openFilter = () => {
    setIsFilter(true)
  }

  const closeFilter = () => {
    setFilterOptions([...filterOptions])
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
    getTotalInvData(false, filterOptions)

    clientUniEvent(
      sortInvestments,
      selectedSortOption,
      user?.mandateId as string,
      user?.email as string,
    )

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
    await getTotalInvData(true, filterOptions)
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
    getTotalInvData(false, filterOptions)
  }

  const updateFilter = (filterOptionsData: FilterDataType[]) => {
    setFilterOptions([...filterOptionsData])
  }

  const checkFiltersForDownload = () => {
    if (activeFilterOptions.length) {
      setDownloadConfirmation(true)
    } else {
      downloadTableDataInExcel()
    }
  }

  const downloadTableDataInExcel = async (type?: string) => {
    let values: string[] = []
    let key: string[] = []
    if (type != "all") {
      let filterdata = filterOptions
      filterdata.forEach((downloadTableFilter) => {
        let findCheckedOptions = downloadTableFilter.filterOptions
          .filter(({ isSelected }) => {
            return isSelected
          })
          .map(({ value }) => {
            values.push(value as string)
          })

        if (findCheckedOptions.length) {
          key.push(downloadTableFilter.filterNameKey as string)
        }
      })
    }
    let response = await ky.post("/api/client/generate-excel-file", {
      json: {
        type: "totalInvestment",
        filterKeys: key,
        filterValues: values,
        orderBy: filterOptions.find(({ filterNameKey }) => {
          return filterNameKey == "sortBy"
        })?.selectedOption,
      },
    })
    let fileData = await response.blob()
    let fileName = `${user?.mandateId}-Total-Investments`
    downloadBlob(window.URL.createObjectURL(fileData), fileName)
    clientEvent(
      downloadedExcel,
      "Total Investments",
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

  return (
    <ClientLayout title={t("page.title")} description={t("page.description")}>
      {error && !isPageLoading && (!isLoading || !isChartDataLoading) ? (
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
        <PageContainer
          isLoading={isPageLoading}
          as="section"
          maxW="full"
          px="0"
          mt={{ base: 8, md: 8, lgp: 0 }}
          filter={isPageLoading ? "blur(3px)" : "none"}
        >
          {isLoading || isChartDataLoading ? (
            <SkeletonCard flex="1" mb="25px" mt="20px" />
          ) : (
            <Fragment>
              <SectorAndRegionSection chartData={chartData} />
              <Box mt={{ lgp: "58px", md: "74px", base: "74px" }}>
                <Box
                  alignItems="center"
                  mb={{ lgp: "25px", base: "0", md: "32px" }}
                  justifyContent="space-between"
                  d={{ base: "block", md: "flex" }}
                >
                  <Box>
                    <Text
                      fontWeight="700"
                      color="contrast.200"
                      fontSize="18px"
                      mb={{ base: "16px", md: "0" }}
                    >
                      {t("yourInvestments.title")}{" "}
                    </Text>
                  </Box>
                  <Box>
                    <Flex
                      justifyContent={{ base: "flex-end", md: "space-between" }}
                      alignItems="center"
                    >
                      {totalInvData?.investments.length ? (
                        <Box display={{ base: "none", lgp: "block" }}>
                          <DownloadButton
                            onDownloadClick={checkFiltersForDownload}
                          />
                        </Box>
                      ) : (
                        false
                      )}

                      <Link
                        _hover={{
                          textDecoration: "none",
                        }}
                        onClick={openFilter}
                        d="block"
                        pr={{ base: "0", md: "16px", lgp: "16px" }}
                        whiteSpace="nowrap"
                      >
                        <Flex
                          alignItems="center"
                          ml={{ base: "0", md: "20px" }}
                        >
                          <FilterIcon
                            m={{ base: "0 8px 0 0", md: "0 8px 0 12px" }}
                            width="24px"
                            height="24px"
                            color="primary.500"
                          />{" "}
                          <Text
                            aria-label={t("common:client.sortByFilter")}
                            role={"button"}
                            fontSize="14px"
                            color="primary.500"
                            textDecor="underline"
                          >
                            {t("common:client.sortByFilter")}
                          </Text>
                        </Flex>
                      </Link>
                    </Flex>
                  </Box>
                </Box>

                {activeFilterOptions?.length > 0 && (
                  <Box mb="30px">
                    <FilterChips
                      onClose={onFilterRemove}
                      onClear={onChipClear}
                      data={activeFilterOptions}
                    />
                  </Box>
                )}

                {isFilterLoading ? (
                  <SkeletonCard flex="1" mb="25px" mt="20px" />
                ) : totalInvData?.investments.length ? (
                  <Fragment>
                    <Hide below="lgp">
                      <Box
                        aria-label="yourInvestmentsTable"
                        height="500px"
                        overflow="auto"
                        css={{
                          "&::-webkit-scrollbar-thumb": {
                            background: "#4d4d4d",
                          },
                        }}
                      >
                        {totalInvData?.investments.map(
                          ({ deals, investmentVehicle, region }, i) => (
                            <InvestmentDealsTable
                              key={i}
                              tableBodyData={[
                                {
                                  bodyData: deals,
                                  onClickRedirect: goToDetailPage,
                                  header: investmentVehicle
                                    ? investmentVehicle
                                    : t(`common:client.regions.${region}`),
                                  headerSize: 7,
                                  style: {
                                    textAlign: "center",
                                  },
                                },
                              ]}
                              tableGridSize={20}
                              isHeader={i == 0 ? true : false}
                              isArrow={true}
                              tableHeader={[
                                {
                                  headerSize: 1,
                                  name: t(
                                    investmentVehicle
                                      ? "yourInvestments.table.tableHeader.investmentName"
                                      : "yourInvestments.table.tableHeader.region",
                                  ),
                                  colspan: 3,
                                  style: {},
                                  textAlign: "start",
                                },
                                {
                                  headerSize: 1,
                                  colspan: 3,
                                  name: t(
                                    "yourInvestments.table.tableHeader.dealName",
                                  ),
                                  style: {},
                                  textAlign: "start",
                                },
                                {
                                  headerSize: 1,
                                  colspan: 2,
                                  name: t(
                                    "yourInvestments.table.tableHeader.spv",
                                  ),
                                  style: {},
                                  textAlign: "start",
                                },
                                {
                                  headerSize: 1,
                                  colspan: 3,
                                  name: t(
                                    "yourInvestments.table.tableHeader.investmentDate",
                                  ),
                                  style: {},
                                  textAlign: lang.includes("en")
                                    ? "right"
                                    : "left",
                                },
                                {
                                  headerSize: 1,
                                  colspan: 3,
                                  name: t(
                                    "yourInvestments.table.tableHeader.investmentAmount",
                                  ),
                                  style: {},
                                  textAlign: lang.includes("en")
                                    ? "right"
                                    : "left",
                                },
                                {
                                  headerSize: 1,
                                  colspan: 3,
                                  name: t(
                                    "yourInvestments.table.tableHeader.marketValue",
                                  ),
                                  style: {},
                                  textAlign: lang.includes("en")
                                    ? "right"
                                    : "left",
                                },
                                {
                                  headerSize: 2,
                                  colspan: 3,
                                  name: t(
                                    "yourInvestments.table.tableHeader.performanceContribution",
                                  ),
                                  style: {},
                                  textAlign: "right",
                                },
                              ]}
                            />
                          ),
                        )}
                      </Box>
                    </Hide>
                    <Box>
                      <Show below="lgp">
                        {totalInvData?.investments.map(
                          ({ deals, investmentVehicle, region }, i) => (
                            <Fragment key={i}>
                              <Text
                                aria-label="SPV Name Header"
                                role={"heading"}
                                p="8px"
                                pt="16px"
                                fontSize={{
                                  md: "18px",
                                  base: "18px",
                                  lgp: "14px",
                                }}
                                fontWeight={{
                                  md: "700",
                                  lgp: "400",
                                  base: "700",
                                }}
                              >
                                {investmentVehicle
                                  ? investmentVehicle
                                  : t(`common:client.regions.${region}`)}
                              </Text>
                              {deals.map(
                                (
                                  {
                                    id,
                                    name,
                                    investmentVehicle,
                                    initialInvestmentDate,
                                    bookValue,
                                    marketValue,
                                    performance,
                                  },
                                  j,
                                ) => (
                                  <ResponsiveTable
                                    onClickRedirect={goToDetailPage}
                                    key={j}
                                    id={id}
                                    index={j}
                                    header={name}
                                    isHeader
                                    tableItem={[
                                      {
                                        key: t(
                                          "yourInvestments.table.tableHeader.spv",
                                        ),
                                        style: {
                                          color: "#AAAAAA",
                                        },
                                        value: investmentVehicle,
                                      },
                                      {
                                        key: t(
                                          "yourInvestments.table.tableHeader.investmentDate",
                                        ),
                                        style: {
                                          color: "#AAAAAA",
                                        },
                                        value: moment(
                                          initialInvestmentDate,
                                        ).format("DD/MM/YYYY"),
                                      },
                                      {
                                        key: t(
                                          "yourInvestments.table.tableHeader.investmentAmount",
                                        ),
                                        style: {
                                          color: "#AAAAAA",
                                        },
                                        value: `${absoluteConvertCurrencyWithDollar(
                                          bookValue,
                                        )}`,
                                      },
                                      {
                                        key: t(
                                          "yourInvestments.table.tableHeader.marketValue",
                                        ),
                                        style: {
                                          color: "#AAAAAA",
                                        },
                                        value: `${
                                          absoluteConvertCurrencyWithDollar(
                                            marketValue,
                                          ) || 0
                                        }`,
                                      },
                                      {
                                        key: t(
                                          "yourInvestments.table.tableHeader.performanceContribution",
                                        ),
                                        style: {
                                          color: "#AAAAAA",
                                        },
                                        value: `${percentTwoDecimalPlace(
                                          performance?.percent,
                                        )} %`,
                                      },
                                    ]}
                                  />
                                ),
                              )}
                            </Fragment>
                          ),
                        )}
                      </Show>
                    </Box>
                    <Box m="60px 0" textAlign="center">
                      <Link
                        href="/client/total-investments/investment-listing"
                        size="md"
                        variant="solid"
                        fontWeight="700"
                        fontSize="16px"
                        color="gray.850"
                        bgColor="primary.500"
                        px="4"
                        h="10"
                        d="inline-block"
                        lineHeight="10"
                        borderRadius="2px"
                        outline="none"
                        _hover={{
                          textDecor: "none",
                        }}
                        _focus={{
                          boxShadow: "none",
                        }}
                      >
                        {t("yourInvestments.button.viewAllInvestment")}
                      </Link>
                    </Box>
                  </Fragment>
                ) : (
                  <Box mt={"15px"}>
                    <NoDataFound isDescription isHeader isIcon />
                  </Box>
                )}
              </Box>
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
            </Fragment>
          )}
          {filterOptions ? (
            <TotalInvestmentFilter
              filterOptions={filterOptions}
              closeFilter={closeFilter}
              applyFilter={applyFilter}
              onReset={onChipClear}
              isFilter={isFilter}
              updateFilter={updateFilter}
            />
          ) : (
            false
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
        </PageContainer>
      )}
    </ClientLayout>
  )
}

export default TotalInvestment

const TotalInvestmentFilter = ({
  isFilter,
  filterOptions,
  applyFilter,
  closeFilter,
  updateFilter,
  onReset,
}: TotalInvestmentFilterPropsType) => {
  const updateFilterData = (filterData: FilterDataType[]) => {
    updateFilter(filterData)
  }

  return (
    <FilterDrawer
      updateFilterData={updateFilterData}
      isOpen={isFilter}
      filterData={filterOptions}
      onApply={() => applyFilter()}
      onClose={() => closeFilter()}
      onReset={onReset}
    />
  )
}

const SectorAndRegionSection = ({ chartData }: SectorAndRegionSectionProps) => {
  const { t, lang } = useTranslation("totalInvestment")

  return (
    <Fragment>
      {chartData ? (
        <Fragment>
          <Grid
            templateColumns="repeat(7, 1fr)"
            alignItems="flex-start"
            display={{
              base: "block",
              lgp: "grid",
            }}
          >
            <GridItem colSpan={4}>
              <Box>
                <Text fontWeight="400" color="contrast.200" fontSize="30px">
                  {t("heading")}
                </Text>
                <Text
                  fontWeight="400"
                  color="gray.400"
                  fontSize="18px"
                  mt="8px"
                >
                  {t("description", {
                    valuationDate: chartData?.lastValuationDate
                      ? formatShortDate(chartData?.lastValuationDate, lang)
                      : "",
                  })}{" "}
                </Text>
              </Box>
            </GridItem>
            <GridItem colSpan={3}>
              <Box mt={{ base: "24px", md: "52px", lgp: "0" }}>
                <Flex
                  flexDir={{ base: "column", lgp: "row", md: "row" }}
                  justifyContent={{
                    md: "center",
                    base: "space-between",
                    lgp: "none",
                  }}
                >
                  <Box
                    aria-label="holdingPeriod"
                    role={"group"}
                    borderRight={{
                      md: "1px solid #4D4D4D",
                      base: "none",
                      lgp: "none",
                    }}
                    borderBottom={{
                      base: "1px solid #4D4D4D",
                      md: "none",
                      lgp: "none",
                    }}
                    w={{ lgp: "60%", md: "50%", base: "100%" }}
                    textAlign={{ base: "start", lgp: "start", md: "left" }}
                    p={{
                      base: "0 0 24px 0px",
                      md: "0 80px 24px 0",
                      lgp: "0 0 0 14px",
                    }}
                  >
                    <Text
                      fontWeight="700"
                      fontSize="16px"
                      color="gray.400"
                      lineHeight="120%"
                      pb={{ base: "15px", md: "8px", lgp: "4px" }}
                    >
                      {t("holdingPeriod.title")}
                    </Text>
                    <Text
                      fontWeight="400"
                      fontSize={{ base: "26px", lgp: "36px" }}
                      color="contrast.200"
                      lineHeight="50px"
                      style={{
                        textAlign: lang.includes("ar") ? "end" : "start",
                      }}
                      dir="ltr"
                    >
                      {percentTwoDecimalPlace(
                        chartData?.avgHoldingPeriod || 0,
                      ).replace(/\.0+$/, "")}{" "}
                      {chartData?.avgHoldingPeriod
                        ? chartData?.avgHoldingPeriod >= 2
                          ? "Years"
                          : "Year"
                        : "Year"}
                    </Text>
                  </Box>
                  <Box
                    aria-label="totalInvestments"
                    role={"group"}
                    borderBottom={{
                      base: "1px solid #4D4D4D",
                      md: "none",
                      lgp: "none",
                    }}
                    textAlign={{
                      base: "start",
                      lgp: "start",
                      md: "center",
                    }}
                    p={{
                      base: "24px 0 24px 0px",
                      md: "0 0 24px 80px",
                      lgp: "0 0 0 14px",
                    }}
                  >
                    <Text
                      fontWeight="700"
                      fontSize="16px"
                      color="gray.400"
                      lineHeight="21px"
                      pb={{ base: "15px", md: "8px", lgp: "4px" }}
                    >
                      {t("totalInvestment.title")}
                    </Text>
                    <Text
                      fontWeight="400"
                      fontSize={{ base: "26px", lgp: "36px" }}
                      color="contrast.200"
                      lineHeight="120%"
                      textAlign="start"
                    >
                      {chartData?.deals}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </GridItem>
          </Grid>

          {chartData.cashInTransit ? (
            <Box mt={{ base: "44px", lgp: "40px" }}>
              <Box mb="16px" color="contrast.200" alignItems="center">
                <Text
                  fontSize="18px"
                  as="span"
                  d="inline-block"
                  fontWeight="700"
                  mr="16px"
                >
                  {t("common:client.totalAum")}:
                </Text>
                <Text
                  dir="ltr"
                  as="span"
                  d="inline-block"
                  fontSize="24px"
                  fontWeight="400"
                  color={"contrast.200"}
                >
                  $
                  {roundCurrencyValue(
                    Math.abs(chartData?.cashInTransit?.totalAum || 0),
                  )}
                </Text>
              </Box>

              <Card
                aria-label="Recent Activity"
                role={"grid"}
                bg="rgba(255, 255, 255, 0.03)"
                boxShadow="none"
                border="1px solid #4d4d4d"
                borderRadius="6px"
              >
                <Grid
                  templateColumns={{
                    base: "repeat(1, 1fr)",
                    md: "repeat(2, 1fr)",
                    lgp: `repeat(4, 1fr)`,
                  }}
                  p={{ base: "24px", lgp: "35px 0" }}
                >
                  <GridItem
                    colSpan={1}
                    textAlign="center"
                    borderRight={{ base: "none", md: "none", lgp: "1px solid" }}
                    borderBottom={{
                      lgp: "none",
                      md: "none",
                      base: "1px solid",
                    }}
                    borderRightColor={{ base: "none", lgp: "gray.700" }}
                    borderBottomColor={{ lgp: "none", base: "gray.700" }}
                    p={{ base: "0px 0 24px 0", md: "0 0 24px 0 ", lgp: "0" }}
                    pos="relative"
                    _after={{
                      content: '""',
                      display: { base: "none", md: "block", lgp: "none" },
                      position: "absolute",
                      width: "1px",
                      top: "0",
                      bottom: "15px",
                      right: "0",
                      backgroundColor: "gray.700",
                    }}
                    _before={{
                      content: '""',
                      display: { base: "none", md: "block", lgp: "none" },
                      position: "absolute",
                      height: "1px",
                      left: "0",
                      bottom: "0",
                      right: { base: "0", md: "15px" },
                      backgroundColor: "gray.700",
                    }}
                  >
                    <Text
                      fontSize={{ base: "16px", md: "18px" }}
                      fontWeight="700"
                      color="gray.500"
                    >
                      {t("common:client.illiquid")}
                    </Text>
                    <Text
                      fontSize={{ base: "26px", lgp: "30px" }}
                      fontWeight={{ base: "500", lgp: "400" }}
                      mt={{ lgp: "30px", base: "8px" }}
                      dir="ltr"
                      color="contrast.200"
                    >
                      <Text as="span" d="inline-block">
                        {chartData.cashInTransit?.illiquid < 0 ? "-" : ""}
                      </Text>
                      $
                      {roundCurrencyValue(
                        Math.abs(chartData.cashInTransit?.illiquid),
                      )}
                    </Text>
                  </GridItem>
                  <GridItem
                    colSpan={1}
                    textAlign="center"
                    borderRight={{ base: "none", md: "none", lgp: "1px solid" }}
                    borderBottom={{
                      lgp: "none",
                      md: "none",
                      base: "1px solid",
                    }}
                    borderRightColor={{ base: "none", lgp: "gray.700" }}
                    borderBottomColor={{ lgp: "none", base: "gray.700" }}
                    p={{ base: "32px 0 24px 0", md: "0 0 24px 0 ", lgp: "0" }}
                    pos="relative"
                    _before={{
                      display: { base: "none", md: "block", lgp: "none" },
                      content: '""',
                      position: "absolute",
                      height: "1px",
                      right: "0",
                      bottom: "0",
                      left: { base: "0", md: "15px" },
                      backgroundColor: "gray.700",
                    }}
                  >
                    <Text
                      fontSize={{ base: "16px", md: "18px" }}
                      fontWeight="700"
                      color="gray.500"
                    >
                      {t("common:client.liquid")}
                    </Text>
                    <Text
                      fontSize={{ base: "26px", lgp: "30px" }}
                      fontWeight={{ base: "500", lgp: "400" }}
                      mt={{ lgp: "30px", base: "8px" }}
                      dir="ltr"
                      color="contrast.200"
                    >
                      <Text as="span" d="inline-block">
                        {chartData.cashInTransit?.liquid < 0 ? "-" : ""}
                      </Text>
                      $
                      {roundCurrencyValue(
                        Math.abs(chartData.cashInTransit?.liquid),
                      )}
                    </Text>
                  </GridItem>
                  <GridItem
                    colSpan={1}
                    textAlign="center"
                    borderRight={{ base: "none", md: "none", lgp: "1px solid" }}
                    borderBottom={{
                      lgp: "none",
                      md: "none",
                      base: "1px solid",
                    }}
                    borderRightColor={{ base: "none", lgp: "gray.700" }}
                    borderBottomColor={{ lgp: "none", base: "gray.700" }}
                    p={{ base: "32px 0 24px 0", md: "24px 0 0 0", lgp: "0" }}
                    pos="relative"
                    _after={{
                      content: '""',
                      display: { base: "none", md: "block", lgp: "none" },
                      position: "absolute",
                      width: "1px",
                      top: "15px",
                      bottom: "0",
                      right: "0",
                      backgroundColor: "gray.700",
                    }}
                  >
                    <Text
                      fontSize={{ base: "16px", md: "18px" }}
                      fontWeight="700"
                      color="gray.500"
                    >
                      {t("common:client.assetClasses.cash")}
                    </Text>
                    <Text
                      fontSize={{ base: "26px", lgp: "30px" }}
                      fontWeight={{ base: "500", lgp: "400" }}
                      mt={{ lgp: "30px", base: "8px" }}
                      dir="ltr"
                      color="contrast.200"
                    >
                      <Text as="span" d="inline-block">
                        {chartData.cashInTransit?.cash < 0 ? "-" : ""}
                      </Text>
                      $
                      {roundCurrencyValue(
                        Math.abs(chartData.cashInTransit?.cash),
                      )}
                    </Text>
                  </GridItem>
                  <GridItem
                    colSpan={1}
                    textAlign="center"
                    p={{ base: "32px 0 0 0", md: "24px 0 0 0", lgp: "0" }}
                    pos="relative"
                  >
                    <Text
                      fontSize={{ base: "16px", md: "18px" }}
                      fontWeight="700"
                      color="gray.500"
                    >
                      {t("common:client.cashInTransit")}
                    </Text>
                    <Text
                      fontSize={{ base: "26px", lgp: "30px" }}
                      fontWeight={{ base: "500", lgp: "400" }}
                      mt={{ lgp: "30px", base: "8px" }}
                      dir="ltr"
                      color="contrast.200"
                    >
                      <Text as="span" d="inline-block">
                        {chartData.cashInTransit?.cashInTransit < 0 ? "-" : ""}
                      </Text>
                      $
                      {roundCurrencyValue(
                        Math.abs(chartData.cashInTransit?.cashInTransit),
                      )}
                    </Text>
                  </GridItem>
                </Grid>
              </Card>
            </Box>
          ) : (
            false
          )}
          <Box mt={{ lgp: "64px", base: "40px" }}>
            <Text
              fontWeight="700"
              color="contrast.200"
              fontSize="18px"
              mb={{ lgp: "30px", md: "30px", base: "16px" }}
            >
              {t("yourPortfolio.title")}
            </Text>
            <Box
              d={{ base: "block", md: "flex" }}
              alignItems="center"
              justifyContent="center"
              mt="30px"
            >
              <Box aria-label="yourPortfolioChart">
                <PieChart data={chartData.pieChartData} />
              </Box>
              <Box ms={{ base: "0", sm: "30px" }} mt={{ base: "30px", md: 0 }}>
                <Grid templateColumns="repeat(2, 1fr)" gap="30px">
                  {chartData.pieChartData?.length
                    ? chartData.pieChartData?.map(
                        ({ color, name, value }, i) => (
                          <>
                            {value > 0 && (
                              <GridItem key={i}>
                                <ChartAssets color={color} text={name} />
                              </GridItem>
                            )}
                          </>
                        ),
                      )
                    : false}
                </Grid>
              </Box>
            </Box>
          </Box>
          <Box
            mt={{ lgp: "80px", md: "64px", base: "48px" }}
            p={{ base: "0", md: "32px 24px" }}
            border={{ base: "none", md: "1px solid" }}
            borderColor={{ base: "none", md: "gray.700" }}
            background={{ base: "none", md: "gray.950" }}
            borderRadius={{ base: "0", md: "6px" }}
          >
            <Text mb="16px" fontSize="18px" fontWeight="700">
              {t("regions.title")}
            </Text>

            {chartData?.regionPercentage && (
              <InvestmentLocation
                investmentLocationData={chartData?.regionPercentage}
              />
            )}
          </Box>
        </Fragment>
      ) : (
        false
      )}
    </Fragment>
  )
}

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
