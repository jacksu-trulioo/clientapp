import ky from "ky"

import { ProposalsStatus } from "~/services/mytfo/types"

const getProposalsStatus = async (httpClient: typeof ky) => {
  return httpClient.get("user/proposals/status").json<ProposalsStatus>()
}

export default getProposalsStatus
