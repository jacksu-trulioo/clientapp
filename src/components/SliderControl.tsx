import {
  FormLabel,
  FormLabelProps as ChakraFormLabelProps,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderMarkProps,
  SliderProps,
  SliderThumb,
  SliderThumbProps,
  SliderTrack,
  SliderTrackProps,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react"
import { useField } from "formik"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import {
  changeAnnualIncreasePercent,
  changeTimeHorizon,
} from "~/utils/googleEvents"
import { event } from "~/utils/gtag"

import { FormControl, FormControlProps } from "./FormControl"

export type SliderControlProps = Omit<FormControlProps, "label"> & {
  label?: string | ((value: number) => React.ReactElement)
  labelProps?: ChakraFormLabelProps
  sliderProps?: SliderProps
  sliderTrackProps?: SliderTrackProps
  sliderThumbProps?: SliderThumbProps
  sliderMarkProps?: SliderMarkProps
  sliderMarkLabel?: String
  isToolTipRequired?: boolean
  toolTipLabel?: string
  markerOnTop?: boolean
  tooltipVariant?: string
  mutipleMarkers?: boolean
  fireEvent?: boolean
}

export function SliderControl(props: SliderControlProps) {
  const {
    name,
    label,
    labelProps,
    sliderProps,
    sliderTrackProps,
    sliderThumbProps,
    sliderMarkProps,
    sliderMarkLabel,
    markerOnTop = false,
    mutipleMarkers = false,
    fireEvent = false,
    ...rest
  } = props
  const [field, , { setValue }] = useField(name)
  const { lang } = useTranslation()
  const isTabletView = useBreakpointValue({
    base: false,
    md: true,
    lg: false,
  })

  const {
    isToolTipRequired = false,
    toolTipLabel = "",
    tooltipVariant = "",
  } = { ...rest }

  const eventsArr = ["investmentDurationInYears", "desiredAnnualIncome"]

  const callEvent = (name: string) => {
    if (name === "investmentDurationInYears") event(changeTimeHorizon)
    if (name === "desiredAnnualIncome") event(changeAnnualIncreasePercent)
  }

  function handleChange(value: number) {
    if (fireEvent && eventsArr.includes(name)) {
      callEvent(name)
    }
    setValue(value)
  }

  // Does not behave like expected, so we manually handle it.
  function handleBlur(e: React.FocusEvent<HTMLDivElement>) {
    // @ts-ignore
    e.target.name = name
    field.onBlur(e)
  }

  return (
    <FormControl name={name} {...rest}>
      {label && typeof label === "string" && (
        <FormLabel {...labelProps}>{label}</FormLabel>
      )}

      {label && typeof label === "function" && label(field.value)}

      <Slider
        {...field}
        id={name}
        onChange={handleChange}
        onBlur={handleBlur}
        {...sliderProps}
      >
        <SliderTrack height="6px" {...sliderTrackProps}>
          <SliderFilledTrack />
        </SliderTrack>

        {field.value !== 1 && mutipleMarkers && (
          <SliderMark
            value={1}
            mt="1"
            ml="-2.5"
            fontSize="sm"
            height="3"
            width="3px"
            backgroundColor="white"
            bottom="2px"
            left={!isTabletView ? "3% !important" : "1% !important"}
          ></SliderMark>
        )}
        {field.value !== 2 && mutipleMarkers && (
          <SliderMark
            value={2}
            mt="1"
            ml="-2.5"
            fontSize="sm"
            height="3"
            width="3px"
            backgroundColor="white"
            bottom="2px"
          ></SliderMark>
        )}
        {field.value !== 3 && mutipleMarkers && (
          <SliderMark
            value={3}
            mt="1"
            ml="-2.5"
            fontSize="sm"
            height="3"
            width="3px"
            backgroundColor="white"
            bottom="2px"
          ></SliderMark>
        )}
        {field.value !== 4 && mutipleMarkers && (
          <SliderMark
            value={4}
            mt="1"
            ml="-2.5"
            fontSize="sm"
            height="3"
            width="3px"
            backgroundColor="white"
            bottom="2px"
          ></SliderMark>
        )}
        {field.value !== 5 && mutipleMarkers && (
          <SliderMark
            value={5}
            mt="1"
            ml="-2.5"
            fontSize="sm"
            height="3"
            width="3px"
            backgroundColor="white"
            bottom="2px"
            left={!isTabletView ? "102% !important" : "100% !important"}
          ></SliderMark>
        )}
        {sliderMarkLabel && (
          <SliderMark
            value={field.value}
            textAlign="center"
            fontSize="sm"
            color="gray.400"
            fontWeight="bold"
            mt="-10"
            ml={markerOnTop ? "-10" : "10"}
            mr={lang == "ar" ? "-10" : "0"}
            w="20"
            {...sliderMarkProps}
          >
            {sliderMarkLabel || field.value}
          </SliderMark>
        )}
        <SliderThumb {...sliderThumbProps} />
        {isToolTipRequired && (
          <Tooltip
            {...(isTabletView && {
              bottom: "-3",
            })}
            hasArrow
            bg="gray.750"
            color="white"
            placement="bottom"
            isOpen={true}
            label={toolTipLabel}
            variant={tooltipVariant}
          >
            <SliderThumb />
          </Tooltip>
        )}
      </Slider>
    </FormControl>
  )
}

export default SliderControl
