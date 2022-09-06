import { Button, ButtonProps } from "@chakra-ui/button"
import { Box } from "@chakra-ui/layout"
import { Portal } from "@chakra-ui/portal"
import { useBreakpointValue } from "@chakra-ui/react"
import React from "react"

interface StepButtonProps extends ButtonProps {
  href?: string
}

function StepButton(props: React.PropsWithChildren<StepButtonProps>) {
  const { children, ...rest } = props
  const isMobileView = useBreakpointValue({ base: true, md: false })

  if (isMobileView) {
    return (
      <Portal>
        <Box
          as="footer"
          px="4"
          py="2"
          bg="gray.800"
          w="full"
          alignItems="center"
          position="fixed"
          bottom="0"
          zIndex="modal"
        >
          <Button colorScheme="primary" isFullWidth={isMobileView} {...rest}>
            {children}
          </Button>
        </Box>
      </Portal>
    )
  }

  return (
    <Button
      colorScheme="primary"
      mt={{ base: "8", md: "12" }}
      maxWidth="120px"
      {...rest}
    >
      {children}
    </Button>
  )
}

export default StepButton
