import ky from "ky"

import { MeetingDetails } from "../types"
const getMeetingDetails = async (httpClient: typeof ky) => {
  return httpClient
    .get("portfolio/meetings/banner-detail")
    .json<MeetingDetails>()
}
export default getMeetingDetails
