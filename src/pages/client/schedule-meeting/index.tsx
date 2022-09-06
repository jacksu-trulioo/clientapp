import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
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
import { add, format, isValid, parse } from "date-fns"
import { Form, Formik, useField, useFormikContext } from "formik"
import ky from "ky"
import moment from "moment"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import { Fragment, useEffect, useState } from "react"
import { OptionTypeBase } from "react-select"
import * as yup from "yup"

import {
  CalendarIcon,
  Card,
  CardContent,
  CaretUpIcon,
  ClientModalFooter,
  ClientModalHeader,
  ClientModalLayout,
  Datepicker,
  InputControl,
  IslamIcon,
  MeetingChatIcon,
  SelectControl,
} from "~/components"
import { usePhoneCountryCodeList, useTimeZoneList } from "~/hooks/useList"
import { useUser } from "~/hooks/useUser"
import { MyTfoClient } from "~/services/mytfo"
import {
  AvailableSchedule,
  clientOpportunities,
  clientOpportunitiesArray,
  ClientRelationshipManager,
  MeetingSchedule,
  MeetingSlot,
} from "~/services/mytfo/types"
import { getOpportunitybyId } from "~/utils/clientUtils/getOpportunity"
import timeZones from "~/utils/data/timeZones"
import {
  screenSpentTime,
  selectScheduleMeetingOption,
  selectScheduleMeetingSlot,
} from "~/utils/googleEventsClient"
import { clientEvent, clientUniEvent } from "~/utils/gtag"

import styles from "../../../styles/Selectbox.module.css"

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
  handleClick: Function
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
  const [meta] = useField(props.name)
  const { value } = meta

  return (
    <SimpleGrid columns={{ base: 3, md: 4 }} spacing={2} width="full">
      {props.availableSlots.map((timeSlot) => {
        const timeSlotText = moment(`1990-01-01T${timeSlot.time}`).format(
          "HH:mm",
        )
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
            px="5px"
            {...(timeSlot?.available && {
              onClick: () => {
                props.handleClick(timeSlotText)
              },
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
            <Text dir="ltr">{timeSlotText}</Text>
          </Center>
        )
      })}
    </SimpleGrid>
  )
}

interface SummaryCardProps extends BoxProps {
  relationshipManager: ClientRelationshipManager
  opportunityTitle?: string
  session?: {
    email: string
  }
}

function SummaryCard(props: SummaryCardProps) {
  const { t, lang } = useTranslation("scheduleMeeting")
  const { relationshipManager, opportunityTitle, ...rest } = props
  const isMobileView = useBreakpointValue({ base: true, md: false })
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
      width={{ base: "full", md: isLessThan830 ? "22rem" : "xs", lgp: "sm" }}
      {...rest}
    >
      <CardContent {...(isMobileView && { p: "0" })}>
        <Flex flexDirection="column">
          {relationshipManager.manager?.name && (
            <>
              <Text fontSize="xs" color="gray.400" mb="4">
                {t("labels.relationshipManager")}
              </Text>
              <Divider borderColor="gray.700" mb="4" />
              <HStack aria-label="rmName" mb="6">
                <Text fontSize="lg">{relationshipManager?.manager?.name}</Text>
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
              dir="ltr"
              color={availableTimeSlot ? "intial" : "gray.400"}
              fontWeight={availableTimeSlot ? "bold" : "normal"}
              marginInlineStart="0 !important"
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
            <Text
              fontWeight="bold"
              whiteSpace="nowrap"
              overflow="hidden"
              width="50%"
              textAlign={lang == "ar" ? "start" : "end"}
              textOverflow="ellipsis"
              marginInlineStart="0 !important"
              style={{ direction: "ltr" }}
            >
              {meetingType === "phoneCall" ? (
                phoneCountryCode && phoneNumber ? (
                  `${phoneCountryCode} ${phoneNumber}`
                ) : (
                  <Text fontWeight="400" color="gray.400">
                    {t("text.missing")}
                  </Text>
                )
              ) : (
                email
              )}
            </Text>
          </HStack>
          <Text fontSize="xs" color="gray.400" mb="4">
            {t("labels.callSpecifications")}
          </Text>
          <Divider borderColor="gray.700" mb="4" />
          <HStack aria-label="reason" fontSize="sm" mb="3">
            <Text>{t("labels.reason")}</Text>
            <Spacer />
            <Text
              color={callReason ? "intial" : "gray.400"}
              fontWeight={callReason ? "bold" : "normal"}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {callReason
                ? t(`callReason.options.${callReason}`)
                : t("text.notSpecified")}{" "}
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
              {t("button.call")}
            </Button>
          )}
        </Flex>
      </CardContent>
    </Card>
  )
}

interface FooterProps extends BoxProps {
  relationshipManager: ClientRelationshipManager
  opportunityTitle?: string
}

