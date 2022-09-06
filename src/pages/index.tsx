import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import {
  Box,
  Circle,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  ListItem,
  Spacer,
  Stack,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/layout"
import {
  Button,
  chakra,
  CloseButton,
  Image,
  Progress,
  useBreakpointValue,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react"
import { Skeleton } from "@chakra-ui/skeleton"
import { format } from "date-fns"
import ky from "ky"
import NextImage from "next/image"
import router, { useRouter } from "next/router"
import Trans from "next-translate/Trans"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import Loadable from "react-loadable"
import useSWR, { mutate } from "swr"
import useSWRImmutable from "swr/immutable"

import {
  BlackCheckIcon,
  CancelRescheduleCard,
  Card,
  CardContent,
  CaretLeftIcon,
  CaretRightIcon,
  CheckIcon2,
  CloseIcon,
  InfoIcon,
  InsightCard,
  InvestmentOpportunityCard,
  Layout,
  LeftArrowIcon,
  Link,
  PageContainer,
  RefreshIcon,
  RelationshipManagerCard,
  SkeletonCard,
  SkeletonOpportunityCard,
  StartProposalFlowCard,
  Step,
  Stepper,
  TrySimulatorCard,
  WarningIcon,
} from "~/components"
import DollarConvertIcon from "~/components/Icon/DollarConvertIcon"
import GoalIcon from "~/components/Icon/GoalIcon"
import TimeHorizonIcon from "~/components/Icon/TimeHorizonIcon"
import { useUser } from "~/hooks/useUser"
import { MyTfoClient } from "~/services/mytfo"
import {
  Disclaimer,
  Insight,
  InvestorProfileGoals,
  InvestorRiskAssessment,
  KycStatus,
  MeetingDetails,
  OpportunitiesResponse,
  PastWebinar,
  PortfolioSummary,
  PreProposalInitialActionType,
  ProfileCompletionTracker,
  ProposalsStatus,
  ProposalsStatuses,
  QualificationStatus,
  UpcomingWebinar,
  User,
  UserQualificationStatus,
  UserStatuses,
} from "~/services/mytfo/types"
import { triggerFirstTimeTourEvent } from "~/utils/firstTimeTourEvents"
import formatCurrency, {
  formatCurrencyWithoutSymbol,
} from "~/utils/formatCurrency"
import formatYearName from "~/utils/formatYearName"
import {
  continuedPreProposalJourney,
  TrySimulatorEvent,
  ViewAllOpportunities,
} from "~/utils/googleEvents"
import { event, twitterEvent } from "~/utils/gtag"
import { isMinimumProfileCompleted } from "~/utils/isMinimumProfileCompleted"

// @ts-ignore
const Joyride = Loadable({
  loader: () => import("react-joyride"),
  loading: () => null,
})

interface SimulatePortfolioProps {
  userStatus: UserQualificationStatus
  qualificationStatusData?: QualificationStatus
  tfoUser: User
}

function SimulatePortfolioCard(props: SimulatePortfolioProps) {
  const { userStatus, qualificationStatusData } = props
  const { user } = useUser()
  const { t } = useTranslation("home")
  const isDesktopView = useBreakpointValue({ base: false, md: true })
  //for ipad and ipad air
  const [isLessThan830] = useMediaQuery("(max-width: 830px)")
  const isMobileView = !isDesktopView
  const router = useRouter()
  const isDisqualified = userStatus === UserQualificationStatus.Disqualified

  const { data: investmentGoalsData } = useSWR<InvestorProfileGoals>(
    "/api/user/investment-goals",
  )

  const isPortfolioCompleted =
    qualificationStatusData?.investmentGoals &&
    qualificationStatusData?.investorProfile &&
    qualificationStatusData?.riskAssessment

  if (!isDisqualified && isPortfolioCompleted) {
    return <PortfolioCompleted />
  }

  if (
    !isDisqualified &&
    qualificationStatusData &&
    qualificationStatusData?.investorProfile &&
    !isPortfolioCompleted
  ) {
    return <PortfolioIndicator qualificationStatus={qualificationStatusData} />
  }

  if (
    !isDisqualified &&
    qualificationStatusData &&
    (user?.profile?.preProposalInitialAction ===
      PreProposalInitialActionType.StartInvesting ||
      investmentGoalsData?.whoIsPortfolioFor) &&
    (qualificationStatusData?.investorProfile || user?.profile?.nationality) &&
    !isPortfolioCompleted
  ) {
    return <PortfolioIndicator qualificationStatus={qualificationStatusData} />
  }

  return (
    <Card
      bgImage={{
        base: isDisqualified
          ? "/images/disqualified-pictogram-mobile.svg"
          : "/images/opportunity-card-background-mobile.svg",
        md: "/images/opportunity-card-background.svg",
      }}
      flex="1"
      bgRepeat="no-repeat"
      bgSize="cover"
      className="reactour__unlock_opportunity"
    >
      <CardContent
        p="0"
        mb="0"
        {...(isDesktopView && {
          pe: 6,
        })}
        height="100%"
      >
        <Flex direction="row" height="100%" {...(isMobileView && { mt: "24" })}>
          <Stack
            direction="column"
            textAlign={{ base: "center", md: "start" }}
            alignItems={{ base: "center", md: "flex-start" }}
            spacing={{ base: "4", md: "8" }}
            p="6"
            {...(isDesktopView && {
              pe: 0,
              display: "flex",
              flex: isLessThan830 ? 1 : "0 1 auto",
            })}
          >
            <Box flex="1" pt="1" {...(!isDisqualified && { mb: "4" })}>
              <Text
                fontSize={isLessThan830 && isDesktopView ? "lg" : "xl"}
                fontWeight={400}
                mb="2"
                w={{ base: "full" }}
                lineHeight="shorter"
              >
                {isDisqualified
                  ? t("cta.disqualifiedPortfolio.title")
                  : t("cta.unlockOpportunity.title")}
              </Text>
              <Text
                fontSize={isLessThan830 && isDesktopView ? "xs" : "sm"}
                maxW="lg"
              >
                {isDisqualified
                  ? t("cta.disqualifiedPortfolio.description")
                  : t("cta.unlockOpportunity.description")}
              </Text>
            </Box>

            <Button
              colorScheme="primary"
              {...(isLessThan830 && isDesktopView && { size: "sm" })}
              onClick={() => {
                if (isDisqualified) {
                  router.push("/insights")
                } else {
                  event(TrySimulatorEvent)
                  router.push("/opportunities/unlock")
                }
              }}
              isFullWidth={isMobileView}
              fontSize="sm"
            >
              {isDisqualified
                ? t("cta.disqualifiedPortfolio.button")
                : t("cta.unlockOpportunity.button")}
            </Button>
          </Stack>
          {isDesktopView && (
            <Box
              {...(isDesktopView && {
                minW: isLessThan830 ? "200px" : "230px",
                marginBottom: isLessThan830
                  ? isDisqualified
                    ? "0px"
                    : "-40px"
                  : isDisqualified
                  ? "0px"
                  : "-10px",
                flex: 1,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-end",
              })}
            >
              <Image
                src={
                  isDisqualified
                    ? "/images/disqualified-pictogram.svg"
                    : "/images/opportunity-pictogram.svg"
                }
                alt={
                  isDisqualified
                    ? "Disqualified Simulator Chart"
                    : "Simulator Chart"
                }
              />
            </Box>
          )}
        </Flex>
      </CardContent>
    </Card>
  )
}

function InvestmentOpportunityList(props: { isOpportunityUnlocked: boolean }) {
  const { t, lang } = useTranslation("opportunities")
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const direction = lang === "ar" ? "rtl" : "ltr"

  const { data, error } = useSWR<OpportunitiesResponse>(
    "/api/portfolio/opportunities",
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  )

  const isLoading = !data && !error

  const noOfColumns = useBreakpointValue({ base: 1, md: 2, lg: 3 })

  const opportunitiesShown = useBreakpointValue({ base: 3, md: 2, lg: 3 })

  const RightIcon =
    direction === "rtl" ? (
      <CaretLeftIcon w="4" h="4" />
    ) : (
      <CaretRightIcon w="4" h="4" />
    )

  // Note: Pending design decisions from Product/Design.
  if (error) {
    return null
  }

  return (
    <Box w="full">
      <VStack justifyContent="space-between" alignItems="start" pb="8">
        {isMobileView ? (
          <Heading as="h2" fontSize={["xl", "2xl"]}>
            {t("index.heading")}
          </Heading>
        ) : (
          <HStack
            justifyContent="space-between"
            alignItems="center"
            pb="1"
            w="full"
            spacing="0"
          >
            <Heading as="h2" fontSize={["xl", "2xl"]}>
              {t("index.heading")}
            </Heading>
            <Button
              colorScheme="primary"
              onClick={() => {
                event(ViewAllOpportunities)
                router.push("/opportunities")
              }}
              variant="link"
              size="sm"
              rightIcon={RightIcon}
            >
              {t("common:button.seeMore")}
            </Button>
          </HStack>
        )}
        <Text fontSize="sm" color="gray.400">
          {t("index.opportunitySubheading")}
        </Text>
      </VStack>

      <Grid
        templateColumns={`repeat(${noOfColumns}, 1fr)`}
        width="full"
        gap={{ base: "8", md: "6", lg: "6" }}
        justifyContent="space-between"
      >
        {isLoading ? (
          <>
            <SkeletonOpportunityCard flex="1 0 218px" />
            <SkeletonOpportunityCard flex="1 0 218px" />
            <SkeletonOpportunityCard flex="1 0 218px" />
          </>
        ) : (
          <>
            {data?.opportunities
              .slice(0, opportunitiesShown)
              .map((opportunity) => {
                return (
                  <InvestmentOpportunityCard
                    key={opportunity.id}
                    data={opportunity}
                    status={data?.status}
                    variant="detailed"
                    {...(!props.isOpportunityUnlocked && { hasOverlay: true })}
                  />
                )
              })}
          </>
        )}
      </Grid>

      {isMobileView && (
        <Box mt={8}>
          <Button
            colorScheme="primary"
            onClick={() => {
              event(ViewAllOpportunities)
              router.push("/opportunities")
            }}
            variant="outline"
            isFullWidth={true}
          >
            {t("common:button.seeMore")}
          </Button>
        </Box>
      )}
    </Box>
  )
}

interface PastWebinarProps {
  pastWebinarInfo: PastWebinar
}

function PastWebinarCard(props: PastWebinarProps) {
  const { pastWebinarInfo } = props
  const { t } = useTranslation("home")
  const { guests, id, title, description, publishDate } = pastWebinarInfo

  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isDesktopView = !isMobileView

  const renderCTA = () => (
    <HStack>
      <Button
        colorScheme="primary"
        variant="solid"
        onClick={() => router.push(`/insights/webinars/${id}`)}
      >
        {t("cta.pastWebinar.button.watchItNow")}
      </Button>
      <Button
        colorScheme="primary"
        variant="outline"
        onClick={() => router.push(`/insights/webinars/`)}
      >
        {t("cta.pastWebinar.button.viewAllWebinars")}
      </Button>
    </HStack>
  )

  return (
    <Box w="full" className="reactour__webinar">
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gridAutoFlow="row">
        <VStack
          spacing="4"
          alignItems="flex-start"
          pb={{ base: 4, md: 0 }}
          {...(isDesktopView && { me: 8 })}
        >
          <Text color="secondary.500" fontSize={{ base: "sm", md: "md" }}>
            {t("cta.pastWebinar.title")}
          </Text>
          <Text
            color="white"
            fontSize={{ base: "xl", md: "2xl" }}
            maxW="md"
            {...(isDesktopView && { pb: "6" })}
          >
            {title}
          </Text>
          <Text
            alignSelf="flex-start"
            color="gray.400"
            fontSize="sm"
            noOfLines={2}
            lineHeight="162%"
            mb={4}
          >
            {description}
          </Text>
          <Text
            alignSelf="flex-start"
            color="gray.400"
            fontSize="sm"
            noOfLines={2}
            lineHeight="120%"
          >
            {format(new Date(publishDate), "MMM dd yyyy")}
          </Text>
          {isDesktopView && renderCTA()}
        </VStack>
        <Stack
          direction="column"
          spacing="10"
          {...(isDesktopView && { mt: 7 })}
        >
          {guests?.length &&
            guests.map((item, index) => (
              <Stack direction="row" spacing={4} key={item.id + "_" + index}>
                <Box
                  __css={{
                    "& img": {
                      borderRadius: "md",
                    },
                    width: isDesktopView ? "100px" : "68px",
                    height: isDesktopView ? "100px" : "68px",
                  }}
                >
                  {item.picture && (
                    <NextImage
                      src={item.picture}
                      alt="Guest image"
                      width={isDesktopView ? "100px" : "68px"}
                      height={isDesktopView ? "100px" : "68px"}
                      layout="fixed"
                    />
                  )}
                </Box>

                <Stack direction="column" spacing={{ base: 1, md: 2 }} mt={1}>
                  <Text
                    alignSelf="flex-start"
                    color="gray.400"
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    {item.type}
                  </Text>
                  <Text
                    alignSelf="flex-start"
                    color="white"
                    fontSize="md"
                    maxW="150px"
                  >
                    {item.name}
                  </Text>
                  <Text
                    alignSelf="flex-start"
                    color="gray.400"
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    {item.title}
                  </Text>
                </Stack>
              </Stack>
            ))}
        </Stack>
        {isMobileView && <Box mt={8}>{renderCTA()}</Box>}
      </Grid>
    </Box>
  )
}

function InsightsList() {
  const { t, lang } = useTranslation("insights")
  const isDesktopView = useBreakpointValue({ base: false, md: true })

  const { data, error } = useSWRImmutable<Insight[]>(
    "/api/portfolio/insights/dashboard",
  )

  const direction = lang === "ar" ? "rtl" : "ltr"
  const isLoading = !data && !error

  // Note: Pending design decisions from Product/Design.
  if (error) {
    return null
  }

  const cardLimit = 3

  const RightIcon =
    direction === "rtl" ? (
      <CaretLeftIcon w="4" h="4" />
    ) : (
      <CaretRightIcon w="4" h="4" />
    )

  return (
    <Box w="full" className="reactour__insights">
      {isDesktopView ? (
        <HStack justifyContent="space-between" alignItems="center" pb="8">
          <Heading as="h2" fontSize={["xl", "2xl"]}>
            {t("heading")}
          </Heading>

          <Button
            colorScheme="primary"
            as={Link}
            role="link"
            href="/insights"
            variant="link"
            size="sm"
            rightIcon={RightIcon}
          >
            {t("common:button.seeMore")}
          </Button>
        </HStack>
      ) : (
        <Heading as="h2" fontSize={["xl", "2xl"]} mb={7}>
          {t("heading")}
        </Heading>
      )}

      <Grid
        templateColumns={`repeat(${isDesktopView ? 3 : 1}, 1fr)`}
        width="full"
        gap={{ base: "8", md: "6", lg: "8" }}
      >
        {isLoading ? (
          <>
            <SkeletonOpportunityCard flex="1 0 218px" />
            {isDesktopView && (
              <>
                <SkeletonOpportunityCard flex="1 0 218px" />
                <SkeletonOpportunityCard flex="1 0 218px" />
              </>
            )}
          </>
        ) : (
          <>
            {data?.slice(0, cardLimit).map((insight) => {
              return <InsightCard insight={insight} key={insight.id} />
            })}
          </>
        )}
      </Grid>
      {!isDesktopView && (
        <Box mt={8}>
          <Button
            colorScheme="primary"
            as={Link}
            role="link"
            href="/insights"
            variant="outline"
            isFullWidth={true}
          >
            {t("common:button.seeMore")}
          </Button>
        </Box>
      )}
    </Box>
  )
}

interface PortfolioIndicatorProps {
  qualificationStatus: QualificationStatus
}

function PortfolioIndicator(props: PortfolioIndicatorProps) {
  const { t, lang } = useTranslation("home")
  const { qualificationStatus } = props
  const isMobileView = useBreakpointValue({ base: true, lg: false })
  const isTabletView = useBreakpointValue({ base: false, md: true, lg: false })
  const isDesktopView = !isMobileView

  const direction = lang === "ar" ? "rtl" : "ltr"

  const { data: statusData, error: statusError } =
    useSWR<UserStatuses>("/api/user/status")
  const isLoading = !statusData && !statusError

  const { data: userRiskQuestions, error: userRiskError } =
    useSWR<InvestorRiskAssessment>("/api/user/risk-assessment")

  const isVerified =
    !isLoading && statusData?.status === UserQualificationStatus.Verified

  const getSteps = (status: QualificationStatus) => [
    {
      key: "stepOne",
      completed: status.investorProfile,
    },
    {
      key: "stepTwo",
      completed: status.investmentGoals,
    },
    {
      key: "stepThree",
      completed: status.riskAssessment,
    },
  ]

  const getActiveStepConfig = (status: QualificationStatus) => {
    if (status.investmentGoals) {
      return {
        redirectionUrl:
          !userRiskError && userRiskQuestions?.q9 !== null
            ? "/proposal/risk-assessment/result"
            : "/proposal/risk-assessment#1",
        activeStep: 3,
      }
    } else if (status.investorProfile) {
      return { redirectionUrl: "/proposal/investment-goals", activeStep: 2 }
    }

    return { redirectionUrl: "/proposal/investor-profile", activeStep: 1 }
  }

  const { activeStep, redirectionUrl } =
    getActiveStepConfig(qualificationStatus)

  return (
    <Card maxW="2xl" flex="1" bg="gunmetal.500">
      <CardContent
        pb="4"
        w="full"
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="space-between"
      >
        <Flex
          direction={{ base: "column-reverse", md: "row" }}
          mb={{ base: "8", md: "5", lg: "8" }}
        >
          <Box
            textAlign={{ base: "center", md: "inherit" }}
            mt={{ base: "4", md: "initial" }}
          >
            <Heading fontSize="2xl" color="white" mb={{ base: "2", md: "4" }}>
              {t("cta.portfolioIndicator.title")}
            </Heading>
            <Text fontSize="sm" color="gray.400">
              {qualificationStatus?.investorProfile &&
              qualificationStatus?.investmentGoals
                ? t("cta.portfolioIndicator.completedDescription")
                : t("cta.portfolioIndicator.description")}
            </Text>
          </Box>
          <Spacer />
        </Flex>
        <Divider borderColor="gray.800" opacity="1" />
        <Flex
          direction={{ base: "column", md: "row" }}
          mb={{ base: "2", lg: "0" }}
        >
          <Stack
            maxW="365px"
            direction={{ base: "row", lg: "column" }}
            mt="6"
            {...(isVerified && isDesktopView && { mt: "4" })}
            mx="-15px"
            mb={{ base: "4", md: "0" }}
          >
            <Stepper
              activeStep={activeStep}
              orientation={
                isDesktopView && !isTabletView ? "horizontal" : "vertical"
              }
              {...(isMobileView && { w: "90%" })}
              alternativeLabel={true}
            >
              {getSteps(qualificationStatus).map((step, index) => (
                <Stack
                  direction={{ base: "row", md: "row", lg: "column" }}
                  key={index}
                  {...(activeStep === index + 1 && {
                    backgroundColor: "gunmetal.800WithOpacity",
                  })}
                  ps="4"
                  pt={{ base: "0", md: 2, lg: 3 }}
                  pb={{ base: "0", md: 2, lg: 3 }}
                  pr={{ base: "0", md: "12", lg: "0" }}
                >
                  <Step
                    index={index}
                    completed={step.completed}
                    key={step.key}
                    beingVerified={!isVerified}
                    isLast={index === getSteps(qualificationStatus).length - 1}
                    proposalIndicator={true}
                  ></Step>
                  <Stack spacing="0" key={index}>
                    <Text
                      fontSize={{ base: "sm", md: "xs" }}
                      minW={lang === "ar" ? "135px" : "120px"}
                      color={activeStep === index + 1 ? "white" : "gray.500"}
                      mt={{ base: 2, md: 0, lg: 2 }}
                      mb="1"
                      fontWeight="bold"
                    >
                      {t(`cta.portfolioIndicator.stepper.${step.key}.title`)}
                    </Text>
                    {!isLoading && (
                      <Text fontSize="xs" color="gray.500">
                        {step.completed
                          ? step.key === "stepOne" && isVerified
                            ? t(
                                `cta.portfolioIndicator.stepper.${step.key}.verifiedDesc`,
                              )
                            : t(
                                `cta.portfolioIndicator.stepper.${step.key}.completedDesc`,
                              )
                          : t(
                              `cta.portfolioIndicator.stepper.${step.key}.activeDesc`,
                            )}
                      </Text>
                    )}
                  </Stack>
                </Stack>
              ))}
            </Stepper>
          </Stack>
          <Spacer />

          <Button
            variant="solid"
            alignSelf="flex-end"
            colorScheme="primary"
            isFullWidth={isMobileView && !isTabletView}
            {...((isDesktopView || isTabletView) && {
              rightIcon:
                direction === "rtl" ? (
                  <CaretLeftIcon w="6" h="6" />
                ) : (
                  <CaretRightIcon w="5" h="5" />
                ),
            })}
            px="1"
            ps="2"
            mb="2"
            onClick={() => {
              if (activeStep == 2) {
                event(continuedPreProposalJourney)
              }
              router.push(redirectionUrl)
            }}
          >
            {t("cta.portfolioIndicator.button.continue")}
          </Button>
        </Flex>
      </CardContent>
    </Card>
  )
}

interface ProposalKycIndicatorProps {
  kycStatusData: KycStatus
  user: User
}

function ProposalKycIndicator(props: ProposalKycIndicatorProps) {
  const { t, lang } = useTranslation("home")
  const { kycStatusData, user } = props
  const isMobileView = useBreakpointValue({ base: true, lg: false })
  const isTabletView = useBreakpointValue({ base: false, md: true, lg: false })
  const isDesktopView = !isMobileView

  const direction = lang === "ar" ? "rtl" : "ltr"

  const isKycCompleted =
    kycStatusData?.personalInfoCompleted &&
    kycStatusData?.investmentExperienceCompleted &&
    kycStatusData?.identityVerificationCompleted &&
    kycStatusData?.callScheduled

  const twoStepCompleted =
    kycStatusData?.personalInfoCompleted &&
    kycStatusData?.investmentExperienceCompleted

  const getSteps = (status: KycStatus) => [
    {
      key: "stepOne",
      completed: status.personalInfoCompleted,
    },
    {
      key: "stepTwo",
      completed: status.investmentExperienceCompleted,
    },
    {
      key: "stepThree",
      completed: status.identityVerificationCompleted && status.callScheduled,
    },
  ]

  const getActiveStepConfig = (status: KycStatus) => {
    if (status.investmentExperienceCompleted) {
      return { redirectionUrl: "/kyc", activeStep: 3 }
    } else if (status.personalInfoCompleted) {
      return { redirectionUrl: "/kyc/investment-experience", activeStep: 2 }
    }
    const kycPersonalInformationLink = "/kyc/personal-information"
    if (user?.profile?.nationality === "SA") {
      return { redirectionUrl: "/kyc", activeStep: 1 }
    }
    return { redirectionUrl: kycPersonalInformationLink, activeStep: 1 }
  }

  const { activeStep, redirectionUrl } = getActiveStepConfig(kycStatusData)

  if (isKycCompleted) {
    return (
      <Card
        aria-label="kycCompletedCard"
        w="full"
        bgImage={{
          base: "/images/proposal-background-mobile.svg",
          md: "/images/proposal-background-desktop.svg",
        }}
      >
        <CardContent
          pb="4"
          w="full"
          display="flex"
          flexDirection="column"
          height="100%"
          justifyContent="space-between"
        >
          <Flex
            direction={{ base: "column-reverse", md: "row" }}
            mb={{ base: "4", md: "3", lg: "3" }}
            {...(!isDesktopView && !isTabletView && { mt: 24 })}
          >
            <Box
              textAlign={{ base: "center", md: "inherit" }}
              mt={{ base: "-4", md: "1" }}
            >
              <Heading fontSize="2xl" color="white" mb={{ base: "2", md: "4" }}>
                {t(`cta.kycIndicator.completedTitle`)}
                <CheckIcon2 w="6" h="6" color="green.500" ms="2" />
              </Heading>

              <Trans
                i18nKey="home:cta.kycIndicator.completedDescription"
                components={[
                  <Text
                    fontSize="sm"
                    color="gray.400"
                    key="0"
                    w={isTabletView ? "lg" : isMobileView ? "300px" : "2xl"}
                  />,
                  <chakra.a
                    border="none"
                    colorScheme="primary"
                    variant="link"
                    size="sm"
                    href={
                      lang === "ar"
                        ? "/ar/personalized-proposal"
                        : "/personalized-proposal"
                    }
                    key="1"
                  />,
                ]}
              />
            </Box>
            {(isDesktopView || isTabletView) && (
              <Box
                display="flex"
                flex="1"
                alignItems="flex-end"
                justifyContent="flex-end"
                position="absolute"
                right="0px"
                bottom="0px"
                {...(lang === "ar" && {
                  transform: "scaleX(-1)",
                })}
              >
                <Image
                  src={"/images/proposal-pictogram.svg"}
                  alt="proposal-chart"
                />
              </Box>
            )}
          </Flex>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      minW="full"
      bgImage={{
        base: "/images/kyc-tracker-background-mobile.svg",
        md: "/images/kyc-tracker-background.svg",
      }}
      bgSize="cover"
    >
      <CardContent
        aria-label="KYCTrackerCard"
        pb="8"
        minW="full"
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="space-between"
      >
        <Flex
          direction={{ base: "column-reverse", md: "row" }}
          mb={{ base: "0", md: "0", lg: "8" }}
        >
          <Box
            textAlign={{ base: "center", md: "inherit" }}
            mt={{ base: "4", md: "1" }}
          >
            <Heading fontSize="2xl" color="white" mb={{ base: "2", md: "4" }}>
              {twoStepCompleted
                ? t(`cta.kycIndicator.keepGoingTitle`)
                : t(`cta.kycIndicator.title`)}
              {!twoStepCompleted && (
                <CheckIcon2 w="6" h="6" color="green.500" ms="2" />
              )}
            </Heading>

            <Trans
              i18nKey="home:cta.kycIndicator.description"
              components={[
                <Text
                  fontSize="sm"
                  color="gray.400"
                  w={isTabletView ? "xl" : isMobileView ? "280px" : "2xl"}
                  key="0"
                />,
                <chakra.a
                  border="none"
                  colorScheme="primary"
                  variant="link"
                  size="sm"
                  href={
                    lang === "ar"
                      ? "/ar/personalized-proposal"
                      : "/personalized-proposal"
                  }
                  key="1"
                />,
              ]}
            />
          </Box>
          <Spacer />
        </Flex>

        <Flex
          direction={{ base: "column", md: "column", lg: "row" }}
          mb={{ base: "2", lg: "0" }}
        >
          <Stack
            maxW="365px"
            direction={{ base: "row", lg: "column" }}
            mt="6"
            mb={{ base: "4", md: "0" }}
            {...(isTabletView && { w: "365px" })}
          >
            <Stepper
              activeStep={activeStep}
              orientation={
                isMobileView && !isTabletView ? "vertical" : "horizontal"
              }
              alternativeLabel={true}
            >
              {getSteps(kycStatusData).map((step, index) => (
                <Stack
                  direction={{
                    base: isTabletView ? "column" : "row",
                    lg: "column",
                  }}
                  key={index}
                  {...(activeStep === index + 1 && {
                    backgroundColor: "gunmetal.800WithOpacity",
                  })}
                  ps="3"
                  py={{ base: "0", md: "3" }}
                  pt={{ base: "2" }}
                >
                  <Step
                    index={index}
                    completed={step.completed}
                    key={step.key}
                  ></Step>
                  <Stack spacing="0" key={index}>
                    <Text
                      fontSize={{ base: "sm", md: "xs" }}
                      minW={{ base: "120px", md: "190px", lg: "190px" }}
                      color={activeStep === index + 1 ? "white" : "gray.500"}
                      mb="1"
                      mt={{ base: 2, md: 0, lg: 2 }}
                      fontWeight="bold"
                    >
                      {t(`cta.kycIndicator.stepper.${step.key}.title`)}
                    </Text>
                    {kycStatusData && (
                      <Text fontSize="xs" color="gray.500">
                        {step.completed
                          ? t(
                              `cta.kycIndicator.stepper.${step.key}.completedDesc`,
                            )
                          : t(
                              `cta.kycIndicator.stepper.${step.key}.activeDesc`,
                            )}
                      </Text>
                    )}
                  </Stack>
                </Stack>
              ))}
            </Stepper>
          </Stack>
          <Spacer />

          <Button
            variant="solid"
            alignSelf={
              isDesktopView && !isTabletView ? "flex-end" : "flex-start"
            }
            colorScheme="primary"
            isFullWidth={isMobileView && !isTabletView}
            mt={{ base: "0", md: "4", lg: "4" }}
            {...(isDesktopView && !isTabletView && { px: "2" })}
            rightIcon={
              direction === "rtl" ? (
                <CaretLeftIcon w="6" h="6" />
              ) : (
                <CaretRightIcon w="6" h="6" />
              )
            }
            onClick={() => router.push(redirectionUrl)}
          >
            {t(`cta.kycIndicator.button.completeOnboarding`)}
          </Button>
        </Flex>
      </CardContent>
    </Card>
  )
}

function PortfolioCompleted() {
  const { t, lang } = useTranslation("home")
  const toast = useToast()

  // Required to prevent duplicate toasts.
  const toastId = "toast-error"
  const toastIdRef = React.useRef(0)

  function close() {
    if (toastIdRef?.current) {
      toast.close(toastIdRef.current)
    }
  }

  const isTabletView = useBreakpointValue({ base: false, md: true, lg: false })
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isDesktopView = !isMobileView
  const [isLessThan830] = useMediaQuery("(max-width: 810px)")
  const { data: portfolioSummaryData, error: portfolioSummaryError } =
    useSWR<PortfolioSummary>("/api/user/summary")

  const isLoading = !portfolioSummaryData && !portfolioSummaryError

  const { data: statusData, error: statusError } =
    useSWR<UserStatuses>("/api/user/status")
  const isUserStatusLoading = !statusData && !statusError

  const isVerified =
    !isUserStatusLoading &&
    statusData?.status === UserQualificationStatus.Verified

  const generateProposal = async () => {
    try {
      await ky.post("/api/user/proposals").json()

      router.push("/personalized-proposal")
    } catch (error) {
      // Show toast error.
      if (!toast.isActive(toastId)) {
        toastIdRef.current = toast({
          isClosable: true,
          position: "bottom",
          render: () => (
            <HStack
              py="3"
              ps="10px"
              pe="4"
              bg="gray.800"
              direction="row"
              alignItems="center"
              borderStart="6px solid var(--chakra-colors-red-500)"
              borderRadius="2px"
              role="alert"
              justifyContent="center"
            >
              <HStack>
                <WarningIcon w="20px" h="20px" color="red.500" />
                <Text fontSize="md" color="white">
                  {t("common:toast.generic.error.title")}
                </Text>
              </HStack>

              <CloseButton onClick={close} />
            </HStack>
          ),
        }) as number
      }
    }
  }

  return (
    <Card maxW={{ base: "full", md: "2xl" }} flex="1" bg="gunmetal.500">
      <CardContent
        pb="8"
        w="full"
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="space-between"
        px={isTabletView ? 4 : 6}
      >
        {!isLoading && (
          <>
            <Flex direction={{ base: "column-reverse", md: "row" }}>
              <Stack
                direction={{ base: "column", md: "row" }}
                textAlign={{ base: "center", md: "inherit" }}
                spacing="6"
                mt={{ base: "4", md: "initial" }}
              >
                {portfolioSummaryData?.lastProposalDate ? (
                  <Box pt="0">
                    <NextImage
                      src="/images/portfolio-proposal.svg"
                      alt="proposal ready image"
                      width={isTabletView ? "40px" : "48px"}
                      height={isTabletView ? "40px" : "48px"}
                    />
                  </Box>
                ) : (
                  <Circle
                    size="12"
                    alignSelf="center"
                    position="relative"
                    _before={{
                      content: '""',
                      bg: "secondary.800",
                      opacity: "0.2",
                      position: "absolute",
                      width: "full",
                      height: "full",
                      borderRadius: "full",
                    }}
                  >
                    <RefreshIcon color="secondary.500" w="8" h="8" />
                  </Circle>
                )}

                <Stack
                  direction={
                    portfolioSummaryData?.lastProposalDate
                      ? "column-reverse"
                      : "column"
                  }
                  spacing="1"
                >
                  <Heading
                    fontSize={isTabletView ? "lg" : "2xl"}
                    color="white"
                    mb={{ base: "1", md: "3", lg: "1" }}
                  >
                    {portfolioSummaryData?.lastProposalDate
                      ? t("cta.portfolioCompleted.completedTitle")
                      : isVerified
                      ? t("cta.portfolioCompleted.generatingProposal")
                      : t("cta.portfolioCompleted.title")}
                  </Heading>
                  <Text fontSize={{ base: "sm", md: "xs" }} color="gray.400">
                    {portfolioSummaryData?.lastProposalDate ? (
                      <chakra.span fontSize="10px">{`${t(
                        "cta.portfolioCompleted.lastUpdate",
                      )} ${
                        portfolioSummaryData?.lastProposalDate
                      }`}</chakra.span>
                    ) : (
                      !isVerified && t("cta.portfolioCompleted.description")
                    )}
                  </Text>
                </Stack>
              </Stack>
            </Flex>
            <Flex
              direction={{ base: "column", md: "row" }}
              mt={{ base: "4", md: "0" }}
            >
              <Stack
                direction="column"
                {...(!isTabletView && { position: "relative" })}
              >
                <Stack direction={{ base: "column", md: "row" }}>
                  <Box
                    {...(isMobileView && { borderBottom: "1px", pb: "4" })}
                    borderColor="raisinBlack.500"
                    pt={{ base: "0", md: "2" }}
                  >
                    <Stack
                      direction="row"
                      textAlign={{ base: "center", md: "inherit" }}
                    >
                      <GoalIcon color="secondary.500" h="6" w="6" mr="1" />
                      <Box>
                        <Text
                          color="gray.400"
                          fontSize={isTabletView ? "10px" : "xs"}
                          textAlign="start"
                          mb="1"
                        >
                          {t("cta.portfolioCompleted.labels.goal")}
                        </Text>
                        {portfolioSummaryData && (
                          <Text
                            fontSize={isTabletView ? "10px" : "xs"}
                            textAlign="start"
                          >
                            {portfolioSummaryData?.goal.length > 1 ? (
                              <UnorderedList>
                                {portfolioSummaryData?.goal.map((item) => (
                                  <ListItem color="white" key={item}>
                                    {t(`cta.portfolioCompleted.goal.${item}`)}
                                  </ListItem>
                                ))}
                              </UnorderedList>
                            ) : (
                              t(
                                `cta.portfolioCompleted.goal.${portfolioSummaryData?.goal[0]}`,
                              )
                            )}
                          </Text>
                        )}
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
                {((isDesktopView && !isTabletView) || isMobileView) && (
                  <Stack
                    direction={{ base: "column", md: "row" }}
                    spacing={{ base: "0", md: "12" }}
                  >
                    <Stack
                      direction={{ base: "column", md: "row" }}
                      {...(isDesktopView && {
                        borderTop: "1px",
                      })}
                      borderColor="raisinBlack.500"
                      maxW={isTabletView ? "310px" : "320px"}
                    >
                      <Box
                        {...(isMobileView && {
                          borderBottom: "1px",
                          pb: "4",
                        })}
                        borderWidth="90%"
                        borderColor="raisinBlack.500"
                        minW="170px"
                        pt={{ base: "0", md: "2" }}
                      >
                        <Stack
                          direction="row"
                          textAlign={{ base: "center", md: "inherit" }}
                          mt={{ base: "1", md: "initial" }}
                          {...(isDesktopView && {
                            borderRight: "1px",
                          })}
                          borderColor="raisinBlack.500"
                        >
                          <DollarConvertIcon
                            color="secondary.500"
                            h="6"
                            w="6"
                            mr="1"
                          />
                          <Box>
                            <Text
                              color="gray.400"
                              fontSize={isTabletView ? "10px" : "xs"}
                              textAlign="start"
                              mb="1"
                            >
                              {t(
                                "cta.portfolioCompleted.labels.investmentAmount",
                              )}
                            </Text>
                            {portfolioSummaryData && (
                              <Text
                                fontSize={isTabletView ? "10px" : "xs"}
                                textAlign="start"
                              >
                                {lang === "ar"
                                  ? `${formatCurrencyWithoutSymbol(
                                      portfolioSummaryData?.investmentAmount,
                                    )} ${t("common:generic.dollar")}`
                                  : formatCurrency(
                                      portfolioSummaryData?.investmentAmount,
                                    )}
                              </Text>
                            )}
                          </Box>
                        </Stack>
                      </Box>
                      <Box
                        borderColor="raisinBlack.500"
                        pl={{ base: "0", md: "4" }}
                        pt={{ base: "0", md: "2" }}
                        minW={
                          isTabletView
                            ? isLessThan830
                              ? "140px"
                              : "180px"
                            : "218px"
                        }
                      >
                        <Stack
                          direction="row"
                          textAlign={{ base: "center", md: "inherit" }}
                          mt={{ base: "1", md: "initial" }}
                        >
                          <TimeHorizonIcon
                            color="secondary.500"
                            h="6"
                            w="6"
                            mr="1"
                          />
                          <Box>
                            <Text
                              color="gray.400"
                              fontSize={isTabletView ? "10px" : "xs"}
                              textAlign="start"
                              mb="1"
                            >
                              {t("cta.portfolioCompleted.labels.timeHorizon")}
                            </Text>
                            <Text
                              fontSize={isTabletView ? "10px" : "xs"}
                              textAlign="start"
                            >
                              {portfolioSummaryData?.timeHorizon}{" "}
                              {formatYearName(
                                portfolioSummaryData?.timeHorizon,
                                lang,
                              )}
                            </Text>
                          </Box>
                        </Stack>
                      </Box>
                    </Stack>

                    <Box justifyContent="flex-end" position="relative">
                      {(portfolioSummaryData?.lastProposalDate ||
                        isVerified) && (
                        <Button
                          colorScheme="primary"
                          onClick={() =>
                            portfolioSummaryData?.lastProposalDate
                              ? router.push("/personalized-proposal")
                              : generateProposal()
                          }
                          mt={{ base: "4", md: "0" }}
                          isFullWidth={isMobileView}
                          fontSize="sm"
                          px={isTabletView ? 1 : 2}
                          maxH={isTabletView ? 6 : "xs"}
                          {...(isDesktopView && {
                            rightIcon: (
                              <CaretRightIcon
                                w="4"
                                h="4"
                                {...(lang === "ar" && {
                                  transform: "rotate(180deg)",
                                })}
                              />
                            ),
                          })}
                        >
                          <Text fontSize={isTabletView ? "xs" : "sm"}>
                            {portfolioSummaryData?.lastProposalDate
                              ? t("cta.portfolioCompleted.button.viewDetails")
                              : t(
                                  "cta.portfolioCompleted.button.generateProposal",
                                )}
                          </Text>
                        </Button>
                      )}
                    </Box>
                  </Stack>
                )}
                {isTabletView && (
                  <Flex direction={{ base: "column", md: "row" }}>
                    <Stack
                      direction="column"
                      {...(isDesktopView && {
                        borderTop: "1px",
                      })}
                      borderColor="raisinBlack.500"
                      maxW={isTabletView ? "310px" : "360px"}
                    >
                      <Box
                        borderBottom="1px"
                        pb="4"
                        borderWidth="90%"
                        borderColor="raisinBlack.500"
                        minW={{ base: "170px", md: "250px", lg: "300px" }}
                        pt={{ base: "0", md: "2" }}
                      >
                        <Stack
                          direction="row"
                          textAlign={{ base: "center", md: "inherit" }}
                          mt={{ base: "1", md: "initial" }}
                          borderColor="raisinBlack.500"
                        >
                          <DollarConvertIcon
                            color="secondary.500"
                            h="6"
                            w="6"
                            mr="1"
                          />
                          <Box>
                            <Text
                              color="gray.400"
                              fontSize={isTabletView ? "10px" : "xs"}
                              textAlign="start"
                              mb="1"
                            >
                              {t(
                                "cta.portfolioCompleted.labels.investmentAmount",
                              )}
                            </Text>
                            {portfolioSummaryData && (
                              <Text
                                fontSize={isTabletView ? "10px" : "xs"}
                                textAlign="start"
                              >
                                {lang === "ar"
                                  ? `${formatCurrencyWithoutSymbol(
                                      portfolioSummaryData?.investmentAmount,
                                    )} ${t("common:generic.dollar")}`
                                  : formatCurrency(
                                      portfolioSummaryData?.investmentAmount,
                                    )}
                              </Text>
                            )}
                          </Box>
                        </Stack>
                      </Box>
                      <Box
                        borderColor="raisinBlack.500"
                        pt={{ base: "0", md: "2" }}
                        minW={
                          isTabletView
                            ? isLessThan830
                              ? "140px"
                              : "180px"
                            : "218px"
                        }
                      >
                        <Stack
                          direction="row"
                          textAlign={{ base: "center", md: "inherit" }}
                          mt={{ base: "1", md: "initial" }}
                        >
                          <TimeHorizonIcon
                            color="secondary.500"
                            h="6"
                            w="6"
                            mr="1"
                          />
                          <Box>
                            <Text
                              color="gray.400"
                              fontSize={isTabletView ? "10px" : "xs"}
                              textAlign="start"
                              mb="1"
                            >
                              {t("cta.portfolioCompleted.labels.timeHorizon")}
                            </Text>
                            <Text
                              fontSize={isTabletView ? "10px" : "xs"}
                              textAlign="start"
                            >
                              {portfolioSummaryData?.timeHorizon}{" "}
                              {formatYearName(
                                portfolioSummaryData?.timeHorizon,
                                lang,
                              )}
                            </Text>
                          </Box>
                        </Stack>
                      </Box>
                    </Stack>

                    <Box position="absolute" right="8" bottom="6">
                      {(portfolioSummaryData?.lastProposalDate ||
                        isVerified) && (
                        <Button
                          alignSelf="flex-end"
                          colorScheme="primary"
                          onClick={() =>
                            portfolioSummaryData?.lastProposalDate
                              ? router.push("/personalized-proposal")
                              : generateProposal()
                          }
                          isFullWidth={isMobileView}
                          fontSize="sm"
                          px={isTabletView ? 1 : 2}
                          {...(isTabletView && {
                            rightIcon: (
                              <CaretRightIcon
                                w="4"
                                h="4"
                                {...(lang === "ar" && {
                                  transform: "rotate(180deg)",
                                })}
                              />
                            ),
                          })}
                        >
                          <Text fontSize={isTabletView ? "xs" : "sm"}>
                            {portfolioSummaryData?.lastProposalDate
                              ? t("cta.portfolioCompleted.button.viewDetails")
                              : t(
                                  "cta.portfolioCompleted.button.generateProposal",
                                )}
                          </Text>
                        </Button>
                      )}
                    </Box>
                  </Flex>
                )}
              </Stack>
            </Flex>
          </>
        )}
      </CardContent>
    </Card>
  )
}

interface DashboardScreenProps {
  tfoUser: User
  isSocial: Boolean
}

function DashboardScreen(props: DashboardScreenProps) {
  const { tfoUser: user, isSocial } = props
  const isDesktopView = useBreakpointValue({ base: false, md: false, lg: true })
  const isTabletView = useBreakpointValue({ base: false, md: true, lg: false })
  const { t, lang } = useTranslation("home")

  const toast = useToast()
  // Required to prevent duplicate toasts.
  const toastId = "toast-error"
  const toastIdRef = React.useRef(0)

  const { data: qualificationStatusData, error: qualificationStatusError } =
    useSWR<QualificationStatus>("/api/user/qualifications/status")

  const [understood, setUnderstood] = React.useState<boolean>(true)
  const [disclaimerLoader, setDisclaimerLoader] = React.useState(false)
  const [isPageLoading, setIsPageLoading] = React.useState(false)
  const [isTourOpen, setIsTourOpen] = React.useState(
    user.isFirstTimeLogin || false,
  )
  const [currentTourStep, setCurrentTourStep] = React.useState(0)

  const isLoading = !qualificationStatusData && !qualificationStatusError

  const { data: userStatusData, error: userStatusError } =
    useSWR<UserStatuses>("/api/user/status")

  const isUserStatusLoading = !userStatusData && !userStatusError

  const { data: upcomingWebinarData = [], error: upcomingWebinarError } =
    useSWRImmutable<UpcomingWebinar[]>("/api/portfolio/webinars/upcomings")

  const isUpcomingWebinarLoading = !upcomingWebinarData && !upcomingWebinarError

  const { data: pastWebinarData, error: pastWebinarError } =
    useSWRImmutable<PastWebinar>("/api/portfolio/insights/webinars/recent")

  const { data: proposalStatusData, error: proposalStatusError } =
    useSWR<ProposalsStatus>("/api/user/proposals/status")

  const { data: kycStatusData, error: kycStatusError } = useSWR<KycStatus>(
    "/api/user/kyc/status",
  )

  const isKycLoading = !kycStatusData && !kycStatusError

  const { data: disclaimerStatus, error: disclaimerError } = useSWR<Disclaimer>(
    "/api/user/preference/disclaimer",
  )

  const { data: profileTrackerInfo, error: profileTrackerError } =
    useSWR<ProfileCompletionTracker>("/api/user/profile-tracker")

  const isProfileTrackerInfoLoading =
    !profileTrackerInfo && !profileTrackerError

  const { data: meetingDetail, error: meetingError } = useSWR<MeetingDetails>(
    "/api/portfolio/meetings/latest-meeting-detail",
  )

  const isMeetingInfoLoading = !meetingDetail && !meetingError

  const { data: qualificationStatus, error: qualificationstatusError } =
    useSWR<OpportunitiesResponse>("/api/portfolio/opportunities", {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    })

  const isLoadingQualificationstatus =
    !qualificationStatus && !qualificationstatusError

  const isVerified =
    qualificationStatus?.status === UserQualificationStatus.Verified

  const isLoadingDisclaimer = !disclaimerStatus && !disclaimerError

  React.useEffect(() => {
    if (isSocial) {
      const d = new Date()
      d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * 1)
      document.cookie =
        "email=" + user?.email + ";path=/;expires=" + d.getDate()
    }

    if (accessCookie("email") != "") {
      // @ts-ignore
      if (typeof window !== "undefined" && window._hsq) {
        // @ts-ignore
        var _hsq = (window._hsq = window._hsq || [])
        _hsq.push([
          "identify",
          {
            email: accessCookie("email"),
          },
        ])
      }
    }
  }, [])

  React.useEffect(() => {
    if (
      isLoading ||
      isLoadingQualificationstatus ||
      isUserStatusLoading ||
      isKycLoading
    ) {
      setIsPageLoading(true)
    } else {
      setIsPageLoading(false)
    }
  }, [
    isLoading,
    isLoadingQualificationstatus,
    isUserStatusLoading,
    isKycLoading,
  ])

  React.useEffect(() => {
    if (!isVerified) {
      setUnderstood(true)
      return
    }

    if (disclaimerStatus?.disclaimerAccepted) {
      setUnderstood(true)
      return
    }
    if (!disclaimerStatus?.disclaimerAccepted) {
      setUnderstood(false)
      return
    }
    if (disclaimerError) setUnderstood(false)
  }, [disclaimerStatus?.disclaimerAccepted, disclaimerError, isVerified])

  React.useEffect(() => {
    twitterEvent("login")
  }, [])

  const isKycStatusLoading = !kycStatusData && !kycStatusError

  const isAccepted =
    !proposalStatusError &&
    proposalStatusData &&
    proposalStatusData?.status === ProposalsStatuses.Accepted

  const isPastWebinarLoading = !pastWebinarError && !pastWebinarData

  const showPastWebinar =
    !isUpcomingWebinarLoading &&
    upcomingWebinarData &&
    !upcomingWebinarData.length &&
    !isPastWebinarLoading &&
    pastWebinarData

  // Note: Pending design decisions from Product/Design.
  if (qualificationStatusError) {
    return null
  }

  const isUserInDealPipeline =
    userStatusData?.status === UserQualificationStatus.ActivePipeline ||
    userStatusData?.status === UserQualificationStatus.AlreadyClient

  const isKycCompleted =
    kycStatusData?.personalInfoCompleted &&
    kycStatusData?.investmentExperienceCompleted &&
    kycStatusData?.identityVerificationCompleted &&
    kycStatusData?.callScheduled

  function close() {
    if (toastIdRef?.current) {
      toast.close(toastIdRef.current)
    }
  }

  const updateLoginState = async () => {
    close()
    setIsTourOpen(false)
    try {
      await ky.put("/api/user/update-login-state").json()
    } catch (error) {
      if (!toast.isActive(toastId)) {
        toast({
          id: toastId,
          title: t("common:toast.generic.error.title"),
          variant: "subtle",
          status: "error",
          isClosable: true,
          position: "bottom",
        })
      }
    }
  }

  const tourSteps = [
    {
      target: ".reactour__unlock_opportunity",
      content: (
        <>
          <Flex
            justifyContent="space-between"
            marginTop="-24px"
            marginLeft="-12px"
            marginRight="-12px"
          >
            <Text fontSize="sm" mb="2" fontWeight="bold">
              {t("tour.steps.first.title")}
            </Text>
            <CloseIcon
              boxSize={5}
              cursor="pointer"
              onClick={() => {
                triggerFirstTimeTourEvent(currentTourStep, "exit")
                updateLoginState()
              }}
            />
          </Flex>
          <Text
            fontSize="sm"
            textAlign="left"
            marginLeft="-12px"
            lineHeight="1.2"
            marginRight="-12px"
          >
            {t("tour.steps.first.description")}
          </Text>
          <Flex
            justifyContent="space-between"
            marginTop="12px"
            marginBottom="-42px"
            alignItems="baseline"
            marginLeft="-12px"
            marginRight="-12px"
          >
            <Text fontSize="xs" color="#C7C7C7">
              {t("tour.tip")}{" "}
              <span dir="ltr">
                {lang === "ar"
                  ? `6/${currentTourStep + 1}`
                  : `${currentTourStep + 1}/6`}
              </span>
            </Text>
            <Text
              color="primary.500"
              fontWeight="bold"
              fontSize="sm"
              position="absolute"
              right="1"
              bottom="-6px"
              p="4"
              cursor="pointer"
              onClick={() => {
                triggerFirstTimeTourEvent(currentTourStep)
                setCurrentTourStep(1)
              }}
            >
              {t("tour.next")}
            </Text>
          </Flex>
        </>
      ),
      disableBeacon: true,
      placement: "bottom",
      showProgress: true,
    },
    {
      target: ".reactour__simulate",
      content: (
        <>
          <Flex
            justifyContent="space-between"
            marginTop="-24px"
            marginLeft="-12px"
            marginRight="-12px"
          >
            <Text fontSize="sm" mb="2" fontWeight="bold">
              {t("tour.steps.second.title")}
            </Text>
            <CloseIcon
              boxSize={5}
              cursor="pointer"
              onClick={() => {
                triggerFirstTimeTourEvent(currentTourStep, "exit")
                updateLoginState()
              }}
            />
          </Flex>
          <Text
            fontSize="sm"
            textAlign="left"
            marginLeft="-12px"
            marginRight="-12px"
          >
            {t("tour.steps.second.description")}
          </Text>
          <Flex
            justifyContent="space-between"
            marginTop="12px"
            marginBottom="-42px"
            alignItems="baseline"
            marginLeft="-12px"
            marginRight="-12px"
          >
            <Text fontSize="xs" color="#C7C7C7">
              {t("tour.tip")}{" "}
              <span dir="ltr">
                {lang === "ar"
                  ? `6/${currentTourStep + 1}`
                  : `${currentTourStep + 1}/6`}
              </span>
            </Text>
            <Text
              color="primary.500"
              fontWeight="bold"
              fontSize="sm"
              position="absolute"
              right="1"
              bottom="-6px"
              p="4"
              cursor="pointer"
              onClick={() => {
                triggerFirstTimeTourEvent(currentTourStep)
                setCurrentTourStep(2)
              }}
            >
              {t("tour.next")}
            </Text>
          </Flex>
        </>
      ),
      disableBeacon: true,
      placement: "bottom",
      showProgress: true,
    },
    {
      target: ".reactour__investment_opportunity",
      content: (
        <>
          <Flex
            justifyContent="space-between"
            marginTop="-24px"
            marginLeft="-12px"
            marginRight="-12px"
          >
            <Text fontSize="sm" mb="2" fontWeight="bold">
              {t("tour.steps.third.title")}
            </Text>
            <CloseIcon
              boxSize={5}
              cursor="pointer"
              onClick={() => {
                triggerFirstTimeTourEvent(currentTourStep, "exit")
                updateLoginState()
              }}
            />
          </Flex>
          <Text
            fontSize="sm"
            textAlign="left"
            marginLeft="-12px"
            marginRight="-12px"
          >
            {t("tour.steps.third.description")}
          </Text>
          <Flex
            justifyContent="space-between"
            marginTop="12px"
            marginBottom="-42px"
            alignItems="baseline"
            marginLeft="-12px"
            marginRight="-12px"
          >
            <Text fontSize="xs" color="#C7C7C7">
              {t("tour.tip")}{" "}
              <span dir="ltr">
                {lang === "ar"
                  ? `6/${currentTourStep + 1}`
                  : `${currentTourStep + 1}/6`}
              </span>
            </Text>
            <Text
              color="primary.500"
              fontWeight="bold"
              fontSize="sm"
              position="absolute"
              right="1"
              bottom="-6px"
              p="4"
              cursor="pointer"
              onClick={() => {
                triggerFirstTimeTourEvent(currentTourStep)
                setCurrentTourStep(3)
              }}
            >
              {t("tour.next")}
            </Text>
          </Flex>
        </>
      ),
      disableBeacon: true,
      placement: "bottom",
      showProgress: true,
    },
    {
      target: ".reactour__webinar",
      content: (
        <>
          <Flex
            justifyContent="space-between"
            marginTop="-24px"
            marginLeft="-12px"
            marginRight="-12px"
          >
            <Text fontSize="sm" mb="2" fontWeight="bold">
              {t("tour.steps.fourth.title")}
            </Text>
            <CloseIcon
              boxSize={5}
              cursor="pointer"
              onClick={() => {
                triggerFirstTimeTourEvent(currentTourStep, "exit")
                updateLoginState()
              }}
            />
          </Flex>
          <Text
            fontSize="sm"
            textAlign="left"
            marginLeft="-12px"
            marginRight="-12px"
          >
            {t("tour.steps.fourth.description")}
          </Text>
          <Flex
            justifyContent="space-between"
            marginTop="12px"
            marginBottom="-42px"
            alignItems="baseline"
            marginLeft="-12px"
            marginRight="-12px"
          >
            <Text fontSize="xs" color="#C7C7C7">
              {t("tour.tip")}{" "}
              <span dir="ltr">
                {lang === "ar"
                  ? `6/${currentTourStep + 1}`
                  : `${currentTourStep + 1}/6`}
              </span>
            </Text>
            <Text
              color="primary.500"
              fontWeight="bold"
              fontSize="sm"
              position="absolute"
              right="1"
              bottom="-6px"
              p="4"
              cursor="pointer"
              onClick={() => {
                triggerFirstTimeTourEvent(currentTourStep)
                setCurrentTourStep(4)
              }}
            >
              {t("tour.next")}
            </Text>
          </Flex>
        </>
      ),
      disableBeacon: true,
      placement: "bottom",
      showProgress: true,
    },
    {
      target: ".reactour__insights",
      content: (
        <>
          <Flex
            justifyContent="space-between"
            marginTop="-24px"
            marginLeft="-12px"
            marginRight="-12px"
          >
            <Text fontSize="sm" mb="2" fontWeight="bold">
              {t("tour.steps.fifth.title")}
            </Text>
            <CloseIcon
              boxSize={5}
              cursor="pointer"
              onClick={() => {
                triggerFirstTimeTourEvent(currentTourStep, "exit")
                updateLoginState()
              }}
            />
          </Flex>
          <Text
            fontSize="sm"
            textAlign="left"
            marginLeft="-12px"
            marginRight="-12px"
          >
            {t("tour.steps.fifth.description")}
          </Text>
          <Flex
            justifyContent="space-between"
            marginTop="12px"
            marginBottom="-42px"
            alignItems="baseline"
            marginLeft="-12px"
            marginRight="-12px"
          >
            <Text fontSize="xs" color="#C7C7C7">
              {t("tour.tip")}{" "}
              <span dir="ltr">
                {lang === "ar"
                  ? `6/${currentTourStep + 1}`
                  : `${currentTourStep + 1}/6`}
              </span>
            </Text>
            <Text
              color="primary.500"
              fontWeight="bold"
              fontSize="sm"
              position="absolute"
              right="1"
              bottom="-6px"
              p="4"
              cursor="pointer"
              onClick={() => {
                triggerFirstTimeTourEvent(currentTourStep)
                setCurrentTourStep(5)
              }}
            >
              {t("tour.next")}
            </Text>
          </Flex>
        </>
      ),
      disableBeacon: true,
      placement: "bottom",
      showProgress: true,
    },
    {
      target: ".reactour__support",
      content: (
        <>
          <Flex
            justifyContent="space-between"
            marginTop="-24px"
            marginLeft="-12px"
            marginRight="-12px"
          >
            <Text fontSize="sm" mb="2" fontWeight="bold">
              {t("tour.steps.sixth.title")}
            </Text>
            <CloseIcon
              boxSize={5}
              cursor="pointer"
              onClick={() => {
                triggerFirstTimeTourEvent(currentTourStep, "exit")
                updateLoginState()
              }}
            />
          </Flex>
          <Text
            fontSize="sm"
            textAlign="left"
            marginLeft="-12px"
            marginRight="-12px"
          >
            {t("tour.steps.sixth.description")}
          </Text>
          <Flex
            justifyContent="space-between"
            marginTop="12px"
            marginBottom="-42px"
            alignItems="baseline"
            marginLeft="-12px"
            marginRight="-12px"
          >
            <Text fontSize="xs" color="#C7C7C7">
              {t("tour.tip")}{" "}
              <span dir="ltr">
                {lang === "ar"
                  ? `6/${currentTourStep + 1}`
                  : `${currentTourStep + 1}/6`}
              </span>
            </Text>
            <Text
              color="primary.500"
              fontSize="sm"
              position="absolute"
              right="2"
              cursor="pointer"
              fontWeight="bold"
              bottom="-6px"
              p="4"
              onClick={() => {
                triggerFirstTimeTourEvent(currentTourStep)
                updateLoginState()
              }}
            >
              {t("tour.done")}
            </Text>
          </Flex>
        </>
      ),
      disableBeacon: true,
      placement: lang === "ar" ? "top-end" : "top-start",
      showProgress: true,
    },
  ]

  const onSubmitDisclaimer = async () => {
    setDisclaimerLoader(true)

    try {
      const disclaimerResponse = await ky
        .patch("/api/user/preference/disclaimer")
        .json<Disclaimer>()

      await mutate<Disclaimer>(
        "/api/user/preference/disclaimer",
        disclaimerResponse,
      )
      setUnderstood(true)
      setDisclaimerLoader(false)
    } catch (e) {
      setDisclaimerLoader(false)
    }
  }

  function profileTrackerRouter() {
    if (!profileTrackerInfo?.investorProfileCompleted) {
      router.push("/proposal/investor-profile")
      return
    }
    if (!profileTrackerInfo?.investmentGoalCompleted) {
      router.push("/proposal/investment-goals#1")
      return
    }
    if (!profileTrackerInfo?.riskAssessmentCompleted) {
      router.push("/proposal/risk-assessment#1")
      return
    }
    if (profileTrackerInfo?.total === 60) {
      router.push("/proposal/risk-assessment/result")
      return
    }
    if (profileTrackerInfo?.total === 80) {
      router.push("/personalized-proposal")
    }
  }

  const handleJoyrideCallback = (data: { action: string }) => {
    const { action } = data

    if (action === "close") {
      triggerFirstTimeTourEvent(currentTourStep, "exit")
      updateLoginState()
    }
  }

  const accessCookie = (cookieName: string) => {
    var name = cookieName + "="
    var allCookieArray = document.cookie.split(";")
    for (var i = 0; i < allCookieArray.length; i++) {
      var temp = allCookieArray[i].trim()
      if (temp.indexOf(name) == 0)
        return temp.substring(name.length, temp.length)
    }
    return ""
  }

  return (
    <>
      <Layout
        title={t("page.title")}
        description={t("page.description")}
        understood={!understood}
      >
        <PageContainer
          isLoading={isPageLoading}
          as="section"
          maxW="full"
          px="0"
          mt={{ base: 8, md: 8, lg: 0 }}
          filter={isPageLoading ? "blur(3px)" : "none"}
          {...(!understood &&
            !isTourOpen && {
              filter: "blur(1px)",
              opacity: "0.4",
              pointerEvents: "none",
            })}
        >
          {!isPageLoading && (
            <>
              <Joyride
                /* @ts-ignore */
                steps={tourSteps}
                scrollToFirstStep={true}
                scrollOffset={200}
                scrollDuration={100}
                hideCloseButton={true}
                continuous={true}
                hideBackButton={true}
                run={isTourOpen}
                stepIndex={currentTourStep}
                callback={handleJoyrideCallback}
                styles={{
                  options: {
                    beaconSize: 20,
                    arrowColor: "#283134",
                    backgroundColor: "#283134",
                    primaryColor: "#FFF",
                    textColor: "#FFF",
                    zIndex: 1000,
                  },
                  buttonNext: {
                    display: "none",
                  },
                  buttonBack: {
                    display: "none",
                  },
                  buttonClose: {
                    display: "none",
                  },
                }}
              />
            </>
          )}
          <Stack
            direction={{ base: "column", md: "row" }}
            mb={{ base: 8, md: 6 }}
          >
            {user?.profile?.firstName ? (
              <Flex
                justifyContent="space-between"
                alignItems="baseline"
                width="full"
                className="first"
                id="tracker"
                flexDirection={["column", "row"]}
              >
                <VStack
                  justifyContent="space-between"
                  alignItems="start"
                  me="6"
                >
                  <Heading as="h1" textAlign={["center", "start"]}>
                    {t("heading", { firstName: user.profile.firstName })}
                  </Heading>
                  <Text fontSize="md" color="gray.400" py="2">
                    {t("description")}
                  </Text>
                </VStack>
                {!isProfileTrackerInfoLoading &&
                  !profileTrackerError &&
                  profileTrackerInfo?.total !== 100 && (
                    <Flex
                      flexDirection="column"
                      w={{ base: "full", md: "3xs" }}
                    >
                      <Flex
                        w={{ base: "full", md: "3xs" }}
                        alignItems="baseline"
                        justifyContent="space-between"
                      >
                        <Text fontSize="sm" mb="3" ms="1" fontWeight="bold">
                          {profileTrackerInfo?.total}%{" "}
                          <chakra.span fontWeight="normal">
                            {t("profileCompletion")}
                          </chakra.span>
                        </Text>
                        <LeftArrowIcon
                          color="primary.500"
                          {...(lang === "en" && {
                            transform: "rotate(180deg)",
                          })}
                          onClick={() => profileTrackerRouter()}
                          cursor="pointer"
                        />
                      </Flex>
                      <Progress
                        value={profileTrackerInfo?.total}
                        colorScheme="primary"
                        size="xs"
                        backgroundColor="none"
                      />
                    </Flex>
                  )}
              </Flex>
            ) : (
              <Skeleton maxW="sm" h="10" mb="10" />
            )}
            <Spacer />

            {isUserInDealPipeline && understood && (
              <RelationshipManagerCard variant="minimal" />
            )}
            {!isUserInDealPipeline && isAccepted && understood && (
              <RelationshipManagerCard variant="minimal" />
            )}
          </Stack>
          {!isMeetingInfoLoading && meetingDetail?.meetingId && (
            <CancelRescheduleCard meetingDetail={meetingDetail} />
          )}
          <VStack spacing={{ base: "8", md: "12" }} w="full">
            {!isKycStatusLoading && kycStatusData && isAccepted && (
              <ProposalKycIndicator kycStatusData={kycStatusData} user={user} />
            )}
            {!isUserInDealPipeline && !isLoading && !isAccepted && (
              <Stack
                w="full"
                direction={{ base: "column", md: "row" }}
                spacing={{ base: "8", md: "6", lg: "8" }}
                alignItems="stretch"
              >
                {/* Show SkeletonCard if loading. Show ProfolioIndicator if atleast investorProfile is completed else show SimulatePortfolioCard */}
                {isLoading ? (
                  <SkeletonCard flex="1" />
                ) : (
                  !isUserStatusLoading &&
                  userStatusData?.status && (
                    <SimulatePortfolioCard
                      userStatus={userStatusData?.status}
                      tfoUser={user}
                      {...(qualificationStatusData && {
                        qualificationStatusData: qualificationStatusData,
                      })}
                    />
                  )
                )}
                {!isKycCompleted && <TrySimulatorCard />}
              </Stack>
            )}

            <InvestmentOpportunityList
              isOpportunityUnlocked={
                qualificationStatusData?.investorProfile as boolean
              }
            />

            {showPastWebinar && (
              <>
                <Divider />
                <PastWebinarCard pastWebinarInfo={pastWebinarData} />
              </>
            )}
            <Divider />
            <InsightsList />
            {!qualificationStatusData?.investorProfile && (
              <StartProposalFlowCard />
            )}
          </VStack>
        </PageContainer>

        {!understood &&
          (isDesktopView || isTabletView) &&
          !isLoadingDisclaimer &&
          isVerified &&
          !isTourOpen &&
          !isLoadingQualificationstatus && (
            <Card
              aria-label="opportunitiesDisclaimer"
              bg="gunmetal.700"
              mt="8"
              mb="8"
              zIndex="overlay"
              position="sticky"
              bottom="10"
            >
              <CardContent p="6">
                <Stack direction="row" spacing="4">
                  <InfoIcon color="primary.500" w={6} h={6} />
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    alignItems="flex-start"
                    gridColumnGap="3"
                    gridRowGap="5"
                  >
                    <Text textAlign="justify" fontSize="sm">
                      {t("common:disclaimer.description")}
                    </Text>
                    <Button
                      ms={{ md: "3", lg: "3" }}
                      alignSelf="center"
                      maxW="md"
                      w="full"
                      colorScheme="primary"
                      onClick={() => {
                        onSubmitDisclaimer()
                      }}
                      leftIcon={<BlackCheckIcon />}
                      disabled={disclaimerLoader}
                    >
                      {t("common:disclaimer.button")}
                    </Button>
                  </Flex>
                </Stack>
              </CardContent>
            </Card>
          )}
      </Layout>
      {!understood &&
        !isDesktopView &&
        !isTabletView &&
        !isLoadingDisclaimer &&
        isVerified &&
        !isTourOpen &&
        !isLoadingQualificationstatus && (
          <Card
            aria-label="opportunitiesDisclaimer"
            bg="gunmetal.700"
            maxW="full"
            mt="8"
            mb="8"
            zIndex="overlay"
            position="sticky"
            bottom="0"
          >
            <CardContent p="6">
              <Stack direction="row" spacing="4">
                <InfoIcon color="primary.500" w={6} h={6} />
                <Flex direction="column" gridRowGap="3">
                  <Text fontSize="sm">
                    {t("common:disclaimer.description")}
                  </Text>
                  <Button
                    colorScheme="primary"
                    alignSelf={{ md: "flex-end" }}
                    onClick={() => {
                      onSubmitDisclaimer()
                    }}
                    leftIcon={<BlackCheckIcon />}
                    disabled={disclaimerLoader}
                  >
                    {t("common:disclaimer.button")}
                  </Button>
                </Flex>
              </Stack>
            </CardContent>
          </Card>
        )}
    </>
  )
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async function (ctx) {
    try {
      const client = new MyTfoClient(ctx.req, ctx.res)
      const user = await client.user.getUser()
      const session = getSession(ctx.req, ctx.res)
      const onboardingPath = `/${
        ctx.locale === "ar" ? "ar/" : ""
      }onboarding/profile`
      if (user?.roles?.includes("client-desktop")) {
        let destination = ctx.locale === "ar" ? "/ar/404" : "/404"
        return {
          redirect: {
            destination,
            permanent: true,
          },
        }
      }
      // Redirect if email is unverified.
      if (!user.emailVerified) {
        let destination = "/verify"
        if (ctx.locale === "ar") {
          destination = "/ar/verify"
        }
        return {
          redirect: {
            destination,
            permanent: false,
          },
        }
      }

      if (!user.profile) {
        return {
          redirect: {
            destination: onboardingPath,
            permanent: false,
          },
        }
      }

      if (user?.profile) {
        if (!isMinimumProfileCompleted(user.profile)) {
          return {
            redirect: {
              destination: onboardingPath,
              permanent: false,
            },
          }
        }
      }

      const isSocial = session?.is_social || false

      return {
        props: {
          tfoUser: user,
          isSocial: isSocial,
        },
      }
    } catch (error) {
      console.log(error)
      console.log("Error attempting to sign in")

      // Clear session cookies to reset/logout user.
      ctx.res.setHeader("Set-Cookie", "")

      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      }
    }
  },
})

export default DashboardScreen
