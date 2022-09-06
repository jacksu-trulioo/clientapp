import { Flex, TextProps } from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/react"
import React from "react"

import { StepIcon } from ".."
import { StepperContext } from "./Stepper"

export const StepContext = React.createContext({
  index: 0,
  completed: false,
  beingVerified: false,
  proposalIndicator: false,
})

interface StepProps extends TextProps {
  index: number
  completed?: boolean
  beingVerified?: boolean
  isLast?: boolean
  proposalIndicator?: boolean
}

function Step(props: React.PropsWithChildren<StepProps>) {
  const {
    children,
    index,
    beingVerified = false,
    completed = false,
    isLast = false,
    proposalIndicator = false,
  } = props
  const contextValue = React.useMemo(
    () => ({ index, completed, beingVerified, proposalIndicator }),
    [index, completed, beingVerified, proposalIndicator],
  )
  const { orientation, alternativeLabel } = React.useContext(StepperContext)
  const isHorizontal = orientation === "horizontal"
  const isTabletView = useBreakpointValue({ base: false, md: true, lg: false })

  return (
    <StepContext.Provider value={contextValue}>
      <Flex
        alignItems={isHorizontal ? "center" : "flex-start"}
        {...(isHorizontal ? { pb: 0 } : { pb: isTabletView && isLast ? 0 : 6 })}
        {...(isHorizontal ? { pt: 1 } : { pt: isTabletView ? 0 : 2 })}
        {...(alternativeLabel ? { me: 2 } : { mr: 0 })}
        {...props}
      >
        <StepIcon />

        {children}
      </Flex>
    </StepContext.Provider>
  )
}

export default Step
