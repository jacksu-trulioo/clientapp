import { useDisclosure } from "@chakra-ui/hooks"
import { Box, Button, Circle, HStack, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { GetSupportPopUp, QuestionIcon } from "~/components"

function GetHelpClientAction() {
  const { t } = useTranslation("common")

  const {
    isOpen: isPopupOpen,

    onClose: onPopupClose,
  } = useDisclosure()

  const router = useRouter()

  return (
    <HStack
      zIndex="1"
      onClick={() => {
        router.push("/client/schedule-meeting")
      }}
      mb={{ base: "27px", md: "0px" }}
      w={{ base: "100%", md: "auto" }}
      alignSelf="center"
      cursor="pointer"
    >
      <Circle size="10" bgColor="gray.800">
        <QuestionIcon w="5" h="5" color="primary.500" />
      </Circle>

      <Box fontSize="sm" ps="2">
        <Text color="#828282">{t("help.heading")}</Text>
        <GetSupportPopUp isOpen={isPopupOpen} onClose={onPopupClose} />
        <Button border="none" colorScheme="primary" variant="link" size="sm">
          <Text>{t("common:help.subheading")}</Text>
        </Button>
      </Box>
    </HStack>
  )
}

export default React.memo(GetHelpClientAction)
