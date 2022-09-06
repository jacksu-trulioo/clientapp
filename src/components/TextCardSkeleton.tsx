import { useBreakpointValue } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import {
  DesktopTextCardArIcon,
  DesktopTextCardIcon,
  MobileTextCardArIcon,
  MobileTextCardIcon,
  TabTextCardArIcon,
  TabTextCardIcon,
} from "~/components"

export default function TextCardSkeleton() {
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
        ? isDesktopView && <DesktopTextCardIcon zIndex="1" />
        : isDesktopView && <DesktopTextCardArIcon zIndex="1" />}
      {lang == "en"
        ? isMobileView && <MobileTextCardIcon zIndex="1" />
        : isMobileView && <MobileTextCardArIcon zIndex="1" />}
      {lang == "en"
        ? isTabView && <TabTextCardIcon zIndex="1" />
        : isTabView && <TabTextCardArIcon zIndex="1" />}
    </>
  )
}
