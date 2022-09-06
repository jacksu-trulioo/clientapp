import ky from "ky"

import { QualificationStatus } from "~/services/mytfo/types"

const getQualificationsStatus = async (httpClient: typeof ky) => {
  return httpClient
    .get("user/qualifications/status")
    .json<QualificationStatus>()
}

export default getQualificationsStatus
