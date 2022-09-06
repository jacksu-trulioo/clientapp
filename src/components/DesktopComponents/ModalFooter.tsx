import { Flex, FlexProps, useBreakpointValue } from "@chakra-ui/react"
import React from "react"

import { GetHelpAction, GetHelpClientAction } from "~/components"

interface ModalFooterProps extends FlexProps {
  popover?: string | React.ReactNode
  popoverHeader?: string | React.ReactNode
  showScheduleCall?: boolean
  showCallAction?: boolean
  showClientCallAction?: boolean
}

const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  function ModalFooter(props, ref) {
    const {
      children,
      popover,
      popoverHeader,
      showScheduleCall = false,
      showClientCallAction,
      showCallAction,
      ...rest
    } = props
    const isMobileView = useBreakpointValue({ base: true, md: false })
    const isDesktopView = !isMobileView

    return (
      <Flex
        pos="fixed"
        bottom="0"
        ref={ref}
        as="footer"
        px="4"
        py="4"
        bg="gray.800"
        w="full"
        justifyContent="space-between"
        alignItems="center"
        zIndex="modal"
        {...rest}
      >
        {isDesktopView && showCallAction && (
          <GetHelpAction
            popover={popover}
            popoverHeader={popoverHeader}
            showScheduleCall={showScheduleCall}
          />
        )}
        {showClientCallAction && <GetHelpClientAction />}

        {children}
      </Flex>
    )
  },
)

export default React.memo(ModalFooter)
