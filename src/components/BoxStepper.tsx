import { Box, BoxProps, Flex } from "@chakra-ui/react"
import React from "react"

interface BoxStepperProps extends BoxProps {
  currentStep: number
  steps: number
}

const BoxStepper = (props: BoxStepperProps) => {
  const { currentStep = 0, steps = 3, ...rest } = props

  const boxes = [...Array(steps)]

  return (
    <Flex direction="row" alignItems="center" {...rest}>
      {boxes?.map((_, i) => {
        return (
          <Box
            key={i?.toString()}
            w={7}
            h="1"
            me={1}
            {...(currentStep >= i
              ? {
                  backgroundColor: "primary.500",
                  cursor: "pointer",
                }
              : {
                  backgroundColor: "gray.750",
                })}
          ></Box>
        )
      })}
    </Flex>
  )
}

export default BoxStepper
