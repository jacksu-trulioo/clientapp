import ky from "ky"

import { InvestorProfileGoals } from "~/services/mytfo/types"

const updateContactProposal = async (
  httpClient: typeof ky,
  params: { id: string; data: InvestorProfileGoals },
) => {
  return httpClient
    .put(`user/proposals/contact/${params.id}`, {
      json: params.data,
    })
    .json<InvestorProfileGoals>()
}

export default updateContactProposal
