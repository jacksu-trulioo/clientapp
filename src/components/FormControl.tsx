import { useDisclosure } from "@chakra-ui/hooks"
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
} from "@chakra-ui/popover"
import {
  Button,
  chakra,
  FormControl as ChakraFormControl,
  FormControlProps as ChakraFormControlProps,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  PopoverTrigger,
  Tooltip,
} from "@chakra-ui/react"
import { useField } from "formik"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { InfoIcon } from "."

export interface FormControlProps extends ChakraFormControlProps {
  ref?: React.MutableRefObject<HTMLDivElement>
  name: string
  label?: string
  helperText?: string
  tooltip?: string | React.ReactNode
  popover?: string | React.ReactNode
  customError?: (error: string) => React.ReactNode
  validate?: (value: string) => string | Promise<string>
  popoverWidth?: number
  popoverHeight?: number
  popoverPosition?: string
  modal?: string | React.ReactNode
}

export const FormControl: React.FC<FormControlProps> = (props) => {
  const {
    children,
    name,
    label,
    helperText,
    tooltip,
    popover,
    customError,
    validate,
    popoverHeight = 6,
    popoverWidth = 6,
    popoverPosition = "bottom-start",
    modal,
    ...rest
  } = props
  const [, { error, touched }] = useField({ name, validate })
  const { onOpen, onClose, isOpen } = useDisclosure()
  const { lang } = useTranslation("proposal")

  return (
    <ChakraFormControl isInvalid={!!error && touched} {...rest}>
      {label && (
        <FormLabel htmlFor={name}>
          {label}
          {modal}
          {tooltip && (
            <Tooltip hasArrow label={tooltip} placement="bottom">
              <chakra.span ps="2">
                <InfoIcon
                  cursor="pointer"
                  w={4}
                  h={4}
                  aria-label="Info icon"
                  color="primary.500"
                />
              </chakra.span>
            </Tooltip>
          )}
          {popover && (
            <>
              <Popover
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                closeOnBlur={true}
                // @ts-ignore
                placement={popoverPosition}
                autoFocus={false}
                returnFocusOnClose={false}
              >
                <PopoverTrigger>
                  <Button
                    p="0"
                    m="0"
                    bgColor="transparent"
                    _hover={{
                      bgColor: "transparent",
                    }}
                  >
                    <InfoIcon
                      aria-label="infoIcon"
                      color="primary.500"
                      ms="2"
                      h={popoverHeight}
                      w={popoverWidth}
                      _hover={{ cursor: "pointer" }}
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent bgColor="gunmetal.500" dir="ltr">
                  <PopoverArrow bgColor="gunmetal.500" />
                  {lang === "en" ? (
                    <PopoverCloseButton />
                  ) : (
                    <PopoverCloseButton right="2" />
                  )}
                  <PopoverBody mt="8">{popover}</PopoverBody>
                </PopoverContent>
              </Popover>
            </>
          )}
        </FormLabel>
      )}
      {children}
      {error && customError ? (
        customError(error)
      ) : (
        <FormErrorMessage textAlign="start">{error}</FormErrorMessage>
      )}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </ChakraFormControl>
  )
}

export default React.memo(FormControl)
