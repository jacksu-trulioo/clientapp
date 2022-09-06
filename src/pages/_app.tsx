import "@trulioo/globalgateway-image-capture-sdk/GlobalGatewayCapturePublic/css/GlobalGatewayCapture.css"
import "../../node_modules/slick-carousel/slick/slick.css"
import "../../node_modules/slick-carousel/slick/slick-theme.css"
import "../../node_modules/react-datepicker/dist/react-datepicker.css"
import "../../node_modules/video.js/dist/video-js.css"
import "../styles/styles.css"
import "../styles/calendarStyles.css"
import "../styles/comboBox.css"
import "../styles/videoPlayer.css"
import "../components/MyDocument/PdfViewer.css"

import { datadogRum } from "@datadog/browser-rum"
import * as Sentry from "@sentry/nextjs"
import moment from "moment"
import type { AppProps } from "next/app"
import Head from "next/head"
import { useRouter } from "next/router"
import Script from "next/script"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect } from "react"
import LinkedInTag from "react-linkedin-insight"
import { SWRConfig } from "swr"

import { CustomChakraProvider, Fonts, RtlProvider } from "~/components"
import UserProvider from "~/hooks/useUser"
import { initializeAppInsights } from "~/utils/appInsights"

import * as gtag from "../utils/gtag"

if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
  require("../mocks")
}

LinkedInTag.init("2278500", "dc")

datadogRum.init({
  applicationId: "64d25457-1837-4a15-9472-02bdc3e5aabb",
  clientToken: "pubc554c8ec522e187f86f294c1404eafad",
  site: "datadoghq.eu",
  service: "prospect-journey",
  env: "dev",
  // Specify a version number to identify the deployed version of your application in Datadog
  // version: '1.0.0',
  sampleRate: 100,
  trackInteractions: true,
  defaultPrivacyLevel: "mask-user-input",
})

datadogRum.startSessionReplayRecording()

function App(props: AppProps) {
  const { t, lang } = useTranslation("common")
  const { Component, pageProps } = props
  const router = useRouter()

  useEffect(() => {
    moment.updateLocale(lang, {
      monthsShort: [
        t("client.monthsLabel.month_1_short_text"),
        t("client.monthsLabel.month_2_short_text"),
        t("client.monthsLabel.month_3_short_text"),
        t("client.monthsLabel.month_4_short_text"),
        t("client.monthsLabel.month_5_short_text"),
        t("client.monthsLabel.month_6_short_text"),
        t("client.monthsLabel.month_7_short_text"),
        t("client.monthsLabel.month_8_short_text"),
        t("client.monthsLabel.month_9_short_text"),
        t("client.monthsLabel.month_10_short_text"),
        t("client.monthsLabel.month_11_short_text"),
        t("client.monthsLabel.month_12_short_text"),
      ],
      months: [
        t("client.monthsLabel.month_1_long_text"),
        t("client.monthsLabel.month_2_long_text"),
        t("client.monthsLabel.month_3_long_text"),
        t("client.monthsLabel.month_4_long_text"),
        t("client.monthsLabel.month_5_long_text"),
        t("client.monthsLabel.month_6_long_text"),
        t("client.monthsLabel.month_7_long_text"),
        t("client.monthsLabel.month_8_long_text"),
        t("client.monthsLabel.month_9_long_text"),
        t("client.monthsLabel.month_10_long_text"),
        t("client.monthsLabel.month_11_long_text"),
        t("client.monthsLabel.month_12_long_text"),
      ],
    })
  }, [])

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url)
    }
    router.events.on("routeChangeComplete", handleRouteChange)
    router.events.on("hashChangeComplete", handleRouteChange)
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
      router.events.off("hashChangeComplete", handleRouteChange)
    }
  }, [router.events])

  // Commeting the changes as this has been deprioritized. Will be picked up later.

  // useEffect(() => {
  //   window.addEventListener("beforeunload", logout, false)
  //   return () => {
  //     window.removeEventListener("beforeunload", logout, false)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  // const logout = () => {
  //   ky.post(`/api/auth/logout?lang=${lang}`)
  // }

  // SWR fetcher function.
  const fetcher = async (url: string) => {
    const res = await fetch(url, {
      headers: {
        "Accept-Language": lang,
      },
    })

    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    if (!res.ok) {
      const error = new Error("An error occurred while fetching the data.")
      // Attach extra info to the error object.
      // @ts-ignore
      error.info = await res.json()
      // @ts-ignore
      error.status = res.status
      if (res.status === 401 || res.status === 403) {
        const loginUrl = process.env.NEXT_PUBLIC_AUTH0_LOGIN || "/login"
        const currentLocation = window.location.toString()
        const returnToPath =
          currentLocation.replace(new URL(currentLocation).origin, "") || "/"
        await router.replace(
          `${loginUrl}?returnTo=${encodeURIComponent(returnToPath)}`,
        )
      } else {
        Sentry.captureException(error)
        throw error
      }
    }

    return res.json()
  }

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, target-densityDpi=device-dpi"
        />
      </Head>
      {/* <!-- Start of HubSpot Embed Code --> */}
      <Script
        id="hs-script-loader"
        src="https://js.hs-scripts.com/20773544.js"
        strategy="lazyOnload"
      />
      {/* <!-- End of HubSpot Embed Code --> */}

      {/* <!-- Hotjar Tracking Code for https://my.tfoco.com --> */}
      <Script
        id="hotjar"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
    (function(h,o,t,j,a,r){
      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
      h._hjSettings={hjid:2959837,hjsv:6};
      a=o.getElementsByTagName('head')[0];
      r=o.createElement('script');r.async=1;
      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
      a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  `,
        }}
      />
      <Script
        id="segment-embed-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
              !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="eMjiO61ZGJ3DAaCjjtnbWDCEHORPIus5";analytics.SNIPPET_VERSION="4.15.2";
              analytics.load("eMjiO61ZGJ3DAaCjjtnbWDCEHORPIus5");
              analytics.page();
              }}();
                  `,
        }}
      />
      <SWRConfig
        value={{
          fetcher,
        }}
      >
        <CustomChakraProvider>
          <RtlProvider>
            <Fonts />
            <UserProvider>
              <Component {...pageProps} />
            </UserProvider>
          </RtlProvider>
        </CustomChakraProvider>
      </SWRConfig>
    </>
  )
}

initializeAppInsights()

export default App
