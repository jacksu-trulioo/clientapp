import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from "@chakra-ui/react"
import React, { Fragment, useEffect, useState } from "react"

import { CaretDownIcon } from "~/components"

type OptionsProps = {
  value: number | string
  label: string
}

type filterTabProps = {
  options: OptionsProps[]
  activeOption?: number | string
  changeActiveFilter?: (value: number | string) => void
  viewType?: string
  tabHeight?: string
}
export default function QuarterTabs({
  options,
  tabHeight,
  activeOption,
  changeActiveFilter,
  viewType,
}: filterTabProps) {
  const [activeLabel, setActiveLabel] = useState("")

  useEffect(() => {
    const activeOptionLabel = options.find(
      ({ value }) => value == activeOption,
    )?.label
    if (activeOptionLabel) {
      setActiveLabel(activeOptionLabel)
    }
  }, [activeOption, options])

  const changeFilterValue = (value: string | number) => {
    if (changeActiveFilter) {
      changeActiveFilter(value)
    }
  }

  if (options.length) {
    if (viewType == "desktop") {
      return (
        <Stack align="center" justify="right" direction="row" spacing={4}>
          {options.map(({ label, value }, i) => (
            <Box
              key={i}
              as="button"
              style={{
                height: tabHeight ? tabHeight : "25px",
              }}
              lineHeight="1.2"
              transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
              border="2px"
              px="8px"
              borderRadius="24px"
              fontSize="14px"
              fontWeight="100"
              whiteSpace="nowrap"
              borderColor={activeOption == value ? "vodka.100" : "transparent"}
              color={activeOption == value ? "vodka.100" : "gray.500"}
              onClick={() => changeFilterValue(value)}
            >
              {label}
            </Box>
          ))}
        </Stack>
      )
    } else {
      return (
        <Stack align="center" justify="flex-end" direction="row" spacing={4}>
          <Menu autoSelect={false}>
            <MenuButton
              color="primary.500"
              textTransform="capitalize"
              as={Button}
              rightIcon={<CaretDownIcon />}
              p="0"
              h="auto"
              bgColor="transparent"
              _hover={{
                bgColor: "transparent",
              }}
              _active={{
                bgColor: "transparent",
              }}
            >
              {activeLabel}
            </MenuButton>
            <MenuList bgColor="gray.800">
              {options.map(({ label, value }, i) => (
                <MenuItem
                  bgColor={activeOption == value ? "pineapple.800" : ""}
                  color={activeOption == value ? "primary.500" : ""}
                  key={i}
                  onClick={() => changeFilterValue(value)}
                >
                  {label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Stack>
      )
    }
  } else {
    return <Fragment></Fragment>
  }
}
