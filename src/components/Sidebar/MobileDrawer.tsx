import {
  Box,
  Center,
  chakra,
  Divider,
  Flex,
  IconButton,
  List,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import {
  CaretRightIcon,
  ChatIcon,
  CloseIcon,
  HamburgerIcon,
  LanguageSwitch,
  Link,
  Logo,
  LogoutIcon,
  PersonalizedProposalIcon,
  PersonIcon,
  PhoneIcon,
  PortfolioSimulatorIcon,
  QuestionIcon,
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

import BackButton from "../BackButton"
import { routes } from "./Sidebar"
import SidebarNavItem from "./SidebarNavItem"

interface MobileDrawerProps {
  understood?: boolean
  onInviteClick?: () => void
}

function MobileDrawer(props: MobileDrawerProps) {
  const { t } = useTranslation("common")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { locale, route, pathname, query } = useRouter()
  const { user } = useUser()
  const showBackButton = useStore((state) => state.showBackButton)
  const scheduleCallUrl = pathname.endsWith("/opportunities/[id]")
    ? `/schedule-meeting?opportunityId=${query.id}`
    : "/schedule-meeting"

  const direction = locale === "ar" ? "rtl" : "ltr"

  const { data: statusData, error: statusError } =
    useSWR<UserStatuses>("/api/user/status")

  const { data: qualificationStatusData, error: qualificationStatusError } =
    useSWR<QualificationStatus>("/api/user/qualifications/status")

  const { data: portfolioSummaryData, error: portfolioSummaryError } =
    useSWR<PortfolioSummary>("/api/user/summary")

  const { data: investmentGoalsData } = useSWR<InvestorProfileGoals>(
    "/api/user/investment-goals",
  )

  const { data: rmData, error: rmError } = useSWR<RelationshipManager>(
    "/api/user/relationship-manager",
  )

  const isLoading = !rmData && !rmError
  const isRmAssigned = !isLoading && rmData?.assigned

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

  const scheduleCallLabel = React.useMemo(() => {
    if (rmData && rmData.manager) {
      return `${t("common:help.contact")} ${rmData?.manager?.firstName} 
      ${rmData?.manager?.lastName}`
    }
    return undefined
  }, [rmData, t])

  const getProposalLinkText = () => {
    if (isProposalGenerated) return "viewProposal"
    return "personalizedProposal"
  }

  return (
    <Box
      aria-label="leftNavigation"
      as="nav"
      bgColor="gray.800"
      w="full"
      pos="fixed"
      zIndex="2"
      overflow="hidden"
      h={isOpen ? "full" : showBackButton ? "96px" : "56px"}
      {...(props?.understood && {
        filter: "blur(1px)",
        opacity: "0.9",
        pointerEvents: "none",
      })}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        px="3"
        h="14"
        sx={{ direction: "ltr" }}
      >
        <Link
          aria-label="logo"
          href="/"
          _focus={{ boxShadow: "none", outline: "none" }}
          cursor="pointer"
        >
          <Logo px="2" />
        </Link>
        <Stack isInline spacing="4">
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
          <IconButton
            aria-label={isOpen ? "Close Menu" : "Hamburger Menu"}
            role="button"
            color="primary.500"
            onClick={isOpen ? onClose : onOpen}
            variant="ghost"
            px="2"
            icon={
              isOpen ? <CloseIcon w="6" h="6" /> : <HamburgerIcon w="6" h="6" />
            }
          />
        </Stack>
      </Flex>

      {!isOpen && <BackButton />}

      {isOpen && (
        <>
          <Link
            href="/profile"
            display="flex"
            p="3"
            mx="3"
            alignItems="center"
            color="primary.500"
          >
            <PersonIcon h="6" w="6" />
            <Text flex="1" fontSize="md" ms="5" fontWeight="bold">
              {user?.profile?.firstName}
            </Text>
            <CaretRightIcon
              h="6"
              w="6"
              transform={direction === "rtl" ? "rotate(180deg)" : "initial"}
            />
          </Link>

          <Center mb="8">
            <Divider color="gray.700" />
          </Center>

          <Text ps="4" fontSize="xs">
            {t("nav.heading")}
          </Text>

          <List
            as="ul"
            display="flex"
            flexDir="column"
            spacing="2"
            styleType="none"
            mt="4"
            height="calc(100% - 176px)"
            overflowY="auto"
          >
            {routes.map(({ path, icon, name }) => {
              return (
                <SidebarNavItem
                  key={path}
                  href={path}
                  onClick={onOpen}
                  icon={icon}
                  {...(!isUpportunityUnlocked && {
                    showRightContent: name === "opportunities",
                  })}
                >
                  {name}
                </SidebarNavItem>
              )
            })}
            <li style={{ flex: 1 }}>
              <Flex flex="1" />
            </li>

            {statusData && !statusError && !showPreProposalNavigation && (
              <Flex justifyContent={isOpen ? "flex-end" : "center"}>
                <List as="ul" spacing={[4, 3]} styleType="none" flex="1">
                  <Divider />
                  {(!isPreProposalStarted || !showProposalNavigation) && (
                    <Text ms={5} fontSize="10px" color="gray.600">
                      {t("nav.links.invest")}
                    </Text>
                  )}
                  {!showProposalNavigation && (
                    <SidebarNavItem
                      key="/personalized-proposal"
                      href={getRedirectionUrl()}
                      icon={PersonalizedProposalIcon}
                      section="invest"
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
                    >
                      {isOpen ? "portfolioSimulator" : ""}
                    </SidebarNavItem>
                  )}
                  <Divider />
                  <Text
                    ms={5}
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
                    label={scheduleCallLabel}
                  >
                    {isOpen ? "scheduleCall" : ""}
                  </SidebarNavItem>
                </List>
              </Flex>
            )}
            <Divider />
            <chakra.a textDecoration="none">
              <Flex
                p="4"
                alignItems="center"
                justifyContent="space-between"
                onClick={props.onInviteClick}
              >
                <Text insetEnd="rtl" fontSize="sm" color="gray.500">
                  {t("nav.links.shareInvite")}
                </Text>
                <CaretRightIcon
                  h="4"
                  w="4"
                  color="gray.500"
                  transform={direction === "rtl" ? "rotate(180deg)" : "initial"}
                />
              </Flex>
            </chakra.a>
            <Divider />
            <chakra.a
              textDecoration="none"
              href={`/api/auth/logout?lang=${locale}`}
            >
              <Flex px="4" alignItems="center" justifyContent="space-between">
                <Text insetEnd="rtl" fontSize="sm" color="gray.500">
                  {t("nav.links.signout")}
                </Text>
                <LogoutIcon
                  h="6"
                  w="6"
                  color="gray.500"
                  transform={direction === "rtl" ? "rotate(180deg)" : "initial"}
                />
              </Flex>
            </chakra.a>
          </List>
        </>
      )}
    </Box>
  )
}

export default MobileDrawer
