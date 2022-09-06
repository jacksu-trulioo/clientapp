import {
  Box,
  chakra,
  Divider,
  Flex,
  HTMLChakraProps,
  IconButton,
  List,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import {
  CaretRightIcon,
  ClientLanguageSwitch,
  CloseIcon,
  FeedbackModal,
  GlossaryIcon,
  HamburgerIcon,
  Link,
  Logo,
  LogoutIcon,
} from "~/components"
import siteConfig from "~/config"
import useStore from "~/hooks/useStore"
import { useUser } from "~/hooks/useUser"
import { FeedbackSubmissionScreen } from "~/services/mytfo/types"
import {
  getFeedbackCookieStatus,
  setFeedbackCookieStatus,
} from "~/utils/clientUtils/feedbackCookieUtilities"

import BackButton from "../../BackButton"
import SidebarNavItem from "./SidebarNavItem"

interface NavLink {
  name: string
  path: string
  icon: React.FC<HTMLChakraProps<"svg">>
  childRoutes?: ChildRoutesNavLink[]
}

type ChildRoutesNavLink = {
  name: string
  path: string
}

type MobileDrawerProps = {
  routesPath: Array<NavLink>
  onInviteClick?: () => void
}

function MobileDrawer({ onInviteClick, routesPath }: MobileDrawerProps) {
  const { t, lang } = useTranslation("common")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { locale } = useRouter()
  const { user } = useUser()
  const showBackButton = useStore((state) => state.showBackButton)
  const {
    isOpen: isFeedbackModalOpen,
    onOpen: onFeedbackModalOpen,
    onClose: onFeedbackModalClose,
  } = useDisclosure()

  const direction = locale === "ar" ? "rtl" : "ltr"

  const logout = () => {
    window.location.replace(`/api/auth/logout?lang=${locale}`)
  }

  return (
    <Box
      as="nav"
      bgColor="gray.800"
      w="full"
      pos="fixed"
      zIndex="5"
      overflow="hidden"
      h={isOpen ? "full" : showBackButton ? "96px" : "56px"}
    >
      <Box d="flex" flexDir="column" h="100%">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          py="2"
          px="3"
          sx={{ direction: "ltr" }}
        >
          <Logo
            cursor="pointer"
            onClick={() => {
              window.open(
                lang.includes("en")
                  ? "https://www.tfoco.com/en"
                  : "https://www.tfoco.com/ar",
              )
            }}
          />

          <Stack alignItems="center" isInline spacing="4">
            <ClientLanguageSwitch />
            <IconButton
              variant="ghost"
              colorScheme="primary"
              px="2"
              as={Link}
              href="/client/glossary"
              role="link"
              aria-label="Glossary Icon"
              icon={<GlossaryIcon h="24px" w="24px" />}
            />

            <IconButton
              aria-label={isOpen ? "Close Menu" : "Hamburger Menu"}
              role="button"
              color="primary.500"
              onClick={isOpen ? onClose : onOpen}
              variant="ghost"
              px="2"
              icon={
                isOpen ? (
                  <CloseIcon w="6" h="6" />
                ) : (
                  <HamburgerIcon w="6" h="6" />
                )
              }
            />
          </Stack>
        </Flex>
        {!isOpen && <BackButton />}

        {isOpen && (
          <>
            <Link
              href="/client/setting"
              display="flex"
              p="15px 8px"
              mx="3"
              alignItems="center"
              color="primary.500"
              onClick={() => {
                onClose()
              }}
              _focus={{
                boxShadow: "none",
              }}
            >
              <Text flex="1" fontSize="md" ms="5" fontWeight="bold">
                {t("common:client.clientId")} #{user?.mandateId}
              </Text>
              <CaretRightIcon
                h="6"
                w="6"
                transform={direction === "rtl" ? "rotate(180deg)" : "initial"}
              />
            </Link>

            <Divider
              orientation="horizontal"
              w="calc(100% - 60px)"
              insetStart="40px"
              color="gray.700"
              mb="6"
              position="relative"
            />

            <Text ps="4" fontSize="xs">
              {t("nav.heading")}
            </Text>

            <List
              as="ul"
              spacing="2"
              styleType="none"
              m="0"
              h="100%"
              overflow="auto"
            >
              {routesPath.map(({ path, icon, name, childRoutes }) => {
                return (
                  <SidebarNavItem
                    key={path}
                    href={path}
                    onClick={onOpen}
                    onClose={onClose}
                    icon={icon}
                    childRoutes={childRoutes}
                  >
                    {name}
                  </SidebarNavItem>
                )
              })}
            </List>

            <Box borderTop="1px" borderColor="gray.700">
              <chakra.a textDecoration="none">
                <Flex
                  p="4"
                  alignItems="center"
                  justifyContent="space-between"
                  onClick={onInviteClick}
                >
                  <Text insetEnd="rtl" fontSize="sm" color="gray.500">
                    {t("nav.links.shareInvite")}
                  </Text>
                  <CaretRightIcon
                    h="4"
                    w="4"
                    color="gray.500"
                    transform={
                      direction === "rtl" ? "rotate(180deg)" : "initial"
                    }
                  />
                </Flex>
              </chakra.a>
              <Divider />
              <chakra.a
                cursor="pointer"
                textDecoration="none"
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
                <Flex p="4" alignItems="center" justifyContent="space-between">
                  <Text insetEnd="rtl" fontSize="sm" color="gray.500">
                    {t("nav.links.signout")}
                  </Text>
                  <LogoutIcon
                    h="6"
                    w="6"
                    color="gray.500"
                    transform={
                      direction === "rtl" ? "rotate(180deg)" : "initial"
                    }
                  />
                </Flex>
              </chakra.a>
            </Box>
          </>
        )}
      </Box>
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
    </Box>
  )
}

export default MobileDrawer
