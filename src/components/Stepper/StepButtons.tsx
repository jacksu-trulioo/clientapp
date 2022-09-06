import { Button, ButtonProps } from "@chakra-ui/button"
import { Box, Stack } from "@chakra-ui/layout"
import { Portal } from "@chakra-ui/portal"
import { useBreakpointValue } from "@chakra-ui/react"
import { useRouter } from "next/router"
import React from "react"

export interface StepButton extends ButtonProps {
  href?: string
  text: string
  onClick?: () => void
}

interface StepButtonsProps {
  buttonsConfig: StepButton[]
}

function StepButtons(props: React.PropsWithChildren<StepButtonsProps>) {
  const { buttonsConfig, ...rest } = props
  const router = useRouter()
  const isMobileView = useBreakpointValue({ base: true, md: false })

  function handleClick(href: string | undefined) {
    if (href) {
      router.push(href)
    }
  }

  if (isMobileView) {
    return (
      <Portal>
        <Box
          as="footer"
          px="6"
          py="2"
          bg="gray.800"
          w="full"
          alignItems="center"
          position="fixed"
          bottom="0"
          zIndex="modal"
        >
          <Stack direction="column" spacing="2" {...rest}>
            {buttonsConfig.map((config) => (
              <Button
                key={config.text}
                colorScheme="primary"
                isFullWidth={isMobileView}
                {...(config?.href && {
                  onClick: () => handleClick(config.href),
                })}
                {...config}
              >
                {config.text}
              </Button>
            ))}
          </Stack>
        </Box>
      </Portal>
    )
  }

  return (
    <Stack direction="row" mt={{ base: "8", md: "12" }} {...rest}>
      {buttonsConfig.map((config) => (
        <Button
          key={config.text}
          colorScheme="primary"
          spacing="2"
          {...(config?.href && {
            onClick: () => handleClick(config.href),
          })}
          {...config}
        >
          {config.text}
        </Button>
      ))}
    </Stack>
  )
}

export default StepButtons