function Footer(props: FooterProps) {
  const { isOpen, onToggle } = useDisclosure()
  const { t } = useTranslation("scheduleMeeting")
  const { submitForm, isSubmitting } =
    useFormikContext<ScheduleMeetingFormInput>()

  return (
    <ClientModalFooter w="full" pt="0" pos="static" mt="8px">
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
    </ClientModalFooter>
  )
}

interface ScheduleMeetingScreenProps {
  reason?: string
  opportunity?: clientOpportunities
  relationshipManager: ClientRelationshipManager
  session: {
    email: string
  }
}

const getInitialTimeZone = () => {
  return "Arab Standard Time"
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

  const direction = lang === "ar" ? "rtl" : "ltr"

  const [editPhoneNumber, setEditPhoneNumber] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedDateValue, setSelectedDateValue] = useState("")
  const [schedule, setSchedule] = useState<MeetingSchedule>()
  const [availableDates, setAvailableDates] = useState<MeetingSchedule[]>()

  const [isLessThan830] = useMediaQuery("(max-width: 830px)")

  const { opportunity, reason } = props

  const rmToastID = "rmToastID"

  let callReasonOptions = [
    {
      label: t("callReason.options.opportunity"),
      value: "opportunity",
    },
    {
      label: t("callReason.options.TFO"),
      value: "TFO",
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
  useEffect(() => {
    fetchMeetingAvailableDates()
    const openTime = moment(new Date())

    return () => {
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        screenSpentTime,
        "Schedule Meeting",
        duration.asSeconds().toString(),
        user?.mandateId as string,
        user?.email as string,
      )
    }
  }, [])

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
    phoneNumber: yup.number().when("meetingType", {
      is: "phoneCall",
      then: yup
        .number()
        .typeError(t("phoneNumber.errors.inValid"))
        .required(t("common:errors.required")),
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

  async function fetchMeetingCalendar(
    values: ScheduleMeetingFormInput,
    setFieldError: (field: string, message: string | undefined) => void,
    setFieldTouched: (
      field: string,
      isTouched?: boolean,
      shouldValidate?: boolean,
    ) => void,
    slots?: MeetingSchedule[],
  ) {
    try {
      const slotsAvailable = slots ? slots : availableDates

      const selectedDate = slotsAvailable?.find((available) => {
        return (
          moment(available.date).format("DD/MM/YYYY") == values.availableDate
        )
      })
      if (!selectedDate?.hasFreeHour) {
        setFieldTouched("availableTimeSlot", true, false)
        setFieldError(
          "availableTimeSlot",
          t("availableTimeSlots.errors.unavailable"),
        )
      }
      setSelectedDateValue(moment(selectedDate?.date).format("YYYY-MM-DD"))
      setSchedule(selectedDate)
    } catch (e) {
      setSchedule(undefined)
      const meetingToastId = "meetingToastId"
      if (!toast.isActive(meetingToastId)) {
        toast({
          id: rmToastID,
          title: t("toast.calendar.error.title"),
          variant: "subtle",
          status: "error",
          isClosable: true,
          position: "bottom",
        })
      }
    }
  }

  async function fetchMeetingAvailableDates(timeZone?: string) {
    try {
      const startDate = format(new Date(), "yyyy-MM-dd")
      const endDate = format(add(new Date(), { months: 1 }), "yyyy-MM-dd")
      const reqBody = {
        contact: props?.relationshipManager?.manager?.email,
        startDate: startDate,
        endDate: endDate,
        timeZone: timeZone
          ? timeZone
          : timeZoneOptions.find(({ value }) => {
              return value == "Arab Standard Time"
            })?.value,
        availabilityViewInterval: "30",
      }
      setIsLoading(true)
      const avilDates = await ky
        .post("/api/client/meetings/calendar", {
          json: reqBody,
        })
        .json<AvailableSchedule>()
      setAvailableDates(avilDates?.schedules)
      setIsLoading(false)
      return avilDates?.schedules
    } catch (e) {
      setIsLoading(false)
      setAvailableDates([])
      setSchedule(undefined)
      const meetingToastId = "meetingToastId"
      if (!toast.isActive(meetingToastId)) {
        toast({
          id: rmToastID,
          title: t("toast.calendar.error.title"),
          variant: "subtle",
          status: "error",
          isClosable: true,
          position: "bottom",
        })
      }
    }
  }

  function fetchSubjects(subject: string) {
    return {
      TFO: "I want to know more about The Family Office",
      portfolio: "I want to discuss my simulated portfolio",
      proposal: "I want to discuss my suggested proposal",
      other: "Other",
      opportunity: "I want to discuss the offered opportunities",
    }[subject]
  }

  async function handleSubmit(values: ScheduleMeetingFormInput) {
    try {
      const startTime = `${selectedDateValue}T${values.availableTimeSlot}`

      const endTime = format(
        add(new Date(startTime), { minutes: 30 }),
        "yyyy-MM-dd'T'HH:mm:ss",
      )

      clientUniEvent(
        selectScheduleMeetingSlot,
        startTime,
        user?.mandateId as string,
        user?.email as string,
      )
      clientUniEvent(
        selectScheduleMeetingOption,
        values.meetingType,
        user?.mandateId as string,
        user?.email as string,
      )

      let subject = fetchSubjects(values.callReason as string)
      if (opportunity && opportunity.opportunityName) {
        subject += ` - ${opportunity.opportunityName}`
      }

      var params = {
        mandateId: user?.mandateId,
        contactEmail: props?.relationshipManager?.manager?.email,
        subject,
        content: "",
        startTime: startTime,
        endTime: endTime,
        timeZone: values.timeZone,
        location:
          values.meetingType == "phoneCall"
            ? `${values?.phoneCountryCode}${values?.phoneNumber}`
            : user?.email,
        isOnlineMeeting: values.meetingType != "phoneCall" ? true : false,
      }

      await ky
        .post("/api/client/meetings/schedule", {
          json: params,
        })
        .json()

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
    }
  }

  function getHeighlightedDates(key: boolean) {
    if (Array.isArray(availableDates)) {
      const availDates =
        availableDates &&
        availableDates.filter(
          (item: MeetingSchedule) => item.hasFreeHour === key,
        )

      return (
        availDates &&
        availDates.map((data: MeetingSchedule) => new Date(data.date))
      )
    }
  }

  return (
    <Formik
      initialValues={{
        timeZone: getInitialTimeZone(),
        availableDate: undefined,
        availableTimeSlot: undefined,
        callReason: reason,
        meetingType: "phoneCall",
        email: user?.email,
        phoneNumber: user?.profile?.phoneNumber,
        phoneCountryCode: user?.profile?.phoneCountryCode,
      }}
      enableReinitialize
      validationSchema={scheduleMeetingSchema}
      onSubmit={handleSubmit}
    >
      {(formikProps) => (
        <ClientModalLayout
          title={t("page.title")}
          description={t("page.description")}
          header={
            <ClientModalHeader
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
                      {t("rmAssigned.header.title")}
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
                    variant="link"
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
                relationshipManager={props?.relationshipManager}
                opportunityTitle={opportunity?.opportunityName}
              />
            )
          }
        >
          <Container
            maxW="5xl"
            py={{ base: 8, md: 24 }}
            px={{ base: 0, md: 0, lgp: 0 }}
            {...(isMobileView && { pt: 0 })}
            className="clientScheduleMeeting"
          >
            <chakra.div
              sx={{
                filter: isLoading ? "blur(3px)" : "none",
              }}
              cursor={isLoading ? "not-allowed" : "default"}
              transition="0.1s filter linear"
            >
              {showSuccess ? (
                renderSuccess()
              ) : (
                <Stack flexDirection={{ base: "column", md: "row" }}>
                  <VStack w={{ md: "lg" }} maxW="lg">
                    <Fragment>
                      <Heading mb="12">
                        {t("rmAssigned.header.subtitle")}
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
                              onChange: async (e: OptionTypeBase) => {
                                formikProps.setFieldValue("timeZone", e?.value)
                                formikProps.setFieldValue(
                                  "availableTimeSlot",
                                  undefined,
                                )
                                const slots = await fetchMeetingAvailableDates(
                                  e?.value,
                                )
                                await fetchMeetingCalendar(
                                  formikProps.values,
                                  formikProps.setFieldError,
                                  formikProps.setFieldTouched,
                                  slots,
                                )
                              },
                            }}
                          />
                          <Datepicker
                            name="availableDate"
                            label={t("availableDate.label")}
                            placeholder={t("availableDate.placeholder")}
                            highlightWithRanges={getHeighlightedDates(true)}
                            excludedDates={getHeighlightedDates(false)}
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
                                format(new Date(date), "dd/MM/yyyy"),
                              )
                              setSelectedDateValue(
                                moment(date).format("YYYY-MM-DD"),
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
                              if (
                                (formikProps.touched.timeZone ||
                                  formikProps.values.timeZone) &&
                                !formikProps.errors.timeZone &&
                                date
                              ) {
                                fetchMeetingCalendar(
                                  {
                                    ...formikProps.values,
                                    availableDate: format(
                                      new Date(date),
                                      "dd/MM/yyyy",
                                    ),
                                  },
                                  formikProps.setFieldError,
                                  formikProps.setFieldTouched,
                                )
                              }
                            }}
                            onDateBlur={() => {
                              formikProps.setFieldTouched(
                                "availableDate",
                                true,
                                true,
                              )
                              if (
                                formikProps.touched.timeZone &&
                                !formikProps.errors.timeZone &&
                                !formikProps.errors.availableDate
                              ) {
                                fetchMeetingCalendar(
                                  formikProps.values,
                                  formikProps.setFieldError,
                                  formikProps.setFieldTouched,
                                )
                              }
                            }}
                            disabled={!formikProps.values.timeZone}
                            isValid={
                              !!formikProps.errors.availableDate &&
                              formikProps.touched.availableDate
                            }
                          />
                          {formikProps.values.availableDate && (
                            <FormControl
                              isInvalid={!!formikProps.errors.availableTimeSlot}
                            >
                              <FormLabel>
                                {t("availableTimeSlots.label")}
                              </FormLabel>
                              {schedule?.hours.length ? (
                                <AvailableTimeSlots
                                  name="availableTimeSlot"
                                  availableSlots={schedule?.hours || []}
                                  handleClick={(timeSlotText: string) => {
                                    formikProps.setFieldTouched(
                                      "availableTimeSlot",
                                      true,
                                      true,
                                    )
                                    formikProps.setFieldValue(
                                      "availableTimeSlot",
                                      timeSlotText,
                                    )
                                  }}
                                />
                              ) : (
                                <FormErrorMessage>
                                  <Text>{t("noTimeSlots")}</Text>
                                </FormErrorMessage>
                              )}

                              <FormErrorMessage>
                                {formikProps.errors.availableTimeSlot}
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
                              isSearchable: false,
                            }}
                          />

                          {formikProps.values.meetingType === "phoneCall" &&
                            (editPhoneNumber ? (
                              <FormControl
                                className={styles.phoneCountryCodeComp}
                              >
                                <FormLabel
                                  color="gray.400"
                                  display="flex"
                                  alignItems="center"
                                  pb="0"
                                  mb="0"
                                >
                                  {t("labels.phoneNumber")}
                                </FormLabel>
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
                                  />
                                  <InputControl
                                    name="phoneNumber"
                                    inputProps={{
                                      type: "tel",
                                    }}
                                    pt="2"
                                  />
                                </Stack>
                              </FormControl>
                            ) : (
                              <InputControl
                                name="phoneNumber"
                                label={t("labels.phoneNumber")}
                                inputProps={{
                                  type: "tel",
                                  variant: "flushed",
                                  disabled: true,
                                  value: formikProps.values.phoneNumber,
                                  _disabled: {
                                    cursor: "not-allowed",
                                    color: "gray.600",
                                  },
                                }}
                                inputRightElement={
                                  <Button
                                    variant="link"
                                    colorScheme="primary"
                                    onClick={() => setEditPhoneNumber(true)}
                                  >
                                    {t("button.edit")}
                                  </Button>
                                }
                              />
                            ))}

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
                            className={styles.callReasonSelectComp}
                            name="callReason"
                            label={t("callReason.label")}
                            selectProps={{
                              placeholder: t("common:select.placeholder"),
                              options: callReasonOptions,
                              isFullWidth: true,
                              isDisabled: !!reason,
                              isSearchable: false,
                            }}
                          />

                          {opportunity && (
                            <FormControl>
                              <FormLabel>{t("labels.attachedDeal")}</FormLabel>
                              <Card>
                                <CardContent>
                                  <HStack mb="2">
                                    <Heading size="sm">
                                      {opportunity.opportunityName}
                                    </Heading>
                                    {opportunity.isShariah && (
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
                        </VStack>
                      </Form>
                    </Fragment>
                  </VStack>
                  <Spacer minW={isLessThan830 ? "12" : "20"} />
                  {isDesktopView && (
                    <VStack spacing="8">
                      <SummaryCard
                        relationshipManager={props.relationshipManager}
                        opportunityTitle={opportunity?.opportunityName}
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
        </ClientModalLayout>
      )}
    </Formik>
  )
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    try {
      const session = getSession(ctx.req, ctx.res)
      if (session?.mandateId) {
        const client = new MyTfoClient(ctx.req, ctx.res, {
          authRequired: true,
          msType: "maverick",
        })
        const id = ctx.query?.opportunityId as string
        const relationshipManager = await client.clientAccount.profile()

        if (id) {
          const response: clientOpportunitiesArray =
            await client.clientDeals.getClientOpportunities(session?.mandateId)
          const opportunity = await getOpportunitybyId(
            response,
            Number(id),
            ctx.locale as string,
          )
          return {
            props: {
              opportunity,
              reason: "opportunity",
              relationshipManager,
              session: session?.user,
            },
          }
        }

        return {
          props: {
            relationshipManager,
            session: session?.user,
          },
        }
      } else {
        return {
          notFound: true,
        }
      }
    } catch (error) {
      return {
        props: {
          reason: "opportunity",
        },
      }
    }
  },
})

export default ScheduleMeetingScreen
