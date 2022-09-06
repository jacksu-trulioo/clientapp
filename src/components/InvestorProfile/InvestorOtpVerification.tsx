import { Center, Container, Divider, Flex, Text } from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/react"
import { motion } from "framer-motion"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { useUser } from "~/hooks/useUser"

import MobileVerification from "../OnboardingProfile/MobileVerification"
import InvesterProfileTitleBox from "./InvestorProfileTitleBox"

const InvestorOtpVerification = React.forwardRef<HTMLDivElement, unknown>(
  function InvestmentGoalQuestionOneForm(_props, _ref) {
    const { t } = useTranslation("proposal")
    const { user } = useUser()
    const isFullWidth = useBreakpointValue({ base: true, md: false })
    const isMobileView = useBreakpointValue({ base: true, md: false })
    const isTabletView = useBreakpointValue({
      base: false,
      md: true,
      lg: false,
    })

    const isDesktopView = useBreakpointValue({
      base: false,
      md: false,
      lg: true,
    })
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <Flex
          py={{ base: 2, md: 16 }}
          direction={{ base: "column", md: "row" }}
        >
          <InvesterProfileTitleBox
            heading={t("investorOtpVerification.heading")}
            infoHeading={t("investorOtpVerification.infoHeading")}
            infoDescription={t("investorOtpVerification.infoDescription")}
          />

          <Center px={{ base: 0, md: "64px" }} py={{ base: "32px", md: 0 }}>
            <Divider
              orientation={isFullWidth ? "horizontal" : "vertical"}
              {...(isDesktopView && {
                sx: {
                  position: "absolute",
                  top: "24",
                  bottom: "24",
                  height: "60%",
                },
              })}
              {...(isTabletView && {
                sx: {
                  position: "absolute",
                  top: "20",
                  bottom: "25",
                  height: "50%",
                },
              })}
            />
          </Center>

          <Container
            flex={isTabletView ? "2" : "1"}
            px="0"
            {...(isMobileView && { mb: "36" })}
            h="100vh"
          >
            <Text color="gray.500" fontSize={"md"}>
              {t(`profile:onboarding.subheading.1`, {
                mobileNumber: user?.profile?.phoneNumber?.slice(-4) || "",
              })}
            </Text>
            <MobileVerification isOldUser={true} isInvestorSection={true} />
          </Container>
        </Flex>
      </motion.div>
    )
  },
)

export default React.memo(InvestorOtpVerification)
