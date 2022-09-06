import ky from "ky"

const postProposals = async (httpClient: typeof ky) => {
  return httpClient.post("user/proposals").json()
}

export default postProposals
