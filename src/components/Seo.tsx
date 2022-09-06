import { NextSeo, NextSeoProps } from "next-seo"
import React from "react"

import siteConfig from "~/config"

export type SeoProps = Pick<NextSeoProps, "title" | "description">

export const Seo = ({ title, description }: SeoProps) => (
  <NextSeo
    title={`${title} | The Family Office`}
    description={description}
    openGraph={{ title, description }}
    titleTemplate={siteConfig.seo.titleTemplate}
  />
)

export default Seo
