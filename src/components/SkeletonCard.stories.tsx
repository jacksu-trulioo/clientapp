import { ComponentMeta } from "@storybook/react"

import { createStory } from "~/utils/storybook-util/createStory"

import SkeletonCard from "./SkeletonCard"

export default {
  title: "Basics/Skeleton Card",
  component: SkeletonCard,
} as ComponentMeta<typeof SkeletonCard>
export const Default = createStory(() => <SkeletonCard />)
