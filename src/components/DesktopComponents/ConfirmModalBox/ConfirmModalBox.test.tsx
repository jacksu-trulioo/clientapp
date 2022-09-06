import React from "react"

import { fireEvent, render, screen } from "~/utils/testHelpers"

import ConfirmModalBox from "./ConfirmModalBox"

describe("ConfirmModalBox", () => {
  let showModal = true

  test("should render confirm modal box", async () => {
    const clickFirstButton = jest.fn()
    const clickSecondButton = jest.fn()
    render(
      <ConfirmModalBox
        isOpen={showModal}
        onClose={() => {}}
        bodyContent={"Body Test"}
        secondButtonText={"Second Button"}
        secondButtonOnClick={clickSecondButton}
        firstButtonText={"First Button"}
        firstButtonOnClick={clickFirstButton}
      />,
    )
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByTestId("modal-body")).toHaveTextContent("Body Test")
    expect(screen.getByTestId("first-btn")).toHaveTextContent("First Button")
    expect(screen.getByTestId("second-btn")).toHaveTextContent("Second Button")
    fireEvent.click(screen.getByTestId("first-btn"))
    fireEvent.click(screen.getByTestId("second-btn"))
    expect(clickFirstButton).toHaveBeenCalledTimes(1)
    expect(clickSecondButton).toHaveBeenCalledTimes(1)
  })

  test("should render and click confirm modal close button", async () => {
    const onClose = () => {
      showModal = false
    }
    render(
      <ConfirmModalBox
        isOpen={showModal}
        onClose={onClose}
        bodyContent={""}
        secondButtonText={""}
        secondButtonOnClick={() => {}}
        firstButtonText={""}
        firstButtonOnClick={() => {}}
      />,
    )
    expect(screen.getByTestId("close-btn")).toBeInTheDocument()
    fireEvent.click(screen.getByTestId("close-btn"))
  })
})
