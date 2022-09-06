import { getSession } from "@auth0/nextjs-auth0"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import React from "react"

import { InvestmentGoalsWizard } from "~/components"
import { CompleteInvestorGoalsEvent } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

function InvestmentGoalsScreen() {
  const router = useRouter()

  return (
    <InvestmentGoalsWizard
      onCompleted={() => {
        event(CompleteInvestorGoalsEvent)
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

export default withPageAuthRequired(InvestmentGoalsScreen)
