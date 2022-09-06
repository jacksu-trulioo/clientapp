import { Box, HStack, StackDivider, Text } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React, { useCallback, useMemo, useState } from "react"

import AssetCardGroup from "../../Assets/AssetCardGroup/AssetCardGroup"
import BankIcon from "../../Icon/BankIcon"
import { useStepper } from "../Stepper"
import { AssetOrLiability } from "../types"
import StepLayout from "./StepLayout"

type Props = {
  assets?: AssetOrLiability[]
  liabilities?: AssetOrLiability[]
}

type TabItemProps = {
  active: boolean
  onClick: React.Dispatch<React.SetStateAction<boolean>>
}

const iconsMap: Record<string, React.ReactNode> = {
  bankAccount: <BankIcon opacity={0.5} h={4} w={4} />,
}

const TabItem: React.FC<TabItemProps> = ({ active, children, onClick }) => {
  return (
    <Box cursor="pointer" onClick={() => onClick(true)} overflow="hidden" h={8}>
      <Text
        variant="h6"
        fontWeight="bold"
        color={active ? "primary.500" : "gray.600"}
        mb={2}
      >
        {children}
      </Text>
      <Box
        bg={active ? "primary.500" : "transparent"}
        w="full"
        h={2}
        borderRadius="md"
      />
    </Box>
  )
}

const AddAssetOrLiability: React.FC<Props> = ({
  assets = [],
  liabilities = [],
}) => {
  const { t } = useTranslation("wealthAddAssets")
  const { next, setAssetOrLiability } = useStepper()
  const [tab, setTab] = useState<"assets" | "liabilities">("assets")

  const getOnClick = useCallback(
    (asset: AssetOrLiability) => {
      return () => {
        next()
        setAssetOrLiability(asset)
      }
    },
    [next, setAssetOrLiability],
  )

  const mappedItems = useMemo(() => {
    const items = tab === "liabilities" ? liabilities : assets
    return items.map((item) => ({
      ...item,
      icon: iconsMap[item.id] || iconsMap.bankAccount,
      onClick: getOnClick(item),
    }))
  }, [assets, getOnClick, liabilities, tab])

  return (
    <StepLayout
      title={t("steps.addAssetsOrLiabilities.title")}
      description={t("steps.addAssetsOrLiabilities.description")}
    >
      <Box>
        <HStack
          mb={4}
          divider={<StackDivider borderColor="transparent" w={6} />}
        >
          <TabItem active={tab === "assets"} onClick={() => setTab("assets")}>
            {t("steps.addAssetsOrLiabilities.header.assets")}
          </TabItem>
          <TabItem
            active={tab === "liabilities"}
            onClick={() => setTab("liabilities")}
          >
            {t("steps.addAssetsOrLiabilities.header.liabilities")}
          </TabItem>
        </HStack>
        <AssetCardGroup assets={mappedItems} />
      </Box>
    </StepLayout>
  )
}

AddAssetOrLiability.displayName = "AddAssetOrLiability"

export default AddAssetOrLiability
