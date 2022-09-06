import React from "react"

import { render } from "~/utils/testHelpers"

import { fakeItems, title } from "./mocks"
import StepsWidget from "./StepsWidget"

describe("StepsWidget", () => {
  test("it renders correctly", async () => {
    render(<StepsWidget title={title} items={fakeItems} />)
  })
})
