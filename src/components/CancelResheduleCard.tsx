import {
  Button,
  Circle,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useBreakpointValue,
  useToast,
  VStack,
} from "@chakra-ui/react"
import ky from "ky"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import { mutate } from "swr"

import { MeetingDetails } from "~/services/mytfo/types"

import { CalendarIcon, Card, CardContent, MeetingChatIcon } from "."

interface CancelRescheduleCardProps {
  meetingDetail: MeetingDetails
}

const CancelRescheduleCard = (props: CancelRescheduleCardProps) => {
  const { meetingDetail } = props
  const { t } = useTranslation("home")
  const [showCancelModal, setShowCancelModal] = React.useState(false)
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const toast = useToast()

  const handleUpdateClick = () => {
    router.push(`/schedule-meeting?id=${meetingDetail?.meetingId}`)
  }
  const handleCancelClick = () => {
    setShowCancelModal(true)
  }
  const closeCancelModal = () => {
    setShowCancelModal(false)
  }
  const handleBackClick = () => {
    setShowCancelModal(false)
  }
  const handleModalCancelClick = async () => {
    try {
      await ky.post("/api/portfolio/meetings/cancel", {
        json: {
          eventId: meetingDetail?.meetingId,
        },
      })
      await mutate<MeetingDetails>(
        "/api/portfolio/meetings/latest-meeting-detail",
      )
      setShowCancelModal(false)
    } catch (error) {
      const meetingUpdateToastID = "meetingUpdateToastID"
      if (!toast.isActive(meetingUpdateToastID)) {
        toast({
          id: meetingUpdateToastID,
          title: t("toast.meetingUpdateToast.error.title"),
          variant: "subtle",
          status: "error",
          isClosable: true,
          position: "bottom",
        })
      }
    }
  }
  return (
    <>
      <Card w="full" mb="12">
        <CardContent pb="4">
          <Flex
            direction={{ base: "column", md: "row" }}
            py="1"
            alignItems="center"
          >
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
            <VStack
              alignItems={isMobileView ? "center" : "flex-start"}
              ms="4"
              spacing="1"
              {...(isMobileView && { mt: 4 })}
            >
              <Text color="gray.400" fontSize="xs" textAlign="center">
                {t("cancelReschedule.label.appointment")} {meetingDetail?.name}:
              </Text>
              <Text
                color="white"
                fontSize={{ base: "sm", md: "md" }}
                {...(isMobileView && { textAlign: "center", maxW: "230px" })}
                textAlign="center"
              >
                {meetingDetail?.date} {t("cancelReschedule.label.at")}{" "}
                {meetingDetail?.time}
              </Text>
            </VStack>
            <Flex
              flex="1"
              justifyContent="flex-end"
              {...(isMobileView && { mt: 6 })}
            >
              <Button
                colorScheme="primary"
                fontSize="sm"
                variant="outline"
                px="12"
                onClick={handleCancelClick}
              >
                {t("cancelReschedule.button.cancel")}
              </Button>
              <Button
                colorScheme="primary"
                leftIcon={<CalendarIcon w="4" h="4" />}
                fontSize="sm"
                variant="solid"
                ms="4"
                px="4"
                onClick={handleUpdateClick}
              >
                {t("cancelReschedule.button.update")}
              </Button>
            </Flex>
          </Flex>
        </CardContent>
      </Card>
      <Modal
        isOpen={showCancelModal}
        onClose={closeCancelModal}
        size={isMobileView ? "xs" : "2xl"}
        autoFocus={false}
        returnFocusOnClose={false}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody mt="12" p="0">
            <Heading mb="4" color="white" textAlign="center" size="lg" mt="6">
              {t("cancelReschedule.modal.cancelTitle")}
            </Heading>
            <Text
              color="gray.500"
              mb="10"
              textAlign="center"
              fontSize={{ base: "sm", md: "md" }}
              mt="10"
              maxW="md"
              mx="auto"
            >
              {t("cancelReschedule.modal.cancelDescription")}
            </Text>
            <Flex flex="1" justifyContent="center" mb="20">
              <Button
                colorScheme="primary"
                fontSize="sm"
                variant="outline"
                px="12"
                onClick={handleBackClick}
              >
                {t("cancelReschedule.button.back")}
              </Button>
              <Button
                colorScheme="primary"
                fontSize="sm"
                variant="solid"
                ms="4"
                px="4"
                onClick={handleModalCancelClick}
              >
                {t("cancelReschedule.button.yesCancel")}
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
export default CancelRescheduleCard
