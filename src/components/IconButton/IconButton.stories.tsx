import { IconButton, IconButtonProps, Stack } from "@chakra-ui/react"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import { IoAccessibility, IoMail } from "react-icons/io5"

import { CloseIcon, HomeIcon, StarIcon } from "~/components"
// IconButton composes the Button component except that it renders only an icon.
export default {
  title: "Basics/IconButton",
  component: IconButton,
  // There seems to be an issue with inferring `argTypes` from interfaces.
  // See https://github.com/chakra-ui/chakra-ui/issues/2009.
  // So for now, we manually define the component props.
  argTypes: {
    colorScheme: {
      name: "colorScheme",
      type: {
        summary: "string",
        name: "other",
        value: "value",
      },
      description:
        "The color theme of the button. You can set the value to `primary` or `secondary`.",
      options: ["primary", "secondary"],
      control: "inline-radio",
    },
    variant: {
      name: "variant",
      type: { summary: "string", name: "other", value: "value" },
      description:
        "Use the variant prop to change the visual style of the Button. You can set the value to `solid`, `ghost`, `outline` or `link`.",
      options: ["solid", "outline", "ghost", "link"],
      control: "inline-radio",
    },
    size: {
      name: "size",
      type: { summary: "string", name: "other", value: "value" },
      description:
        "Use the size prop to change the size of the button. You can set the value to `xs`, `sm`, `md`, `lg`, or `xl`.",
      options: ["xs", "sm", "md", "lg", "xl"],
      control: "inline-radio",
    },
    isLoading: {
      name: "isLoading",
      type: { summary: "boolean", name: "other", value: "value" },
      defaultValue: false,
      description: "If `true`, the button will show a spinner.",
      control: "boolean",
    },
    isActive: {
      name: "isActive",
      type: { summary: "boolean", name: "other", value: "value" },
      defaultValue: false,
      description: "If `true`, the button will be styled in its active state.",
      control: "boolean",
    },
    isDisabled: {
      name: "isDisabled",
      type: { summary: "boolean", name: "other", value: "value" },
      defaultValue: false,
      description: "If `true`, the button will be disabled.",
      control: "boolean",
    },
    icon: {
      name: "icon",
      type: { summary: "React.ReactElement", name: "other", value: "value" },
      description: "The icon to be used in the button.",
      options: ["Star", "Mail", "Accessibility", "Close", "Home"],
      control: "select",
      mapping: {
        Star: <StarIcon />,
        Mail: <IoMail />,
        Accessibility: <IoAccessibility />,
        Close: <CloseIcon />,
        Home: <HomeIcon />,
      },
    },
    spinner: {
      name: "spinner",
      type: { summary: "React.ReactElement", name: "other", value: "value" },
      description:
        "Replace the spinner component when `isLoading` is set to `true`.",
      control: "select",
      options: ["Custom"],
      mapping: {
        Custom: "Custom Spinner",
      },
    },
  },
} as ComponentMeta<typeof IconButton>

const Template: ComponentStory<typeof IconButton> = ({
  "aria-label": ariaLabel = "Star something",
  icon = <StarIcon />,
  ...rest
}) => <IconButton aria-label={ariaLabel} icon={icon} {...rest} />

export const Default = Template.bind({})
Default.args = {}

export const ButtonSizes = Template.bind({})
ButtonSizes.storyName = "Button sizes"
ButtonSizes.args = {
  colorScheme: "primary",
}
ButtonSizes.decorators = [
  () => (
    <Stack spacing={4} direction="row" align="center">
      <IconButton
        {...(ButtonSizes.args as IconButtonProps)}
        size="xs"
        aria-label="Star something"
        icon={<StarIcon />}
      />
      <IconButton
        {...(ButtonSizes.args as IconButtonProps)}
        size="sm"
        aria-label="Star something"
        icon={<StarIcon />}
      />
      <IconButton
        {...(ButtonSizes.args as IconButtonProps)}
        size="md"
        aria-label="Star something"
        icon={<StarIcon />}
      />
      <IconButton
        {...(ButtonSizes.args as IconButtonProps)}
        size="lg"
        aria-label="Star something"
        icon={<StarIcon />}
      />
      <IconButton
        {...(ButtonSizes.args as IconButtonProps)}
        size="xl"
        aria-label="Star something"
        icon={<StarIcon />}
      />
    </Stack>
  ),
]

export const ButtonVariants = Template.bind({})
ButtonVariants.storyName = "Button variants"
ButtonVariants.args = {
  colorScheme: "primary",
}
ButtonVariants.decorators = [
  () => (
    <Stack spacing={4} direction="row" align="center">
      <IconButton
        {...(ButtonVariants.args as IconButtonProps)}
        variant="solid"
        aria-label="Star something"
        icon={<StarIcon />}
      />
      <IconButton
        {...(ButtonVariants.args as IconButtonProps)}
        variant="outline"
        aria-label="Star something"
        icon={<StarIcon />}
      />
      <IconButton
        {...(ButtonVariants.args as IconButtonProps)}
        variant="ghost"
        aria-label="Star something"
        icon={<StarIcon />}
      />
    </Stack>
  ),
]

export const ButtonWithIcon = Template.bind({})
ButtonWithIcon.storyName = "Button with custom icon"
ButtonWithIcon.args = {}
ButtonWithIcon.decorators = [
  () => (
    <Stack direction="row" spacing={4}>
      <IconButton
        {...(ButtonVariants.args as IconButtonProps)}
        variant="solid"
        aria-label="Send mail"
        icon={<IoMail />}
      />
      <IconButton
        {...(ButtonVariants.args as IconButtonProps)}
        variant="outline"
        aria-label="Accessibility"
        icon={<IoAccessibility />}
      />
    </Stack>
  ),
]
