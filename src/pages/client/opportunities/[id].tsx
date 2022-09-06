import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/accordion"
import { Button } from "@chakra-ui/button"
import {
  Box,
  Divider,
  Flex,
  Heading,
  ListItem,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/media-query"
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Skeleton,
} from "@chakra-ui/react"
import ky from "ky"
import moment from "moment"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useEffect, useState } from "react"
import useSWR, { mutate } from "swr"

import {
  AddIcon,
  ClientLayout,
  DownloadButton,
  InterestedIcon,
  InterestedwhiteIcon,
  IslamIcon,
  ModalBox,
  PageContainer,
  SimilarOpportunityCard,
  TickIcon,
} from "~/components"
import { useUser } from "~/hooks/useUser"
import { opportunityDetailsObj } from "~/services/mytfo/clientTypes"
import { DownloadDealSheetRes, PopupDetailRoot } from "~/services/mytfo/types"
import {
  addToInvestmentCart,
  readDealSheetTime,
  tapInterestInOpportunities,
  tapNotInterestInOpportunities,
} from "~/utils/googleEventsClient"
import { clientEvent, clientUniEvent } from "~/utils/gtag"
const PrintButton = dynamic(() => import("~/components/Print"), {
  ssr: false,
})

type updateOpportunities = {
  msg: string
}

type DealDetailsTpye = {
  opportunityId: number
}

type OpportunitySectionProps = {
  id: number | string
}

