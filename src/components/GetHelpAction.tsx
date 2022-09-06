import { useDisclosure } from "@chakra-ui/hooks"
import {
  Box,
  Button,
  Circle,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  StackProps,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import { ChatIcon, GetSupportPopUp, QuestionIcon } from "~/components"
import { RelationshipManager } from "~/services/mytfo/types"

interface GetHelpActionProps extends StackProps {
  popover?: string | React.ReactNode
  popoverHeader?: string | React.ReactNode
  showScheduleCall?: boolean
}

function GetHelpAction(props: GetHelpActionProps) {
  const { popover, popoverHeader, showScheduleCall, ...rest } = props
  const { t, lang } = useTranslation("common")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isPopupOpen,
    onOpen: onPopupOpen,
    onClose: onPopupClose,
  } = useDisclosure()

  const [closePopover, setClosePopover] = React.useState(false)
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isDesktopView = !isMobileView
  const router = useRouter()

  const { data: rmData, error: rmError } = useSWR<RelationshipManager>(
    "/api/user/relationship-manager",
  )

  const isLoading = !rmData && !rmError
  const isRmAssigned = !isLoading && rmData?.assigned

  const onGetSupportClick = () => {
    if (
      router.pathname.includes("simulator") ||
      router.pathname.includes("opportunities") ||
      router.pathname.includes("proposal") ||
      router.pathname.includes("kyc")
    ) {
      onPopupOpen()
    } else {
      router.push("/support")
    }
  }

  React.useEffect(() => {
    setClosePopover(false)
  }, [showScheduleCall])

  const shouldPopoverOpen = () => {
    if (closePopover) {
      return false
    }
    return showScheduleCall || isOpen
  }

  return (
    <HStack {...rest} zIndex="1">
      {popover ? (
        <Popover
          isOpen={shouldPopoverOpen()}
          onOpen={onOpen}
          onClose={onClose}
          closeOnBlur={true}
          placement="top-start"
          autoFocus={false}
          returnFocusOnClose={false}
        >
          <PopoverTrigger>
            {isDesktopView ? (
              <Circle size="10" bgColor="primary.700WithOpacity">
                {isRmAssigned ? (
                  <ChatIcon w="5" h="5" color="primary.500" />
                ) : (
                  <QuestionIcon w="5" h="5" color="primary.500" />
                )}
              </Circle>
            ) : (
              <Circle size="0" bgColor="gray.850" ml="-4"></Circle>
            )}
          </PopoverTrigger>
          <PopoverContent
            bgColor="gunmetal.500"
            maxW={isMobileView ? "full" : "268px"}
            {...(isMobileView && { mb: 8, ml: 2 })}
            pos="relative"
            w={screen.width - 20}
          >
            <PopoverArrow bgColor="gunmetal.500" />
            <PopoverCloseButton
              {...(lang === "ar" && { left: "calc(100% - 28px) " })}
              onClick={() => setClosePopover(true)}
            />
            {popoverHeader && (
              <PopoverHeader border="none">{popoverHeader}</PopoverHeader>
            )}
            <PopoverBody>{popover}</PopoverBody>
          </PopoverContent>
        </Popover>
      ) : (
        isDesktopView && (
          <Circle size="10" bgColor="primary.700WithOpacity">
            {isRmAssigned ? (
              <ChatIcon w="5" h="5" color="primary.500" />
            ) : (
              <QuestionIcon w="5" h="5" color="primary.500" />
            )}
          </Circle>
        )
      )}

      <Box fontSize="sm" ps="2">
        <Text>
          {isRmAssigned ? t("help.rmAssignedHeading") : t("help.heading")}
        </Text>
        <GetSupportPopUp isOpen={isPopupOpen} onClose={onPopupClose} />
        <Button
          border="none"
          colorScheme="primary"
          variant="link"
          size="sm"
          onClick={onGetSupportClick}
        >
          {rmData?.manager
            ? `${t("help.contact")} ${rmData?.manager?.firstName} ${
                rmData?.manager?.lastName
              }`
            : t("help.link.support")}
        </Button>
      </Box>
    </HStack>
  )
}

export default React.memo(GetHelpAction)
