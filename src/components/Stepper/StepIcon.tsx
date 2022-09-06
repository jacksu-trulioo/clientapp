import { Flex, Text } from "@chakra-ui/layout"
import { Box, useBreakpointValue } from "@chakra-ui/react"
import React from "react"

import { CheckedCircleIcon, CurrencyExchangeIcon } from ".."
import { StepContext } from "./Step"
import { StepperContext } from "./Stepper"

function StepIcon() {
  const { activeStep, orientation, alternativeLabel } =
    React.useContext(StepperContext)
  const { index, completed, beingVerified, proposalIndicator } =
    React.useContext(StepContext)
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isActive = activeStep === index + 1
  const isHorizontal = orientation === "horizontal"

  return (
    <Flex>
      {completed ? (
        index === 0 && beingVerified ? (
          <CurrencyExchangeIcon
            color="primary.500"
            aria-label="currency exchange icon"
            h="6"
            w="6"
            ms={{ base: "2", md: "0" }}
          />
        ) : (
          <CheckedCircleIcon
            color={isActive || completed ? "primary.500" : "gray.600"}
            aria-label="Check Icon"
            {...(isHorizontal
              ? {
                  w: alternativeLabel ? 6 : "18px",
                  h: alternativeLabel ? 6 : "18px",
                  ms: alternativeLabel
                    ? 0
                    : index === 0
                    ? isMobileView
                      ? 4
                      : 0
                    : 6,
                }
              : {
                  w: proposalIndicator ? 6 : 8,
                  h: proposalIndicator ? 6 : 8,
                })}
          />
        )
      ) : (
        <Text
          {...(isHorizontal
            ? {
                w: alternativeLabel ? 6 : "18px",
                h: alternativeLabel ? 6 : "18px",
                ms: alternativeLabel ? 0 : index === 0 ? 0 : 6,
                fontSize: "sm",
                fontWeight: isActive ? "bold" : "normal",
              }
            : {
                w: proposalIndicator ? 6 : 8,
                h: proposalIndicator ? 6 : 8,
                fontSize: proposalIndicator ? "sm" : "xl",
              })}
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="black"
          backgroundColor={isActive ? "primary.500" : "gray.600"}
          rounded="full"
          textAlign="center"
        >
          <Box as="span" lineHeight="normal">
            {index + 1}
          </Box>
        </Text>
      )}
    </Flex>
  )
}

export default StepIcon
