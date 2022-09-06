import { Box } from "@chakra-ui/react"

import { SideBySideLayout } from "~/components"
import { render } from "~/utils/testHelpers"

describe("SideBySideLayout", () => {
  test("it renders correctly", async () => {
    render(
      <SideBySideLayout title="Side by Side Title">
        <Box w={100} h={100} />
      </SideBySideLayout>,
    )
  })
})
