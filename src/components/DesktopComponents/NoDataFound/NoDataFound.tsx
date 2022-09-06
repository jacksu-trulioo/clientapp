import { Box, Text } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"

import { NoDataFoundIcon } from "~/components"

type DesktopTable = {
  isHeader?: boolean
  isIcon?: boolean
  isDescription?: boolean
}

const NoDataFound = ({ isIcon, isHeader, isDescription }: DesktopTable) => {
  const { t } = useTranslation("common")
  return (
    <>
      {isIcon ? (
        <Box textAlign="center">
          <NoDataFoundIcon />
        </Box>
      ) : (
        false
      )}
      {isHeader ? (
        <Text
          fontWeight="400"
          fontSize="26px"
          lineHeight="120%"
          textAlign="center"
          color="contrast.200"
          mt="24px"
        >
          {t("client.notFound.title")}
        </Text>
      ) : (
        false
      )}
      {isDescription ? (
        <Text
          fontWeight="400"
          fontSize="18px"
          lineHeight="120%"
          textAlign="center"
          color="gray.400"
          m="4px 0px"
        >
          {t("client.notFound.description")}
        </Text>
      ) : (
        false
      )}
    </>
  )
}

export default NoDataFound
