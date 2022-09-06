import { Box, Image, Text } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React, { useState } from "react"

type DealGalleryProps = {
  largeImageURL?: string
  smallImage1URL?: string
  smallImage2URL?: string
}

const DealGallery = ({
  largeImageURL,
  smallImage1URL,
  smallImage2URL,
}: DealGalleryProps) => {
  const { t } = useTranslation("investmentDetail")
  const [isShowLargeImage, setIsShowLargeImage] = useState(true)
  const [isShowMediumImage, setIsShowMediumImage] = useState(true)
  const [isShowSmallImage, setIsShowSmallImage] = useState(true)

  if (isShowLargeImage || isShowMediumImage || isShowSmallImage) {
    return (
      <Box
        aria-label="Gallery"
        role={"contentinfo"}
        mb={{ base: "48px", lgp: "120px", md: "64px" }}
      >
        <Text fontSize="20px" fontWeight="400" color="primary.500">
          {t("gallery.title")}
        </Text>
        <Box
          w={{ base: "300px", lgp: "700px", md: "600px" }}
          d="flex"
          flexWrap="wrap"
        >
          {largeImageURL && isShowLargeImage ? (
            <Image
              m={{
                base: "20px auto",
                lgp: "20px 20px 20px 0",
                md: "20px 20px 20px 0",
              }}
              w="250px"
              onError={() => {
                setIsShowLargeImage(false)
              }}
              src={largeImageURL}
              alt="Large Image"
            />
          ) : (
            false
          )}

          {smallImage1URL && isShowMediumImage ? (
            <Image
              m={{
                base: "20px auto",
                lgp: "20px 20px 20px 0",
                md: "20px 20px 20px 0",
              }}
              w="250px"
              src={smallImage1URL}
              alt="Medium Image"
              onError={() => {
                setIsShowMediumImage(false)
              }}
            />
          ) : (
            false
          )}

          {smallImage2URL && isShowSmallImage ? (
            <Image
              m={{
                base: "20px auto",
                lgp: "20px 20px 20px 0",
                md: "20px 20px 20px 0",
              }}
              w="250px"
              src={smallImage2URL}
              alt="Small Image"
              onError={() => {
                setIsShowSmallImage(false)
              }}
            />
          ) : (
            false
          )}
        </Box>
      </Box>
    )
  } else {
    return <></>
  }
}

export default DealGallery
