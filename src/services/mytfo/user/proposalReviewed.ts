import ky from "ky"

const proposalReviewed = async (httpClient: typeof ky) => {
  return httpClient.patch("user/contact/proposal-reviewed")
}

export default proposalReviewed
