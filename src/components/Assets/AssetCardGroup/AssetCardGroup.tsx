import { SimpleGrid } from "@chakra-ui/react"

import AssetCard, { AssetCardProps } from "../AssetCard/AssetCard"

type Props = {
  assets: AssetCardProps[]
}

const AssetCardGroup = ({ assets }: Props) => {
  return (
    <SimpleGrid
      columns={{
        sm: 1,
        md: 2,
      }}
      spacing={10}
    >
      {assets.map((asset) => (
        <AssetCard key={asset.title} {...asset} />
      ))}
    </SimpleGrid>
  )
}

AssetCardGroup.displayName = "AssetCardGroup"

export default AssetCardGroup
