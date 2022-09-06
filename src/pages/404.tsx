import { Box, Heading, VStack } from "@chakra-ui/layout"
import useTranslation from "next-translate/useTranslation"
import * as React from "react"

import { Header, Seo } from "~/components"

function PageNotFoundScreen() {
  const { t } = useTranslation("common")

  return (
    <>
      <Seo
        title={t("404.page.title")}
        description={t("404.page.description")}
      />

      <Header />

      <Box as="main">
        <VStack
          justify="center"
          spacing="4"
          as="section"
          py={["20", null, "40"]}
          textAlign="center"
        >
          <Heading as="h1" fontSize="5xl" fontWeight="bold">
            {t("404.heading")}
          </Heading>
          <Heading as="h2" fontSize="xl" fontWeight="semibold">
            {t("404.description")}
          </Heading>
        </VStack>
      </Box>
    </>
  )
}

export default PageNotFoundScreen
