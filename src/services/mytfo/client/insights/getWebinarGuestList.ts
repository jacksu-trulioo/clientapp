import ky from "ky"

const getWebinarGuestList = async (
  httpClient: typeof ky,
  params: {
    guest: string
    lang: string
  },
) => {
  try {
    const response = await httpClient.get(
      `${params.guest}?cv=${process.env.NEXT_CLIENT_STORYBLOK_CV}&token=${process.env.NEXT_CLIENT_STORYBLOK_TOKEN}&language=${params.lang}&find_by=uuid`,
      { prefixUrl: process.env.NEXT_CLIENT_STORYBLOK_URL, headers: {} },
    )
    return response.json()
  } catch (error) {
    return error
  }
}

export default getWebinarGuestList
