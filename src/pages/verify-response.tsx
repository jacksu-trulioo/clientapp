import { getSession } from "@auth0/nextjs-auth0"
import {
  Box,
  Center,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/layout"
import { Button, Spinner, useBreakpointValue, useToast } from "@chakra-ui/react"
import { GetServerSideProps } from "next"
import router, { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect } from "react"

import {
  BackgroundImageContainer,
  CheckCircleIcon,
  LanguageSwitch,
  Logo,
  RemoveCircleIcon,
  Seo,
} from "~/components"
import encryptBodyRequest from "~/utils/encryption"
import { SignUpEmailVerifiedEvent } from "~/utils/googleEvents"
import { event, twitterEvent } from "~/utils/gtag"

function VerifyEmailResponseScreen() {
  const { t, lang: language } = useTranslation("auth")
  const { query } = useRouter()
  const [isSending, setIsSending] = React.useState(false)
  const [data, setData] = React.useState({ success: undefined })
  const [error, setError] = React.useState(false)
  const toast = useToast()
  const lang = query?.lang
  const [success, setSuccess] = React.useState(false)
  const isMobileView = useBreakpointValue({ base: true, md: false })

  React.useEffect(() => {
    if (lang === "ar" && language === "en") {
      router.replace(
        `/ar/verify-response?email=${query?.email}&ttl=${query?.ttl}&data=${query?.data}&lang=${lang}`,
      )
    }
  }, [])

  const handleVerify = async () => {
    try {
      const params = { email: query?.email, data: query?.data, ttl: query?.ttl }
      const res = await encryptBodyRequest(
        params,
        "/api/auth/verify-email",
        language,
      )
      const data = await res.json()
      setSuccess(true)
      setData(data)
    } catch (e) {
      setError(true)
    } finally {
      router.replace(`/verify-response?email=${query?.email}`)
    }
  }

  React.useEffect(() => {
    twitterEvent("verify-success")
    handleVerify()
  }, [])

  useEffect(() => {
    if (data && data.success && success) {
      event(SignUpEmailVerifiedEvent)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, success])

  const isLoading = !data && !error

  if (error || isLoading) {
    return null
  }

  const handleResendVerificationEmail = async () => {
    try {
      setIsSending(true)
      await encryptBodyRequest(
        query?.email,
        "/api/auth/verification-email",
        language,
      )

      toast({
        title: t("verify.toast.success.title"),
        description: t("verify.toast.success.description"),
        status: "success",
        isClosable: true,
        variant: "subtle",
        position: "top",
      })
      await router.push("/login")
    } catch (err) {
      const toastId = "error"

      if (!toast.isActive(toastId)) {
        toast({
          title: t("verify.toast.error.title"),
          description: t("verify.toast.error.description"),
          status: "error",
          isClosable: true,
          variant: "subtle",
          position: "top",
          id: toastId,
        })
      }
    } finally {
      setIsSending(false)
    }
  }

  function showLinkSuccess() {
    return (
      <VStack spacing="8" textAlign="center">
        <Box bgColor="gray.800" rounded="full" p="4">
          <CheckCircleIcon color="primary.500" w="62px" h="62px" />
        </Box>

        <Heading size="xl">{t("verifyResponse.text.success.heading")}</Heading>

        <Text key="0" maxW="md" color="gray.500" fontSize={["sm", "lg"]}>
          {t("verifyResponse.text.success.subheading")}
        </Text>

        <Button
          onClick={() => {
            window.location.replace(
              language === "ar"
                ? "/ar/onboarding/profile"
                : "/onboarding/profile",
            )
          }}
          colorScheme="primary"
        >
          {t("common:button.continue")}
        </Button>
      </VStack>
    )
  }

  function showLinkError() {
    return (
      <VStack spacing="8" textAlign="center">
        <Box bgColor="gray.800" rounded="full" p="4">
          <RemoveCircleIcon color="primary.500" w="62px" h="62px" />
        </Box>

        <Heading size="xl">{t("verifyResponse.text.error.heading")}</Heading>

        <Text key="0" maxW="md" color="gray.500" fontSize={["sm", "lg"]}>
          {t("verifyResponse.text.error.subheading")}
        </Text>

        <Button
          colorScheme="primary"
          onClick={handleResendVerificationEmail}
          isLoading={isSending}
        >
          {t("verifyResponse.button.resend")}
        </Button>
      </VStack>
    )
  }

  function loading() {
    return (
      <Spinner
        aria-label="spinner"
        thickness="8px"
        speed="0.65s"
        emptyColor="gray.700"
        color="primary.500"
        size="xl"
        zIndex="tooltip"
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        {...(isMobileView && { marginLeft: "-40px" })}
        height="80px"
        width="80px"
      />
    )
  }

  function showWhenDataIsReady() {
    return data?.success === true ? showLinkSuccess() : showLinkError()
  }

  return (
    <>
      <Seo
        title={t("verifyResponse.page.title")}
        description={t("verifyResponse.page.description")}
      />

      <BackgroundImageContainer as="main">
        <Logo
          pos="absolute"
          top={["24px", "48px"]}
          insetStart={["24px", "48px"]}
          height={["30px", "55px"]}
        />

        <LanguageSwitch
          pos="absolute"
          insetEnd={["24px", "48px"]}
          top={["24px", "48px"]}
        />

        <Flex direction="column" h="100vh">
          <Container flex="1">
            <Center h="full">
              {data?.success !== undefined ? showWhenDataIsReady() : loading()}
            </Center>
          </Container>
        </Flex>
      </BackgroundImageContainer>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = getSession(ctx.req, ctx.res)

  if (session) {
    const { user } = session

    // Redirect users if they have verified their email.
    if (user.email_verified) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      }
    }

    return {
      props: {
        user,
      },
    }
  }

  return {
    props: {},
  }
}

export default VerifyEmailResponseScreen
