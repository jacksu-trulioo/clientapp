import { StyleProps } from "@chakra-ui/react"
import { GetServerSideProps } from "next"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { Step, StepContent, StepLabel, Stepper } from "~/components"
import DocumentVerification from "~/components/KycIdVerification/DocumentVerification"
import siteConfig from "~/config"
import { MyTfoClient } from "~/services/mytfo"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

function DocumentStatusVerification() {
  const { t } = useTranslation("kyc")

  const ChapterHeaderStepper = (props?: StyleProps) => (
    <Stepper activeStep={3} orientation="horizontal" {...props}>
      <Step index={0} completed />
      <Step index={1} completed />
      <Step index={2}>
        <StepContent>
          <StepLabel>{t("documentVerification.stepper.title")}</StepLabel>
        </StepContent>
      </Step>
    </Stepper>
  )

  return <DocumentVerification headerLeft={<ChapterHeaderStepper />} />
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

export default withPageAuthRequired(DocumentStatusVerification)
