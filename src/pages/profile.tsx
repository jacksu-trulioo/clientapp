import { getSession } from "@auth0/nextjs-auth0"
import { Center, Grid, GridItem, Heading, Stack } from "@chakra-ui/layout"
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  chakra,
  CloseButton,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Skeleton,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react"
import * as Sentry from "@sentry/nextjs"
import { Form, Formik, FormikProps } from "formik"
import ky from "ky"
import { GetServerSideProps } from "next"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { PropsWithChildren, useState } from "react"
import ReactCountryFlag from "react-country-flag"
import useSWR, { mutate as globalMutate } from "swr"
import * as Yup from "yup"

import {
  CaretRightIcon,
  ChangePassword,
  EditBoxIcon,
  Input,
  InputControl,
  Layout,
  Link,
  RelationshipManagerActionCard,
  SelectControl,
  SliderControl,
  SuccessTickIcon,
} from "~/components"
import { usePhoneCountryCodeList } from "~/hooks/useList"
import {
  AdditionalPreference,
  InterestedInvestments,
  InvestmentGoal,
  InvestorInformation,
  InvestorProfileGoals,
  LanguageCode,
  PortfolioOwner,
  Preference,
  Profile,
  Prospects,
  RelationshipManager,
  RiskAssessmentScore,
  User,
  UserRole,
} from "~/services/mytfo/types"
import formatYearName from "~/utils/formatYearName"
import {
  LanguageChangeSuccessEvent,
  ProfileSelectionEvent,
  StartChangePasswordEvent,
  UpdatePhoneNumberEvent,
} from "~/utils/googleEvents"
import { event } from "~/utils/gtag"
import withPageAuthRequired, {
  WithPageAuthRequiredProps,
} from "~/utils/withPageAuthRequired"

const Languages = [
  { label: "English", value: "EN" },
  { label: "Arabic", value: "AR" },
]

interface PropfileScreenProps
  extends PropsWithChildren<Omit<WithPageAuthRequiredProps, "user">> {
  isSocial?: boolean
  isRM?: boolean
}

