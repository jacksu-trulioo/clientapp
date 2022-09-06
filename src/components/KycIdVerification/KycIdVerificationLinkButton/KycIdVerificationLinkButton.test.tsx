import { KycIdVerificationLinkButton } from "~/components"
import { render } from "~/utils/testHelpers"

describe("KycIdVerificationLinkButton", () => {
  test("it renders correctly", async () => {
    const sampleText = "Upload"
    render(
      <KycIdVerificationLinkButton>{sampleText}</KycIdVerificationLinkButton>,
    )
  })
})
