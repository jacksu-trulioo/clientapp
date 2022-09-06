import { Box } from "@chakra-ui/react"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import withFormik from "storybook-formik"

import { Autocomplete } from "~/components"

export default {
  decorators: [withFormik],
  title: "Experiments/Autocomplete",
  component: Autocomplete,
  parameters: {
    formik: {
      initialValues: {
        country: "",
      },
      onSubmit: (v: { country: string }) =>
        console.log("I want to log these... ", v),
    },
  },
} as ComponentMeta<typeof Autocomplete>

const countries = [
  { value: "ghana", label: "Ghana" },
  { value: "nigeria", label: "Nigeria" },
  { value: "kenya", label: "Kenya" },
  { value: "southAfrica", label: "South Africa" },
  { value: "unitedStates", label: "United States" },
  { value: "canada", label: "Canada" },
  { value: "germany", label: "Germany" },
]

const Template: ComponentStory<typeof Autocomplete> = (args) => {
  return (
    <Box minH="350px">
      <Autocomplete
        {...args}
        name="country"
        label="Country of residence"
        placeholder="Country of residence"
        items={countries}
      />
    </Box>
  )
}

export const Default = Template.bind({})
Default.args = {}
