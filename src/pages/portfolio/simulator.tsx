import {
  Box,
  Button,
  chakra,
  Circle,
  Divider,
  Flex,
  FormLabel,
  Heading,
  SimpleGrid,
  Stack,
  StackDivider,
  Text,
  Tooltip,
  useBreakpointValue,
  useDisclosure,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react"
import { Form, Formik } from "formik"
import ky from "ky"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import * as Yup from "yup"

import {
  Card,
  CardContent,
  CaretUpIcon,
  CheckboxControl,
  CloseIcon,
  Fab,
  GetHelpAction,
  InfoIcon,
  InputControl,
  Link,
  ModalFooter,
  ModalHeader,
  ModalLayout,
  PageContainer,
  PortfolioAllocation,
  PortfolioProjection,
  QuestionIcon,
  SliderControl,
} from "~/components"
import {
  RiskTolerance,
  SimulatedPortfolio,
  SimulatePortfolioFormInput,
} from "~/services/mytfo/types"
import formatCurrency, {
  formatCurrencyWithCommas,
} from "~/utils/formatCurrency"
import formatYearName from "~/utils/formatYearName"
import {
  SimulatorUseEvent,
  StartPreProposalQsEvent,
} from "~/utils/googleEvents"
import { event } from "~/utils/gtag"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

const initialValues = {
  investmentAmount: "300,000",
  timeHorizonInYears: 10,
  riskTolerance: 3,
  isShariaCompliant: true,
}

// Simulator parameters.
const minInvestmentAmount = 300000 // 300K.
const maxInvestmentAmount = 20000000 // 20M.
const minTimeHorizonInYears = 3
const maxTimeHorizonInYears = 25

function PortfolioSimulatorScreen() {
  const { t, lang } = useTranslation()
  const [simulatedPortfolio, setSimulatedPortfolio] =
    React.useState<SimulatedPortfolio>()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isAnimating, setIsAnimating] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [mobileMenuSelection, setMobileMenuSelection] =
    React.useState<SimulatePortfolioFormInput>(initialValues)
  const isMobileView = useBreakpointValue({ base: true, lg: false })
  const isTabletView = useBreakpointValue({
    base: false,
    md: true,
    lg: false,
  })
  const isDesktopView = useBreakpointValue({
    base: false,
    md: false,
    lg: true,
  })
  const [isGreaterThan1440] = useMediaQuery("(min-width: 1440px)")
  const { isOpen, onOpen, onClose } = useDisclosure({
    defaultIsOpen: true,
  })
  const [isScrollToTopVisible, setIsScrollToTopVisible] = React.useState(false)

  function scrollToTop() {
    if (containerRef?.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }

  const riskToleranceButtonConfig = [
    {
      label: t("simulator:controls.slider.riskTolerance.level.1.name"),
      value: RiskTolerance.VeryConservative,
    },
    {
      label: t("simulator:controls.slider.riskTolerance.level.2.name"),
      value: RiskTolerance.Conservative,
    },
    {
      label: t("simulator:controls.slider.riskTolerance.level.3.name"),
      value: RiskTolerance.Balanced,
    },
    {
      label: t("simulator:controls.slider.riskTolerance.level.4.name"),
      value: RiskTolerance.Aggressive,
    },
    {
      label: t("simulator:controls.slider.riskTolerance.level.5.name"),
      value: RiskTolerance.VeryAggressive,
    },
  ]

  function getRiskTolerance(value: number) {
    switch (value) {
      case RiskTolerance.Conservative:
        return t("simulator:controls.slider.riskTolerance.level.2.name")
      case RiskTolerance.Balanced:
        return t("simulator:controls.slider.riskTolerance.level.3.name")
      case RiskTolerance.Aggressive:
        return t("simulator:controls.slider.riskTolerance.level.4.name")
      case RiskTolerance.VeryAggressive:
        return t("simulator:controls.slider.riskTolerance.level.5.name")
      default:
        return t("simulator:controls.slider.riskTolerance.level.1.name")
    }
  }

  async function calculateSimulatedPortfolio(
    values: SimulatePortfolioFormInput,
  ) {
    try {
      setIsLoading(true)
      event(SimulatorUseEvent)
      const payloadValues = {
        ...values,
        investmentAmount:
          parseInt(values.investmentAmount.replace(/\D/g, "")) || 0,
      }
      const data = await ky
        .post("/api/portfolio/simulator", {
          json: payloadValues,
          headers: {
            "Accept-Language": lang,
          },
        })
        .json<SimulatedPortfolio>()

      setSimulatedPortfolio(data)
    } catch (error) {
      // Handle error properly.
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmit(values: SimulatePortfolioFormInput) {
    setMobileMenuSelection(values)

    // Close mobile menu.
    if (isMobileView) {
      onClose()
    }

    return calculateSimulatedPortfolio(values)
  }

  React.useEffect(() => {
    const pageContainer = containerRef.current

    if (pageContainer) {
      // Button is displayed after scrolling for 300 pixels.
      const toggleVisibility = () => {
        if (pageContainer.scrollTop > 300) {
          setIsScrollToTopVisible(true)
        } else {
          setIsScrollToTopVisible(false)
        }
      }

      pageContainer.addEventListener("scroll", toggleVisibility)

      return () => pageContainer.removeEventListener("scroll", toggleVisibility)
    }
  }, [containerRef])

  // Run simulation on initial page load.
  React.useEffect(() => {
    async function onLoad() {
      return calculateSimulatedPortfolio(initialValues)
    }

    onLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startInvesting = async () => {
    try {
      event(StartPreProposalQsEvent)
      const payloadValues = {
        ...mobileMenuSelection,
        investmentAmount:
          parseInt(mobileMenuSelection.investmentAmount.replace(/\D/g, "")) ||
          0,
      }
      await ky
        .post("/api/user/update-simulator-info", {
          json: payloadValues,
        })
        .json()
    } catch (e) {}
  }

  function showControls() {
    return (
      <Formik<SimulatePortfolioFormInput>
        initialValues={isMobileView ? mobileMenuSelection : initialValues}
        validationSchema={Yup.object({
          investmentAmount: Yup.string()
            .required(t("common:errors.required"))
            .test(
              "min",
              t("simulator:controls.input.investmentAmount.minHint"),
              (value) => {
                let x = value ? parseInt(value.replace(/\D/g, "")) : 0
                return x >= minInvestmentAmount
              },
            )
            .test(
              "max",
              t("simulator:controls.input.investmentAmount.maxHint"),
              (value) => {
                let x = value ? parseInt(value.replace(/\D/g, "")) : 0
                return x <= maxInvestmentAmount
              },
            ),
          timeHorizonInYears: Yup.number()
            .min(minTimeHorizonInYears)
            .max(maxTimeHorizonInYears)
            .required(),
          riskTolerance: Yup.number().min(1).max(5).required(),
          isShariaCompliant: Yup.boolean().required(),
        })}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, handleSubmit, isSubmitting, values, errors }) => {
          return (
            <Form
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: isMobileView ? "calc(100% - 144px)" : "100%",
                overflowY: isMobileView ? "auto" : "unset",
                padding: isMobileView ? "16px" : "0",
              }}
            >
              <VStack alignItems="start" spacing="8">
                <InputControl
                  name="investmentAmount"
                  pattern="\d*"
                  label={
                    <Stack isInline alignItems="flex-end">
                      <Text fontSize="sm" color="gray.400">
                        {t("simulator:controls.input.investmentAmount.label")}
                      </Text>
                      <Tooltip
                        hasArrow
                        label={t(
                          "simulator:controls.input.investmentAmount.tooltip",
                          {
                            minInvestmentAmount:
                              formatCurrency(minInvestmentAmount),
                          },
                        )}
                        placement="bottom"
                      >
                        <chakra.span>
                          <InfoIcon
                            cursor="pointer"
                            aria-label="Info icon"
                            color="primary.500"
                          />
                        </chakra.span>
                      </Tooltip>
                    </Stack>
                  }
                  inputLeftElement="$"
                  inputGroupProps={{
                    colorScheme: "primary",
                    variant: "flushed",
                    size: "lg",
                  }}
                  inputProps={{
                    placeholder: t(
                      "simulator:controls.input.investmentAmount.placeholder",
                    ),
                    type: "string",
                    // @ts-ignore
                    onBlur: isMobileView ? null : handleSubmit,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue(
                        "investmentAmount",
                        e.target.value
                          ? formatCurrencyWithCommas(e.target.value)
                          : "",
                      )
                    },
                  }}
                  {...(!errors?.investmentAmount && {
                    bottomTextLabel: t(
                      "simulator:controls.input.investmentAmount.minimumAmount",
                    ),
                    bottomText: {
                      marginTop: "3",
                      color: "gray.600",
                      fontSize: "xs",
                    },
                  })}
                />
                <Box w={{ base: "97%", md: "98%", lg: "full" }}>
                  <SliderControl
                    aria-label="Time horizon slider"
                    name="timeHorizonInYears"
                    label={(value: number | undefined) => (
                      <Flex justifyContent="space-between" mb="7">
                        <FormLabel fontSize="sm" color="gray.400">
                          {t("simulator:controls.slider.timeHorizon.label")}
                        </FormLabel>
                        <Text fontSize="sm" color="white">
                          {value} {formatYearName(value, lang)}
                        </Text>
                      </Flex>
                    )}
                    sliderProps={{
                      colorScheme: "primary",
                      min: 3,
                      max: 25,
                      step: 1,
                      // @ts-ignore
                      onChangeEnd: isMobileView ? null : handleSubmit,
                    }}
                  />
                </Box>
                <Box w={{ base: "97%", md: "98%", lg: "98%" }}>
                  <FormLabel fontSize="sm" color="gray.400">
                    {t("simulator:controls.slider.riskTolerance.label")}
                    {"  "}
                    <Tooltip
                      hasArrow
                      label={t(
                        "simulator:controls.input.investmentAmount.tooltip",
                        {
                          minInvestmentAmount:
                            formatCurrency(minInvestmentAmount),
                        },
                      )}
                      placement="bottom"
                    >
                      <chakra.span>
                        <InfoIcon
                          cursor="pointer"
                          aria-label="Info icon"
                          color="primary.500"
                        />
                      </chakra.span>
                    </Tooltip>
                  </FormLabel>
                  <SimpleGrid
                    spacing={2}
                    gridTemplateColumns={
                      isMobileView
                        ? "repeat(1,-webkit-fill-availabel)"
                        : "repeat(2,max-content)"
                    }
                    alignItems="center"
                  >
                    {riskToleranceButtonConfig.map((item) => {
                      return (
                        <Button
                          key={item.value}
                          width="full"
                          fontWeight="light"
                          bg="gray.800"
                          variant="solid"
                          textColor="primary.500"
                          rounded="6px"
                          borderWidth={
                            values.riskTolerance === item.value
                              ? "2px"
                              : isDesktopView
                              ? "none"
                              : "1px"
                          }
                          borderStyle="solid"
                          outline="none"
                          borderColor={
                            values.riskTolerance === item.value
                              ? "primary.500"
                              : isDesktopView
                              ? "none"
                              : "gray.700"
                          }
                          onClick={() => {
                            setFieldValue("riskTolerance", item.value)
                            if (isDesktopView) {
                              handleSubmit()
                            }
                          }}
                          {...(isDesktopView && {
                            whiteSpace: "pre-line",
                          })}
                        >
                          {item.label}
                        </Button>
                      )
                    })}
                  </SimpleGrid>
                </Box>

                <CheckboxControl
                  name="isShariaCompliant"
                  label={t(
                    "simulator:controls.checkbox.shariahCompliant.label",
                  )}
                  tooltip={t(
                    "simulator:controls.checkbox.shariahCompliant.tooltip",
                  )}
                  infoIconSize="4"
                  whiteSpace="nowrap"
                  spacing=".5rem"
                  onChangeCapture={() => {
                    if (isDesktopView) {
                      handleSubmit()
                    }
                  }}
                />
              </VStack>

              <VStack mt="10">
                {!isDesktopView && (
                  <Button
                    type="submit"
                    isFullWidth
                    variant="outline"
                    colorScheme="primary"
                    disabled={isSubmitting}
                  >
                    {t("simulator:controls.button.simulate")}
                  </Button>
                )}

                {isMobileView && (
                  <Button
                    colorScheme="primary"
                    variant="ghost"
                    isFullWidth
                    onClick={onClose}
                    disabled={isSubmitting || isAnimating}
                  >
                    {t("common:button.close")}
                  </Button>
                )}
              </VStack>
            </Form>
          )
        }}
      </Formik>
    )
  }

  return (
    <ModalLayout
      title={t("simulator:page.title")}
      description={t("simulator:page.description")}
      containerRef={containerRef}
      header={
        <ModalHeader
          {...(isMobileView && {
            boxShadow: "0 0 0 4px var(--chakra-colors-gray-900)",
          })}
          headerRight={
            <Button
              me="6"
              as={Link}
              href="/"
              aria-label="Close simulator modal"
              size="sm"
              colorScheme="primary"
              rounded="full"
              variant="link"
            >
              {t("common:button.exit")}
            </Button>
          }
          subheader={
            isMobileView && (
              <Box
                pos="absolute"
                top="60px"
                w="full"
                h="64px"
                bgColor="gray.800"
                zIndex="sticky"
                p="4"
                left="0"
                overflowY="auto"
              >
                <Stack isInline display="flex" w="full" maxW="full" spacing="2">
                  <chakra.div
                    flex="1"
                    minW="0"
                    whiteSpace="nowrap"
                    overflow="hidden"
                  >
                    <Text lineHeight="1" mb="1">
                      {formatCurrency(
                        parseInt(
                          mobileMenuSelection.investmentAmount.replace(
                            /\D/g,
                            "",
                          ),
                        ) || 0,
                      )}
                    </Text>
                    <Stack
                      isInline
                      spacing="2"
                      divider={<StackDivider borderColor="gray.500" />}
                      color="gray.500"
                    >
                      <Text fontSize="xs">
                        {mobileMenuSelection.timeHorizonInYears}{" "}
                        {formatYearName(
                          mobileMenuSelection.timeHorizonInYears,
                          lang,
                        )}
                      </Text>
                      <Text fontSize="xs">
                        {getRiskTolerance(mobileMenuSelection.riskTolerance)}
                      </Text>
                      <Text fontSize="xs">
                        {mobileMenuSelection.isShariaCompliant
                          ? t("simulator:controls.mobileMenu.shariahCompliant")
                          : t(
                              "simulator:controls.mobileMenu.nonShariahCompliant",
                            )}
                      </Text>
                    </Stack>
                  </chakra.div>

                  <chakra.div>
                    <Button
                      variant="link"
                      colorScheme="primary"
                      size="sm"
                      onClick={onOpen}
                    >
                      {t("common:button.change")}
                    </Button>
                  </chakra.div>
                </Stack>
              </Box>
            )
          }
        />
      }
      footer={
        <ModalFooter
          {...(isDesktopView && {
            px: "14",
          })}
          position="fixed"
          bottom="0"
          zIndex="popover"
        >
          <Button
            as={Link}
            href="/proposal"
            colorScheme="primary"
            isFullWidth={useBreakpointValue({ base: true, md: false })}
            onClick={startInvesting}
            pointerEvents={
              isOpen && (isMobileView || isTabletView) ? "none" : "inherit"
            }
            sx={{
              filter:
                isLoading || (isMobileView && isOpen) ? "blur(3px)" : "none",
            }}
          >
            {t("simulator:footer.button.startInvesting")}
          </Button>
        </ModalFooter>
      }
    >
      <Flex flexDirection="column" minH="100vh">
        <chakra.div as="main" display="flex" mt={isMobileView ? "48px" : 0}>
          {isMobileView ? (
            <>
              {/* Mobile dropdown menu */}
              {isOpen && (
                <Box
                  pos="fixed"
                  top="60px"
                  w="full"
                  bgColor="gray.800"
                  zIndex="popover"
                  p={{ base: "4", md: "8" }}
                  left="0"
                  style={{
                    height: "-webkit-fill-available",
                    paddingBottom: "70px",
                  }}
                  overflowY="auto"
                >
                  <Flex justifyContent="space-between" alignItems="baseline">
                    <Heading
                      mt="3"
                      mb="6"
                      fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                    >
                      {t("simulator:controls.heading")}
                    </Heading>
                    <CloseIcon color="primary.500" onClick={onClose} />
                  </Flex>

                  {showControls()}
                </Box>
              )}
            </>
          ) : (
            <Flex
              flexDirection="column"
              w="full"
              maxW="352px"
              pe={{ base: "0", md: "10", lg: "12" }}
              py="8"
            >
              <chakra.div position="sticky" top="-1" h="100vh">
                <Heading
                  mb="8"
                  mt="12"
                  fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                >
                  {t("simulator:controls.heading")}
                </Heading>
                {showControls()}
              </chakra.div>
            </Flex>
          )}

          <Flex
            width="-webkit-fill-available"
            position={isMobileView && isOpen ? "fixed" : "relative"}
          >
            {isDesktopView && (
              <chakra.div
                h="calc(100% - 32px)"
                margin="auto 0"
                w="3px"
                bgColor="gray.800"
              />
            )}
            <PageContainer
              py="12"
              maxW={isDesktopView && isGreaterThan1440 ? "4xl" : "2xl"}
              isLoading={isLoading}
              px="0"
              ps={{ base: "0", md: "10", lg: "12" }}
              mt={{ lg: "12" }}
            >
              {simulatedPortfolio && (
                <chakra.div
                  transition="0.1s filter linear"
                  sx={{
                    filter:
                      isLoading || ((isMobileView || isTabletView) && isOpen)
                        ? "blur(1px)"
                        : "none",
                  }}
                >
                  {/* No need to pass animation handler to pie chart as line chart takes same time to animate (1500ms) */}
                  <PortfolioProjection
                    portfolio={simulatedPortfolio}
                    onAnimationStart={() => setIsAnimating(true)}
                    onAnimationEnd={() => setIsAnimating(false)}
                  />
                  <Divider my="12" color="gray.700" mt="10" />
                  <PortfolioAllocation
                    allocations={simulatedPortfolio.allocations}
                  />
                  <Text
                    fontSize="sm"
                    color="gray.600"
                    mb={isMobileView ? "16" : "20"}
                  >
                    {t("simulator:disclaimer")}
                  </Text>
                  {!isDesktopView && !isTabletView && (
                    <Card mt="34px" {...(isMobileView && { mb: "20" })}>
                      <CardContent justifyContent="space-between">
                        <Flex>
                          <Circle size="10" bgColor="gray.800">
                            <QuestionIcon w="5" h="5" color="primary.500" />
                          </Circle>
                          <GetHelpAction />
                        </Flex>
                      </CardContent>
                    </Card>
                  )}
                </chakra.div>
              )}
            </PageContainer>
          </Flex>
        </chakra.div>

        {isScrollToTopVisible && (
          <Fab
            aria-label="Scroll to top"
            colorScheme="secondary"
            onClick={scrollToTop}
            bottom="24"
          >
            <CaretUpIcon h="8" w="8" />
          </Fab>
        )}
      </Flex>
    </ModalLayout>
  )
}

export default withPageAuthRequired(PortfolioSimulatorScreen)
