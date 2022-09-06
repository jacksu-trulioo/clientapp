import ky from "ky"

import { MyProposal } from "~/services/mytfo/types"

const getProposals = async (httpClient: typeof ky) => {
  return httpClient.get("user/proposals").json<MyProposal[]>()
}

export default getProposals
