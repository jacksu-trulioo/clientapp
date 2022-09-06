import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import {
  Accordion,
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Hide,
  Show,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import ky from "ky"
import moment from "moment"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useEffect, useState } from "react"
import useSWR from "swr"

import {
  AccordionWithTable,
  CashFlowsHeader,
  CashFlowsTableHeader,
  ClientLayout,
  FeedbackModal,
  ModalBox,
  NoDataFound,
  PageContainer,
  ResponsiveTable,
  SkeletonCard,
} from "~/components"
import siteConfig from "~/config"
import { useUser } from "~/hooks/useUser"
import { DealDistributionTypes } from "~/services/mytfo/clientTypes"
import { FeedbackSubmissionScreen } from "~/services/mytfo/types"
import {
  getFeedbackCookieStatus,
  setFeedbackCookieStatus,
} from "~/utils/clientUtils/feedbackCookieUtilities"
import { absoluteConvertCurrencyWithDollar } from "~/utils/clientUtils/globalUtilities"
import { downloadBlob } from "~/utils/downloadBlob"
import { downloadedExcel, screenSpentTime } from "~/utils/googleEventsClient"
import { clientEvent } from "~/utils/gtag"

export default function CashflowsDashboard() {
  const { t, lang } = useTranslation("cashflow")
  const [filterType, setFilterType] = useState("desc")
  const [isPageLoading, setIsPageLoading] = useState(true)
  const {
    isOpen: isFeedbackModalOpen,
    onOpen: onFeedbackModalOpen,
    onClose: onFeedbackModalClose,
  } = useDisclosure()

  const onFilterReset = () => {
    setFilterType("desc")
  }

  const { data: cashflowData, error } = useSWR<DealDistributionTypes>(
    `/api/client/deals/get-deal-distribution-details?orderBy=${filterType}`,
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  )

  const isLoading = !cashflowData && !error
  const { user } = useUser()
  useEffect(() => {
    const openTime = moment(new Date())
    return () => {
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        screenSpentTime,
        "Cash Flows",
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

  const downloadTableDataInExcel = async () => {
    let response = await ky.post("/api/client/generate-excel-file", {
      json: {
        type: "cashflow",
      },
    })
    let fileData = await response.blob()
    let fileName = `${user?.mandateId}-Cashflow`
    downloadBlob(window.URL.createObjectURL(fileData), fileName)
    clientEvent(
      downloadedExcel,
      "Cash Flows",
      fileName,
      user?.mandateId as string,
      user?.email as string,
    )
    if (
      getFeedbackCookieStatus(siteConfig.clientFeedbackSessionVariableName) ==
      "true"
    ) {
      setTimeout(() => {
        onFeedbackModalOpen()
      }, 500)
    }
  }

  return (
    <Fragment>
      <ClientLayout
        title={t("page.title")}
        description={t("page.description")}
        footerRequired={false}
      >
        <PageContainer
          isLoading={isPageLoading}
          as="section"
          maxW="full"
          px="0"
          mt={{ base: 8, md: 8, lgp: 0 }}
          filter={isPageLoading ? "blur(3px)" : "none"}
        >
          {isLoading ? (
            <SkeletonCard flex="1" mb="25px" mt="20px" />
          ) : cashflowData?.distributionPerTimePeriod ? (
            <Box>
              <Box mb={{ lgp: "32px", md: "0", base: "0" }}>
                <CashFlowsHeader cashflowData={cashflowData} />
              </Box>
              <Box pt="48px">
                <CashFlowsTableHeader
                  filterType={filterType}
                  updateData={setFilterType}
                  yearFrom={cashflowData?.yearFrom || ""}
                  yearTo={cashflowData?.yearTo || ""}
                  onFilterReset={onFilterReset}
                  downloadTableDataInExcel={downloadTableDataInExcel}
                />
              </Box>
              <Box>
                <Show below="md">
                  {cashflowData.distributionPerTimePeriod.length
                    ? cashflowData.distributionPerTimePeriod.map(
                        ({ timeperiod, spvList }, z) => (
                          <Fragment key={z}>
                            <Heading
                              fontStyle="normal"
                              fontWeight="400"
                              fontSize="14px"
                              color="gray.400"
                              m="24px 0 8px"
                            >
                              {t(
                                `common:client.quarters.quarter_${timeperiod.quarter}`,
                              )}
                              {" - "} {timeperiod.year}
                            </Heading>
                            {spvList.map(
                              (
                                {
                                  spvLongName,
                                  spvName,
                                  totalDistributions,
                                  dealsData,
                                },
                                i,
                              ) => (
                                <Box
                                  key={i}
                                  bgColor="gray.850"
                                  borderRadius="2px"
                                  borderWidth="1px"
                                  borderStyle="solid"
                                  borderColor="gray.800"
                                  display={{ base: "block", md: "none" }}
                                  mb="8px"
                                >
                                  <Box
                                    p="16px"
                                    bgColor="gray.800"
                                    borderBottom="solid"
                                    borderBottomWidth="1px"
                                    borderBottomColor="gray.800"
                                  >
                                    <Heading
                                      fontSize="14px"
                                      fontWeight="500"
                                      color="contrast.200"
                                    >
                                      {spvLongName}
                                    </Heading>
                                  </Box>
                                  <Box
                                    borderBottomStyle="solid"
                                    borderBottomWidth="1px"
                                    borderBottomColor="gray.750"
                                    mb="16px"
                                    mt="8px"
                                    pb="16px"
                                  >
                                    <ResponsiveTable
                                      bgColor="gray.850"
                                      isCustomBgColor={true}
                                      borderRadius="2px"
                                      tableItem={[
                                        {
                                          key: t(
                                            "investmentVehicle.tableHeader.spv",
                                          ),
                                          style: {
                                            color: "gray.500",
                                            fontSize: "14px",
                                            fontWeight: "400",
                                            lineHeight: "120%",
                                          },
                                          value: spvName,
                                          valueStyle: {
                                            color: "contrast.200",
                                            fontSize: "14px",
                                            fontWeight: "700",
                                          },
                                        },
                                        {
                                          key: t(
                                            "investmentVehicle.tableHeader.totalAmount",
                                          ),
                                          style: {
                                            color: "gray.500",
                                            fontSize: "14px",
                                            fontWeight: "400",
                                            lineHeight: "120%",
                                          },
                                          value:
                                            absoluteConvertCurrencyWithDollar(
                                              totalDistributions,
                                            ),
                                          valueStyle: {
                                            color: "contrast.200",
                                            fontSize: "14px",
                                            fontWeight: "700",
                                          },
                                        },
                                      ]}
                                    />
                                  </Box>
                                  {dealsData.map(
                                    (
                                      {
                                        dealName,
                                        distributionDate,
                                        type,
                                        amount,
                                      },
                                      j,
                                    ) => (
                                      <Box key={j} p="2px 16px 16px">
                                        <ResponsiveTable
                                          header={dealName}
                                          isHeader
                                          bgColor={
                                            j % 2 == 0 ? "gray.850" : "gray.800"
                                          }
                                          isCustomBgColor={true}
                                          borderRadius="2px"
                                          tableItem={[
                                            {
                                              key: t(
                                                "investmentVehicle.tableHeader.distributionDate",
                                              ),
                                              style: {
                                                color: "gray.500",
                                                fontSize: "14px",
                                                fontWeight: "400",
                                                lineHeight: "120%",
                                              },
                                              value:
                                                moment(distributionDate).format(
                                                  "DD.MM.YYYY",
                                                ),
                                              valueStyle: {
                                                color: "contrast.200",
                                                fontSize: "14px",
                                                fontWeight: "400",
                                              },
                                            },
                                            {
                                              key: t(
                                                "investmentVehicle.tableHeader.type",
                                              ),
                                              style: {
                                                color: "gray.500",
                                                fontSize: "14px",
                                                fontWeight: "400",
                                                lineHeight: "120%",
                                              },
                                              value: type,
                                              valueStyle: {
                                                color: "contrast.200",
                                                fontSize: "14px",
                                                fontWeight: "400",
                                              },
                                            },

                                            {
                                              key: t(
                                                "investmentVehicle.tableHeader.distributionAmount",
                                              ),
                                              style: {
                                                color: "gray.500",
                                                fontSize: "14px",
                                                fontWeight: "400",
                                                lineHeight: "120%",
                                              },
                                              value:
                                                absoluteConvertCurrencyWithDollar(
                                                  amount,
                                                ),
                                              valueStyle: {
                                                color: "contrast.200",
                                                fontSize: "14px",
                                                fontWeight: "400",
                                              },
                                            },
                                          ]}
                                        />
                                      </Box>
                                    ),
                                  )}
                                </Box>
                              ),
                            )}
                          </Fragment>
                        ),
                      )
                    : false}
                </Show>
                <Hide below="md">
                  <Accordion allowToggle defaultIndex={[0]}>
                    {cashflowData.distributionPerTimePeriod.length ? (
                      cashflowData.distributionPerTimePeriod.map(
                        ({ timeperiod, spvList }) => {
                          return spvList.map(
                            (
                              {
                                spvLongName,
                                spvName,
                                totalDistributions,
                                dealsData,
                              },
                              i,
                            ) => (
                              <AccordionWithTable
                                key={i}
                                header={
                                  i == 0 ? (
                                    <Flex
                                      flex="1"
                                      textAlign="start"
                                      p={{
                                        md: "24px 78px 8px 16px",
                                        lgp: "24px 104px 8px 16px",
                                      }}
                                      mt="0"
                                    >
                                      <Hide below="lgp">
                                        <Grid
                                          templateColumns="repeat(8, 1fr)"
                                          gap="20px"
                                          w="100%"
                                        >
                                          <GridItem colSpan={4}>
                                            <Heading
                                              fontStyle="normal"
                                              fontWeight="400"
                                              fontSize="14px"
                                              color="gray.400"
                                            >
                                              {t(
                                                `common:client.quarters.quarter_${timeperiod.quarter}`,
                                              )}
                                              {" - "} {timeperiod.year}
                                            </Heading>
                                          </GridItem>
                                          <GridItem
                                            colSpan={
                                              lang.includes("en") ? 2 : 3
                                            }
                                          >
                                            <Heading
                                              fontStyle="normal"
                                              fontWeight="400"
                                              fontSize="14px"
                                              color="gray.400"
                                            >
                                              {t(
                                                "investmentVehicle.tableHeader.spv",
                                              )}
                                            </Heading>
                                          </GridItem>
                                          <GridItem
                                            colSpan={
                                              lang.includes("en") ? 2 : 1
                                            }
                                            textAlign="end"
                                            dir="ltr"
                                          >
                                            <Heading
                                              fontStyle="normal"
                                              fontWeight="400"
                                              fontSize="14px"
                                              color="gray.400"
                                            >
                                              {t(
                                                "investmentVehicle.tableHeader.totalAmount",
                                              )}
                                            </Heading>
                                          </GridItem>
                                        </Grid>
                                      </Hide>
                                      <Show below="lgp">
                                        <Hide below="md">
                                          <Grid
                                            templateColumns="repeat(5, 1fr)"
                                            gap="20px"
                                            w="100%"
                                          >
                                            <GridItem colSpan={3}>
                                              <Heading
                                                fontStyle="normal"
                                                fontWeight="400"
                                                fontSize="14px"
                                                color="gray.400"
                                              >
                                                {t(
                                                  `common:client.quarters.quarter_${timeperiod.quarter}`,
                                                )}
                                                {" - "} {timeperiod.year}
                                              </Heading>
                                            </GridItem>
                                            <GridItem colSpan={1}>
                                              <Heading
                                                fontStyle="normal"
                                                fontWeight="400"
                                                fontSize="14px"
                                                color="gray.400"
                                              >
                                                {t(
                                                  "investmentVehicle.tableHeader.spv",
                                                )}
                                              </Heading>
                                            </GridItem>
                                            <GridItem
                                              colSpan={1}
                                              textAlign="end"
                                              dir="ltr"
                                            >
                                              <Heading
                                                fontStyle="normal"
                                                fontWeight="400"
                                                fontSize="14px"
                                                color="gray.400"
                                              >
                                                {t(
                                                  "investmentVehicle.tableHeader.totalAmount",
                                                )}
                                              </Heading>
                                            </GridItem>
                                          </Grid>
                                        </Hide>
                                      </Show>
                                    </Flex>
                                  ) : (
                                    false
                                  )
                                }
                                accordionButton={
                                  <Flex
                                    justifyContent="space-between"
                                    flex="1"
                                    textAlign="start"
                                    pe={{ md: "40px", lgp: "70px" }}
                                  >
                                    <Hide below="lgp">
                                      <Grid
                                        templateColumns="repeat(8, 1fr)"
                                        gap="20px"
                                        w="100%"
                                      >
                                        <GridItem colSpan={4}>
                                          <Heading
                                            fontStyle="normal"
                                            fontWeight="500"
                                            fontSize="14px"
                                            whiteSpace="nowrap"
                                            textOverflow="ellipsis"
                                            overflow="hidden"
                                          >
                                            {spvLongName}
                                          </Heading>
                                        </GridItem>
                                        <GridItem
                                          colSpan={lang.includes("en") ? 2 : 3}
                                        >
                                          <Heading
                                            fontStyle="normal"
                                            fontWeight="500"
                                            fontSize="14px"
                                          >
                                            {spvName}
                                          </Heading>
                                        </GridItem>
                                        <GridItem
                                          colSpan={lang.includes("en") ? 2 : 1}
                                          textAlign="end"
                                          dir="ltr"
                                        >
                                          <Heading
                                            fontStyle="normal"
                                            fontWeight="500"
                                            fontSize="14px"
                                          >
                                            {absoluteConvertCurrencyWithDollar(
                                              totalDistributions,
                                            )}
                                          </Heading>
                                        </GridItem>
                                      </Grid>
                                    </Hide>
                                    <Show below="lgp">
                                      <Hide below="md">
                                        <Grid
                                          templateColumns="repeat(5, 1fr)"
                                          gap="20px"
                                          w="100%"
                                        >
                                          <GridItem colSpan={3}>
                                            <Heading
                                              fontStyle="normal"
                                              fontWeight="500"
                                              fontSize="14px"
                                              whiteSpace="nowrap"
                                              textOverflow="ellipsis"
                                              overflow="hidden"
                                            >
                                              {spvLongName}
                                            </Heading>
                                          </GridItem>
                                          <GridItem colSpan={1}>
                                            <Heading
                                              fontStyle="normal"
                                              fontWeight="500"
                                              fontSize="14px"
                                            >
                                              {spvName}
                                            </Heading>
                                          </GridItem>
                                          <GridItem
                                            colSpan={1}
                                            textAlign="end"
                                            dir="ltr"
                                          >
                                            <Heading
                                              fontStyle="normal"
                                              fontWeight="500"
                                              fontSize="14px"
                                            >
                                              {absoluteConvertCurrencyWithDollar(
                                                totalDistributions,
                                              )}
                                            </Heading>
                                          </GridItem>
                                        </Grid>
                                      </Hide>
                                    </Show>
                                  </Flex>
                                }
                                accordionPanel={
                                  <Fragment>
                                    <Hide below="lgp">
                                      <Flex
                                        aria-label="Distributions"
                                        role={"columnheader"}
                                        flex="1"
                                        textAlign="left"
                                        bgColor="gray.800"
                                        p="16px 90px 16px 0"
                                        borderRadius="6px 6px 0 0"
                                        borderBottom="solid"
                                        borderBottomWidth="1px"
                                        borderBottomColor="gray.750"
                                      >
                                        <Grid
                                          templateColumns="repeat(8, 1fr)"
                                          gap="20px"
                                          w="100%"
                                        >
                                          <GridItem colSpan={3} ps="16px">
                                            <Text
                                              fontStyle="normal"
                                              fontWeight="700"
                                              fontSize="12px"
                                              color="gray.400"
                                            >
                                              {t(
                                                "investmentVehicle.tableHeader.dealName",
                                              )}
                                            </Text>
                                          </GridItem>
                                          <GridItem
                                            colSpan={
                                              lang.includes("en") ? 3 : 4
                                            }
                                          >
                                            <Grid
                                              templateColumns="repeat(4, 1fr)"
                                              gap={0}
                                              w="100%"
                                            >
                                              <GridItem colSpan={2}>
                                                <Text
                                                  fontStyle="normal"
                                                  fontWeight="700"
                                                  fontSize="12px"
                                                  color="gray.400"
                                                >
                                                  {t(
                                                    "investmentVehicle.tableHeader.distributionDate",
                                                  )}
                                                </Text>
                                              </GridItem>
                                              <GridItem colSpan={2}>
                                                <Text
                                                  fontStyle="normal"
                                                  fontWeight="700"
                                                  fontSize="12px"
                                                  color="gray.400"
                                                >
                                                  {t(
                                                    "investmentVehicle.tableHeader.type",
                                                  )}
                                                </Text>
                                              </GridItem>
                                            </Grid>
                                          </GridItem>
                                          <GridItem
                                            colSpan={
                                              lang.includes("en") ? 2 : 1
                                            }
                                            textAlign="end"
                                            dir="ltr"
                                          >
                                            <Text
                                              fontStyle="normal"
                                              fontWeight="700"
                                              fontSize="12px"
                                              color="gray.400"
                                            >
                                              {t(
                                                "investmentVehicle.tableHeader.distributionAmount",
                                              )}
                                            </Text>
                                          </GridItem>
                                        </Grid>
                                      </Flex>

                                      {dealsData.map(
                                        (
                                          {
                                            dealName,
                                            distributionDate,
                                            type,
                                            amount,
                                          },
                                          j,
                                        ) => (
                                          <Flex
                                            key={j}
                                            flex="1"
                                            textAlign="left"
                                            bgColor="gray.800"
                                            _odd={{
                                              backgroundColor: "gray.850",
                                            }}
                                            p="16px 90px 16px 0"
                                            _last={{
                                              borderRadius: " 0 0 6px 6px",
                                            }}
                                          >
                                            <Grid
                                              templateColumns="repeat(8, 1fr)"
                                              gap="20px"
                                              w="100%"
                                            >
                                              <GridItem colSpan={3} ps="16px">
                                                <Text
                                                  fontStyle="normal"
                                                  fontWeight="400"
                                                  fontSize="14px"
                                                  color="gray.400"
                                                >
                                                  {dealName}
                                                </Text>
                                              </GridItem>
                                              <GridItem
                                                colSpan={
                                                  lang.includes("en") ? 3 : 4
                                                }
                                              >
                                                <Grid
                                                  templateColumns="repeat(4, 1fr)"
                                                  gap={0}
                                                  w="100%"
                                                >
                                                  <GridItem colSpan={2}>
                                                    <Text
                                                      fontStyle="normal"
                                                      fontWeight="400"
                                                      fontSize="14px"
                                                      color="gray.400"
                                                    >
                                                      {moment(
                                                        distributionDate,
                                                      ).format("DD.MM.YYYY")}
                                                    </Text>
                                                  </GridItem>
                                                  <GridItem colSpan={2}>
                                                    <Text
                                                      fontStyle="normal"
                                                      fontWeight="400"
                                                      fontSize="14px"
                                                      color="gray.400"
                                                    >
                                                      {type}
                                                    </Text>
                                                  </GridItem>
                                                </Grid>
                                              </GridItem>
                                              <GridItem
                                                colSpan={
                                                  lang.includes("en") ? 2 : 1
                                                }
                                                textAlign="end"
                                                dir="ltr"
                                              >
                                                <Text
                                                  fontStyle="normal"
                                                  fontWeight="400"
                                                  fontSize="14px"
                                                  color="gray.400"
                                                >
                                                  {absoluteConvertCurrencyWithDollar(
                                                    amount,
                                                  )}
                                                </Text>
                                              </GridItem>
                                            </Grid>
                                          </Flex>
                                        ),
                                      )}
                                    </Hide>
                                    <Show below="lgp">
                                      <Hide below="md">
                                        {" "}
                                        {dealsData.map(
                                          (
                                            {
                                              dealName,
                                              distributionDate,
                                              type,
                                              amount,
                                            },
                                            j,
                                          ) => (
                                            <ResponsiveTable
                                              key={j}
                                              header={dealName}
                                              isHeader
                                              bgColor="gray.850"
                                              borderRadius="6px"
                                              tableItem={[
                                                {
                                                  key: t(
                                                    "investmentVehicle.tableHeader.distributionDate",
                                                  ),
                                                  style: {
                                                    color: "gray.500",
                                                    fontSize: "14px",
                                                    fontWeight: "400",
                                                    lineHeight: "120%",
                                                  },
                                                  value:
                                                    moment(
                                                      distributionDate,
                                                    ).format("DD.MM.YYYY"),
                                                  valueStyle: {
                                                    color: "contrast.200",
                                                    fontSize: "14px",
                                                    fontWeight: "400",
                                                  },
                                                },
                                                {
                                                  key: t(
                                                    "investmentVehicle.tableHeader.type",
                                                  ),
                                                  style: {
                                                    color: "gray.500",
                                                    fontSize: "14px",
                                                    fontWeight: "400",
                                                    lineHeight: "120%",
                                                  },
                                                  value: type,
                                                  valueStyle: {
                                                    color: "contrast.200",
                                                    fontSize: "14px",
                                                    fontWeight: "400",
                                                  },
                                                },

                                                {
                                                  key: t(
                                                    "investmentVehicle.tableHeader.distributionAmount",
                                                  ),
                                                  style: {
                                                    color: "gray.500",
                                                    fontSize: "14px",
                                                    fontWeight: "400",
                                                    lineHeight: "120%",
                                                  },
                                                  value:
                                                    absoluteConvertCurrencyWithDollar(
                                                      amount,
                                                    ),
                                                  valueStyle: {
                                                    color: "contrast.200",
                                                    fontSize: "14px",
                                                    fontWeight: "400",
                                                  },
                                                },
                                              ]}
                                            />
                                          ),
                                        )}
                                      </Hide>
                                    </Show>
                                  </Fragment>
                                }
                              />
                            ),
                          )
                        },
                      )
                    ) : (
                      <Box mt={"15px"}>
                        <NoDataFound isDescription isHeader isIcon />
                      </Box>
                    )}
                  </Accordion>
                </Hide>
              </Box>
            </Box>
          ) : (
            <>
              {
                <ModalBox
                  isOpen={true}
                  modalDescription={t(
                    "common:client.errors.noDate.description",
                  )}
                  modalTitle={t("common:client.errors.noDate.title")}
                  primaryButtonText={t("common:client.errors.noDate.button")}
                  onClose={() => {
                    router.push("/client/portfolio-summary")
                  }}
                  onPrimaryClick={() => {
                    router.push("/client/portfolio-summary")
                  }}
                />
              }
            </>
          )}
          <FeedbackModal
            hideReferalOption={true}
            isOpen={isFeedbackModalOpen}
            onClose={() => {
              onFeedbackModalClose()
              setFeedbackCookieStatus(
                siteConfig.clientFeedbackSessionVariableName,
                false,
                siteConfig.clientFeedbackSessionExpireDays,
              )
            }}
            submissionScreen={FeedbackSubmissionScreen.ClientDownloadTableData}
          />
        </PageContainer>
      </ClientLayout>
    </Fragment>
  )
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async function (ctx) {
    const sesison = getSession(ctx.req, ctx.res)
    if (sesison?.mandateId) {
      return {
        props: {}, // will be passed to the page component as props
      }
    }
    return {
      notFound: true,
    }
  },
})
