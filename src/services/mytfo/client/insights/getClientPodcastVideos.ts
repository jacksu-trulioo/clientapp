import ky from "ky"

const getClientPodcastVideos = async (
  httpClient: typeof ky,
  language: string,
) => {
  try {
    const response = await httpClient.get(
      `?cv=${process.env.NEXT_CLIENT_STORYBLOK_CV}&starts_with=insights/clientappvideos&token=${process.env.NEXT_CLIENT_STORYBLOK_TOKEN}&language=${language}`,
      { prefixUrl: process.env.NEXT_CLIENT_STORYBLOK_URL, headers: {} },
    )

    return response.json()
  } catch (error) {
    return error
  }
}

export default getClientPodcastVideos
