import { Stack, StackDirection } from "@chakra-ui/layout"
import {
  RadioGroup as ChakraRadioGroup,
  RadioGroupProps as ChakraRadioGroupProps,
  RadioProps as ChakraRadioProps,
} from "@chakra-ui/react"
import { useField } from "formik"
import React from "react"

import { FormControl, FormControlProps } from "./FormControl"

export type RadioGroupProps = FormControlProps & {
  radioGroupProps?: ChakraRadioGroupProps
  direction?: StackDirection
  tooltip?: string | React.ReactNode
  popover?: string | React.ReactNode
  children: React.ReactElement<ChakraRadioProps>[]
  popoverPosition?: string
  modal?: string | React.ReactNode
}

export const RadioGroupControl = (props: RadioGroupProps) => {
  const {
    name,
    label,
    children,
    variant,
    tooltip,
    popover,
    direction = "column",
    modal,
    ...rest
  } = props
  const [field, , { setValue, setTouched }] = useField(name)

  const handleChange = React.useCallback(
    (value: string) => {
      setTouched(true)
      setValue(value)
    },
    [setTouched, setValue],
  )

  return (
    <FormControl
      name={name}
      label={label}
      popover={popover}
      modal={modal}
      tooltip={tooltip}
      {...rest}
    >
      <ChakraRadioGroup id={name} {...field} onChange={handleChange}>
        <Stack direction={direction}>
          {React.Children.map(
            children,
            (
              child: React.ReactElement<
                React.PropsWithChildren<ChakraRadioProps>
              >,
            ) => {
              return React.cloneElement(child, {
                variant,
                width: "100%",
              })
            },
          )}
        </Stack>
      </ChakraRadioGroup>
    </FormControl>
  )
}

export default React.memo(RadioGroupControl)
