import { Center, Container, Flex, SimpleGrid, Text } from "@chakra-ui/layout"
import {
  Button,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  useBreakpointValue,
  useToast,
  useToken,
} from "@chakra-ui/react"
import { add, addDays, format, isValid, parse } from "date-fns"
import { Form, Formik, useField } from "formik"
import ky from "ky"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { useCallback, useEffect, useState } from "react"
import { OptionTypeBase } from "react-select"
import useSWR from "swr"
import * as yup from "yup"

import siteConfig from "~/config"
import { useTimeZoneList } from "~/hooks/useList"
import { useUser } from "~/hooks/useUser"
import {
  MeetingCalendar,
  MeetingSlot,
  Preference,
  ScheduleVideoCallFormInput,
} from "~/services/mytfo/types"
import availableTimeSlots from "~/utils/data/availableTimeSlots"
import { OnboardingJourneyComplete } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"

import { SelectControl } from ".."
import Datepicker from "../DatePicker/DatePicker"

interface AvailableTimeSlotsProps {
  name: string
  availableSlots: MeetingSlot[]
}

const videoCallToastID = "videoCallToastID"
const { kycCustomerServiceEmailKSA, kycCustomerServiceEmailOther } = siteConfig

function parseDateString(_value: string, originalValue: string) {
  return isValid(originalValue)
    ? originalValue
    : parse(
        originalValue.split("/").reverse().join("-"),
        "yyyy-MM-dd",
        new Date(),
      )
}

function AvailableTimeSlots(props: AvailableTimeSlotsProps) {
  const [, meta, helpers] = useField(props.name)

  const { value } = meta
  const { setValue } = helpers

  return (
    <SimpleGrid columns={{ base: 2, md: 2 }} spacing={2} width="full">
      {props.availableSlots.map((timeSlot) => {
        const timeSlotText = timeSlot.time.slice(0, 5)
        const displayTimeSlot = `${timeSlot.from} - ${timeSlot.to}`
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
            <Text>{displayTimeSlot}</Text>
          </Center>
        )
      })}
    </SimpleGrid>
  )
}

const getInitialTimeZone = (userCountryOfResidence: string) => {
  if (["AE", "OM"].indexOf(userCountryOfResidence) >= 0) {
    return "Gulf Standard Time"
  }

  if (["SA", "QA", "KW", "BH"].indexOf(userCountryOfResidence) >= 0) {
    return "Arab Standard Time"
  }
  return undefined
}

interface KycScheduleVideoCallProps {
  setShowLoader: (isLoading: boolean) => void
}

const KycScheduleVideoCall = React.forwardRef<
  HTMLButtonElement,
  KycScheduleVideoCallProps
