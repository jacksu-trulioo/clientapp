import {
  Box,
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/layout"
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Progress,
  StyleProps,
  Tag,
  useBreakpointValue,
} from "@chakra-ui/react"
import { datadogRum } from "@datadog/browser-rum"
import ky from "ky"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useEffect, useState } from "react"
import useSWR, { mutate } from "swr"

import {
  ClientModalFooter,
  ClientModalHeader,
  ClientModalLayout,
  DealCard,
  ExpiredDealCard,
  SkeletonCard,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "~/components"
import useStore from "~/hooks/useStore"
import { useUser } from "~/hooks/useUser"
import {
  InvestmentCartDealDetails,
  SubscriptionDealsDetail,
} from "~/services/mytfo/clientTypes"
import {
  PopupDetailRoot,
  SubscriptionSavedClientAppDbObj,
} from "~/services/mytfo/types"
import { formatCurrencyWithCommas } from "~/utils/formatCurrency"
import {
  clickedConfirmScreen4SubscriptionPage,
  clickedNextScreen1SubscriptionPage,
  clickedNextScreen2SubscriptionPage,
  clickRedeemInvCart,
  exitScreen1SubscriptionPage,
  exitScreen2SubscriptionPage,
  exitScreen4SubscriptionPage,
  removeItemFromInvestmentCart,
} from "~/utils/googleEventsClient"
import { clientUniEvent } from "~/utils/gtag"

import EmptyCart from "./EmptyCart"
import OrderSummary from "./OrderSummary"
import ProgramDetails from "./ProgramDetails"
import SubscriptionConfirmation from "./SubscriptionConfirmation"
import SubscriptionDetails from "./SubscriptionDetails"

type SubscriptionDetailResponseType = {
  subscriptionProgramDTOList: SubscriptionSavedClientAppDbObj[]
  subscriptionDealDTOList: SubscriptionSavedClientAppDbObj[]
}

const InvestmentCartSection = ({
  setIsCart,
  getProgramSelection,
}: {
  setIsCart: Function
  getProgramSelection: Function
}) => {
  const { lang } = useTranslation()
  const { user } = useUser()

  const {
    data: cartData,
    error,
    isValidating,
  } = useSWR<InvestmentCartDealDetails[]>(
    `/api/client/deals/investment-cart?langCode=${lang}`,
  )

  const [setSubscriptionDealsAndPrograms] = useStore((state) => [
    state.setSubscriptionDealsAndPrograms,
  ])

  const [deals, setDeals] = useState<InvestmentCartDealDetails[]>([])
  const [programs, setPrograms] = useState<InvestmentCartDealDetails[]>([])
  const [expiredDeals, setExpiredDeals] = useState<InvestmentCartDealDetails[]>(
    [],
  )
  const [expiredPrograms, setExpiredPrograms] = useState<
    InvestmentCartDealDetails[]
  >([])
  const isLoading = !cartData && !error
  const { t } = useTranslation("subscription")
  const isFullWidth = useBreakpointValue({ base: true, md: false })
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isTabletView = useBreakpointValue({
    base: false,
    md: true,
    lgp: false,
  })

  useEffect(() => {
    setSubscriptionDealsAndPrograms([...programs, ...deals])
  }, [programs, deals])

  useEffect(() => {
    let dealAndProgramArray: InvestmentCartDealDetails[] = []
    let programData: InvestmentCartDealDetails[] = []
    let dealsData: InvestmentCartDealDetails[] = []
    let expiredDealData: InvestmentCartDealDetails[] = []
    let expiredProgramData: InvestmentCartDealDetails[] = []

    if (cartData?.length) {
      setIsCart(true)
      cartData?.forEach((cartItem) => {
        if (!cartItem?.isExpiredDeal) {
          if (cartItem?.isProgram) {
            programData.push({
              ...cartItem,
              isChecked: true,
            })
          } else {
            dealsData.push({
              ...cartItem,
              isChecked: true,
            })
          }
          dealAndProgramArray.push(cartItem)
        } else {
          if (cartItem?.isProgram) {
            expiredProgramData.push({
              ...cartItem,
            })
          } else {
            expiredDealData.push({
              ...cartItem,
              isChecked: true,
            })
          }
        }
      })
      if (
        programData?.find((program) => {
          return program.isChecked
        })
      ) {
        getProgramSelection(true)
      } else {
        getProgramSelection(false)
      }
      setPrograms([...programData])
      setDeals([...dealsData])
      setExpiredDeals([...expiredDealData])
      setExpiredPrograms([...expiredProgramData])
    } else {
      setIsCart(false)
    }
    setSubscriptionDealsAndPrograms([...programData, ...dealsData])
  }, [cartData])

  if (isLoading) {
    return <SkeletonCard flex="1" mb="25px" mt="20px" />
  }

  const removeItemFromCart = async ({
    opportunityId,
    isInterested,
    isScheduled,
    isSeen,
    clientOpportunityId,
    opportunityName,
  }: InvestmentCartDealDetails) => {
    try {
      const params = [
        {
          clientOpportunityId,
          opportunityId,
          isInterested,
          isScheduled,
          isSeen,
          isAddedToCart: false,
        },
      ]

      await ky.patch("/api/client/deals/update-client-opportunities", {
        json: params,
      })
      await mutate("/api/client/deals/investment-cart")
      clientUniEvent(
        removeItemFromInvestmentCart,
        opportunityName,
        user?.mandateId as string,
        user?.email as string,
      )

      await mutate(`/api/client/deals/investment-cart?langCode=${lang}`)
      return true
    } catch (error) {}
  }

  const removeExpiredItemFromCart = async ({
    opportunityId,
    opportunityName,
  }: InvestmentCartDealDetails) => {
    try {
      const params = {
        dealId: opportunityId,
        dealName: opportunityName,
      }

      await ky.delete("/api/client/deals/remove-expired-deal", {
        json: params,
      })

      clientUniEvent(
        removeItemFromInvestmentCart,
        opportunityName,
        user?.mandateId as string,
        user?.email as string,
      )

      await mutate(`/api/client/deals/investment-cart?langCode=${lang}`)
      return true
    } catch (error) {
      datadogRum.addError(error)
    }
  }

  const onChangeHandler = (value: boolean, key: number, type: string) => {
    if (type == "deal") {
      const dealTemp: InvestmentCartDealDetails[] = []
      deals.forEach((deal) => {
        if (deal.opportunityId == key) {
          dealTemp.push({
            ...deal,
            isChecked: value,
          })
        } else {
          dealTemp.push({
            ...deal,
          })
        }
      })

      setDeals([...dealTemp])
    } else {
      const programTemp: InvestmentCartDealDetails[] = []
      programs.forEach((program) => {
        if (program.opportunityId == key) {
          programTemp.push({
            ...program,
            isChecked: value,
          })
        } else {
          programTemp.push({
            ...program,
          })
        }
      })
      if (
        programTemp?.find((program) => {
          return program.isChecked
        })
      ) {
        getProgramSelection(true)
      } else {
        getProgramSelection(false)
      }
      setPrograms([...programTemp])
    }
  }

  if (!isLoading && !isValidating) {
    if (cartData?.length) {
      return (
        <Flex
          py={{ base: 2, md: 16 }}
          direction={{ base: "column", md: "row" }}
        >
          <Container flex="1" maxW={{ base: "full", md: "280px" }} px="0">
            <Heading
              mb={{ base: 4, md: 6 }}
              fontSize={{ base: "2xl", md: "2xl", lgp: "3xl" }}
            >
              {t("investmentCart.heading")}
            </Heading>
            <Text color="gray.500" fontSize="16px">
              {" "}
              {deals.length && programs.length
                ? t("investmentCart.description.dealAndProgram")
                : deals.length
                ? t("investmentCart.description.deal")
                : t("investmentCart.description.program")}
            </Text>
          </Container>

          <Center
            pl={{ lgp: "66px", md: "50", base: "0" }}
            pr={{ lgp: "34px", md: "34px", base: "0" }}
            py={{ base: "32px", md: 0 }}
          >
            <Divider orientation={isFullWidth ? "horizontal" : "vertical"} />
          </Center>

          <Container
            flex={isTabletView ? "2" : "1"}
            px="0"
            {...(isMobileView && { mb: "36" })}
            // h="100vh"
          >
            {programs.length ? (
              <>
                <Tag
                  size={"sm"}
                  key={"sm"}
                  mb="24px"
                  variant="solid"
                  fontSize={"16px"}
                  fontWeight="semibold"
                  borderRadius="full"
                  padding=" 5px 12px"
                  color="gray.900"
                  bgColor="lightGreen.100"
                >
                  {t("common:client.program")}
                </Tag>
                {programs?.length
                  ? programs?.map((ProgramItem, index) => (
                      <Box key={index} mb="16px">
                        <DealCard
                          onRemove={removeItemFromCart}
                          onChange={onChangeHandler}
                          data={ProgramItem}
                          type="program"
                        />
                      </Box>
                    ))
                  : false}
              </>
            ) : (
              false
            )}
            {expiredPrograms.length ? (
              <>
                <Tag
                  size={"sm"}
                  key={"sm"}
                  mb="24px"
                  variant="solid"
                  fontSize={"16px"}
                  fontWeight="semibold"
                  borderRadius="full"
                  padding=" 5px 12px"
                  color="gray.900"
                  bgColor="lightGreen.100"
                >
                  {t("common:client.program")}
                </Tag>
                {expiredPrograms?.map((ProgramItem, index) => (
                  <Box key={index} mb="16px">
                    <ExpiredDealCard
                      onRemove={removeExpiredItemFromCart}
                      data={ProgramItem}
                      type="program"
                    />
                  </Box>
                ))}
              </>
            ) : (
              false
            )}
            {deals.length ? (
              <>
                <Tag
                  size={"sm"}
                  key={"sm"}
                  mb="24px"
                  variant="solid"
                  fontSize={"16px"}
                  fontWeight="semibold"
                  borderRadius="full"
                  padding=" 5px 12px"
                  color="gray.900"
                  bgColor="primary.500"
                >
                  {t("common:client.deal")}
                </Tag>
                {deals?.map((dealItem, index) => (
                  <Box key={index}>
                    <DealCard
                      onRemove={removeItemFromCart}
                      onChange={onChangeHandler}
                      data={dealItem}
                      type="deal"
                    />
                  </Box>
                ))}
              </>
            ) : (
              false
            )}
            {expiredDeals.length ? (
              <>
                <Tag
                  size={"sm"}
                  key={"sm"}
                  mb="24px"
                  variant="solid"
                  fontSize={"16px"}
                  fontWeight="semibold"
                  borderRadius="full"
                  padding=" 5px 12px"
                  color="gray.900"
                  bgColor="primary.500"
                >
                  {t("common:client.deal")}
                </Tag>
                {expiredDeals?.map((dealItem, index) => (
                  <Box key={index}>
                    <ExpiredDealCard
                      onRemove={removeExpiredItemFromCart}
                      data={dealItem}
                      type="deal"
                    />
                  </Box>
                ))}
              </>
            ) : (
              false
            )}
          </Container>
        </Flex>
      )
    } else {
      return <EmptyCart />
    }
  } else {
    return (
      <Fragment>
        <SkeletonCard flex="1" mb="25px" mt="20px" />
      </Fragment>
    )
  }
}

function SubscriptionWizard() {
  const { t, lang } = useTranslation("subscription")
  const router = useRouter()
  const { user } = useUser()
  const [mobileViewStep, setMobileViewStep] = useState(0)
  const [confirmation, setConfirmation] = useState(false)
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isDesktopView = !isMobileView
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [programs, setPrograms] = useState<InvestmentCartDealDetails[]>([])
  const [deals, setDeals] = useState<InvestmentCartDealDetails[]>([])
  const [dealsSum, setDealsSum] = useState<number>()
  const [subscriptionConfirmation, setSubscriptionConfirmation] =
    useState<SubscriptionDetailResponseType>()
  const [showTermsError, setTermsError] = useState(false)
  const [showSignAuthError, setSignAuthError] = useState(false)
  const [showCheckError, setShowCheckError] = useState(false)
  const [terms, setTerms] = useState(false)
  const [signAuth, setSignAuth] = useState(false)
  const [isCart, setIsCart] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNextButtonActive, setIsNextButtonActive] = useState(false)
  const [proceedToCheckout, setProceedToCheckout] = useState(false)
  const [isProgramButtonDisabled, setIsProgramButtonDisabled] = useState(true)
  const [isProgramSelected, setIsProgramSelected] = useState(false)
  const [screen3NextButtonClicked, setScreen3NextButtonClicked] =
    useState(false)
  const [subscriptionDealsAndPrograms, setSubscriptionDealsAndPrograms] =
    useStore((state) => [
      state.subscriptionDealsAndPrograms,
      state.setSubscriptionDealsAndPrograms,
    ])
  const { data: popUps } = useSWR<PopupDetailRoot>(
    `/api/client/deals/popup-details`,
  )

  useEffect(() => {
    if (!terms) {
      setTermsError(true)
    } else {
      setTermsError(false)
    }
    if (!signAuth) {
      setSignAuthError(true)
    } else {
      setSignAuthError(false)
    }
  }, [terms, signAuth])

  useEffect(() => {
    if (subscriptionDealsAndPrograms.length) {
      setPrograms(
        subscriptionDealsAndPrograms
          .filter(({ isChecked, isProgram }) => {
            return isChecked && isProgram
          })
          .map((data) => {
            const savedProgram = programs.find(({ opportunityId }) => {
              return opportunityId == data.opportunityId
            })

            let dataObj = {
              opportunityId: data.opportunityId,
              opportunityName: data.opportunityName,
              minimumAmount: data.minimumAmount,
              maximumAmount: data.maximumAmount,
              isInvestmentPreferenceShariah: data.isInvestmentPreferenceShariah,
              isProgram: data.isProgram,
              isChecked: data.isChecked,
              investmentAmountKey: savedProgram?.investmentAmountKey,
              investmentAmountLabel: savedProgram?.investmentAmountLabel,
              inputState: savedProgram?.inputState || "initial",
              concentration: savedProgram?.concentration || "20",
              isPreFund: savedProgram?.isPreFund || false,
              associatedConventionalDealId: data.associatedConventionalDealId,
            }
            return dataObj
          }),
      )
      setDeals(
        subscriptionDealsAndPrograms
          .filter(({ isChecked, isProgram }) => {
            return isChecked && !isProgram
          })
          .map((data) => {
            const savedProgram = deals.find(({ opportunityId }) => {
              return opportunityId == data.opportunityId
            })
            let dataObj = {
              opportunityId: data.opportunityId,
              opportunityName: data.opportunityName,
              minimumAmount: data.minimumAmount,
              maximumAmount: data.maximumAmount,
              isInvestmentPreferenceShariah: data.isInvestmentPreferenceShariah,
              isProgram: data.isProgram,
              isChecked: data.isChecked,
              investmentAmountKey: savedProgram?.investmentAmountKey,
              investmentAmountLabel: savedProgram?.investmentAmountLabel,
              inputState: savedProgram?.inputState || "initial",
              associatedConventionalDealId: data.associatedConventionalDealId,
            }
            return dataObj
          }),
      )
    }
    setIsProgramButtonDisabled(true)
  }, [mobileViewStep])

  useEffect(() => {
    const wizzScrollMainElmnt = document.getElementById("wizzScrollMainCont")
    const element: HTMLElement = wizzScrollMainElmnt!
    element.scrollTo({
      top: 0,
    })
  }, [mobileViewStep, confirmation])

  useEffect(() => {
    subscriptionDealsAndPrograms.every(({ isChecked }) => {
      if (isChecked) {
        setIsNextButtonActive(true)
        return false
      }
      setIsNextButtonActive(false)
      return true
    })
  }, [subscriptionDealsAndPrograms])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // for smoothly scrolling
    })
  }, [])

  const ChapterHeaderStepper = (props?: StyleProps) => (
    <Stepper
      activeStep={
        mobileViewStep == 0
          ? 1
          : mobileViewStep == 1
          ? 2
          : mobileViewStep == 2
          ? 3
          : mobileViewStep == 3 && !isProgramSelected
          ? 3
          : 4
      }
      orientation="horizontal"
      {...props}
    >
      <Step
        index={0}
        completed={mobileViewStep > 0 ? true : false}
        ms={{ base: 4, md: 0 }}
      >
        {mobileViewStep == 0 && (
          <StepContent>
            <StepLabel color="gray.400" fontWeight="400">
              {t("investmentCart.heading")}
            </StepLabel>
          </StepContent>
        )}
      </Step>
      <Step index={1} completed={mobileViewStep > 1 ? true : false}>
        {mobileViewStep == 1 && (
          <StepContent>
            <StepLabel color="gray.400" fontWeight="bold">
              {t("subscriptionDetails.heading")}
            </StepLabel>
          </StepContent>
        )}
      </Step>
      {isProgramSelected ? (
        <Fragment>
          <Step index={2} completed={mobileViewStep > 2 ? true : false}>
            {mobileViewStep == 2 && (
              <StepContent>
                <StepLabel color="gray.400" fontWeight="bold">
                  {t("programDetails.headng")}
                </StepLabel>
              </StepContent>
            )}
          </Step>
          <Step index={3} completed={mobileViewStep > 3 ? true : false}>
            {mobileViewStep == 3 && (
              <StepContent>
                <StepLabel color="gray.400" fontWeight="bold">
                  {t("orderSummary.heading")}
                </StepLabel>
              </StepContent>
            )}
          </Step>
        </Fragment>
      ) : (
        <Step
          index={!isProgramSelected ? 2 : 3}
          completed={mobileViewStep > 3 ? true : false}
        >
          {mobileViewStep == 3 && (
            <StepContent>
              <StepLabel color="gray.400" fontWeight="bold">
                {t("orderSummary.heading")}
              </StepLabel>
            </StepContent>
          )}
        </Step>
      )}
    </Stepper>
  )

  const onChangeHandler = (type: string, value: string, index: number) => {
    if (type == "program") {
      programs[index].investmentAmountKey = Number(value.replace(/[^0-9]/g, ""))
      programs[index].investmentAmountLabel = formatCurrencyWithCommas(
        `${value}`,
      )
      const investmentAmount = programs[index]?.investmentAmountKey || 0
      const minimumAmount = programs[index].minimumAmount
      const maximumAmount = programs[index].maximumAmount
      if (
        investmentAmount < maximumAmount &&
        investmentAmount > minimumAmount
      ) {
        programs[index].inputState = "valid"
      } else if (investmentAmount > maximumAmount) {
        programs[index].inputState = "error_maximum_amount"
      }

      setPrograms([...programs])
    } else if (type == "deal") {
      deals[index].investmentAmountKey = Number(value.replace(/[^0-9]/g, ""))
      deals[index].investmentAmountLabel = formatCurrencyWithCommas(`${value}`)
      const investmentAmount = deals[index]?.investmentAmountKey || 0
      const minimumAmount = deals[index].minimumAmount
      const maximumAmount = deals[index].maximumAmount
      if (
        investmentAmount < maximumAmount &&
        investmentAmount > minimumAmount
      ) {
        deals[index].inputState = "valid"
      } else if (investmentAmount > maximumAmount) {
        deals[index].inputState = "error_maximum_amount"
      }

      setDeals([...deals])
    }
  }

  useEffect(() => {
    let sum = 0
    deals.forEach(({ investmentAmountKey }) => {
      sum += investmentAmountKey || 0
    })
    setDealsSum(sum)
  }, [deals])

  const prefundAndConcentrationChangeHandler = (
    index: number,
    type: string,
    preFundValue?: boolean,
    concentrationValue?: "5" | "10" | "20",
  ) => {
    if (type == "prefund") {
      programs[index].isPreFund = preFundValue
    } else if (type == "concentration") {
      programs[index].concentration = concentrationValue
    }
    setPrograms([...programs])
  }

  const onBlurHandler = (type: string, index: number) => {
    if (type == "program") {
      const investmentAmount = programs[index]?.investmentAmountKey || 0
      const minimumAmount = programs[index].minimumAmount
      const maximumAmount = programs[index].maximumAmount
      if (investmentAmount > maximumAmount) {
        programs[index].inputState = "error_maximum_amount"
      } else if (investmentAmount < minimumAmount) {
        programs[index].inputState = "error_minimum_amount"
      } else {
        programs[index].inputState = "valid"
      }

      setPrograms([...programs])
    } else {
      const investmentAmount = deals[index]?.investmentAmountKey || 0
      const minimumAmount = deals[index].minimumAmount
      const maximumAmount = deals[index].maximumAmount
      if (investmentAmount > maximumAmount) {
        deals[index].inputState = "error_maximum_amount"
      } else if (investmentAmount < minimumAmount) {
        deals[index].inputState = "error_minimum_amount"
      } else {
        deals[index].inputState = "valid"
      }
      setDeals([...deals])
    }
  }

  const onFormSubmit = () => {
    let isValidForm = true
    let checkDeals: InvestmentCartDealDetails[] = []
    let checkProgram: InvestmentCartDealDetails[] = []
    if (programs.length) {
      checkProgram = programs.map((program) => {
        if (program.inputState != "valid") {
          if (program.inputState == "initial") {
            program.inputState = "untouched"
          }
          isValidForm = false
        }
        return program
      })
      setPrograms([...checkProgram])
    }
    setScreen3NextButtonClicked(true)
    if (deals.length) {
      checkDeals = deals.map((deal) => {
        if (deal.inputState != "valid") {
          if (deal.inputState == "initial") {
            deal.inputState = "untouched"
          }
          isValidForm = false
        }
        return deal
      })
      setDeals([...checkDeals])
    }

    if (isValidForm) {
      const checkoutDeals = [...checkProgram, ...checkDeals].map(
        ({ opportunityName, investmentAmountKey }) => {
          return {
            dealTitle: opportunityName,
            amount: investmentAmountKey,
          }
        },
      )
      clientUniEvent(
        clickedNextScreen2SubscriptionPage,
        JSON.stringify(checkoutDeals),
        user?.mandateId as string,
        user?.email as string,
      )
      if (programs.length) {
        setSubscriptionDealsAndPrograms([...checkProgram, ...checkDeals])
        setMobileViewStep(2)
      } else {
        setSubscriptionDealsAndPrograms([...checkProgram, ...checkDeals])
        setMobileViewStep(3)
      }
    } else {
    }
  }

  const programDetailOnSubmit = async () => {
    var programs = [...subscriptionDealsAndPrograms]
    let loopingList = []
    for await (const program of programs) {
      if (program.isProgram) {
        const subAmount =
          Number(program.investmentAmountKey) /
          (program.concentration == "20"
            ? 5
            : program.concentration == "10"
            ? 10
            : 20)
        if (program.programDeals?.length) {
          let programDealList: SubscriptionDealsDetail[] = []
          program?.programDeals.forEach((z) => {
            if (z.isSelected || z.defaultSelection) {
              if (subAmount > z.unplacedAmount) {
                programDealList.push({
                  ...z,
                  commitedAmount: z.unplacedAmount,
                })
              } else {
                programDealList.push({
                  ...z,
                  commitedAmount: subAmount,
                })
              }
            }
          })
          loopingList.push({
            ...program,
            programDeals: programDealList,
          })
        } else {
          loopingList.push({
            ...program,
          })
        }
      } else {
        loopingList.push({
          ...program,
        })
      }
    }

    setSubscriptionDealsAndPrograms(loopingList)
    setMobileViewStep(3)
    setIsProgramButtonDisabled(true)
  }

  const submitSubscriptionRequest = async () => {
    setShowCheckError(true)
    if (terms && signAuth) {
      setIsSubmitting(true)
      let confirmedDeals = subscriptionDealsAndPrograms.map(
        ({ opportunityName, investmentAmountKey }) => {
          return {
            dealTitle: opportunityName,
            amount: investmentAmountKey,
          }
        },
      )
      clientUniEvent(
        clickedConfirmScreen4SubscriptionPage,
        JSON.stringify(confirmedDeals),
        user?.mandateId as string,
        user?.email as string,
      )
      const params = {
        subscriptionDealDTOList: subscriptionDealsAndPrograms
          .filter(({ isProgram }) => {
            return !isProgram
          })
          .map(
            ({
              opportunityId,
              opportunityName,
              isInvestmentPreferenceShariah,
              associatedConventionalDealId,
              investmentAmountKey,
            }) => {
              return {
                dealId: opportunityId,
                dealName: opportunityName,
                investmentAmount: investmentAmountKey,
                isInvestmentPreferenceShariah: isInvestmentPreferenceShariah,
                associatedConventionalDealId: isInvestmentPreferenceShariah
                  ? null
                  : associatedConventionalDealId || null,
              }
            },
          ),
        subscriptionProgramDTOList: subscriptionDealsAndPrograms
          .filter(({ isProgram }) => {
            return isProgram
          })
          .map(
            ({
              concentration,
              opportunityId,
              opportunityName,
              isPreFund,
              isInvestmentPreferenceShariah,
              associatedConventionalDealId,
              programDeals,
              investmentAmountKey,
            }) => {
              let indermediateInvestmentAmount = 0
              programDeals?.forEach(({ commitedAmount }) => {
                indermediateInvestmentAmount += commitedAmount
              })
              return {
                concentration:
                  concentration == "5" ? 20 : concentration == "10" ? 10 : 20,
                dealId: opportunityId,
                dealName: opportunityName,
                indermediateInvestmentAmount: indermediateInvestmentAmount,
                isPrefund: isPreFund ? 0 : 1,
                totalInvestmentAmount: investmentAmountKey,
                isShariahSelected: isInvestmentPreferenceShariah,
                associatedConventionalDealId: isInvestmentPreferenceShariah
                  ? null
                  : associatedConventionalDealId || null,
                subscriptionProgramDealDTOList: programDeals?.map(
                  ({ dealName, commitedAmount, dealId }) => {
                    return {
                      dealName: dealName,
                      investmentAmount: commitedAmount,
                      programDealId: dealId,
                    }
                  },
                ),
              }
            },
          ),
      }

      try {
        let response = await ky
          .post("/api/client/deals/subscription-details", {
            json: {
              subscriptionDetailsList: params,
            },
          })
          .json<SubscriptionDetailResponseType>()

        setSubscriptionConfirmation(response)
        setConfirmation(true)
        setIsSubmitting(false)
      } catch (error) {
        setIsSubmitting(false)
      }
    }
  }

  const getProgramSelection = (value: boolean) => {
    setIsProgramSelected(value)
  }

  const updatePopUpFlag = async (popUpName: string, flag: boolean) => {
    try {
      let popUpData = popUps?.popupDetails.find(({ popupName }) => {
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
    <ClientModalLayout
      containerRef={containerRef}
      title={t("page.title")}
      description={t("page.description")}
      header={
        <ClientModalHeader
          boxShadow="0 0 0 4px var(--chakra-colors-gray-900)"
          {...(isDesktopView && {
            headerLeft: (
              <Stack isInline ps="6" spacing="6" alignItems="center">
                <Divider orientation="vertical" bgColor="white" height="28px" />
                {!confirmation && isCart ? <ChapterHeaderStepper /> : false}
              </Stack>
            ),
          })}
          headerRight={
            <>
              <Button
                m="0 4px"
                variant="ghost"
                colorScheme="primary"
                onClick={() => {
                  router.back()
                  if (proceedToCheckout) {
                    clientUniEvent(
                      exitScreen2SubscriptionPage,
                      "true",
                      user?.mandateId as string,
                      user?.email as string,
                    )
                  } else {
                    clientUniEvent(
                      exitScreen1SubscriptionPage,
                      "true",
                      user?.mandateId as string,
                      user?.email as string,
                    )
                  }
                  if (screen3NextButtonClicked) {
                    clientUniEvent(
                      exitScreen4SubscriptionPage,
                      "true",
                      user?.mandateId as string,
                      user?.email as string,
                    )
                  }
                }}
              >
                {t("common:button.exit")}
              </Button>
            </>
          }
          subheader={
            !confirmation && isCart ? (
              <>
                {isMobileView && (
                  <Box h="10" px="1" py="2">
                    <ChapterHeaderStepper />
                  </Box>
                )}

                <Progress
                  colorScheme="primary"
                  size="xs"
                  bgColor="gray.700"
                  value={
                    mobileViewStep == 0
                      ? 25
                      : mobileViewStep == 1
                      ? 50
                      : mobileViewStep == 2
                      ? 75
                      : 100
                  }
                />
              </>
            ) : (
              false
            )
          }
        />
      }
      footer={
        !confirmation && isCart ? (
          <ClientModalFooter
            {...(isMobileView &&
              mobileViewStep == 0 && {
                position: "fixed",
                bottom: "0",
                flexDirection: "column-reverse",
              })}
            showCallAction={false}
          >
            {mobileViewStep == 0 && (
              <Box
                fontSize="14px"
                fontWeight="400"
                color="white"
                cursor="pointer"
                mt={isMobileView && mobileViewStep == 0 ? "24px" : "0"}
                onClick={() => {
                  router.push(`/client/redemption`)
                  clientUniEvent(
                    clickRedeemInvCart,
                    "true",
                    user?.mandateId as string,
                    user?.email as string,
                  )
                }}
                pl={{ lgp: "18px", md: "0", base: "0" }}
              >
                {t("common:client.orderManagementCTAs.redeemButtonText")}
              </Box>
            )}
            <Stack
              isInline
              spacing={{ base: 4, md: 8 }}
              px={{ base: 0, md: 3 }}
              flex="1"
              justifyContent="flex-end"
              width={isMobileView ? "full" : "auto"}
            >
              {mobileViewStep == 0 && !confirmation && (
                <Popover
                  returnFocusOnClose={false}
                  isOpen={
                    popUps?.popupDetails?.length
                      ? !popUps?.popupDetails?.find(({ popupName }) => {
                          return popupName == "INVESTMENT_CART_CHECK_OUT"
                        })?.flag
                        ? true
                        : false
                      : false
                  }
                  onClose={() =>
                    updatePopUpFlag("INVESTMENT_CART_CHECK_OUT", true)
                  }
                  placement="top-start"
                  closeOnBlur={false}
                >
                  <PopoverTrigger>
                    <Button
                      px={8}
                      isDisabled={isNextButtonActive ? false : true}
                      colorScheme="primary"
                      variant="solid"
                      onClick={() => {
                        let subscribedDeals = subscriptionDealsAndPrograms
                          .filter(({ isChecked }) => {
                            return isChecked
                          })
                          .map(({ opportunityName }) => {
                            return opportunityName
                          })
                        clientUniEvent(
                          clickedNextScreen1SubscriptionPage,
                          subscribedDeals.toString(),
                          user?.mandateId as string,
                          user?.email as string,
                        )
                        updatePopUpFlag("INVESTMENT_CART_CHECK_OUT", true)
                        setMobileViewStep(1)
                        setProceedToCheckout(true)
                      }}
                      width={isMobileView ? "full" : "auto"}
                    >
                      {t("common:client.orderManagementCTAs.nextButtonText")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent bg="gunmetal.500">
                    <PopoverHeader
                      fontWeight="400"
                      fontSize="12px"
                      color="gray.400"
                    >
                      {t("common:client.userOnBoarding.checkout.title")}
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
                      {t("common:client.userOnBoarding.checkout.description")}
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              )}

              {mobileViewStep == 1 && !confirmation && (
                <>
                  <Button
                    h="40px"
                    px={8}
                    colorScheme="primary"
                    variant="outline"
                    onClick={() => {
                      setMobileViewStep(0)
                    }}
                    width={isMobileView ? "full" : "110px"}
                  >
                    {t("common:button.back")}
                  </Button>
                  <Button
                    h="40px"
                    px={8}
                    colorScheme="primary"
                    variant="solid"
                    ml="16px"
                    onClick={() => {
                      onFormSubmit()
                      // setMobileViewStep(2)
                    }}
                    width={isMobileView ? "full" : "110px"}
                  >
                    {t("common:client.orderManagementCTAs.nextButtonText")}
                  </Button>
                </>
              )}
              {mobileViewStep == 2 &&
                !confirmation &&
                !isProgramButtonDisabled && (
                  <>
                    <Button
                      px={8}
                      colorScheme="primary"
                      variant="outline"
                      onClick={() => {
                        setIsProgramButtonDisabled(true)
                        setMobileViewStep(1)
                      }}
                      width={isMobileView ? "full" : "auto"}
                    >
                      {t("common:button.back")}
                    </Button>
                    <Button
                      px={8}
                      colorScheme="primary"
                      variant="solid"
                      onClick={() => {
                        programDetailOnSubmit()
                      }}
                      width={isMobileView ? "full" : "auto"}
                    >
                      {t("common:client.orderManagementCTAs.nextButtonText")}
                    </Button>
                  </>
                )}
              {mobileViewStep == 3 && !confirmation && (
                <>
                  <Button
                    px={8}
                    colorScheme="primary"
                    variant="outline"
                    onClick={() => {
                      setMobileViewStep(programs.length > 0 ? 2 : 1)
                    }}
                    width={isMobileView ? "50%" : "auto"}
                  >
                    {t("common:button.back")}
                  </Button>

                  <Popover
                    returnFocusOnClose={false}
                    isOpen={
                      popUps?.popupDetails?.length
                        ? !popUps?.popupDetails?.find(({ popupName }) => {
                            return popupName == "ORDER_SUMMARY_CONFIRM"
                          })?.flag
                          ? true
                          : false
                        : false
                    }
                    onClose={() =>
                      updatePopUpFlag("ORDER_SUMMARY_CONFIRM", true)
                    }
                    placement="top-end"
                    closeOnBlur={false}
                  >
                    <PopoverTrigger>
                      <Box
                        position="relative"
                        width={isMobileView ? "50%" : "auto"}
                      >
                        <Button
                          px={8}
                          colorScheme="primary"
                          variant="solid"
                          isLoading={isSubmitting}
                          onClick={() => {
                            updatePopUpFlag("ORDER_SUMMARY_CONFIRM", true)
                            submitSubscriptionRequest()
                          }}
                          width={isMobileView ? "100%" : "auto"}
                        >
                          {t(
                            "common:client.orderManagementCTAs.confirmButtonText",
                          )}
                        </Button>
                      </Box>
                    </PopoverTrigger>
                    <PopoverContent bg="gunmetal.500">
                      <PopoverHeader
                        fontWeight="400"
                        fontSize="12px"
                        color="gray.400"
                      >
                        {t("common:client.userOnBoarding.orderSummary.title")}
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
                        {t(
                          "common:client.userOnBoarding.orderSummary.description",
                        )}
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </>
              )}
            </Stack>
          </ClientModalFooter>
        ) : (
          false
        )
      }
    >
      <Container maxW="5xl" {...(isMobileView && { px: "0" })}>
        <Box aria-label="Investment Cart Main" role={"main"} pb="25px">
          {mobileViewStep == 0 && !confirmation && (
            <InvestmentCartSection
              getProgramSelection={getProgramSelection}
              setIsCart={setIsCart}
            />
          )}
          {mobileViewStep == 1 && !confirmation && (
            <SubscriptionDetails
              programs={programs}
              deals={deals}
              onChangeHandler={onChangeHandler}
              onBlurHandler={onBlurHandler}
              prefundAndConcentrationChangeHandler={
                prefundAndConcentrationChangeHandler
              }
              dealsSum={dealsSum}
            />
          )}
          {mobileViewStep == 2 && !confirmation && (
            <ProgramDetails
              setIsProgramButtonDisabled={setIsProgramButtonDisabled}
            />
          )}
          {mobileViewStep == 3 && !confirmation && (
            <OrderSummary
              showTermsError={showTermsError}
              showSignAuthError={showSignAuthError}
              showCheckError={showCheckError}
              setTerms={setTerms}
              setSignAuth={setSignAuth}
            />
          )}
          {confirmation && subscriptionConfirmation ? (
            <SubscriptionConfirmation
              subscriptionConfirmation={subscriptionConfirmation}
            />
          ) : (
            false
          )}
        </Box>
      </Container>
    </ClientModalLayout>
  )
}

export default React.memo(SubscriptionWizard)
