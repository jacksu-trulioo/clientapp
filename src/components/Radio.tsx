import { Box } from "@chakra-ui/layout"
import { Radio as ChakraRadio } from "@chakra-ui/radio"
import {
  RadioProps as ChakraRadioProps,
  useRadioGroupContext,
} from "@chakra-ui/react"
import React from "react"

export interface RadioProps extends ChakraRadioProps {}

export const Radio = (props: RadioProps) => {
  const { children, value: valueProp, variant, ...rest } = props

  const group = useRadioGroupContext()

  let isChecked = props.isChecked
  if (group?.value != null && valueProp != null) {
    isChecked = group.value == valueProp
  }

  const filledStyleProps = isChecked && {
    border: "2px solid var(--chakra-colors-primary-500)",
  }
  return (
    <Box
      w="auto"
      boxSizing="border-box"
      border="2px solid transparent"
      rounded="md"
      {...(variant === "filled" && { ...filledStyleProps })}
    >
      <ChakraRadio value={valueProp} variant={variant} {...rest}>
        {children}
      </ChakraRadio>
    </Box>
  )
}

export default React.memo(Radio)
