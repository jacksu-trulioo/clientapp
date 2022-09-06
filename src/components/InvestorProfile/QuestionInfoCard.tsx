import { Button } from "@chakra-ui/button"
import { Box, Heading, Stack, Text } from "@chakra-ui/layout"
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal"
import { useBreakpointValue, useDisclosure } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { Card, CardContent, CardProps, InfoIcon } from ".."

interface QuestionInfoCardProps extends CardProps {
  heading?: string
  description?: string | React.ReactNode
  infoIcon?: boolean
}

function QuestionInfoCard(
  props: React.PropsWithChildren<QuestionInfoCardProps>,
) {
  const { t } = useTranslation()
  const { onOpen, onClose, isOpen } = useDisclosure()
  const { heading, description, infoIcon = false } = props

  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isDesktopView = !isMobileView

  const renderDescription = (
    <Box mt="4">
      {typeof description === "string" ? (
        <Text fontSize={{ base: "md", md: "xs" }} color="gray.400">
          {description}
        </Text>
      ) : (
        description
      )}
    </Box>
  )

  return (
    <>
      <Card bg="gray.800">
        <CardContent p="4">
          <Stack isInline alignItems="center">
            {infoIcon && <InfoIcon color="primary.500" w={6} h={6} />}

            <Heading
              fontSize="sm"
              {...(isMobileView && {
                textDecoration: "underline",
                onClick: onOpen,
                cursor: "pointer",
              })}
            >
              {heading}
            </Heading>
          </Stack>

          {isDesktopView && renderDescription}
        </CardContent>
      </Card>

      <Modal
        onClose={onClose}
        size="xs"
        isOpen={isOpen}
        isCentered={true}
        autoFocus={false}
        returnFocusOnClose={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton onClick={onClose} />
          <ModalHeader>{heading}</ModalHeader>
          <ModalBody>{description}</ModalBody>

          <ModalFooter>
            <Button colorScheme="primary" variant="ghost" onClick={onClose}>
              {t("common:button.cancel")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default React.memo(QuestionInfoCard)
