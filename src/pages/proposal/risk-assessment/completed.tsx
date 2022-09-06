import { Button } from "@chakra-ui/button"
import { Box, Circle, Heading, Stack, Text } from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/react"
import { chakra } from "@chakra-ui/system"
import Trans from "next-translate/Trans"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import {
  EmailIcon,
  Link,
  ModalFooter,
  ModalHeader,
  ModalLayout,
} from "~/components"
import { useUser } from "~/hooks/useUser"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

function RiskAssessmentCompletedScreen() {
  const { t } = useTranslation("proposal")
  const ref = React.useRef<HTMLDivElement>(null)
  const { user } = useUser()

  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isDesktopView = !isMobileView

  return (
    <ModalLayout
      title={t("riskAssessment.completed.page.title")}
      description={t("riskAssessment.completed.page.description")}
      header={
        <ModalHeader boxShadow="0 0 0 4px var(--chakra-colors-gray-900)" />
      }
      {...(isMobileView && {
        footer: (
          <ModalFooter ref={ref} position="fixed" bottom="0">
            <Button colorScheme="primary" as={Link} href="/" isFullWidth>
              {t("riskAssessment.completed.button.backToDashboard")}
            </Button>
          </ModalFooter>
        ),
      })}
    >
      <Stack
        h="70vh"
        spacing={{ base: 6, md: 14 }}
        margin="0 auto"
        alignItems="center"
        justifyContent="center"
        maxW="xl"
      >
        <Circle size="24" bgColor="gray.800">
          <EmailIcon color="primary.500" h={12} w={12} />
        </Circle>

        <Heading fontSize="3xl">
          {t("riskAssessment.completed.text.title")}
        </Heading>

        {user && (
          <Trans
            i18nKey="proposal:riskAssessment.completed.text.description"
            components={[
              <Box display="inline" key="0" />,
              <Text
                color="gray.400"
                textAlign="center"
                fontSize="sm"
                key="1"
              />,
              <chakra.span
                color="white"
                textAlign="center"
                fontSize="sm"
                key="2"
              />,
              <Text
                color="gray.400"
                textAlign="center"
                p="4"
                fontSize="sm"
                key="3"
              />,
            ]}
            values={{
              userEmail: user?.email,
            }}
          />
        )}

        {isDesktopView && (
          <Button colorScheme="primary" as={Link} href="/">
            {t("riskAssessment.completed.button.backToDashboard")}
          </Button>
        )}
      </Stack>
    </ModalLayout>
  )
}

export default withPageAuthRequired(RiskAssessmentCompletedScreen)
