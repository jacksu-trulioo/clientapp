import { Button } from "@chakra-ui/button"
import { Box, Divider, Flex, Heading, Text } from "@chakra-ui/layout"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment } from "react"

import { clickedScheduleMeetingOpportunities } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"

type OpportunitiesRMCardProps = {
  opportunitiesId?: string
}

const OpportunitiesRMCard = ({ opportunitiesId }: OpportunitiesRMCardProps) => {
  const { t } = useTranslation("common")
  return (
    <Fragment>
      <Flex
        justifyContent="space-between"
        bg={"linear-gradient(98.19deg, #1B2123 27.48%, #283134 97.46%)"}
        w="100%"
        p={8}
        alignItems="center"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="gunmetal.850"
        borderRadius="6px"
        mt="42px"
        flexDir={{ base: "column", md: "row" }}
      >
        <Box pe={{ md: "90px", lg: "200px" }} mb={{ base: 6, md: 0 }}>
          <Heading
            fontSize="xl"
            fontWeight="normal"
            color="contrast.200"
            mb={3}
          >
            {t("opportunitiesRMCardWidget.title")}{" "}
          </Heading>
          <Text fontSize="sm" fontWeight="normal" color="gray.400">
            {t("opportunitiesRMCardWidget.description")}
          </Text>
        </Box>
        <Box w={{ base: "100%", md: "auto" }}>
          <Button
            w={{ base: "100%", md: "auto" }}
            variant="solid"
            colorScheme="primary"
            onClick={() => {
              event(clickedScheduleMeetingOpportunities)
              router.push(`/schedule-meeting?opportunityId=${opportunitiesId}`)
            }}
          >
            {t("nav.links.scheduleCall")}
          </Button>
        </Box>
      </Flex>
      <Divider color="gray.800" m="42px 0" />
    </Fragment>
  )
}

export default OpportunitiesRMCard
