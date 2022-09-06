import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader

import {
  Box,
  Button,
  Center,
  chakra,
  Divider,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react"
import { Formik } from "formik"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import ky from "ky"
import { GetServerSideProps } from "next"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { RefObject, useRef, useState } from "react"
import { OptionTypeBase } from "react-select"
import useSWR, { mutate } from "swr"

import {
  Card,
  CardContent,
  GrowthIcon,
  IncomeIcon,
  InfoIcon,
  Link,
  LongTermIcon,
  ModalFooter,
  ModalHeader,
  ModalLayout,
  OptionCard,
  SelectControl,
  ShortTermIcon,
  UpdateProposal,
} from "~/components"
import AccessDenied from "~/components/AccessDenied"
import { Footer } from "~/components/Footer"
import AllocationDetail from "~/components/ProposalAllocationDetail/AllocationDetail"
import siteConfig from "~/config"
import { useUser } from "~/hooks/useUser"
import {
  AcceptProposal,
  AdditionalPreference,
  InvestorProfileGoals,
  KycStatus,
  MyProposal,
  PortfolioSummary,
  Preference,
  ProposalsStatus,
  ProposalsStatuses,
  ProposalType,
  User,
} from "~/services/mytfo/types"
import formatCurrency, {
  formatCurrencyWithoutSymbol,
} from "~/utils/formatCurrency"
import formatYearName from "~/utils/formatYearName"
import { getTodaysDate } from "~/utils/getTodaysDate"
import {
  AcceptProposalEvent,
  CheckingIncomeGrowthProposal,
  CheckingShortLongProposalEvent,
  OpenEditWindowEvent,
  PersonalizedProposalLandingEvent,
  ProposalSelection,
} from "~/utils/googleEvents"
import { event } from "~/utils/gtag"
import { isGccCountry } from "~/utils/isGccCountry"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

import Earnings from "./Earnings"
import InvestingWithTFO from "./InvestingWithTFO"
import InvestmentWork from "./InvestmentWork"
import MyAllocation from "./MyAllocation"
import ProposalOverview from "./ProposalOverview"

function MyProposalScreen() {
  const { t, lang } = useTranslation("personalizedProposal")
  const toast = useToast()
  const { user } = useUser()
  const containerRef = useRef()
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [personalizedSelection, setPersonalizedSelection] = React.useState(-1)
  const [selectedProposal, setSelectedProposal] = React.useState(
    (personalizedSelection !== -1 && personalizedSelection) || 0,
  )
  const [showScheduleCall, setShowScheduleCall] = React.useState(false)

  // update the selected nav item for toggling active style
  const [selectedNavItem, setSelectedItemIndex] = useState(
    "your-allocation-section",
  )

  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isTabletView = useBreakpointValue({
    base: false,
    md: true,
    lg: false,
  })
  const isDesktopView = !isMobileView
  const {
    onOpen: onLanguageSwitchModalOpen,
    onClose: onLanguageSwitchModalClose,
    isOpen: isLanguageSwitchModalOpen,
  } = useDisclosure()

  const {
    isOpen: isUpdateProposalModalOpen,
    onOpen: onUpdateProposalModalOpen,
    onClose: onUpdateProposalModalClose,
  } = useDisclosure()

  const { onClose, isOpen, onOpen } = useDisclosure()

  const isGccNational = React.useMemo(() => {
    return isGccCountry(user?.profile?.countryOfResidence || "")
  }, [user?.profile?.countryOfResidence])

  React.useEffect(() => {
    if (router.query?.name === "risk-assessment") {
      onUpdateProposalModalOpen()
    }
  }, [])

  const isRmView = router.query.contactId || undefined

  // creating nav section element ref's
  const yourAlloctionSecRef = useRef<HTMLDivElement>(null)
  const investmentWorkSecRef = useRef<HTMLDivElement>(null)
  const investmentWithUsSecRef = useRef<HTMLDivElement>(null)

  let LEFT_NAVIGATION_LIST:
    | {
        id: string
        title: string
        elementRef: React.RefObject<HTMLDivElement>
      }[]
    | { id: React.SetStateAction<string> }[] = []

  const { data: userData, error: userError } = useSWR<User>("/api/user")

  const { data: portfolioSummaryData, error: portfolioSummaryError } =
    useSWR<PortfolioSummary>(
      router.query.contactId
        ? `/api/user/summary/contact?id=${router.query.contactId}`
        : "/api/user/summary",
    )

  const { data: investmentGoalsData } = useSWR<InvestorProfileGoals>(
    "/api/user/investment-goals",
  )

  const { data: proposalStatusData, error: proposalStatusError } =
    useSWR<ProposalsStatus>(
      router.query.contactId
        ? `/api/user/proposals/status/contact?id=${router.query.contactId}`
        : "/api/user/proposals/status",
    )

  const isProposalStatusLoading = !proposalStatusData && !proposalStatusError

  const { data: kycStatusData, error: kycStatusError } = useSWR<KycStatus>(
    "/api/user/kyc/status",
  )

  const { data: preferenceData, error: preferenceError } = useSWR<Preference>(
    "/api/user/preference",
  )

  const {
    data: personalizedProposalData,
    error: personalizedProposalDataError,
  } = useSWR<MyProposal[]>(
    router.query.contactId
      ? `/api/user/proposals/contact?id=${router.query.contactId}`
      : "/api/user/proposals",
  )

  const ispersonalizedProposalLoading =
    !personalizedProposalDataError && !personalizedProposalData

  let proposalSelected =
    !preferenceError &&
    preferenceData &&
    personalizedProposalData &&
    preferenceData?.selectedProposal

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    if (personalizedProposalData?.length === 1) {
      event(PersonalizedProposalLandingEvent)
    }

    if (personalizedProposalData && personalizedProposalData.length === 1) {
      submitProposalPreference()
    }

    if (
      !ispersonalizedProposalLoading &&
      personalizedProposalData &&
      personalizedProposalData.length > 1 &&
      proposalSelected !== personalizedProposalData[0].type &&
      proposalSelected !== personalizedProposalData[1].type
    ) {
      onOpen()
      setPersonalizedSelection(-1)
    }
  }, [personalizedProposalData])

  const selectedIndex =
    !personalizedProposalDataError &&
    personalizedProposalData &&
    personalizedProposalData.length > 1 &&
    (proposalSelected === personalizedProposalData[0].type ||
      proposalSelected === personalizedProposalData[1].type)

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    if (selectedIndex && personalizedProposalData.length > 1) {
      const selectedProposalIndex =
        proposalSelected === "Income" || proposalSelected === "ShortTerm"
          ? 0
          : 1
      setPersonalizedSelection(selectedProposalIndex)
      setSelectedProposal(selectedProposalIndex)
    }
  }, [selectedIndex])

  const isKycCompleted =
    !kycStatusError &&
    kycStatusData &&
    kycStatusData?.personalInfoCompleted &&
    kycStatusData?.investmentExperienceCompleted &&
    kycStatusData?.identityVerificationCompleted

  const isAccepted =
    !isProposalStatusLoading &&
    proposalStatusData?.status === ProposalsStatuses.Accepted

  const isLoading = !portfolioSummaryData && !portfolioSummaryError

  const onClickInvestCta = () => {
    if (lang === "ar") {
      onLanguageSwitchModalOpen()
    }
    if (!isGccNational) {
      router.push("/personalized-proposal/thank-you")
    } else {
      router.push(`kyc`)
    }
  }

  const submitProposalPreference = async () => {
    await ky
      .put("/api/user/preference", {
        json: {
          language: preferenceData?.language,
          selectedProposal:
            personalizedProposalData && personalizedProposalData.length > 1
              ? personalizedProposalData[selectedProposal]?.type
              : personalizedProposalData &&
                personalizedProposalData.length === 1 &&
                personalizedProposalData[0].type,
        },
      })
      .json<Preference>()

    await mutate("/api/user/preference")
  }

  const continueProposal = () => {
    const isGrowthIncome = getProposalType()
    if (personalizedSelection === 0 && isGrowthIncome) {
      event({
        ...ProposalSelection,
        label: `User selecting the Income proposal card and click 'Continue' CTA`,
      })
    }
    if (personalizedSelection === 1 && isGrowthIncome) {
      event({
        ...ProposalSelection,
        label: `User selecting the Growth proposal card and click 'Continue' CTA`,
      })
    }
    if (personalizedSelection === 0 && !isGrowthIncome) {
      event({
        ...ProposalSelection,
        label: `User selecting the Short term proposal card and click 'Continue' CTA`,
      })
    }
    if (personalizedSelection === 1 && !isGrowthIncome) {
      event({
        ...ProposalSelection,
        label: `User selecting the Long term proposal card and click 'Continue' CTA`,
      })
    }
    submitProposalPreference()
    onClose()
  }

  const callAcceptProposal = async (param: number) => {
    await ky
      .post("/api/user/proposals/accept", {
        json: {
          instanceId:
            personalizedProposalData &&
            personalizedProposalData[param]?.instanceId,
          selectedProposal:
            personalizedProposalData && personalizedProposalData.length > 1
              ? personalizedProposalData[param]?.type
              : "",
        },
      })
      .json<AcceptProposal>()
    onClickInvestCta()
  }

  const acceptProposal = async () => {
    try {
      event(AcceptProposalEvent)

      if (personalizedProposalData && personalizedProposalData?.length === 1) {
        callAcceptProposal(0)
        return
      }
      callAcceptProposal(selectedProposal)
    } catch (error) {
      const proposalToastId = "proposalToastID"
      if (!toast.isActive(proposalToastId)) {
        toast({
          id: proposalToastId,
          title: t("footer.toast.error.title"),
          variant: "subtle",
          status: "error",
          isClosable: true,
          position: "bottom",
        })
      }
    }
  }

  const getProposalType = () => {
    if (!ispersonalizedProposalLoading && personalizedProposalData) {
      return (
        personalizedProposalData[selectedProposal].type === "Income" ||
        personalizedProposalData[selectedProposal].type === "Growth"
      )
    }
  }
  const shortLongProposal = [
    {
      label: t("leftNavigation.select.shortTerm"),
      value: "ShortTerm",
    },
    {
      label: t("leftNavigation.select.longTerm"),
      value: "LongTerm",
    },
  ]
  const incomeGrowthProposal = [
    { label: t("leftNavigation.select.income"), value: "Income" },
    { label: t("leftNavigation.select.growth"), value: "Growth" },
  ]

  interface InvestmentGoalHeaderProps {
    label: string
    value: string
  }

  function InvestmentGoalHeader(props: InvestmentGoalHeaderProps) {
    const { label, value } = props
    return (
      <Stack spacing="1" {...(pdfGenerating && { h: "40px" })}>
        <Text fontSize="xs" color="gray.500">
          {label}
        </Text>
        <Text fontSize="md">{value}</Text>
      </Stack>
    )
  }
  function showLanguageSwitchNotificationModal() {
    return (
      <Modal
        onClose={onLanguageSwitchModalClose}
        size={isMobileView ? "xs" : "2xl"}
        isOpen={isLanguageSwitchModalOpen}
        isCentered={true}
        autoFocus={false}
        returnFocusOnClose={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <VStack spacing={9} my={20}>
                <InfoIcon boxSize={8} color="secondary.500" />
                <Heading fontSize={{ base: "2xl", md: "3xl" }}>
                  {t("languageSwitchNotificationPopUp.heading")}
                </Heading>
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="gray.400"
                  maxW="sm"
                >
                  {t("languageSwitchNotificationPopUp.text.description")}
                </Text>
                <Button
                  colorScheme="primary"
                  variant="solid"
                  as={Link}
                  href="/kyc"
                >
                  {t("languageSwitchNotificationPopUp.button.continue")}
                </Button>
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="gray.400"
                  maxW="sm"
                >
                  {t("common:help.heading")}
                  <Button
                    colorScheme="primary"
                    variant="ghost"
                    as={Link}
                    href="/support"
                    color="primary.500"
                    px="0"
                    pb="1"
                  >
                    {t("common:help.link.support")}
                  </Button>
                </Text>
              </VStack>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  }

  function DiscussWithExpert() {
    return (
      <>
        {!isAccepted && !isRmView && !pdfGenerating && (
          <Card aria-label="discussWithExpert" bg="gray.800" maxW="full">
            <CardContent p="8">
              <Stack direction="column" spacing="6">
                <Text
                  fontSize={{ base: "xl", md: "lg", lg: "lg" }}
                  color="gray.400"
                  textAlign={{ base: "center", md: "start" }}
                >
                  {t("discussWithExpert.title")}
                </Text>
                <Text
                  fontSize={{ base: "sm", md: "md", lg: "md" }}
                  color="gray.400"
                  textAlign={{ base: "center", md: "start" }}
                >
                  {t("discussWithExpert.description")}
                </Text>
                <Stack
                  direction={{ base: "column-reverse", md: "row" }}
                  spacing="4"
                >
                  <Button
                    variant={!isMobileView ? "outline" : "ghost"}
                    colorScheme="primary"
                    size="md"
                    isFullWidth={isMobileView}
                    onClick={() => router.push("/schedule-meeting")}
                  >
                    {t("discussWithExpert.button.scheduleCall")}
                  </Button>
                  {isGccNational && (
                    <Button
                      variant="solid"
                      size="md"
                      colorScheme="primary"
                      onClick={acceptProposal}
                      {...(isMobileView && {
                        whiteSpace: "break-spaces",
                      })}
                    >
                      {t("discussWithExpert.button.startInvesting")}
                    </Button>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        )}

        {(!isKycCompleted || pdfGenerating) && (
          <Card
            aria-label="disclaimer"
            bg="gunmetal.700"
            maxW="full"
            mt="8"
            mb={isMobileView ? "48" : "32"}
          >
            <CardContent p="6">
              <Stack direction="column" spacing="5">
                <Text fontSize="md" color="gray.400">
                  {!userError && userData?.profile?.nationality === "SA"
                    ? t("disclaimer.info.text1KSA")
                    : t("disclaimer.info.text1NonKSA")}
                </Text>
              </Stack>
            </CardContent>
          </Card>
        )}
      </>
    )
  }

  if (isRmView) {
    LEFT_NAVIGATION_LIST = [
      {
        id: "your-allocation-section",
        title: "leftNavigation.yourAllocation",
        elementRef: yourAlloctionSecRef,
      },
      {
        id: "investment-work-section",
        title: "leftNavigation.investmentWillWork",
        elementRef: investmentWorkSecRef,
      },
    ]
  } else {
    LEFT_NAVIGATION_LIST = [
      {
        id: "your-allocation-section",
        title: "leftNavigation.yourAllocation",
        elementRef: yourAlloctionSecRef,
      },
      {
        id: "investment-work-section",
        title: "leftNavigation.investmentWillWork",
        elementRef: investmentWorkSecRef,
      },
      {
        id: "investment-with-us-section",
        title: "leftNavigation.investWithUs",
        elementRef: investmentWithUsSecRef,
      },
    ]
  }

  function showTwoProposalModal() {
    const isGrowthIncome = getProposalType()
    if (isGrowthIncome) {
      event(CheckingIncomeGrowthProposal)
    } else {
      event(CheckingShortLongProposalEvent)
    }

    return (
      <Modal
        onClose={() => {}}
        isOpen={isOpen}
        isCentered
        autoFocus={false}
        returnFocusOnClose={false}
        size={isMobileView ? "sm" : "2xl"}
      >
        <ModalOverlay />
        <ModalContent
          h="full"
          overflowY="auto"
          mt="0"
          mb="0"
          {...(isDesktopView && {
            maxH: "640px",
          })}
          {...((isMobileView || isTabletView) && {
            maxH: "720px",
          })}
        >
          <ModalBody
            pt={18}
            pb={8}
            mt="0"
            display="flex"
            flexDir="column"
            justifyContent="center"
          >
            <Text
              aria-label="multipleProposalTitle"
              fontSize={isMobileView ? "3xl" : "2xl"}
              marginBottom="28px"
            >
              {t("multipleProposal.title")}
            </Text>
            <Text fontSize="md" color="gray.400" marginBottom={5}>
              {isGrowthIncome
                ? t("multipleProposal.incomeDescription")
                : t("multipleProposal.shortTermDescription")}
            </Text>
            <Text fontSize="md" fontWeight={"semibold"} marginBottom={8}>
              {t("multipleProposal.labels.moreImportant")}
            </Text>
            <Flex
              flexWrap="wrap"
              direction={isMobileView ? "column" : "row"}
              justifyContent="center"
              marginBottom="42px"
            >
              <OptionCard
                icon={
                  isGrowthIncome ? (
                    <IncomeIcon
                      w={isMobileView ? 10 : 20}
                      h={isMobileView ? 10 : 20}
                      marginBottom={8}
                      textColor="lightslategrey"
                    />
                  ) : (
                    <ShortTermIcon
                      w={isMobileView ? 10 : 20}
                      h={isMobileView ? 10 : 20}
                      marginBottom={8}
                      textColor="lightslategrey"
                    />
                  )
                }
                title={
                  isGrowthIncome
                    ? t("multipleProposal.labels.income")
                    : t("multipleProposal.labels.shortTerm")
                }
                description={
                  isGrowthIncome
                    ? t("multipleProposal.labels.incomeDesc")
                    : t("multipleProposal.labels.shortTermDesc")
                }
                onClick={() => {
                  setPersonalizedSelection(0)
                  setSelectedProposal(0)
                }}
                selected={personalizedSelection == 0}
                mb={isMobileView ? "4" : "0"}
                me={isMobileView ? "0" : "4"}
              />
              <OptionCard
                icon={
                  isGrowthIncome ? (
                    <GrowthIcon
                      w={isMobileView ? 10 : 20}
                      h={isMobileView ? 10 : 20}
                      marginBottom={8}
                      textColor="lightslategrey"
                    />
                  ) : (
                    <LongTermIcon
                      w={isMobileView ? 10 : 20}
                      h={isMobileView ? 10 : 20}
                      marginBottom={8}
                      textColor="lightslategrey"
                    />
                  )
                }
                title={
                  isGrowthIncome
                    ? t("multipleProposal.labels.growth")
                    : t("multipleProposal.labels.longTerm")
                }
                description={
                  isGrowthIncome
                    ? t("multipleProposal.labels.growthDesc")
                    : t("multipleProposal.labels.longTermDesc")
                }
                onClick={() => {
                  setPersonalizedSelection(1)
                  setSelectedProposal(1)
                }}
                selected={personalizedSelection == 1}
              />
            </Flex>
            <Button
              variant="solid"
              colorScheme="primary"
              type="submit"
              disabled={personalizedSelection == -1}
              marginBottom={5}
              onClick={continueProposal}
              width={{ base: "full", md: "fit-content" }}
              marginX="auto"
            >
              {t("multipleProposal.button.continue")}
            </Button>
            <Text
              marginX="auto"
              fontSize={{ base: "sm", md: "md" }}
              color="gray.400"
              maxW="sm"
            >
              {t("multipleProposal.labels.needHelp")}
              <Button
                colorScheme="primary"
                variant="link"
                as={Link}
                color="primary.500"
                fontSize={{ base: "sm", md: "md" }}
                px="0"
                href="/support"
                pb="1"
              >
                {t("multipleProposal.button.getSupport")}
              </Button>
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  }

  /**
   * @name executeLeftNavScroll
   * @param _selectedNavItemRef RefObject<HTMLDivElement | undefined>
   * @param _selectedNavItemId<string>
   * @desc It's used to scroll into the selected item view
   */
  const executeLeftNavScroll = (
    _selectedNavItemRef: RefObject<HTMLDivElement | undefined>,
    _selectedNavItemId: string,
  ) => {
    setSelectedItemIndex(_selectedNavItemId)

    _selectedNavItemRef?.current?.scrollIntoView({ behavior: "smooth" })
  }

  const selectLeftNavOnScroll = (event: {
    currentTarget: { scrollTop: number }
  }) => {
    const scrollTop = event.currentTarget.scrollTop

    if (scrollTop < 800) {
      setSelectedItemIndex(LEFT_NAVIGATION_LIST[0].id)
      setShowScheduleCall(false)
    } else if (scrollTop < 2100) {
      setSelectedItemIndex(LEFT_NAVIGATION_LIST[1].id)
      setShowScheduleCall(true)
    } else if (!isRmView && scrollTop > 2100) {
      setSelectedItemIndex(LEFT_NAVIGATION_LIST[2].id)
      setShowScheduleCall(false)
    }
  }

  const closeUpdateProposalModal = () => {
    onUpdateProposalModalClose()
    if (router.query?.name === "risk-assessment") {
      router.push("/personalized-proposal")
    }
  }

  function popoverContent() {
    return (
      <>
        <Text fontSize="xs" color="gray.500" maxW="240px">
          {t("footer.popover.body")}
        </Text>
        <Button
          variant="outline"
          isFullWidth={true}
          colorScheme="primary"
          size="md"
          mt="8"
          onClick={() => router.push("/schedule-meeting")}
        >
          {t("footer.popover.button.scheduleCall")}
        </Button>
      </>
    )
  }

  const proposalAcceptCta = () => {
    if (isAccepted) return t("footer.button.completeClientRegistration")

    if (preferenceData?.selectedProposal) {
      return t(
        `footer.button.${
          isGccNational
            ? `acceptProposalWithName.${preferenceData?.selectedProposal}`
            : `acceptProposalWithNameNonGcc.${preferenceData?.selectedProposal}`
        }`,
      )
    }

    return t(
      `footer.button.${
        isGccNational ? "acceptProposal" : "acceptProposalNonGcc"
      }`,
    )
  }

  const onAcceptProposalClick = () => {
    if (isAccepted) {
      return onClickInvestCta()
    }

    return acceptProposal()
  }

  const generatePdf = async () => {
    const parentElement = containerRef && containerRef.current
    const height = isMobileView ? 7000 : isTabletView ? 1600 : 1000
    const pdf = new jsPDF("p", "mm", [270, height], true)

    // @ts-ignore
    html2canvas(parentElement, {
      logging: true,
      useCORS: true,
      scale: "2",
    }).then((canvas) => {
      const imgWidth = 208
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      const imgData = canvas.toDataURL("img/png", 0.3)

      pdf.addImage(
        imgData,
        "PNG",
        30,
        0,
        imgWidth,
        imgHeight,
        undefined,
        "FAST",
      )

      pdf.save("proposal.pdf")
      setPdfGenerating(false)
    })
  }

  const getAdditionalPreferences = (preferences: AdditionalPreference[]) => {
    let preference: string = ""
    if (preferences.length > 1) {
      const selectedPreference = preferences.map((item) =>
        t(`updateProposal.additionalPreferencesLabels.${item}`),
      )
      console.log(selectedPreference)
      return selectedPreference.join(", ")
    } else {
      preference = t(
        `updateProposal.additionalPreferencesLabels.${preferences[0]}`,
      )
    }

    return preference
  }

  if (isRmView && personalizedProposalDataError) {
    return <AccessDenied />
  }

  return (
    <>
      <ModalLayout
        title={t("page.title")}
        description={t("page.description")}
        onScroll={selectLeftNavOnScroll}
        header={
          <ModalHeader
            boxShadow="0 0 0 4px var(--chakra-colors-gray-900)"
            {...(!isMobileView && { px: 12 })}
            headerRight={
              <HStack>
                {(isDesktopView || isTabletView) && (
                  <>
                    <Button
                      variant="ghost"
                      colorScheme="primary"
                      onClick={async () => {
                        await setPdfGenerating(true)
                        setTimeout(() => generatePdf(), 1900)
                      }}
                    >
                      <Text fontSize="sm">{t("download.label")}</Text>
                    </Button>
                    <Divider
                      orientation="vertical"
                      bgColor="gray.700"
                      height="28px"
                    />
                  </>
                )}
                <Button
                  as={Link}
                  href="/"
                  pe={isMobileView ? "4" : "12"}
                  variant="ghost"
                  colorScheme="primary"
                >
                  {t("common:button.exit")}
                </Button>
              </HStack>
            }
            {...(isDesktopView && {
              headerLeft: (
                <Stack isInline ps="6" spacing="6" alignItems="center">
                  <Divider
                    orientation="vertical"
                    bgColor="gray.700"
                    height="28px"
                  />
                  <Text color="gray.400" fontSize="sm">
                    {isRmView
                      ? `#${isRmView} ${t("header.labels.rmProposal")}`
                      : t("header.labels.myProposal")}
                  </Text>
                </Stack>
              ),
            })}
          />
        }
        footer={
          <>
            {!isRmView && (
              <ModalFooter
                height={
                  isMobileView ? (isKycCompleted ? "0px" : "56px") : "88px"
                }
                bgColor="gray.850"
                {...(!isMobileView && { ps: 12 })}
                {...(isMobileView && { p: 0 })}
                showScheduleCall={showScheduleCall}
                popoverHeader={
                  <Text fontSize="sm">{t("footer.popover.header")}</Text>
                }
                popover={popoverContent()}
                zIndex={isTabletView ? "popover" : "initial"}
                position={isTabletView ? "absolute" : "fixed"}
                bottom={isMobileView ? "81px" : "0"}
              >
                {isDesktopView
                  ? !isKycCompleted && (
                      <Button
                        colorScheme="primary"
                        isFullWidth={false}
                        me="10"
                        onClick={onAcceptProposalClick}
                        whiteSpace="pre-line"
                      >
                        {proposalAcceptCta()}
                      </Button>
                    )
                  : !isKycCompleted && (
                      <Box bgColor="gray.800" w="full" px="6" py="2">
                        <Button
                          colorScheme="primary"
                          isFullWidth={true}
                          me="2"
                          whiteSpace="pre-line"
                          onClick={onAcceptProposalClick}
                        >
                          {proposalAcceptCta()}
                        </Button>
                      </Box>
                    )}
              </ModalFooter>
            )}

            {!isRmView && isMobileView && (
              <Footer position="fixed" bottom="0" width="full" />
            )}
          </>
        }
        hideBgImage={false}
        bgColor="gray.900"
      >
        {personalizedProposalData &&
          personalizedProposalData?.length > 1 &&
          proposalSelected !== personalizedProposalData[0].type &&
          proposalSelected !== personalizedProposalData[1].type &&
          showTwoProposalModal()}

        <Box
          /* @ts-ignore */
          ref={containerRef}
          {...(pdfGenerating && { bgColor: "gray.900" })}
        >
          <Box
            aria-label="personalizedProposalSummary"
            pos={pdfGenerating ? "unset" : "fixed"}
            top={
              pdfGenerating && (isMobileView || isTabletView) ? "-65px" : "56px"
            }
            w="full"
            h="84px"
            bgColor="gray.800"
            zIndex="sticky"
            px={{ base: "4", md: isTabletView ? "14" : "36" }}
            py={{ base: "4", md: "6" }}
            left="0"
          >
            {!isLoading &&
              portfolioSummaryData &&
              isDesktopView &&
              !isTabletView && (
                <Stack
                  isInline
                  display="flex"
                  w="full"
                  maxW="full"
                  alignItems="center"
                  spacing="2"
                >
                  <chakra.div
                    flex="1"
                    minW="0"
                    whiteSpace="nowrap"
                    overflow="hidden"
                  >
                    <Stack direction="row" spacing="12">
                      <Stack spacing="1" {...(pdfGenerating && { h: "50px" })}>
                        <Text fontSize="xs" color="gray.500">
                          {t("header.labels.goals")}
                        </Text>

                        <Text fontSize="md" textAlign="start">
                          {portfolioSummaryData?.goal.length > 1 ? (
                            <Text>
                              {t(
                                `header.goals.labels.${portfolioSummaryData?.goal[0]}`,
                              )}
                              <chakra.span color="gray.400">
                                {` +${portfolioSummaryData?.goal.length - 1}`}
                              </chakra.span>
                            </Text>
                          ) : (
                            t(
                              `header.goals.labels.${portfolioSummaryData?.goal[0]}`,
                            )
                          )}
                        </Text>
                      </Stack>

                      <InvestmentGoalHeader
                        label={t("header.labels.timeHorizon")}
                        value={`${
                          portfolioSummaryData?.timeHorizon
                        } ${formatYearName(
                          portfolioSummaryData?.timeHorizon,
                          lang,
                        )}`}
                      />
                      <InvestmentGoalHeader
                        label={t("header.labels.investmentAmount")}
                        value={
                          lang === "ar"
                            ? `${formatCurrencyWithoutSymbol(
                                portfolioSummaryData.investmentAmount,
                              )} ${t("common:generic.dollar")}`
                            : formatCurrency(
                                portfolioSummaryData.investmentAmount,
                              )
                        }
                      />

                      <InvestmentGoalHeader
                        label={t("header.labels.riskLevel")}
                        value={t(
                          `header.riskLevel.${portfolioSummaryData.riskLevel}`,
                        )}
                      />

                      {investmentGoalsData &&
                        investmentGoalsData.additionalPreferences?.length &&
                        pdfGenerating && (
                          <InvestmentGoalHeader
                            label={t("updateProposal.labels.preferences")}
                            value={getAdditionalPreferences(
                              investmentGoalsData.additionalPreferences,
                            )}
                          />
                        )}
                    </Stack>
                  </chakra.div>

                  {!isAccepted && (
                    <chakra.div>
                      {!pdfGenerating && (
                        <Button
                          variant="outline"
                          colorScheme="primary"
                          size="sm"
                          onClick={() => {
                            event(OpenEditWindowEvent)
                            onUpdateProposalModalOpen()
                          }}
                        >
                          {t("header.button.editDetails")}
                        </Button>
                      )}
                      <UpdateProposal
                        isOpen={isUpdateProposalModalOpen}
                        onClose={closeUpdateProposalModal}
                      />
                    </chakra.div>
                  )}
                </Stack>
              )}

            {!isLoading &&
              portfolioSummaryData &&
              (isMobileView || isTabletView) && (
                <Stack isInline display="flex" w="full" maxW="full" spacing="2">
                  <chakra.div
                    flex="1"
                    minW="0"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    {...(pdfGenerating && { h: "80px", ml: 2 })}
                  >
                    <Text lineHeight="1" mb="1">
                      <Text fontSize="md" textAlign="start">
                        {portfolioSummaryData?.goal.length > 1 ? (
                          <Text>
                            {t(
                              `header.goals.labels.${portfolioSummaryData?.goal[0]}`,
                            )}
                            <chakra.span color="gray.400">
                              {` +${portfolioSummaryData?.goal.length - 1}`}
                            </chakra.span>
                          </Text>
                        ) : (
                          t(
                            `header.goals.labels.${portfolioSummaryData?.goal[0]}`,
                          )
                        )}
                      </Text>
                    </Text>
                    <Stack
                      isInline
                      spacing="2"
                      // divider={<StackDivider borderColor="gray.500" />}
                      color="gray.500"
                    >
                      <Text fontSize="xs">
                        {`${portfolioSummaryData?.timeHorizon} ${formatYearName(
                          portfolioSummaryData?.timeHorizon,
                          lang,
                        )}`}
                      </Text>
                      <Divider
                        orientation="vertical"
                        borderColor="gray.500"
                        height="12px"
                        {...(pdfGenerating && { mt: "6px !important" })}
                      />
                      <Text fontSize="xs">
                        {formatCurrency(portfolioSummaryData.investmentAmount)}
                      </Text>
                    </Stack>
                    <Text
                      fontSize="xs"
                      color="gray.500"
                      mt={pdfGenerating ? "0" : "1"}
                    >
                      {t(`header.riskLevel.${portfolioSummaryData.riskLevel}`)}
                    </Text>
                  </chakra.div>

                  {!isAccepted && (
                    <chakra.div>
                      {!pdfGenerating && (
                        <Button
                          variant="link"
                          colorScheme="primary"
                          size="sm"
                          onClick={() => {
                            event(OpenEditWindowEvent)
                            onUpdateProposalModalOpen()
                          }}
                        >
                          {t("header.button.editDetails")}
                        </Button>
                      )}
                      <UpdateProposal
                        isOpen={isUpdateProposalModalOpen}
                        onClose={closeUpdateProposalModal}
                      />
                    </chakra.div>
                  )}
                </Stack>
              )}
          </Box>
          <Flex
            mt={
              pdfGenerating
                ? isMobileView
                  ? "-100px"
                  : isTabletView
                  ? "-40px"
                  : "20px"
                : "130px"
            }
            {...(pdfGenerating && isMobileView && { pl: "2", pr: "2" })}
            paddingInlineStart={{ md: isTabletView ? 0 : 2 }}
            paddingInlineEnd={{ md: isTabletView ? 5 : "78px" }}
          >
            {/* proposal left navigation section */}

            {!pdfGenerating && (
              <Flex
                aria-label="leftNavigation"
                w={isDesktopView && !isTabletView ? "300px" : "90%"}
                flexDirection="column"
                pos={isDesktopView && !isTabletView ? "fixed" : "absolute"}
              >
                {!ispersonalizedProposalLoading &&
                  personalizedProposalData &&
                  personalizedSelection !== -1 &&
                  personalizedProposalData.length > 1 && (
                    <Formik<ProposalType>
                      enableReinitialize
                      initialValues={{
                        proposalType: getProposalType()
                          ? incomeGrowthProposal[personalizedSelection]?.value
                          : shortLongProposal[personalizedSelection]?.value,
                      }}
                      onSubmit={() => {}}
                    >
                      {(formikProps) => (
                        <Box
                          {...(isTabletView && { ms: 6, mt: 6 })}
                          {...(isMobileView && { mt: 4 })}
                        >
                          <Text fontSize="sm" color="gray.500">
                            {t("leftNavigation.select.label")}
                          </Text>
                          <SelectControl
                            label={t("leftNavigation.label")}
                            name="proposalType"
                            aria-label="proposalType"
                            selectProps={{
                              placeholder: t(
                                "leftNavigation.select.placeholder",
                              ),
                              options: getProposalType()
                                ? incomeGrowthProposal
                                : shortLongProposal,
                              onChange: (option: OptionTypeBase) => {
                                formikProps.setFieldValue(
                                  "proposalType",
                                  option?.value,
                                )
                                setSelectedProposal(
                                  option?.value === "Income" ||
                                    option?.value === "ShortTerm"
                                    ? 0
                                    : 1,
                                )
                              },
                              isSearchable: false,
                            }}
                            mb="8"
                          />
                        </Box>
                      )}
                    </Formik>
                  )}
                {isDesktopView &&
                  !isTabletView &&
                  LEFT_NAVIGATION_LIST.map((eachItem) => {
                    return (
                      <Text
                        color={
                          selectedNavItem === eachItem.id
                            ? "primary.500"
                            : "gray.400"
                        }
                        fontSize="sm"
                        py={3}
                        paddingInlineStart={3}
                        key={eachItem.id}
                        borderInlineStart="2px solid"
                        borderColor={
                          selectedNavItem === eachItem.id
                            ? "primary.500"
                            : "gray.750"
                        }
                        cursor="pointer"
                        onClick={() =>
                          executeLeftNavScroll(eachItem.elementRef, eachItem.id)
                        }
                      >
                        {t(eachItem.title)}
                      </Text>
                    )
                  })}
              </Flex>
            )}

            <Flex
              {...(pdfGenerating &&
                isDesktopView && { bgColor: "gray.900", mt: 24 })}
              {...(pdfGenerating &&
                isMobileView && { bgColor: "gray.900", mt: 12 })}
              flexDirection="column"
              width={{
                md: isTabletView
                  ? "full"
                  : pdfGenerating
                  ? "calc(100% - 100px)"
                  : "calc(100% - 320px)",
              }}
              marginInlineStart="auto"
              paddingInlineStart={{ md: 6 }}
              {...(!ispersonalizedProposalLoading &&
                personalizedProposalData &&
                personalizedProposalData.length > 1 &&
                (isMobileView || isTabletView) && { mt: 24 })}
            >
              <Box position="relative">
                <Box
                  ref={yourAlloctionSecRef}
                  id="your-allocation-section"
                  position="absolute"
                  top={-100}
                />
                {!ispersonalizedProposalLoading &&
                personalizedProposalData &&
                personalizedProposalData.length ? (
                  <>
                    <ProposalOverview
                      data={personalizedProposalData[selectedProposal]}
                      proposalData={personalizedProposalData[0]}
                      // @ts-ignore
                      isRmView={isRmView}
                    />
                    <MyAllocation
                      selectedProposal={selectedProposal}
                      data={personalizedProposalData[selectedProposal]}
                      proposalData={personalizedProposalData[0]}
                    />

                    <AllocationDetail
                      selectedProposal={selectedProposal}
                      proposalData={personalizedProposalData[0].strategies}
                      allocationDetails={
                        personalizedProposalData[selectedProposal]?.strategies
                      }
                      pdfGenerating={pdfGenerating}
                    />
                  </>
                ) : (
                  <></>
                )}
              </Box>
              <Box position="relative">
                <Box
                  ref={investmentWorkSecRef}
                  id="investment-work-section"
                  position="absolute"
                  top={-100}
                />

                {!ispersonalizedProposalLoading &&
                personalizedProposalData &&
                personalizedProposalData.length ? (
                  <InvestmentWork
                    proposalData={personalizedProposalData[selectedProposal]}
                    proposalFullData={personalizedProposalData[0]}
                    graphData={
                      personalizedProposalData[selectedProposal]?.graphData
                    }
                    strategiesData={
                      personalizedProposalData[selectedProposal]
                        ?.transformedStrategiesData || []
                    }
                  />
                ) : (
                  <></>
                )}
                {!ispersonalizedProposalLoading &&
                personalizedProposalData &&
                personalizedProposalData.length ? (
                  <Box
                    position="relative"
                    {...(isMobileView && {
                      maxW: "sm",
                    })}
                  >
                    <Earnings
                      earnings={
                        personalizedProposalData[selectedProposal]?.earnings
                      }
                      earningsData={personalizedProposalData[0].earnings}
                      pdfGenerating={pdfGenerating}
                    />

                    <UpdateProposal
                      isOpen={isUpdateProposalModalOpen}
                      onClose={closeUpdateProposalModal}
                    />
                  </Box>
                ) : (
                  <></>
                )}
              </Box>

              {!isRmView && !pdfGenerating && (
                <Box position="relative">
                  <Box
                    ref={investmentWithUsSecRef}
                    id="investment-with-us-section"
                    position="absolute"
                    top={-100}
                  />
                  <InvestingWithTFO isKycCompleted={isKycCompleted} />
                </Box>
              )}

              <DiscussWithExpert />

              {pdfGenerating && (
                <>
                  <HStack>
                    <Text>{t("download.generatedBy")}</Text>
                    <Text>{`${user?.contactId}`}</Text>
                  </HStack>
                  <HStack mb="4">
                    <Text>{t("download.generatedAt")}</Text>
                    <Text>{getTodaysDate()}</Text>
                  </HStack>
                </>
              )}
            </Flex>
          </Flex>
        </Box>
      </ModalLayout>
      {showLanguageSwitchNotificationModal()}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { res } = ctx
  const { personalizedProposalEnabled } = siteConfig?.featureFlags

  if (!personalizedProposalEnabled) {
    res.writeHead(302, { Location: "/" })
    res.end()
  }

  return {
    props: {},
  }
}

export default withPageAuthRequired(MyProposalScreen)
