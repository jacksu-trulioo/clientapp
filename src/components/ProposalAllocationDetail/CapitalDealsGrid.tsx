import { Modal, ModalBody, ModalContent, ModalOverlay } from "@chakra-ui/modal"
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  chakra,
  Divider,
  Flex,
  HStack,
  SimpleGrid,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Thead,
  Tooltip,
  Tr,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import ky from "ky"
import useTranslation from "next-translate/useTranslation"
import React, { BaseSyntheticEvent } from "react"
import useSWR from "swr"

import { CloseIcon, InfoIcon, IslamIcon, PlayPrimaryIcon } from "~/components"
import { DollarConvertIcon } from "~/components/Icon/DollarConvertIcon"
import {
  AdditionalPreference,
  InvestorProfileGoals,
  LogActivity,
  PROPOSAL_ASSETCLASS_LIST,
  ProposalDealsGridAssets,
  ProposalDealsGridObj,
  YOUR_ALLOCATION_DETAIL,
} from "~/services/mytfo/types"
import { clickDealMoreCTA } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"

import DownloaddocIcon from "../Icon/DownloaddocIcon"

type CapitalDealsGridProps = {
  componentName: string
  gridDealsList: ProposalDealsGridObj[]
  pdfGenerating: boolean
}

const CapitalDealsGrid: React.FC<CapitalDealsGridProps> = (props) => {
  const { pdfGenerating = false } = props
  const isDesktopView = useBreakpointValue({ base: false, lg: true })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isMobileView = !isDesktopView
  const { lang } = useTranslation("personalizedProposal")

  const [newSelected, setNewSelected] = React.useState({})
  const { data: investmentGoals } = useSWR<InvestorProfileGoals>(
    "/api/user/investment-goals",
  )

  const isSharia = investmentGoals?.additionalPreferences?.includes(
    AdditionalPreference?.ShariahCompliant,
  )

  function DealsInfo({
    isOpen,
    onClose,
    newSelection,
  }: {
    isOpen: boolean
    onClose: () => void
    allValues: ProposalDealsGridObj[]

    newSelection: ProposalDealsGridAssets
  }) {
    const { lang } = useTranslation("personalizedProposal")
    const [isPlayIconVisible, setPlayIcon] = React.useState(true)
    const videoRef = React.useRef<HTMLVideoElement>(null)

    const { id = "" } = newSelection

    const { data: proposalDealInfo, error: proposalDealInfoError } =
      useSWR<ProposalDealsGridAssets>(
        id && [`/api/portfolio/proposal/deal-info?id=${id}`, lang],
        (url, lang) =>
          fetch(url, {
            headers: {
              "Accept-Language": lang,
            },
          }).then((res) => res.json()),
      )

    const isLoading = !proposalDealInfo && !proposalDealInfoError

    const breakdownList = [
      {
        label: "assetManager",
        value: proposalDealInfo?.sponsor,
        tooltipRequired: false,
      },
      {
        label: "assetClass",
        value: proposalDealInfo?.assetClass,
      },
      {
        label: "sector",
        value: proposalDealInfo?.sector,
        tooltipRequired: false,
      },
      {
        label: "expectedExit",
        value: proposalDealInfo?.expectedExit,
      },
      {
        label: "expectedReturn",
        value: proposalDealInfo?.expectedReturn,
        tooltipRequired: true,
      },
      {
        label: "country",
        value: proposalDealInfo?.country,
        tooltipRequired: false,
      },
    ]

    const breakdownListCapitalYield = [
      ...breakdownList,
      {
        label: "targetYield",
        value: proposalDealInfo?.targetYield,
        tooltipRequired: false,
      },
    ]

    const breakdownListFinal =
      props.componentName === YOUR_ALLOCATION_DETAIL.CAPITAL_YIELD_DEALS ||
      props.componentName === YOUR_ALLOCATION_DETAIL.OPPORTUNISTIC
        ? breakdownListCapitalYield
        : breakdownList

    const downloadPdf = async (title: string | undefined) => {
      await ky
        .post("/api/user/log-activity", {
          json: {
            event: "DownloadPdf",
            meta: JSON.stringify({ title: title }),
          },
          headers: {
            "content-type": "application/json; charset=utf-8",
          },
        })
        .json<LogActivity>()
    }

    return !isLoading ? (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        autoFocus={false}
        returnFocusOnClose={false}
      >
        <ModalOverlay />

        <ModalContent aria-label="detailedDealInfoModal">
          <ModalBody p={0}>
            <Flex>
              <Box key={proposalDealInfo?.description}>
                <Flex justify="space-between" mb="1" px="4" py="2">
                  <Text
                    fontSize="sm"
                    color="contrast.200"
                    fontWeight="bold"
                    alignSelf="center"
                  >
                    {t("yourAllocationDetail.gridPostulates.opportunityDetail")}
                  </Text>
                  <CloseIcon
                    aria-label="closeIcon"
                    w={5}
                    h={5}
                    onClick={() => {
                      onClose()
                    }}
                    color="primary.500"
                    cursor="pointer"
                  />
                </Flex>

                <Flex w="full" position="relative">
                  {proposalDealInfo?.videoLink && (
                    <>
                      <Box width="full" height="auto" position="relative">
                        {isPlayIconVisible && (
                          <Box
                            position="absolute"
                            top="0"
                            left="0"
                            h="full"
                            w="full"
                            background="linear-gradient(0deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55))"
                          >
                            <Flex
                              justifyContent="center"
                              alignItems="center"
                              h="full"
                              w="full"
                            >
                              <PlayPrimaryIcon
                                w={{ base: "40px", md: "64px" }}
                                h={{ base: "41px", md: "65px" }}
                                zIndex="modal"
                                color="white"
                                cursor="pointer"
                                onClick={() => {
                                  setPlayIcon(false)
                                  videoRef?.current?.play()
                                }}
                              />
                            </Flex>
                          </Box>
                        )}

                        <video
                          controls={!isPlayIconVisible}
                          ref={videoRef}
                          width="100%"
                          preload="auto"
                        >
                          <source
                            src={proposalDealInfo?.videoLink}
                            key={proposalDealInfo.id}
                          />
                        </video>
                      </Box>
                    </>
                  )}
                </Flex>
                <Box p={{ base: 4, md: 6 }} textAlign="start">
                  <Stack direction="row" mb={3}>
                    <Text
                      fontSize={{ base: "lg", md: "xl" }}
                      color="white"
                      textAlign="start"
                    >
                      {proposalDealInfo?.title}
                    </Text>
                    {proposalDealInfo?.isShariahCompliant && (
                      <Box
                        color="gray.900"
                        backgroundColor="secondary.500"
                        borderRadius="full"
                        px="2"
                        alignSelf={{ base: "flex-start", md: "center" }}
                        py="1"
                      >
                        <IslamIcon me="1" w="3" h="3" color="gray.900" />
                        <Text
                          aria-label="opportunityIsShariahCompliant"
                          as="span"
                          fontSize="sm"
                          fontWeight="bold"
                        >
                          {t("yourAllocationDetail.gridData.shariah")}
                        </Text>
                      </Box>
                    )}
                  </Stack>
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    color="white"
                    fontWeight={400}
                    mb={5}
                  >
                    {proposalDealInfo?.description}
                  </Text>

                  {proposalDealInfo?.document && (
                    <Button
                      as="a"
                      target="_blank"
                      colorScheme="primary"
                      size="sm"
                      isFullWidth={isMobileView}
                      variant="outline"
                      // @ts-ignore
                      leftIcon={
                        <DownloaddocIcon h={6} w={6} color="primary.500" />
                      }
                      href={`${proposalDealInfo?.document}`}
                      onClick={() => downloadPdf(proposalDealInfo?.title)}
                      textDecoration="none"
                    >
                      {t("common:button.download")}
                    </Button>
                  )}
                  <Divider color="gray.800" opacity={1} my={6} />
                  <Text fontSize="lg" fontWeight="bold" mb="6">
                    {t("yourAllocationDetail.gridPostulates.breakdown")}
                  </Text>
                  <SimpleGrid
                    columns={2}
                    {...(lang === "en" && {
                      sx: {
                        "div:nth-of-type(odd)": {
                          borderBottom: "1px solid",
                          borderBottomColor: "gray.700",
                          marginEnd: "3",
                          "&:after": {
                            content: '""',
                            position: "absolute",
                            top: "1",
                            right: "-3",
                            bottom: "1",
                            borderStart: "1px solid",
                            borderStartColor: "gray.700",
                          },
                        },
                        "div:nth-of-type(even)": {
                          borderBottom: "1px solid",
                          borderBottomColor: "gray.700",
                          marginStart: "3",
                        },
                        "div:nth-last-of-type(2)": {
                          borderBottom:
                            breakdownListFinal.length % 2 > 0
                              ? "1px solid var(--chakra-colors-gray-700)"
                              : "none",
                        },
                        "div:nth-last-of-type(1)": {
                          borderBottom: "none",
                        },
                      },
                    })}
                    {...(lang === "ar" && {
                      sx: {
                        "div:nth-of-type(odd)": {
                          borderBottom: "1px solid",
                          borderBottomColor: "gray.700",
                          marginEnd: "3",
                          "&:before": {
                            content: '""',
                            position: "absolute",
                            top: "1",
                            right: "-3",
                            bottom: "1",
                            borderStart: "1px solid",
                            borderStartColor: "gray.700",
                          },
                        },
                        "div:nth-of-type(even)": {
                          borderBottom: "1px solid",
                          borderBottomColor: "gray.700",
                          marginStart: "3",
                        },
                        "div:nth-last-of-type(2)": {
                          borderBottom:
                            breakdownListFinal.length % 2 > 0
                              ? "1px solid var(--chakra-colors-gray-700)"
                              : "none",
                        },
                        "div:nth-last-of-type(1)": {
                          borderBottom: "none",
                        },
                      },
                    })}
                  >
                    {breakdownListFinal.map((item) => {
                      return (
                        <VStack
                          alignItems="flex-start"
                          textAlign="start"
                          position="relative"
                          py="4"
                          key={item.label}
                        >
                          <Text
                            aria-label="breakdown"
                            color="gray.500"
                            fontSize={{ base: "xs", md: "sm" }}
                          >
                            {t(
                              `yourAllocationDetail.gridPostulates.${item.label}`,
                            )}
                            {item?.tooltipRequired && (
                              <Tooltip
                                hasArrow
                                label={t(
                                  `yourAllocationDetail.tooltip.${item.label}`,
                                )}
                                placement="bottom"
                                cursor="pointer"
                                textAlign="center"
                                sx={{
                                  whiteSpace: "pre-line",
                                }}
                              >
                                <chakra.span>
                                  <InfoIcon
                                    aria-label="Info icon"
                                    color="primary.500"
                                    h={3.5}
                                    width={3.5}
                                    ml={1}
                                  />
                                </chakra.span>
                              </Tooltip>
                            )}
                          </Text>
                          <Text
                            fontSize={{ base: "xs", md: "sm" }}
                            color="white"
                          >
                            {item.value}
                          </Text>
                        </VStack>
                      )
                    })}
                  </SimpleGrid>
                </Box>
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    ) : (
      <></>
    )
  }

  let shariaDeals: ProposalDealsGridAssets[] = []
  let filteredShariaDeals = [] as ProposalDealsGridObj[]

  props?.gridDealsList?.map((deals) => {
    shariaDeals = deals?.assets?.filter((val) => val?.preferences !== "") || []
    filteredShariaDeals.push({
      assetClass: deals?.assetClass,
      // @ts-ignore
      deals: shariaDeals?.length,
    })
  })

  const { t } = useTranslation("personalizedProposal")
  const getAssetClassDescription = (assetClass: string) => {
    if (props.componentName === YOUR_ALLOCATION_DETAIL.CAPITAL_GROWTH_DEALS) {
      if (assetClass === PROPOSAL_ASSETCLASS_LIST.PRIVATE_EQUITY) {
        return "capitalGrowthPrivateEquityDesc"
      } else if (assetClass === PROPOSAL_ASSETCLASS_LIST.REAL_ESTATE) {
        return "capitalGrowthRealStateDesc"
      } else if (assetClass === PROPOSAL_ASSETCLASS_LIST.PRIVATE_CREDIT) {
        return "capitalGrowthPrivateCreditDesc"
      }
      return "capitalGrowthPrivateEquityDesc"
    } else if (
      props.componentName === YOUR_ALLOCATION_DETAIL.CAPITAL_YIELD_DEALS
    ) {
      if (assetClass === PROPOSAL_ASSETCLASS_LIST.PRIVATE_EQUITY) {
        return "capitalGrowthPrivateEquityDesc"
      }
      if (assetClass === PROPOSAL_ASSETCLASS_LIST.PRIVATE_CREDIT) {
        return "capitalYieldingPrivateCreditDesc"
      } else if (assetClass === PROPOSAL_ASSETCLASS_LIST.REAL_ESTATE) {
        return "capitalYieldingRealStateDesc"
      } else if (assetClass === PROPOSAL_ASSETCLASS_LIST.LEASEBACK) {
        return "capitalYieldingLeasebackDesc"
      }
      return "capitalGrowthPrivateEquityDesc"
    }
  }

  const getDealsCount = (activeDeal: ProposalDealsGridObj) => {
    const deals = filteredShariaDeals?.filter(
      (val) => val?.assetClass === activeDeal?.assetClass,
      // @ts-ignore
    )[0]?.deals

    if (isSharia) {
      if (deals === 0) {
        return deals + " " + t(`yourAllocationDetail.gridData.activeDeal`)
      }
      return deals + " " + t(`yourAllocationDetail.gridData.activeDeals`)
    }

    return `${activeDeal?.assets?.length} ${
      (activeDeal?.assets?.length as number) > 1
        ? t(`yourAllocationDetail.gridData.activeDeals`)
        : t(`yourAllocationDetail.gridData.activeDeal`)
    }`
  }

  return (
    <>
      <Accordion
        {...(pdfGenerating && { defaultIndex: [0, 1, 2, 3, 4] })}
        {...(!pdfGenerating && { allowToggle: true })}
        bgColor="gray.800"
        mb="2"
      >
        {props &&
          props?.gridDealsList.map((activeDeal) => {
            return (
              <AccordionItem
                aria-label="assetClass"
                mb={0}
                key={activeDeal.assetClass}
                borderBottom="8px"
                borderBottomColor="gray.900"
              >
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="start">
                      {activeDeal.assetClass}
                    </Box>
                    <HStack>
                      <DollarConvertIcon color="primary.500" w="6" h="6" />
                      <Text
                        fontSize="sm"
                        color="gray.400"
                        pr={5}
                        borderRight="1px solid"
                        borderColor="gray.700"
                      >
                        {getDealsCount(activeDeal)}
                      </Text>
                    </HStack>
                    <AccordionIcon ml={5} />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Text fontSize="sm" color="gray.400">
                    {t(
                      `yourAllocationDetail.gridData.${getAssetClassDescription(
                        activeDeal.assetClass,
                      )}`,
                    )}
                  </Text>
                  <Table size="sm" mt="4" variant="unstyled">
                    <Thead>
                      <Tr>
                        <Td color="gray.500">
                          {t("yourAllocationDetail.tableHeaders.dealName")}
                        </Td>
                        {isDesktopView && (
                          <Td color="gray.500">
                            {t(
                              "yourAllocationDetail.tableHeaders.assetManager",
                            )}
                          </Td>
                        )}
                        {isDesktopView && (
                          <Td color="gray.500">
                            {t("yourAllocationDetail.tableHeaders.preferences")}
                          </Td>
                        )}
                        {isDesktopView &&
                          props.componentName ===
                            YOUR_ALLOCATION_DETAIL.CAPITAL_YIELD_DEALS && (
                            <Td color="gray.500">
                              {t(
                                "yourAllocationDetail.tableHeaders.targetYield",
                              )}
                              <Tooltip
                                hasArrow
                                label={t(
                                  "yourAllocationDetail.tableHeaders.targetYieldToolTipText",
                                )}
                                placement="bottom"
                                cursor="pointer"
                                textAlign="center"
                              >
                                <chakra.span>
                                  <InfoIcon
                                    aria-label="Info icon"
                                    color="primary.500"
                                    h={3.5}
                                    width={3.5}
                                    ml={1}
                                  />
                                </chakra.span>
                              </Tooltip>
                            </Td>
                          )}
                        <Td display="flex" flexWrap="wrap" color="gray.500">
                          <Text me="1">
                            {t(
                              "yourAllocationDetail.tableHeaders.expectedReturn",
                            )}
                          </Text>
                          <Tooltip
                            hasArrow
                            label={t(
                              "yourAllocationDetail.tableHeaders.targetReturnToolTipText",
                            )}
                            placement="bottom"
                            textAlign="center"
                          >
                            <chakra.span>
                              <InfoIcon
                                aria-label="Info icon"
                                color="primary.500"
                                h={3.5}
                                width={3.5}
                              />
                            </chakra.span>
                          </Tooltip>
                        </Td>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {activeDeal?.assets?.map((eachDealItem) => {
                        return !isSharia ? (
                          <Tr
                            key={eachDealItem.title}
                            bgColor="gray.750"
                            borderBottom="8px"
                            borderColor="gray.800"
                          >
                            <Td>
                              <Text>{eachDealItem.title}</Text>
                            </Td>
                            {isDesktopView && (
                              <Td>
                                <Text>{eachDealItem.assetManager}</Text>
                              </Td>
                            )}
                            {isDesktopView && (
                              <Td>
                                {eachDealItem.preferences ===
                                  t("yourAllocationDetail.labels.shariah") && (
                                  <Flex>
                                    <IslamIcon
                                      me="1"
                                      w="3"
                                      h="3"
                                      color="secondary.500"
                                    />
                                    <Text pl="10px">
                                      {lang === "en"
                                        ? eachDealItem?.preferences
                                        : t(
                                            "yourAllocationDetail.labels.shariahTag",
                                          )}
                                    </Text>
                                  </Flex>
                                )}
                              </Td>
                            )}

                            {isDesktopView &&
                              props.componentName ===
                                YOUR_ALLOCATION_DETAIL.CAPITAL_YIELD_DEALS && (
                                <Td>
                                  <Text>{eachDealItem.targetYield}</Text>
                                </Td>
                              )}

                            <Td textAlign={lang === "ar" ? "end" : "start"}>
                              <Text dir="ltr">
                                {eachDealItem.expectedReturn}
                              </Text>
                            </Td>

                            {!props.pdfGenerating && (
                              <Td
                                color="primary.500"
                                cursor="pointer"
                                textDecoration="underline"
                                id={eachDealItem.id}
                                onClick={(e: BaseSyntheticEvent) => {
                                  event({
                                    ...clickDealMoreCTA,
                                    label: `Click on the 'More' CTA of ${e.target.getAttribute(
                                      "id",
                                    )}`,
                                  })
                                  setNewSelected({
                                    id: e.target.getAttribute("id"),
                                    assetClass:
                                      e.target.getAttribute("assetClass"),
                                  })
                                  onOpen()
                                }}
                              >
                                {t("yourAllocationDetail.gridData.more")}
                              </Td>
                            )}
                          </Tr>
                        ) : (
                          isSharia && eachDealItem?.preferences && (
                            <Tr
                              key={eachDealItem.title}
                              bgColor="gray.750"
                              borderBottom="8px"
                              borderColor="gray.800"
                            >
                              <Td>
                                <Text>{eachDealItem.title}</Text>
                              </Td>
                              {isDesktopView && (
                                <Td>
                                  <Text>{eachDealItem.assetManager}</Text>
                                </Td>
                              )}
                              {isDesktopView && (
                                <Td>
                                  {eachDealItem.preferences ===
                                    t(
                                      "yourAllocationDetail.labels.shariah",
                                    ) && (
                                    <Flex>
                                      <IslamIcon
                                        me="1"
                                        w="3"
                                        h="3"
                                        color="secondary.500"
                                      />
                                      <Text pl="10px">
                                        {lang === "en"
                                          ? eachDealItem?.preferences
                                          : t(
                                              "yourAllocationDetail.labels.shariahTag",
                                            )}
                                      </Text>
                                    </Flex>
                                  )}
                                </Td>
                              )}

                              {isDesktopView &&
                                props.componentName ===
                                  YOUR_ALLOCATION_DETAIL.CAPITAL_YIELD_DEALS && (
                                  <Td>
                                    <Text>{eachDealItem.targetYield}</Text>
                                  </Td>
                                )}

                              <Td textAlign={lang === "ar" ? "end" : "start"}>
                                <Text dir="ltr">
                                  {eachDealItem.expectedReturn}
                                </Text>
                              </Td>

                              {!props.pdfGenerating && (
                                <Td
                                  color="primary.500"
                                  cursor="pointer"
                                  textDecoration="underline"
                                  id={eachDealItem.id}
                                  onClick={(e: BaseSyntheticEvent) => {
                                    setNewSelected({
                                      id: e.target.getAttribute("id"),
                                      assetClass:
                                        e.target.getAttribute("assetClass"),
                                    })
                                    onOpen()
                                  }}
                                >
                                  {t("yourAllocationDetail.gridData.more")}
                                </Td>
                              )}
                            </Tr>
                          )
                        )
                      })}
                    </Tbody>
                  </Table>
                </AccordionPanel>
              </AccordionItem>
            )
          })}
      </Accordion>

      <DealsInfo
        isOpen={isOpen}
        onClose={onClose}
        allValues={props?.gridDealsList}
        newSelection={newSelected}
      />
    </>
  )
}
export default React.memo(CapitalDealsGrid)
