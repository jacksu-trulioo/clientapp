import { Stack, StackDirection } from "@chakra-ui/layout"
import {
  Checkbox,
  CheckboxGroup as ChakraCheckboxGroup,
  CheckboxGroupProps as ChakraCheckboxGroupProps,
  CheckboxProps as ChakraCheckboxProps,
  Text,
} from "@chakra-ui/react"
import { StringOrNumber } from "@chakra-ui/utils"
import { useField } from "formik"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { FormControl, FormControlProps } from "./FormControl"

export type CheckboxGroupProps = FormControlProps & {
  checkboxGroupProps?: ChakraCheckboxGroupProps
  direction?: StackDirection
  value?: string[]
  isValueRequired?: boolean
  selectAllList?: string[]
  showSelectAll?: boolean
  isSelectAllDisabled?: boolean
  children: React.ReactElement<ChakraCheckboxProps>[]
}

export const CheckboxGroupControl = (props: CheckboxGroupProps) => {
  const {
    name,
    label,
    children,
    variant,
    value,
    isValueRequired,
    direction = "column",
    selectAllList,
    showSelectAll = false,
    isSelectAllDisabled = false,
    ...rest
  } = props
  const [field, , { setValue, setTouched }] = useField(name)
  const { t } = useTranslation("common")

  const handleChange = React.useCallback(
    (value: StringOrNumber[]) => {
      setTouched(true)
      setValue(value)
    },
    [setTouched, setValue],
  )

  const handleSelectAll = (e: { target: HTMLInputElement }) => {
    const target = e?.target
    if (target.value === "SelectAll") {
      setTouched(true)
      if (target.checked) {
        if (
          Array.isArray(field.value) &&
          field.value.length > 0 &&
          Array.isArray(selectAllList)
        ) {
          const otherValues = field.value.filter(
            (val) => !selectAllList?.includes(val),
          )
          setValue([...selectAllList, ...otherValues])
        } else {
          setValue(selectAllList)
        }
      } else {
        if (
          Array.isArray(field.value) &&
          field.value.length > 0 &&
          Array.isArray(selectAllList)
        ) {
          const otherValues = field.value.filter(
            (val) => !selectAllList?.includes(val),
          )
          setValue(otherValues)
        } else {
          setValue([])
        }
      }
    }
  }

  return (
    <FormControl name={name} label={label} {...rest}>
      {showSelectAll &&
        React.cloneElement(
          <Checkbox
            key="SelectAll"
            value="SelectAll"
            onChange={handleSelectAll}
            isChecked={selectAllList?.every((elem) =>
              field.value?.includes(elem),
            )}
            isDisabled={isSelectAllDisabled}
            variant="filled"
            mb="2"
          >
            <Text>{t("select.selectAll")}</Text>
          </Checkbox>,
          {
            variant,
            width: "100%",
          },
        )}
      <ChakraCheckboxGroup
        {...field}
        onChange={handleChange}
        {...(isValueRequired && { value: value })}
      >
        <Stack direction={direction}>
          {React.Children.map(
            children,
            (
              child: React.ReactElement<
                React.PropsWithChildren<ChakraCheckboxProps>
              >,
            ) => {
              return React.cloneElement(child, {
                variant,
                width: "100%",
              })
            },
          )}
        </Stack>
      </ChakraCheckboxGroup>
    </FormControl>
  )
}

export default React.memo(CheckboxGroupControl)
