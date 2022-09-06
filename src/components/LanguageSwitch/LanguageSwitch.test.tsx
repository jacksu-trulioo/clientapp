import React from "react"

import { render, screen } from "~/utils/testHelpers"

import LanguageSwitch from "./LanguageSwitch"

test("it renders correctly", async () => {
  // Fix: act() warning.
  render(<LanguageSwitch />)

  expect(screen.getByRole("button")).toHaveAccessibleName("Toggle language")
})
