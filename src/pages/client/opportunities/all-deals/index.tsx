import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import { Box, Heading, Link, Text } from "@chakra-ui/layout"
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
  FilterChips,
  FilterDrawer,
  FilterIcon,
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
import { ChipDataType, FilterDataType } from "~/services/mytfo/types"
import { screenSpentTime } from "~/utils/googleEventsClient"
import { clientEvent } from "~/utils/gtag"

type OpportunitiesFilterPropsType = {
  isFilter: boolean
  filterOptions: FilterDataType[]
  applyFilter: Function
  closeFilter: Function
  updateFilter: Function
  onReset: () => void
}

function Opportunities() {
  const { t, lang } = useTranslation("opportunities")
  const [isLoading, setIsLoading] = useState(true)
  const [opportunitiesData, setOpportunitiesData] =
    useState<OpportunitiesProps[]>()

  const [isFilter, setIsFilter] = useState<boolean>(false)
  const [activeFilterOptions, setActiveFilterOptions] = useState<
    ChipDataType[]
  >([])
  const [selectedOrderOption, setSelectedOrderOption] = useState("asc")
  const [selectedSortOption, setSelectedSortOption] = useState("recency")
  const [filterOptions, setFilterOptions] = useState<FilterDataType[]>([
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

      setOpportunitiesData(response?.data)
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
        setFilterOptions([...option])
      }
    } catch (error) {
      setIsLoading(false)
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
          let activeFilterCheck = activeFilterOptions.find((z) => {
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
    getOpportunities(false, filterOptions)
    setIsFilter(false)
  }

  const updateChips = (filterOptionsData?: FilterDataType[]) => {
    let data = filterOptionsData?.length ? filterOptionsData : filterOptions
    let chipsData: ChipDataType[] = []
    data.forEach((options) => {
      options.filterOptions
        .filter(({ isSelected }) => {
          return isSelected
        })
        .forEach(({ value, label }) => {
          let filter = options.filterNameKey as string
          chipsData.push({
            filter,
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
        x.selectedOption = x.filterNameKey == "sortBy" ? "recency" : "asc"
      }
    })

    setFilterOptions([...filterOptions])
    updateChips(filterOptions)
    await getOpportunities(true, filterOptions)
  }

  const onFilterRemove = (
    value: string | number,
    _index: number,
    key?: string,
  ) => {
    filterOptions.every((filterData, i) => {
      let currentIndex = filterData?.filterOptions.findIndex((option) => {
        return option.value == value && filterData?.filterNameKey == key
      })
      if (currentIndex >= 0) {
        filterOptions[i].filterOptions[currentIndex].isSelected = false
        return false
      } else {
        return true
      }
    })

    setFilterOptions([...filterOptions])
    updateChips(filterOptions)
    getOpportunities(false, filterOptions)
  }

  const updateFilter = (filterOptionsData: FilterDataType[]) => {
    setFilterOptions([...filterOptionsData])
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
                    {t(`client.labels.allDeals`)}
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
                    {t(`client.labels.allDeals`)}
                  </Heading>
                  <Link
                    _hover={{
                      textDecoration: "none",
                    }}
                    onClick={openFilter}
                  >
                    <Flex>
                      <FilterIcon m="0 5px" color="primary.500" />{" "}
                      <Text
                        fontSize="14px"
                        color="primary.500"
                        textDecoration="underline"
                      >
                        {t("common:client.sortByFilter")}
                      </Text>
                    </Flex>
                  </Link>
                </Flex>
                <Box mb="30px">
                  {activeFilterOptions?.length > 0 && (
                    <FilterChips
                      onClose={onFilterRemove}
                      onClear={onChipClear}
                      data={activeFilterOptions}
                    />
                  )}
                </Box>
              </Box>
              {opportunitiesData?.length ? (
                <OpportunityCard
                  opportunities={opportunitiesData}
                  showHeading={false}
                  showAll={true}
                />
              ) : (
                <NoDataFound isDescription isIcon isHeader />
              )}

              {filterOptions ? (
                <OpportuntiesFilter
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
            </Fragment>
          )}
        </PageContainer>
      </ClientLayout>
    </>
  )
}

const OpportuntiesFilter = ({
  isFilter,
  filterOptions,
  applyFilter,
  closeFilter,
  updateFilter,
  onReset,
}: OpportunitiesFilterPropsType) => {
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
