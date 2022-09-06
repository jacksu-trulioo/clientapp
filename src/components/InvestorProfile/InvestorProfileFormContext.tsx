import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal"
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  ListItem,
  Text,
  UnorderedList,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import produce from "immer"
import ky from "ky"
import { useRouter } from "next/router"
import Trans from "next-translate/Trans"
import useTranslation from "next-translate/useTranslation"
import React, { useState } from "react"
import useSWR, { mutate } from "swr"

import { useUser } from "~/hooks/useUser"
import {
  InterestedInvestments,
  InvestmentExperience,
  PriorInvestment,
  Profile,
  StartInvestmentTimeFrame,
  UnlockOpportunityFlow,
  User,
  UserContactInput,
} from "~/services/mytfo/types"
import { automaticQualification } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"

import { Link, Logo } from ".."

// First route is the base path. We do not want a fragment URL here so we leave it blank.

const pages = [
  "",
  "otp-verification",
  "amount",
  "interested-investments",
  "investment-experience",
  "prior-experience",
]

export type InvestorProfileFormContext = {
  ref?: React.MutableRefObject<HTMLDivElement | null>
  pages: string[]
  currentPage?: string
  isFirstPage?: boolean
  currentPageIndex: number
  previousPage?: () => void
  handleSubmit: (values: Profile) => Promise<void>
}

export const InvestorProfileFormContext =
  React.createContext<InvestorProfileFormContext>({
    pages,
    currentPageIndex: 0,
    previousPage: undefined,
    handleSubmit: () => Promise.resolve(),
  })

export type UseInvestorProfileFormContext = () => InvestorProfileFormContext

export const useInvestorProfileFormContext = () =>
  React.useContext(InvestorProfileFormContext)

export type InvestorProfileFormProviderProps = React.PropsWithChildren<{
  onCompleted: () => void
}>

