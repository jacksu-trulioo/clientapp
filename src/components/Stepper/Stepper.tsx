import { Container, FlexProps } from "@chakra-ui/layout"
import React, { PropsWithChildren } from "react"

export const StepperContext = React.createContext({
  activeStep: 1,
  orientation: "vertical",
  alternativeLabel: false,
})

export interface StepperProps extends FlexProps {
  activeStep: number
  orientation: "vertical" | "horizontal"
  alternativeLabel?: boolean
}

function Stepper(props: PropsWithChildren<StepperProps>) {
  const {
    activeStep,
    orientation,
    children,
    alternativeLabel = false,
    ...rest
  } = props

  const contextValue = React.useMemo(
    () => ({ activeStep, orientation, alternativeLabel }),
    [activeStep, orientation, alternativeLabel],
  )

  const isHorizontal = orientation === "horizontal"

  return (
    <StepperContext.Provider value={contextValue}>
      <Container
        px="0"
        alignItems="center"
        display={isHorizontal ? "flex" : "block"}
        {...rest}
      >
        {children}
      </Container>
    </StepperContext.Provider>
  )
}

export default Stepper
