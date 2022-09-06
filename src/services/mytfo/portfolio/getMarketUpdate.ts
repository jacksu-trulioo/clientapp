import ky from "ky"

const getMarketUpdate = async (
  httpClient: typeof ky,
  params: { id: string },
) => {
  const result = await httpClient.get(
    `portfolio/insight/market-updates/${params.id}`,
  )
  return result.json()
}

export default getMarketUpdate
