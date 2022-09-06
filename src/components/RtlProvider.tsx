import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import { useRouter } from "next/router"
import React from "react"
import rtl from "stylis-plugin-rtl"

const options = {
  rtl: { key: "css-ar", stylisPlugins: [rtl] },
  ltr: { key: "css-en" },
}

const RtlProvider: React.FC = ({ children }) => {
  const { locale } = useRouter()
  const dir = locale === "ar" ? "rtl" : "ltr"
  const cache = createCache(options[dir])
  return <CacheProvider value={cache}>{children}</CacheProvider>
}

RtlProvider.displayName = "RtlProvider"

export default RtlProvider
