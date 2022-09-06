import ky from "ky"

import { CancelMeetingInput, MeetingInfo } from "~/services/mytfo/types"

const getMeetingInfo = async (
  httpClient: typeof ky,
  params: CancelMeetingInput,
) => {
  return httpClient
    .post("portfolio/meetings/details", {
      json: params,
    })
    .json<MeetingInfo>()
}

export default getMeetingInfo
