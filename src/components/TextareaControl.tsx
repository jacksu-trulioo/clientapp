import {
  Textarea as ChakraTextarea,
  TextareaProps as ChakraTextareaProps,
} from "@chakra-ui/react"
import { useField } from "formik"
import React from "react"

import { FormControl, FormControlProps } from "./FormControl"

export type TextareaProps = Omit<FormControlProps, "textarea"> & {
  textAreaProps?: ChakraTextareaProps & { disabled?: boolean }
}

function TextareaControl(props: TextareaProps) {
  const { name, placeholder, textAreaProps, ...rest } = props
  const [field] = useField(name)

  return (
    <FormControl name={name} {...rest}>
      <ChakraTextarea
        {...field}
        id={name}
        name={name}
        placeholder={placeholder}
        autoComplete="off"
        {...textAreaProps}
      />
    </FormControl>
  )
}

export default TextareaControl
