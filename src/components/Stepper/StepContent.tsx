import { Flex, FlexProps } from "@chakra-ui/layout"
import React from "react"

import { StepperContext } from "./Stepper"

interface StepContentProps extends FlexProps {}

function StepContent(props: React.PropsWithChildren<StepContentProps>) {
  const { children, ...rest } = props
  const { orientation } = React.useContext(StepperContext)
  const isHorizontal = orientation === "horizontal"

  return (
    <Flex
      flex="1"
      direction={{ base: "column-reverse", md: "row" }}
      ps={isHorizontal ? 0 : 6}
      {...rest}
    >
      {children}
    </Flex>
  )
}

export default StepContent
