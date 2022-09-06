import {
  HTMLChakraProps,
  Portal,
  Progress,
  useBreakpointValue,
} from "@chakra-ui/react"
import React from "react"

import {
  ClientHomeIcon,
  ClientInsightIcon,
  ClientOpportunitiesIcon,
  DocumentCenterIcon,
  HomeIcon,
  InsightIcon,
  OpportunitiesIcon,
  PortfolioSummaryIcon,
} from "~/components"

import DesktopDrawer from "./DesktopDrawer"
import MobileDrawer from "./MobileDrawer"

interface NavLink {
  name: string
  path: string
  icon: React.FC<HTMLChakraProps<"svg">>
  childRoutes?: ChildRoutesNavLink[]
}

type SideBarProps = {
  sidebarType: string
  onInviteClick?: () => void
}

type ChildRoutesNavLink = {
  name: string
  path: string
}

// The name of the route is the i18n translation key.
export function Sidebar({ sidebarType, onInviteClick }: SideBarProps) {
  const prospectRoutes: Array<NavLink> = [
    { name: "dashboard", path: "/", icon: HomeIcon },
    {
      name: "opportunities",
      path: "/opportunities",
      icon: OpportunitiesIcon,
    },
    { name: "insights", path: "/insights", icon: InsightIcon },
  ]
  const clientRoutes: Array<NavLink> = [
    { name: "dashboard", path: "/client", icon: ClientHomeIcon },
    {
      name: "myPortfolio",
      path: "/client/portfolio-summary",
      icon: PortfolioSummaryIcon,
      childRoutes: [
        { name: "portfolioSummary", path: "/client/portfolio-summary" },
        {
          name: "assetAllocation",
          path: "/client/asset-allocation",
        },
        {
          name: "performance",
          path: "/client/performance",
        },
        {
          name: "profitLoss",
          path: "/client/profit-and-loss",
        },
        {
          name: "marketIndicators",
          path: "/client/market-indicator",
        },
        {
          name: "totalInvestments",
          path: "/client/total-investments",
        },
        {
          name: "totalCommitments",
          path: "/client/total-commitments",
        },
        {
          name: "cashFlows",
          path: "/client/cash-flows",
        },
      ],
    },
    {
      name: "insights",
      path: "/client/insights",
      icon: ClientInsightIcon,
      childRoutes: [
        {
          name: "insightsOverview",
          path: "/client/insights",
        },
        {
          name: "marketsSimplified",
          path: "/client/insights/markets-simplified",
        },
        {
          name: "marketArchive",
          path: "/client/insights/markets-archive",
        },
      ],
    },
    {
      name: "opportunities",
      path: "/client/opportunities",
      icon: ClientOpportunitiesIcon,
      childRoutes: [
        {
          name: "allDeals",
          path: "/client/opportunities",
        },
        {
          name: "interestedDeals",
          path: "/client/opportunities/interested-deals",
        },
      ],
    },
    {
      name: "myDocuments",
      path: "/client/my-documents",
      icon: DocumentCenterIcon,
    },
  ]
  const routes = sidebarType == "Client" ? clientRoutes : prospectRoutes
  const isMobileView = useBreakpointValue({
    base: true,
    md: true,
    lgp: false,
    xl: false,
  })
  const isDesktopView = useBreakpointValue({
    base: false,
    md: false,
    lgp: true,
    xl: true,
  })
  return (
    <>
      {isMobileView ? (
        <MobileDrawer routesPath={routes} onInviteClick={onInviteClick} />
      ) : isDesktopView ? (
        <DesktopDrawer routesPath={routes} />
      ) : (
        <Portal>
          <Progress
            size="xs"
            isIndeterminate
            pos="fixed"
            left="0"
            top="0"
            right="0"
            zIndex="overlay"
          />
        </Portal>
      )}
    </>
  )
}
export default React.memo(Sidebar)
