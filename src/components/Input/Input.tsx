import {
  FormLabel,
  FormLabelProps as ChakraFormLabelProps,
  Input as ChakraInput,
  InputAddonProps as ChakraInputAddonProps,
  InputElementProps as ChakraInputElementProps,
  InputGroup,
  InputGroupProps as ChakraInputGroupProps,
  InputLeftAddon,
  InputLeftElement,
  InputProps as ChakraInputProps,
  InputRightAddon,
  InputRightElement,
  Text,
} from "@chakra-ui/react"
import { useField } from "formik"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import MaskedInput from "react-text-mask"

import { FormControl, FormControlProps } from "../FormControl"

type BottomTextLabelProperties = {
  marginTop: string
  color: string
  fontSize: string
}

export type InputProps = Omit<FormControlProps, "label"> & {
  inputLeftAddon?: string
  inputLeftElement?: ChakraInputElementProps | string
  inputRightAddon?: ChakraInputAddonProps
  inputRightElement?: ChakraInputElementProps
  label?: string | React.ReactElement
  labelProps?: ChakraFormLabelProps
  inputGroupProps?: ChakraInputGroupProps
  inputProps?: ChakraInputProps & {
    disabled?: boolean
    ref?: React.RefObject<HTMLInputElement>
  }
  mask?: Array<RegExp | string>
  inputLeftElementColor?: string
  inputRightElementZIndex?: string
  bottomTextLabel?: string
  bottomText?: BottomTextLabelProperties
}

export function InputControl(props: InputProps) {
  const {
    name,
    label,
    labelProps,
    inputProps,
    inputGroupProps,
    inputLeftAddon,
    inputLeftElement,
    inputRightAddon,
    inputRightElement,
    mask,
    inputLeftElementColor,
    inputRightElementZIndex = "unset",
    bottomTextLabel,
    bottomText,
    ...rest
  } = props
  const [field] = useField(name)
  const { lang } = useTranslation("common")

  return (
    <FormControl name={name} {...rest}>
      {typeof label === "string" ? (
        <FormLabel htmlFor={name} color="gray.500" {...labelProps}>
          {label}
        </FormLabel>
      ) : (
        label
      )}

      <InputGroup {...inputGroupProps} position="relative">
        {inputLeftElement && (
          <InputLeftElement
            pointerEvents="none"
            color={
              inputLeftElementColor
                ? inputLeftElementColor
                : field.value
                ? "white"
                : "gray.700"
            }
            borderBottom="2px solid transparent"
          >
            {inputLeftElement}
          </InputLeftElement>
        )}

        {inputLeftAddon && (
          <InputLeftAddon
            color={field.value ? "white" : "gray.700"}
            borderBottom="2px solid transparent"
          >
            {inputLeftAddon}
          </InputLeftAddon>
        )}
        <ChakraInput
          {...field}
          id={name}
          aria-label={name}
          autoComplete="off"
          {...(mask && { as: MaskedInput, mask })}
          {...inputProps}
        />
        {inputRightAddon && (
          <InputRightAddon
            color={field.value ? "white" : "gray.700"}
            borderBottom="2px solid transparent"
          >
            {inputRightAddon}
          </InputRightAddon>
        )}
        {inputRightElement && (
          <InputRightElement
            {...(lang === "ar" && {
              left: "calc(100% - 40px)",
              flexDirection: "row-reverse",
            })}
            color={field.value ? "white" : "gray.700"}
            borderBottom="2px solid transparent"
            zIndex={inputRightElementZIndex}
          >
            {inputRightElement}
          </InputRightElement>
        )}
      </InputGroup>
      {bottomTextLabel && <Text {...bottomText}>{bottomTextLabel}</Text>}
    </FormControl>
  )
}

/**
 * The `Input` component is a component that is used to get user input in a text field.
 */
export const Input = ChakraInput

export default Input
