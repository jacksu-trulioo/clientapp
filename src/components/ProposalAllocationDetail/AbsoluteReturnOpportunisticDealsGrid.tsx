import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  chakra,
  Divider,
  Flex,
  Stack,
  Text,
  Tooltip,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import { InfoIcon } from "~/components"
import {
  AdditionalPreference,
  AllocationCategory,
  InvestorProfileGoals,
  ProposalDealsGridAssets,
  ProposalDealsGridObj,
} from "~/services/mytfo/types"

type CapitalDealsGridProps = {
  componentName?: string
  gridDealsList: ProposalDealsGridObj[]
  strategy?: string
  pdfGenerating: boolean
}

const AbsoluteReturnOpportunisticDealsGrid: React.FC<CapitalDealsGridProps> = (
  props,
) => {
  const isMobileView = useBreakpointValue({ base: true, md: false })
  let [assets, setAssets] = React.useState<ProposalDealsGridAssets[]>([])

  const { data: investmentGoals } = useSWR<InvestorProfileGoals>(
    "/api/user/investment-goals",
  )

  const isSharia = investmentGoals?.additionalPreferences?.includes(
    AdditionalPreference?.ShariahCompliant,
  )

  React.useEffect(() => {
    let tempArr = [] as ProposalDealsGridAssets[]
    props?.gridDealsList.map((item) => {
      item?.assets.map((child) => {
        tempArr.push(child)
      })
    })
    setAssets([...tempArr])
  }, [props?.componentName])

  const { t } = useTranslation("personalizedProposal")

  const checkStrategy = (value: string) => {
    if (value === AllocationCategory.Opportunistic) return "opportunistic"
    if (value === AllocationCategory.AbsoluteReturn) return "absoluteReturn"
    return ""
  }

  return (
    <Accordion
      {...(props.pdfGenerating && { defaultIndex: [0, 1, 2, 3, 4] })}
      {...(!props.pdfGenerating && { allowToggle: true })}
      bgColor="gray.800"
      variant={checkStrategy(props?.strategy || "")}
      {...(props &&
        props?.gridDealsList.length === 1 && {
          defaultIndex: [0],
        })}
      mb="2"
    >
      {(assets || []).map(
        (activeDeal: ProposalDealsGridAssets, index: number) => {
          return !isSharia && !activeDeal?.preferences ? (
            <AccordionItem
              aria-label="fundsAccordion"
              mb={0}
              key={index}
              borderBottom="8px"
              borderBottomColor="gray.900"
            >
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="start">
                    {activeDeal.title}
                  </Box>
                  <AccordionIcon ml={5} />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text fontSize="sm" color="gray.400">
                  {activeDeal?.description}
                </Text>
                <Text
                  mt="12"
                  textAlign="center"
                  mb="7"
                  fontSize="sm"
                  color="gray.400"
                >
                  {t(
                    "yourAllocationDetail.absoluteReturnOpportunisticDetail.heading",
                  )}
                </Text>
                <Flex flexDirection={{ base: "column", md: "row" }}>
                  <VStack width={{ base: "full", md: "50%" }}>
                    <Stack
                      aria-label="assets"
                      w="full"
                      justifyContent="flex-start"
                      spacing={{ base: 4, md: 6 }}
                      direction={{ base: "column", md: "row" }}
                      py={{ base: 5, md: 3 }}
                    >
                      <Text flex="1" fontSize="xs" color="gray.400">
                        {t(
                          "yourAllocationDetail.absoluteReturnOpportunisticDetail.labels.targetReturn",
                        )}{" "}
                        <Tooltip
                          hasArrow
                          label={t(
                            "yourAllocationDetail.absoluteReturnOpportunisticDetail.tooltip.targetReturn",
                          )}
                          placement="bottom"
                          textAlign="center"
                        >
                          <chakra.span>
                            <InfoIcon
                              aria-label="Info icon"
                              color="primary.500"
                              cursor="pointer"
                              h={13}
                              w={13}
                            />
                          </chakra.span>
                        </Tooltip>
                      </Text>
                      <Text
                        flex="1"
                        fontSize="xs"
                        color="gray.400"
                        fontWeight="extrabold"
                      >
                        {activeDeal?.targetReturn}
                      </Text>
                    </Stack>
                    <Divider></Divider>
                    <Stack
                      aria-label="assets"
                      w="full"
                      justifyContent="flex-start"
                      spacing={{ base: 4, md: 6 }}
                      direction={{ base: "column", md: "row" }}
                      py={{ base: 5, md: 3 }}
                    >
                      <Text flex="1" fontSize="xs" color="gray.400">
                        {t(
                          "yourAllocationDetail.absoluteReturnOpportunisticDetail.labels.targetYield",
                        )}{" "}
                        <Tooltip
                          hasArrow
                          label={t(
                            "yourAllocationDetail.absoluteReturnOpportunisticDetail.tooltip.targetYield",
                          )}
                          placement="bottom"
                          textAlign="center"
                        >
                          <chakra.span>
                            <InfoIcon
                              aria-label="Info icon"
                              color="primary.500"
                              cursor="pointer"
                              h={13}
                              w={13}
                            />
                          </chakra.span>
                        </Tooltip>
                      </Text>
                      <Text
                        flex="1"
                        fontSize="xs"
                        color="gray.400"
                        fontWeight="extrabold"
                      >
                        {activeDeal?.targetYield}
                      </Text>
                    </Stack>
                    <Divider></Divider>
                    <Stack
                      aria-label="assets"
                      w="full"
                      justifyContent="flex-start"
                      spacing={{ base: 4, md: 6 }}
                      direction={{ base: "column", md: "row" }}
                      py={{ base: 5, md: 3 }}
                    >
                      <Text flex="1" fontSize="xs" color="gray.400">
                        {t(
                          "yourAllocationDetail.absoluteReturnOpportunisticDetail.labels.fundTerm",
                        )}{" "}
                        <Tooltip
                          hasArrow
                          label={t(
                            "yourAllocationDetail.absoluteReturnOpportunisticDetail.tooltip.fundTerm",
                          )}
                          placement="bottom"
                          textAlign="center"
                        >
                          <chakra.span>
                            <InfoIcon
                              aria-label="Info icon"
                              color="primary.500"
                              cursor="pointer"
                              h={13}
                              w={13}
                            />
                          </chakra.span>
                        </Tooltip>
                      </Text>
                      <Text
                        flex="1"
                        fontSize="xs"
                        color="gray.400"
                        fontWeight="extrabold"
                      >
                        {activeDeal?.fundTerm}
                      </Text>
                    </Stack>
                    <Divider></Divider>
                    <Stack
                      aria-label="assets"
                      w="full"
                      justifyContent="flex-start"
                      spacing={{ base: 4, md: 6 }}
                      direction={{ base: "column", md: "row" }}
                      py={{ base: 5, md: 3 }}
                    >
                      <Text flex="1" fontSize="xs" color="gray.400">
                        {t(
                          "yourAllocationDetail.absoluteReturnOpportunisticDetail.labels.initialOfferingPeriod",
                        )}{" "}
                        <Tooltip
                          hasArrow
                          label={t(
                            "yourAllocationDetail.absoluteReturnOpportunisticDetail.tooltip.initialOfferingPeriod",
                          )}
                          placement="bottom"
                          textAlign="center"
                        >
                          <chakra.span>
                            <InfoIcon
                              aria-label="Info icon"
                              color="primary.500"
                              cursor="pointer"
                              h={13}
                              w={13}
                            />
                          </chakra.span>
                        </Tooltip>
                      </Text>
                      <Text
                        flex="1"
                        fontSize="xs"
                        color="gray.400"
                        fontWeight="extrabold"
                      >
                        {activeDeal?.offeringPeriod}
                      </Text>
                    </Stack>
                    <Divider></Divider>
                    <Stack
                      aria-label="assets"
                      w="full"
                      justifyContent="flex-start"
                      spacing={{ base: 4, md: 6 }}
                      direction={{ base: "column", md: "row" }}
                      py={{ base: 5, md: 3 }}
                    >
                      <Text flex="1" fontSize="xs" color="gray.400">
                        {t(
                          "yourAllocationDetail.absoluteReturnOpportunisticDetail.labels.administrator",
                        )}{" "}
                      </Text>
                      <Text
                        flex="1"
                        fontSize="xs"
                        fontWeight="extrabold"
                        color="gray.400"
                      >
                        {activeDeal?.administrator}
                      </Text>
                    </Stack>
                    <Divider></Divider>
                    <Stack
                      aria-label="assets"
                      w="full"
                      justifyContent="flex-start"
                      spacing={{ base: 4, md: 6 }}
                      direction={{ base: "column", md: "row" }}
                      py={{ base: 5, md: 3 }}
                    >
                      <Text flex="1" fontSize="xs" color="gray.400">
                        {t(
                          "yourAllocationDetail.absoluteReturnOpportunisticDetail.labels.auditor",
                        )}{" "}
                      </Text>
                      <Text
                        flex="1"
                        fontSize="xs"
                        color="gray.400"
                        fontWeight="extrabold"
                      >
                        {activeDeal?.auditor}
                      </Text>
                    </Stack>
                    {isMobileView && <Divider></Divider>}
                  </VStack>
                  <VStack
                    width={{ base: "full", md: "50%" }}
                    ms={{ base: 0, md: 4 }}
                  >
                    <Stack
                      aria-label="assets"
                      w="full"
                      justifyContent="flex-start"
                      spacing={{ base: 4, md: 6 }}
                      direction={{ base: "column", md: "row" }}
                      py={{ base: 5 }}
                    >
                      <Text flex="1" fontSize="xs" color="gray.400">
                        {t(
                          "yourAllocationDetail.absoluteReturnOpportunisticDetail.labels.assetClasses",
                        )}{" "}
                      </Text>
                      <Text
                        flex="1"
                        fontSize="xs"
                        color="gray.400"
                        fontWeight="extrabold"
                      >
                        {activeDeal?.assetClass}
                      </Text>
                    </Stack>
                    <Divider></Divider>
                    <Stack
                      aria-label="assets"
                      w="full"
                      justifyContent="flex-start"
                      spacing={{ base: 4, md: 6 }}
                      direction={{ base: "column", md: "row" }}
                      py={{ base: 5, md: 3 }}
                    >
                      <Text flex="1" fontSize="xs" color="gray.400">
                        {t(
                          "yourAllocationDetail.absoluteReturnOpportunisticDetail.labels.shareClasses",
                        )}{" "}
                        <Tooltip
                          hasArrow
                          label={t(
                            "yourAllocationDetail.absoluteReturnOpportunisticDetail.tooltip.shareClass",
                          )}
                          placement="bottom"
                          textAlign="center"
                        >
                          <chakra.span>
                            <InfoIcon
                              aria-label="Info icon"
                              color="primary.500"
                              cursor="pointer"
                              h={13}
                              w={13}
                            />
                          </chakra.span>
                        </Tooltip>
                      </Text>
                      <Text
                        flex="1"
                        fontSize="xs"
                        color="gray.400"
                        fontWeight="extrabold"
                      >
                        {activeDeal?.shareClasses}
                      </Text>
                    </Stack>
                    <Divider></Divider>
                    <Stack
                      aria-label="assets"
                      w="full"
                      justifyContent="flex-start"
                      spacing={{ base: 4, md: 6 }}
                      direction={{ base: "column", md: "row" }}
                      py={{ base: 5, md: 3 }}
                    >
                      <Text flex="1" fontSize="xs" color="gray.400">
                        {t(
                          "yourAllocationDetail.absoluteReturnOpportunisticDetail.labels.redemptions",
                        )}{" "}
                        <Tooltip
                          hasArrow
                          label={t(
                            "yourAllocationDetail.absoluteReturnOpportunisticDetail.tooltip.redemption",
                          )}
                          placement="bottom"
                          textAlign="center"
                        >
                          <chakra.span>
                            <InfoIcon
                              aria-label="Info icon"
                              color="primary.500"
                              cursor="pointer"
                              h={13}
                              w={13}
                            />
                          </chakra.span>
                        </Tooltip>
                      </Text>
                      <Text
                        flex="1"
                        fontSize="xs"
                        color="gray.400"
                        fontWeight="extrabold"
                      >
                        {activeDeal?.redemptions}
                      </Text>
                    </Stack>
                  </VStack>
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          ) : (
            isSharia && activeDeal?.preferences && (
              <AccordionItem
                aria-label="fundsAccordion"
                mb={0}
                key={index}
                borderBottom="8px"
                borderBottomColor="gray.900"
              >
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="start">
                      {activeDeal.title}
                    </Box>
                    <AccordionIcon ml={5} />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Text fontSize="sm" color="gray.400">
                    {activeDeal?.description}
                  </Text>
                  <Text
                    mt="12"
                    textAlign="center"
                    mb="7"
                    fontSize="sm"
                    color="gray.400"
                  >
                    {t(
                      "yourAllocationDetail.absoluteReturnOpportunisticDetail.heading",
                    )}
                  </Text>
                  <Flex flexDirection={{ base: "column", md: "row" }}>
                    <VStack width={{ base: "full", md: "50%" }}>
                      <Stack
                        aria-label="assets"
                        w="full"
                        justifyContent="flex-start"
                        spacing={{ base: 4, md: 6 }}
                        direction={{ base: "column", md: "row" }}
                        py={{ base: 5, md: 3 }}
                      >
                        <Text flex="1" fontSize="xs" color="gray.400">
                          {t(
                            "yourAllocationDetail.absoluteReturnOpportunisticDetail.labels.targetReturn",
                          )}{" "}
                          <Tooltip
                            hasArrow
                            label={t(
                              "yourAllocationDetail.absoluteReturnOpportunisticDetail.tooltip.targetReturn",
                            )}
                            placement="bottom"
                            textAlign="center"
                          >
                            <chakra.span>
                              <InfoIcon
                                aria-label="Info icon"
                                color="primary.500"
                                cursor="pointer"
                                h={13}
                                w={13}
                              />
                            </chakra.span>
                          </Tooltip>
                        </Text>
                        <Text
                          flex="1"
                          fontSize="xs"
                          color="gray.400"
                          fontWeight="extrabold"
                        >
                          {activeDeal?.targetReturn}
                        </Text>
                      </Stack>
                      <Divider></Divider>
                      <Stack
                        aria-label="assets"
                        w="full"
                        justifyContent="flex-start"
                        spacing={{ base: 4, md: 6 }}
                        direction={{ base: "column", md: "row" }}
                        py={{ base: 5, md: 3 }}
                      >
                        <Text flex="1" fontSize="xs" color="gray.400">
                          {t(
                            "yourAllocationDetail.absoluteReturnOpportunisticDetail.labels.targetYield",
                          )}{" "}
                          <Tooltip
                            hasArrow
                            label={t(
                              "yourAllocationDetail.absoluteReturnOpportunisticDetail.tooltip.targetYield",
                            )}
                            placement="bottom"
                            textAlign="center"
                          >
                            <chakra.span>
                              <InfoIcon
                                aria-label="Info icon"
                                color="primary.500"
                                cursor="pointer"
                                h={13}
                                w={13}
                              />
                            </chakra.span>
                          </Tooltip>
                        </Text>
                        <Text
                          flex="1"
                          fontSize="xs"
                          color="gray.400"
                          fontWeight="extrabold"
                        >
                          {activeDeal?.targetYield}
                        </Text>
                      </Stack>
                      <Divider></Divider>
                      <Stack
                        aria-label="assets"
                        w="full"
                        justifyContent="flex-start"
                        spacing={{ base: 4, md: 6 }}
                        direction={{ base: "column", md: "row" }}
                        py={{ base: 5, md: 3 }}
                      >
                        <Text flex="1" fontSize="xs" color="gray.400">
                          {t(
                            "yourAllocationDetail.absoluteReturnOpportunisticDetail.labels.fundTerm",
                          )}{" "}
                          <Tooltip
                            hasArrow
                            label={t(
                              "yourAllocationDetail.absoluteReturnOpportunisticDetail.tooltip.fundTerm",
                            )}
                            placement="bottom"
                            textAlign="center"
                          >
                            <chakra.span>
                              <InfoIcon
                                aria-label="Info icon"
                                color="primary.500"
                                cursor="pointer"
                                h={13}
                                w={13}
                              />
                            </chakra.span>
                          </Tooltip>
                        </Text>
                        <Text
                          flex="1"
                          fontSize="xs"
                          color="gray.400"
                          fontWeight="extrabold"
                        >
                          {activeDeal?.fundTerm}
                        </Text>
                      </Stack>
                      <Divider></Divider>
                      <Stack
                        aria-label="assets"
                        w="full"
                        justifyContent="flex-start"
                        spacing={{ base: 4, md: 6 }}
                        direction={{ base: "column", md: "row" }}
                        py={{ base: 5, md: 3 }}
                      >
                        <Text flex="1" fontSize="xs" color="gray.400">
                          {t(
                            "yourAllocationDetail.absoluteReturnOpportunisticDetail.labels.initialOfferingPeriod",
                          )}{" "}
                          <Tooltip
                            hasArrow
                            label={t(
                              "yourAllocationDetail.absoluteReturnOpportunisticDetail.tooltip.initialOfferingPeriod",
                            )}
                            placement="bottom"
                            textAlign="center"
                          >
                            <chakra.span>
                              <InfoIcon
                                aria-label="Info icon"
                                color="primary.500"
                                cursor="pointer"
                                h={13}
                                w={13}
                              />
                            </chakra.span>
                          </Tooltip>
                        </Text>
                        <Text
                          flex="1"
                          fontSize="xs"
                          color="gray.400"
                          fontWeight="extrabold"
                        >
                          {activeDeal?.offeringPeriod}
                        </Text>
                      </Stack>
                      <Divider></Divider>
                      <Stack
                        aria-label="assets"
                        w="full"
                        justifyContent="flex-start"
                        spacing={{ base: 4, md: 6 }}
                        direction={{ base: "column", md: "row" }}
                        py={{ base: 5, md: 3 }}
                      >
                        <Text flex="1" fontSize="xs" color="gray.400">
                          {t(
                            "yourAllocationDetail.absoluteReturnOpportunisticDetail.labels.administrator",
                          )}{" "}
                        </Text>
                        <Text
                          flex="1"
                          fontSize="xs"
                          fontWeight="extrabold"
                          color="gray.400"
                        >
                          {activeDeal?.administrator}
                        </Text>
                      </Stack>
                      <Divider></Divider>
                      <Stack
                        aria-label="assets"
                        w="full"
                        justifyContent="flex-start"
                        spacing={{ base: 4, md: 6 }}
                        direction={{ base: "column", md: "row" }}
                        py={{ base: 5, md: 3 }}
                      >
                        <Text flex="1" fontSize="xs" color="gray.400">
                          {t(
                            "yourAllocationDetail.absoluteReturnOpportunisticDetail.labels.auditor",
                          )}{" "}
                        </Text>
                        <Text
                          flex="1"
                          fontSize="xs"
                          color="gray.400"
                          fontWeight="extrabold"
                        >
                          {activeDeal?.auditor}
                        </Text>
                      </Stack>
                      {isMobileView && <Divider></Divider>}
                    </VStack>
                    <VStack
                      width={{ base: "full", md: "50%" }}
                      ms={{ base: 0, md: 4 }}
                    >
                      <Stack
                        aria-label="assets"
                        w="full"
                        justifyContent="flex-start"
                        spacing={{ base: 4, md: 6 }}
                        direction={{ base: "column", md: "row" }}
                        py={{ base: 5 }}
                      >
                        <Text flex="1" fontSize="xs" color="gray.400">
                          {t(
                            "yourAllocationDetail.absoluteReturnOpportunisticDetail.labels.assetClasses",
                          )}{" "}
                        </Text>
                        <Text
                          flex="1"
                          fontSize="xs"
                          color="gray.400"
                          fontWeight="extrabold"
                        >
                          {activeDeal?.assetClass}
                        </Text>
                      </Stack>
                      <Divider></Divider>
                      <Stack
                        aria-label="assets"
                        w="full"
                        justifyContent="flex-start"
                        spacing={{ base: 4, md: 6 }}
                        direction={{ base: "column", md: "row" }}
                        py={{ base: 5, md: 3 }}
                      >
                        <Text flex="1" fontSize="xs" color="gray.400">
                          {t(
                            "yourAllocationDetail.absoluteReturnOpportunisticDetail.labels.shareClasses",
                          )}{" "}
                          <Tooltip
                            hasArrow
                            label={t(
                              "yourAllocationDetail.absoluteReturnOpportunisticDetail.tooltip.shareClass",
                            )}
                            placement="bottom"
                            textAlign="center"
                          >
                            <chakra.span>
                              <InfoIcon
                                aria-label="Info icon"
                                color="primary.500"
                                cursor="pointer"
                                h={13}
                                w={13}
                              />
                            </chakra.span>
                          </Tooltip>
                        </Text>
                        <Text
                          flex="1"
                          fontSize="xs"
                          color="gray.400"
                          fontWeight="extrabold"
                        >
                          {activeDeal?.shareClasses}
                        </Text>
                      </Stack>
                      <Divider></Divider>
                      <Stack
                        aria-label="assets"
                        w="full"
                        justifyContent="flex-start"
                        spacing={{ base: 4, md: 6 }}
                        direction={{ base: "column", md: "row" }}
                        py={{ base: 5, md: 3 }}
                      >
                        <Text flex="1" fontSize="xs" color="gray.400">
                          {t(
                            "yourAllocationDetail.absoluteReturnOpportunisticDetail.labels.redemptions",
                          )}{" "}
                          <Tooltip
                            hasArrow
                            label={t(
                              "yourAllocationDetail.absoluteReturnOpportunisticDetail.tooltip.redemption",
                            )}
                            placement="bottom"
                            textAlign="center"
                          >
                            <chakra.span>
                              <InfoIcon
                                aria-label="Info icon"
                                color="primary.500"
                                cursor="pointer"
                                h={13}
                                w={13}
                              />
                            </chakra.span>
                          </Tooltip>
                        </Text>
                        <Text
                          flex="1"
                          fontSize="xs"
                          color="gray.400"
                          fontWeight="extrabold"
                        >
                          {activeDeal?.redemptions}
                        </Text>
                      </Stack>
                    </VStack>
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            )
          )
        },
      )}
    </Accordion>
  )
}
export default React.memo(AbsoluteReturnOpportunisticDealsGrid)
