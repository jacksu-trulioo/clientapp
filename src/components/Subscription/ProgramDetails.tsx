import {
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/layout"
import { Box, Tag, useBreakpointValue } from "@chakra-ui/react"
import ky from "ky"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect, useState } from "react"

import { IslamIcon, SkeletonCard } from "~/components"
import useStore from "~/hooks/useStore"
import {
  InvestmentCartDealDetails,
  ProgramsDetails,
  SubscriptionDealsDetail,
} from "~/services/mytfo/clientTypes"

import ProgramCard from "./ProgramCard"

type GetProgramDealParamsType = {
  concentration: number
  programId: number
  subscriptionAmount: string
  isInvestmentPreferenceShariah: boolean
  associatedConventionalProgramId: number | undefined
}

export default function ProgramDetails({
  setIsProgramButtonDisabled,
}: {
  setIsProgramButtonDisabled: Function
}) {
  const { t } = useTranslation("subscription")
  const isFullWidth = useBreakpointValue({ base: true, md: false })
  const isTabletView = useBreakpointValue({
    base: false,
    md: true,
    lgp: false,
  })
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [programDeals, setProgramDeals] = useState<ProgramsDetails[]>([])
  const [allCartDeals, setAllCartDeals] = useState<InvestmentCartDealDetails[]>(
    [],
  )
  const [subscriptionDealsAndPrograms, setSubscriptionDealsAndPrograms] =
    useStore((state) => [
      state.subscriptionDealsAndPrograms,
      state.setSubscriptionDealsAndPrograms,
    ])

  useEffect(() => {
    getProgramDeals()
  }, [])

  useEffect(() => {
    setSubscriptionDealsAndPrograms([...allCartDeals])
  }, [allCartDeals])

  const getProgramDeals = async () => {
    setIsLoading(true)
    try {
      var allDealArry: InvestmentCartDealDetails[] = []
      var programParamsData: GetProgramDealParamsType[] = []
      subscriptionDealsAndPrograms.forEach((data) => {
        if (data.isProgram) {
          programParamsData.push({
            concentration: Number(data.concentration),
            programId: data.opportunityId,
            subscriptionAmount: `${data.investmentAmountKey}`,
            isInvestmentPreferenceShariah: data.isInvestmentPreferenceShariah,
            associatedConventionalProgramId: data.associatedConventionalDealId,
          })
        }
        allDealArry.push({ ...data })
      })

      var params = {
        programs: programParamsData,
      }

      var response = await ky
        .post(`/api/client/deals/program-deals`, {
          json: params,
        })
        .json<ProgramsDetails[]>()

      var setPreSelectedDeals = response?.map((x) => {
        var preSelectedDeals = 0

        var allDealDataIndex = allDealArry.findIndex(({ opportunityId }) => {
          return opportunityId == x.programId
        })

        var deals: SubscriptionDealsDetail[] = x.deals.map((deal) => {
          var value = subscriptionDealsAndPrograms
            .find(({ opportunityId }) => {
              return opportunityId == x.programId
            })
            ?.programDeals?.find(({ dealId }) => {
              return dealId == deal.dealId
            })?.isSelected
            ? true
            : deal.defaultSelection
            ? true
            : false
          if (value) {
            preSelectedDeals += 1
          }
          return {
            ...deal,
            isSelected: value,
          }
        })

        allDealArry[allDealDataIndex].programDeals = deals
        setAllCartDeals([...allDealArry])
        x.selectedDeal = preSelectedDeals
        x.deals = deals
        return x
      })
      setProgramDeals(setPreSelectedDeals)
      setIsLoading(false)
      setIsProgramButtonDisabled(false)
    } catch (error) {
      console.log(error, "error")
    }
  }

  const onChangeHandler = (
    value: boolean,
    programIndex: number,
    dealIndex: number,
  ) => {
    var dealCount = programDeals[programIndex].selectedDeal || 0
    var programConcentration =
      programDeals[programIndex].concentration == 20
        ? 5
        : programDeals[programIndex].concentration == 10
        ? 10
        : 20
    if (dealCount + 1 <= programConcentration || !value) {
      if (value) {
        dealCount = dealCount + 1
      } else {
        dealCount = dealCount - 1
      }
      var programs: ProgramsDetails[] = []
      programDeals.forEach((program, index) => {
        if (index == programIndex) {
          programs.push({
            ...program,
            selectedDeal: dealCount,
            deals: program.deals.map((deal, i) => {
              if (i == dealIndex) {
                return {
                  ...deal,
                  isSelected: value,
                }
              } else {
                return {
                  ...deal,
                }
              }
            }),
          })
        } else {
          programs.push({
            ...program,
          })
        }
      })

      var allDealData = allCartDeals.map((x) => {
        let data = { ...x }
        if (data.opportunityId == programs[programIndex].programId) {
          data.programDeals = programs[programIndex].deals.filter(
            ({ isSelected, defaultSelection }) => {
              return isSelected || defaultSelection
            },
          )
        }
        return data
      })
      setProgramDeals([...programs])
      setAllCartDeals([...allDealData])
    }
  }

  const getDealCount = (
    concentration: number,
    deals: SubscriptionDealsDetail[],
  ) => {
    if (concentration == 20 && deals.length >= 5) {
      return 5
    } else if (concentration == 10 && deals.length >= 10) {
      return 10
    } else if (concentration == 5 && deals.length >= 20) {
      return 20
    } else {
      return deals.length
    }
  }

  return (
    <Flex py={{ base: 2, md: 16 }} direction={{ base: "column", md: "row" }}>
      <Container flex="1" maxW={{ base: "full", md: "300px" }} px="0">
        <Heading
          mb={{ base: 4, md: 6 }}
          fontSize={{ base: "2xl", md: "30px", lgp: "30px" }}
        >
          {t("programDetails.headng")}
        </Heading>
        <Text color="gray.500" fontSize="16px">
          {t("programDetails.description")}
        </Text>
      </Container>

      <Center px={{ base: 0, md: "64px" }} py={{ base: "32px", md: 0 }}>
        <Divider orientation={isFullWidth ? "horizontal" : "vertical"} />
      </Center>
      <Container
        flex={isTabletView ? "2" : "1"}
        px="0"
        {...(isMobileView && { mb: "36" })}
        // h="100vh"
      >
        {isLoading ? (
          <SkeletonCard flex="1" mb="12px" />
        ) : programDeals?.length ? (
          <Box>
            {programDeals.map(
              (
                {
                  programName,
                  deals,
                  concentration,
                  selectedDeal,
                  isInvestmentPreferenceShariah,
                },
                i,
              ) => {
                if (deals.length) {
                  return (
                    <Box>
                      <Tag
                        size={"sm"}
                        key={"sm"}
                        mb="5"
                        variant="solid"
                        fontSize={"16px"}
                        fontWeight="semibold"
                        borderRadius="full"
                        padding=" 5px 12px"
                        color="gray.900"
                        bgColor="lightGreen.100"
                      >
                        {programDeals.length > 1
                          ? `${t(`common:client.program`)} 0${i + 1}`
                          : `${t(`common:client.program`)}`}
                      </Tag>
                      <Box display="flex">
                        <Text
                          fontSize="16px"
                          fontWeight="medium"
                          color="white"
                          mr={2}
                        >
                          {programName}
                        </Text>
                        {isInvestmentPreferenceShariah ? (
                          <IslamIcon color="secondary.500" mr={3} />
                        ) : (
                          false
                        )}
                      </Box>
                      <Text
                        fontSize="14px"
                        fontWeight="400"
                        mt="2"
                        color="white"
                        mb="5"
                      >
                        {t("programDetails.programDeals")}
                      </Text>
                      {deals.map((deal, j) => (
                        <ProgramCard
                          key={j}
                          dealIndex={j}
                          programIndex={i}
                          onChangeHandler={onChangeHandler}
                          deal={deal}
                        />
                      ))}
                      <Box display="flex" mt="3" mb="5">
                        <Text
                          aria-label="Deals selected"
                          role={"paragraph"}
                          color="white"
                          fontWeight="400"
                          fontSize="14px"
                          fontStyle="italic"
                          mr="4px"
                        >
                          {selectedDeal}/{getDealCount(concentration, deals)}{" "}
                        </Text>
                        <Text
                          color="gray.500"
                          fontWeight="400"
                          fontSize="14px"
                          fontStyle="italic"
                        >
                          {" "}
                          {t("programDetails.selectedCountText")}
                        </Text>
                      </Box>
                    </Box>
                  )
                }
              },
            )}{" "}
          </Box>
        ) : (
          false
        )}

        <Box display="flex" mt="3" mb="3">
          {" "}
          <Text
            color="gray.500"
            fontWeight="400"
            fontSize="14px"
            fontStyle="italic"
          >
            <Text
              as="span"
              color="white"
              fontWeight="400"
              fontSize="14px"
              fontStyle="italic"
              mr="8px"
            >
              {t("programDetails.note.title")}{" "}
            </Text>{" "}
            {t("programDetails.note.description")}
          </Text>
        </Box>
        <Box h={"20px"}></Box>
      </Container>
    </Flex>
  )
}
