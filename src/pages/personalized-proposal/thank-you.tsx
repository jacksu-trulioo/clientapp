import { Box, Circle, Container, Heading, Text } from "@chakra-ui/layout"
import { Button } from "@chakra-ui/react"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { CheckCircleIcon, ModalHeader, ModalLayout } from "~/components"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

function ProposalThankYouScreen() {
  const { t } = useTranslation("personalizedProposal")
  const { push } = useRouter()

  return (
    <ModalLayout
      title={t("thankYou.title")}
      description={t("thankYou.description")}
      header={<ModalHeader />}
    >
      <Container
        maxW={["container.xl", "container.sm"]}
        height="full"
        centerContent
        justifyContent="center"
        px={2}
      >
        <Box>
          <Circle size="96px" bg="gray.800" mb="60px">
            <CheckCircleIcon w="62" h="62" color="primary.500" />
          </Circle>
        </Box>
        <Heading fontSize={["2xl", "3xl", "4xl"]}>
          {t("thankYou.title")}
        </Heading>
        <Box
          align="center"
          fontSize="sm"
          fontWeight={400}
          my={4}
          w={["xs", "md"]}
        >
          <Text my={2}>{t("thankYou.description")}</Text>
        </Box>
        <Button
          onClick={() => push("/")}
          mt={4}
          mb={{ base: 4, md: 4, lg: 0 }}
          role="button"
          size="sm"
          colorScheme="primary"
        >
          {t("thankYou.cta")}
        </Button>
      </Container>
    </ModalLayout>
  )
}

export default React.memo(withPageAuthRequired(ProposalThankYouScreen))
