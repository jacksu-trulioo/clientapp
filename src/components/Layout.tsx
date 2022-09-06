import { Box, Flex, useBreakpointValue, useDisclosure } from "@chakra-ui/react"
import ky from "ky"
import NextImage from "next/image"
import { useRouter } from "next/router"
import React, { RefObject } from "react"
import useSWR, { mutate } from "swr"

import {
  BackgroundImageContainer,
  Header,
  PlayTriangleIcon,
  Seo,
  ShareInviteModal,
  Sidebar,
  VerifyPhoneNotification,
} from "~/components"
import useStore from "~/hooks/useStore"
import { PortfolioSummary, ProposalsStatus } from "~/services/mytfo/types"

import Footer from "./Footer"
import ModifiedProposalByRmNotification from "./ModifiedProposalByRmNotification"
import PageContainer from "./PageContainer"

type LayoutProps = {
  title: string
  description: string
  footerRequired?: boolean
  heroImage?: string
  understood?: boolean
  supportRef?: RefObject<HTMLDivElement | undefined>
  isPlayable?: boolean
  playVideo?: () => {}
}

export function Layout(props: React.PropsWithChildren<LayoutProps>) {
  const {
    children,
    title,
    description,
    footerRequired = true,
    heroImage,
    understood,
    isPlayable = false,
    playVideo,
  } = props
  const [isDrawerOpen, showBackButton] = useStore((state) => [
    state.isDrawerOpen,
    state.showBackButton,
  ])
  const { asPath } = useRouter()
  const isRouteDashboard = asPath === "/"

  const { data: proposalStatusData, error: proposalStatusError } =
    useSWR<ProposalsStatus>("/api/user/proposals/status")

  const { data: portfolioSummaryData } =
    useSWR<PortfolioSummary>("/api/user/summary")

  // https://github.com/chakra-ui/chakra-ui/issues/2827
  // useMediaQuery does not work with SSR initial render, so replacing it with useBreakpointValue
  const [playvideoIndex, setPlayVideoIndex] = React.useState<string | number>(
    "modal",
  )
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [isVerifyPhoneModalOpen, setVerifyPhoneModalState] =
    React.useState<boolean>(false)
  const scroller = () => {
    if (window?.scrollY === 0) setPlayVideoIndex("modal")
    else setPlayVideoIndex(0)
  }

  React.useEffect(() => {
    if (isPlayable && typeof window !== "undefined") {
      window?.addEventListener("scroll", scroller)
    }

    return () => {
      window?.removeEventListener("scroll", scroller)
    }
  }, [isPlayable])

  React.useEffect(() => {
    const verifyModalState =
      typeof window !== "undefined" &&
      sessionStorage.getItem("isVerifyPhoneModalOpen") === "false"
        ? false
        : true
    if (verifyModalState !== isVerifyPhoneModalOpen) {
      setVerifyPhoneModalState(verifyModalState)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isDesktopView = useBreakpointValue({ base: false, md: false, lg: true })

  const imageRef = React.useRef(null)

  const hideNotification = async () => {
    await ky.patch("/api/user/contact/proposal-reviewed")

    await mutate("/api/user/contact/proposal-reviewed")
  }

  return (
    <>
      <Seo title={title} description={description} />

      <BackgroundImageContainer display="flex" minH="100vh">
        <Sidebar understood={understood} onInviteClick={onOpen} />
        <Box
          display="flex"
          flexDirection="column"
          flex="1"
          minW="0"
          transition="margin 300ms cubic-bezier(0.2, 0, 0, 1) 0s"
          {...(isDesktopView && { ms: isDrawerOpen ? "256px" : 16 })}
        >
          {isDesktopView && (
            <Header
              ms={isDrawerOpen ? "256px" : 16}
              understood={understood}
              onInviteClick={onOpen}
            />
          )}
          {isVerifyPhoneModalOpen && isRouteDashboard && (
            <VerifyPhoneNotification
              {...(isDesktopView && { ms: isDrawerOpen ? "256px" : 16 })}
              mt={14}
              onCloseClick={() => {
                setVerifyPhoneModalState(false)
                sessionStorage.setItem("isVerifyPhoneModalOpen", "false")
              }}
            />
          )}

          {!proposalStatusError &&
            proposalStatusData &&
            proposalStatusData.modifiedByRm &&
            portfolioSummaryData &&
            !portfolioSummaryData?.proposalReviewed && (
              <ModifiedProposalByRmNotification
                {...(isDesktopView && { ms: isDrawerOpen ? "256px" : 16 })}
                mt={14}
                onCloseClick={() => {
                  hideNotification()
                }}
              />
            )}

          {heroImage && (
            <Box
              position="relative"
              ref={imageRef}
              mt={{ base: showBackButton ? "24" : "14", md: "14" }}
              __css={{
                "& div": {
                  width: "100%",
                },
              }}
            >
              <Box position="absolute" top="0" left="0" w="full" h="full">
                <Flex justifyContent="center" alignItems="center" h="full">
                  {isPlayable && (
                    <PlayTriangleIcon
                      w={16}
                      h={16}
                      zIndex={playvideoIndex}
                      cursor="pointer"
                      onClick={playVideo}
                    />
                  )}
                </Flex>
              </Box>

              <NextImage
                src={heroImage}
                alt={"Hero Image"}
                width={isDesktopView ? 1500 : 500}
                height={260}
                objectFit="cover"
              />
            </Box>
          )}

          <PageContainer
            mt={{
              base: heroImage
                ? "5"
                : showBackButton || isVerifyPhoneModalOpen
                ? "24"
                : "14",
              lg: heroImage ? "5" : "14",
            }}
          >
            {children}
          </PageContainer>

          {footerRequired && <Footer understood={understood} />}
        </Box>
      </BackgroundImageContainer>
      {isOpen && <ShareInviteModal isOpen={isOpen} onClose={onClose} />}
    </>
  )
}

export default Layout
