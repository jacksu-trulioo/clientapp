import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment } from "react"

import { Checkbox, ClientRadio, FilterClose } from "~/components"
import { FilterDataType } from "~/services/mytfo/types"

type FilterDrawerProps = {
  filterData: FilterDataType[]
  isOpen: boolean
  updateFilterData: (filterData: FilterDataType[]) => void
  onApply: () => void
  onReset: () => void
  onClose: () => void
}

export default function FilterDrawer({
  filterData,
  isOpen,
  updateFilterData,
  onApply,
  onClose,
  onReset,
}: FilterDrawerProps) {
  const { t, lang } = useTranslation("common")

  const changehandleer = (
    selectedFilterName: string,
    selectedValue: string,
    changedValue: boolean | null,
    type: "radio" | "checkbox",
  ) => {
    var filterIndex = filterData.findIndex(({ filterName }) => {
      return filterName == selectedFilterName
    })
    if (type == "radio") {
      if (filterIndex >= 0) {
        filterData[filterIndex].selectedOption = selectedValue
      }
    } else if (type == "checkbox") {
      if (filterIndex >= 0) {
        var filterOptionIndex = filterData[filterIndex].filterOptions.findIndex(
          ({ value }) => {
            return value == selectedValue
          },
        )

        if (filterOptionIndex >= 0) {
          filterData[filterIndex].filterOptions[filterOptionIndex].isSelected =
            changedValue as boolean
        }
      }
    }
    updateFilterData(filterData)
  }

  return (
    <>
      {isOpen ? (
        <Drawer
          isOpen={isOpen}
          placement={lang.includes("ar") ? "left" : "right"}
          onClose={onClose}
        >
          <DrawerOverlay />
          <DrawerContent background="gray.850">
            <DrawerHeader
              aria-label="Filter Header"
              role={"heading"}
              padding="0px"
            >
              <Flex
                background="gray.900"
                mb="4"
                alignItems="center"
                padding="15px 20px"
              >
                <Text
                  aria-label="Close"
                  role={"button"}
                  onClick={onClose}
                  justifyContent="flex-start"
                  flex="1 1"
                >
                  <FilterClose w="14px" />
                </Text>
                <Text
                  justifyContent="center"
                  flex="1 1"
                  fontSize="14px"
                  fontWeight="700"
                  color="white"
                  textAlign="center"
                >
                  {t("filters.title")}
                </Text>
                <Text
                  aria-label="Reset"
                  role={"button"}
                  justifyContent="flex-end"
                  flex="1 1"
                  textAlign="right"
                  fontSize="14px"
                  fontWeight="400"
                  color="primary.500"
                  cursor="pointer"
                  onClick={() => {
                    onClose()
                    onReset()
                  }}
                >
                  {t("filters.button.reset")}
                </Text>
              </Flex>
            </DrawerHeader>

            <DrawerBody aria-label="Filter Body" role={"group"}>
              {" "}
              {filterData?.map(
                (
                  { filterName, filterType, filterOptions, selectedOption },
                  i,
                ) => {
                  if (filterType == "radio") {
                    return (
                      <Box
                        aria-label={filterName}
                        role={"group"}
                        mb="4"
                        key={i}
                      >
                        <Text
                          fontSize="18px"
                          fontWeight="400"
                          color="white"
                          mb="4"
                        >
                          {" "}
                          {filterName}
                        </Text>

                        <RadioGroup
                          onChange={(value) =>
                            changehandleer(filterName, value, null, "radio")
                          }
                          value={selectedOption}
                          className="concentartionCard"
                        >
                          <Stack aria-label={filterName} role={"radiogroup"}>
                            {filterOptions?.map(({ value, label }, j) => (
                              <ClientRadio
                                key={j}
                                value={value}
                                me="2"
                                colorScheme="secondary"
                              >
                                <Box
                                  display="flex"
                                  w="full"
                                  justifyContent="space-between"
                                  alignItems="center"
                                >
                                  <Text
                                    color="gray.400"
                                    fontWeight="400"
                                    fontSize="14px"
                                  >
                                    {label}
                                  </Text>
                                </Box>
                              </ClientRadio>
                            ))}
                          </Stack>
                        </RadioGroup>
                      </Box>
                    )
                  } else if (filterType == "checkbox") {
                    return (
                      <Fragment key={i}>
                        <Box aria-label={filterName} role={"group"} mb="4">
                          <Text
                            fontSize="18px"
                            fontWeight="400"
                            color="white"
                            mb="4"
                          >
                            {filterName}
                          </Text>
                          {filterOptions?.map(
                            ({ label, value, isSelected }, j) => (
                              <Fragment key={j}>
                                {" "}
                                <Checkbox
                                  isChecked={isSelected}
                                  colorScheme="secondary"
                                  onChange={(e) => {
                                    changehandleer(
                                      filterName,
                                      value as string,
                                      e.target.checked,
                                      "checkbox",
                                    )
                                  }}
                                >
                                  {" "}
                                  <Text
                                    fontSize="14px"
                                    fontWeight="400"
                                    color="gray.400"
                                  >
                                    {label}
                                  </Text>
                                </Checkbox>
                              </Fragment>
                            ),
                          )}
                        </Box>
                      </Fragment>
                    )
                  }
                },
              )}
            </DrawerBody>

            <DrawerFooter justifyContent="flex-start">
              <Button onClick={onApply} variant="outline" colorScheme="primary">
                {t("filters.button.applyChange")}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        false
      )}
    </>
  )
}
