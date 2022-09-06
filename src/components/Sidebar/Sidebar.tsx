import { HTMLChakraProps, useBreakpointValue } from "@chakra-ui/react"
import React from "react"

import { HomeIcon, InsightIcon, OpportunitiesIcon } from "~/components"

import DesktopDrawer from "./DesktopDrawer"
import MobileDrawer from "./MobileDrawer"

interface NavLink {
  name: string
  path: string
  icon: React.FC<HTMLChakraProps<"svg">>
}

// The name of the route is the i18n translation key.
export const routes: Array<NavLink> = [
  { name: "dashboard", path: "/", icon: HomeIcon },
  { name: "opportunities", path: "/opportunities", icon: OpportunitiesIcon },
  { name: "insights", path: "/insights", icon: InsightIcon },
]

interface SidebarProps {
  understood?: boolean
  onInviteClick?: () => void
}

export function Sidebar(props: SidebarProps) {
  const isMobileView = useBreakpointValue({ base: true, lg: false })

  return isMobileView ? (
    <MobileDrawer
      understood={props?.understood}
      onInviteClick={props.onInviteClick}
    />
  ) : (
    <DesktopDrawer understood={props?.understood} />
  )
}

export default React.memo(Sidebar)
