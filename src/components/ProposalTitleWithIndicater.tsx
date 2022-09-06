import { Container, FlexProps, Heading, Text } from "@chakra-ui/layout"
import { chakra, HStack } from "@chakra-ui/react"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { ReactElement } from "react"

import QuestionInfoCard from "./InvestorProfile/QuestionInfoCard"

export type ProposalTitleWithIndicaterProps = Pick<FlexProps, "children"> & {
  pages: Array<string>
  currentPageIndex: number
  heading: string
  description?: string
  infoHeading?: string
  infoDescription?: string
  infoCard?: ReactElement | boolean
}

const ProposalTitleWithIndicater = ({
  pages,
  currentPageIndex,
  heading,
  description,
  infoHeading,
  infoDescription,
  infoCard,
}: ProposalTitleWithIndicaterProps) => {
  const router = useRouter()
  const { t } = useTranslation()

  const switchPage = (page: string, index: number) => {
    if (index <= currentPageIndex) {
      router.push("#" + page)
    }
  }

  return (
    <Container flex="1" maxW={{ base: "full", md: "280px" }} px="0">
      <Heading
        mb={{ base: 4, md: 6 }}
        fontSize={{ base: "2xl", md: "2xl", lg: "3xl" }}
      >
        {heading}
      </Heading>
      <Text mb={3} fontSize="sm" color="gray.400">
        {`${currentPageIndex + 1} ${t("common:generic.of")} ${pages?.length}`}
      </Text>

      <HStack mb={6}>
        {pages.map((page, index) => (
          <chakra.div
            key={page}
            w="100%"
            h={1}
            cursor={index <= currentPageIndex ? "pointer" : "not-allowed"}
            backgroundColor="gray.500"
            onClick={() => switchPage(page, index)}
          >
            <chakra.div
              width={index === currentPageIndex ? "50%" : "100%"}
              height="100%"
              backgroundColor={index <= currentPageIndex ? "primary.500" : ""}
            />
          </chakra.div>
        ))}
      </HStack>

      {description && (
        <Text mb={6} color="gray.400">
          {description}
        </Text>
      )}

      {infoCard
        ? infoCard
        : infoHeading && (
            <QuestionInfoCard
              heading={infoHeading}
              description={infoDescription}
            />
          )}
    </Container>
  )
}

export default ProposalTitleWithIndicater
