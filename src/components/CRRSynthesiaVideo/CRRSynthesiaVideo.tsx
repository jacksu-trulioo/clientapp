import { Box, Container, Text } from "@chakra-ui/layout"
import { useDisclosure } from "@chakra-ui/react"
import moment, { Moment } from "moment"
import useTranslation from "next-translate/useTranslation"
import React, { useState } from "react"

import { FeedbackModal, VideoPlayer } from "~/components"
import siteConfig from "~/config"
import { useUser } from "~/hooks/useUser"
import { FeedbackSubmissionScreen } from "~/services/mytfo/types"
import { formatDate } from "~/utils/clientUtils/dateUtility"
import {
  getFeedbackCookieStatus,
  setFeedbackCookieStatus,
} from "~/utils/clientUtils/feedbackCookieUtilities"
import {
  clickOnSynthesia,
  screenSpentTimeSynthesia,
} from "~/utils/googleEventsClient"
import { clientUniEvent } from "~/utils/gtag"

type CRRVideProps = {
  url: string
  createdDate: string
}

function CRRSynthesisVideo({ url, createdDate }: CRRVideProps) {
  const { user } = useUser()
  const { t, lang } = useTranslation("portfolioSummary")
  const {
    isOpen: isFeedbackModalOpen,
    onOpen: onFeedbackModalOpen,
    onClose: onFeedbackModalClose,
  } = useDisclosure()

  const [playtime, setPlayTime] = useState<Moment>()

  return (
    <Container as="section" maxW="full" px="0" flexDirection="row">
      <Box
        display="flex"
        justify-content="space-between"
        align-items="center"
        padding-bottom="0px"
      >
        <Text className="op-title" mt={{ base: "0", md: "40px" }}>
          {t("portfolioOverviewVideos.title")}
        </Text>
      </Box>
      <Box mt="24px" mb="40px" width="100%">
        <Box className="videoPlaceholder1">
          <Box
            height="auto"
            width="100%"
            position="relative"
            marginBottom="40px"
          >
            <VideoPlayer
              url={url}
              poster="/images/crr-video-poster.jpeg"
              showPlayBtn={false}
              onPlay={() => {
                const playTime = moment(new Date())
                setPlayTime(playTime)
                clientUniEvent(
                  clickOnSynthesia,
                  "true",
                  user?.mandateId as string,
                  user?.email as string,
                )
              }}
              onPause={() => {
                const pauseTime = moment(new Date())
                let duration = moment.duration(pauseTime.diff(playtime))
                clientUniEvent(
                  screenSpentTimeSynthesia,
                  duration.asSeconds().toString(),
                  user?.mandateId as string,
                  user?.email as string,
                )
              }}
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
        </Box>
        <Box margin-top="var(--chakra-space-2)">
          <Text
            fontStyle="italic"
            fontWeight="400"
            fontSize="16px"
            lineHeight="120%"
            color="#aaa"
          >
            <span style={{ color: "#fff" }}>
              {" "}
              {t("portfolioOverviewVideos.disclaimer")}{" "}
            </span>
            {t("portfolioOverviewVideos.value", {
              createdDate: formatDate(createdDate, lang),
            })}
          </Text>
        </Box>
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
        submissionScreen={FeedbackSubmissionScreen.ClientSynthesiaVideo}
      />
    </Container>
  )
}

export default CRRSynthesisVideo
