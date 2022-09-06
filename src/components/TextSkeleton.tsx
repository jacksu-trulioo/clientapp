import { useBreakpointValue } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import {
  DesktopTextArIcon,
  DesktopTextIcon,
  MobileTextArIcon,
  MobileTextIcon,
  TabTextArIcon,
  TabTextIcon,
} from "~/components"

export default function TextSkeleton() {
  const isMobileView = useBreakpointValue({ base: true, md: false, lg: false })
  const isDesktopView = useBreakpointValue({ base: false, md: false, lg: true })
  const isTabView = useBreakpointValue({
    base: false,
    md: true,
    lg: false,
  })
  const { lang } = useTranslation("common")
  return (
    <>
      {lang == "en"
        ? isDesktopView && <DesktopTextIcon position="relative" zIndex="1" />
        : isDesktopView && <DesktopTextArIcon position="relative" zIndex="1" />}
      {lang == "en"
        ? isMobileView && <MobileTextIcon position="relative" zIndex="1" />
        : isMobileView && <MobileTextArIcon position="relative" zIndex="1" />}
      {lang == "en"
        ? isTabView && <TabTextIcon position="relative" zIndex="1" />
        : isTabView && <TabTextArIcon position="relative" zIndex="1" />}
    </>
  )
}
