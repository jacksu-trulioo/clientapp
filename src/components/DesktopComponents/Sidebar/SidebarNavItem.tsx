import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  HTMLChakraProps,
  LinkProps,
  ListItem,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { Link } from "~/components"
import { useUser } from "~/hooks/useUser"
import { clickOnOpportunitiesFromNavBar } from "~/utils/googleEventsClient"
import { clientUniEvent } from "~/utils/gtag"

type MenuCloseFunction = () => void
interface SidebarNavItemProps extends LinkProps {
  icon: React.FC<HTMLChakraProps<"svg">>
  children: string
  section?: string
  childRoutes?: ChildRoutesNavLink[]
  onClose?: MenuCloseFunction
}

type ChildRoutesNavLink = {
  name: string
  path: string
}

function SidebarNavItem(props: SidebarNavItemProps) {
  const {
    href = "/",
    children,
    icon: Icon,
    childRoutes,
    onClose,
    ...rest
  } = props
  const { t } = useTranslation("common")
  const { asPath } = useRouter()
  const { user } = useUser()

  let isActive = asPath == href

  const handleClickEvent = () => {
    childRoutes?.forEach((element) => {
      if (element.path == "/client/opportunities") {
        clientUniEvent(
          clickOnOpportunitiesFromNavBar,
          "true",
          user?.mandateId as string,
          user?.email as string,
        )
      }
    })
  }

  let defaultIndx = 1
  if (childRoutes?.length) {
    for (let i = 0; i < childRoutes.length; i++) {
      const element = childRoutes[i]
      if (element.path == asPath) {
        defaultIndx = 0
      }
    }
  }

  if (childRoutes?.length) {
    return (
      <Accordion allowToggle defaultIndex={[defaultIndx]}>
        <AccordionItem pt="0" pl="8px" pr="8px" fontSize="sm">
          <AccordionButton
            aria-current={isActive ? "page" : undefined}
            fontWeight="extrabold"
            color="#C7C7C7"
            alignItems="center"
            position="relative"
            my={1}
            fontSize="sm"
            pos="relative"
            p="10px 15px 10px"
            whiteSpace="nowrap"
            textAlign="left"
            _hover={{
              bgColor: "#313131",
            }}
            _activeLink={{
              color: "white",
              bgColor: "#1A1A1A",
            }}
          >
            <Box
              flex="1"
              d="flex"
              alignItems="center"
              onClick={handleClickEvent}
            >
              <Box mr="12px" mt="-2px">
                <Link
                  href={href}
                  outline="none"
                  _hover={{
                    textDecoration: "none",
                  }}
                  _focus={{
                    boxShadow: "none",
                  }}
                >
                  <Icon as={Icon} w="5" h="5" />
                </Link>
              </Box>
              {children && (
                <Link
                  href={href}
                  outline="none"
                  _hover={{
                    textDecoration: "none",
                  }}
                  _focus={{
                    boxShadow: "none",
                  }}
                  w="100%"
                  onClick={() => {
                    if (asPath == href) {
                      if (onClose) onClose()
                    }
                  }}
                >
                  {t(`nav.links.${children}`)}
                </Link>
              )}
            </Box>
            {children && <AccordionIcon width="24px" height="24px" />}
          </AccordionButton>
          {children && (
            <>
              <AccordionPanel p="0">
                {childRoutes.map(({ path, name }) => {
                  isActive = asPath == path
                  return (
                    <Link
                      key={name}
                      aria-current={isActive ? "page" : undefined}
                      href={path}
                      fontWeight="extrabold"
                      color="#C7C7C7"
                      display="flex"
                      alignItems="center"
                      position="relative"
                      my={1}
                      p="10px"
                      pr="15px"
                      pl="56px"
                      outline="none"
                      whiteSpace="nowrap"
                      _hover={{
                        bgColor: "#313131",
                      }}
                      _focus={{
                        boxShadow: "none",
                      }}
                      _activeLink={{
                        color: "white",
                        bgColor: "#1A1A1A",
                      }}
                      onClick={() => {
                        if (path == "/client/opportunities") {
                          clientUniEvent(
                            clickOnOpportunitiesFromNavBar,
                            "true",
                            user?.mandateId as string,
                            user?.email as string,
                          )
                        }
                        if (asPath == path) if (onClose) onClose()
                      }}
                    >
                      {t(`nav.links.${name}`)}
                    </Link>
                  )
                })}
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Accordion>
    )
  } else {
    return (
      <>
        <ListItem listStyleType="none" pl="8px" pr="8px">
          <Link
            href={href}
            aria-current={isActive ? "page" : undefined}
            fontWeight="extrabold"
            color="#C7C7C7"
            display="flex"
            alignItems="center"
            position="relative"
            my={1}
            p="10px 15px 10px"
            outline="none"
            whiteSpace="nowrap"
            _hover={{
              bgColor: "#313131",
            }}
            _focus={{
              boxShadow: "none",
            }}
            _activeLink={{
              color: "white",
              bgColor: "#1A1A1A",
            }}
            {...rest}
            onClick={() => {
              if (isActive) if (onClose) onClose()
            }}
          >
            <Box mr="12px" mt="-2px">
              <Icon as={Icon} w="5" h="5" />
            </Box>
            {children && (
              <Box fontSize="sm" width="full">
                {t(`nav.links.${children}`)}
              </Box>
            )}
          </Link>
        </ListItem>
      </>
    )
  }
}

export default SidebarNavItem
