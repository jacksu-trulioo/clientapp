import ky from "ky"

import { AcceptProposal } from "../types"

const submitAcceptedProposal = async (
  httpClient: typeof ky,
  params: AcceptProposal,
) => {
  return httpClient
    .post("user/proposals/accept", {
      json: params,
    })
    .json()
}

export default submitAcceptedProposal
