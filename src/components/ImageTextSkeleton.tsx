import { useBreakpointValue } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import {
  DesktopImageTextArIcon,
  DesktopImageTextIcon,
  MobileImageTextArIcon,
  MobileImageTextIcon,
  TabImageTextArIcon,
  TabImageTextIcon,
} from "~/components"

export default function ImageTextSkeleton() {
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
        ? isDesktopView && <DesktopImageTextIcon zIndex="1" />
        : isDesktopView && <DesktopImageTextArIcon zIndex="1" />}
      {lang == "en"
        ? isMobileView && <MobileImageTextIcon zIndex="1" />
        : isMobileView && <MobileImageTextArIcon zIndex="1" />}
      {lang == "en"
        ? isTabView && <TabImageTextIcon zIndex="1" />
        : isTabView && <TabImageTextArIcon zIndex="1" />}
    </>
  )
}
