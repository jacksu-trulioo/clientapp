import { Box, Circle, Container, Heading, Text } from "@chakra-ui/layout"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect } from "react"
import useSWR from "swr"

import { ModalHeader, ModalLayout, WarningIcon } from "~/components"
import siteConfig from "~/config"
import { MyTfoClient } from "~/services/mytfo"
import { deleteAllCookies } from "~/utils/deleteAllCookies"

function KycSessionStopped() {
  const { t } = useTranslation("kyc")
  const { locale } = useRouter()
  useSWR(`/api/auth/logout?lang=${locale}`)

  useEffect(() => {
    localStorage.clear()
    sessionStorage.clear()
    deleteAllCookies()
  }, [])

  return (
    <ModalLayout
      title={t("sessionStopped.page.title")}
      description={t("sessionStopped.page.description")}
      header={<ModalHeader />}
    >
      <Container
        maxW={["container.xl", "container.sm"]}
        height="full"
        centerContent
        justifyContent="center"
        px={2}
      >
        <Box>
          <Circle size="96px" bg="gray.800" mb="60px">
            <WarningIcon w="62" h="62" color="primary.500" />
          </Circle>
        </Box>
        <Heading fontSize={["2xl", "3xl", "4xl"]}>
          {t("sessionStopped.heading")}
        </Heading>
        <Box align="center" fontSize="sm" fontWeight={400} my={4} mx={[0, 6]}>
          <Text my={2}>{t("sessionStopped.description")}</Text>
        </Box>
      </Container>
    </ModalLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { res, req } = ctx
    const { kycEnabled } = siteConfig?.featureFlags
    const client = new MyTfoClient(req, res)

    if (!kycEnabled) {
      res.writeHead(302, { Location: "/" })
      res.end()
    }

    const response = await client.user.getProposalsStatus()
    if (response.status != "Accepted") {
      return {
        notFound: true,
      }
    }

    if (ctx.locale === "ar") {
      res.writeHead(302, { Location: "/kyc" })
      res.end()
    }

    return {
      props: {},
    }
  } catch (error) {
    return {
      props: {},
    }
  }
}

export default React.memo(KycSessionStopped)
