import ky from "ky"

import { MyProposal } from "../types"

const getContactSummary = async (
  httpClient: typeof ky,
  params: { id: string },
) => {
  return httpClient.get(`user/summary/contact/${params.id}`).json<MyProposal>()
}
export default getContactSummary
