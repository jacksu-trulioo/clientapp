import { Box, Flex, FlexProps, Stack } from "@chakra-ui/layout"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { Logo } from "~/components"

interface ModalHeaderProps extends FlexProps {
  headerLeft?: React.ReactNode
  headerRight?: React.ReactNode
  subheader?: React.ReactNode
}

const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  function ModalHeader(props, ref) {
    const { lang } = useTranslation("common")

    let fixedSubHeader = false

    const { children, headerLeft, headerRight, subheader, ...rest } = props

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
          h="56px"
          alignItems="center"
          justifyContent="space-between"
          {...rest}
        >
          <Stack isInline alignItems="center" spacing="2">
            <Logo
              height="28px"
              _focus={{ boxShadow: "none", outline: "none" }}
              cursor="pointer"
              onClick={() => {
                window.open(
                  lang.includes("en")
                    ? "https://www.tfoco.com/en"
                    : "https://www.tfoco.com/ar",
                )
              }}
            />
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
