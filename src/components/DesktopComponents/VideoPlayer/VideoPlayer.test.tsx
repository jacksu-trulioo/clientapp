import React from "react"

import { fireEvent, render, screen } from "~/utils/testHelpers"

import VideoPlayer from "./VideoPlayer"

test("should render and play the video", async () => {
  render(
    <VideoPlayer url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4" />,
  )
  expect(screen.getByRole("region")).toBeInTheDocument()
  fireEvent.click(screen.getByRole("region"))
})
