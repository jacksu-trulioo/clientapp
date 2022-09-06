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
} from "@chakra-ui/react"
import NextLink from "next/link"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import {
  BackButton,
  CaretDownIcon,
  CaretRightIcon,
  ChatIcon,
  LanguageSwitch,
  Link,
  LogoutIcon,
  PersonIcon,
  QuestionIcon,
} from "~/components"
import { useUser } from "~/hooks/useUser"
import { RelationshipManager } from "~/services/mytfo/types"

export interface HeaderProps extends HTMLChakraProps<"header"> {
  understood?: boolean
  onInviteClick?: () => void
}

export function Header(props: HeaderProps) {
  const { user } = useUser()
  const { t } = useTranslation("common")
  const { locale, route } = useRouter()

  const { data: rmData, error: rmError } = useSWR<RelationshipManager>(
    "/api/user/relationship-manager",
  )

  const isLoading = !rmData && !rmError
  const isRmAssigned = !isLoading && rmData?.assigned

  return (
    <Container
      maxW="full"
      w="auto"
      height="14"
      bgColor="gray.900"
      borderBottom="1px solid"
      borderColor="whiteAlpha.300"
      transition="margin 300ms cubic-bezier(0.2, 0, 0, 1) 0s"
      zIndex="sticky"
      position="fixed"
      left="0"
      right="0"
      {...props}
    >
      <Flex justifyContent="space-between" align="center" h="full">
        <BackButton />
        <Spacer />

        <Flex
          h="full"
          align="center"
          justify="flex-end"
          gridGap="1"
          {...(props?.understood && {
            filter: "blur(1px)",
            opacity: "0.4",
            pointerEvents: "none",
          })}
        >
          <LanguageSwitch />
          {route !== "/support" && (
            <IconButton
              variant="ghost"
              colorScheme="primary"
              px="2"
              as={Link}
              href="/support"
              role="link"
              aria-label="Support Icon"
              icon={isRmAssigned ? <ChatIcon /> : <QuestionIcon />}
            />
          )}
          <Menu id="user-menu-button" placement="bottom-end" isLazy>
            <MenuButton
              as={Button}
              colorScheme="primary"
              variant="ghost"
              fontSize="sm"
              px="2"
              leftIcon={<PersonIcon w="4" h="4" />}
              rightIcon={<CaretDownIcon w="4" h="4" />}
            >
              {user?.profile?.firstName ?? ""}
            </MenuButton>

            <MenuList bgColor="gray.900" border="none" rounded="sm">
              <NextLink href="/profile#personalDetails">
                <MenuItem>
                  <Flex flex="1" justifyContent="space-between">
                    {t("nav.links.profile")}
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
                textDecoration="none"
                color="currentColor"
                href={`/api/auth/logout?lang=${locale}`}
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
    </Container>
  )
}

export default React.memo(Header)
