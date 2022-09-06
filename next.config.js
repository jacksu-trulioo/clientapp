const nextTranslate = require("next-translate")
const { withSentryConfig } = require("@sentry/nextjs")
const isMockingEnabled = process.env.NEXT_PUBLIC_API_MOCKING === "enabled"

const url = {
  segmentScriptSrc: "https://cdn.segment.com/",
  segmentConnectSrc: "https://api.segment.io/ https://cdn.segment.com/",
  sentry: "https://o1020394.ingest.sentry.io",
  hotjarScript:
    " https://*.hotjar.com:* https://*.hotjar.com:* http://*.hotjar.io https://*.hotjar.io wss://*.hotjar.com",
  hubspotScript:
    "https://www.googleadservices.com/ https://snap.licdn.com/ https://js.hs-scripts.com/ https://js.hs-banner.com/ https://js.hs-analytics.net/ https://js.hscollectedforms.net/ https://js.hsadspixel.net/fb.js",
  datadogConnect: "https://rum.browser-intake-datadoghq.eu/",
  datadogScript:
    "https://*.logs.datadoghq.eu/ https://www.datadoghq-browser-agent.com/",
  cloudFlareScriptSrc: "https://static.cloudflareinsights.com/",
  datadogRUMScript: "https://rum.browser-intake-datadoghq.eu/",
  datadogSessionReplayScript:
    "https://session-replay.browser-intake-datadoghq.eu/",
  datadogScriptReplay: "https://session-replay.browser-intake-datadoghq.eu",
  sentry: "https://o1020394.ingest.sentry.io",
  gTagManager: "https://tagmanager.google.com/",
  googleTagManager: "https://www.googletagmanager.com/",
  googleAnalytics: "https://www.google-analytics.com",
  googleAddService:
    "https://www.googleadservices.com/ https://adservice.google.com/",
  googleStatic: "https://ssl.gstatic.com/",
  googleFonts: "https://fonts.googleapis.com/",
  googleStaticFonts: "https://fonts.gstatic.com",
  googleAddsDoubleClick: "https://googleads.g.doubleclick.net/",
  appInsights: "https://dc.services.visualstudio.com/",
  globalDataCompany: "https://api.globaldatacompany.com/",
  insiderUrl: "https://*.api.useinsider.com/ https://*.useinsider.com/",
  insiderConnectSrcUrl: "https://hit.api.useinsider.com/",
  insiderConnectSrcUrl1: "https://location.api.useinsider.com/",
  insiderConnectSrcUrl2: "https://segment.api.useinsider.com/",
  insiderCdnUrl:
    "https://snap.licdn.com/ https://clientfedev.tfoco.dev https://clientfeqa.tfoco.dev",
  insiderImageSrcUrl: "https://sentinel.api.useinsider.com/",
  storyBlok: "https://a.storyblok.com/",
  mediaSource:
    "clientappmedia.s3-eu-west-1.amazonaws.com clientappmedia.s3.eu-west-1.amazonaws.com tfoclientappmedia.blob.core.windows.net access.tfoco.dev stcappstgeude.blob.core.windows.net tfoclientappmedia.blob.core.windows.net a.storyblok.com tfostgwacadesktopstg.blob.core.windows.net",
  youTube: "youtube.com www.youtube.com",
  hotJarFrameSrc: "https://*.hotjar.com/",
  hotJarConnectSrc: "https://*.hotjar.com/ wss://*.hotjar.com/",
  hubspotConnectSrc:
    "https://forms.hubspot.com/ https://*.hubapi.com/ https://js.hs-banner.com/",
  hubspotImageSrc: "https://forms.hsforms.com/",
  hubspotImageSrc1: "https://track.hubspot.com",
  data: "data:",
  blob: "blob:",
  cdn: "cdnjs.cloudflare.com",
  blobDealImage: "https://tfoclientappmedia.blob.core.windows.net/",
  googleImageSrc:
    "https://www.google.com https://www.google.com.bh https://www.google.com https://www.google.ad https://www.google.ae https://www.google.com.af https://www.google.com.ag https://www.google.com.ai https://www.google.al https://www.google.am https://www.google.co.ao https://www.google.com.ar https://www.google.as https://www.google.at https://www.google.com.au https://www.google.az https://www.google.ba https://www.google.com.bd https://www.google.be https://www.google.bf https://www.google.bg https://www.google.bi https://www.google.bj https://www.google.com.bn https://www.google.com.bo https://www.google.com.br https://www.google.bs https://www.google.bt https://www.google.co.bw https://www.google.by https://www.google.com.bz https://www.google.ca https://www.google.cd https://www.google.cf https://www.google.cg https://www.google.ch https://www.google.ci https://www.google.co.ck https://www.google.cl https://www.google.cm https://www.google.cn https://www.google.com.co https://www.google.co.cr https://www.google.com.cu https://www.google.cv https://www.google.com.cy https://www.google.cz https://www.google.de https://www.google.dj https://www.google.dk https://www.google.dm https://www.google.com.do https://www.google.dz https://www.google.com.ec https://www.google.ee https://www.google.com.eg https://www.google.es https://www.google.com.et https://www.google.fi https://www.google.com.fj https://www.google.fm https://www.google.fr https://www.google.ga https://www.google.ge https://www.google.gg https://www.google.com.gh https://www.google.com.gi https://www.google.gl https://www.google.gm https://www.google.gr https://www.google.com.gt https://www.google.gy https://www.google.com.hk https://www.google.hn https://www.google.hr https://www.google.ht https://www.google.hu https://www.google.co.id https://www.google.ie https://www.google.co.il https://www.google.im https://www.google.co.in https://www.google.iq https://www.google.is https://www.google.it https://www.google.je https://www.google.com.jm https://www.google.jo https://www.google.co.jp https://www.google.co.ke https://www.google.com.kh https://www.google.ki https://www.google.kg https://www.google.co.kr https://www.google.com.kw https://www.google.kz https://www.google.la https://www.google.com.lb https://www.google.li https://www.google.lk https://www.google.co.ls https://www.google.lt https://www.google.lu https://www.google.lv https://www.google.com.ly https://www.google.co.ma https://www.google.md https://www.google.me https://www.google.mg https://www.google.mk https://www.google.ml https://www.google.com.mm https://www.google.mn https://www.google.ms https://www.google.com.mt https://www.google.mu https://www.google.mv https://www.google.mw https://www.google.com.mx https://www.google.com.my https://www.google.co.mz https://www.google.com.na https://www.google.com.ng https://www.google.com.ni https://www.google.ne https://www.google.nl https://www.google.no https://www.google.com.np https://www.google.nr https://www.google.nu https://www.google.co.nz https://www.google.com.om https://www.google.com.pa https://www.google.com.pe https://www.google.com.pg https://www.google.com.ph https://www.google.com.pk https://www.google.pl https://www.google.pn https://www.google.com.pr https://www.google.ps https://www.google.pt https://www.google.com.py https://www.google.com.qa https://www.google.ro https://www.google.ru https://www.google.rw https://www.google.com.sa https://www.google.com.sb https://www.google.sc https://www.google.se https://www.google.com.sg https://www.google.sh https://www.google.si https://www.google.sk https://www.google.com.sl https://www.google.sn https://www.google.so https://www.google.sm https://www.google.sr https://www.google.st https://www.google.com.sv https://www.google.td https://www.google.tg https://www.google.co.th https://www.google.com.tj https://www.google.tl https://www.google.tm https://www.google.tn https://www.google.to https://www.google.com.tr https://www.google.tt https://www.google.com.tw https://www.google.co.tz https://www.google.com.ua https://www.google.co.ug https://www.google.co.uk https://www.google.com.uy https://www.google.co.uz https://www.google.com.vc https://www.google.co.ve https://www.google.vg https://www.google.co.vi https://www.google.com.vn https://www.google.vu https://www.google.ws https://www.google.rs https://www.google.co.za https://www.google.co.zm https://www.google.co.zw https://www.google.cat",
  linkedImageSrc: "https://px.ads.linkedin.com/ https://p.adsymptotic.com/",
  googleFrameSrc: "https://bid.g.doubleclick.net/",
  cloudFlareSrc:
    "http://cdnjs.cloudflare.com https://ajax.cloudflare.com/ https://static.cloudflareinsights.com/ https://cloudflareinsights.com",

  linkedURL: "https://www.linkedin.com",
  dsAds: "https://dc.ads.linkedin.com",
  twitterAds: "http://static.ads-twitter.com",
  twitterImg: "https://analytics.twitter.com",
  adctImg: "https://t.co/i/adsct",
  twitterDouble: "https://9983987.fls.doubleclick.net",
  px4linkedinImage: "https://px4.ads.linkedin.com",
  docsCenterEndpoint: "https://stcappstgeude.blob.core.windows.net",
  docsCenterPRODEndpoint: "https://tfostgwacadesktopstg.blob.core.windows.net",
}

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Content-Security-Policy-Report-Only",
    value: `report-uri ${url.sentry}`,
  },
  {
    key: "Content-Security-Policy",
    value: `default-src 'self' blob: data: gap:; object-src 'self' blob: data: gap: ${url.data}; script-src 'self' blob: data: gap: ${url.segmentScriptSrc} ${url.twitterAds} ${url.googleAddService} ${url.cloudFlareSrc} ${url.insiderCdnUrl} ${url.googleTagManager} 'unsafe-eval' 'unsafe-inline'  blob: data: gap: ${url.googleAddService}  ${url.insiderCdnUrl}  ${url.cloudFlareScriptSrc} ${url.datadogScript} ${url.datadogRUMScript} ${url.datadogSessionReplayScript} ${url.hubspotScript} ${url.hotjarScript} ${url.insiderUrl}  ${url.gTagManager} ${url.googleAddService} ${url.googleTagManager} ${url.googleAddsDoubleClick} ${url.cdn} ${url.blob}; connect-src 'self' blob: data: gap: ${url.segmentConnectSrc} ${url.sentry} ${url.insiderCdnUrl} ${url.datadogSessionReplayScript} ${url.datadogRUMScript} ${url.hubspotConnectSrc} ${url.hotJarConnectSrc} ${url.datadogConnect} ${url.insiderConnectSrcUrl} ${url.insiderConnectSrcUrl1} ${url.insiderConnectSrcUrl2} ${url.googleAnalytics} ${url.appInsights} ${url.globalDataCompany} ${url.googleAddService} ${url.docsCenterEndpoint} ${url.docsCenterPRODEndpoint}; img-src 'self' blob: data: gap: ${url.cdn} ${url.blobDealImage} ${url.px4linkedinImage} ${url.adctImg} ${url.twitterImg} ${url.twitterAds} ${url.linkedURL} ${url.dsAds} ${url.linkedImageSrc} ${url.googleImageSrc} ${url.googleTagManager} ${url.hubspotImageSrc} ${url.hubspotImageSrc1} ${url.insiderImageSrcUrl} blob: data: gap: ${url.storyBlok} 'unsafe-inline' ${url.insiderCdnUrl} ${url.googleAddService} ${url.googleStatic}; style-src 'self' 'unsafe-inline' blob: data: gap: ${url.insiderCdnUrl} ${url.googleAddService}  ${url.gTagManager} ${url.googleFonts} ${url.insiderUrl}; base-uri 'self' blob: data: gap:; form-action 'self' blob: data: gap:; frame-src 'self' blob: ${url.docsCenterEndpoint} data: gap: ${url.twitterDouble} ${url.googleFrameSrc} ${url.insiderUrl} ${url.youTube} ${url.data} ${url.hotJarFrameSrc}; media-src ${url.mediaSource}; font-src 'self' blob: data: gap: ${url.googleStaticFonts} ${url.data}`,
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Permitted-Cross-Domain-Policies",
    value: "master-only",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(self), microphone=(self), geolocation=(self), interest-cohort=()",
  },
]

