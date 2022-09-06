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

import { Card, CardContent, CardProps, InfoIcon } from "~/components"

interface StepInfoCardProps extends CardProps {
  heading: string
  description?: string | React.ReactNode
  infoIcon?: boolean
}

function StepInfoCard(props: React.PropsWithChildren<StepInfoCardProps>) {
  const { t, lang } = useTranslation()
  const { onOpen, onClose, isOpen } = useDisclosure()
  const { heading, description, infoIcon = true } = props

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
      <Card bg="gray.800" borderRadius="6px">
        <CardContent aria-label="About LH" role={"group"} p="4">
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
          <ModalCloseButton
            onClick={onClose}
            style={{
              left: lang.includes("ar") ? "0" : "auto",
              right: lang.includes("ar") ? "auto" : "0",
            }}
          />
          <ModalHeader pb="0" fontSize="24px" fontWeight="400" mb="10px">
            {heading}
          </ModalHeader>
          <ModalBody
            pt="="
            pb="0"
            fontSize="14px"
            fontWeight="400"
            color="#828282"
            whiteSpace="pre-line"
          >
            {description}
          </ModalBody>

          <ModalFooter mt="42px" pt="0" pb="26px">
            <Button
              fontSize="14px"
              fontWeight="600"
              color="#1A1A1A"
              variant="ghost"
              onClick={onClose}
              backgroundColor="#B99855"
            >
              {t("common:client.errors.noDate.button")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default React.memo(StepInfoCard)
