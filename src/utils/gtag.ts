export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID
export const MEASUREMENT_ID = process.env.NEXT_PUBLIC_MEASUREMENT_ID

// https://frontend-digest.com/using-nextjs-with-google-analytics-and-typescript-620ba2359dea
// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL) => {
  if (GA_TRACKING_ID && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

export const userIdFunc = (userId: string) => {
  if (MEASUREMENT_ID && window.gtag) {
    window.gtag("config", MEASUREMENT_ID, {
      user_id: userId,
    })
    window.gtag("set", "user_properties", {
      crm_id: userId,
    })
  }
}

export type GTagEvent = {
  action: string
  category: string
  label: string
  value?: number
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GTagEvent) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// For Client

export type ClientUniGTagEvent = {
  action: string
  label: string
  value?: number
}

export type ClientGTagEvent = {
  action: string
  value?: number
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const clientUniEvent = (
  { action, label, value }: ClientUniGTagEvent,
  category: string,
  mandate_id: string,
  emailId: string,
) => {
  if (window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
      mandate_id: mandate_id,
      emailId: emailId,
    })
  }
}

export const clientEvent = (
  { action, value }: ClientGTagEvent,
  label: string,
  category: string,
  mandate_id: string,
  emailId: string,
) => {
  if (window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
      mandate_id: mandate_id,
      emailId: emailId,
    })
  }
}

export const twitterEvent = (identifier: string) => {
  if (identifier === "signup") {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion", {
        allow_custom_scripts: true,
        send_to: "DC-9983987/mytfoco/tfosign+standard",
      })
    }
  }
  if (identifier === "login") {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion", {
        allow_custom_scripts: true,
        send_to: "DC-9983987/mytfoco/logged+standard",
      })
    }
  }
  if (identifier === "onboarding") {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion", {
        allow_custom_scripts: true,
        send_to: "DC-9983987/mytfoco/onboard+standard",
      })
    }
  }

  if (identifier === "verify") {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion", {
        allow_custom_scripts: true,
        send_to: "DC-9983987/mytfoco/tfoverif+standard",
      })
    }
  }

  if (identifier === "verify-success") {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion", {
        allow_custom_scripts: true,
        send_to: "DC-9983987/mytfoco/veriftyp+standard",
      })
    }
  }

  if (identifier === "onboard-on-continue") {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion", {
        allow_custom_scripts: true,
        send_to: "DC-9983987/mytfoco/tfo-m0+standard",
      })
    }
  }

  if (identifier === "boot-up") {
    // @ts-ignore
    if (typeof window !== "undefined" && window.twttr) {
      // @ts-ignore
      window.twttr.conversion.trackPid("o8t7m", {
        tw_sale_amount: 0,
        tw_order_quantity: 0,
      })
    }
  }
}
