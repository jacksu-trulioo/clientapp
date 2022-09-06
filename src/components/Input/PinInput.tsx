import {
  FormLabel,
  FormLabelProps as ChakraFormLabelProps,
  PinInput as ChakraPinInput,
  PinInputField,
  PinInputProps as ChakraPinInputProps,
} from "@chakra-ui/react"
import { useField } from "formik"
import React from "react"

import { FormControl, FormControlProps } from "../FormControl"

export type InputProps = Omit<FormControlProps, "label"> & {
  label?: string | React.ReactElement
  labelProps?: ChakraFormLabelProps
  inputProps?: ChakraPinInputProps & { disabled?: boolean }
  noOfFields?: number
}

function PinInputFields({ noOfFields = 6 }: { noOfFields?: number }) {
  let pinFields = []
  for (let i = 0; i < noOfFields; i++) {
    pinFields.push(<PinInputField />)
  }
  return <>{pinFields}</>
}
export const MemoizedPinInputFields = React.memo(PinInputFields)

export function PinInputControl(props: InputProps) {
  const { name, label, labelProps, inputProps, children, ...rest } = props
  const [field] = useField(name)

  return (
    <FormControl name={name} {...rest}>
      {typeof label === "string" ? (
        <FormLabel htmlFor={name} color="gray.500" {...labelProps}>
          {label}
        </FormLabel>
      ) : (
        label
      )}
      <ChakraPinInput {...field} id={name} aria-label={name} {...inputProps}>
        {children}
      </ChakraPinInput>
    </FormControl>
  )
}

export const PinInput = ChakraPinInput

export default PinInput
