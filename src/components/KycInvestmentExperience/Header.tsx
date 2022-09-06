import {
  Box,
  Button,
  Circle,
  Divider,
  Flex,
  Progress,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React, { useMemo } from "react"
import useSWR from "swr"

import {
  ChatIcon,
  ModalHeader,
  QuestionIcon,
  SaveAndExitButton,
} from "~/components"
import { RelationshipManager } from "~/services/mytfo/types"

import { useKycInvestmentExperienceWizard } from "./KycInvestmentExperienceContext"

type Props = {
  onExit?: () => void
  headerLeft?: React.ReactNode
  onOpenSupport?: () => void
}

const Header: React.VFC<Props> = ({ onExit, headerLeft, onOpenSupport }) => {
  const { t } = useTranslation("common")
  const { isFirst, numberOfSteps, step } = useKycInvestmentExperienceWizard()
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isDesktopView = !isMobileView
  const { data: rmData, error: rmError } = useSWR<RelationshipManager>(
    "/api/user/relationship-manager",
  )

  const isLoading = !rmData && !rmError
  const isRmAssigned = !isLoading && rmData?.assigned

  const headerRight = useMemo(() => {
    if (isFirst) {
      return (
        <>
          {isMobileView && (
            <>
              <Flex flex="1" />
              <Circle
                me="1"
                size="10"
                bgColor="gray.800"
                onClick={onOpenSupport}
              >
                {isRmAssigned ? (
                  <ChatIcon w="5" h="5" color="primary.500" />
                ) : (
                  <QuestionIcon w="5" h="5" color="primary.500" />
                )}
              </Circle>
              <Flex py="18px" h="full">
                <Divider color="gray.500" orientation="vertical" />
              </Flex>
            </>
          )}
          <Button colorScheme="primary" variant="ghost" onClick={onExit}>
            {isFirst ? t("button.exit") : t("button.saveAndExit")}
          </Button>
        </>
      )
    }

    return (
      <>
        {isMobileView && (
          <>
            <Flex flex="1" />
            <Circle me="1" size="10" bgColor="gray.800" onClick={onOpenSupport}>
              {isRmAssigned ? (
                <ChatIcon w="5" h="5" color="primary.500" />
              ) : (
                <QuestionIcon w="5" h="5" color="primary.500" />
              )}
            </Circle>
            <Flex py="18px" h="full">
              <Divider color="gray.500" orientation="vertical" />
            </Flex>
          </>
        )}
        <SaveAndExitButton onSaveButtonProps={{ onClick: onExit }} />
      </>
    )
  }, [isFirst, onExit, t])

  return (
    <ModalHeader
      boxShadow="wizardHeader"
      headerRight={headerRight}
      showExitModalOnLogo={true}
      {...(isDesktopView && {
        headerLeft: (
          <Stack isInline ps="6" spacing="6" alignItems="center">
            <Divider orientation="vertical" bgColor="white" height="28px" />
            {headerLeft}
          </Stack>
        ),
      })}
      subheader={
        <>
          {isMobileView && (
            <Box h="10" px="1" py="2">
              {headerLeft}
            </Box>
          )}

          <Progress
            colorScheme="primary"
            size="xs"
            bgColor="gray.700"
            value={Math.floor(((step + 1) / (numberOfSteps + 1)) * 100)}
          />
        </>
      }
    />
  )
}

Header.displayName = "KycInvestmentExperienceHeader"

export default React.memo(Header)
