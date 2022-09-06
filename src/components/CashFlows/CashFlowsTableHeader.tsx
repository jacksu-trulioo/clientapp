import { Box, Container, Flex, Heading, Link, Text } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React, { useState } from "react"

import { DownloadButton, FilterDrawer, FilterIcon } from "~/components"
import { FilterDataType } from "~/services/mytfo/types"

type CashFlowTableHeaderProps = {
  yearFrom: string | number
  yearTo: string | number
  updateData: (selectedOption: string) => void
  filterType: string
  onFilterReset: () => void
  downloadTableDataInExcel: Function
}

export default function CashFlowsTableHeader({
  yearFrom,
  yearTo,
  updateData,
  filterType,
  onFilterReset,
  downloadTableDataInExcel,
}: CashFlowTableHeaderProps) {
  const { t } = useTranslation("cashflow")
  const [isFilter, setIsFilter] = useState<boolean>(false)
  const [filterOptions, setFilterOptions] = useState<FilterDataType[]>([
    {
      filterName: t("common:filters.filterTypes.order.title"),
      filterOptions: [
        {
          label: t("common:filters.filterTypes.order.options.descending"),
          value: "desc",
        },
        {
          label: t("common:filters.filterTypes.order.options.ascending"),
          value: "asc",
        },
      ],
      filterType: "radio",
      selectedOption: filterType,
    },
  ])

  const updateFilterData = (filterData: FilterDataType[]) => {
    setFilterOptions([...filterData])
  }

  const openFilter = () => {
    setIsFilter(true)
  }

  const onReset = () => {
    filterOptions[0].selectedOption = "asc"
    setFilterOptions([...filterOptions])
    onFilterReset()
  }

  const closeFilter = () => {
    filterOptions[0].selectedOption = filterType
    setFilterOptions([...filterOptions])
    setIsFilter(false)
  }

  const applyFilter = () => {
    filterOptions.forEach(({ selectedOption }) => {
      if (selectedOption) {
        updateData(selectedOption)
      }
    })
    setIsFilter(false)
  }

  return (
    <Container as="section" maxW="full" px="0" flexDirection="row">
      <Box p={{ lgp: "0px 0 2px", base: "48px 0 2px", md: "48px 0 2px" }}>
        <Flex
          justify="space-between"
          alignItems="center"
          display={{ base: "block", md: "flex" }}
        >
          <Box w={{ base: "100%", md: "auto" }}>
            <Heading
              fontSize={{ base: "18px", md: "18px" }}
              color="white"
              fontWeight="400"
              textTransform="capitalize"
              mb="11px"
            >
              {t("investmentVehicle.title")}
            </Heading>
            <Text
              fontWeight="400"
              fontSize="14px"
              lineHeight="120%"
              fontStyle="italic"
              color="gray.400"
              margin={{ lgp: "4px 0px", base: "24px 0px", md: "16px 0px" }}
            >
              {yearFrom} - {yearTo} | {t("common:client.USD")}
            </Text>
          </Box>
          <Flex
            justifyContent="flex-end"
            w={{ base: "100%", md: "auto" }}
            alignItems="center"
            mt={{ base: "16px", md: "0" }}
          >
            <Box display={{ base: "none", lgp: "block" }} me="20px">
              <DownloadButton onDownloadClick={downloadTableDataInExcel} />{" "}
            </Box>
            <Link
              _hover={{
                textDecoration: "none",
              }}
              onClick={openFilter}
            >
              <Flex alignItems="center">
                <FilterIcon m="0 5px" color="primary.500" />{" "}
                <Text fontSize="14px" color="primary.500" textDecor="underline">
                  {t("common:client.sortBy")}{" "}
                </Text>
              </Flex>
            </Link>
          </Flex>
        </Flex>
      </Box>
      {filterOptions ? (
        <FilterDrawer
          updateFilterData={updateFilterData}
          isOpen={isFilter}
          filterData={filterOptions}
          onApply={applyFilter}
          onClose={closeFilter}
          onReset={onReset}
        />
      ) : (
        false
      )}
    </Container>
  )
}
