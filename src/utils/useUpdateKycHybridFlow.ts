import { useToast } from "@chakra-ui/react"
import ky from "ky"
import useTranslation from "next-translate/useTranslation"
import { mutate } from "swr"

import { KycHybridFlowFlag } from "~/services/mytfo/types"

export default function useUpdateKycHybridFlow() {
  const toast = useToast()
  const { t } = useTranslation("kyc")
  async function updateKycHybridFlow(isHybridFlow: boolean) {
    try {
      const kyResponse = await ky
        .put("/api/user/kyc/hybrid-flow", {
          json: { isHybridFlow },
        })
        .json<KycHybridFlowFlag>()

      await mutate<KycHybridFlowFlag>("/api/user/kyc/hybrid-flow", kyResponse)

      return kyResponse
    } catch (e) {
      const updateKycHybridId = "updateKycHybridId"
      if (!toast.isActive(updateKycHybridId)) {
        toast({
          id: "kycDocStatusId",
          title: t("documentVerification.toast.error.title"),
          variant: "subtle",
          status: "error",
          isClosable: true,
          position: "bottom",
        })
      }
    }
  }

  return { updateKycHybridFlow }
}