async function headers() {
  return [
    {
      // Apply security headers to all routes.
      source: "/(.*)",
      headers: securityHeaders,
    },
    {
      source: "/fonts/Gotham-Book.woff2",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "/fonts/Gotham-Book.woff",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "/invite/:code",
      headers: [
        {
          key: "Set-Cookie",
          value: "ref_code=:code;path=/;max-age=31536000",
        },
      ],
    },
  ]
}

/** @type {import('next').NextConfig} */
const nextConfig = ([_phase, _defaultConfig]) => {
  // Enable remote image provider domains.
  const images = {
    domains: ["a.storyblok.com"],
  }

  if (isMockingEnabled) {
    // Add domain for images from faker.js when mocking is enabled.
    images.domains.push("via.placeholder.com")
  }

  return {
    reactStrictMode: true,
    poweredByHeader: false, // Disable 'x-powered-by header from Next.js.
    headers,
    images,
    eslint: {
      dirs: ["src", "cypress"],
    },
    webpack: (config) => {
      config.module.rules = [
        ...config.module.rules,
        {
          test: /src\/components\/index.ts/i,
          sideEffects: false,
        },
      ]
      return config
    },
    sentry: {
      disableServerWebpackPlugin: true,
      disableClientWebpackPlugin: true,
    },
  }
}

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
}

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

module.exports = (...args) =>
  withSentryConfig(
    withBundleAnalyzer(nextTranslate(nextConfig(args))),
    sentryWebpackPluginOptions,
  )
