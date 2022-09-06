import { Flex } from "@chakra-ui/react"
import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import StepContent from "./StepContent"
import StepDescription from "./StepDescription"
import StepLabel from "./StepLabel"

export default {
  title: "Stepper/Step Content",
  component: StepContent,
  argTypes: {
    stepLabel: {
      type: "string",
      description:
        "The label of the step, wrapped around the `StepLabel` component",
      defaultValue: "Step Label",
    },
    stepDescription: {
      type: "string",
      description:
        "The description of the step, wrapped around the `StepDescription` component",
      defaultValue: "Description",
    },
  },
} as ComponentMeta<typeof StepContent>

export const Default = createStory((args) => (
  <StepContent>
    <Flex direction={"column"}>
      <StepLabel>{args.stepLabel}</StepLabel>
      <StepDescription>{args.stepDescription}</StepDescription>
    </Flex>
  </StepContent>
))
