import { Text, TextProps } from "@chakra-ui/layout"
import React from "react"

import { StepContext } from "./Step"
import { StepperContext } from "./Stepper"

interface StepLabelProps extends TextProps {}

function StepLabel(props: StepLabelProps) {
  const { children, ...rest } = props
  const { activeStep, orientation } = React.useContext(StepperContext)
  const { index } = React.useContext(StepContext)

  const isActive = activeStep === index + 1
  const isHorizontal = orientation === "horizontal"

  if (isHorizontal) {
    if (!isActive) return null

    return (
      <Text
        fontSize={{ base: "sm", md: "sm" }}
        ps="3"
        color="gray.400"
        {...rest}
      >
        {children}
      </Text>
    )
  }

  return (
    <Text
      fontSize={{ base: "md", md: "lg" }}
      color={isActive ? "white" : "gray.500"}
      {...rest}
    >
      {children}
    </Text>
  )
}

export default StepLabel
