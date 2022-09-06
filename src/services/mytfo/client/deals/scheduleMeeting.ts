import ky from "ky"

import { ScheduleMeetingInput } from "~/services/mytfo/types"

const scheduleMeeting = async (
  httpClient: typeof ky,
  params: ScheduleMeetingInput,
) => {
  return httpClient
    .post("portfolio/meetings/schedule", {
      json: params,
    })
    .json()
}

export default scheduleMeeting
