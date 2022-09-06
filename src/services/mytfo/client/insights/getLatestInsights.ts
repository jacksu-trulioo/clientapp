import ky from "ky"

const getLatestInsights = async (httpClient: typeof ky, language: string) => {
  try {
    const response = await httpClient.get(
      `?starts_with=insights&token=${process.env.NEXT_CLIENT_STORYBLOK_TOKEN}&language=${language}`,
      { prefixUrl: process.env.NEXT_CLIENT_STORYBLOK_URL, headers: {} },
    )

    return response.json()
  } catch (error) {
    return error
  }
}

export default getLatestInsights
