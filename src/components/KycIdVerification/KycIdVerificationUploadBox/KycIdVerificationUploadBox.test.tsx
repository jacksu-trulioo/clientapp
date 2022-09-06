import React from "react"

import { render } from "~/utils/testHelpers"

import KycIdVerificationUploadBox from "./KycIdVerificationUploadBox"

describe("KycIdVerificationUploadBox", () => {
  test("it renders correctly", async () => {
    render(<KycIdVerificationUploadBox />)
  })
})
