import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Link,
  Text,
} from "@chakra-ui/react"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { useState } from "react"

import {
  DesktopMultiRowTable,
  DownloadButton,
  FilterChips,
  FilterDrawer,
  FilterIcon,
  NoDataFound,
} from "~/components"
import { useUser } from "~/hooks/useUser"
import {
  Commitment,
  FilterDataType,
  FilterOptionType,
} from "~/services/mytfo/types"
import { formatShortDate } from "~/utils/clientUtils/dateUtility"
import {
  percentTwoDecimalPlace,
  roundCurrencyValue,
  triggerCommitmentSortFilterEvent,
} from "~/utils/clientUtils/globalUtilities"

type CommitmentDataProps = {
  commitmentData: {
    lastValuationDate: string
    totalCommitted: number
    totalUncalled: number
    commitments: Commitment[]
  }
  updateFilter: (filterObj: {
    filterValues: FilterOptionType[]
    orderBy: string
  }) => void
  selectedOrderOption: string
  deployedFilterOptions: FilterOptionType[]
  updateChips: (filterOptions: FilterDataType[]) => void
  activeFilterOptions: ChipDataType[]
  onChipClose: (value: string | number, index: number) => void
  onChipClear: () => void
  onFilterClear: () => void
  downloadTableDataInExcel: Function
}

type ChipDataType = {
  label: string | number
  value: string | number
}

