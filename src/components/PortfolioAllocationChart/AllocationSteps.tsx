import { Flex } from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/react"
import React from "react"

import {
  CheckedCircleIcon,
  CurrencyExchangeIcon,
  PortfolioSummary1Icon,
  PortfolioSummary2Icon,
} from "~/components"
import { StepContext } from "~/components/Stepper/Step"
import { StepperContext } from "~/components/Stepper/Stepper"

type TextProps = {
  index: number
}

function AllocationStep({ index }: TextProps) {
  const { activeStep, orientation, alternativeLabel } =
    React.useContext(StepperContext)
  const { completed, beingVerified } = React.useContext(StepContext)
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
                  w: 8,
                  h: 8,
                })}
          />
        )
      ) : index === 1 ? (
        <PortfolioSummary1Icon />
      ) : (
        <PortfolioSummary2Icon />
      )}
    </Flex>
  )
}

export default AllocationStep
