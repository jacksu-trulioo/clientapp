import {
  chakra,
  Checkbox as ChakraCheckbox,
  CheckboxProps as ChakraCheckboxProps,
  Tooltip,
} from "@chakra-ui/react"
import { useField } from "formik"
import React from "react"

import { FormControl, FormControlProps, InfoIcon } from "~/components"

export interface CheckboxControlProps extends ChakraCheckboxProps {
  name: string
  label?: string
  containerProps?: FormControlProps
  tooltip?: string | React.ReactNode
  infoIconSize?: string
}

export function CheckboxControl(props: CheckboxControlProps) {
  const { name, label, containerProps, tooltip, infoIconSize, ...rest } = props
  const [field] = useField(name)

  return (
    <FormControl name={name} {...containerProps}>
      <ChakraCheckbox
        {...field}
        isChecked={field.value}
        id={name}
        spacing="1rem"
        lineHeight="16px"
        {...rest}
      >
        {label}

        {tooltip && (
          <Tooltip hasArrow label={tooltip} placement="bottom">
            <chakra.span ps="2">
              <InfoIcon
                w={infoIconSize}
                h={infoIconSize}
                aria-label="Info icon"
                color="primary.500"
              />
            </chakra.span>
          </Tooltip>
        )}
      </ChakraCheckbox>
    </FormControl>
  )
}

export default CheckboxControl
