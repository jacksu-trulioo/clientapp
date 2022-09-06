import { Text } from "@chakra-ui/react"
import { useFormikContext } from "formik"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { InputControl } from "~/components"

import { InputProps as BaseInputProps } from "../../../Input/Input"
import { KycInvestmentExperienceValues } from "../../types"

type InputProps = Omit<BaseInputProps, "name"> & {
  name: keyof KycInvestmentExperienceValues
}

const Input: React.VFC<InputProps> = (props) => {
  const { t } = useTranslation("kyc")

  const { values } = useFormikContext<KycInvestmentExperienceValues>()

  const inputValue = values[props.name]
  const label = t(
    `investmentExperience.currentInvestments.body.inputs.${props.name}`,
  )

  return (
    <InputControl
      {...props}
      label={label}
      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
        const excludedValues = ["+", "-", "e", "."]
        if (excludedValues.includes(e.key)) {
          e.preventDefault()
        }
      }}
      inputProps={{
        textAlign: "end",
        type: "number",
        pattern: "[0-9]*",
        onInput: (event: React.KeyboardEvent<HTMLInputElement>) => {
          const target = event.target as HTMLInputElement
          if (!target.validity.valid) {
            event.preventDefault()
            target.value = inputValue as string
          }
        },
        ...props.inputProps,
      }}
      inputRightElement={
        inputValue || inputValue === 0 ? <Text>%</Text> : <Text>0 %</Text>
      }
    />
  )
}

Input.displayName = "KycInvestmentExperienceCurrentInvestmentsInput"

export default React.memo(Input)
