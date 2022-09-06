import ky from "ky"

import { MeetingCalendar, MeetingCalendarInput } from "~/services/mytfo/types"

const getMeetingCalendar = async (
  httpClient: typeof ky,
  params: MeetingCalendarInput,
) => {
  return httpClient
    .post("portfolio/meetings/calendar", {
      json: params,
    })
    .json<MeetingCalendar>()
}

export default getMeetingCalendar
