import React from "react"

import { fireEvent, render, screen } from "~/utils/testHelpers"

import ClientHeader from "./Header"

test("should render correctly and click correctly", async () => {
  const isDrawerOpen = true
  render(
    <ClientHeader onInviteClick={() => {}} ms={isDrawerOpen ? "256px" : 16} />,
  )

  const menuButton = screen.getByTestId("menu-button")
  expect(menuButton).toBeInTheDocument()
  fireEvent.click(screen.getByTestId("menu-button"))

  const referLink = screen.getByTestId("refer-button")
  expect(referLink).toBeInTheDocument()
  fireEvent.click(screen.getByTestId("refer-button"))
})
