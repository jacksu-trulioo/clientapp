import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import React from "react"

import { SubscriptionWizard } from "~/components"

const Subscription = () => {
  return <SubscriptionWizard />
}

export default Subscription

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async function (ctx) {
    const sesison = getSession(ctx.req, ctx.res)
    if (sesison?.mandateId) {
      return {
        props: {}, // will be passed to the page component as props
      }
    }
    return {
      notFound: true,
    }
  },
})
