import { Text, TextProps } from "@chakra-ui/layout"
import React from "react"

import { StepContext } from "./Step"

interface StepDescriptionProps extends TextProps {}

function StepDescription(props: React.PropsWithChildren<StepDescriptionProps>) {
  const { children, ...rest } = props
  const { completed } = React.useContext(StepContext)

  return (
    <Text
      fontSize="sm"
      mt="2"
      maxW="sm"
      color={completed ? "white" : "gray.500"}
      {...rest}
    >
      {children}
    </Text>
  )
}

export default StepDescription
