import ky from "ky"

import { AcceptProposal } from "~/services/mytfo/types"

const getAcceptedProposal = async (httpClient: typeof ky) => {
  return httpClient.get("user/proposals/accept").json<AcceptProposal>()
}

export default getAcceptedProposal