export function InvestorProfileFormProvider(
  props: InvestorProfileFormProviderProps,
): React.ReactElement<InvestorProfileFormContext> {
  const { children, onCompleted } = props
  const { user } = useUser()
  const router = useRouter()
  const { t, lang } = useTranslation("proposal")
  const ref = React.useRef<HTMLDivElement>(null)
  const { onOpen, onClose, isOpen } = useDisclosure()
  const [userContact, setUserContact] = useState<UserContactInput>({})

  const [, page] = location.hash.split("#")
  const [currentPage, setCurrentPage] = React.useState(page)
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0)
  const isFirstPage = !currentPage

  const isMobileView = useBreakpointValue({ base: true, md: false })
  const { data: trackOpportunityStatus } = useSWR<UnlockOpportunityFlow>(
    "/api/user/track-unlock-opportunity-flow",
  )

  React.useEffect(() => {
    if (user?.phoneNumberVerified) {
      const index = pages?.indexOf("otp-verification")
      if (index > -1) {
        pages.splice(index, 1)
      }
    }
  }, [user?.phoneNumberVerified])

  React.useEffect(() => {
    setCurrentPage(page)

    const pageIndex = pages.findIndex((p) => p === page)
    setCurrentPageIndex(pageIndex === -1 ? 0 : pageIndex)
  }, [page])

  function showSorryModal() {
    return (
      <Modal
        onClose={onClose}
        size={isMobileView ? "xs" : "2xl"}
        isOpen={isOpen}
        isCentered={true}
        autoFocus={false}
        returnFocusOnClose={false}
      >
        <ModalOverlay />
        <ModalContent
          sx={{
            "& > div": {
              px: "0",
            },
          }}
        >
          <ModalHeader>
            <Logo
              pos="absolute"
              top={["3", "3"]}
              insetStart={["6", "6"]}
              height={["30px", "30px"]}
            />
            <Heading
              fontSize={{ base: "lg", md: "x-large" }}
              color="white"
              textAlign="start"
            >
              {t("sorryModal.heading")}
            </Heading>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />

          <ModalBody>
            <Trans
              i18nKey={
                user?.profile?.nationality !== "SA"
                  ? "proposal:sorryModal.contentNonKSA"
                  : "proposal:sorryModal.contentKSA"
              }
              components={[
                <Box key="0" px="6" />,
                <Text
                  key="1"
                  fontSize={{ base: "sm", md: "md" }}
                  color="gray.400"
                  textAlign="start"
                  mb="2"
                />,
                <UnorderedList key="2" color="contrast.200" ms="8" mb="5" />,
                <ListItem
                  key="3"
                  textAlign="start"
                  fontSize={{ base: "sm", md: "md" }}
                />,
                <Text
                  key="4"
                  fontSize={{ base: "xs", md: "sm" }}
                  color="gray.400"
                  textAlign="start"
                  mt="3.5"
                  mb="7"
                />,
              ]}
            />
            <Divider
              orientation="horizontal"
              borderColor="gray.800"
              border="1px solid"
              mb="1"
              mt="1"
            />
          </ModalBody>

          <ModalFooter w="full" px="6">
            <Flex
              justifyContent="space-between"
              direction="row"
              w="full"
              pb="3"
            >
              <Button
                variant="ghost"
                colorScheme="primary"
                onClick={onClose}
                name="Go back"
                justifyContent="center"
              >
                {t("sorryModal.button.goBack")}
              </Button>
              <Button
                colorScheme="primary"
                variant="solid"
                as={Link}
                href={lang === "ar" ? "/ar" : "/"}
                onClick={async () => {
                  try {
                    await ky.patch("/api/user/contact", {
                      json: userContact,
                    })
                  } catch (e) {
                    // no need to handle error as this will be silent failure
                  } finally {
                    onClose()
                  }
                }}
              >
                {t("sorryModal.button.exitToDashboard")}
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }

  const nextPage = React.useCallback(() => {
    // At end of form.
    if (currentPageIndex === pages.length - 1) {
      return onCompleted()
    }

    const route = pages[Math.min(currentPageIndex + 1, pages.length - 1)]
    router.push("#" + route)
    setCurrentPage(route)
  }, [currentPageIndex, onCompleted, router])

  const previousPage = React.useCallback(() => {
    // At beginning of form.
    if (currentPageIndex === 0) {
      return
    }

    const route = pages[Math.max(currentPageIndex - 1, 0)]
    router.push(route ? "#" + route : router.pathname)
    setCurrentPage(route)
  }, [currentPageIndex, router])

  const validateInvestorProfile = (values: Profile) => {
    const {
      isTaxableInUS,
      nationality,
      isAccreditedByCBB,
      isDefinedSophisticatedByCMA,
    } = values

    return (
      (isTaxableInUS && isTaxableInUS === "yes") ||
      (nationality &&
        nationality !== "SA" &&
        isAccreditedByCBB &&
        isAccreditedByCBB !== "yes") ||
      (nationality &&
        nationality === "SA" &&
        isDefinedSophisticatedByCMA &&
        isDefinedSophisticatedByCMA !== "yes") ||
      nationality === "US" ||
      nationality === "IR" ||
      nationality === "KP"
    )
  }

  const calculateWhenToStartInvestment = (
    user?: User,
    investMinAmount?: string,
    timeFrame?: string,
  ) => {
    if (investMinAmount === "yes" && timeFrame) {
      return timeFrame
    }
    if (investMinAmount === "no") {
      return null
    }
    return user?.profile?.investorSurvey?.whenToStartInvestment
  }

  const calculateOtherPriorInvDetails = (
    priorDetails?: PriorInvestment[],
    otherPriorDetails?: string,
    userProfile?: User,
  ) => {
    if (
      userProfile?.profile?.investorSurvey?.otherPriorDetails !== "" &&
      !otherPriorDetails
    ) {
      return userProfile?.profile?.investorSurvey?.otherPriorDetails
    }

    if (priorDetails?.includes(PriorInvestment.Other)) {
      if (
        otherPriorDetails !==
        userProfile?.profile?.investorSurvey?.otherPriorDetails
      ) {
        return otherPriorDetails
      } else {
        return userProfile?.profile?.investorSurvey?.otherPriorDetails
      }
    }
    return null
  }

  const calculateOtherInvestmentDetails = (
    interestedInvestment?: InterestedInvestments[],
    otherInterestedInvestmentDetails?: string,
    user?: User,
  ) => {
    if (
      user?.profile?.investorSurvey?.otherInterestedInvDetails !== "" &&
      !otherInterestedInvestmentDetails
    ) {
      return user?.profile?.investorSurvey?.otherInterestedInvDetails
    }

    if (interestedInvestment?.includes(InterestedInvestments.Other)) {
      if (
        otherInterestedInvestmentDetails !==
        user?.profile?.investorSurvey?.otherInterestedInvDetails
      ) {
        return otherInterestedInvestmentDetails
      } else {
        return user?.profile?.investorSurvey?.otherInterestedInvDetails
      }
    }
    return null
  }

  const sendVerificationCode = async (phoneNumber?: string) => {
    await ky.post("/api/auth/send-otp", {
      json: {
        phoneNumber:
          phoneNumber ||
          `${user?.profile?.phoneCountryCode}${user?.profile?.phoneNumber}`,
      },
    })
  }

  const handleSubmit = React.useCallback(
    async (values: Profile) => {
      try {
        const updateObj = {
          ...values,
          ...values.investorSurvey,
          isTaxableInUS: values.isTaxableInUS
            ? values.isTaxableInUS === "yes"
              ? true
              : false
            : user?.profile?.isTaxableInUS,
          isAccreditedByCBB: values.isAccreditedByCBB
            ? values.isAccreditedByCBB === "yes"
              ? true
              : false
            : user?.profile?.isAccreditedByCBB,
          isDefinedSophisticatedByCMA: values.isDefinedSophisticatedByCMA
            ? values.isDefinedSophisticatedByCMA === "yes"
              ? true
              : false
            : user?.profile?.isDefinedSophisticatedByCMA,
          preProposalInitialAction: user?.profile?.preProposalInitialAction,
          investorSurvey: {
            investMinimumAmount: values?.investorSurvey?.investMinimumAmount
              ? values?.investorSurvey?.investMinimumAmount === "yes" ||
                values?.investorSurvey?.investMinimumAmount !== "no"
                ? true
                : false
              : user?.profile?.investorSurvey?.investMinimumAmount,

            whenToStartInvestment: calculateWhenToStartInvestment(
              user,
              values?.investorSurvey?.investMinimumAmount,
              values?.investorSurvey?.whenToStartInvestment,
            ),
            interestedInvestments:
              values?.investorSurvey?.interestedInvestments ||
              user?.profile?.investorSurvey?.interestedInvestments ||
              [],
            investmentExperience:
              values?.investorSurvey?.investmentExperience ||
              user?.profile?.investorSurvey?.investmentExperience ||
              null,
            priorInvExperience:
              values?.investorSurvey?.priorInvExperience ||
              user?.profile?.investorSurvey?.priorInvExperience ||
              [],
            otherInterestedInvDetails: calculateOtherInvestmentDetails(
              values?.investorSurvey?.interestedInvestments,
              values?.investorSurvey?.otherInterestedInvDetails,
              user,
            ),

            otherPriorDetails: calculateOtherPriorInvDetails(
              values?.investorSurvey?.priorInvExperience,
              values?.investorSurvey?.otherPriorDetails,
              user,
            ),
          },
        }

        const interestedInvestmentArr = [
          InterestedInvestments.BondsSukuks,
          InterestedInvestments.Equities,
          InterestedInvestments.PrivateDebt,
          InterestedInvestments.PrivateEquity,
          InterestedInvestments.RealEstates,
        ]

        const interestedInvestmentsSelected =
          updateObj?.investorSurvey?.interestedInvestments

        const doAllExistinterestedInvestment = interestedInvestmentArr?.every(
          (value) => interestedInvestmentsSelected.includes(value),
        )

        const priorInvestmentArr = [
          PriorInvestment.BondsSukuks,
          PriorInvestment.Equities,
          PriorInvestment.PrivateDebt,
          PriorInvestment.PrivateEquity,
          PriorInvestment.RealEstates,
        ]

        const priorInvestmentsSelected =
          updateObj?.investorSurvey?.priorInvExperience

        const doAllExistPriorInvestmentArr = priorInvestmentArr?.every(
          (value) => priorInvestmentsSelected.includes(value),
        )

        if (
          updateObj?.investorSurvey?.investmentExperience ===
            InvestmentExperience.OverTen &&
          updateObj?.investorSurvey?.whenToStartInvestment ===
            StartInvestmentTimeFrame.ThisMonth &&
          doAllExistinterestedInvestment &&
          doAllExistPriorInvestmentArr
        ) {
          event(automaticQualification)
        }

        const profile = await ky
          .put("/api/user/profile", {
            json: updateObj,
          })
          .json<Profile>()

        await mutate<User>(
          "/api/user",
          produce((user) => {
            user.profile = profile
          }),
        )

        if (isFirstPage && !trackOpportunityStatus?.opportunityFlow) {
          const opportunityFlow = router.pathname.includes("opportunities")
            ? "Yes"
            : "No"
          await ky.post("/api/user/track-unlock-opportunity-flow", {
            json: {
              opportunityFlow,
            },
          })
        }

        if (
          validateInvestorProfile(values) ||
          values?.investorSurvey?.investMinimumAmount === "no"
        ) {
          // these values needs to be passed to hubspot if user selects values that will stop the journery from proceeding using `/user/contact/` api
          if (validateInvestorProfile(values)) {
            let contactObj: UserContactInput = {}
            if (values.isDefinedSophisticatedByCMA) {
              contactObj.isDefinedSophisticatedByCma =
                values.isDefinedSophisticatedByCMA === "no" ? "No" : "Yes"
            }
            if (values.isAccreditedByCBB) {
              contactObj.isAccreditedByCbb =
                values.isAccreditedByCBB === "no" ? "No" : "Yes"
            }
            if (values.isTaxableInUS) {
              contactObj.isTaxableInUS =
                values.isTaxableInUS === "no" ? "No" : "Yes"
            }
            setUserContact(contactObj)
          } else {
            setUserContact({
              firstSelectionOnMinimumAmount: "No",
            })
          }
          onOpen()
        } else {
          if (
            router.asPath === "/proposal/investor-profile" &&
            user?.phoneNumberVerified
          ) {
            router.push("/proposal/investor-profile#amount")
          } else {
            nextPage()
          }
        }

        if (
          isFirstPage &&
          !user?.phoneNumberVerified &&
          !(
            validateInvestorProfile(values) ||
            values?.investorSurvey?.investMinimumAmount === "no"
          )
        ) {
          sendVerificationCode(
            `${profile.phoneCountryCode}${profile.phoneNumber}`,
          )
        }
      } catch (error) {
        console.error(error)
      }
    },
    [
      user,
      isFirstPage,
      trackOpportunityStatus?.opportunityFlow,
      router.pathname,
      onOpen,
      nextPage,
    ],
  )

  const contextValue = React.useMemo(
    () => ({
      ref,
      currentPage,
      currentPageIndex,
      isFirstPage,
      pages,
      previousPage,
      handleSubmit,
    }),
    [
      ref,
      currentPage,
      currentPageIndex,
      isFirstPage,
      previousPage,
      handleSubmit,
    ],
  )

  return (
    <InvestorProfileFormContext.Provider value={contextValue}>
      {children}
      {showSorryModal()}
    </InvestorProfileFormContext.Provider>
  )
}
