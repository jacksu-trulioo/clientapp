import {
  Box,
  Flex,
  HTMLChakraProps,
  IconButton,
  Kbd,
  List,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import {
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Logo,
  LogoMark,
} from "~/components"
import useStore from "~/hooks/useStore"

import SidebarNavItem from "./SidebarNavItem"

const drawerKeybind = "s"

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

type DesktopDrawerProps = {
  routesPath: NavLink[]
}

function DesktopDrawer({ routesPath }: DesktopDrawerProps) {
  const { t, lang } = useTranslation("common")
  const { locale } = useRouter()
  const direction = locale === "ar" ? "rtl" : "ltr"
  const [isDrawerOpen, setIsDrawerOpen] = useStore((state) => [
    state.isDrawerOpen,
    state.setIsDrawerOpen,
  ])

  const { isOpen, onOpen, onClose } = useDisclosure({
    defaultIsOpen: isDrawerOpen,
  })

  const openDrawer = React.useCallback(() => {
    onOpen()
    setIsDrawerOpen(true)
  }, [onOpen, setIsDrawerOpen])

  const closeDrawer = React.useCallback(() => {
    onClose()
    setIsDrawerOpen(false)
  }, [onClose, setIsDrawerOpen])

  const toggleDrawer = React.useCallback(() => {
    if (isOpen) {
      closeDrawer()
    } else {
      openDrawer()
    }
  }, [closeDrawer, isOpen, openDrawer])

  // Add keyboard support to open/close drawer
  const downHandler = React.useCallback(
    ({ key }) => {
      if (key === drawerKeybind) {
        toggleDrawer()
      }
    },
    [toggleDrawer],
  )

  React.useEffect(() => {
    window.addEventListener("keydown", downHandler)

    return () => {
      window.removeEventListener("keydown", downHandler)
    }
  }, [downHandler])

  return (
    <Box
      as="nav"
      bgColor="gray.800"
      w={isOpen ? "256px" : 16}
      transition="width 300ms cubic-bezier(0.2, 0, 0, 1) 0s"
      position="fixed"
      h="100vh"
      overflowY="scroll"
      overflow="overlay"
    >
      <Flex flexDirection="column" h="full">
        <Flex mt={4} ml={7} mb={6} justifyContent="left">
          {isOpen ? (
            <Logo
              _focus={{ boxShadow: "none", outline: "none" }}
              cursor="pointer"
              onClick={() => {
                window.open(
                  lang.includes("en")
                    ? "https://www.tfoco.com/en"
                    : "https://www.tfoco.com/ar",
                )
              }}
            />
          ) : (
            <Box ml={direction == "rtl" ? "-20px" : "0"}>
              <LogoMark
                h="33px"
                cursor="pointer"
                onClick={() => {
                  window.open(
                    lang.includes("en")
                      ? "https://www.tfoco.com/en"
                      : "https://www.tfoco.com/ar",
                  )
                }}
              />
            </Box>
          )}
        </Flex>

        <List as="ul" spacing="2" styleType="none" flex="1">
          {routesPath.map(({ path, icon, name, childRoutes }) => {
            return (
              <SidebarNavItem
                key={path}
                href={path}
                icon={icon}
                childRoutes={childRoutes}
              >
                {isOpen ? name : ""}
              </SidebarNavItem>
            )
          })}
        </List>
        <Flex
          justifyContent={isOpen ? "flex-end" : "center"}
          borderTop="1px"
          borderColor="whiteAlpha.300"
          py="2"
          px="2"
        >
          <Tooltip
            bgColor="gray.750"
            label={
              <Stack isInline>
                <Text>{t("nav.links.expandOrCollapse")}</Text>
                <Kbd>s</Kbd>
              </Stack>
            }
          >
            <IconButton
              aria-label={isOpen ? "Close Sidebar" : "Open Sidebar"}
              role="button"
              variant="ghost"
              color="gray.600"
              onClick={toggleDrawer}
              transform={direction === "rtl" ? "rotate(180deg)" : "initial"}
              icon={
                isOpen ? (
                  <ChevronsLeftIcon h="6" w="6" />
                ) : (
                  <ChevronsRightIcon h="6" w="6" />
                )
              }
            />
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  )
}

export default DesktopDrawer
