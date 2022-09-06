import { IconButton, IconButtonProps, Portal } from "@chakra-ui/react"
import React from "react"

interface FabProps extends IconButtonProps {}

export const Fab = (props: React.PropsWithChildren<FabProps>) => {
  const { children } = props

  return (
    <Portal>
      <IconButton
        rounded="full"
        position="fixed"
        bottom="4"
        right="6"
        zIndex="popover"
        variant="solid"
        {...props}
      >
        {children}
      </IconButton>
    </Portal>
  )
}

export default Fab
