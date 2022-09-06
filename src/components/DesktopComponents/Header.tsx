import {
  Button,
  chakra,
  Container,
  Flex,
  HTMLChakraProps,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react"
import NextLink from "next/link"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import {
  BackButton,
  CaretDownIcon,
  CaretRightIcon,
  ClientLanguageSwitch,
  FeedbackModal,
  GlossaryIcon,
  Link,
  LogoutIcon,
} from "~/components"
import siteConfig from "~/config"
import { useUser } from "~/hooks/useUser"
import { FeedbackSubmissionScreen } from "~/services/mytfo/types"
import {
  getFeedbackCookieStatus,
  setFeedbackCookieStatus,
} from "~/utils/clientUtils/feedbackCookieUtilities"

export interface HeaderProps extends HTMLChakraProps<"header"> {
  onInviteClick?: () => void
}

export function Header(props: HeaderProps) {
  const {
    isOpen: isFeedbackModalOpen,
    onOpen: onFeedbackModalOpen,
    onClose: onFeedbackModalClose,
  } = useDisclosure()
  const { user } = useUser()
  const { locale } = useRouter()
  const { t } = useTranslation("common")

  const logout = () => {
    window.location.replace(`/api/auth/logout?lang=${locale}`)
  }

  return (
    <Container
      maxW="full"
      w="auto"
      height="14"
      bgColor="rgba(26,26,26,.5)"
      borderBottom="1px solid"
      borderColor="whiteAlpha.300"
      transition="margin 300ms cubic-bezier(0.2, 0, 0, 1) 0s"
      zIndex="sticky"
      position="fixed"
      left="0"
      right="0"
      top="0"
      backdropFilter="blur(16px)"
      css={{
        "-webkit-backdrop-filter": "blur(16px)",
      }}
      {...props}
    >
      <Flex justifyContent="space-between" align="center" h="full">
        <BackButton />
        <Spacer />

        <Flex h="full" align="center" justify="flex-end" gridGap="1">
          <ClientLanguageSwitch />
          <IconButton
            variant="ghost"
            colorScheme="primary"
            px="2"
            as={Link}
            href="/client/glossary"
            role="link"
            aria-label="Support Icon"
            icon={<GlossaryIcon width="20px" height="20px" />}
          />

          <Menu id="user-menu-button" placement="bottom-end" isLazy>
            <MenuButton
              as={Button}
              colorScheme="primary"
              data-testid="menu-button"
              variant="ghost"
              fontSize="sm"
              px="2"
              rightIcon={<CaretDownIcon w="4" h="4" />}
            >
              {t("common:client.clientId")} #{user?.mandateId}
            </MenuButton>

            <MenuList bgColor="gray.900" border="none" rounded="sm">
              <NextLink href="/client/setting">
                <MenuItem>
                  <Flex flex="1" justifyContent="space-between">
                    {t("nav.links.setting")}
                    <CaretRightIcon
                      w="6"
                      h="6"
                      transform={locale === "ar" ? "rotate(180deg)" : "unset"}
                    />
                  </Flex>
                </MenuItem>
              </NextLink>
              <MenuDivider color="gray.700" />
              <MenuItem>
                <Flex
                  flex="1"
                  justifyContent="space-between"
                  onClick={props.onInviteClick}
                  data-testid="refer-button"
                >
                  {t("nav.links.shareInvite")}
                  <CaretRightIcon
                    w="6"
                    h="6"
                    transform={locale === "ar" ? "rotate(180deg)" : "unset"}
                  />
                </Flex>
              </MenuItem>
              <MenuDivider color="gray.700" />
              <chakra.a
                cursor="pointer"
                textDecoration="none"
                color="currentColor"
                onClick={() => {
                  if (
                    getFeedbackCookieStatus(
                      siteConfig.clientFeedbackSessionVariableName,
                    ) == "true"
                  ) {
                    onFeedbackModalOpen()
                  } else {
                    logout()
                  }
                }}
              >
                <MenuItem color="gray.500">
                  <Flex flex="1" justifyContent="space-between">
                    {t("nav.links.signout")}
                    <LogoutIcon
                      w="6"
                      h="6"
                      transform={locale === "ar" ? "rotate(180deg)" : "unset"}
                    />
                  </Flex>
                </MenuItem>
              </chakra.a>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <FeedbackModal
        hideReferalOption={true}
        isOpen={isFeedbackModalOpen}
        onClose={() => {
          onFeedbackModalClose()
          setFeedbackCookieStatus(
            siteConfig.clientFeedbackSessionVariableName,
            false,
            siteConfig.clientFeedbackSessionExpireDays,
          )
          logout()
        }}
        submissionScreen={FeedbackSubmissionScreen.ClientSignOut}
      />
    </Container>
  )
}

export default React.memo(Header)
