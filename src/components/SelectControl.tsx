/**
 * Note: react-select depends on @emotion/react, which causes a dependency warning.
 * To resolve which dependency to use, a resolution must be added to package.json.
 * For more info see https://github.com/emotion-js/emotion/issues/2343#issuecomment-900209935.
 */
import { Center } from "@chakra-ui/layout"
import {
  chakra,
  FormLabel,
  SystemStyleObject,
  Tooltip,
  useStyles,
} from "@chakra-ui/react"
import { components, Select } from "chakra-react-select"
import { useField } from "formik"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import {
  ControlProps,
  GroupTypeBase,
  IndicatorProps,
  OptionsType,
  Props as ReactSelectProps,
} from "react-select"

import { CaretDownIcon, InfoIcon } from "~/components"
import {
  changeAdditionalPreferences,
  changeInvestmentGoals,
  changeShouldGenerateIncome,
  changeTopUpInvestmentAnnually,
  changeWhoIsPortfolioFor,
} from "~/utils/googleEvents"
import { event } from "~/utils/gtag"

import { FormControl, FormControlProps } from "./FormControl"

interface Option {
  label: string | number
  value: string | number
}

export type Size = "sm" | "md" | "lg"

export type SelectControlProps = {
  selectProps: ReactSelectProps<Option> | ReactSelectProps<Option, true>

  tooltip?: string | React.ReactNode
  widthToolTip?: string
  heightToolTip?: string
  toolTipColor?: string
  fireEvent?: boolean
  // @ts-ignore
  inputLeftElement?: ChakraInputElementProps | string
  showLabel?: boolean
} & FormControlProps

function SelectControl(props: SelectControlProps) {
  const {
    name,
    label,
    selectProps,
    tooltip,
    widthToolTip = "14px",
    heightToolTip = "14px",
    toolTipColor = "gray.750",
    fireEvent = false,
    inputLeftElement,
    showLabel = true,
    ...rest
  } = props
  const [field, , form] = useField(name)
  const { t } = useTranslation("common")
  const eventsArr = [
    "whoIsPortfolioFor",
    "shouldGenerateIncome",
    "topUpInvestmentAnnually",
    "investmentGoals",
    "additionalPreferences",
  ]

  const selectValue = React.useMemo(() => {
    if (Array.isArray(field.value)) {
      return selectProps.options
        ? selectProps.options?.filter((option) =>
            field.value?.includes(option.value),
          )
        : []
    } else {
      if (field.value) {
        return selectProps.options
          ? selectProps.options.find((option) => option.value === field.value)
          : ""
      }

      return null
    }
  }, [field.value, selectProps.options])

  const callEvent = (name: string) => {
    if (name === "whoIsPortfolioFor") {
      event(changeWhoIsPortfolioFor)
    }
    if (name === "shouldGenerateIncome") {
      event(changeShouldGenerateIncome)
    }
    if (name === "topUpInvestmentAnnually") {
      event(changeTopUpInvestmentAnnually)
    }
    if (name === "investmentGoals") {
      event(changeInvestmentGoals)
    }
    if (name === "additionalPreferences") {
      event(changeAdditionalPreferences)
    }
  }

  return (
    <FormControl aria-label={name} name={name} {...rest}>
      {showLabel && (
        <FormLabel color="gray.400" display="flex" alignItems="center">
          {label}

          {tooltip && (
            <Tooltip
              hasArrow
              label={tooltip}
              placement="bottom"
              bg={toolTipColor}
              alignSelf="center"
            >
              <chakra.span ps="2" lineHeight="1">
                <InfoIcon
                  color="primary.500"
                  h={widthToolTip}
                  w={heightToolTip}
                />
              </chakra.span>
            </Tooltip>
          )}
        </FormLabel>
      )}

      <Select
        id={name}
        name={name}
        autoComplete="off"
        noOptionsMessage={() => t("select.noOptions")}
        onChange={(option: Option | Option[]) => {
          if (fireEvent && eventsArr.includes(name)) {
            callEvent(name)
          }
          if (Array.isArray(option)) {
            const values = option.map((o) => o.value)
            form.setValue(values)
          } else {
            if (option?.value) {
              form.setValue(option.value)
            } else {
              form.setValue(null)
            }
          }
        }}
        value={selectValue}
        // https://github.com/JedWatson/react-select/issues/60#issuecomment-626806271
        onBlur={() => {
          setTimeout(() => form.setTouched(true), 1)
        }}
        blurInputOnSelect={true}
        {...selectProps}
        components={{
          Control: ({ children, ...props }: ControlProps<Option, false>) => {
            return (
              // @ts-ignore
              <components.Control {...props}>
                {inputLeftElement}
                {children}
                {/* @ts-ignore */}
              </components.Control>
            )
          },
          DropdownIndicator: ({
            innerProps,
            selectProps: { size },
          }: IndicatorProps<OptionsType<Record<string, unknown>>, false>) => {
            const { addon } = useStyles()

            const iconSizes = {
              sm: 5,
              md: 6,
              lg: 7,
            }

            const iconSize = iconSizes[size as Size]

            return (
              <Center
                {...innerProps}
                sx={{
                  ...addon,
                  bg: "transparent",
                  h: "100%",
                  borderRadius: 0,
                  borderWidth: 0,
                  cursor: "pointer",
                  pl: "0",
                  pr: "2",
                }}
              >
                <CaretDownIcon color="primary.500" h={iconSize} w={iconSize} />
              </Center>
            )
          },
          IndicatorSeparator: () => null,
        }}
        chakraStyles={{
          option: (
            provided: SystemStyleObject,
            state: GroupTypeBase<Option>,
          ) => {
            const isSelectedOption =
              state?.value === state?.getValue()?.[0]?.value
            return {
              ...provided,
              bg: state.isFocused ? "pineapple.700" : "initial",
              ...(isSelectedOption && {
                color: "primary.500",
                bg: "transparent",
                fontWeight: "bold",
              }),
            }
          },
          noOptionsMessage: (provided: SystemStyleObject) => ({
            ...provided,
            textAlign: "start",
          }),
          menuList: (provided: SystemStyleObject) => ({
            ...provided,
            bg: "gray.800",
          }),
          control: (provided: SystemStyleObject) => {
            return inputLeftElement
              ? {
                  ...provided,
                  alignItems: "center",
                  ps: "8px !important",
                }
              : provided
          },
          valueContainer: (provided: SystemStyleObject) => ({
            ...provided,
            p: "0.125rem 0.5rem",
          }),
        }}
      />
    </FormControl>
  )
}

export default React.memo(SelectControl)
