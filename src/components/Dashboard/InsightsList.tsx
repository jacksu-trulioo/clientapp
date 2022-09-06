import { Box, Flex, Grid, GridItem, Link, Text } from "@chakra-ui/react"
import moment from "moment"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment } from "react"

import { ArchiveCard } from "~/components"
import { Insights } from "~/services/mytfo/clientTypes"

type InsightsListProps = {
  insights: Insights[]
}

export default function InsightsList({ insights }: InsightsListProps) {
  const { t, lang } = useTranslation("clientDashboard")

  return (
    <Fragment>
      <Flex pt={{ base: "0px", xl: "40px" }}>
        <Box w="100%">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            w="100%"
          >
            <Text
              fontSize="18px"
              fontWeight="700"
              marginBottom="15px"
              color="white"
              lineHeight="120%"
            >
              {" "}
              {t("insights.title")}
            </Text>
            <Link
              fontSize="14px"
              fontWeight="400"
              color="primary.500"
              display="flex"
              alignItems="center"
              lineHeight="120%"
              onClick={() => {
                router.push("/client/insights/markets-archive")
              }}
            >
              {t("insights.button")}
              <svg
                style={{
                  marginLeft: lang.includes("en") ? "16px" : 0,
                  marginRight: lang.includes("ar") ? "16px" : 0,
                  transform: lang.includes("ar") ? "rotate(180deg)" : "none",
                }}
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.25478 11.7557L7.64793 6.4073C7.87517 6.18216 7.87517 5.81842 7.64793 5.5927L2.25478 0.244292C1.92673 -0.0814308 1.39301 -0.0814308 1.06439 0.244292C0.736349 0.570015 0.736349 1.09866 1.06439 1.42438L5.67794 6.00029L1.06439 10.575C0.736349 10.9013 0.736349 11.43 1.06439 11.7557C1.39301 12.0814 1.92673 12.0814 2.25478 11.7557Z"
                  fill="#B99855"
                />
              </svg>
            </Link>
          </Box>
          <Text
            fontSize="14px"
            fontWeight="400"
            color="gray.400"
            marginBottom="20px"
            lineHeight="120%"
            maxWidth={{ base: "100%", md: "100%", lgp: "60%" }}
          >
            {" "}
            {t("insights.discalimer")}
          </Text>
        </Box>
      </Flex>
      <Grid
        aria-label="Insights Card"
        role={"gridcell"}
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lgp: "repeat(2, 1fr)",
          xl: "repeat(3, 1fr)",
          "2xl": "repeat(3, 1fr)",
        }}
        gap={6}
      >
        {insights.map((cardDetails: Insights, i: number) => (
          <GridItem
            w="100%"
            key={i}
            pb={{ base: "10px", md: "20px" }}
            // my={{ base: "10px", md: "20px" }}
            onClick={() =>
              router.push(
                `/client/insights/markets-archive/podcasts/${cardDetails.id}`,
              )
            }
          >
            <ArchiveCard
              cardImage={
                cardDetails.content?.CardImage
                  ? cardDetails.content?.CardImage?.filename
                  : cardDetails.content?.BannerImage?.filename
              }
              title={cardDetails.content.Title}
              tag={t(`insights:tag.Podcast`)}
              showVideoIcon={true}
              description={`${moment(cardDetails.content.PublishDate).format(
                "MMM DD YYYY",
              )} | ${cardDetails.content.EstimatedDuration}`}
            />
          </GridItem>
        ))}
      </Grid>
    </Fragment>
  )
}
