import { Button } from "@chakra-ui/button"
import { Box, Flex, Link, Text } from "@chakra-ui/layout"
import moment from "moment"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { useState } from "react"

import { NewEmailIcon, NewPhoneIcon } from "~/components"
import { useUser } from "~/hooks/useUser"
import {
  openScheduleMeetingTime,
  tappedRMEmail,
  tappedRMPhone,
} from "~/utils/googleEventsClient"
import { clientUniEvent } from "~/utils/gtag"

type props = {
  mandateId: string
  manager?: {
    phone?: string
    email?: string
    name?: string
  }
}

function MeetingBox({ mandateId, manager }: props) {
  const { t, lang } = useTranslation("clientDashboard")
  const [isButtonLoading, setIsButtonLoading] = useState(false)
  const router = useRouter()
  const { user } = useUser()

  return (
    <Flex
      flexDir={{ base: "column", md: "row" }}
      justifyContent="space-between"
      align="center"
      mb="40px"
    >
      <Box
        maxW={{ lgp: "85%", base: "100%" }}
        w={{ lgp: "50%", base: "100%" }}
        mr={{ md: lang == "ar" ? "40px" : "4", base: "0" }}
      >
        <Text fontSize="30px" mb="8px" lineHeight="36px">
          {t("heading", { clientId: mandateId })}
        </Text>
        <Text
          color="gray.500"
          fontSize={{ base: "14px", md: "14px", lgp: "18px" }}
          fontWeight="400"
          lineHeight="120%"
        >
          {t("description")}
        </Text>
      </Box>
      {manager?.name ? (
        <Box
          maxW={{ lgp: "407px", md: "100%", sm: "100%", base: "100%" }}
          p="20px"
          m={{ base: "50px 0 15px", md: "12px 0px 0px 0px", lgp: "0" }}
          padding="24px"
          bgColor="gunmetal.500"
          borderRadius="8px"
          width={{ base: "387px", md: "390px", sm: "100%" }}
        >
          <Flex flexDir="column">
            <Text
              fontSize={{ lgp: "18px", base: "14px" }}
              fontWeight="700"
              m="0 0 10px 0"
              lineHeight="120%"
              color="white"
            >
              {t("relationshipManager.title")} {manager?.name}
            </Text>
            <Flex
              justify="space-between"
              flexDir={{
                base: "column",
                md: "column",
                lgp: lang.includes("ar") ? "row-reverse" : "row",
              }}
              ontWeight="400"
              mt="8px"
            >
              <Link
                href={`tel:${manager?.phone}`}
                target="_blank"
                color="primary"
                fontSize={{ base: "14px", md: "14px" }}
                fontWeight="400"
                lineHeight="120%"
                display="flex"
                alignItems="center"
                mb={{ base: "10px", md: "10px", lgp: "0px" }}
                _focus={{ boxShadow: "none" }}
                onClick={() => {
                  clientUniEvent(
                    tappedRMPhone,
                    manager?.name as string,
                    user?.mandateId as string,
                    user?.email as string,
                  )
                }}
              >
                <NewPhoneIcon
                  w="14px"
                  h="14px"
                  m="0px 5px 0px 0px"
                  alignSelf="center"
                />
                <Box as="span" dir="ltr" display="inlineBlock">
                  {manager?.phone}
                </Box>
              </Link>
              <Link
                href={`mailto:${manager?.email}`}
                target="_blank"
                color="primary"
                fontSize="14px"
                fontWeight="400"
                lineHeight="120%"
                display="flex"
                alignItems="center"
                _focus={{ boxShadow: "none" }}
                onClick={() => {
                  clientUniEvent(
                    tappedRMEmail,
                    manager?.name as string,
                    user?.mandateId as string,
                    user?.email as string,
                  )
                }}
              >
                <NewEmailIcon w="16px" h="14px" m="0px 5px 0px 0px" />
                {manager?.email}
              </Link>
            </Flex>
            <Button
              padding="10px 12px"
              outline="var(--chakra-colors-primary-500)"
              border="1px solid var(--chakra-colors-primary-500)"
              boxShadow="0px 0px 4px rgba(0, 0, 0, 0.75)"
              borderRadius="2px"
              marginTop="24px"
              fontWeight="400"
              bg="none"
              _hover={{ backgroundColor: "pineapple.800", boxShadow: "none" }}
              _active={{ backgroundColor: "pineapple.700" }}
              isLoading={isButtonLoading}
              onClick={() => {
                setIsButtonLoading(true)
                router.push("/client/schedule-meeting")
                clientUniEvent(
                  openScheduleMeetingTime,
                  moment().format("LT"),
                  user?.mandateId as string,
                  user?.email as string,
                )
              }}
            >
              <Text
                lineHeight="120%"
                fontWeight="400"
                color="primary.500"
                fontSize="14px"
              >
                {t("relationshipManager.button")}
              </Text>
            </Button>
          </Flex>
        </Box>
      ) : (
        false
      )}
    </Flex>
  )
}

export default MeetingBox
