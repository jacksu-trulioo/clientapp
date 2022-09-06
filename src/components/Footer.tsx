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

import { ContactUsModal, EmailIcon, GetHelpAction } from "~/components"
import { useUser } from "~/hooks/useUser"

interface FooterProps extends BoxProps {
  popover?: string | React.ReactNode
  popoverHeader?: string | React.ReactNode
  showScheduleCall?: boolean
  understood?: boolean
}

export function Footer(props: React.PropsWithChildren<FooterProps>) {
  const { popover, popoverHeader, showScheduleCall = false } = props
  const { user } = useUser()
  const { t } = useTranslation("common")
  const { isOpen, onOpen, onClose } = useDisclosure()

  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isDesktopView = !isMobileView

  return (
    <Flex
      as="footer"
      bgColor="gray.850"
      justifyContent="center"
      {...(props?.understood &&
        !user?.isFirstTimeLogin && {
          filter: "blur(1px)",
          opacity: "0.4",
          pointerEvents: "none",
        })}
      position="relative"
      bottom="0"
      // @ts-ignore
      {...props}
    >
      <HStack
        w="full"
        px="9"
        py="6"
        className="reactour__support"
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
