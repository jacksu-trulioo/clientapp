import { Box, Flex, FlexProps, Stack } from "@chakra-ui/layout"
import { useRouter } from "next/router"
import React from "react"
import useSWR from "swr"

import { Logo, SaveAndExitButton } from "~/components"
import { Preference } from "~/services/mytfo/types"

interface ModalHeaderProps extends FlexProps {
  headerLeft?: React.ReactNode
  headerRight?: React.ReactNode
  subheader?: React.ReactNode
  showExitModalOnLogo?: boolean
}

const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  function ModalHeader(props, ref) {
    const { data: preferredLanguage } = useSWR<Preference>(
      "/api/user/preference",
    )
    const { push, reload } = useRouter()
    const router = useRouter()

    let fixedSubHeader = false

    if (
      router.pathname === "/portfolio/simulator" ||
      router.pathname === "/personalized-proposal"
    ) {
      fixedSubHeader = true
    }

    const handleSaveAndExit = React.useCallback(async () => {
      if (sessionStorage.getItem("initiator")) {
        sessionStorage.removeItem("initiator")
      }

      const path = preferredLanguage?.language === "AR" ? "/ar" : "/"
      await push(path)
      if (preferredLanguage?.language === "AR") {
        reload()
      }
    }, [preferredLanguage, push, reload])
    const {
      children,
      headerLeft,
      headerRight,
      subheader,
      showExitModalOnLogo,
      ...rest
    } = props

    return (
      <Box
        as="header"
        ref={ref}
        pos={fixedSubHeader ? "fixed" : "relative"}
        {...(fixedSubHeader && { top: 0 })}
        zIndex="modal"
        w="full"
        bg="gray.800"
      >
        <Flex
          px="4"
          pe={{ base: "0" }}
          h="56px"
          alignItems="center"
          justifyContent="space-between"
          {...rest}
        >
          <Stack isInline alignItems="center" spacing="2">
            {showExitModalOnLogo ? (
              <SaveAndExitButton
                onSave={handleSaveAndExit}
                showExitModalOnLogo={!!showExitModalOnLogo}
              />
            ) : (
              <Logo
                height="28px"
                _hover={{ cursor: "pointer" }}
                onClick={handleSaveAndExit}
              />
            )}
            {headerLeft}
          </Stack>

          {headerRight}

          {children}
        </Flex>

        {subheader}
      </Box>
    )
  },
)

export default React.memo(ModalHeader)
