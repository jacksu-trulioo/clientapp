import ky from "ky"

const getOnBoard = async (
  httpClient: typeof ky,
  params: { email: string; data: string; ttl: string },
) => {
  return httpClient
    .get(
      `auth/Onboard/verify-email?email=${params.email}&data=${params.data}&ttl=${params.ttl}`,
    )
    .json()
}

export default getOnBoard
