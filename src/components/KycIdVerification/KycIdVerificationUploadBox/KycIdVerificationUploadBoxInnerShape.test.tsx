import React from "react"

import { render } from "~/utils/testHelpers"

import KycIdVerificationUploadBoxInnerShape, {
  KYC_UPLOAD_INNER_SHAPE,
} from "./KycIdVerificationUploadBoxInnerShape"

describe("KycIdVerificationUploadBoxInnerShape", () => {
  test("it renders correctly", async () => {
    render(
      <KycIdVerificationUploadBoxInnerShape
        type={KYC_UPLOAD_INNER_SHAPE.document}
      />,
    )
  })
})
