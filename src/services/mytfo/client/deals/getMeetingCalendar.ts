import ky from "ky"

import { MeetingCalendar, MeetingCalendarInput } from "~/services/mytfo/types"
const getMeetingCalendar = async (
  httpClient: typeof ky,
  params: MeetingCalendarInput,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await httpClient.post("portfolio/meetings/calendar", {
        json: params,
      })
      let response = (await data.json()) as MeetingCalendar
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
}
export default getMeetingCalendar
