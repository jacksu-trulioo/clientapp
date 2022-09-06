import { Text } from "@chakra-ui/layout"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { InvestorProfileWizard } from "~/components"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

function InvestorProfileScreen() {
  const router = useRouter()
  const { t } = useTranslation("proposal")

  return (
    <InvestorProfileWizard
      headerLeft={
        <Text color="gray.400" fontSize="md">
          {t("chapterSelection.chapterOne.stepper.title")}
        </Text>
      }
      onCompleted={() => router.push("/opportunities/unlock/completed")}
    />
  )
}

export default withPageAuthRequired(InvestorProfileScreen)