function DealDetails({ opportunityId }: DealDetailsTpye) {
  const router = useRouter()
  const { user } = useUser()
  const { t, lang } = useTranslation("opportunities")
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const [isOpenCart, setOpenCart] = useState(false)
  const [isInterestedModal, setIsInterestedModal] = useState(false)
  const modalSize = useBreakpointValue({ base: "xs", md: "xs" })
  const [isShowDownloadBtn, setIsShowDownloadBtn] = useState(false)
  const { data: opportunityDetails, error } = useSWR<opportunityDetailsObj>(
    `/api/client/deals/opportunities?opportunityId=${opportunityId}&langCode=${lang}`,
  )
  const { data: popUps } = useSWR<PopupDetailRoot>(
    `/api/client/deals/popup-details`,
  )

  const isLoading = !opportunityDetails && !error
  const [cartButtonLoading, setCartButtonLoading] = useState(false)
  const [InterestedButtonLoading, setInterestedButtonLoading] = useState(false)

  const breakdownList = [
    { label: "clientSponsor", value: opportunityDetails?.sponsor },
    { label: "assetClass", value: opportunityDetails?.assetClass },
    { label: "sector", value: opportunityDetails?.sector },
    {
      label: "clientExpectedExit",
      value: opportunityDetails?.expectedExitYear,
    },
    { label: "expectedReturn", value: opportunityDetails?.expectedReturn },
    { label: "country", value: opportunityDetails?.country },
  ]

  useEffect(() => {
    const openTime = moment(new Date())
    let opportunityName = opportunityDetails?.opportunityName as string
    return () => {
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        readDealSheetTime,
        opportunityName,
        duration.asSeconds().toString(),
        user?.mandateId as string,
        user?.email as string,
      )
    }
  }, [])

  const changeHandlerForInterested = async () => {
    setInterestedButtonLoading(true)
    let isinterestedValue = opportunityDetails?.isInterested == "Y" ? "O" : "Y"
    const reqBody = [
      {
        clientOpportunityId: opportunityDetails?.clientOpportunityId,
        opportunityId: opportunityDetails?.opportunityId,
        isInterested: isinterestedValue,
        isScheduled: opportunityDetails?.isScheduled,
        isSeen: opportunityDetails?.isSeen,
      },
    ]

    const updateOpportunities = await ky
      .patch("/api/client/deals/update-client-opportunities", {
        json: reqBody,
      })
      .json<updateOpportunities>()
    await mutate(
      `/api/client/deals/opportunities?opportunityId=${opportunityId}&langCode=${lang}`,
    )
    if (updateOpportunities.msg) {
      setInterestedButtonLoading(false)
      setIsInterestedModal(true)
      if (isinterestedValue == "Y") {
        clientUniEvent(
          tapInterestInOpportunities,
          opportunityDetails?.opportunityName as string,
          user?.mandateId as string,
          user?.email as string,
        )
      } else {
        clientUniEvent(
          tapNotInterestInOpportunities,
          opportunityDetails?.opportunityName as string,
          user?.mandateId as string,
          user?.email as string,
        )
      }
    }
  }

  const addToCart = async (isShariah?: boolean) => {
    setCartButtonLoading(true)
    const reqBody = [
      {
        clientOpportunityId: opportunityDetails?.clientOpportunityId,
        opportunityId: opportunityDetails?.opportunityId,
        isInterested: opportunityDetails?.isInterested,
        isScheduled: opportunityDetails?.isScheduled,
        isSeen: opportunityDetails?.isSeen,
        isAddedToCart: true,
        isInvestmentPreferenceShariah: isShariah,
      },
    ]

    await ky
      .patch("/api/client/deals/update-client-opportunities", {
        json: reqBody,
      })
      .json<updateOpportunities>()
    await mutate(
      `/api/client/deals/opportunities?opportunityId=${opportunityId}&langCode=${lang}`,
    )
    await mutate(`/api/client/deals/investment-cart`)
    setCartButtonLoading(false)
  }

  useEffect(() => {
    DownloadDealSheet("check")
  }, [router.asPath])

  const DownloadDealSheet = async (type: string) => {
    const response = await ky
      .post(`/api/client/documents/doc-center`, {
        json: {
          action: "downloadDealSheet",
          opportunityId: opportunityId,
        },
      })
      .json<DownloadDealSheetRes>()

    if (response?.isBlobExists) {
      if (type == "print") {
        window.open(response.url)
      } else if (type == "check") {
        setIsShowDownloadBtn(true)
      } else {
        var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
        if (iOS) {
          window.location.href = response.url
        } else {
          var a = document.createElement("a")
          a.href = response.url
          a.download = `${opportunityDetails?.opportunityName}.pdf`
          a.target = "_blank"
          a.click()
        }
      }
    } else {
      setIsShowDownloadBtn(false)
    }
  }

  const onInterestedModalClose = () => {
    setIsInterestedModal(false)
  }

  const handlePrimaryClick = () => {
    if (opportunityDetails?.isInterested == "Y") {
      router.push(
        `/client/schedule-meeting?opportunityId=${opportunityDetails?.opportunityId}`,
      )
    } else {
      setIsInterestedModal(false)
    }
  }

  const updatePopUpFlag = async (popUpName: string, flag: boolean) => {
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
  }

  return (
    <ClientLayout
      title={t("index.page.title")}
      description={t("index.page.description")}
      opportunityName={opportunityDetails?.opportunityName}
      heroImage={
        opportunityDetails?.opportunityImageUrl
          ? `${opportunityDetails?.opportunityImageUrl}`
          : ""
      }
      heroVideo={
        opportunityDetails?.opportunityVideoUrl
          ? `${opportunityDetails?.opportunityVideoUrl}`
          : undefined
      }
    >
      {!opportunityDetails && !isLoading ? (
        <ModalBox
          isOpen={true}
          modalDescription={t("common:client.errors.noDate.description")}
          modalTitle={t("common:client.errors.noDate.title")}
          primaryButtonText={t("common:client.errors.noDate.button")}
          onClose={() => {
            router.push("/client/opportunities")
          }}
          onPrimaryClick={() => {
            router.push("/client/opportunities")
          }}
        />
      ) : (
        <PageContainer
          isLoading={isLoading}
          as="section"
          maxW="full"
          px="0"
          mt={{ base: 0, md: 8, lgp: 0 }}
          filter={isLoading ? "blur(3px)" : "none"}
        >
          {isLoading ? (
            <Skeleton flex="1" mb="25px" mt="20px" />
          ) : (
            <Fragment>
              <Stack
                direction={{ base: "column", md: "row" }}
                mb={{ base: "16px", md: "21px", lgp: "24px" }}
              >
                <Heading
                  aria-label="opportunityTitle"
                  fontSize={{ base: "26px", md: "30px", lgp: "30px" }}
                  mb={{ base: "15px", md: "0", lgp: "0" }}
                  fontWeight="400"
                  dir="ltr"
                  fontFamily="'Gotham'"
                  textAlign={lang.includes("en") ? "start" : "end"}
                >
                  {opportunityDetails?.opportunityName}
                </Heading>
                <Flex alignItems="center">
                  {opportunityDetails?.isShariah ? (
                    <Box
                      fontSize={{ base: "16px", md: "16px", lgp: "14px" }}
                      h="32px"
                      color="gray.900"
                      backgroundColor="secondary.500"
                      borderRadius="full"
                      alignSelf={{ base: "flex-start", md: "center" }}
                      paddingInlineStart="var(--chakra-space-4)"
                      paddingInlineEnd="var(--chakra-space-4)"
                      mr={{ base: "10px", md: "0" }}
                      lineHeight="30px"
                    >
                      <IslamIcon me="1" w="3" h="3" color="gray.900" />
                      <Text
                        aria-label="opportunityIsShariahCompliant"
                        as="span"
                      >
                        {t("index.card.tag.shariah")}
                      </Text>
                    </Box>
                  ) : (
                    ""
                  )}
                  {opportunityDetails?.isInterested == "Y" ? (
                    <Box
                      fontSize={{ base: "16px", md: "16px", lgp: "14px" }}
                      h="32px"
                      color="gray.900"
                      backgroundColor="gray.800"
                      borderRadius="full"
                      alignSelf={{ base: "flex-start", md: "center" }}
                      paddingInlineStart="var(--chakra-space-4)"
                      paddingInlineEnd="var(--chakra-space-4)"
                      m={{
                        base: "0px 10px 15px 0px!important",
                        md: "0 16px !important",
                      }}
                      lineHeight="30px"
                      display="flex"
                      alignItems="center"
                    >
                      <InterestedwhiteIcon me="8px" w="3" h="3" color="white" />
                      <Text
                        aria-label="opportunityIsShariahCompliant"
                        as="span"
                        color="white"
                      >
                        {t(`client.interested.title`)}
                      </Text>
                    </Box>
                  ) : (
                    false
                  )}
                </Flex>
              </Stack>
              <Stack direction={{ base: "column", md: "row" }} mb="16px">
                <Text
                  aria-label="opportunityDescription"
                  fontSize="18px"
                  color="gray.500"
                  fontWeight="400"
                  pr={{ base: "0", md: "15px", lgp: "130px" }}
                >
                  {opportunityDetails?.about}
                </Text>
                <Spacer />
                <Flex
                  aria-label="Order Management"
                  role={"button"}
                  justifyContent={{
                    base: "space-around",
                    md: "flex-end",
                    lgp: "flex-end",
                  }}
                  position={{ base: "initial", md: "relative" }}
                  w="100%"
                  overflow={{
                    base: "hidden",
                    sm: "hidden",
                    md: "inherit",
                    lgp: "inherit",
                  }}
                  p={{
                    base: "0 0 0 0",
                    sm: "0 0 0 0",
                    md: "0",
                    lgp: "0",
                  }}
                >
                  <Button
                    width={{ lgp: "169px", base: "48%" }}
                    variant={
                      opportunityDetails?.isInterested == "Y"
                        ? undefined
                        : "outline"
                    }
                    colorScheme="primary"
                    flexShrink={0}
                    alignSelf="flex-start"
                    fontSize={{ base: "14px", md: "16px" }}
                    leftIcon={
                      opportunityDetails?.isInterested == "Y" ? (
                        <TickIcon />
                      ) : (
                        <InterestedIcon />
                      )
                    }
                    isLoading={InterestedButtonLoading}
                    className={"addToCartBtn"}
                    mr={{ base: "0", md: "16px", lgp: "16px" }}
                    onClick={() => changeHandlerForInterested()}
                  >
                    {t(`client.interested.title`)}
                  </Button>

                  <Popover
                    returnFocusOnClose={false}
                    isOpen={
                      popUps?.popupDetails?.length
                        ? !popUps?.popupDetails?.find(({ popupName }) => {
                            return popupName == "OPPORTUNITIES_ADD_TO_CART"
                          })?.flag
                          ? true
                          : false
                        : false
                    }
                    onClose={() =>
                      updatePopUpFlag("OPPORTUNITIES_ADD_TO_CART", true)
                    }
                    placement={"top-end"}
                    closeOnBlur={false}
                  >
                    <PopoverTrigger>
                      {!opportunityDetails?.isAddedToCart ? (
                        <Button
                          width={{ lgp: "169px", base: "48%" }}
                          variant="outline"
                          colorScheme="primary"
                          fontSize={{ base: "14px", md: "16px" }}
                          flexShrink={0}
                          alignSelf="flex-start"
                          position="relative"
                          isLoading={cartButtonLoading}
                          onClick={() => {
                            clientUniEvent(
                              addToInvestmentCart,
                              opportunityDetails?.opportunityName as string,
                              user?.mandateId as string,
                              user?.email as string,
                            )
                            updatePopUpFlag("OPPORTUNITIES_ADD_TO_CART", true)
                            if (
                              opportunityDetails?.isShariah ||
                              opportunityDetails?.isProgram
                            ) {
                              setOpenCart(true)
                            } else {
                              addToCart()
                            }
                          }}
                          leftIcon={<AddIcon />}
                          className="addToCartBtn"
                        >
                          {t(`client.button.addToCart`)}
                        </Button>
                      ) : (
                        <Button
                          px={{ base: "2px", md: "4" }}
                          width={{ lgp: "169px", base: "48%" }}
                          colorScheme="primary"
                          flexShrink={0}
                          alignSelf="flex-start"
                          whiteSpace={isMobileView ? "normal" : "nowrap"}
                          leftIcon={<TickIcon />}
                          className="addToCartBtn"
                          fontSize={{ base: "14px", md: "16px" }}
                          onClick={() => {
                            updatePopUpFlag("OPPORTUNITIES_ADD_TO_CART", true)
                          }}
                        >
                          {t(`client.button.addedToCart`)}
                        </Button>
                      )}
                    </PopoverTrigger>
                    <PopoverContent bg="gunmetal.500">
                      <PopoverHeader
                        fontWeight="400"
                        fontSize="12px"
                        color="gray.400"
                      >
                        {t("common:client.userOnBoarding.addToCart.title")}
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
                        {opportunityDetails?.isProgram
                          ? t(
                              "common:client.userOnBoarding.addToCart.description.program",
                            )
                          : t(
                              "common:client.userOnBoarding.addToCart.description.deal",
                            )}
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Flex>
              </Stack>
              <Divider color="gray.800" m="48px 0" />
              <Text
                fontSize="18px"
                fontWeight="600"
                mb={{ base: "0", md: "32px", lgp: "16px" }}
              >
                {t("index.text.breakdown")}
              </Text>
              <SimpleGrid
                columns={{ base: 1, md: 2 }}
                mb={{ base: "24px", lgp: "58px" }}
                {...(lang === "en" && {
                  sx: {
                    "div:nth-of-type(odd)": {
                      borderBottom: "1px solid",
                      borderBottomColor: "gray.800",
                      marginEnd: { ...{ base: "0", md: "3" } },

                      "&:after": {
                        content: '""',
                        position: "absolute",
                        top: "1",
                        right: "-3",
                        bottom: "1",
                        borderLeft: {
                          ...{ base: "0px", md: "1px solid" },
                        },
                        borderColor: "#222 !important",
                      },
                    },
                    "div:nth-of-type(even)": {
                      borderBottom: "1px solid",
                      borderBottomColor: "gray.800",
                      marginStart: { ...{ base: "0", md: "3" } },
                      marginEnd: { ...{ base: "0", md: "10" } },
                    },
                    "div:nth-last-of-type(2)": {
                      borderBottomWidth: { ...{ base: "1px", md: "0" } },
                    },
                    "div:nth-last-of-type(1)": {
                      borderBottomWidth: { ...{ base: "1px", md: "0" } },
                    },
                  },
                })}
                {...(lang === "ar" && {
                  sx: {
                    "div:nth-of-type(odd)": {
                      borderBottom: "1px solid",
                      borderBottomColor: "gray.800",
                      marginEnd: { ...{ base: "0", md: "3" } },
                      "&:before": {
                        content: '""',
                        position: "absolute",
                        top: "1",
                        right: "-3",
                        bottom: "1",
                        borderLeft: {
                          ...{ base: "0px solid", md: "1px solid" },
                        },
                        borderLeftColor: "#222 !important",
                      },
                    },
                    "div:nth-of-type(even)": {
                      borderBottom: "1px solid",
                      borderBottomColor: "gray.800",
                      marginStart: { ...{ base: "0", md: "3" } },
                      marginEnd: { ...{ base: "0", md: "10" } },
                    },
                    "div:nth-last-of-type(2)": {
                      borderBottom: { ...{ base: "1px", md: "none" } },
                      borderBottomColor: "gray.800",
                    },
                    "div:nth-last-of-type(1)": {
                      borderBottom: "none",
                    },
                  },
                })}
              >
                {breakdownList.map(({ label, value }) => (
                  <VStack
                    alignItems="flex-start"
                    textAlign="start"
                    position="relative"
                    py="4"
                    key={label}
                  >
                    <Text
                      aria-label="breakdown"
                      fontSize="16px"
                      fontWeight="400"
                      color="gray.500"
                    >
                      {t(`index.card.labels.${label}`)}
                    </Text>
                    <Text
                      dir={
                        label == "expectedReturn" ||
                        label == "clientExpectedExit"
                          ? "ltr"
                          : "none"
                      }
                      mt="8px !important"
                    >
                      {value}
                    </Text>
                  </VStack>
                ))}
              </SimpleGrid>
              {isShowDownloadBtn ? (
                <Stack direction="row" mb={{ base: "24px", md: "48px" }}>
                  <Box me="16px">
                    <DownloadButton
                      onDownloadClick={() => {
                        DownloadDealSheet("download")
                      }}
                    />
                  </Box>
                  <Box>
                    <PrintButton
                      opportunityId={opportunityId}
                      isMobileView={isMobileView}
                    />
                  </Box>
                </Stack>
              ) : (
                false
              )}

              {/* Other Info Section */}
              <Text
                fontSize="18px"
                fontWeight="600"
                mb={{ base: "0", md: "32px" }}
              >
                {t("index.text.otherInfo")}
              </Text>

              <Accordion defaultIndex={[0]} allowToggle w="full" mb="48px">
                {opportunityDetails?.info?.map(({ title, text }) => {
                  if (text.length) {
                    return (
                      <Box arial-label="Other Info" role={"list"}>
                        <AccordionItem
                          borderBottom="1px solid"
                          borderBottomColor="gray.800"
                          mb="0"
                          key={"title"}
                        >
                          <h2>
                            <AccordionButton
                              bg="transparent"
                              p="0"
                              _hover={{ bg: "transparent" }}
                            >
                              <Flex
                                justifyContent="space-between"
                                py="24px"
                                width="full"
                              >
                                <Text
                                  textAlign="start"
                                  fontSize="16px"
                                  fontWeight="400"
                                  color="contrast.200"
                                >
                                  {title}
                                </Text>
                                <AccordionIcon color="primary.500" />
                              </Flex>
                            </AccordionButton>
                          </h2>
                          <AccordionPanel bg="transparent">
                            <UnorderedList
                              color="gray.500"
                              lineHeight="4"
                              spacing="16px"
                              fontSize="14px"
                              fontWeight="400"
                            >
                              {text.map(({ value }, i) => (
                                <ListItem key={i}>{value}</ListItem>
                              ))}
                            </UnorderedList>
                          </AccordionPanel>
                        </AccordionItem>
                      </Box>
                    )
                  }
                })}
              </Accordion>

              {opportunityDetails?.disclaimer || opportunityDetails?.message ? (
                <Box aria-label="Message" role={"paragraph"}>
                  <Text fontSize="sm" color="gray.500" mb="24px">
                    {opportunityDetails?.message}
                  </Text>
                  <Text fontSize="sm" color="gray.500" mb="24px">
                    {opportunityDetails?.disclaimer}
                  </Text>
                </Box>
              ) : (
                false
              )}
              <Divider color="gray.800" mb="12" />
              <Heading as="h3" fontSize="2xl" mb="8">
                {t("index.text.seeOther")}
              </Heading>
              <Box aria-label="Opportunities Card" role={"grid"}>
                <OpportunitySection id={opportunityId} />
                <ModalBox
                  onPrimaryClick={handlePrimaryClick}
                  isOpen={isInterestedModal}
                  modalTitle={
                    opportunityDetails?.isInterested == "Y"
                      ? t("client.modal.interested.title")
                      : t("client.modal.notInterested.title")
                  }
                  modalDescription={
                    opportunityDetails?.isInterested == "Y"
                      ? t("client.modal.notInterested.disclaimer")
                      : t("client.modal.interested.disclaimer")
                  }
                  primaryButtonText={
                    opportunityDetails?.isInterested == "Y"
                      ? t(`client.modal.notInterested.buttons.scheduleNow`)
                      : t("client.modal.interested.buttons.ok")
                  }
                  onClose={onInterestedModalClose}
                  isSecondaryButton={
                    opportunityDetails?.isInterested == "Y" ? true : false
                  }
                  secondaryButtonText={t(
                    `client.modal.notInterested.buttons.later`,
                  )}
                />
              </Box>
              {isOpenCart && (
                <Modal
                  isOpen={isOpenCart}
                  onClose={() => {
                    setOpenCart(false)
                  }}
                  size={modalSize}
                  autoFocus={false}
                  returnFocusOnClose={false}
                  isCentered
                >
                  <ModalOverlay />
                  <ModalContent w="327px">
                    <ModalCloseButton />
                    <ModalBody p="16px" mt="12" textAlign="center">
                      <Text fontSize="24px" fontWeight="300" color="gray.300">
                        {t("client.modal.investmentPerf.title")}
                      </Text>
                    </ModalBody>
                    <ModalFooter float="right" padding="28px">
                      <Box d="flex" style={{ gap: "16px" }}>
                        <Button
                          fontSize={{ base: "16px", md: "16px", lgp: "14px" }}
                          colorScheme="primary"
                          variant="outline"
                          h="32px"
                          onClick={() => {
                            addToCart(true)
                            setOpenCart(false)
                          }}
                        >
                          {t("client.modal.investmentPerf.buttons.shariah")}
                        </Button>
                        <Button
                          fontSize={{ base: "16px", md: "16px", lgp: "14px" }}
                          colorScheme="primary"
                          variant="outline"
                          h="32px"
                          onClick={() => {
                            addToCart(false)
                            setOpenCart(false)
                          }}
                        >
                          {t(
                            "client.modal.investmentPerf.buttons.conventional",
                          )}
                        </Button>
                      </Box>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              )}
            </Fragment>
          )}
        </PageContainer>
      )}
    </ClientLayout>
  )
}

const OpportunitySection = ({ id }: OpportunitySectionProps) => {
  const { lang } = useTranslation()
  const largeDesktopView = useBreakpointValue({
    base: true,
    md: false,
    lgp: true,
    "2xl": true,
    xl: true,
  })
  var valueCount = largeDesktopView ? 3 : 2

  const { data: opportunities, error } = useSWR(
    `/api/client/deals/client-opportunities?count=${valueCount}&langCode=${lang}&id=${id}`,
  )
  const isLoading = !opportunities && !error

  if (isLoading) {
    return <Skeleton flex="1" mb="25px" mt="20px" />
  }
  return <SimilarOpportunityCard opportunities={opportunities} />
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async function (ctx) {
    const sesison = getSession(ctx.req, ctx.res)
    if (sesison?.mandateId && ctx?.params?.id) {
      return {
        props: {
          opportunityId: ctx?.params?.id,
        }, // will be passed to the page component as props
      }
    }
    return {
      notFound: true,
    }
  },
})

export default DealDetails
