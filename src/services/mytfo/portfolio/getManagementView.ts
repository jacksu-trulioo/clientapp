import ky from "ky"

import { ManagementView } from "~/services/mytfo/types"

const getManagementView = async (
  httpClient: typeof ky,
  params: { id: string },
) => {
  return httpClient
    .get(`portfolio/insight/management-views/${params.id}`)
    .json<ManagementView>()
}

export default getManagementView
