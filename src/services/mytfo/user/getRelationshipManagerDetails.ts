import ky from "ky"

import { RelationshipManager } from "~/services/mytfo/types"

const getRelationshipManagerDetails = async (httpClient: typeof ky) => {
  return httpClient.get("user/relationship-manager").json<RelationshipManager>()
}

export default getRelationshipManagerDetails
