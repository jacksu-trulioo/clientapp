import { useDisclosure } from "@chakra-ui/hooks"
import { BoxProps, Flex, HStack, Spacer } from "@chakra-ui/layout"
import {
  Button,
  ButtonGroup,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import {
  ContactUsModal,
  EmailIcon,
  GetHelpAction,
  WhatsAppIcon,
} from "~/components"
import siteConfig from "~/config"

interface FooterProps extends BoxProps {
  popover?: string | React.ReactNode
  popoverHeader?: string | React.ReactNode
  showScheduleCall?: boolean
}

export function Footer(props: React.PropsWithChildren<FooterProps>) {
  const { popover, popoverHeader, showScheduleCall = false } = props
  const { t } = useTranslation("common")
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { whatsAppUrl } = siteConfig

  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isDesktopView = !isMobileView
  return (
    <Flex as="footer" bgColor="gray.850" justifyContent="center" {...props}>
      <HStack
        w="full"
        px="9"
        py="6"
        {...(isMobileView && {
          px: "4",
          spacing: "4",
        })}
      >
        <GetHelpAction
          popover={popover}
          popoverHeader={popoverHeader}
          showScheduleCall={showScheduleCall}
        />

        <Spacer />

        {isDesktopView && (
          <ButtonGroup>
            <Button
              as="a"
              href={whatsAppUrl}
              target="_blank"
              variant="outline"
              colorScheme="primary"
              size="sm"
              fontSize="xs"
              leftIcon={<WhatsAppIcon w="4" h="4" />}
              textDecoration="none"
            >
              {t("help.button.whatsApp")}
            </Button>
            <Button
              variant="outline"
              onClick={onOpen}
              colorScheme="primary"
              size="sm"
              fontSize="xs"
              leftIcon={<EmailIcon w="4" h="4" />}
            >
              {t("help.button.email")}
            </Button>
          </ButtonGroup>
        )}

        {isMobileView && (
          <ButtonGroup>
            <IconButton
              as="a"
              href={whatsAppUrl}
              target="_blank"
              aria-label="Whatsapp Button"
              icon={<WhatsAppIcon w="4" h="4" />}
              colorScheme="primary"
              variant="outline"
              size="sm"
            />
            <IconButton
              aria-label="Email Button"
              icon={<EmailIcon w="4" h="4" />}
              colorScheme="primary"
              variant="outline"
              size="sm"
              onClick={onOpen}
            />
          </ButtonGroup>
        )}
      </HStack>

      <ContactUsModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  )
}

export default React.memo(Footer)
