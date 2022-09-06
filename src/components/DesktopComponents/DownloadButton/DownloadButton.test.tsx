import React from "react"

import { fireEvent, render, screen } from "~/utils/testHelpers"

import DownloadButton from "./DownloadButton"

describe("DownloadButton", () => {
  test("should render Button", async () => {
    render(<DownloadButton onDownloadClick={() => {}} />)
    expect(screen.getByTestId("download-btn")).toBeInTheDocument()
  })
  test("should render and click download button", async () => {
    const isDownloadCLicked = jest.fn()
    render(<DownloadButton onDownloadClick={isDownloadCLicked} />)
    fireEvent.click(screen.getByTestId("download-btn"))
    expect(isDownloadCLicked).toHaveBeenCalledTimes(1)
  })
})
