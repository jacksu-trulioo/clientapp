import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Image,
  Link,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  OrderedList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Show,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import ky from "ky"
import NextImage from "next/image"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { useState } from "react"
import useSWR, { mutate } from "swr"

import {
  BackgroundImageContainer,
  ClientHeader,
  ClientSidebar,
  InvestmentCartIcon,
  Seo,
  ShareInviteModal,
  VideoPlayer,
} from "~/components"
import useStore from "~/hooks/useStore"
import { useUser } from "~/hooks/useUser"
import { InvestmentCartDealDetails } from "~/services/mytfo/clientTypes"
import { PopupDetailRoot } from "~/services/mytfo/types"
import { getInsightTypeTag } from "~/utils/clientUtils/globalUtilities"
import {
  clickInvestmentCart,
  referralLink,
  tapImageVideoOfDeal,
} from "~/utils/googleEventsClient"
import { clientEvent, clientUniEvent } from "~/utils/gtag"

import Footer from "./Footer"
import PageContainer from "./PageContainer"

type LayoutProps = {
  title: string
  description: string
  footerRequired?: boolean
  heroImage?: string
  heroVideo?: string
  isHideInvmestmentCart?: boolean
  opportunityName?: string
  archiveType?: string
}

export function Layout(props: React.PropsWithChildren<LayoutProps>) {
  const { t, lang } = useTranslation("common")
  const { user } = useUser()
  const [isReferModalOpen, setReferMdalOpen] = useState(false)
  const {
    children,
    title,
    description,
    opportunityName,
    footerRequired,
    heroImage,
    heroVideo,
    isHideInvmestmentCart,
    archiveType,
  } = props
  const [isDrawerOpen, showBackButton] = useStore((state) => [
    state.isDrawerOpen,
    state.showBackButton,
  ])

  let canGetPopUp = false
  if (isHideInvmestmentCart == false) {
    canGetPopUp = true
  } else {
    canGetPopUp = false
  }

  const isMobileView = useBreakpointValue({
    base: true,
    md: true,
    lgp: false,
    xl: false,
  })

  const modalSize = useBreakpointValue({ base: "sm", md: "3xl" })
  const isDesktopView = !isMobileView
  const { isOpen, onClose, onOpen } = useDisclosure()

  const { data: investmentCartCount } = useSWR<InvestmentCartDealDetails[]>(
    `/api/client/deals/investment-cart`,
  )

  const { data: popUps } = useSWR<PopupDetailRoot>(
    canGetPopUp ? null : "/api/client/deals/popup-details",
  )

  const updatePopUpFlag = async (popUpName: string, flag: boolean) => {
    try {
      var popUpData = popUps?.popupDetails.find(({ popupName }) => {
        return popupName == popUpName
      })
      if (!popUpData?.flag) {
        await ky.post("/api/client/deals/popup-details", {
          json: {
            updatePopupDetailsList: [
              {
                popupId: popUpData?.popupId,
                flag,
                popupName: popUpName,
              },
            ],
          },
        })
        await mutate(`/api/client/deals/popup-details`)
      }
    } catch (error) {}
  }

  return (
    <>
      <Seo title={title} description={description} />

      <BackgroundImageContainer h="100vh">
        <ClientSidebar
          sidebarType="Client"
          onInviteClick={() => {
            setReferMdalOpen(true)
          }}
        />
        <Box
          h="100%"
          transition="padding 300ms cubic-bezier(0.2, 0, 0, 1) 0s"
          {...(isDesktopView && { ps: isDrawerOpen ? "256px" : 16 })}
        >
          <Box
            h="100%"
            overflowY="auto"
            overflowX="hidden"
            w="100%"
            id="scrollTop"
          >
            {isDesktopView && (
              <ClientHeader
                onInviteClick={() => {
                  clientEvent(
                    referralLink,
                    "true",
                    "Link Generated",
                    user?.mandateId as string,
                    user?.email as string,
                  )
                  setReferMdalOpen(true)
                }}
                ms={isDrawerOpen ? "256px" : 16}
              />
            )}

            {heroImage && (
              <Box
                mt={{ base: showBackButton ? "24" : "14", md: "14" }}
                __css={{
                  "& div": {
                    width: "100%",
                  },
                }}
                position="relative"
                justifyContent="center"
              >
                {!isHideInvmestmentCart ? (
                  <Show above="lgp">
                    <Popover
                      returnFocusOnClose={false}
                      isOpen={
                        popUps?.popupDetails?.length &&
                        popUps?.popupDetails?.find(({ popupName }) => {
                          return popupName == "OPPORTUNITIES_ADD_TO_CART"
                        })?.flag
                          ? !popUps?.popupDetails?.find(({ popupName }) => {
                              return (
                                popupName == "OPPORTUNITIES_INVESTMENT_CART"
                              )
                            })?.flag
                            ? true
                            : false
                          : false
                      }
                      onClose={() =>
                        updatePopUpFlag("OPPORTUNITIES_INVESTMENT_CART", true)
                      }
                      placement={"bottom-end"}
                      closeOnBlur={false}
                    >
                      <PopoverTrigger>
                        <Flex
                          display={{ base: "none", md: "block", lgp: "flex" }}
                          p="15px 40px"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          {opportunityName && (
                            <Breadcrumb
                              fontSize="12px"
                              d={{ base: "none", md: "block", lgp: "block" }}
                            >
                              <BreadcrumbItem>
                                <BreadcrumbLink
                                  color="primary.500"
                                  href="./"
                                  _focus={{ boxShadow: "none" }}
                                  fontSize="12px"
                                >
                                  {t("nav.links.opportunities")}{" "}
                                </BreadcrumbLink>
                              </BreadcrumbItem>
                              <BreadcrumbItem isCurrentPage>
                                <BreadcrumbLink
                                  fontSize="12px"
                                  dir="ltr"
                                  fontFamily="'Gotham'"
                                  _hover={{ textDecoration: "none" }}
                                  cursor="default"
                                >
                                  {opportunityName}
                                </BreadcrumbLink>
                              </BreadcrumbItem>
                            </Breadcrumb>
                          )}

                          <Text
                            aria-label="Investment Cart"
                            role={"button"}
                            display={{ base: "none", md: "block" }}
                            fontSize="16px"
                            fontWeight="500"
                            color="primary.500"
                            textAlign={{ base: "right", md: "right" }}
                            cursor="pointer"
                            onClick={() => {
                              clientUniEvent(
                                clickInvestmentCart,
                                opportunityName as string,
                                user?.mandateId as string,
                                user?.email as string,
                              )
                              router.push("/client/subscription")
                            }}
                          >
                            <InvestmentCartIcon />{" "}
                            {t("client.investmentCart.title")}{" "}
                            {`(${investmentCartCount?.length || 0})`}
                          </Text>
                        </Flex>
                      </PopoverTrigger>
                      <PopoverContent
                        bg="gunmetal.500"
                        float={lang.includes("ar") ? "left" : "right"}
                        marginRight="15px"
                      >
                        <PopoverHeader
                          fontWeight="400"
                          fontSize="12px"
                          color="gray.400"
                        >
                          {t("client.userOnBoarding.viewCart.title")}
                        </PopoverHeader>
                        <PopoverArrow bg="gunmetal.500" border="0px" />
                        <PopoverCloseButton
                          style={{
                            right: lang.includes("en") ? "5px" : "inherit",
                            left: lang.includes("en") ? "inherit" : "5px",
                          }}
                        />
                        <PopoverBody
                          fontWeight="400"
                          fontSize="14px"
                          color="contrast.200"
                        >
                          {t("client.userOnBoarding.viewCart.description")}
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Show>
                ) : (
                  false
                )}
                {(heroImage && archiveType) || opportunityName ? (
                  <OrderedList
                    p="12px 24px"
                    mt={{ md: "95px", lgp: "0" }}
                    d={{
                      base: "none",
                      md: "block",
                      lgp: opportunityName ? "none" : "block",
                    }}
                  >
                    <ListItem display="inline-flex" alignItems="center">
                      <Link
                        onClick={() => {
                          archiveType
                            ? router.push("/client/insights/markets-archive")
                            : router.push("/client/opportunities")
                        }}
                        fontSize="12px"
                        color="primary.500"
                        _focus={{
                          boxShadow: "none",
                        }}
                      >
                        {archiveType
                          ? t("insights:tag.MarketArchive")
                          : t("nav.links.opportunities")}
                      </Link>
                      <Box as="span" marginInline="0.5rem">
                        /
                      </Box>
                    </ListItem>
                    <ListItem
                      display="inline-flex"
                      alignItems="center"
                      fontSize="12px"
                    >
                      {archiveType
                        ? t(`insights:tag.${getInsightTypeTag(archiveType)}`)
                        : opportunityName}
                    </ListItem>
                  </OrderedList>
                ) : (
                  ""
                )}

                <Flex pos="relative">
                  <NextImage
                    src={heroImage}
                    alt={"Hero Image"}
                    width={isDesktopView ? 1500 : 500}
                    height={260}
                    objectFit="cover"
                    onClick={() => {
                      clientUniEvent(
                        tapImageVideoOfDeal,
                        opportunityName as string,
                        user?.mandateId as string,
                        user?.email as string,
                      )
                    }}
                  />
                  {heroVideo ? (
                    <Image
                      onClick={() => {
                        clientUniEvent(
                          tapImageVideoOfDeal,
                          opportunityName as string,
                          user?.mandateId as string,
                          user?.email as string,
                        )
                        onOpen()
                      }}
                      position="absolute"
                      top="50%"
                      left="50%"
                      cursor="hover"
                      transform="translate(-50%, -50%)"
                      src={`/images/PlayIcon.svg`}
                      alt="Play Icon"
                    />
                  ) : (
                    false
                  )}
                </Flex>
              </Box>
            )}
            <PageContainer
              mt={{
                base: heroImage ? "5" : showBackButton ? "24" : "14",
                lgp: heroImage ? "5" : "14",
              }}
            >
              {children}
            </PageContainer>
            {footerRequired && <Footer />}
          </Box>
        </Box>
      </BackgroundImageContainer>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={modalSize}
        autoFocus={false}
        returnFocusOnClose={false}
        isCentered
      >
        <ModalOverlay backdropFilter={{ base: "none", md: "blur(8px)" }} />
        <ModalContent
          overflow={{ base: "initial", md: "hidden" }}
          borderRadius={{ base: "0", md: "md" }}
        >
          <ModalCloseButton zIndex="docked" />
          <ModalBody p="0">
            <VideoPlayer url={heroVideo} autoplay={true} />
          </ModalBody>
        </ModalContent>
      </Modal>
      {isReferModalOpen && (
        <ShareInviteModal
          isOpen={isReferModalOpen}
          onClose={() => {
            setReferMdalOpen(false)
          }}
        />
      )}
    </>
  )
}

export default Layout
