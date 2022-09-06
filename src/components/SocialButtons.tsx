import { Box } from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/react"
import ky from "ky"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import {
  AppleSocialIcon,
  GoogleSocialIcon,
  LinkedInSocialIcon,
  TwitterSocialIcon,
} from "~/components"
import {
  AppleLoginEvent,
  AppleSignupEvent,
  googleLoginEvent,
  googleSignupEvent,
  linkedInLoginEvent,
  linkedInSignupEvent,
  twitterLoginEvent,
  twitterSignupEvent,
} from "~/utils/googleEvents"
import { event } from "~/utils/gtag"

const googleConnection = "google-oauth2"
const twitterConnection = "twitter"
const linkedinConnection = "linkedin"
const appleConnection = "apple"
const SocialButtons = (props: { noAppleLogo?: boolean }) => {
  const router = useRouter()
  const isMobileView = useBreakpointValue({
    base: true,
    md: false,
    lg: false,
  })
  const isTabletView = useBreakpointValue({
    base: false,
    md: true,
    lg: false,
  })

  const socialConfigs = [
    {
      Icon: AppleSocialIcon,
      connection: appleConnection,
      ariaLabel: "Apple Social Button",
      disabled: false,
    },
    {
      Icon: GoogleSocialIcon,
      connection: googleConnection,
      ariaLabel: "Google Social Button",
      disabled: false,
    },
    {
      Icon: TwitterSocialIcon,
      connection: twitterConnection,
      ariaLabel: "Twitter Social Button",
      disabled: false,
    },
    {
      Icon: LinkedInSocialIcon,
      connection: linkedinConnection,
      ariaLabel: "linkedin Social Button",
      disabled: false,
    },
  ]

  const [filteredSocialConfigs, setFilteredSocialConfigs] =
    useState(socialConfigs)

  useEffect(() => {
    if (props.noAppleLogo) {
      const filtered_socials = props.noAppleLogo
        ? socialConfigs.filter(
            (config) => config.connection !== appleConnection,
          )
        : socialConfigs
      setFilteredSocialConfigs(filtered_socials)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.noAppleLogo])

  return (
    <>
      {filteredSocialConfigs.map(
        ({ Icon, connection, ariaLabel, disabled }) => (
          <Box
            me={isMobileView || isTabletView ? "1" : "0"}
            as="button"
            w="10"
            aria-label={ariaLabel}
            key={connection}
            disabled={disabled}
            border="1px solid"
            borderColor="gray.700"
            borderRadius="full"
            height="10"
            _disabled={{
              opacity: "0.4",
              _hover: {
                cursor: "not-allowed",
              },
            }}
            onClick={async (e: React.MouseEvent) => {
              e.preventDefault()
              if (connection === googleConnection) {
                if (router.pathname === "/signup") {
                  event(googleSignupEvent)
                } else {
                  event(googleLoginEvent)
                }
              }

              if (connection === twitterConnection) {
                if (router.pathname === "/signup") {
                  event(twitterSignupEvent)
                } else {
                  event(twitterLoginEvent)
                }
              }
              if (connection === linkedinConnection) {
                if (router.pathname === "/signup") {
                  event(linkedInSignupEvent)
                } else {
                  event(linkedInLoginEvent)
                }
              }
              if (connection === appleConnection) {
                if (router.pathname === "/signup") {
                  event(AppleSignupEvent)
                } else {
                  event(AppleLoginEvent)
                }
              }
              const { query = {} } = router
              const originUrl = window.location.host + router.pathname
              const returnTo = (query.returnTo as string) ?? ""
              await ky
                .get(
                  `/api/auth/get-social-url?connection=${connection}&originUrl=${originUrl}&lang=${router.locale}&returnTo=${returnTo}`,
                )
                .json<{ url: string }>()
                .then(({ url }) => router.push(url))
            }}
          >
            <Icon w="6" h="6" />
          </Box>
        ),
      )}
    </>
  )
}

export default SocialButtons
