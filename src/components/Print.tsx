import { Button } from "@chakra-ui/button"
import { Hide } from "@chakra-ui/react"
import ky from "ky"
import useTranslation from "next-translate/useTranslation"
import printJS from "print-js"

import { PrintIcon } from "~/components"
import { DownloadDealSheetRes } from "~/services/mytfo/types"

type PrintPropsType = {
  isMobileView?: boolean
  opportunityId: number
}

const Print = ({ isMobileView, opportunityId }: PrintPropsType) => {
  const { t } = useTranslation("opportunities")

  const PrintDealSheet = async () => {
    const response = await ky
      .post(`/api/client/documents/doc-center`, {
        json: {
          action: "downloadDealSheet",
          opportunityId: opportunityId,
        },
      })
      .json<DownloadDealSheetRes>()

    if (response?.isBlobExists) {
      printJS({
        printable: response.url,
        type: "pdf",
      })
    }
  }
  return (
    <Hide below="lgp">
      <Button
        variant="ghost"
        colorScheme="primary"
        flexShrink={0}
        alignSelf="flex-start"
        width="auto"
        padding="0px"
        size="md"
        fontWeight="500"
        me="28px"
        _hover={{
          padding: "inherit",
        }}
        _focus={{
          backgroundColor: "transparent",
        }}
        _active={{
          backgroundColor: "transparent",
        }}
        leftIcon={<PrintIcon />}
        isFullWidth={isMobileView || false}
        onClick={PrintDealSheet}
      >
        {t(`client.button.print`)}
      </Button>
    </Hide>
  )
}

export default Print
