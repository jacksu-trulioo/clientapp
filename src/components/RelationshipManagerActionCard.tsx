import { Box, Circle, Flex, Text, VStack } from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/media-query"
import { Button, Portal } from "@chakra-ui/react"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import {
  CalendarIcon,
  Card,
  CardContent,
  MailIcon,
  MeetingChatIcon,
} from "~/components"
import { RelationshipManager } from "~/services/mytfo/types"

interface RelationshipManagerActionCardProps
  extends Pick<RelationshipManager, "manager"> {}

export default function RelationshipManagerActionCard(
  props: RelationshipManagerActionCardProps,
) {
  const { manager } = props

  const { t } = useTranslation("home")

  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isDesktopView = !isMobileView

  const [showMessagingButton, setShowMessagingButton] = React.useState(false)

  const handleClick = (e: React.SyntheticEvent) => {
    e.preventDefault()
    router.push("/schedule-meeting")
  }

  const sendMessageHandler = (event: React.SyntheticEvent) => {
    event.preventDefault()
    router.push(`mailto:${manager?.email}`)
  }

  return isDesktopView ? (
    <Card w="full" mb="12">
      <CardContent pb="4">
        <Flex direction="row">
          <Circle
            size="10"
            position="relative"
            _before={{
              content: '""',
              bg: "secondary.800",
              opacity: "0.2",
              position: "absolute",
              width: "full",
              height: "full",
              borderRadius: "full",
            }}
          >
            <MeetingChatIcon color="secondary.500" w="5" h="5" />
          </Circle>

          <VStack alignItems="flex-start" ms="4" spacing="0">
            <Text color="gray.400" fontSize="sm">
              {t("cta.relationshipManager.title")}
            </Text>
            <Text color="white" fontSize="lg">
              {`${manager?.firstName} ${manager?.lastName}`}
            </Text>
          </VStack>

          <Flex flex="1" justifyContent="flex-end">
            <Button
              colorScheme="primary"
              leftIcon={<MailIcon w="4" h="4" />}
              fontSize="sm"
              variant="outline"
              isFullWidth={isMobileView}
              onClick={sendMessageHandler}
            >
              {t("cta.relationshipManager.button.message")}
            </Button>

            <Button
              colorScheme="primary"
              leftIcon={<CalendarIcon w="4" h="4" />}
              fontSize="sm"
              variant="outline"
              isFullWidth={isMobileView}
              ms="4"
              onClick={handleClick}
            >
              {t("cta.relationshipManager.button.meeting")}
            </Button>
          </Flex>
        </Flex>
      </CardContent>
    </Card>
  ) : (
    <Portal>
      <Card w="full" mb="12" bgColor="gray.850" mx="4">
        <CardContent pb="4">
          <Flex>
            {showMessagingButton && (
              <Circle
                size="10"
                position="relative"
                _before={{
                  content: '""',
                  bg: "secondary.800",
                  opacity: "0.2",
                  position: "absolute",
                  width: "full",
                  height: "full",
                  borderRadius: "full",
                }}
              >
                <MeetingChatIcon color="secondary.500" w="5" h="5" />
              </Circle>
            )}
            <Flex
              direction="column"
              spacing="0"
              {...(showMessagingButton && { ms: "4" })}
            >
              <Text color="gray.400" fontSize="xs">
                {t("cta.relationshipManager.title")}
              </Text>
              <Text color="white" fontSize="sm">
                {`${manager?.firstName} ${manager?.lastName}`}
              </Text>
            </Flex>
            {!showMessagingButton && (
              <Flex flex="1" justifyContent="flex-end">
                <Button
                  colorScheme="primary"
                  fontSize="sm"
                  variant="outline"
                  ms="4"
                  onClick={() => setShowMessagingButton(true)}
                >
                  {t("cta.relationshipManager.button.contact")}
                </Button>
              </Flex>
            )}
          </Flex>
          {showMessagingButton && (
            <Box mt="4">
              <Button
                colorScheme="primary"
                fontSize="sm"
                variant="outline"
                leftIcon={<MailIcon w="4" h="4" />}
                isFullWidth={isMobileView}
                onClick={sendMessageHandler}
              >
                {t("cta.relationshipManager.button.message")}
              </Button>
              <Button
                colorScheme="primary"
                fontSize="sm"
                variant="outline"
                isFullWidth={isMobileView}
                mt="2"
                leftIcon={<CalendarIcon w="4" h="4" />}
                onClick={handleClick}
              >
                {t("cta.relationshipManager.button.meeting")}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Portal>
  )
}
