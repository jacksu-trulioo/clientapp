import { getSession } from "@auth0/nextjs-auth0"
import { StyleProps } from "@chakra-ui/react"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import {
  InvestorProfileWizard,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "~/components"
import { CompleteInvestorProfileEvent } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

function InvestorProfileScreen() {
  const router = useRouter()
  const { t } = useTranslation("proposal")

  const ChapterHeaderStepper = (props?: StyleProps) => (
    <Stepper activeStep={1} orientation="horizontal" {...props}>
      <Step index={0} ms={{ base: 4, md: 0 }}>
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
    <InvestorProfileWizard
      headerLeft={<ChapterHeaderStepper />}
      onCompleted={() => {
        event(CompleteInvestorProfileEvent)
        router.push("/proposal")
      }}
    />
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = getSession(ctx.req, ctx.res)

  if (session) {
    const { roles } = session

    if (roles?.includes("client-desktop")) {
      let destination = ctx.locale === "ar" ? "/ar/404" : "/404"
      return {
        redirect: {
          destination,
          permanent: true,
        },
      }
    }
  }

  return {
    props: {},
  }
}

export default withPageAuthRequired(InvestorProfileScreen)
