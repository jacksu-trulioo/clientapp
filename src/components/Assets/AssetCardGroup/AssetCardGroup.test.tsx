import React from "react"

import { render } from "~/utils/testHelpers"

import AssetCardGroup from "./AssetCardGroup"
import { assets } from "./mocks"

describe("AssetCardGroup", () => {
  it("should render correctly", async () => {
    render(<AssetCardGroup assets={assets} />)
  })
})
