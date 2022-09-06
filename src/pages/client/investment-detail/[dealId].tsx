import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import {
  Box,
  Flex,
  Hide,
  Link,
  ListItem,
  OrderedList,
  Show,
  Text,
  useMediaQuery,
} from "@chakra-ui/react"
import moment from "moment"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useEffect, useState } from "react"
import useSWR from "swr"

import {
  ClientLayout,
  DealDetailBoxes,
  Dealgallery,
  DesktopMultiRowTable,
  ModalBox,
  PageContainer,
  QuarterTabs,
  SkeletonCard,
} from "~/components"
import { useUser } from "~/hooks/useUser"
import { DealDetails } from "~/services/mytfo/clientTypes"
import { OptionsProps } from "~/services/mytfo/types"
import {
  formatShortDate,
  getQuarterDate,
} from "~/utils/clientUtils/dateUtility"
import {
  absoluteConvertCurrencyWithDollar,
  percentTwoDecimalPlace,
} from "~/utils/clientUtils/globalUtilities"
import { screenSpentTime } from "~/utils/googleEventsClient"
import { clientEvent } from "~/utils/gtag"

type InvestmentDetailProps = {
  dealId: number
}

type DetailData = {
  detailData: DealDetails
  lastValuationDate: {
    lastValuationDate: string
    accountCreationDate: string
  }
}

type DatesObj = {
  fromDate: string
  toDate: string
}

const InvestmentDetail = ({ dealId }: InvestmentDetailProps) => {
  const { user } = useUser()
  const { t } = useTranslation("investmentDetail")
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [error, setError] = useState(false)

  const { data: dealDetail, error: dealDetailError } = useSWR(
    `/api/client/investments/deal-details?dealId=${dealId}`,
  )
  const { data: lastValuationDate } = useSWR(
    `/api/client/get-last-valuation-date`,
  )

  const isLoading = !dealDetail && !dealDetailError

  useEffect(() => {
    if (!lastValuationDate || !dealDetail) {
      setError(true)
    }
  }, [lastValuationDate, dealDetail])

  useEffect(() => {
    const openTime = moment(new Date())
    return () => {
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        screenSpentTime,
        "Investments Deal Details Page",
        duration.asSeconds().toString(),
        user?.mandateId as string,
        user?.email as string,
      )
    }
  }, [])

  useEffect(() => {
    if (isLoading) {
      setIsPageLoading(true)
    } else {
      setIsPageLoading(false)
    }
  }, [isLoading])

  return (
    <ClientLayout title={t("page.title")} description={t("page.description")}>
      {!error && !isPageLoading && !isLoading ? (
        <ModalBox
          isOpen={true}
          modalDescription={t("common:client.errors.noDate.description")}
          modalTitle={t("common:client.errors.noDate.title")}
          primaryButtonText={t("common:client.errors.noDate.button")}
          onClose={() => {
            router.push("/client/portfolio-summary")
          }}
          onPrimaryClick={() => {
            router.push("/client/portfolio-summary")
          }}
        />
      ) : (
        <PageContainer
          isLoading={isPageLoading}
          as="section"
          maxW="full"
          px="0"
          mt={{ base: 0, md: 0, lgp: 0 }}
          filter={isPageLoading ? "blur(3px)" : "none"}
        >
          {isLoading ? (
            <SkeletonCard flex="1" mb="25px" mt="20px" />
          ) : (
            <Fragment>
              <Box mb={{ base: "10px", lgp: "10px", md: "24px" }}>
                <Box
                  as="nav"
                  fontStyle="normal"
                  fontSize="12px"
                  fontWeight="400"
                  d={{ base: "none", md: "block", lgp: "block" }}
                >
                  <OrderedList m="8px 0">
                    <ListItem display="inline-flex" alignItems="center">
                      <Link
                        onClick={() => router.push("/client/total-investments")}
                        color="primary.500"
                        _focus={{
                          boxShadow: "none",
                        }}
                      >
                        {t("common:nav.links.totalInvestments")}
                      </Link>
                      <Box as="span" marginInline="0.5rem">
                        /
                      </Box>
                    </ListItem>
                    <ListItem display="inline-flex" alignItems="center">
                      {t("page.title")}
                    </ListItem>
                  </OrderedList>
                </Box>
              </Box>
              <InvestmentDetailSection
                lastValuationDate={lastValuationDate}
                detailData={dealDetail}
              />
            </Fragment>
          )}
        </PageContainer>
      )}
    </ClientLayout>
  )
}

