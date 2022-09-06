import ky from "ky"

import { CancelMeetingInput } from "../types"

const cancelMeeting = async (
  httpClient: typeof ky,
  params: CancelMeetingInput,
) => {
  return httpClient
    .post("portfolio/meetings/cancel", {
      json: params,
    })
    .json()
}

export default cancelMeeting
