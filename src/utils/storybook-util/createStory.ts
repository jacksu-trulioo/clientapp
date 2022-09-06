import { ComponentStory } from "@storybook/react"
import { JSXElementConstructor } from "react"

/**
 *
 * @param Story
 * @returns {ComponentStory<T>} Story
 * @example
 * export const Default = createStory((args) => <Component {...args} />)
 */
export function createStory<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
>(Story: ComponentStory<T>) {
  return Story
}
