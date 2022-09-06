import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"

import { Input } from "~/components"

export default {
  title: "Basics/Input",
  component: Input,
  // There seems to be an issue with inferring `argTypes` from interfaces.
  // See https://github.com/chakra-ui/chakra-ui/issues/2009.
  // So for now, we manually define the component props.
  argTypes: {
    variant: {
      name: "variant",
      type: { summary: "string", name: "other", value: "value" },
      description:
        "Use the variant prop to change the visual style of the Input. You can set the value to `outline`, `filled`, `flushed`, or `unstyled`.",
      options: ["outline", "filled", "flushed", "unstyled"],
      control: "inline-radio",
    },
    size: {
      name: "size",
      type: { summary: "string", name: "other", value: "value" },
      description:
        "Use the size prop to change the size of the input. You can set the value to `xs`, `sm`, `md`, or `lg`.",
      options: ["xs", "sm", "md", "lg"],
      control: "inline-radio",
    },
    isDisabled: {
      name: "isDisabled",
      type: { summary: "boolean", name: "other", value: "value" },
      defaultValue: false,
      description:
        "If `true`, the form control will be disabled. This has 2 side effects: - The `FormLabel` will have `data-disabled` attribute - The form element (e.g, Input) will be disabled",
      control: "boolean",
    },
  },
} as ComponentMeta<typeof Input>

const Template: ComponentStory<typeof Input> = ({
  placeholder = "Basic usage",
  ...rest
}) => <Input placeholder={placeholder} {...rest} />

export const Default = Template.bind({})
Default.args = {}
