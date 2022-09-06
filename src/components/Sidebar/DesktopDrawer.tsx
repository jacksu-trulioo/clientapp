import {
  Box,
  Flex,
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
import useSWR from "swr"

import {
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Link,
  Logo,
  LogoMark,
  PersonalizedProposalIcon,
  PhoneIcon,
  PortfolioSimulatorIcon,
} from "~/components"
import useStore from "~/hooks/useStore"
import { useUser } from "~/hooks/useUser"
import {
  InvestorProfileGoals,
  PortfolioSummary,
  PreProposalInitialActionType,
  QualificationStatus,
  RelationshipManager,
  UserQualificationStatus,
  UserStatuses,
} from "~/services/mytfo/types"
import {
  leftNavigationInsights,
  leftNavigationOpportunities,
  leftNavigationPersonalizedProposal,
  leftNavigationPortfolioSimulator,
} from "~/utils/googleEvents"
import { event } from "~/utils/gtag"

import { routes } from "./Sidebar"
import SidebarNavItem from "./SidebarNavItem"

const drawerKeybind = "s"

interface DesktopDrawerProps {
  understood?: boolean
}

function DesktopDrawer(props: DesktopDrawerProps) {
  const { t } = useTranslation("common")
  const { locale, query, pathname } = useRouter()
  const { user } = useUser()
  const direction = locale === "ar" ? "rtl" : "ltr"
  const [isDrawerOpen, setIsDrawerOpen] = useStore((state) => [
    state.isDrawerOpen,
    state.setIsDrawerOpen,
  ])
  const scheduleCallUrl = pathname.endsWith("/opportunities/[id]")
    ? `/schedule-meeting?opportunityId=${query.id}`
    : "/schedule-meeting"

  const { isOpen, onOpen, onClose } = useDisclosure({
    defaultIsOpen: isDrawerOpen,
  })

  const { data: statusData, error: statusError } =
    useSWR<UserStatuses>("/api/user/status")

  const { data: qualificationStatusData, error: qualificationStatusError } =
    useSWR<QualificationStatus>("/api/user/qualifications/status")

  const { data: portfolioSummaryData, error: portfolioSummaryError } =
    useSWR<PortfolioSummary>("/api/user/summary")

  const { data: investmentGoalsData } = useSWR<InvestorProfileGoals>(
    "/api/user/investment-goals",
  )

  const { data: rmData } = useSWR<RelationshipManager>(
    "/api/user/relationship-manager",
  )

  const isProposalGenerated =
    !portfolioSummaryError &&
    portfolioSummaryData &&
    portfolioSummaryData?.lastProposalDate

  const showPreProposalNavigation =
    statusData?.status === UserQualificationStatus.Disqualified ||
    statusData?.status === UserQualificationStatus.ActivePipeline ||
    statusData?.status === UserQualificationStatus.AlreadyClient

  const isPreProposalStarted =
    !qualificationStatusError &&
    qualificationStatusData &&
    (qualificationStatusData?.investorProfile || user?.profile?.nationality) &&
    (user?.profile?.preProposalInitialAction ===
      PreProposalInitialActionType.StartInvesting ||
      investmentGoalsData?.whoIsPortfolioFor)

  const isPreProposalCompleted =
    !qualificationStatusError &&
    qualificationStatusData &&
    qualificationStatusData?.investmentGoals &&
    qualificationStatusData?.investorProfile &&
    qualificationStatusData?.riskAssessment

  const showProposalNavigation =
    isPreProposalCompleted &&
    (statusData?.status === UserQualificationStatus.PendingApproval ||
      statusData?.status === UserQualificationStatus.Disqualified)

  const isUpportunityUnlocked = qualificationStatusData?.investorProfile

  const getRedirectionUrl = () => {
    if (!isPreProposalCompleted) {
      return "/proposal"
    } else if (isPreProposalCompleted && isProposalGenerated) {
      return "/personalized-proposal"
    }
  }

  const getProposalLinkText = () => {
    if (isProposalGenerated) return "viewProposal"
    return "personalizedProposal"
  }

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

  const scheduleCallLabel = React.useMemo(() => {
    if (rmData && rmData.manager) {
      return `${t("common:help.contact")} ${rmData?.manager?.firstName} 
      ${rmData?.manager?.lastName}`
    }
    return undefined
  }, [rmData, t])

  React.useEffect(() => {
    window.addEventListener("keydown", downHandler)

    return () => {
      window.removeEventListener("keydown", downHandler)
    }
  }, [downHandler])

  return (
    <Box
      aria-label="leftNavigation"
      as="nav"
      bgColor="gray.800"
      w={isOpen ? "256px" : 16}
      transition="width 300ms cubic-bezier(0.2, 0, 0, 1) 0s"
      position="fixed"
      h="100vh"
      {...(props?.understood && {
        filter: "blur(1px)",
        opacity: "0.4",
        pointerEvents: "none",
      })}
    >
      <Flex flexDirection="column" h="full">
        <Flex
          mt={4}
          ml={locale === "ar" ? (isOpen ? 7 : 0) : 7}
          mb={6}
          overflow="hidden"
          justifyContent="left"
        >
          <Link
            aria-label="logo"
            href="/"
            _focus={{ boxShadow: "none", outline: "none" }}
            cursor="pointer"
          >
            {isOpen ? <Logo /> : <LogoMark h="33px" />}
          </Link>
        </Flex>

        <List as="ul" spacing="2" styleType="none" flex="1">
          {routes.map(({ path, icon, name }) => {
            return (
              <SidebarNavItem
                key={path}
                href={path}
                icon={icon}
                onClick={() => {
                  if (name === "opportunities")
                    event(leftNavigationOpportunities)
                  if (name === "insights") event(leftNavigationInsights)
                }}
                {...(!isUpportunityUnlocked && {
                  showRightContent: name === "opportunities",
                })}
              >
                {isOpen ? name : ""}
              </SidebarNavItem>
            )
          })}
        </List>

        {statusData && !statusError && !showPreProposalNavigation && (
          <Flex justifyContent={isOpen ? "flex-end" : "center"} mb="4">
            <List as="ul" spacing="2" styleType="none" flex="1">
              {(!isPreProposalStarted || !showProposalNavigation) && (
                <Text ms={2} fontSize="10px" color="gray.600">
                  {t("nav.links.invest")}
                </Text>
              )}
              {!showProposalNavigation && (
                <SidebarNavItem
                  key="/personalized-proposal"
                  href={getRedirectionUrl()}
                  icon={PersonalizedProposalIcon}
                  section="invest"
                  onClick={() => event(leftNavigationPersonalizedProposal)}
                >
                  {isOpen ? getProposalLinkText() : ""}
                </SidebarNavItem>
              )}

              {!isPreProposalStarted && (
                <SidebarNavItem
                  key="/portfolio/simulator"
                  href="/portfolio/simulator"
                  icon={PortfolioSimulatorIcon}
                  section="invest"
                  onClick={() => event(leftNavigationPortfolioSimulator)}
                >
                  {isOpen ? "portfolioSimulator" : ""}
                </SidebarNavItem>
              )}
              <Text
                ms={2}
                fontSize="10px"
                color="gray.600"
                textTransform="uppercase"
              >
                {t("nav.links.scheduleCallHelp")}
              </Text>
              <SidebarNavItem
                key="/schedule-meeting"
                href={scheduleCallUrl}
                icon={PhoneIcon}
                section="scheduleCall"
                onClick={() => event(leftNavigationPortfolioSimulator)}
                label={scheduleCallLabel}
              >
                {isOpen ? "scheduleCall" : ""}
              </SidebarNavItem>
            </List>
          </Flex>
        )}

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
