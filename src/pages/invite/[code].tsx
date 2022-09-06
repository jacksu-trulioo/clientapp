import router, { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import useTranslation from "next-translate/useTranslation"
import React from "react"

function InvitePage() {
  const { isReady, query, basePath } = useRouter()
  const { t, lang } = useTranslation("common")

  React.useEffect(() => {
    if (isReady) {
      router.push(`/signup?utm_medium=myreferral&utm_source=${query?.code}`)
    }
  }, [isReady, query])

  const title = t("shareInviteModal.platform.heading")
  const description = t("shareInviteModal.platform.description")

  const imageBaseURL = process.env.NEXT_PUBLIC_BASE_URL || ""

  //TODO: Remove logging once validated on QA
  console.log(
    `${imageBaseURL}/images/share_social_placeholder${
      lang === "ar" ? "_ar" : ""
    }.png`,
  )

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        twitter={{
          handle: "@TheFamilyOffice",
          site: "@TheFamilyOffice",
          cardType: "summary_large_image",
        }}
        openGraph={{
          type: "content",
          url: `${basePath}`,
          title,
          description,
          site_name: "The Family Office",
          locale: lang,
          images: [
            {
              url: `${imageBaseURL}/images/share_social_placeholder${
                lang === "ar" ? "_ar" : ""
              }.png`,
              width: 800,
              height: 600,
              alt: "The Family Office",
              type: "image/png",
            },
          ],
        }}
      />
    </>
  )
}

export default InvitePage
