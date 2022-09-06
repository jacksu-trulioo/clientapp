import { getSession } from "@auth0/nextjs-auth0"
import {
  Box,
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/layout"
import { Button, useToast } from "@chakra-ui/react"
import ky from "ky"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import Trans from "next-translate/Trans"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import {
  BackgroundImageContainer,
  LanguageSwitch,
  Link,
  Logo,
  MailIcon,
  Seo,
} from "~/components"
import { User } from "~/services/mytfo/types"
import { twitterEvent } from "~/utils/gtag"

const resendInterval = 10000

interface VerifyEmailScreenProps {
  user: User
}

function VerifyEmailScreen(props: VerifyEmailScreenProps) {
  const { user } = props
  const { t, lang } = useTranslation("auth")
  const toast = useToast()
  const router = useRouter()
  const [isSending, setIsSending] = React.useState(false)
  const [isResendEnabled, setIsResendEnabled] = React.useState(true)

  let timerId: ReturnType<typeof setTimeout>

  const setResendTimeout = () => {
    timerId = setTimeout(() => setIsResendEnabled(false), resendInterval)
  }

  const { data: userdata } = useSWR("/api/user", { refreshInterval: 3000 })
  const destination = lang === "ar" ? "/ar" : ""

  const handleResendVerification = async () => {
    try {
      setIsResendEnabled(true)

      setResendTimeout()

      setIsSending(true)
      await ky.post("/api/auth/send-verification-email")

      toast({
        title: t("verify.toast.success.title"),
        description: t("verify.toast.success.description"),
        status: "success",
        isClosable: true,
        variant: "subtle",
        position: "top",
      })
    } catch (error) {
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

  // Prevent "resend" action from being triggered until after 10 seconds has passed on page load.
  React.useEffect(() => {
    setResendTimeout()
    if (!userdata?.profile && userdata?.emailVerified) {
      router.replace(`${destination}/onboarding/profile`)
    }
    return () => clearTimeout(timerId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    twitterEvent("verify")
  }, [])

  return (
    <>
      <Seo
        title={t("verify.page.title")}
        description={t("verify.page.description")}
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
              <VStack spacing="8" textAlign="center">
                <Box bgColor="gray.800" rounded="full" p="4">
                  <MailIcon color="primary.500" w="62px" h="62px" />
                </Box>

                <Heading size="xl">{t("verify.heading")}</Heading>

                <Trans
                  i18nKey="auth:verify.description"
                  components={[
                    <Text
                      key="0"
                      maxW="md"
                      color="gray.500"
                      fontSize={["sm", "lg"]}
                    />,
                    <Text key="1" color="white" fontWeight="bold"></Text>,
                  ]}
                  values={{
                    email: user?.email,
                  }}
                />

                <Stack
                  direction={["column", "row"]}
                  fontSize={["xs", "sm"]}
                  alignItems="center"
                >
                  <Text maxW={["xs", "2xl"]} color="gray.500">
                    {t("verify.text.noEmailReceived")}
                  </Text>
                  <Button
                    variant="link"
                    colorScheme="primary"
                    size="sm"
                    onClick={handleResendVerification}
                    loadingText={t("verify.link.resend")}
                    isLoading={isSending}
                    spinnerPlacement="end"
                    disabled={isResendEnabled}
                  >
                    {t("verify.link.resend")}
                  </Button>
                </Stack>
              </VStack>
            </Center>
          </Container>

          <Container>
            <Divider />
            <Center h="full" py="14">
              <Stack direction={["column", "row"]} fontSize="sm">
                <Text maxW="2xl" color="gray.500">
                  {t("verify.text.alreadyVerified")}
                </Text>
                <Center>
                  <Button
                    as={Link}
                    href="/login"
                    variant="link"
                    colorScheme="primary"
                    size="sm"
                  >
                    {t("verify.link.login")}
                  </Button>
                </Center>
              </Stack>
            </Center>
          </Container>
        </Flex>
      </BackgroundImageContainer>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = getSession(ctx.req, ctx.res)
  let destination = ctx.locale === "ar" ? "/ar" : ""

  if (session) {
    const { user } = session
    // Redirect users if they have verified their email.
    if (user.email_verified) {
      return {
        redirect: {
          destination: destination + "/",
          permanent: false,
        },
      }
    }

    return {
      props: {
        user,
      },
    }
  } else {
    return {
      redirect: {
        destination: destination + "/login",
        permanent: false,
      },
    }
  }
}

export default VerifyEmailScreen
