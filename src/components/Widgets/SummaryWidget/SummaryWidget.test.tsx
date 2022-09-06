import React from "react"

import { render } from "~/utils/testHelpers"

import { title, value } from "./mocks"
import SummaryWidget from "./SummaryWidget"

describe("SummaryWidget", () => {
  test("it renders correctly", async () => {
    render(<SummaryWidget title={title} value={value} />)
  })
})
