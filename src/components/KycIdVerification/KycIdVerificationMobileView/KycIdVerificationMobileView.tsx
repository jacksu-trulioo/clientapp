import { Flex, HStack, Text } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import {
  IdBlurCorrect,
  IdBlurIncorrect,
  IdCornerCorrect,
  IdCornerIncorrect,
  IdOccupyCorrect,
  IdOccupyIncorrect,
} from "~/components"

const KycIdVerificationMobileView = () => {
  const { t } = useTranslation("kyc")
  const cardList = [
    {
      correctIcon: <IdBlurCorrect />,
      inCorrectIcon: <IdBlurIncorrect />,
      msg: t("idVerification.mobileViewMessages.bright"),
    },
    {
      correctIcon: <IdCornerCorrect />,
      inCorrectIcon: <IdCornerIncorrect />,
      msg: t("idVerification.mobileViewMessages.corner"),
    },
    {
      correctIcon: <IdOccupyCorrect />,
      inCorrectIcon: <IdOccupyIncorrect />,
      msg: t("idVerification.mobileViewMessages.blur"),
    },
  ]
  return (
    <Flex
      alignItems="flex-start"
      flexDirection="column"
      justifyContent="stretch"
    >
      {cardList.map((card, index) => (
        <HStack key={index} justifyContent="space-between" mb={6} spacing={6}>
          <HStack>
            {card.correctIcon}
            {card.inCorrectIcon}
          </HStack>
          <Text fontSize="sm">{card.msg}</Text>
        </HStack>
      ))}
      <Text>{t("idVerification.mobileViewMessages.allowedFormat")}</Text>
    </Flex>
  )
}

export default KycIdVerificationMobileView
