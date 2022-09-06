import ky from "ky"

import { ScheduleMeetingInput } from "~/services/mytfo/types"

const updateScheduledMeeting = async (
  httpClient: typeof ky,
  params: ScheduleMeetingInput,
) => {
  return httpClient
    .put("portfolio/meetings/update", {
      json: params,
    })
    .json()
}

export default updateScheduledMeeting
