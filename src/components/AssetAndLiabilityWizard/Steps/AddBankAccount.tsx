import { StackDivider, VStack } from "@chakra-ui/react"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { useCallback, useMemo } from "react"

import AssetCard from "../../Assets/AssetCard/AssetCard"
import RightIcon from "../../Icon/ChevronsRightIcon"
import LockIcon from "../../Icon/LockIcon"
import { useStepper } from "../Stepper"
import { BankAccountType } from "../types"
import StepLayout from "./StepLayout"

type Props = {
  bankAccountTypes: BankAccountType[]
}

const iconsMap: Record<string, React.ReactNode> = {
  secure: <LockIcon opacity={0.5} h={6} w={6} />,
  manual: <LockIcon opacity={0.5} h={6} w={6} />,
}

const AddBankAccount: React.FC<Props> = ({ bankAccountTypes = [] }) => {
  const { t } = useTranslation("wealthAddAssets")
  const { next, setBankAccountType } = useStepper()
  const { locale } = useRouter()
  const iconStyle = locale === "ar" ? { transform: "rotate(180deg)" } : {}

  const getOnClick = useCallback(
    (bankAccountType: BankAccountType) => {
      return () => {
        next()
        setBankAccountType(bankAccountType)
      }
    },
    [next, setBankAccountType],
  )

  const mappedBankAccountTypes = useMemo(() => {
    return bankAccountTypes.map((asset) => ({
      ...asset,
      icon: iconsMap[asset.id] || iconsMap.secure,
      onClick: getOnClick(asset),
    }))
  }, [bankAccountTypes, getOnClick])

  return (
    <StepLayout
      title={t("steps.addBankAccount.title")}
      description={t("steps.addBankAccount.description")}
    >
      <VStack divider={<StackDivider borderColor="transparent" />}>
        {mappedBankAccountTypes.map((account) => (
          <AssetCard
            key={account.id}
            ctaIcon={
              <RightIcon color="primary.500" h={6} w={6} style={iconStyle} />
            }
            ctaPosition="center"
            h="m"
            {...account}
          />
        ))}
      </VStack>
    </StepLayout>
  )
}

AddBankAccount.displayName = "AddBankAccount"

export default AddBankAccount
