import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import moment from "moment"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect } from "react"

import { ClientLayout, Stage } from "~/components"
import { useUser } from "~/hooks/useUser"
import { screenSpentTime } from "~/utils/googleEventsClient"
import { clientEvent } from "~/utils/gtag"

const IlliquidStages = () => {
  const { t } = useTranslation("illiquidStages")
  const { user } = useUser()
  useEffect(() => {
    const openTime = moment(new Date())
    return () => {
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        screenSpentTime,
        "Illiquid Stages",
        duration.asSeconds().toString(),
        user?.mandateId as string,
        user?.email as string,
      )
    }
  }, [])

  return (
    <ClientLayout title={t("page")} description={t("page")}>
      <Stage
        title1={t("seedStage.title")}
        title2={t("rootStage.title")}
        title3={t("growStage.title")}
        title4={t("harvest.title")}
        period1={t("seedStage.betweenYears")}
        period2={t("rootStage.betweenYears")}
        period3={t("growStage.betweenYears")}
        period4={t("harvest.betweenYears")}
        para1={t("seedStage.description")}
        para2={t("rootStage.description")}
        para3={t("growStage.description")}
        para4={t("harvest.description")}
      />
    </ClientLayout>
  )
}

export default IlliquidStages

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
