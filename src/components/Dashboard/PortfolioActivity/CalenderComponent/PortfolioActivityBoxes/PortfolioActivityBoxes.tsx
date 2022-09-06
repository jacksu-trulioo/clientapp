import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"
import { format } from "date-fns"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect, useState } from "react"

import { PortfolioSkeleton, RigthArrow } from "~/components"
import { PortfolioActivityType } from "~/services/mytfo/clientTypes"
import { formatCurrencyWithCommas } from "~/utils/formatCurrency"

type props = {
  data: PortfolioActivityType[]
  isCallback: string
  maxHeight: number
}

const dataLength = 4

export default function PortfolioActivityBoxes({
  data,
  isCallback,
  maxHeight,
}: props) {
  const { t } = useTranslation("clientDashboard")
  const [showmoreVal, setShowmoreVal] = useState(dataLength)
  const [loadFlag, setLoadFlag] = useState(true)
  const [isLoading, setLoading] = useState(true)

  const isTabView = useBreakpointValue({
    base: false,
    md: true,
    lgp: false,
    xl: false,
    "2xl": false,
  })

  const getTabView = () => {
    return isTabView
  }

  const getDataLength = useBreakpointValue({
    base: showmoreVal,
    md: showmoreVal,
    lgp: data?.length,
    xl: data?.length,
    "2xl": data?.length,
  })

  useEffect(() => {
    setLoading(true)
    setShowmoreVal(dataLength)
    setLoadFlag(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [isCallback, data])

  const increaseCount = () => {
    if (loadFlag) {
      setLoadFlag(false)
      setShowmoreVal(data?.length)
    } else {
      setLoadFlag(true)
      setShowmoreVal(dataLength)
    }
  }

  const accordionOnChangeEvent = (expandedIndex: number) => {
    if (expandedIndex > 4) {
      setTimeout(() => {
        scrollToTop()
      }, 300)
    }
  }

  const scrollToTop = () => {
    const input = document.getElementById("portfolioActivityScrollTop")
    const element: HTMLElement = input!
    element.scrollTo({
      top: 1000,
      behavior: "smooth",
    })
  }
  return (
    <>
      {isLoading && <PortfolioSkeleton h="132px" w="100%" />}

      {!isLoading && (
        <>
          {data?.length > 0 ? (
            <Accordion
              onChange={(expandedIndex: number) =>
                accordionOnChangeEvent(expandedIndex)
              }
              className="dataScroll"
              id="portfolioActivityScrollTop"
              maxHeight={{
                lgp: maxHeight + "px",
                md: getTabView() ? "unset" : "445px",
                base: "unset",
              }}
              overflow={{ lgp: "auto", md: "unset", base: "unset" }}
              allowToggle
              css={{
                "&::-webkit-scrollbar-thumb": {
                  background: "#4d4d4d",
                },
              }}
            >
              {data.slice(0, getDataLength).map((eventData, index) => {
                return (
                  <Box
                    mb="12px"
                    key={index}
                    borderRadius="6px"
                    overflow="hidden"
                  >
                    {eventData.distributions.length > 0 && (
                      <>
                        {eventData.distributions && (
                          <AccordionItem
                            key={"distributions" + index}
                            className="sameDate"
                          >
                            <AccordionButton
                              className="sameDateBtn"
                              aria-label="Deal Detail"
                            >
                              <Flex
                                flex="1"
                                justifyContent="flex-start"
                                alignItems="center"
                              >
                                {" "}
                                <Box mr="12px">
                                  <Box
                                    w={{
                                      lgp: "82px",
                                      md: "82px",
                                      base: "68px",
                                    }}
                                    fontSize="14px"
                                    color="gray.900"
                                    p={{
                                      lgp: "4px 8px",
                                      md: "4px 8px",
                                      base: "4px 4px",
                                    }}
                                    bgColor="green.700"
                                    whiteSpace="nowrap"
                                    fontWeight="600"
                                    lineHeight="120%"
                                    borderRadius="6px"
                                  >
                                    {format(new Date(eventData.date), "MMM dd")}
                                  </Box>
                                </Box>
                                <Box>
                                  {" "}
                                  <Text
                                    fontSize="14px"
                                    fontWeight="700"
                                    color="contrast.200"
                                    lineHeight="120%"
                                    textAlign="left"
                                  >
                                    {t(
                                      "portfolioActivity.accordionDetails.distributionAccordion.title",
                                    )}
                                  </Text>
                                </Box>{" "}
                              </Flex>
                              <AccordionIcon />
                            </AccordionButton>

                            <AccordionPanel pb={4} pt="0 !important">
                              {eventData?.distributions?.length > 0 && (
                                <>
                                  {eventData.distributions?.map(
                                    (deal, dealIndex) => {
                                      return (
                                        <Box key={dealIndex} mb="10px">
                                          <DealDescriptionComponent
                                            isDealName={deal.dealName}
                                            isAmount={deal.amount}
                                            isType={"distributions"}
                                          />
                                        </Box>
                                      )
                                    },
                                  )}
                                </>
                              )}
                            </AccordionPanel>
                          </AccordionItem>
                        )}
                      </>
                    )}

                    {eventData.capitalCalls.length > 0 && (
                      <>
                        {eventData.capitalCalls && (
                          <AccordionItem
                            key={"capitalCalls" + index}
                            className="sameDate"
                          >
                            <AccordionButton
                              className="sameDateBtn"
                              aria-label="Deal Detail"
                            >
                              <Flex
                                flex="1"
                                justifyContent="flex-start"
                                alignItems="center"
                              >
                                {" "}
                                <Box mr="12px">
                                  <Box
                                    w={{
                                      lgp: "82px",
                                      md: "82px",
                                      base: "68px",
                                    }}
                                    fontSize="14px"
                                    color="gray.900"
                                    p={{
                                      lgp: "4px 8px",
                                      md: "4px 8px",
                                      base: "4px 4px",
                                    }}
                                    borderRadius="6px"
                                    whiteSpace="nowrap"
                                    bgColor="salmon.500"
                                    fontWeight="600"
                                    lineHeight="120%"
                                  >
                                    {format(new Date(eventData.date), "MMM dd")}
                                  </Box>
                                </Box>
                                <Box>
                                  {" "}
                                  <Text
                                    fontSize="14px"
                                    fontWeight="700"
                                    color="contrast.200"
                                    lineHeight="120%"
                                    textAlign="left"
                                  >
                                    {t(
                                      "portfolioActivity.accordionDetails.capitalCallAccordion.title",
                                    )}
                                  </Text>
                                </Box>{" "}
                              </Flex>

                              <AccordionIcon />
                            </AccordionButton>

                            <AccordionPanel pb={4} pt="0 !important">
                              {eventData?.capitalCalls?.length > 0 && (
                                <>
                                  {eventData.capitalCalls?.map(
                                    (deal, ccDealIndex) => {
                                      return (
                                        <Box key={ccDealIndex} mb="10px">
                                          <DealDescriptionComponent
                                            isDealName={deal.dealName}
                                            isAmount={deal.amount}
                                            isType={"capitallCall"}
                                          />
                                        </Box>
                                      )
                                    },
                                  )}
                                </>
                              )}
                            </AccordionPanel>
                          </AccordionItem>
                        )}
                      </>
                    )}

                    {eventData?.exits?.length > 0 && (
                      <>
                        {eventData.exits && (
                          <AccordionItem
                            key={"exits" + index}
                            className="sameDate"
                          >
                            <AccordionButton
                              className="sameDateBtn"
                              aria-label="Deal Detail"
                            >
                              <Flex
                                flex="1"
                                justifyContent="flex-start"
                                alignItems="center"
                              >
                                {" "}
                                <Box mr="12px">
                                  <Box
                                    w={{
                                      md: "82px",
                                      lgp: "82px",
                                      base: "68px",
                                    }}
                                    fontSize="14px"
                                    color="gray.900"
                                    borderRadius="6px"
                                    p={{
                                      lgp: "4px 8px",
                                      md: "4px 8px",
                                      base: "4px 4px",
                                    }}
                                    bgColor="blue.500"
                                    whiteSpace="nowrap"
                                    fontWeight="600"
                                    lineHeight="120%"
                                  >
                                    {format(new Date(eventData.date), "MMM dd")}
                                  </Box>
                                </Box>
                                <Box>
                                  {" "}
                                  <Text
                                    fontSize="14px"
                                    fontWeight="700"
                                    color="contrast.200"
                                    lineHeight="120%"
                                    textAlign="left"
                                  >
                                    {t(
                                      `portfolioActivity.accordionDetails.exitAccordion.title.${eventData.exits.length}`,
                                    )}
                                  </Text>
                                </Box>{" "}
                              </Flex>
                              <AccordionIcon />
                            </AccordionButton>

                            <AccordionPanel pb={4} pt="0 !important">
                              {eventData?.exits?.length > 0 && (
                                <>
                                  {eventData.exits?.map(
                                    (deal, exitDealIndex) => {
                                      return (
                                        <Box key={exitDealIndex} mb="10px">
                                          <DealDescriptionComponent
                                            isDealName={deal.dealName}
                                            isAmount={deal.amount}
                                            isType={"exits"}
                                          />
                                        </Box>
                                      )
                                    },
                                  )}
                                </>
                              )}
                            </AccordionPanel>
                          </AccordionItem>
                        )}
                      </>
                    )}
                  </Box>
                )
              })}
            </Accordion>
          ) : (
            <Box
              h={{ lgp: "100%", md: "68px", base: "68px" }}
              bg="rgba(0, 0, 0, 0.33)"
              border="1px solid #4D4D4D"
              borderRadius="6px"
              d="flex"
              justifyContent="center"
              flexDirection="column"
            >
              <Text
                fontWeight="700"
                fontSize="14px"
                textAlign="center"
                lineHeight="120%"
                p={{ base: "0 16px", md: "0", lgp: "0" }}
              >
                {t("portfolioActivity.noEventNote")}
              </Text>
            </Box>
          )}

          {data?.length > dataLength && (
            <Button
              colorScheme="primary"
              variant="outline"
              w="100%"
              mt="10px"
              onClick={increaseCount}
              d={{ base: "block", md: "block", lgp: "none" }}
              _hover={{
                backgroundColor: "transparent",
              }}
              _focus={{
                backgroundColor: "transparent",
              }}
            >
              {loadFlag ? (
                <Box d="flex" justifyContent="center">
                  {t("portfolioActivity.viewMoreBtn")}{" "}
                  <Box as="span" className="viewMoreIcon" ml="8px">
                    <RigthArrow />
                  </Box>
                </Box>
              ) : (
                <Box d="flex" justifyContent="center">
                  {t("portfolioActivity.viewLessBtn")}{" "}
                  <Box as="span" className="viewLessIcon" ml="8px">
                    <RigthArrow />
                  </Box>
                </Box>
              )}
            </Button>
          )}
        </>
      )}
    </>
  )
}

type DealNameType = {
  isDealName: string
  isAmount: number
  isType: string
}

const DealDescriptionComponent = ({
  isDealName,
  isAmount,
  isType,
}: DealNameType) => {
  const { t, lang } = useTranslation("clientDashboard")
  return (
    <Box
      paddingLeft={{
        lgp: lang.includes("ar") ? "113px" : "115px",
        md: lang.includes("ar") ? "113px" : "115px",
        base: lang.includes("ar") ? "24px" : "22px",
      }}
      w={{
        lgp: "84%",
        md: "100%",
        base: "100%",
      }}
      ml={{
        lgp: "none",
        md: "none",
        base: "none",
      }}
      className="bulletClass"
    >
      <ul>
        <li>
          <Text
            aria-label="Deal Description"
            role={"paragraph"}
            fontSize="14px"
            fontWeight="400"
            color="gray.400"
            lineHeight="120%"
            display="inline"
          >
            {isType == "exits" &&
              t(
                "portfolioActivity.accordionDetails.exitAccordion.description",
                {
                  dealName: isDealName,
                  dealAmount: formatCurrencyWithCommas(String(isAmount)),
                },
              )}

            {isType == "capitallCall" &&
              t(
                "portfolioActivity.accordionDetails.capitalCallAccordion.description",
                {
                  dealAmount: formatCurrencyWithCommas(String(isAmount)),
                  dealName: isDealName,
                },
              )}

            {isType == "distributions" &&
              t(
                "portfolioActivity.accordionDetails.distributionAccordion.description",
                {
                  dealAmount: formatCurrencyWithCommas(String(isAmount)),
                  dealName: isDealName,
                },
              )}
          </Text>
        </li>
      </ul>
    </Box>
  )
}
