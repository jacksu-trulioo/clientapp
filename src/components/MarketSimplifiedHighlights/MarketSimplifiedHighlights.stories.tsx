import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import { boolean, number } from "yup"

import MarketHighlights from "./MarketSimplifiedHighlights"

export default {
  title: "Market / Market Highlights",
  component: MarketHighlights,
  argTypes: {
    SlideOnScreenDesktop: {
      name: "Number of slide on desktop screen",
      description: "Slides Number",
      type: number,
      defaultValue: 1,
    },
    isRigth: {
      name: "rigth css property for arrow",
      description: "rigth css property for arrow",
      type: boolean,
      defaultValue: true,
    },
    insideArrowMain: {
      name: "Arrow position",
      description: "Arrow position",
      type: "string",
      defaultValue: "in",
    },
    Boxpadding: {
      name: "Box padding",
      description: "Box padding",
      type: "string",
      defaultValue: "in",
    },
    SlideOnScreenTab: {
      name: "Number of slide on tab screen",
      description: "Slides Number",
      type: number,
      defaultValue: 1,
    },
    SlideOnScreenMob: {
      name: "Number of slide on mobile screen",
      description: "Slides Number",
      type: number,
      defaultValue: 1,
    },
  },
} as ComponentMeta<typeof MarketHighlights>

const Default: ComponentStory<typeof MarketHighlights> = (args) => {
  return <MarketHighlights {...args} />
}

export const rounded = Default.bind({})
rounded.args = {}
