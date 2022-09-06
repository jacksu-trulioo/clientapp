import {
  Box,
  Button,
  HTMLChakraProps,
  LinkProps,
  ListIcon,
  ListItem,
  useBreakpointValue,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { Link, RightIcon } from "~/components"
import { unlokButtonSideNav } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"

interface SidebarNavItemProps extends LinkProps {
  icon: React.FC<HTMLChakraProps<"svg">>
  children: string
  section?: string
  showRightContent?: boolean
  label?: string
}

function SidebarNavItem(props: SidebarNavItemProps) {
  const {
    href = "/",
    children,
    icon: Icon,
    section,
    showRightContent,
    label,
    ...rest
  } = props

  const isDesktopView = useBreakpointValue({ base: false, lg: true })
  const { locale, asPath, push } = useRouter()
  const direction = locale === "ar" ? "rtl" : "ltr"

  const { t } = useTranslation("common")
  const isActive = asPath === href

  return (
    <ListItem listStyleType="none">
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        fontWeight="extrabold"
        color="gray.500"
        display="flex"
        alignItems="center"
        position="relative"
        my={1}
        _after={
          children
            ? {
                content: '""',
                position: "absolute",
                bottom: "-4px",
                insetStart: "64px",
                width: "calc(100% - 64px)",
              }
            : {}
        }
        h="8"
        _hover={{
          color: "white",
          bgColor: "gray.850",
        }}
        _focus={{
          outline: "none",
        }}
        _activeLink={{
          color: "white",
          bgColor: "gray.850",
          _before: {
            content: '""',
            position: "absolute",
            insetStart: "0",
            width: 3,
            height: 8,
          },
        }}
        {...rest}
      >
        <ListIcon
          as={Icon}
          w="5"
          h="5"
          ml={section ? 2 : 5}
          justifyContent="center"
          {...(section && { color: "primary.500" })}
        />
        {children && (
          <Box
            fontSize="sm"
            width="full"
            whiteSpace="nowrap"
            position="relative"
            {...(section && { color: "primary.500" })}
            {...(label && { whiteSpace: "initial" })}
          >
            {label || t(`nav.links.${children}`)}
            {showRightContent && (
              <Button
                position="absolute"
                bottom="-3px"
                right="12px"
                variant="outline"
                colorScheme="primary"
                size="xs"
                onClick={() => {
                  event(unlokButtonSideNav)
                  push("/opportunities/unlock")
                }}
              >
                {t("nav.links.unlock")}
              </Button>
            )}
          </Box>
        )}

        {section && (
          <ListIcon
            as={RightIcon}
            mt={direction === "rtl" ? "-2" : "1.5"}
            w="5"
            h="5"
            ms="2"
            display="flex"
            justifyContent="center"
            me={isDesktopView ? "0" : "4"}
            color="primary.500"
            transform={direction === "rtl" ? "rotate(180deg)" : "initial"}
          />
        )}
      </Link>
    </ListItem>
  )
}

export default SidebarNavItem
