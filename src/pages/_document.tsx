import Document, { Head, Html, Main, NextScript } from "next/document"
import React from "react"

import { GA_TRACKING_ID } from "~/utils/gtag"
import { INSIDER_TRACKING_ID } from "~/utils/insider"

class CustomDocument extends Document {
  render() {
    const { locale } = this.props.__NEXT_DATA__
    const dir = locale === "ar" ? "rtl" : "ltr"

    return (
      <Html dir={dir} lang={locale}>
        <Head>
          {GA_TRACKING_ID && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              />
              <script
                async
                src="//static.ads-twitter.com/oct.js"
                type="text/javascript"
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });`,
                }}
              />
            </>
          )}
          {INSIDER_TRACKING_ID && (
            <>
              <script
                async
                src={`https://thefamilyoffice.api.useinsider.com/ins.js?id=${INSIDER_TRACKING_ID}`}
              />
            </>
          )}
          <script
            dangerouslySetInnerHTML={{
              __html: `
              !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
              },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='//static.ads-twitter.com/uwt.js',
              a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
              twq('init','o3mle');
              twq('track','PageView');
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default CustomDocument
