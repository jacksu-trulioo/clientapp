import ky from "ky"

import { ProposalsStatus } from "~/services/mytfo/types"

const getProposalContactStatus = async (
  httpClient: typeof ky,
  params: { id: string },
) => {
  return httpClient
    .get(`user/proposals/status/contact/${params.id}`)
    .json<ProposalsStatus>()
}

export default getProposalContactStatus
