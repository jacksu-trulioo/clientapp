import { StyleProps } from "@chakra-ui/react"
import { GetServerSideProps } from "next"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import {
  KycPersonalInformationWizard,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "~/components"
import siteConfig from "~/config"
import { MyTfoClient } from "~/services/mytfo"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

function KycPersonalInformationScreen() {
  const { t } = useTranslation("kyc")

  const ChapterHeaderStepper = (props?: StyleProps) => (
    <Stepper activeStep={1} orientation="horizontal" {...props}>
      <Step index={0}>
        <StepContent>
          <StepLabel color="white" fontWeight="bold">
            {t("chapterSelection.chapterOne.stepper.title")}
          </StepLabel>
        </StepContent>
      </Step>
      <Step index={1} />
      <Step index={2} />
    </Stepper>
  )

  return (
    <KycPersonalInformationWizard
      headerLeft={<ChapterHeaderStepper />}
      onCompleted={() => {
        router.push("/kyc")
      }}
    />
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
      res.writeHead(302, { Location: "/kyc/personal-information" })
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

export default withPageAuthRequired(KycPersonalInformationScreen)
