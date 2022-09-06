import { Container, ContainerProps } from "@chakra-ui/layout"
import {
  Portal,
  Progress,
  Spinner,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import { motion } from "framer-motion"
import React, { useEffect } from "react"

import { FeedbackModal } from "~/components"
import siteConfig from "~/config"
import { FeedbackSubmissionScreen } from "~/services/mytfo/types"
import { setFeedbackCookieStatus } from "~/utils/clientUtils/feedbackCookieUtilities"

interface PageContainerProps extends ContainerProps {
  isLoading?: boolean
}

const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  function PageContainer(props, ref) {
    const { children, isLoading, ...rest } = props
    const {
      isOpen: isFeedbackModalOpen,
      onOpen: onFeedbackModalOpen,
      onClose: onFeedbackModalClose,
    } = useDisclosure()

    const isMobileView = useBreakpointValue({ base: true, md: false })

    useEffect(() => {
      if (
        sessionStorage.getItem("showFeedbackModalForAAScreen") == "true" &&
        !isLoading
      ) {
        sessionStorage.removeItem("showFeedbackModalForAAScreen")
        onFeedbackModalOpen()
      }
    }, [isLoading])

    return (
      <Container
        pos="relative"
        p={{ base: "15px", md: "20px 40px", lgp: "20px 40px", xl: "20px 40px" }}
        flex="1"
        maxW="full"
        ref={ref}
        {...rest}
      >
        <motion.div
          style={{ height: "auto" }}
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {isFeedbackModalOpen ? (
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
              submissionScreen={FeedbackSubmissionScreen.ClientAssetAllocation}
            />
          ) : (
            children
          )}
        </motion.div>

        {isLoading && (
          <Portal>
            <Progress
              size="xs"
              isIndeterminate
              pos="fixed"
              left="0"
              top="0"
              right="0"
              zIndex="overlay"
            />
            <Spinner
              aria-label="spinner"
              thickness="8px"
              speed="0.65s"
              emptyColor="gray.700"
              color="primary.500"
              size="xl"
              zIndex="tooltip"
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              {...(isMobileView && { marginLeft: "-40px" })}
              height="80px"
              width="80px"
            />
          </Portal>
        )}
      </Container>
    )
  },
)

export default PageContainer
