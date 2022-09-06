import { GetServerSideProps } from "next"
import React from "react"

import { KycInvestmentExperience } from "~/components"
import siteConfig from "~/config"
import { MyTfoClient } from "~/services/mytfo"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

const KycInvestmentExperienceScreen = () => {
  return <KycInvestmentExperience />
}

export default withPageAuthRequired(KycInvestmentExperienceScreen)

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
      res.writeHead(302, { Location: "/kyc/investment-experience" })
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
