import ky from "ky"

const getClientInsightDetails = async (
  httpClient: typeof ky,
  params: {
    id: string
    lang: string
  },
) => {
  try {
    const response = await httpClient.get(
      `${params.id}?cv=${process.env.NEXT_CLIENT_STORYBLOK_CV}&token=${process.env.NEXT_CLIENT_STORYBLOK_TOKEN}&language=${params.lang}`,
      { prefixUrl: process.env.NEXT_CLIENT_STORYBLOK_URL, headers: {} },
    )
    return response.json()
  } catch (error) {
    return error
  }
}

export default getClientInsightDetails
