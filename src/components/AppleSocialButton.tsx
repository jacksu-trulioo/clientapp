import { Box, HStack, Text } from "@chakra-ui/layout"
import ky from "ky"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"

import { AppleSocialIcon } from "~/components"
import { AppleLoginEvent, AppleSignupEvent } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"

const appleConnection = "apple"
const AppleSocialButton = () => {
  const router = useRouter()
  const { t } = useTranslation("auth")
  const socialConfigs = [
    {
      Icon: AppleSocialIcon,
      connection: appleConnection,
      ariaLabel: "Apple Social Button",
      disabled: false,
    },
  ]

  return (
    <>
      {socialConfigs.map(({ Icon, connection, ariaLabel, disabled }) => (
        <Box
          as="button"
          w="full"
          mt={2}
          aria-label={ariaLabel}
          key={connection}
          disabled={disabled}
          border="2px solid"
          borderColor="gray.700"
          borderRadius="2px"
          height="12"
          onClick={async (e: React.MouseEvent) => {
            e.preventDefault()
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
          <HStack alignItems="center" justifyContent="center">
            <Icon w="8" h="8" />
            <Text fontWeight="bold">{t("signup.button.appleLogin")}</Text>
          </HStack>
        </Box>
      ))}
    </>
  )
}

export default AppleSocialButton