function ProfileScreen(props: PropfileScreenProps) {
  const { isSocial, isRM } = props
  const { t, lang } = useTranslation("profile")
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isNumberEditable, setIsNumberEditable] = useState(false)
  const phoneCountryCodeList = usePhoneCountryCodeList()

  const {
    isOpen: isInvestmentInfoModalOpen,
    onOpen: onInvestmentInfoModalOpen,
    onClose: onInvestmentInfoModalClose,
  } = useDisclosure()

  const toastIdRef = React.useRef(0)
  function closeToaster() {
    if (toastIdRef?.current) {
      toast.close(toastIdRef.current)
    }
  }

  React.useEffect(() => {
    if (sessionStorage.getItem("initiator")) {
      sessionStorage.removeItem("initiator")
      toastIdRef.current = toast({
        isClosable: true,
        position: "top",
        render: () => (
          <HStack
            py="3"
            ps="10px"
            pe="4"
            bg="shinyShamrock.800With10Opacity"
            direction="row"
            alignItems="center"
            borderRadius="2px"
            role="alert"
            justifyContent="center"
          >
            <HStack>
              <SuccessTickIcon w={5} h={5} color="shinyShamrock.800" />
              <Text fontSize="md" color="white">
                {t("tabs.preferences.riskChangeToaster.description")}
              </Text>
            </HStack>

            <CloseButton onClick={closeToaster} />
          </HStack>
        ),
      }) as number
      onInvestmentInfoModalOpen()
    }
  }, [])

  const isDesktop = useBreakpointValue({
    base: false,
    md: false,
    lg: true,
  })
  const isTabletView = useBreakpointValue({
    base: false,
    md: true,
    lg: false,
  })

  const { data: user } = useSWR<User>("/api/user")

  const { data: prospects, error: prospectsError } = useSWR<Prospects>(
    isRM ? "/api/user/prospects" : null,
  )

  const [, page] = location.hash.split("#")

  const { data: rmData, error: rmError } = useSWR<RelationshipManager>(
    "/api/user/relationship-manager",
  )

  const { data: investmentGoals } = useSWR<InvestorProfileGoals>(
    "/api/user/investment-goals",
  )

  const { data: riskScoreResult } = useSWR<RiskAssessmentScore>(
    "/api/user/risk-assessment/retake-result",
  )

  const allGoals = Object.keys(InvestmentGoal)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      label: t(`tabs.preferences.goalLabels.${key}`),
      value: InvestmentGoal[key as keyof typeof InvestmentGoal],
    }))

  const portfolioOwnerList = Object.values(PortfolioOwner).map((val) => {
    return {
      label: t(`tabs.preferences.portfolioOwnerListLabels.${val}`),
      value: val,
    }
  })

  const allAdditionalPreferences = Object.keys(AdditionalPreference)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      label: t(`tabs.preferences.additionalPreferencesLabels.${key}`),
      value: AdditionalPreference[key as keyof typeof AdditionalPreference],
    }))

  const preferencesPostulates = [
    {
      label: t("tabs.preferences.preferencePostulateLabels.interest"),
      value: user?.profile?.investorSurvey?.interestedInvestments,
    },
    {
      label: t("tabs.preferences.preferencePostulateLabels.investmentHorizon"),
      value: investmentGoals?.investmentDurationInYears,
    },
    {
      label: t("tabs.preferences.preferencePostulateLabels.investmentGoals"),
      value: investmentGoals?.investmentGoals,
    },
    {
      label: t(
        "tabs.preferences.preferencePostulateLabels.investmentPreferences",
      ),
      value: investmentGoals?.additionalPreferences,
    },
    {
      label: t("tabs.preferences.preferencePostulateLabels.beneficiar"),
      value: investmentGoals?.whoIsPortfolioFor,
    },
    {
      label: t("tabs.preferences.preferencePostulateLabels.riskLevel"),
      value: riskScoreResult?.data?.scoreDescription,
    },
  ]

  React.useEffect(() => {
    if (isOpen) {
      event(StartChangePasswordEvent)
    }
  }, [isOpen])

  React.useEffect(() => {
    event(ProfileSelectionEvent)
  }, [])

  const isRmLoading = !rmData && !rmError
  const isRelationshipManagerAssigned = rmData?.assigned
  const isAssignedProspectLoading = !prospects && !prospectsError

  const {
    data: preferredLanguage,
    error: preferredLanguageError,
    mutate,
  } = useSWR<Preference>("/api/user/preference")
  const isLoading = !preferredLanguage && !preferredLanguageError

  // Required to prevent duplicate toasts.
  const toastId = "toast-error"

  const isMobileView = useBreakpointValue({ base: true, md: false, lg: false })
  const isDesktopView = !isMobileView

  const sendVerificationCode = async (phoneNumber?: string) => {
    await ky.post("/api/auth/send-otp", {
      json: {
        phoneNumber:
          phoneNumber ||
          `${user?.profile?.phoneCountryCode}${user?.profile?.phoneNumber}`,
      },
    })
    await router.push("/otp-verification")
  }

  const getInitialFlag = (phoneCountryCode: string) => {
    const countryCodeoption = phoneCountryCodeList.find(
      (option) => option.value === phoneCountryCode,
    )
    return countryCodeoption?.label?.split(" ")?.[0]
  }

  const InvestmentGoalsModal = () => {
    const { data: investmentGoals } = useSWR<InvestorProfileGoals>(
      "/api/user/investment-goals",
    )
    return (
      <Modal
        closeOnOverlayClick={true}
        isOpen={isInvestmentInfoModalOpen}
        onClose={onInvestmentInfoModalClose}
        size={isMobileView ? "full" : "xl"}
        isCentered={false}
        autoFocus={false}
        returnFocusOnClose={false}
      >
        <ModalOverlay />
        <ModalContent
          maxW={{ base: "md", md: "80%" }}
          sx={{
            bgColor: "gray.800",
          }}
        >
          <ModalBody aria-label="editProposalModal" pb={6}>
            <Formik<InvestorInformation>
              enableReinitialize
              initialValues={{
                InvestmentGoals: {
                  investmentGoals: investmentGoals?.investmentGoals || [],
                  whoIsPortfolioFor:
                    investmentGoals?.whoIsPortfolioFor || undefined,
                  investmentDurationInYears:
                    investmentGoals?.investmentDurationInYears || 7,
                  additionalPreferences:
                    investmentGoals?.additionalPreferences || [],
                },
                Identity: {
                  interestedInvestments:
                    user?.profile?.investorSurvey?.interestedInvestments,
                },
              }}
              validationSchema={Yup.object({
                InvestmentGoals: Yup.object({
                  whoIsPortfolioFor: Yup.string()
                    .oneOf(Object.values(PortfolioOwner))
                    .required(t("common:errors.required")),
                  investmentGoals: Yup.array()
                    .of(Yup.string().oneOf(Object.keys(InvestmentGoal)))
                    .min(1, t("common:errors.required")),
                  investmentDurationInYears: Yup.number()
                    .min(1)
                    .max(25)
                    .required(),
                  additionalPreferences: Yup.array()
                    .of(Yup.string().oneOf(Object.values(AdditionalPreference)))
                    .min(1, t("common:errors.required"))
                    .required(t("common:errors.required")),
                }),
                Identity: Yup.object({
                  interestedInvestments: Yup.array()
                    .of(Yup.string().oneOf(Object.keys(InterestedInvestments)))
                    .min(1, t("common:errors.required"))
                    .required(t("common:errors.required")),
                }),
              })}
              onSubmit={async (values) => {
                try {
                  const { InvestmentGoals } = { ...values }

                  const apiInvestmentGoals = { ...investmentGoals }
                  apiInvestmentGoals.investmentDurationInYears =
                    InvestmentGoals?.investmentDurationInYears
                  apiInvestmentGoals.whoIsPortfolioFor =
                    InvestmentGoals?.whoIsPortfolioFor
                  apiInvestmentGoals.investmentGoals =
                    InvestmentGoals?.investmentGoals
                  apiInvestmentGoals.additionalPreferences =
                    InvestmentGoals?.additionalPreferences

                  await ky
                    .put("/api/user/investment-goals", {
                      json: apiInvestmentGoals,
                    })
                    .json<InvestorProfileGoals>()

                  onInvestmentInfoModalClose()

                  // @ts-ignore
                  await mutate<InvestorProfileGoals>(
                    "/api/user/investment-goals",
                  )
                } catch (e) {
                  console.log(e)
                }
              }}
            >
              {(formikProps) => {
                return (
                  <Form style={{ width: "100%" }}>
                    <ModalCloseButton />
                    <HStack
                      flexDirection="row"
                      justifyContent={{
                        base: "center",
                        md: "center",
                        lg: "space-between",
                      }}
                      w="full"
                      mb={{ base: 4, md: 9 }}
                      pt="12"
                      px="5"
                    >
                      <Text
                        fontSize="md"
                        fontWeight="extrabold"
                        color="contrast.200"
                      >
                        {t("tabs.preferences.editGoalMarkers.heading")}
                      </Text>

                      {isDesktop && (
                        <HStack spacing="12">
                          <Button
                            colorScheme="primary"
                            variant="ghost"
                            onClick={() => formikProps.resetForm()}
                          >
                            {t("tabs.preferences.editGoalMarkers.reset")}
                          </Button>
                          <Button
                            variant="solid"
                            colorScheme="primary"
                            role="button"
                            type="submit"
                            isLoading={formikProps?.isSubmitting}
                          >
                            {t("tabs.preferences.editGoalMarkers.update")}
                          </Button>
                        </HStack>
                      )}
                    </HStack>
                    <Divider mb="12"></Divider>
                    <Stack
                      w={{ base: "full", md: "full", lg: "full" }}
                      direction={{ base: "column", md: "column", lg: "row" }}
                      spacing={{ base: 6, md: 12, lg: 6 }}
                      px={{ base: 0, md: 0, lg: "70px" }}
                      mb="8"
                    >
                      <Stack
                        direction={{
                          base: "column",
                          md: "column",
                          lg: "column",
                        }}
                        spacing="6"
                        w="full"
                      >
                        <SelectControl
                          name="InvestmentGoals.investmentGoals"
                          maxW={{ base: "md", md: "full", lg: "full" }}
                          selectProps={{
                            options: allGoals,
                            isMulti: true,
                          }}
                          label={t(
                            "tabs.preferences.editGoalMarkers.investmentGoals",
                          )}
                          zIndex="overlay"
                        />
                        <SelectControl
                          name="InvestmentGoals.whoIsPortfolioFor"
                          maxW={{ base: "md", md: "full", lg: "full" }}
                          selectProps={{
                            options: portfolioOwnerList,
                          }}
                          color="contrast.200"
                          label={t(
                            "tabs.preferences.editGoalMarkers.portfolioBeneficiar",
                          )}
                        />
                      </Stack>
                      <Stack
                        direction={{
                          base: "column",
                          md: "column",
                          lg: "column",
                        }}
                        spacing="6"
                        w="full"
                      >
                        <SliderControl
                          aria-label="Time horizon slider"
                          name="InvestmentGoals.investmentDurationInYears"
                          label={(value) => (
                            <Flex justifyContent="space-between">
                              <FormLabel fontSize="sm" color="gray.400">
                                {t(
                                  "tabs.preferences.editGoalMarkers.timeHorizon",
                                )}
                              </FormLabel>
                              <Text fontSize="sm" color="white">
                                {value} {formatYearName(value, lang)}
                              </Text>
                            </Flex>
                          )}
                          sliderProps={{
                            colorScheme: "primary",
                            min: 1,
                            max: 25,
                            step: 1,
                          }}
                        />
                        <SelectControl
                          name="InvestmentGoals.additionalPreferences"
                          maxW={{ base: "full", md: "full", lg: "full" }}
                          selectProps={{
                            options: allAdditionalPreferences,
                            isMulti: true,
                            onChange: (values) => {
                              let filteredArr = values?.filter(
                                (val) => val.label === "None",
                              )
                              if (filteredArr.length === 1) {
                                formikProps.setFieldValue(
                                  "InvestmentGoals.additionalPreferences",
                                  ["None"],
                                )
                              } else {
                                filteredArr = values?.filter(
                                  (val) => val.label !== "None",
                                )
                                const newArr = filteredArr.map(
                                  (val) => val.value,
                                )
                                formikProps.setFieldValue(
                                  "InvestmentGoals.additionalPreferences",
                                  newArr,
                                )
                              }
                            },
                          }}
                          label={t(
                            "tabs.preferences.editGoalMarkers.preferences",
                          )}
                        />
                        <HStack justifyContent="space-between" w="full" p="3">
                          <Text
                            fontSize="sm"
                            textAlign="start"
                            color="contrast.200"
                          >
                            <chakra.span fontSize="sm" color="gray.500">
                              {t("tabs.preferences.editGoalMarkers.riskLevel")}{" "}
                              :{" "}
                            </chakra.span>
                            <chakra.span fontSize="sm">
                              {riskScoreResult?.data?.scoreDescription}
                            </chakra.span>
                          </Text>
                          <Link
                            color="primary.500"
                            href="personalized-proposal/start-risk-assessment?name=profile"
                            textAlign="end"
                          >
                            {" "}
                            {t(
                              "tabs.preferences.editGoalMarkers.riskAssessment",
                            )}
                          </Link>
                        </HStack>
                      </Stack>
                    </Stack>
                    {(isMobileView || isTabletView) && (
                      <VStack spacing="6" mt="6">
                        <Button
                          variant="solid"
                          colorScheme="primary"
                          role="button"
                          type="submit"
                          w="full"
                          isLoading={formikProps?.isSubmitting}
                        >
                          {t("tabs.preferences.editGoalMarkers.update")}
                        </Button>
                        <Button
                          colorScheme="primary"
                          variant="ghost"
                          onClick={() => formikProps.resetForm()}
                        >
                          {" "}
                          {t("tabs.preferences.editGoalMarkers.reset")}
                        </Button>
                      </VStack>
                    )}
                  </Form>
                )
              }}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  }

  const mobileViewPrefrenceGrid = () => {
    return (
      <SimpleGrid columns={1}>
        {preferencesPostulates.map((item) => {
          return (
            <VStack
              alignItems="flex-start"
              textAlign="start"
              position="relative"
              py="4"
              key={item.label}
            >
              <Text aria-label="breakdown" color="gray.500" fontSize="md">
                {item?.label}
              </Text>
              {!Array.isArray(item.value) ? (
                <Text>{item.value}</Text>
              ) : (
                <chakra.span maxW="full" fontSize="md" color="contrast.200">
                  {item?.value?.join(", ")}
                </chakra.span>
              )}
            </VStack>
          )
        })}
      </SimpleGrid>
    )
  }

  const showPreferenceTab = () => {
    return (
      <>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading
            as="h2"
            fontSize={{ base: "md", md: "2xl" }}
            {...(!isMobileView && { mb: "2" })}
          >
            {t("tabs.preferences.preferencePostulateLabels.investmentProfile")}
          </Heading>
          <Button
            variant="outline"
            colorScheme="primary"
            onClick={() => {
              onInvestmentInfoModalOpen()
            }}
          >
            {t("tabs.preferences.preferencePostulateLabels.edit")}
          </Button>
        </Flex>
        {isMobileView ? (
          mobileViewPrefrenceGrid()
        ) : (
          <SimpleGrid
            columns={isMobileView ? 1 : 2}
            mb="12"
            {...(lang === "en" && {
              sx: {
                "div:nth-of-type(odd)": {
                  marginEnd: "3",
                  marginStart: "10",
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    top: "1",
                    right: "-3",
                    bottom: "-2",
                    borderStart: "1px solid",
                    borderStartColor: "gray.700",
                  },
                },
                "div:nth-of-type(even)": {
                  marginStart: "3",
                  marginEnd: "10",
                },
                "div:nth-last-of-type(2)": {
                  borderBottom: "none",
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
                  marginStart: "10",
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
                  marginEnd: "10",
                },
                "div:nth-last-of-type(2)": {
                  borderBottom: "none",
                },
                "div:nth-last-of-type(1)": {
                  borderBottom: "none",
                },
              },
            })}
          >
            {preferencesPostulates.map((item) => {
              return (
                <VStack
                  alignItems="flex-start"
                  textAlign="start"
                  position="relative"
                  py="4"
                  key={item.label}
                >
                  <Text aria-label="breakdown" color="gray.500" fontSize="md">
                    {item?.label}
                  </Text>
                  {!Array.isArray(item.value) ? (
                    <Text>{item.value}</Text>
                  ) : (
                    <chakra.span maxW="full" fontSize="md" color="contrast.200">
                      {item?.value?.join(", ")}
                    </chakra.span>
                  )}
                </VStack>
              )
            })}
          </SimpleGrid>
        )}

        <Divider orientation="horizontal" mb="10"></Divider>

        <Heading
          as="h2"
          fontSize={{ base: "md", md: "2xl" }}
          mb="2"
          {...(isMobileView && { mt: "8" })}
        >
          {t("tabs.preferences.heading")}
        </Heading>
        <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400" mb="4">
          {t("tabs.preferences.subHeading")}
        </Text>
        {!isLoading && (
          <Formik<Preference>
            initialValues={{
              language: preferredLanguage?.language || undefined,
              selectedProposal: preferredLanguage?.selectedProposal,
            }}
            validationSchema={Yup.object({
              language: Yup.mixed<LanguageCode>()
                // oneOf should accept readonly array.
                // https://github.com/jquense/yup/issues/1298
                .oneOf(["EN", "AR"], t("common:errors.required"))
                .required(t("common:errors.required")),
            })}
            onSubmit={async (values) => {
              try {
                event(LanguageChangeSuccessEvent)

                await ky
                  .post("/api/user/preference", {
                    json: values,
                  })
                  .json<Preference>()

                // NOTE: we invalidate the swr call for preference because we are updating data
                mutate()

                toast({
                  title: t("tabs.preferences.toast.title"),
                  description: t("tabs.preferences.toast.description"),
                  status: "success",
                  isClosable: true,
                  variant: "subtle",
                  position: "top",
                })

                window.location.replace(values.language === "AR" ? "/ar" : "/")
              } catch (error) {
                // Show toast error.
                if (!toast.isActive(toastId)) {
                  toast({
                    id: toastId,
                    title: t("common:toast.generic.error.title"),
                    variant: "subtle",
                    status: "error",
                    isClosable: true,
                    position: "bottom",
                  })
                }
              }
            }}
          >
            {(formikProps) => (
              <Form>
                <Stack direction={{ base: "column", md: "row" }}>
                  <SelectControl
                    name="language"
                    maxW={{ base: "full", md: "xs" }}
                    selectProps={{
                      placeholder: "Select",
                      options: Languages,
                    }}
                  />
                  <Box>
                    <Button
                      isFullWidth
                      colorScheme="primary"
                      variant="solid"
                      type="submit"
                      mt="2"
                      disabled={
                        preferredLanguage?.language ===
                        formikProps.values.language
                      }
                    >
                      {t("tabs.preferences.button.applyChanges")}
                    </Button>
                  </Box>
                </Stack>
              </Form>
            )}
          </Formik>
        )}

        {isDesktopView && (
          <Box mt="8">
            <Heading as="h2" fontSize={{ base: "md", md: "2xl" }} mb="8">
              {t("changePassword.text.password")}
            </Heading>
            <Button
              disabled={isSocial}
              onClick={onOpen}
              variant="outline"
              colorScheme="primary"
            >
              {t("changePassword.button.change")}
            </Button>

            <ChangePassword isOpen={isOpen} onClose={onClose} />
          </Box>
        )}
      </>
    )
  }

  const renderProspectTable = () => {
    const tableSize = isMobileView ? "sm" : "md"
    const prospectLinkLabelKey = `tabs.assignedProspect.button.${
      isMobileView ? "view" : "viewProposal"
    }`

    if (isAssignedProspectLoading) {
      return (
        <Stack padding={4}>
          <HStack w="full">
            <Skeleton height="40px" width="full" />
            <Skeleton height="40px" width="full" />
            <Skeleton height="40px" width="full" />
          </HStack>
          <HStack w="full">
            <Skeleton height="32px" width="full" />
            <Skeleton height="32px" width="full" />
            <Skeleton height="32px" width="full" />
          </HStack>
          <HStack w="full">
            <Skeleton height="32px" width="full" />
            <Skeleton height="32px" width="full" />
            <Skeleton height="32px" width="full" />
          </HStack>
        </Stack>
      )
    }

    if (prospectsError) {
      Sentry.captureException(prospectsError)
      return null
    }

    return (
      <TableContainer w="full">
        <Table variant="striped" size={tableSize}>
          <Thead>
            <Tr>
              <Th>{t("tabs.assignedProspect.labels.contactID")}</Th>
              <Th>{t("tabs.assignedProspect.labels.prospectName")}</Th>
              <Th isNumeric>{t("tabs.assignedProspect.labels.proposal")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {prospects &&
              prospects?.map((prospect) => (
                <Tr key={prospect.contactId}>
                  <Td>#{prospect.contactId}</Td>
                  <Td>{prospect.name}</Td>
                  <Td isNumeric>
                    <Link
                      target="_blank"
                      href={prospect.proposalLink}
                      color="primary.500"
                    >
                      {t(prospectLinkLabelKey)}
                    </Link>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    )
  }

  const showMobileView = (formikProps: FormikProps<Profile>) => {
    return (
      <Container p="0" mt="8">
        <Center>
          <Heading as="h1" mb={{ base: 14 }}>
            {t("tabs.heading")}
          </Heading>
        </Center>

        <Accordion
          allowToggle
          {...(page === "preference" && { defaultIndex: [1] })}
        >
          <AccordionItem>
            <h2>
              <AccordionButton
                onClick={() => router.replace("/profile#personalDetails")}
              >
                <Box flex="1" textAlign="start">
                  {t("tabs.personal.name")}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} bgColor="gray.900">
              <Text mt="6" mb="6" color="gray.400">
                {t("tabs.personal.headings.personalInfo")}
              </Text>

              <Flex direction="column">
                <Box mb="6">
                  <FormLabel fontSize="sm" color="gray.400">
                    {t("tabs.personal.fields.label.firstName")}
                  </FormLabel>
                  <Input disabled value={user?.profile.firstName} />
                </Box>

                <Box mb="12">
                  <FormLabel fontSize="sm" color="gray.400">
                    {t("tabs.personal.fields.label.lastName")}
                  </FormLabel>
                  <Input disabled value={user?.profile.lastName} />
                </Box>

                <Text
                  mt={{ base: "0", md: "12" }}
                  mb={{ base: "6", md: "12" }}
                  color="gray.400"
                >
                  {t("tabs.personal.headings.contactInfo")}
                </Text>
                <Box mb="6">
                  <FormLabel fontSize="sm" color="gray.400">
                    {t("tabs.personal.fields.label.email")}
                  </FormLabel>
                  <Input disabled value={user?.email} />
                </Box>

                <FormControl>
                  <HStack>
                    <FormLabel
                      color="gray.400"
                      display="flex"
                      alignItems="center"
                      pb="0"
                      mb="0"
                    >
                      {t("tabs.personal.fields.label.primaryPhoneNumber")}
                    </FormLabel>
                    {user?.phoneNumberVerified ? (
                      <Text
                        color="shinyShamrock.800"
                        fontSize="xs"
                        px="2"
                        py="1"
                        bgColor="shinyShamrock.800WithOpacity"
                        borderRadius="6px"
                      >
                        {t("tabs.personal.fields.label.verified")}
                      </Text>
                    ) : (
                      <Text
                        color="warningRed.300"
                        fontSize="xs"
                        px="2"
                        py="1"
                        bgColor="warningRed.300WithOpacity"
                        borderRadius="6px"
                      >
                        {t("tabs.personal.fields.label.notVerified")}
                      </Text>
                    )}
                  </HStack>
                  <Flex
                    alignItems="start"
                    {...(lang === "ar" && {
                      flexDirection: "row-reverse",
                    })}
                    mt="2"
                  >
                    <SelectControl
                      name="phoneCountryCode"
                      aria-label="phoneCountryCode"
                      selectProps={{
                        options: phoneCountryCodeList,
                        blurInputOnSelect: true,
                      }}
                      w="70%"
                      showLabel={false}
                      isDisabled={!isNumberEditable}
                      inputLeftElement={
                        <ReactCountryFlag
                          // @ts-ignore
                          countryCode={
                            formikProps?.values?.phoneCountryCode
                              ? getInitialFlag(
                                  formikProps?.values?.phoneCountryCode,
                                )
                              : undefined
                          }
                          svg
                          title={
                            user?.profile.phoneCountryCode
                              ? getInitialFlag(user?.profile.phoneCountryCode)
                              : undefined
                          }
                          style={{
                            width: "20px",
                            height: "30px",
                          }}
                        />
                      }
                    />

                    <InputControl
                      aria-label="phoneNumber"
                      name="phoneNumber"
                      {...(lang === "ar"
                        ? {
                            mr: "2",
                          }
                        : { ml: "2" })}
                      isDisabled={!isNumberEditable}
                      inputRightElement={
                        !isNumberEditable ? (
                          <EditBoxIcon
                            width="6"
                            height="6"
                            color="primary.500"
                            _hover={{
                              cursor: "pointer",
                              color: "primary.600",
                            }}
                            onClick={() => setIsNumberEditable(true)}
                          />
                        ) : undefined
                      }
                      {...(!isNumberEditable && {
                        mask: [
                          /\d/,
                          "X",
                          "-",
                          " ",
                          "X",
                          "X",
                          "X",
                          "X",
                          "X",
                          "X",
                          "X",
                        ],
                      })}
                    />
                  </Flex>
                </FormControl>
                {isNumberEditable && (
                  <HStack mt="5" justifyContent="flex-end" spacing="6">
                    <Button
                      colorScheme="primary"
                      variant="link"
                      size="sm"
                      onClick={() => {
                        setIsNumberEditable(false)
                        formikProps.resetForm()
                      }}
                    >
                      {t("tabs.personal.button.cancel")}
                    </Button>
                    <Button
                      colorScheme="primary"
                      variant="outline"
                      size="sm"
                      type="submit"
                      isLoading={formikProps.isSubmitting}
                      onClick={() => formikProps.submitForm()}
                    >
                      <span>
                        {t("tabs.personal.button.updateAndVerify")}{" "}
                        <CaretRightIcon
                          {...(lang === "ar" && {
                            transform: "rotate(180deg)",
                          })}
                        />
                      </span>
                    </Button>
                  </HStack>
                )}
                {!user?.phoneNumberVerified && !isNumberEditable && (
                  <>
                    <Text color="gray.400" fontSize="xs" maxW="lg" mt="2">
                      {t("tabs.personal.label.verifyNumber")}{" "}
                      <chakra.span
                        color="primary.500"
                        cursor="pointer"
                        onClick={() => sendVerificationCode()}
                      >
                        {t("tabs.personal.label.sendCode")}
                      </chakra.span>
                    </Text>
                  </>
                )}
              </Flex>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton
                onClick={() => router.replace("/profile#preference")}
              >
                <Box flex="1" textAlign="start">
                  {t("tabs.preferences.name")}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel
              pb={4}
              {...(!isMobileView && { bgColor: "gray.900" })}
            >
              {showPreferenceTab()}
              <Box mt="8">
                <Text mb="4">{t("changePassword.heading")}</Text>
                <Button
                  onClick={onOpen}
                  disabled={isSocial}
                  variant="outline"
                  colorScheme="primary"
                  width="full"
                >
                  {t("changePassword.button.change")}
                </Button>

                <ChangePassword isOpen={isOpen} onClose={onClose} />
              </Box>
            </AccordionPanel>
          </AccordionItem>
          {isRM && (
            <AccordionItem>
              <h2>
                <AccordionButton
                  onClick={() => router.replace("/profile#assignedProspect")}
                >
                  <Box flex="1" textAlign="start">
                    {t("tabs.assignedProspect.name")}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel px="0">{renderProspectTable()}</AccordionPanel>
            </AccordionItem>
          )}
        </Accordion>
      </Container>
    )
  }

  return (
    <Layout title={t("page.title")} description={t("page.description")}>
      <Formik<Profile>
        initialValues={{
          phoneCountryCode: user?.profile?.phoneCountryCode,
          phoneNumber: user?.profile?.phoneNumber,
        }}
        validationSchema={Yup.object({
          phoneCountryCode: Yup.string().required(t("common:errors.required")),
          phoneNumber: Yup.string()
            .matches(/^\d*$/, t("common:errors.numberAllowed"))
            .required(t("common:errors.required"))
            .when("phoneCountryCode", {
              is: (value: string) => {
                return value === "+966" || value === "+971"
              },

              then: Yup.string()
                .required(t("common:errors.required"))
                .max(
                  9,
                  t("common:errors.phoneNumberLength", {
                    digit: 9,
                  }),
                )
                .min(
                  9,
                  t("common:errors.phoneNumberLength", {
                    digit: 9,
                  }),
                )
                .nullable(),
            })
            .when("phoneCountryCode", {
              is: (value: string) => {
                return (
                  value === "+974" ||
                  value === "+965" ||
                  value === "+968" ||
                  value === "+973"
                )
              },
              then: Yup.string()
                .required(t("common:errors.required"))
                .max(
                  8,
                  t("common:errors.phoneNumberLength", {
                    digit: 8,
                  }),
                )
                .min(
                  8,
                  t("common:errors.phoneNumberLength", {
                    digit: 8,
                  }),
                )
                .nullable(),
            })
            .when("phoneCountryCode", {
              is: (value: string) => {
                return (
                  value !== "+966" &&
                  value !== "+965" &&
                  value !== "+973" &&
                  value !== "+968" &&
                  value !== "+974" &&
                  value !== "+971"
                )
              },
              then: Yup.string()
                .required(t("common:errors.required"))
                .max(
                  15,
                  t("common:errors.phoneNumberLengthMax", {
                    digit: 15,
                  }),
                )
                .nullable(),
            }),
        })}
        onSubmit={async (values) => {
          try {
            await ky
              .patch("/api/user/profile/phone-number", {
                json: {
                  number: values.phoneNumber,
                  countryCode: values.phoneCountryCode,
                },
              })
              .json()
            await globalMutate("/api/user")
            event(UpdatePhoneNumberEvent)
            await sendVerificationCode(
              `${values.phoneCountryCode}${values.phoneNumber}`,
            )
          } catch (e) {
            toast({
              title: t("common:toast.generic.error.title"),
              status: "error",
              isClosable: true,
              variant: "subtle",
              position: "bottom",
            })
          }
        }}
      >
        {(formikProps) =>
          isDesktopView ? (
            <>
              <Heading as="h1" mb={{ base: 4, md: 6 }}>
                {t("tabs.heading")}
              </Heading>

              {!isRmLoading && isRelationshipManagerAssigned && (
                <RelationshipManagerActionCard manager={rmData?.manager} />
              )}

              <Tabs
                colorScheme="primary"
                defaultIndex={page === "preference" ? 1 : 0}
              >
                <TabList>
                  <Tab
                    _selected={{
                      color: "white",
                      borderBottomColor: "primary.500",
                    }}
                    onClick={() => router.replace("/profile#personalDetails")}
                  >
                    {t("tabs.personal.name")}
                  </Tab>
                  <Tab
                    _selected={{
                      color: "white",
                      borderBottomColor: "primary.500",
                    }}
                    onClick={() => router.replace("/profile#preference")}
                  >
                    {t("tabs.preferences.name")}
                  </Tab>
                  {isRM && (
                    <Tab
                      _selected={{
                        color: "white",
                        borderBottomColor: "primary.500",
                      }}
                      onClick={() =>
                        router.replace("/profile#assignedProspect")
                      }
                    >
                      {t("tabs.assignedProspect.name")}
                    </Tab>
                  )}
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <Heading as="h2" fontSize="2xl" mb="12">
                      {t("tabs.personal.headings.personalInfo")}
                    </Heading>

                    <>
                      <Grid
                        templateRows="repeat(2, 1fr)"
                        templateColumns="repeat(2, 1fr)"
                        gap="8"
                      >
                        <GridItem rowSpan={2} colSpan={1}>
                          <FormLabel color="gray.400">
                            {t("tabs.personal.fields.label.firstName")}
                          </FormLabel>
                          <Input disabled value={user?.profile.firstName} />
                        </GridItem>

                        <GridItem rowSpan={2} colSpan={1}>
                          <FormLabel color="gray.400">
                            {t("tabs.personal.fields.label.lastName")}
                          </FormLabel>
                          <Input disabled value={user?.profile.lastName} />
                        </GridItem>
                      </Grid>

                      <Heading
                        as="h2"
                        fontSize="2xl"
                        mt={{ base: "0", md: "12" }}
                        mb={{ base: "6", md: "12" }}
                      >
                        {t("tabs.personal.headings.contactInfo")}
                      </Heading>

                      <Grid
                        templateRows="repeat(2, 1fr)"
                        templateColumns="repeat(2, 1fr)"
                        gap="8"
                      >
                        <GridItem rowSpan={2} colSpan={1}>
                          <FormLabel fontSize="sm" color="gray.400">
                            {t("tabs.personal.fields.label.email")}
                          </FormLabel>
                          <Input disabled value={user?.email} />
                        </GridItem>
                        <GridItem rowSpan={2} colSpan={1}>
                          <FormControl>
                            <Flex>
                              <FormLabel
                                color="gray.400"
                                display="flex"
                                alignItems="flex-start"
                                pb="0"
                                mb="0"
                              >
                                {t(
                                  "tabs.personal.fields.label.primaryPhoneNumber",
                                )}
                              </FormLabel>
                              {user?.phoneNumberVerified ? (
                                <Text
                                  color="shinyShamrock.800"
                                  fontSize="xs"
                                  px="2"
                                  py="1"
                                  bgColor="shinyShamrock.800WithOpacity"
                                  borderRadius="6px"
                                >
                                  {t("tabs.personal.fields.label.verified")}
                                </Text>
                              ) : (
                                <Text
                                  color="warningRed.300"
                                  fontSize="xs"
                                  px="2"
                                  py="1"
                                  bgColor="warningRed.300WithOpacity"
                                  borderRadius="6px"
                                >
                                  {t("tabs.personal.fields.label.notVerified")}
                                </Text>
                              )}
                            </Flex>
                            <Flex
                              mt="1"
                              alignItems="start"
                              {...(lang === "ar" && {
                                flexDirection: "row-reverse",
                              })}
                            >
                              <SelectControl
                                name="phoneCountryCode"
                                aria-label="phoneCountryCode"
                                selectProps={{
                                  options: phoneCountryCodeList,
                                  blurInputOnSelect: true,
                                }}
                                w="70%"
                                showLabel={false}
                                isDisabled={!isNumberEditable}
                                inputLeftElement={
                                  <ReactCountryFlag
                                    // @ts-ignore
                                    countryCode={
                                      formikProps?.values?.phoneCountryCode
                                        ? getInitialFlag(
                                            formikProps?.values
                                              ?.phoneCountryCode,
                                          )
                                        : undefined
                                    }
                                    svg
                                    title={
                                      user?.profile?.phoneCountryCode
                                        ? getInitialFlag(
                                            user?.profile?.phoneCountryCode,
                                          )
                                        : undefined
                                    }
                                    style={{
                                      width: "20px",
                                      height: "30px",
                                    }}
                                  />
                                }
                              />
                              <InputControl
                                name="phoneNumber"
                                {...(lang === "ar"
                                  ? {
                                      mr: 2,
                                    }
                                  : { ml: 2 })}
                                {...(!isNumberEditable && {
                                  mask: [
                                    /\d/,
                                    "X",
                                    "-",
                                    " ",
                                    "X",
                                    "X",
                                    "X",
                                    "X",
                                    "X",
                                    "X",
                                    "X",
                                  ],
                                })}
                                aria-label="phoneNumber"
                                isDisabled={!isNumberEditable}
                                inputRightElement={
                                  !isNumberEditable ? (
                                    <EditBoxIcon
                                      width="6"
                                      height="6"
                                      color="primary.500"
                                      _hover={{
                                        cursor: "pointer",
                                        color: "primary.600",
                                      }}
                                      onClick={() => setIsNumberEditable(true)}
                                    />
                                  ) : undefined
                                }
                              />
                            </Flex>
                          </FormControl>
                          {isNumberEditable && (
                            <HStack
                              mt="5"
                              justifyContent="flex-end"
                              spacing="6"
                            >
                              <Button
                                colorScheme="primary"
                                variant="link"
                                size="sm"
                                onClick={() => {
                                  setIsNumberEditable(false)
                                  formikProps.resetForm()
                                }}
                              >
                                {t("tabs.personal.button.cancel")}
                              </Button>
                              <Button
                                colorScheme="primary"
                                variant="outline"
                                size="sm"
                                type="submit"
                                isLoading={formikProps.isSubmitting}
                                onClick={() => formikProps.submitForm()}
                              >
                                <span>
                                  {t("tabs.personal.button.updateAndVerify")}{" "}
                                  <CaretRightIcon
                                    {...(lang === "ar" && {
                                      transform: "rotate(180deg)",
                                    })}
                                  />
                                </span>
                              </Button>
                            </HStack>
                          )}
                          {!user?.phoneNumberVerified && !isNumberEditable && (
                            <>
                              <Text
                                color="gray.400"
                                fontSize="xs"
                                maxW="lg"
                                mt="2"
                              >
                                {t("tabs.personal.label.verifyNumber")}{" "}
                              </Text>
                              <Text
                                color="primary.500"
                                cursor="pointer"
                                onClick={() => sendVerificationCode()}
                              >
                                <chakra.span fontSize="xs">
                                  {t("tabs.personal.label.sendCode")}
                                </chakra.span>
                              </Text>
                            </>
                          )}
                        </GridItem>
                      </Grid>
                    </>
                  </TabPanel>

                  <TabPanel>{showPreferenceTab()}</TabPanel>
                  {isRM && (
                    <TabPanel>
                      <Box overflow="auto" maxH="480px">
                        {renderProspectTable()}
                      </Box>
                    </TabPanel>
                  )}
                </TabPanels>
              </Tabs>
            </>
          ) : (
            showMobileView(formikProps)
          )
        }
      </Formik>
      <InvestmentGoalsModal />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = getSession(ctx.req, ctx.res)

  if (session) {
    const { is_social, roles } = session
    const isRM = !!roles?.includes(UserRole.RelationshipManager)

    return {
      props: {
        isSocial: is_social,
        isRM: isRM,
      },
    }
  }

  return {
    props: { isSocial: false },
  }
}

export default withPageAuthRequired(ProfileScreen)
