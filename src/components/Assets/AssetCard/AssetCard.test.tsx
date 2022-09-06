import React from "react"

import BankIcon from "~/components/Icon/BankIcon"
import { fireEvent, render } from "~/utils/testHelpers"

import AssetCard from "./AssetCard"
import { description, title } from "./mocks"

describe("AssetCard", () => {
  it("should render correctly", async () => {
    const onClick = jest.fn()
    render(
      <AssetCard
        title={title}
        description={description}
        icon={BankIcon}
        onClick={onClick}
      />,
    )
  })

  it("should render correctly without an icon", () => {
    const onClick = jest.fn()
    const { queryByTestId } = render(
      <AssetCard title={title} description={description} onClick={onClick} />,
    )

    const icon = queryByTestId("icon-container")

    expect(icon).toBeNull()
  })

  it("should call onClick when the card is pressed", async () => {
    const onClick = jest.fn()
    const { queryByTestId } = render(
      <AssetCard
        title={title}
        description={description}
        icon={BankIcon}
        onClick={onClick}
      />,
    )
    const card = queryByTestId("asset-card") as HTMLElement
    fireEvent.click(card)

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
