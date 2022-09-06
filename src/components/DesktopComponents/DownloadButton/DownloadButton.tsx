import { Button } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment } from "react"

import { DownloadIcon } from "~/components"

type DownloadButtonProps = {
  onDownloadClick: Function
}

const DownloadButton = ({ onDownloadClick }: DownloadButtonProps) => {
  const { t } = useTranslation("common")

  return (
    <Fragment>
      <Button
        data-testid="download-btn"
        variant="ghost"
        colorScheme="primary"
        flexShrink={0}
        alignSelf="flex-start"
        width="auto"
        padding="0px"
        size="md"
        fontWeight="500"
        _hover={{
          padding: "inherit",
        }}
        _focus={{
          backgroundColor: "transparent",
        }}
        _active={{
          backgroundColor: "transparent",
        }}
        leftIcon={<DownloadIcon mt="-2px" />}
        onClick={async () => {
          await onDownloadClick()
        }}
      >
        {t("button.download")}
      </Button>
    </Fragment>
  )
}

export default DownloadButton
