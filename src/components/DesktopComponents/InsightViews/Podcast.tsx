import { Box, Divider, Heading, Text, useDisclosure } from "@chakra-ui/react"
import moment from "moment"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useEffect } from "react"

import {
  ChakraUIMarkDownRenderer,
  FeedbackModal,
  VideoPlayer,
} from "~/components"
import siteConfig from "~/config"
import { useUser } from "~/hooks/useUser"
import { FeedbackSubmissionScreen, Whitepaper } from "~/services/mytfo/types"
import {
  getFeedbackCookieStatus,
  setFeedbackCookieStatus,
} from "~/utils/clientUtils/feedbackCookieUtilities"
import { readFeatureArticleTime } from "~/utils/googleEventsClient"
import { clientEvent } from "~/utils/gtag"

type PodcastPropsType = {
  podcast: Whitepaper
}

export default function InsightsArticle({ podcast }: PodcastPropsType) {
  const {
    isOpen: isFeedbackModalOpen,
    onOpen: onFeedbackModalOpen,
    onClose: onFeedbackModalClose,
  } = useDisclosure()
  const { t } = useTranslation("insights")
  const { user } = useUser()

  useEffect(() => {
    const openTime = moment(new Date())
    let title = podcast?.title as string

    return () => {
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        readFeatureArticleTime,
        title,
        duration.asSeconds().toString(),
        user?.mandateId as string,
        user?.email as string,
      )
    }
  }, [])

  return (
    <Fragment>
      <Text mb={{ base: 4, md: 6 }} color="secondary.500" fontWeight="bold">
        {t(`tag.Podcast`)}
      </Text>
      <Heading fontSize="30px" mb={{ base: 10, md: "8px" }}>
        {podcast?.title}
      </Heading>
      <Text fontSize="20px" mb="8px">
        <ChakraUIMarkDownRenderer>
          {podcast?.description || ""}
        </ChakraUIMarkDownRenderer>
      </Text>
      <Divider borderColor="gray.800" mb="6" border="1px" />
      <Box>
        <VideoPlayer
          url={podcast.video}
          poster={podcast.cardImage}
          autoplay={true}
          showPlayBtn={false}
          onEnd={() => {
            if (
              getFeedbackCookieStatus(
                siteConfig.clientFeedbackSessionVariableName,
              ) == "true"
            ) {
              setTimeout(() => {
                onFeedbackModalOpen()
              }, 500)
            }
          }}
        />
      </Box>
      <FeedbackModal
        hideReferalOption={true}
        isOpen={isFeedbackModalOpen}
        onClose={() => {
          onFeedbackModalClose()
          setFeedbackCookieStatus(
            siteConfig.clientFeedbackSessionVariableName,
            false,
            siteConfig.clientFeedbackSessionExpireDays,
          )
        }}
        submissionScreen={FeedbackSubmissionScreen.ClientDavidDarstVideo}
      />
    </Fragment>
  )
}
