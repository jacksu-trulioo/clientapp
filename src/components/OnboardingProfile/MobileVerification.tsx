import { HStack } from "@chakra-ui/layout"
import {
  Button,
  FormControl,
  FormErrorMessage,
  PinInput,
  PinInputField,
  Text,
  useToast,
} from "@chakra-ui/react"
import ky, { HTTPError } from "ky"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import { mutate } from "swr"

import { useUser } from "~/hooks/useUser"
import { ErrorJsonResponse } from "~/services/mytfo/types"
import { otpSentSuccessfully } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"

import InvestorProfileFormActions from "../InvestorProfile/InvestorProfileFormActions"
import { useInvestorProfileFormContext } from "../InvestorProfile/InvestorProfileFormContext"
import { useOnboardingProfileWizard } from "./OnboardingProfileContext"

interface MobileVerificationProps {
  isOldUser?: boolean
  scheduleSubmit?: () => {}
  scheduleCallOnSubmit?: boolean
  isInvestorSection?: boolean
  showOtpScreen?: () => void
  updatedPhoneNumber?: string
}

const MobileVerification = (props: MobileVerificationProps) => {
  const {
    showOtpScreen,
    updatedPhoneNumber,
    isOldUser = false,
    scheduleSubmit = () => {},
    scheduleCallOnSubmit = false,
    isInvestorSection = false,
  } = props
  const { ref } = useInvestorProfileFormContext()
  const { user } = useUser()
  const router = useRouter()
  const { t } = useTranslation("profile")
  const toast = useToast()
  const [otp, setOtp] = React.useState<string>()
  const [secondsRemaining, setSecondsRemaining] = React.useState<number>(180)
  const intervalId = React.useRef<NodeJS.Timeout>()
  const [otpError, setOtpError] = React.useState<string>()
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)
  const [isResendSubmitting, setIsResendSubmitting] =
    React.useState<boolean>(false)
  const { back } = useOnboardingProfileWizard()
  const handleOtpSubmit = async () => {
    try {
      if (!otp || otp.length < 6) {
        setOtpError(t("onboarding.error.invalidOTP"))
        setOtp("")
        return
      }
      setIsSubmitting(true)
      await ky.post("/api/auth/verify-otp", {
        json: {
          phoneNumber: updatedPhoneNumber
            ? updatedPhoneNumber
            : `${user?.profile.phoneCountryCode}${user?.profile.phoneNumber}`,
          otp,
        },
      })
      await mutate("/api/user")
      setIsSubmitting(false)
      showOtpScreen
      // Show toast.
      toast({
        title: isOldUser
          ? t("onboarding.toast.otpVerifiedSuccess.title")
          : t("onboarding.toast.success.title"),
        variant: "subtle",
        status: "success",
        isClosable: true,
        position: "bottom",
      })
      if (isInvestorSection) {
        router.push("#amount")
        return
      }
      if (!user?.isFirstTimeLogin) {
        event(otpSentSuccessfully)
      }

      if (scheduleCallOnSubmit) {
        scheduleSubmit()
      } else {
        isOldUser ? await router.push("/profile") : await router.push("/")
      }
    } catch (e) {
      if ((e as HTTPError).name === "HTTPError") {
        const res: ErrorJsonResponse = await (e as HTTPError).response.json()
        if (
          res?.message?.includes("Rate limits exceeded") ||
          res?.message?.includes("maximum number of attempts")
        ) {
          setOtpError(t("onboarding.error.maximumAttempt"))
        } else if (
          res?.message?.includes("Wrong phone number or verification code")
        ) {
          setOtpError(t("onboarding.error.invalidOTP"))
        } else if (res?.message?.includes("Invalid Number")) {
          setOtpError(t("onboarding.error.alreadyRegistered"))
        } else {
          toast({
            title: t("onboarding.error.generic"),
            variant: "subtle",
            status: "error",
            isClosable: true,
            position: "bottom",
          })
        }
      }
      setOtp("")
      setIsSubmitting(false)
    }
  }

  const handleResendOtp = async () => {
    setIsResendSubmitting(true)
    setOtp("")
    if (intervalId.current) {
      clearInterval(intervalId?.current)
    }
    await ky.post("/api/auth/send-otp", {
      json: {
        phoneNumber: updatedPhoneNumber
          ? updatedPhoneNumber
          : `${user?.profile.phoneCountryCode}${user?.profile.phoneNumber}`,
      },
    })
    setIsResendSubmitting(false)
    setOtpError(undefined)
    setSecondsRemaining(180)
    intervalId.current = setInterval(() => {
      setSecondsRemaining((prevCount) => prevCount - 1)
    }, 1000)
  }

  React.useEffect(
    () => {
      setSecondsRemaining(180)
      intervalId.current = setInterval(() => {
        setSecondsRemaining((prevCount) => prevCount - 1)
      }, 1000)
      return () => {
        clearInterval(intervalId.current as NodeJS.Timeout)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  React.useEffect(() => {
    if (secondsRemaining === 0) {
      clearInterval(intervalId.current as NodeJS.Timeout)
      setOtpError(t("onboarding.error.expiredOTP"))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsRemaining])
  return (
    <>
      <FormControl
        {...(!isInvestorSection && { maxW: "xs" })}
        isInvalid={!!otpError}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleOtpSubmit()
          }
        }}
        onSubmit={handleOtpSubmit}
      >
        <Text
          fontSize="sm"
          mb="2"
          mt="4"
          {...(isOldUser && !isInvestorSection && { textAlign: "center" })}
        >
          {t("onboarding.text.verificationCode")}
        </Text>
        <HStack mb="4" dir="ltr">
          <PinInput
            placeholder="-"
            size="lg"
            id="otp"
            colorScheme="primary"
            otp={true}
            value={otp}
            isDisabled={otpError === t("onboarding.error.expiredOTP")}
            onChange={(e) => {
              if (otpError) {
                setOtpError(undefined)
              }
              setOtp(e)
            }}
            isInvalid={!!otpError}
          >
            <PinInputField isInvalid={!!otpError} />
            <PinInputField isInvalid={!!otpError} />
            <PinInputField isInvalid={!!otpError} />
            <PinInputField isInvalid={!!otpError} />
            <PinInputField isInvalid={!!otpError} />
            <PinInputField isInvalid={!!otpError} />
          </PinInput>
        </HStack>
        {otpError && (
          <FormErrorMessage
            {...(!isInvestorSection && { justifyContent: "center" })}
          >
            {otpError}
          </FormErrorMessage>
        )}

        {otpError !== t("onboarding.error.expiredOTP") && (
          <Text fontSize="sm" color="gray.400" mt={6}>
            {t("onboarding.text.codeWillExpire", {
              sec: secondsRemaining,
            })}
          </Text>
        )}
        <Text fontSize="sm" my={6}>
          {t("onboarding.text.verificationCodeNotReceived")}{" "}
          <Button
            variant="link"
            colorScheme="primary"
            fontSize="sm"
            isDisabled={otpError !== t("onboarding.error.expiredOTP")}
            isLoading={isResendSubmitting}
            onClick={handleResendOtp}
          >
            {t("onboarding.button.resendSMS")}
          </Button>
        </Text>
        {!isInvestorSection && (
          <Button
            isFullWidth
            colorScheme="primary"
            variant="solid"
            isDisabled={!!otpError}
            isLoading={isSubmitting}
            onClick={handleOtpSubmit}
            mb="4"
          >
            {isOldUser
              ? t("onboarding.button.submit")
              : t("onboarding.button.verify")}
          </Button>
        )}
        {!isOldUser && (
          <Button
            isFullWidth
            colorScheme="primary"
            variant="outline"
            onClick={back}
          >
            {t("onboarding.button.back")}
          </Button>
        )}
      </FormControl>
      {isInvestorSection && (
        //@ts-ignore
        <InvestorProfileFormActions ref={ref} submitForm={handleOtpSubmit} />
      )}
    </>
  )
}

export default MobileVerification