export default InvestmentDetail

const InvestmentDetailSection = ({
  detailData,
  lastValuationDate,
}: DetailData) => {
  const { t, lang } = useTranslation("investmentDetail")
  const [selectedQuarterData, setSelectedQuarterData] = useState(
    detailData?.periods[detailData.periods.length - 1],
  )
  const [timePeriod, setTimePeriod] = useState<OptionsProps[]>([])

  useEffect(() => {
    var timePeriodArray: OptionsProps[] = []
    detailData?.periods.map(({ timeperiod }) => {
      if (timeperiod.quarter != "ITD") {
        timePeriodArray.push({
          value: `${timeperiod.quarter}`,
          label: `${t(
            `common:client.quarters.quarter_${timeperiod.quarter}`,
          )} ${timeperiod.year}`,
        })
      }
    })
    if (
      detailData?.periods.find(({ timeperiod }) => {
        return timeperiod.quarter == "ITD"
      })
    ) {
      timePeriodArray.push({
        value: "ITD",
        label: t("common:client.quarters.ITD"),
      })
    }
    if (timePeriodArray.length) {
      setTimePeriod([...timePeriodArray])
    }
  }, [])

  const changeActiveFilter = (value: string | number) => {
    var findData = detailData.periods.find(({ timeperiod }) => {
      return timeperiod.quarter == value
    })
    if (findData) {
      setSelectedQuarterData(findData)
    }
  }

  const rendeSubTitle = () => {
    var getDates: DatesObj

    if (selectedQuarterData.timeperiod.quarter == "ITD") {
      getDates = {
        fromDate: formatShortDate(lastValuationDate.accountCreationDate, lang),
        toDate: formatShortDate(lastValuationDate.lastValuationDate, lang),
      }
    } else {
      var quarterDates = getQuarterDate(
        selectedQuarterData.timeperiod.quarter as number,
        selectedQuarterData.timeperiod.year,
      )

      var differenceChecker = moment(lastValuationDate.lastValuationDate).diff(
        moment(quarterDates?.toDate),
        "days",
      )

      getDates = {
        fromDate: formatShortDate(quarterDates?.fromDate as string, lang),
        toDate:
          differenceChecker < 0
            ? formatShortDate(lastValuationDate.lastValuationDate, lang)
            : formatShortDate(quarterDates?.toDate as string, lang),
      }
    }

    return `${getDates.fromDate} - ${getDates.toDate} | ${t(
      "common:client.USD",
    )}`
  }

  const [is320] = useMediaQuery("(max-width: 320px)")

  return (
    <Fragment>
      <Box>
        <Box>
          <Box
            as="h4"
            mb={{ base: "24px", lgp: "32px", md: "24px" }}
            color="contrast.200"
            fontWeight="400"
            fontSize="30px"
          >
            {selectedQuarterData.name}
          </Box>
        </Box>
      </Box>

      <Box mb={{ base: "48px", lgp: "120px", md: "64px" }}>
        <DealDetailBoxes selectedQuarterData={selectedQuarterData} />
      </Box>

      <Box
        justifyContent="space-between"
        mb="16px"
        d={{ base: "block", md: "flex" }}
        alignItems="center"
      >
        <Box
          flex="0 0 auto"
          maxWidth={{ base: "100%", md: "50%" }}
          mb={{ base: "16px", md: "0" }}
        >
          <Text
            aria-label="Quarter Date"
            role={"contentinfo"}
            fontSize={{ base: "18px", lgp: "14px" }}
            fontWeight={{ base: "700", lgp: "400" }}
            color={{ base: "gray.600", lgp: "contrast.200" }}
            lineHeight="120%"
          >
            {rendeSubTitle()}
          </Text>
        </Box>
        <Box>
          <Hide below="lgp">
            <Flex
              space="34px"
              style={{
                justifyContent: "right",
              }}
              d={{ base: "none", md: "none", lgp: "flex" }}
            >
              <QuarterTabs
                changeActiveFilter={changeActiveFilter}
                activeOption={selectedQuarterData.timeperiod.quarter}
                options={timePeriod}
                viewType="desktop"
              />
            </Flex>
          </Hide>
          <Show below="lgp">
            <QuarterTabs
              changeActiveFilter={changeActiveFilter}
              activeOption={selectedQuarterData.timeperiod.quarter}
              options={timePeriod}
              viewType="mobile"
            />
          </Show>
        </Box>
      </Box>
      <Box mb={{ base: "48px", lgp: "120px", md: "64px" }}>
        <DesktopMultiRowTable
          tableGridSize={8}
          tableBody={[
            {
              data: [
                {
                  value: t("investmentTable.tableHeader.bookValue"),
                  size: 4,
                  style: {
                    textAlign: "left",
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "120%",
                    color: "contrast.200",
                    paddingRight: "0",
                  },
                },
                {
                  value: `${
                    Math.round(selectedQuarterData.bookValue) == 0
                      ? "+"
                      : Math.round(selectedQuarterData.bookValue) > 0
                      ? "+"
                      : ""
                  }${absoluteConvertCurrencyWithDollar(
                    selectedQuarterData.bookValue,
                  )}`,
                  size: 4,
                  style: {
                    textAlign: "end",
                    fontWeight: "400",
                    fontSize: is320 ? "20px" : "26px",
                    lineHeight: "120%",
                    color:
                      Math.round(selectedQuarterData.bookValue) < 0
                        ? "red.500"
                        : "green.500",
                    paddingRight: "0",
                  },
                },
              ],
            },
            {
              data: [
                {
                  value: t("investmentTable.tableHeader.marketValue"),
                  size: 4,
                  style: {
                    textAlign: "left",
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "120%",
                    color: "contrast.200",
                    paddingRight: "0",
                  },
                },
                {
                  value: `${
                    Math.round(selectedQuarterData.marketValue) == 0
                      ? "+"
                      : Math.round(selectedQuarterData.marketValue) > 0
                      ? "+"
                      : ""
                  }${absoluteConvertCurrencyWithDollar(
                    selectedQuarterData.marketValue,
                  )}`,
                  size: 4,
                  style: {
                    textAlign: "end",
                    fontWeight: "400",
                    fontSize: is320 ? "20px" : "26px",
                    lineHeight: "120%",
                    color:
                      Math.round(selectedQuarterData.marketValue) < 0
                        ? "red.500"
                        : "green.500",
                    paddingRight: "0",
                  },
                },
              ],
            },
            {
              data: [
                {
                  value: t("investmentTable.tableHeader.initialBookValue"),
                  size: 4,
                  style: {
                    textAlign: "left",
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "120%",
                    color: "contrast.200",
                    paddingRight: "0",
                  },
                },
                {
                  value: `${
                    Math.round(selectedQuarterData.initialFunding) == 0
                      ? "+"
                      : Math.round(selectedQuarterData.initialFunding) < 0
                      ? ""
                      : "+"
                  }${absoluteConvertCurrencyWithDollar(
                    selectedQuarterData.initialFunding,
                  )}`,
                  size: 4,
                  style: {
                    textAlign: "end",
                    fontWeight: "400",
                    fontSize: is320 ? "20px" : "26px",
                    lineHeight: "120%",
                    color:
                      Math.round(selectedQuarterData.initialFunding) < 0
                        ? "red.500"
                        : "green.500",
                    paddingRight: "0",
                  },
                },
              ],
            },
            {
              data: [
                {
                  value: t("investmentTable.tableHeader.shares"),
                  size: 4,
                  style: {
                    textAlign: "left",
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "120%",
                    color: "contrast.200",
                    paddingRight: "0",
                  },
                },
                {
                  value: `${selectedQuarterData.shares}`,
                  size: 4,
                  style: {
                    textAlign: "end",
                    fontWeight: "400",
                    fontSize: "20px",
                    lineHeight: "120%",
                    color: "contrast.200",
                    paddingRight: "0",
                  },
                },
              ],
            },
            {
              data: [
                {
                  value: t(
                    "investmentTable.tableHeader.performanceContribution",
                  ),
                  size: 4,
                  style: {
                    textAlign: "left",
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "120%",
                    color: "contrast.200",
                    paddingRight: "0",
                  },
                },
                {
                  value: `${
                    selectedQuarterData.performanceContribution < 0 ? "-" : ""
                  }${percentTwoDecimalPlace(
                    selectedQuarterData.performanceContribution,
                  )}%`,
                  size: 4,
                  style: {
                    textAlign: "end",
                    fontWeight: "400",
                    fontSize: "20px",
                    lineHeight: "120%",
                    color: "contrast.200",
                    paddingRight: "0",
                  },
                },
              ],
            },
            {
              data: [
                {
                  value: t("investmentTable.tableHeader.multiple"),
                  size: 4,
                  style: {
                    textAlign: "left",
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "120%",
                    color: "contrast.200",
                    paddingRight: "0",
                  },
                },
                {
                  value: `${percentTwoDecimalPlace(
                    selectedQuarterData.multiple,
                  )}x`,
                  size: 4,
                  style: {
                    textAlign: "end",
                    fontWeight: "400",
                    fontSize: "20px",
                    lineHeight: "120%",
                    color: "contrast.200",
                    paddingRight: "0",
                  },
                },
              ],
            },
            {
              data: [
                {
                  value: t("investmentTable.tableHeader.netChange"),
                  size: 4,
                  style: {
                    textAlign: "left",
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "120%",
                    color: "contrast.200",
                    paddingRight: "0",
                  },
                },

                {
                  value: `${
                    selectedQuarterData.netChange == 0
                      ? ""
                      : selectedQuarterData.netChange > 0
                      ? "+"
                      : ""
                  }${absoluteConvertCurrencyWithDollar(
                    selectedQuarterData.netChange,
                  )}`,
                  size: 4,
                  style: {
                    textAlign: "end",
                    fontWeight: "400",
                    fontSize: is320 ? "20px" : "26px",
                    lineHeight: "120%",
                    color:
                      selectedQuarterData.netChange == 0
                        ? "contrast.200"
                        : selectedQuarterData.netChange > 0
                        ? "green.500"
                        : "red.500",
                    paddingRight: "0",
                  },
                },
              ],
            },
            {
              data: [
                {
                  value: t("investmentTable.tableHeader.valueStart"),
                  size: 4,
                  style: {
                    textAlign: "left",
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "120%",
                    color: "contrast.200",
                    paddingRight: "0",
                  },
                },
                {
                  value: `${absoluteConvertCurrencyWithDollar(
                    selectedQuarterData.valueStart,
                  )}`,
                  size: 4,
                  style: {
                    textAlign: "end",
                    fontWeight: "400",
                    fontSize: "20px",
                    lineHeight: "120%",
                    color: "contrast.200",
                    paddingRight: "0",
                  },
                },
              ],
            },
            {
              data: [
                {
                  value: t("investmentTable.tableHeader.valueEnd"),
                  size: 4,
                  style: {
                    textAlign: "left",
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "120%",
                    color: "contrast.200",
                    paddingRight: "0",
                  },
                },
                {
                  value: `${absoluteConvertCurrencyWithDollar(
                    selectedQuarterData.valueEnd,
                  )}`,
                  size: 4,
                  style: {
                    textAlign: "end",
                    fontWeight: "400",
                    fontSize: "20px",
                    lineHeight: "120%",
                    color: "contrast.200",
                    paddingRight: "0",
                  },
                },
              ],
            },
            {
              data: [
                {
                  value: t("investmentTable.tableHeader.returnOfCapital"),
                  size: 4,
                  style: {
                    textAlign: "left",
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "120%",
                    color: "contrast.200",
                    paddingRight: "0",
                  },
                },
                {
                  value: `${absoluteConvertCurrencyWithDollar(
                    selectedQuarterData.returnOfCapital,
                  )}`,
                  size: 4,
                  style: {
                    textAlign: "end",
                    fontWeight: "400",
                    fontSize: "20px",
                    lineHeight: "120%",
                    color: "contrast.200",
                    paddingRight: "0",
                  },
                },
              ],
            },
            {
              data: [
                {
                  value: t("investmentTable.tableHeader.gainLoss"),
                  size: 4,
                  style: {
                    textAlign: "left",
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "120%",
                    color: "contrast.200",
                    paddingRight: "0",
                  },
                },
                {
                  value: `${
                    Math.round(selectedQuarterData.gainsOrLosses) == 0
                      ? "+"
                      : Math.round(selectedQuarterData.gainsOrLosses) > 0
                      ? "+"
                      : ""
                  }${absoluteConvertCurrencyWithDollar(
                    selectedQuarterData.gainsOrLosses,
                  )}`,
                  size: 4,
                  style: {
                    textAlign: "end",
                    fontWeight: "400",
                    fontSize: "20px",
                    lineHeight: "120%",
                    color:
                      Math.round(selectedQuarterData.gainsOrLosses) < 0
                        ? "red.500"
                        : "green.500",
                    paddingRight: "0",
                  },
                },
              ],
            },
            {
              data: [
                {
                  value: t("investmentTable.tableHeader.income"),
                  size: 4,
                  style: {
                    textAlign: "left",
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "120%",
                    color: "contrast.200",
                    paddingRight: "0",
                  },
                },
                {
                  value: `${absoluteConvertCurrencyWithDollar(
                    selectedQuarterData.income,
                  )}`,
                  size: 4,
                  style: {
                    textAlign: "end",
                    fontWeight: "400",
                    fontSize: "20px",
                    lineHeight: "120%",
                    color: "contrast.200",
                    paddingRight: "0",
                  },
                },
              ],
            },
          ]}
        />
      </Box>

      <Box>
        <Box
          mb={{ base: "48px", lgp: "120px", md: "64px" }}
          width={{ base: "100", lgp: "80%", md: "100%" }}
        >
          <Text
            aria-label="Deal Name"
            role={"contentinfo"}
            fontSize="20px"
            fontWeight="400"
            color="primary.500"
          >
            {selectedQuarterData.name}
          </Text>
          <Text
            aria-label="Region"
            role={"contentinfo"}
            fontSize="18px"
            fontWeight="700"
            color="contrast.200"
            m="24px 0"
          >
            {t(
              `common:client.regions.${selectedQuarterData.brochure?.address}`,
            )}
          </Text>
          <Box>
            <Text
              aria-label="Description"
              role={"contentinfo"}
              fontSize="18px"
              fontWeight="400"
              color="contrast.200"
              m="24px 0"
              style={{
                direction: lang.includes("ar") ? "ltr" : "initial",
              }}
            >
              {selectedQuarterData.brochure?.description}
            </Text>
          </Box>
        </Box>
        <Dealgallery
          largeImageURL={selectedQuarterData.brochure?.largeImageURL}
          smallImage1URL={selectedQuarterData.brochure?.smallImage1URL}
          smallImage2URL={selectedQuarterData.brochure?.smallImage2URL}
        />
      </Box>
    </Fragment>
  )
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async function (ctx) {
    const sesison = getSession(ctx.req, ctx.res)
    if (sesison?.mandateId && ctx?.params?.dealId) {
      return {
        props: {
          dealId: ctx?.params?.dealId,
        }, // will be passed to the page component as props
      }
    }
    return {
      notFound: true,
    }
  },
})
