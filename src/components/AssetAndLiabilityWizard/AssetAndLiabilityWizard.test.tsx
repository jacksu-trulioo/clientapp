import { NextRouter } from "next/router"
import React from "react"

import { fireEvent, render, screen } from "~/utils/testHelpers"

import AssetAndLiabilityWizard from "./AssetAndLiabilityWizard"
import { assets, bankAccountTypes } from "./mocks"

const TEST_IDS = {
  assetCard: "asset-card",
  footerCancelButton: "asset-and-liability-wizard-footer-cancel-button",
  footerBackButton: "asset-and-liability-wizard-footer-back-button",
  footerSaveButton: "asset-and-liability-wizard-footer-save-button",
}

jest.mock("next/router", () => ({
  useRouter: () =>
    ({
      route: "/",
      back: () => undefined,
    } as NextRouter),
}))

describe("AssetAndLiabilityWizard", () => {
  it("should render correctly", async () => {
    render(
      <AssetAndLiabilityWizard
        assets={assets}
        bankAccountTypes={bankAccountTypes}
      />,
    )
  })

  it("should call `onSave` when the save button is clicked", async () => {
    const onSave = jest.fn()
    render(
      <AssetAndLiabilityWizard
        assets={assets}
        bankAccountTypes={bankAccountTypes}
        onSave={onSave}
      />,
    )

    const firstSaveButton = screen.queryByText("button.saveAndExit", {
      exact: false,
    }) as HTMLElement

    fireEvent.click(firstSaveButton)

    const saveButtons = screen.queryAllByText("button.saveAndExit", {
      exact: false,
    }) as HTMLElement[]

    const secondSaveButton = saveButtons[saveButtons.length - 1]

    fireEvent.click(secondSaveButton)

    expect(onSave).toHaveBeenCalledTimes(1)
  })

  describe("first screen", () => {
    it("should show only the cancel button in the first page", async () => {
      render(
        <AssetAndLiabilityWizard
          assets={assets}
          bankAccountTypes={bankAccountTypes}
        />,
      )

      const cancelButton = screen.queryByTestId(TEST_IDS.footerCancelButton)
      const backButton = screen.queryByTestId(TEST_IDS.footerBackButton)
      const saveButton = screen.queryByTestId(TEST_IDS.footerSaveButton)

      expect(backButton).toBeNull()
      expect(saveButton).toBeNull()
      expect(cancelButton).toBeDefined()
    })
  })

  describe("second screen", () => {
    beforeEach(() => {
      render(
        <AssetAndLiabilityWizard
          assets={assets}
          bankAccountTypes={bankAccountTypes}
        />,
      )
      const [firstAssetCard] = screen.queryAllByTestId(TEST_IDS.assetCard)

      fireEvent.click(firstAssetCard)
    })

    it("should show the back button button", async () => {
      const cancelButton = screen.queryByTestId(TEST_IDS.footerCancelButton)
      const backButton = screen.queryByTestId(TEST_IDS.footerBackButton)
      const saveButton = screen.queryByTestId(TEST_IDS.footerSaveButton)

      expect(backButton).toBeDefined()
      expect(saveButton).toBeNull()
      expect(cancelButton).toBeNull()
    })
  })
})
