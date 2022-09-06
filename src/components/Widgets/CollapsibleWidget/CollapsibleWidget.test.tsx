import React from "react"

import { render } from "~/utils/testHelpers"

import CollapsibleWidget from "./CollapsibleWidget"
import { assets } from "./mocks"

describe("CollapsibleWidget", () => {
  test("it renders correctly", async () => {
    render(<CollapsibleWidget {...assets} content={<></>} />)
  })
})
