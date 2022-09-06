import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import { Button, IconButton } from "@chakra-ui/button"
import {
  Box,
  Center,
  Circle,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/layout"
import {
  BoxProps,
  chakra,
  Collapse,
  FormControl,
  FormErrorMessage,
  FormLabel,
  useBreakpointValue,
  useDisclosure,
  useMediaQuery,
  useToast,
  useToken,
} from "@chakra-ui/react"
import { add, addDays, format, isToday, isValid, parse } from "date-fns"
import { Form, Formik, useField, useFormikContext } from "formik"
import ky from "ky"
import router, { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import { useCallback, useEffect, useState } from "react"
import LinkedInTag from "react-linkedin-insight"
import { OptionTypeBase } from "react-select"
import useSWR from "swr"
import * as yup from "yup"

import {
  CalendarIcon,
  Card,
  CardContent,
  CaretUpIcon,
  InputControl,
  IslamIcon,
  MeetingChatIcon,
  ModalFooter,
  ModalHeader,
  ModalLayout,
  SelectControl,
  TextareaControl,
} from "~/components"
import Datepicker from "~/components/DatePicker/DatePicker"
import siteConfig from "~/config"
import { usePhoneCountryCodeList, useTimeZoneList } from "~/hooks/useList"
import { useUser } from "~/hooks/useUser"
import { MyTfoClient } from "~/services/mytfo"
import {
  MeetingInfo,
  MeetingSchedule,
  MeetingSlot,
  MeetingSlotStatus,
  Opportunity,
  RelationshipManager,
} from "~/services/mytfo/types"
import availableTimeSlots from "~/utils/data/availableTimeSlots"
import timeZones from "~/utils/data/timeZones"
import {
  EmailSentForScheduledACallWithClientServiceEvent,
  ScheduleCallEvent,
} from "~/utils/googleEvents"
import { event } from "~/utils/gtag"

import OtpVerification from "../otp-verification"

function parseDateString(_value: string, originalValue: string) {
  return isValid(originalValue)
    ? originalValue
    : parse(
        originalValue.split("/").reverse().join("-"),
        "yyyy-MM-dd",
        new Date(),
      )
}

interface AvailableTimeSlotsProps {
  name: string
  availableSlots: MeetingSlot[]
}

type ScheduleMeetingFormInput = {
  timeZone?: string
  availableDate?: string
  availableTimeSlot?: string
  callReason?: string
  meetingType: string
  email?: string
  phoneNumber?: string
  phoneCountryCode?: string
  additionalInfo?: string
}

function AvailableTimeSlots(props: AvailableTimeSlotsProps) {
  const [, meta, helpers] = useField(props.name)

  const { value } = meta
  const { setValue } = helpers

  return (
    <SimpleGrid columns={{ base: 2, md: 2 }} spacing={2} width="full">
      {props.availableSlots.map((timeSlot) => {
        const timeSlotText = timeSlot.time.slice(0, 5)
        const displayedTimeSlot = `${timeSlot.from} - ${timeSlot.to}`
        return (
          <Center
            borderRadius="md"
            aria-label="timeSlot"
            bg="gray.800"
            height="40px"
            boxShadow="0px 0px 24px rgba(0, 0, 0, 0.75)"
            key={timeSlot.time}
            _hover={{
              cursor: "not-allowed",
            }}
            color="gray.700"
            {...(timeSlot?.available && {
              onClick: () => setValue(timeSlotText),
              color: "primary.500",
              _hover: {
                cursor: "pointer",
              },
            })}
            {...(value === timeSlotText && {
              border: "2px solid",
              borderColor: "primary.500",
            })}
          >
            <Text>{displayedTimeSlot}</Text>
          </Center>
        )
      })}
    </SimpleGrid>
  )
}

interface SummaryCardProps extends BoxProps {
  relationshipManager: RelationshipManager
  opportunityTitle?: string
}
function SummaryCard(props: SummaryCardProps) {
  const { t } = useTranslation("scheduleMeeting")
  const { relationshipManager, opportunityTitle, ...rest } = props
  const isMobileView = useBreakpointValue({ base: true, md: false })
  // to check if its ipad or ipad air
  const [isLessThan830] = useMediaQuery("(max-width: 830px)")
  const {
    values: {
      availableDate,
      timeZone,
      availableTimeSlot,
      meetingType,
      phoneCountryCode,
      phoneNumber,
      email,
      callReason,
    },
    submitForm,
    isSubmitting,
  } = useFormikContext<ScheduleMeetingFormInput>()

  return (
    <Card
      aria-label="callDetailsSummary"
      alignSelf="flex-start"
      width={{ base: "full", md: isLessThan830 ? "22rem" : "xs", lg: "sm" }}
      {...rest}
    >
      <CardContent {...(isMobileView && { p: "0" })}>
        <Flex flexDirection="column">
          {relationshipManager.assigned && (
            <>
              <Text fontSize="xs" color="gray.400" mb="4">
                {t("labels.relationshipManager")}
              </Text>
              <Divider borderColor="gray.700" mb="4" />
              <HStack aria-label="rmName" mb="6">
                <Text fontSize="lg">{`${relationshipManager?.manager?.firstName} ${relationshipManager?.manager?.lastName}`}</Text>
                <Spacer />
                <Circle
                  size="10"
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
                  <MeetingChatIcon color="secondary.500" w="5" h="5" />
                </Circle>
              </HStack>
            </>
          )}
          <Text fontSize="xs" color="gray.400" mb="4">
            {t("labels.callDetails")}
          </Text>
          <Divider borderColor="gray.700" mb="4" />

          <HStack aria-label="timeZone" fontSize="sm" mb="3">
            <Text>{t("labels.timeZone")}</Text>
            <Spacer />
            <Text
              color={timeZone ? "intial" : "gray.400"}
              fontWeight={timeZone ? "bold" : "normal"}
            >
              {timeZones.find((t) => t.value === timeZone)?.offset ||
                t("text.missing")}
            </Text>
          </HStack>
          <HStack aria-label="date" fontSize="sm" mb="3">
            <Text>{t("labels.date")}</Text>
            <Spacer />
            <Text
              color={availableDate ? "intial" : "gray.400"}
              fontWeight={availableDate ? "bold" : "normal"}
            >
              {availableDate || t("text.missing")}
            </Text>
          </HStack>
          <HStack aria-label="time" fontSize="sm" mb="3">
            <Text>{t("labels.time")}</Text>
            <Spacer />
            <Text
              color={availableTimeSlot ? "intial" : "gray.400"}
              fontWeight={availableTimeSlot ? "bold" : "normal"}
            >
              {availableTimeSlot || t("text.missing")}
            </Text>
          </HStack>
          <HStack aria-label="meetingType" fontSize="sm" mb="3">
            <Text>{t("labels.meetingType")}</Text>
            <Spacer />
            <Text
              color={meetingType ? "intial" : "gray.400"}
              fontWeight={meetingType ? "bold" : "normal"}
            >
              {meetingType
                ? t(`meetingType.options.${meetingType}`)
                : t("text.missing")}
            </Text>
          </HStack>
          <HStack aria-label="contact" fontSize="sm" mb="6">
            <Text>
              {t(
                meetingType === "phoneCall"
                  ? "labels.phoneNumber"
                  : "labels.email",
              )}
            </Text>
            <Spacer />
            <Text fontWeight="bold" sx={{ direction: "ltr" }}>
              {meetingType === "phoneCall"
                ? `${phoneCountryCode} ${phoneNumber}`
                : email}
            </Text>
          </HStack>
          <Text fontSize="xs" color="gray.400" mb="4">
            {t("labels.callSpecifications")}
          </Text>
          <Divider borderColor="gray.700" mb="4" />
          <HStack aria-label="reason" fontSize="sm" mb="3" textAlign="right">
            <Text>{t("labels.reason")}</Text>
            <Spacer />
            <Text
              color={callReason ? "intial" : "gray.400"}
              fontWeight={callReason ? "bold" : "normal"}
            >
              {callReason
                ? t(`callReason.options.${callReason}`)
                : t("text.notSpecified")}
            </Text>
          </HStack>
          {opportunityTitle && (
            <HStack aria-label="opportunityTitle" fontSize="sm" mb="6">
              <Text>{t("labels.attached")}</Text>
              <Spacer />
              <Text fontWeight="bold">{opportunityTitle}</Text>
            </HStack>
          )}
          {!isMobileView && (
            <Button
              colorScheme="primary"
              onClick={submitForm}
              isLoading={isSubmitting}
            >
              {router.query.id ? t("button.update") : t("button.call")}
            </Button>
          )}
        </Flex>
      </CardContent>
    </Card>
  )
}

interface FooterProps extends BoxProps {
  relationshipManager: RelationshipManager
  opportunityTitle?: string
}

function Footer(props: FooterProps) {
  const { isOpen, onToggle } = useDisclosure()
  const { t } = useTranslation("scheduleMeeting")
  const { submitForm, isSubmitting } =
    useFormikContext<ScheduleMeetingFormInput>()

  return (
    <ModalFooter position="fixed" bottom="0" w="full" pt="0">
      <Box w="full">
        <Center>
          <IconButton
            aria-label="expand card"
            size="sm"
            variant="ghost"
            _hover={{
              background: "none",
            }}
            colorScheme="primary"
            icon={
              <CaretUpIcon
                w="4"
                h="4"
                transform={isOpen ? "rotate(180deg)" : "none"}
              />
            }
            onClick={onToggle}
          />
        </Center>
        <Divider borderColor="gray.850" mb="4" />
        <Collapse in={isOpen} animateOpacity>
          <SummaryCard
            relationshipManager={props.relationshipManager}
            bg="gray.800"
            boxShadow="none"
            opportunityTitle={props?.opportunityTitle}
          />
        </Collapse>
        <Button
          colorScheme="primary"
          isFullWidth
          onClick={submitForm}
          isLoading={isSubmitting}
        >
          {t("button.call")}
        </Button>
      </Box>
    </ModalFooter>
  )
}

interface ScheduleMeetingScreenProps {
  reason?: string
  opportunity?: Opportunity
}

const getInitialTimeZone = (userCountryOfResidence: string) => {
  if (["AE", "OM"].indexOf(userCountryOfResidence) >= 0) {
    return "Arabian Standard Time"
  }

  if (["SA", "QA", "KW", "BH"].indexOf(userCountryOfResidence) >= 0) {
    return "Arab Standard Time"
  }
  return undefined
}

function ScheduleMeetingScreen(props: ScheduleMeetingScreenProps) {
  const { t, lang } = useTranslation("scheduleMeeting")
  const toast = useToast()
  const router = useRouter()
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const phoneCountryCodeList = usePhoneCountryCodeList()
  const { user } = useUser()
  const isDesktopView = useBreakpointValue({ base: false, md: true })
  const [contrast200, primary500] = useToken("colors", [
    "contrast.200",
    "primary.500",
  ])
  const [showOtpScreen, setShowOtpScreen] = useState(false)
  const [meetingDetails, setMeetingDetails] = useState<MeetingInfo | null>(null)
  const getMeetingDetails = async (meetingId: string | string[]) => {
    try {
      const response = await ky
        .post("/api/portfolio/meetings/details", {
          json: {
            eventId: meetingId,
          },
        })
        .json<MeetingInfo>()
      const subjectObject = callReasonOptions.find(
        (x) => x.label === response?.subject,
      )
      setMeetingDetails({
        ...response,
        subject: subjectObject?.value || "",
      })
    } catch (error) {
      const meetingToastID = "meetingToastID"
      if (!toast.isActive(meetingToastID)) {
        toast({
          id: meetingToastID,
          title: t("toast.updateMeeting.error.title"),
          variant: "subtle",
          status: "error",
          isClosable: true,
          position: "bottom",
        })
      }
    }
  }

  useEffect(() => {
    if (router.query.id) {
      getMeetingDetails(router?.query?.id)
    }
  }, [router.query.id])

  const { customerServiceEmail } = siteConfig

  const direction = lang === "ar" ? "rtl" : "ltr"

  const [showSuccess, setShowSuccess] = useState(false)
  const [schedule, setSchedule] = useState<MeetingSchedule>()
  const [timeSlots, setTimeSlot] = useState(availableTimeSlots)
  const [requestObject, setRequestObject] = useState({})

  // to check if its ipad or ipad air
  const [isLessThan830] = useMediaQuery("(max-width: 830px)")

  const { opportunity, reason } = props

  const rmToastID = "rmToastID"

  let callReasonOptions = [
    {
      label: t("callReason.options.TFO"),
      value: "TFO",
    },
    {
      label: t("callReason.options.portfolio"),
      value: "portfolio",
    },
    {
      label: t("callReason.options.proposal"),
      value: "proposal",
    },
    {
      label: t("callReason.options.other"),
      value: "other",
    },
  ]

  if (reason === "opportunity") {
    callReasonOptions = [
      ...callReasonOptions,
      {
        label: t("callReason.options.opportunity"),
        value: "opportunity",
      },
    ]
  }

  const meetingTypeOptions = [
    {
      label: t("meetingType.options.phoneCall"),
      value: "phoneCall",
    },
    {
      label: t("meetingType.options.virtualMeeting"),
      value: "virtualMeeting",
    },
  ]

  const timeZoneOptions = useTimeZoneList()

  const scheduleMeetingSchema = yup.object().shape({
    availableDate: yup
      .date()
      .transform(parseDateString)
      .typeError(t("availableDate.errors.valid"))
      .min(
        new Date(new Date().setHours(0, 0, 0, 0)),
        t("availableDate.errors.past"),
      )
      .required(t("common:errors.required")),
    email: yup.string().when("meetingType", {
      is: "virtualMeeting",
      then: yup.string().required(t("common:errors.required")),
      otherwise: yup.string().email(),
    }),
    phoneCountryCode: yup.string().when("meetingType", {
      is: "phoneCall",
      then: yup.string().required(t("common:errors.required")),
    }),
    phoneNumber: yup
      .number()
      .nullable()
      .when("meetingType", {
        is: "phoneCall",
        then: yup
          .number()
          .required(t("common:errors.required"))
          .when("phoneCountryCode", {
            is: (value: string) => {
              return value === "+966"
            },

            then: yup
              .number()
              .typeError(t("common:errors.numberAllowed"))
              .test(
                "len",
                t("common:errors.phoneNumberLength", {
                  digit: 9,
                }),
                (val) => val?.toString().length === 9,
              )
              .nullable(),
          })
          .when("phoneCountryCode", {
            is: (value: string) => {
              return (
                value === "+974" ||
                value === "+965" ||
                value === "+968" ||
                value === "+973"
              )
            },
            then: yup
              .number()
              .typeError(t("common:errors.numberAllowed"))
              .test(
                "len",
                t("common:errors.phoneNumberLength", {
                  digit: 8,
                }),
                (val) => val?.toString().length === 8,
              )
              .nullable(),
          })
          .when("phoneCountryCode", {
            is: (value: string) => {
              return (
                value !== "+966" &&
                value !== "+965" &&
                value !== "+973" &&
                value !== "+968" &&
                value !== "+974"
              )
            },
            then: yup
              .number()
              .typeError(t("common:errors.numberAllowed"))
              .test(
                "len",
                t("common:errors.phoneNumberLengthMax", {
                  digit: 15,
                }),
                (val) => {
                  if (val && val?.toString().length <= 15) return true
                  return false
                },
              )
              .nullable(),
          }),
        otherwise: yup.number().typeError(t("phoneNumber.errors.inValid")),
      }),
    callReason: yup.string().required(t("common:errors.required")),
    meetingType: yup.string().required(t("common:errors.required")),
    availableTimeSlot: yup.string().required(t("common:errors.required")),
    timeZone: yup.string().required(t("common:errors.required")),
  })

  function renderSuccess() {
    return (
      <Flex justifyContent="center" alignItems="center" mt="20">
        <Box maxW="lg" textAlign="center">
          <Circle size="96px" bgColor="gray.800" mx="auto" mb="10">
            <CalendarIcon color="primary.500" w="12" h="12" />
          </Circle>
          <Heading size="lg" mb="6">
            {t("success.title")}
          </Heading>
          <Text fontSize="sm" color="gray.400" mb="12">
            {t("success.description")}
          </Text>
          <Button colorScheme="primary" onClick={router.back} width="10rem">
            {t("button.close")}
          </Button>
        </Box>
      </Flex>
    )
  }

  const { data: relationshipManager, error: relationshipManagerError } =
    useSWR<RelationshipManager>("/api/user/relationship-manager")

  function fetchSubjects(subject: string) {
    return {
      TFO: "I want to know more about The Family Office",
      portfolio: "I want to discuss my simulated portfolio",
      proposal: "I want to discuss my suggested proposal",
      other: "Other",
      opportunity: "I want to discuss the offered opportunities",
    }[subject]
  }

  const sendVerificationCode = async (phoneNumber?: string) => {
    await ky.post("/api/auth/send-otp", {
      json: {
        phoneNumber:
          phoneNumber ||
          `${user?.profile?.phoneCountryCode}${user?.profile?.phoneNumber}`,
      },
    })

    setShowOtpScreen(true)
  }

  async function scheduleOrUpdateCall(requestObj?: object) {
    try {
      if (router.query.id) {
        const reqObj = requestObj
          ? { ...requestObj, eventId: router?.query?.id }
          : { ...requestObject, eventId: router?.query?.id }
        await ky
          .put("/api/portfolio/meetings/update", {
            json: reqObj,
            headers: {
              "Accept-Language": lang,
            },
          })
          .json()
      } else {
        await ky
          .post("/api/portfolio/meetings/schedule", {
            json: requestObj ? requestObj : requestObject,
            headers: {
              "Accept-Language": lang,
            },
          })
          .json()
      }
      setShowOtpScreen(false)
      setShowSuccess(true)
    } catch (e) {
      const meetingToastID = "meetingToastID"
      if (!toast.isActive(meetingToastID)) {
        toast({
          id: meetingToastID,
          title: t("toast.scheduleMeeting.error.title"),
          variant: "subtle",
          status: "error",
          isClosable: true,
          position: "bottom",
        })
      }
      setShowOtpScreen(false)
    }
  }

  async function handleSubmit(values: ScheduleMeetingFormInput) {
    LinkedInTag.track("8782993")

    event(ScheduleCallEvent)
    const startTime = `${values.availableDate}T${values.availableTimeSlot}`

    const endTime = format(
      add(new Date(startTime), { hours: 1 }),
      "yyyy-MM-dd'T'HH:mm:ss",
    )

    const contactEmail = relationshipManager?.assigned
      ? relationshipManager.manager?.email
      : customerServiceEmail

    let subject = fetchSubjects(values.callReason as string)

    if (opportunity && opportunity.title) {
      subject += ` - ${opportunity.title}`
    }
    event(EmailSentForScheduledACallWithClientServiceEvent)

    const reqObject = {
      contactEmail,
      subject,
      content: values.additionalInfo,
      startTime,
      endTime,
      timeZone: values.timeZone,
      location:
        values.meetingType === "virtualMeeting"
          ? values.email
          : `${values.phoneCountryCode} ${values.phoneNumber}`,
      isOnlineMeeting: values.meetingType === "virtualMeeting",
    }

    setRequestObject(reqObject)

    if (user?.phoneNumberVerified || values.meetingType === "virtualMeeting") {
      scheduleOrUpdateCall(reqObject)
    } else {
      await sendVerificationCode(
        `${values.phoneCountryCode}${values.phoneNumber}`,
      )
    }
  }

  const isCustomWeekday = (date: Date) => {
    const day = date.getDay()
    return day !== 6 && day !== 5
  }

  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 6)

  const getHighlightedDates = useCallback(() => {
    const highlightDates = []
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 6)
    const noOfDays = Math.round(
      (endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    )
    let i = 0
    while (i < noOfDays) {
      i++
      highlightDates.push(addDays(new Date(), i))
    }
    return highlightDates
  }, [])

  const isAvailableTimeSlotsInPast = useCallback((date: Date) => {
    let slots = availableTimeSlots
    if (isToday(date)) {
      const hoursAtPresent = new Date().getHours()
      slots = availableTimeSlots.map((slot) => {
        const startHours = parseInt(slot.from.split(":")[0], 10)
        if (startHours < hoursAtPresent) {
          return {
            ...slot,
            available: false,
            status: MeetingSlotStatus.Unavailable,
          }
        }
        return slot
      })
    }
    setTimeSlot(slots)
  }, [])

  // Note: Pending design decisions from Product/Design.
  if (relationshipManagerError) {
    if (!toast.isActive(rmToastID)) {
      toast({
        id: rmToastID,
        title: t("toast.relationshipManager.error.title"),
        variant: "subtle",
        status: "error",
        isClosable: true,
        position: "bottom",
      })
    }
    return null
  }

  if (!relationshipManager) {
    return null
  }
  const isMeetingDetail = router.query.id && meetingDetails
  return (
    <Formik
      initialValues={{
        timeZone: isMeetingDetail
          ? meetingDetails.timeZone
          : getInitialTimeZone(user?.profile?.countryOfResidence!),
        availableDate: isMeetingDetail
          ? (meetingDetails.startTime as string).substring(0, 10)
          : undefined,
        availableTimeSlot: isMeetingDetail
          ? (meetingDetails.startTime as string).substring(11, 16)
          : undefined,
        callReason: isMeetingDetail ? meetingDetails.subject : reason,
        meetingType: isMeetingDetail
          ? meetingDetails.isOnlineMeeting
            ? "virtualMeeting"
            : "phoneCall"
          : "phoneCall",
        email: user?.email,
        phoneNumber: user?.profile.phoneNumber || "",
        phoneCountryCode: user?.profile.phoneCountryCode || "",
        additionalInfo: isMeetingDetail ? meetingDetails.content : "",
      }}
      enableReinitialize
      validationSchema={scheduleMeetingSchema}
      onSubmit={handleSubmit}
    >
      {(formikProps) =>
        showOtpScreen ? (
          <OtpVerification
            scheduleSubmit={scheduleOrUpdateCall}
            scheduleCallOnSubmit={true}
            showOtpScreen={() => setShowOtpScreen(false)}
            updatedPhoneNumber={`${formikProps.values.phoneCountryCode}${formikProps.values.phoneNumber}`}
          />
        ) : (
          <ModalLayout
            title={t("page.title")}
            description={t("page.description")}
            header={
              <ModalHeader
                {...(isMobileView && {
                  boxShadow: "0 0 0 4px var(--chakra-colors-gray-900)",
                })}
                headerLeft={
                  !showSuccess &&
                  isDesktopView && (
                    <Stack isInline ps="6" spacing="6" alignItems="center">
                      <Divider
                        orientation="vertical"
                        bgColor="white"
                        height="28px"
                      />
                      <Text color="gray.400" fontSize="sm">
                        {isMeetingDetail
                          ? t("updateCall.header.title")
                          : t(
                              relationshipManager.assigned
                                ? "rmAssigned.header.title"
                                : "header.title",
                            )}
                      </Text>
                    </Stack>
                  )
                }
                headerRight={
                  !showSuccess && (
                    <Button
                      me="4"
                      onClick={router.back}
                      aria-label="Close schedule meeting modal"
                      size="sm"
                      colorScheme="primary"
                      rounded="full"
                      variant="ghost"
                    >
                      {t("common:button.exit")}
                    </Button>
                  )
                }
              />
            }
            footer={
              isMobileView &&
              !showSuccess && (
                <Footer
                  relationshipManager={relationshipManager}
                  opportunityTitle={opportunity?.title}
                />
              )
            }
          >
            <Container
              maxW="5xl"
              py={{ base: 8, md: 24 }}
              mb={{ base: 8, md: 0 }}
              px={{ base: 0, md: 0, lg: 0 }}
              {...(isMobileView && { pt: 0 })}
            >
              <chakra.div transition="0.1s filter linear">
                {showSuccess ? (
                  renderSuccess()
                ) : (
                  <Stack flexDirection={{ base: "column", md: "row" }}>
                    <VStack w={{ md: "lg" }} maxW="lg" mb={{ base: "90px" }}>
                      <Heading mb="12">
                        {t(
                          relationshipManager.assigned
                            ? "rmAssigned.header.subtitle"
                            : "header.subtitle",
                        )}
                      </Heading>

                      <Form style={{ width: "100%" }}>
                        <VStack spacing={["6", "8"]} alignItems="start">
                          <SelectControl
                            name="timeZone"
                            label={t("timeZone.label")}
                            selectProps={{
                              options: timeZoneOptions,
                              placeholder: t("common:select.placeholder"),
                              isFullWidth: true,
                              onChange: (e: OptionTypeBase) => {
                                formikProps.setFieldValue("timeZone", e?.value)
                                formikProps.values.availableTimeSlot &&
                                  formikProps.setFieldValue(
                                    "availableTimeSlot",
                                    undefined,
                                  )
                                schedule && setSchedule(undefined)
                                formikProps.setFieldValue(
                                  "availableDate",
                                  undefined,
                                )
                              },
                            }}
                          />
                          <Datepicker
                            name="availableDate"
                            label={t("availableDate.label")}
                            placeholder={t("availableDate.placeholder")}
                            selectedDate={
                              formikProps.values.availableDate
                                ? new Date(
                                    formikProps.values.availableDate as string,
                                  )
                                : undefined
                            }
                            filterDate={isCustomWeekday}
                            highlightWithRanges={getHighlightedDates()}
                            minDate={new Date()}
                            maxDate={maxDate}
                            footerDetails={[
                              {
                                title: t("calendarLegends.today"),
                                color: contrast200,
                                isCircle: true,
                              },
                              {
                                title: t("calendarLegends.availableTimes"),
                                color: primary500,
                                isCircle: true,
                              },
                              {
                                title: t("calendarLegends.selected"),
                                color: primary500,
                                isCircle: false,
                              },
                            ]}
                            onDateChange={async (date: Date) => {
                              await formikProps.setFieldValue(
                                "availableDate",
                                format(new Date(date), "yyyy-MM-dd"),
                              )
                              formikProps.setFieldValue(
                                "availableTimeSlot",
                                undefined,
                              )

                              formikProps.setFieldTouched(
                                "availableDate",
                                true,
                                true,
                              )
                              isAvailableTimeSlotsInPast(date)
                            }}
                            disabled={!formikProps.values.timeZone}
                            isValid={
                              !!formikProps.errors.availableDate &&
                              formikProps.touched.availableDate
                            }
                            setSelectedDateFlag={true}
                          />
                          {formikProps.values.availableDate && (
                            <FormControl
                              isInvalid={!!formikProps.errors.availableTimeSlot}
                            >
                              <FormLabel>
                                {t("availableTimeSlots.label")}
                              </FormLabel>
                              <AvailableTimeSlots
                                name="availableTimeSlot"
                                availableSlots={timeSlots}
                              />
                              <FormErrorMessage>
                                {formikProps.touched.availableTimeSlot &&
                                  formikProps.errors.availableTimeSlot}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                          <SelectControl
                            name="meetingType"
                            label={t("meetingType.label")}
                            selectProps={{
                              placeholder: t("common:select.placeholder"),
                              options: meetingTypeOptions,
                              isFullWidth: true,
                            }}
                          />

                          {formikProps.values.meetingType === "phoneCall" && (
                            <>
                              <FormControl>
                                <HStack>
                                  <FormLabel
                                    color="gray.400"
                                    display="flex"
                                    alignItems="center"
                                    pb="0"
                                    mb="0"
                                  >
                                    {t("labels.phoneNumber")}
                                  </FormLabel>
                                  {user?.phoneNumberVerified ? (
                                    <Text
                                      color="shinyShamrock.800"
                                      fontSize="xs"
                                      px="2"
                                      py="1"
                                      bgColor="shinyShamrock.800WithOpacity"
                                      borderRadius="6px"
                                    >
                                      {t("common:labels.verified")}
                                    </Text>
                                  ) : (
                                    <Text
                                      color="warningRed.300"
                                      fontSize="xs"
                                      px="2"
                                      py="1"
                                      bgColor="warningRed.300WithOpacity"
                                      borderRadius="6px"
                                    >
                                      {t("common:labels.notVerified")}
                                    </Text>
                                  )}
                                </HStack>

                                <Stack
                                  alignItems="flex-start"
                                  direction={
                                    direction === "rtl" ? "row-reverse" : "row"
                                  }
                                >
                                  <SelectControl
                                    name="phoneCountryCode"
                                    selectProps={{
                                      options: phoneCountryCodeList,
                                    }}
                                    w="70%"
                                    isDisabled={user?.phoneNumberVerified}
                                  />
                                  <InputControl
                                    name="phoneNumber"
                                    pt="2"
                                    isDisabled={user?.phoneNumberVerified}
                                  />
                                </Stack>
                                <Text fontSize="xs" color="gray.400" mt="3">
                                  {t("common:labels.verifyCall")}
                                </Text>
                              </FormControl>
                            </>
                          )}

                          {formikProps.values.meetingType ===
                            "virtualMeeting" && (
                            <InputControl
                              name="email"
                              label={t("labels.email")}
                              inputProps={{
                                variant: "flushed",
                                disabled: true,
                                _disabled: {
                                  cursor: "not-allowed",
                                  color: "gray.600",
                                },
                              }}
                            />
                          )}

                          <SelectControl
                            name="callReason"
                            label={t("callReason.label")}
                            selectProps={{
                              placeholder: t("common:select.placeholder"),
                              options: callReasonOptions,
                              isFullWidth: true,
                              isDisabled: !!reason,
                            }}
                          />
                          {opportunity && (
                            <FormControl>
                              <FormLabel>{t("labels.attachedDeal")}</FormLabel>
                              <Card>
                                <CardContent>
                                  <HStack mb="2">
                                    <Heading size="sm">
                                      {opportunity.title}
                                    </Heading>
                                    {opportunity.isShariahCompliant && (
                                      <Box
                                        color="gray.900"
                                        backgroundColor="secondary.500"
                                        position="absolute"
                                        insetEnd="0"
                                        top="4"
                                        borderStartRadius="full"
                                        px="2"
                                      >
                                        <IslamIcon
                                          me="1"
                                          w="3"
                                          h="3"
                                          color="gray.900"
                                        />
                                        <Text
                                          aria-label="isShariahCompliant"
                                          as="span"
                                          fontSize="xs"
                                          fontWeight="bold"
                                        >
                                          {t("tag.shariah")}
                                        </Text>
                                      </Box>
                                    )}
                                  </HStack>
                                  <Text color="gray.400" fontSize="sm">
                                    {opportunity.sponsor}
                                  </Text>
                                </CardContent>
                              </Card>
                            </FormControl>
                          )}
                          <TextareaControl
                            name="additionalInfo"
                            label={t("additionalInfo.label")}
                            textAreaProps={{
                              maxLength: 255,
                            }}
                          />
                        </VStack>
                      </Form>
                    </VStack>
                    <Spacer minW={isLessThan830 ? "12" : "20"} />
                    {isDesktopView && (
                      <VStack spacing="8">
                        <SummaryCard
                          relationshipManager={relationshipManager}
                          opportunityTitle={opportunity?.title}
                        />
                        <Text
                          color="gray.500"
                          size="sm"
                          textAlign="start"
                          alignSelf="flex-start"
                        >
                          {t("text.required")}
                        </Text>
                      </VStack>
                    )}
                  </Stack>
                )}
              </chakra.div>
            </Container>
          </ModalLayout>
        )
      }
    </Formik>
  )
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    try {
      const client = new MyTfoClient(ctx.req, ctx.res)
      const id = ctx.query?.opportunityId as string
      if (id) {
        const opportunity = await client.portfolio.getOpportunity({ id })
        return {
          props: {
            opportunity,
            reason: "opportunity",
          },
        }
      }
      return {
        props: {},
      }
    } catch (error: unknown) {
      return {
        props: {
          reason: "opportunity",
        },
      }
    }
  },
})

export default ScheduleMeetingScreen
