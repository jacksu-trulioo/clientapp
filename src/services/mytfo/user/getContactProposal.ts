import ky from "ky"

import { MyProposal } from "../types"

const getContactProposal = async (
  httpClient: typeof ky,
  params: { id: string },
) => {
  return httpClient
    .get(`user/proposals/contact/${params.id}`)
    .json<MyProposal>()
}
export default getContactProposal
