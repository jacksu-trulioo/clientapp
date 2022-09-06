import { Box } from "@chakra-ui/layout"
import {
  Checkbox as ChakraCheckbox,
  CheckboxProps as ChakraCheckboxProps,
  useCheckboxGroupContext,
} from "@chakra-ui/react"
import React from "react"

export interface CheckboxProps extends ChakraCheckboxProps {}

export const Checkbox = (props: CheckboxProps) => {
  const { children, value: valueProp, variant, ...rest } = props

  const group = useCheckboxGroupContext()

  let isChecked = props.isChecked

  if (group?.value != null && valueProp != null) {
    isChecked = group.value.includes(valueProp)
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
      <ChakraCheckbox value={valueProp} variant={variant} {...rest}>
        {children}
      </ChakraCheckbox>
    </Box>
  )
}

export default React.memo(Checkbox)
