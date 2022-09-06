import { Text } from "@chakra-ui/react"

import { render } from "~/utils/testHelpers"

import KycIdVerificationModal from "./KycIdVerificationModal"

describe("KycIdVerificationModal", () => {
  test("it renders correctly", async () => {
    const onClose = jest.fn()

    render(
      <KycIdVerificationModal
        isOpen={true}
        onClose={onClose}
        content={<Text>Test</Text>}
      />,
    )
  })
})