export function TotalCommitments({
  commitmentData,
  updateFilter,
  selectedOrderOption,
  deployedFilterOptions,
  updateChips,
  activeFilterOptions,
  onChipClose,
  onChipClear,
  onFilterClear,
  downloadTableDataInExcel,
}: CommitmentDataProps) {
  const { lang, t } = useTranslation("totalCommitment")
  const [isFilter, setIsFilter] = useState<boolean>(false)
  const [filterOptions, setFilterOptions] = useState<FilterDataType[]>([
    {
      filterName: t("common:filters.filterTypes.order.title"),
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
      filterName: t("common:filters.filterTypes.deployed.title"),
      filterNameKey: "deployed",
      filterOptions: deployedFilterOptions,
      filterType: "checkbox",
    },
  ])

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
        x.selectedOption = selectedOrderOption
      }
    })
    setFilterOptions([...filterOptions])
  }

  const { user } = useUser()

  const applyFilter = () => {
    var filterObj: {
      filterValues: FilterOptionType[]
      orderBy: string
    } = {
      filterValues: [],
      orderBy: "asc",
    }

    filterOptions.forEach(({ selectedOption, filterType }) => {
      if (filterType == "radio" && selectedOption) {
        filterObj.orderBy = selectedOption
      }
    })

    filterObj.filterValues = filterOptions.find(({ filterType }) => {
      return filterType == "checkbox"
    })?.filterOptions as FilterOptionType[]
    updateChips(filterOptions)
    updateFilter(filterObj)
    setIsFilter(false)

    triggerCommitmentSortFilterEvent(
      filterObj.filterValues,
      "% deployed",
      user?.mandateId as string,
      user?.email as string,
    )
  }

  const updateFilterData = (filterData: FilterDataType[]) => {
    setFilterOptions([...filterData])
  }

  return (
    <Box>
      <Flex flexDir="column">
        <Heading
          fontSize={{ base: "24px", md: "30px", lgp: "30px" }}
          fontWeight="400"
          color="white"
          mb="8px"
        >
          {t("heading")}
        </Heading>
        <Text
          aria-label="subHeading"
          role={"heading"}
          fontSize="18px"
          color="gray.400"
          fontWeight="400"
        >
          {t("description", {
            toDate: formatShortDate(commitmentData.lastValuationDate, lang),
          })}
        </Text>
      </Flex>
      <Box>
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            lgp: "repeat(2, 1fr)",
            md: "repeat(2, 1fr)",
          }}
          gap={6}
          mt={{ base: "24px", lgp: "80px" }}
        >
          <GridItem
            borderRight={{ base: "none", md: "1px solid #4D4D4D", lgp: "none" }}
          >
            <Box
              aria-label="totalCommitted"
              role={"group"}
              borderBottom={{
                base: "1px solid #4d4d4d",
                lgp: "none",
                md: "none",
              }}
              style={{
                padding: "0 18px 24px 18px",
              }}
            >
              <Heading
                color="gray.400"
                fontSize="18px"
                fontWeight="700"
                mb="10px"
                ml={{
                  base: lang.includes("ar") ? "0" : "17px",
                  lgp: lang.includes("ar") ? "0" : "28px",
                }}
              >
                {t("totalCommitted")}
              </Heading>
              <Heading
                fontSize={{ base: "26px", lgp: "36px" }}
                color="white"
                pos="relative"
                dir="ltr"
                textAlign={lang.includes("ar") ? "left" : "inherit"}
              >
                ${roundCurrencyValue(commitmentData.totalCommitted)}
              </Heading>
            </Box>
          </GridItem>
          <GridItem>
            <Box
              aria-label="totalUncalled"
              role={"group"}
              borderBottom={{
                base: "1px solid #4d4d4d",
                lgp: "none",
                md: "none",
              }}
              style={{
                padding: "0 18px 24px 18px",
              }}
            >
              <Heading
                color="gray.400"
                fontSize="18px"
                fontWeight="700"
                mb="10px"
                ml={{
                  base: lang.includes("ar") ? "0" : "17px",
                  lgp: lang.includes("ar") ? "0" : "28px",
                }}
              >
                {t("totalUncalled")}
              </Heading>
              <Heading
                fontSize={{ base: "26px", lgp: "36px" }}
                color="white"
                pos="relative"
                dir="ltr"
                textAlign={lang.includes("ar") ? "left" : "inherit"}
              >
                ${roundCurrencyValue(commitmentData.totalUncalled)}
              </Heading>
            </Box>
          </GridItem>
        </Grid>
      </Box>
      <Box
        p={{
          base: "40px 0 0",
          lgp: "80px 0 0",
          md: "80px 0 0",
        }}
      >
        <Flex
          align="center"
          justify="space-between"
          mb={{ base: "0", md: "32px" }}
          d={{ base: "block", md: "flex" }}
        >
          <Heading
            fontSize="18px"
            color="white"
            fontWeight="700"
            mb={{ base: "16px", md: "0" }}
          >
            {t("commitmentsList.title")}{" "}
          </Heading>
          <Flex
            align="center"
            justifyContent={{ base: "flex-end", md: "flex-start" }}
          >
            {commitmentData.commitments.length ? (
              <Box display={{ base: "none", lgp: "block" }} me="20px">
                <DownloadButton onDownloadClick={downloadTableDataInExcel} />{" "}
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
              pr={{ base: 0, md: "16px" }}
            >
              <Flex alignItems="center" mb={{ base: "16px", md: "0" }}>
                <FilterIcon
                  width="24px"
                  height="24px"
                  m={{ md: "0 8px 0 12px", base: "0 8px 0 0" }}
                  color="primary.500"
                />{" "}
                <Text fontSize="14px" color="primary.500" textDecor="underline">
                  {t("common:client.sortByFilter")}{" "}
                </Text>
              </Flex>
            </Link>
          </Flex>
        </Flex>
        {activeFilterOptions?.length > 0 && (
          <FilterChips
            onClose={onChipClose}
            onClear={onChipClear}
            data={activeFilterOptions}
          />
        )}
      </Box>

      <Box>
        {commitmentData.commitments.map(
          (
            {
              id,
              called,
              uncalled,
              deployed,
              committed,
              strategy,
              lastCommitment,
              managedVehicle,
            },
            i,
          ) => (
            <Box aria-label="Deal Box" role={"group"} key={i} mb="32px">
              <Text
                aria-label="Deal Name"
                role={"link"}
                fontWeight="400"
                fontSize="14px"
                lineHeight="22px"
                color="gray.400"
                mb="8px"
              >
                {managedVehicle}:{" "}
                <Box as="strong" color="contrast.200" whiteSpace="nowrap">
                  {t("deployed")}:{" "}
                  <Box as="span" dir="ltr">
                    {percentTwoDecimalPlace(deployed)}%
                  </Box>
                </Box>
              </Text>
              <DesktopMultiRowTable
                isGrid={false}
                isHeader={false}
                tableGridSize={7}
                tableBody={[
                  {
                    data: [
                      {
                        value: t(`commitmentsList.tableBody.committed`),
                        size: 6,
                        style: {
                          textAlign: "left",
                          fontWeight: "400",
                          fontSize: "14px",
                          lineHeight: "120%",
                          color: "white",
                        },
                      },
                      {
                        value: `$${roundCurrencyValue(committed)}`,
                        size: 1,
                        style: {
                          textAlign: lang.includes("ar") ? "left" : "right",
                          fontWeight: "400",
                          fontSize: { base: "16px", md: "16px", lgp: "20px" },
                          lineHeight: "120%",
                          color: "white",
                        },
                      },
                    ],
                  },

                  {
                    data: [
                      {
                        value: t(`commitmentsList.tableBody.called`),
                        size: 6,
                        style: {
                          textAlign: "left",
                          fontWeight: "400",
                          fontSize: "14px",
                          lineHeight: "120%",
                          color: "white",
                        },
                      },
                      {
                        value: `$${roundCurrencyValue(called)}`,
                        size: 1,
                        style: {
                          textAlign: lang.includes("ar") ? "left" : "right",
                          fontWeight: "400",
                          fontSize: { base: "16px", md: "16px", lgp: "20px" },
                          lineHeight: "120%",
                          color: "white",
                        },
                      },
                    ],
                  },
                  {
                    data: [
                      {
                        value: t(`commitmentsList.tableBody.uncalled`),
                        size: 6,
                        style: {
                          textAlign: "left",
                          fontWeight: "400",
                          fontSize: "14px",
                          lineHeight: "120%",
                          color: "white",
                        },
                      },
                      {
                        value: `$${roundCurrencyValue(uncalled)}`,
                        size: 1,
                        style: {
                          textAlign: lang.includes("ar") ? "left" : "right",
                          fontWeight: "400",
                          fontSize: { base: "16px", md: "16px", lgp: "20px" },
                          lineHeight: "120%",
                          color: "white",
                        },
                      },
                    ],
                  },
                  {
                    data: [
                      {
                        value: t(`commitmentsList.tableBody.strategy`),
                        size: 6,
                        style: {
                          textAlign: "left",
                          fontWeight: "400",
                          fontSize: "14px",
                          lineHeight: "120%",
                          color: "white",
                        },
                      },
                      {
                        value: t(`common:client.strategy.${strategy}`),
                        size: 1,
                        style: {
                          textAlign: lang.includes("ar") ? "left" : "right",
                          fontWeight: "400",
                          fontSize: { base: "16px", md: "16px", lgp: "20px" },
                          lineHeight: "120%",
                          color: "white",
                        },
                      },
                    ],
                  },
                  {
                    data: [
                      {
                        value: t(`commitmentsList.tableBody.committedDate`),
                        size: 6,
                        style: {
                          textAlign: "left",
                          fontWeight: "400",
                          fontSize: "14px",
                          lineHeight: "120%",
                          color: "white",
                        },
                      },
                      {
                        value: formatShortDate(lastCommitment, lang),
                        size: 1,
                        isRtl: true,
                        style: {
                          textAlign: lang.includes("ar") ? "left" : "right",
                          fontWeight: "400",
                          fontSize: { base: "16px", md: "16px", lgp: "20px" },
                          lineHeight: "120%",
                          color: "white",
                        },
                      },
                    ],
                  },
                ]}
              />
              <Box
                aria-label="View Related Investments"
                role={"link"}
                onClick={() =>
                  router.push(
                    `/client/total-commitments/investment-listing/${id}`,
                  )
                }
                bg="gray.800"
                mb="2px"
                borderRadius="2px"
                padding="16px"
              >
                <Text
                  fontWeight="400"
                  fontSize="14px"
                  lineHeight="120%"
                  color="primary.500"
                  textAlign="center"
                  cursor="pointer"
                >
                  {t(`commitmentsList.tableBody.button`)}
                </Text>
              </Box>
            </Box>
          ),
        )}

        {commitmentData.commitments.length == 0 && (
          <Box mt={"15px"}>
            <NoDataFound isDescription isHeader isIcon />
          </Box>
        )}
      </Box>
      {filterOptions && (
        <FilterDrawer
          updateFilterData={updateFilterData}
          isOpen={isFilter}
          filterData={filterOptions}
          onApply={applyFilter}
          onClose={closeFilter}
          onReset={onFilterClear}
        />
      )}
    </Box>
  )
}

export default TotalCommitments