>(function KycScheduleVideoCall(props, ref) {
  const { setShowLoader } = props
  const timeZoneOptions = useTimeZoneList()
  const { t } = useTranslation("kyc")
  const { data: preferredLanguage } = useSWR<Preference>("/api/user/preference")
  const toast = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [videoCallScheduled, setVideoCallScheduled] = useState(false)
  const [schedule, setSchedule] = useState<MeetingSlot[]>()
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const { user } = useUser()
  const [contrast200, primary500] = useToken("colors", [
    "contrast.200",
    "primary.500",
  ])

  const kycCustomerServiceEmail =
    user?.profile.nationality === "SA"
      ? kycCustomerServiceEmailKSA
      : kycCustomerServiceEmailOther

  const getBusinessDaysBetweenDates = {
    workDaysAdded: 0,
    currentDate: new Date(),
    addWorkDay: function () {
      this.currentDate.setDate(this.currentDate.getDate() + 1)
      if (this.currentDate.getDay() !== 5 && this.currentDate.getDay() !== 6) {
        this.workDaysAdded++
      }
    },
    getNewWorkDay: function (daysToAdd: number) {
      this.workDaysAdded = 0
      while (this.workDaysAdded < daysToAdd) {
        this.addWorkDay()
      }
      return this.currentDate
    },
  }

  const maxDate = getBusinessDaysBetweenDates.getNewWorkDay(7)

  const scheduleVideoCallSchema = yup.object().shape({
    timeZone: yup.string().required(t("common:errors.required")),
    availableDate: yup
      .date()
      .transform(parseDateString)
      .typeError(
        t("idVerification.scheduleVideoCall.availableDate.errors.valid"),
      )
      .min(
        new Date(new Date().setHours(0, 0, 0, 0)),
        t("idVerification.scheduleVideoCall.availableDate.errors.past"),
      )
      .required(t("common:errors.required")),
    availableTimeSlot: yup.string().required(t("common:errors.required")),
  })

  useEffect(() => {
    if (videoCallScheduled) {
      router.push({ pathname: "/kyc/complete", query: router.query })
    }
  }, [videoCallScheduled, router])

  async function handleSubmit(values: ScheduleVideoCallFormInput) {
    try {
      setShowLoader(true)

      const startTime = `${values.availableDate}T${values.availableTimeSlot}`

      const endTime = format(
        add(new Date(startTime), { hours: 1 }),
        "yyyy-MM-dd'T'HH:mm:ss",
      )

      const lang = (preferredLanguage?.language || "").toLocaleLowerCase()

      await ky
        .post("/api/portfolio/meetings/schedule", {
          json: {
            contactEmail: kycCustomerServiceEmail,
            content: "",
            startTime,
            endTime,
            timeZone: values.timeZone,
            location: values.email,
            isOnlineMeeting: true,
            meetingType: "KycVideoMeeting",
          },
          headers: {
            "Accept-Language": lang,
          },
        })
        .json()
      setVideoCallScheduled(true)
      setShowLoader(false)
      event(OnboardingJourneyComplete)
    } catch (e) {
      setShowLoader(false)
      const meetingToastID = "meetingToastID"
      if (!toast.isActive(meetingToastID)) {
        toast({
          id: meetingToastID,
          title: t(
            "idVerification.scheduleVideoCall.toast.scheduleMeeting.error.title",
          ),
          variant: "subtle",
          status: "error",
          isClosable: true,
          position: "bottom",
        })
      }
    }
  }

  async function fetchMeetingCalendar(
    values: ScheduleVideoCallFormInput,
    setFieldError: (field: string, message: string | undefined) => void,
    setFieldTouched: (
      field: string,
      isTouched?: boolean,
      shouldValidate?: boolean,
    ) => void,
  ) {
    try {
      const startDate = values?.availableDate
        ? values.availableDate.split("/").reverse().join("-")
        : new Date()
      const endDate = format(
        add(new Date(startDate), { days: 1 }),
        "yyyy-MM-dd",
      )
      const reqBody = {
        contact: kycCustomerServiceEmail,
        startDate: format(new Date(startDate), "yyyy-MM-dd"),
        endDate,
        timeZone: values.timeZone,
        availabilityViewInterval: 60,
      }
      setIsLoading(true)
      const meetingCalendar = await ky
        .post("/api/portfolio/meetings/calendar", {
          json: reqBody,
        })
        .json<MeetingCalendar>()
      const compareAvailability = meetingCalendar?.schedules[0].hours.filter(
        (o1) => availableTimeSlots.some((o2) => o1.time === o2.time),
      )

      const availableTimes = availableTimeSlots.map((item) => {
        const isValidSlot = compareAvailability.find((o2) => {
          return item?.time === o2?.time
        })
        const available = isValidSlot?.available || false
        return { ...item, available }
      })

      setSchedule(availableTimes as MeetingSlot[])
      setIsLoading(false)
      if (!meetingCalendar.schedules[0].hasFreeHour) {
        setFieldTouched("availableTimeSlot", true, false)
        setFieldError(
          "availableTimeSlot",
          t(
            "idVerification.scheduleVideoCall.select.availableTimeSlots.errors.unavailable",
          ),
        )
      }
    } catch (e) {
      setIsLoading(false)
      const meetingToastId = "meetingToastId"
      if (!toast.isActive(meetingToastId)) {
        toast({
          id: videoCallToastID,
          title: t(
            "idVerification.scheduleVideoCall.toast.calendar.error.title",
          ),
          variant: "subtle",
          status: "error",
          isClosable: true,
          position: "bottom",
        })
      }
    }
  }

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

  const isCustomWeekday = (date: Date) => {
    const day = date.getDay()
    return day !== 6 && day !== 5
  }

  return (
    <Formik
      initialValues={{
        timeZone: getInitialTimeZone(user?.profile?.countryOfResidence!),
        availableDate: undefined,
        availableTimeSlot: undefined,
        email: user?.email,
        phoneNumber: user?.profile.phoneNumber || "",
        phoneCountryCode: user?.profile.phoneCountryCode || "",
      }}
      onSubmit={handleSubmit}
      {...(isMobileView && {
        mb: "24",
      })}
      enableReinitialize
      validationSchema={scheduleVideoCallSchema}
    >
      {(formikProps) => (
        <Container flex="1" px="0">
          <Form style={{ width: "100%" }}>
            <chakra.div
              transition="0.1s filter linear"
              sx={{
                filter: isLoading ? "blur(3px)" : "none",
              }}
            >
              <Flex
                direction="column"
                alignItems="baseline"
                gridRowGap={["6", "8"]}
              >
                <SelectControl
                  name="timeZone"
                  label={t(
                    "idVerification.scheduleVideoCall.select.timeZone.label",
                  )}
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
                    },
                  }}
                />
                <Datepicker
                  name="availableDate"
                  label={t("common:datepicker.label")}
                  placeholder={t("common:datepicker.placeholder")}
                  filterDate={isCustomWeekday}
                  highlightWithRanges={getHighlightedDates()}
                  minDate={addDays(new Date(), 1)}
                  maxDate={maxDate}
                  footerDetails={[
                    {
                      title: t("common:datepicker.legends.today"),
                      color: contrast200,
                      isCircle: true,
                    },
                    {
                      title: t("common:datepicker.legends.available-times"),
                      color: primary500,
                      isCircle: true,
                    },
                    {
                      title: t("common:datepicker.legends.selected"),
                      color: primary500,
                      isCircle: false,
                    },
                  ]}
                  onDateChange={async (date: Date) => {
                    await formikProps.setFieldValue(
                      "availableDate",
                      format(new Date(date), "yyyy-MM-dd"),
                    )
                    formikProps.setFieldValue("availableTimeSlot", undefined)

                    formikProps.setFieldTouched("availableDate", true, true)
                    if (
                      (formikProps.touched.timeZone ||
                        formikProps.values.timeZone) &&
                      !formikProps.errors.timeZone &&
                      date
                    ) {
                      fetchMeetingCalendar(
                        {
                          ...formikProps.values,
                          availableDate: format(new Date(date), "yyyy-MM-dd"),
                        },
                        formikProps.setFieldError,
                        formikProps.setFieldTouched,
                      )
                    }
                  }}
                  onDateFocus={() => setSchedule(undefined)}
                  onDateBlur={() => {
                    formikProps.setFieldTouched("availableDate", true, true)
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
                />
                {formikProps.touched.availableDate &&
                  !formikProps.errors.availableDate && (
                    <FormControl
                      isInvalid={!!formikProps.errors.availableTimeSlot}
                    >
                      <FormLabel>
                        {t(
                          "idVerification.scheduleVideoCall.select.availableTimeSlots.label",
                        )}
                      </FormLabel>
                      <AvailableTimeSlots
                        name="availableTimeSlot"
                        availableSlots={schedule || []}
                      />
                      <FormErrorMessage>
                        {formikProps.touched.availableTimeSlot &&
                          formikProps.errors.availableTimeSlot}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                <Button
                  type="submit"
                  ref={ref}
                  id="videoMeetingSubmitBtn"
                  visibility="hidden"
                  isLoading={formikProps.isSubmitting}
                />
              </Flex>
            </chakra.div>
          </Form>
        </Container>
      )}
    </Formik>
  )
})

export default React.memo(KycScheduleVideoCall)
