import ky from "ky"

import { RelationshipManager } from "../types"

const getRelationshipManager = async (
  httpClient: typeof ky,
  params: { id: string },
) => {
  return httpClient
    .get(`user/summary/relationship-manager/${params.id}`)
    .json<RelationshipManager>()
}
export default getRelationshipManager
