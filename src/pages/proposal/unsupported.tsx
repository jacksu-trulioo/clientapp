import { Button } from "@chakra-ui/button"
import { Box, Heading, Link, Stack, Text } from "@chakra-ui/layout"
import { useMediaQuery } from "@chakra-ui/media-query"
import Trans from "next-translate/Trans"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { ModalFooter, ModalHeader } from "~/components"
import { ModalLayout } from "~/components/ModalLayout"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

function UnsupportedScreen() {
  const { t } = useTranslation("proposal")

  const ref = React.useRef<HTMLDivElement>(null)

  const [isMobileView] = useMediaQuery("(max-width: 45em)")
  const isDesktopView = !isMobileView

  return (
    <ModalLayout
      title={t("unsupported.page.title")}
      description={t("unsupported.page.description")}
      header={
        <ModalHeader boxShadow="0 0 0 4px var(--chakra-colors-gray-900)" />
      }
      {...(isMobileView && {
        footer: (
          <ModalFooter ref={ref}>
            <Button colorScheme="primary" as={Link} href="/" isFullWidth>
              {t("unsupported.button.backToDashboard")}
            </Button>
          </ModalFooter>
        ),
      })}
    >
      <Stack
        h="full"
        spacing={{ base: 6, md: 14 }}
        margin="0 auto"
        alignItems="center"
        justifyContent="center"
        maxW="xl"
      >
        <Heading fontSize="3xl">{t("unsupported.heading")}</Heading>

        <Trans
          i18nKey="proposal:unsupported.text.description"
          components={[
            <Box display="inline" key="0" />,
            <Text color="gray.400" textAlign="center" fontSize="sm" key="1" />,
            <Text
              color="gray.400"
              textAlign="center"
              p="4"
              fontSize="sm"
              key="3"
            />,
          ]}
        />

        {isDesktopView && (
          <Button colorScheme="primary" as={Link} href="/">
            {t("unsupported.button.backToDashboard")}
          </Button>
        )}
      </Stack>
    </ModalLayout>
  )
}

export default withPageAuthRequired(UnsupportedScreen)
