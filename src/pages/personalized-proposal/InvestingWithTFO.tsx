import {
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  ListItem,
  Square,
  Text,
  UnorderedList,
} from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/media-query"
import Trans from "next-translate/Trans"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import { Carousel } from "react-responsive-carousel"

import { CaretLeftIcon, CaretRightIcon } from "~/components"
import SimulatorBarChart from "~/components/simulatorBarChart"

interface InvestingWithTFOProps {
  isKycCompleted?: boolean
}

function InvestingWithTFO(props: InvestingWithTFOProps) {
  const { isKycCompleted } = props
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const { t, lang } = useTranslation("personalizedProposal")

  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isDesktopView = useBreakpointValue({ base: false, md: true })
  const isTabletView = useBreakpointValue({
    base: false,
    md: true,
    lg: false,
  })

  const updateCurrentSlide = (index: number) => {
    if (currentSlide !== index) {
      setCurrentSlide(index)
    }
  }

  const next = () => {
    setCurrentSlide(currentSlide + 1)
  }

  const prev = () => {
    setCurrentSlide(currentSlide - 1)
  }

  function customNextArrow() {
    return currentSlide !== 4 ? (
      <CaretRightIcon
        aria-label="rightCarousal"
        w={6}
        h={6}
        color="primary.500"
        onClick={next}
        position="absolute"
        top="250px"
        left={
          lang === "ar"
            ? 0
            : screen.width > 400
            ? isTabletView
              ? screen.width - 160
              : screen.width - 80
            : screen.width - 75
        }
      />
    ) : (
      <></>
    )
  }

  function customPrevArrow() {
    return currentSlide ? (
      <CaretLeftIcon
        aria-label="leftCarousal"
        w={6}
        h={6}
        onClick={prev}
        color="primary.500"
        position="absolute"
        zIndex="1"
        top="250px"
      />
    ) : (
      <></>
    )
  }

  return (
    <Container maxW="full" ps="0" mt="12" mb={isKycCompleted ? 32 : 10}>
      <Box>
        <Heading fontSize={{ base: "xl", md: "2xl" }} color="gray.400">
          {t("investingWithTFO.heading")}
        </Heading>
        <Text fontSize="md" mt="10" color="gray.400">
          {t("investingWithTFO.description")}
        </Text>

        <Trans
          i18nKey="personalizedProposal:investingWithTFO.listDescription"
          components={[
            <UnorderedList fontSize="md" mt="4" color="gray.400" key="0" />,
            <ListItem key="1" />,
          ]}
        />

        <Text mt="6" fontSize={{ base: "lg", md: "xl" }}>
          {t("investingWithTFO.title")}
        </Text>

        {isMobileView || isTabletView ? (
          <Text color="gray.400" fontSize="md" mt="4">
            {t("investingWithTFO.disclaimerNonDesktop")}
          </Text>
        ) : (
          <Text color="gray.400" fontSize="md" mt="4">
            {t("investingWithTFO.disclaimer")}
          </Text>
        )}

        {isDesktopView && !isTabletView && (
          <>
            <HStack
              spacing={3}
              justifyContent="flex-start"
              alignItems="flex-start"
              mt="8"
              width="2xl"
            >
              <Square size={{ base: "2", md: "3.5" }} bg="gunmetal.550" />
              <Text fontSize={{ base: "10px", md: "xs" }}>
                {t("investingWithTFO.chart.legends.sp500")}
              </Text>
              <Square size={{ base: "2", md: "3.5" }} bg="gunmetal.300" />
              <Text fontSize={{ base: "10px", md: "xs" }}>
                {t("investingWithTFO.chart.legends.nikkei")}
              </Text>
              <Square size={{ base: "2", md: "3.5" }} bg="gunmetal.100" />
              <Text fontSize={{ base: "10px", md: "xs" }}>
                {t("investingWithTFO.chart.legends.euroStoxx")}
              </Text>
              <Square size={{ base: "2", md: "3.5" }} bg="primary.600" />
              <Text fontSize={{ base: "10px", md: "xs" }}>
                {t("investingWithTFO.chart.legends.tfo")}
              </Text>
            </HStack>
            <Box mt="12" position="relative">
              <Divider
                borderColor="gray.700"
                position="absolute"
                top="54px"
                width="2xl"
              />
              <Divider
                borderColor="gray.700"
                position="absolute"
                top="413px"
                width="2xl"
              />
              <Divider
                borderColor="gray.700"
                position="absolute"
                top="478px"
                width="2xl"
              />
              <Divider
                borderColor="gray.700"
                position="absolute"
                top="650px"
                width="2xl"
              />
              <Flex>
                <Flex aria-label="financialCrisis" direction="column">
                  <Text
                    textAlign="center"
                    fontSize="xs"
                    color="gray.400"
                    fontWeight="bold"
                  >
                    {t("investingWithTFO.chart.labels.financialCrisis")}
                  </Text>
                  <Text
                    textAlign="center"
                    fontSize="xs"
                    color="gray.400"
                    mt="2"
                  >
                    {t("investingWithTFO.chart.quarterLabels.financialCrisis")}
                  </Text>
                  <Flex
                    height={424}
                    borderRight="1px"
                    borderColor="gray.700"
                    justify="center"
                    mt="-22px"
                  >
                    <SimulatorBarChart
                      height="400px"
                      data={[
                        {
                          name: t(
                            "investingWithTFO.chart.labels.financialCrisis",
                          ),
                          tfo: -18.9,
                          euro: -50.7,
                          nikkei: -45.5,
                          sp: -43.9,
                        },
                      ]}
                    />
                  </Flex>
                </Flex>

                <Flex
                  aria-label="europeanDebtCrisis"
                  direction="column"
                  position="relative"
                >
                  <Text
                    textAlign="center"
                    fontSize="xs"
                    color="gray.400"
                    fontWeight="bold"
                  >
                    {t("investingWithTFO.chart.labels.europeanDebtCrisis")}
                  </Text>
                  <Text
                    textAlign="center"
                    fontSize="xs"
                    color="gray.400"
                    mt="2"
                  >
                    {t(
                      "investingWithTFO.chart.quarterLabels.europeanDebtCrisis",
                    )}
                  </Text>
                  <Flex
                    height={424}
                    borderRight="1px"
                    borderColor="gray.700"
                    width="full"
                    justify="center"
                    mt="-22px"
                  >
                    <SimulatorBarChart
                      height="130px"
                      data={[
                        {
                          name: t(
                            "investingWithTFO.chart.labels.europeanDebtCrisis",
                          ),
                          tfo: -1.6,
                          euro: -12.5,
                          nikkei: -15.3,
                          sp: -11.4,
                        },
                      ]}
                    />
                  </Flex>
                </Flex>

                <Flex aria-label="coronavirusPandemic" direction="column">
                  <Text
                    textAlign="center"
                    fontSize="xs"
                    color="gray.400"
                    fontWeight="bold"
                  >
                    {t("investingWithTFO.chart.labels.coronavirusPandemic")}
                  </Text>
                  <Text
                    textAlign="center"
                    fontSize="xs"
                    color="gray.400"
                    mt="2"
                  >
                    {t(
                      "investingWithTFO.chart.quarterLabels.coronavirusPandemic",
                    )}
                  </Text>

                  <Flex
                    height={414}
                    borderColor="gray.700"
                    justify="center"
                    mt="-22px"
                  >
                    <SimulatorBarChart
                      height="200px"
                      data={[
                        {
                          name: t(
                            "investingWithTFO.chart.labels.coronavirusPandemic",
                          ),
                          tfo: -6.3,
                          euro: -20.9,
                          nikkei: -19.2,
                          sp: -19.6,
                        },
                      ]}
                    />
                  </Flex>
                </Flex>
              </Flex>
              <Flex>
                <Flex aria-label="europeanDebt" direction="column">
                  <Text
                    textAlign="center"
                    fontSize="xs"
                    color="gray.400"
                    fontWeight="bold"
                    mt="-2"
                  >
                    {t("investingWithTFO.chart.labels.europeanDebt")}
                  </Text>
                  <Text
                    textAlign="center"
                    fontSize="xs"
                    color="gray.400"
                    mt="2"
                  >
                    {t("investingWithTFO.chart.quarterLabels.europeanDebt")}
                  </Text>

                  <Flex
                    height={212}
                    borderRight="1px"
                    borderColor="gray.700"
                    justify="center"
                    mt="-29px"
                  >
                    <SimulatorBarChart
                      height="200px"
                      data={[
                        {
                          name: t("investingWithTFO.chart.labels.europeanDebt"),
                          tfo: -7.3,
                          euro: -16.5,
                          nikkei: -10.6,
                          sp: -13.9,
                        },
                      ]}
                    />
                  </Flex>
                </Flex>
                <Flex aria-label="fedReasing" direction="column">
                  <Text
                    textAlign="center"
                    fontSize="xs"
                    color="gray.400"
                    fontWeight="bold"
                    mt="-2"
                  >
                    {t("investingWithTFO.chart.labels.fedReasing")}
                  </Text>
                  <Text
                    textAlign="center"
                    fontSize="xs"
                    color="gray.400"
                    mt="2"
                  >
                    {t("investingWithTFO.chart.quarterLabels.fedReasing")}
                  </Text>

                  <Flex
                    height={212}
                    borderRight="1px"
                    borderColor="gray.700"
                    justify="center"
                    mt="-29px"
                  >
                    <SimulatorBarChart
                      height="200px"
                      data={[
                        {
                          name: t("investingWithTFO.chart.labels.fedReasing"),
                          tfo: -1.9,
                          euro: -16.9,
                          nikkei: -16.9,
                          sp: -13.5,
                        },
                      ]}
                    />
                  </Flex>
                </Flex>
              </Flex>
            </Box>
          </>
        )}

        {(isMobileView || isTabletView) && (
          <>
            <HStack
              aria-label="crisisLegends"
              spacing={4}
              justifyContent="flex-start"
              alignItems="flex-start"
              m="auto"
              mt="8"
            >
              <HStack spacing="1">
                <Square size="2.5" bg="gunmetal.550" />
                <Text fontSize="10px">
                  {t("investingWithTFO.chart.legends.sp500")}
                </Text>
              </HStack>
              <HStack spacing="1">
                <Square size="2.5" bg="gunmetal.300" />
                <Text fontSize="10px">
                  {t("investingWithTFO.chart.legends.nikkei")}
                </Text>
              </HStack>
              <HStack spacing="1">
                <Square size="2.5" bg="gunmetal.100" />
                <Text fontSize="10px">
                  {t("investingWithTFO.chart.legends.euroStoxx")}
                </Text>
              </HStack>
              <HStack spacing="1">
                <Square size="2.5" bg="primary.600" />
                <Text fontSize="10px">
                  {t("investingWithTFO.chart.legends.tfo")}
                </Text>
              </HStack>
            </HStack>
            <Box
              borderBottom="1px"
              borderColor="gray.700"
              width={isTabletView ? screen.width - 130 : screen.width - 60}
              mb="8"
              dir="ltr"
            >
              <Carousel
                showArrows={true}
                showIndicators={false}
                showStatus={false}
                renderArrowNext={customNextArrow}
                renderArrowPrev={customPrevArrow}
                selectedItem={currentSlide}
                onChange={updateCurrentSlide}
                centerMode={true}
                centerSlidePercentage={100}
                showThumbs={false}
              >
                <Box aria-label="financialCrisis" position="relative" mt="12">
                  <Text
                    textAlign="center"
                    left={isTabletView ? "280" : "120"}
                    fontSize="xs"
                    color="gray.400"
                  >
                    {t("investingWithTFO.chart.labels.financialCrisis")}
                  </Text>
                  <Text
                    textAlign="center"
                    fontSize="xs"
                    color="gray.400"
                    mt="2"
                  >
                    {t("investingWithTFO.chart.quarterLabels.financialCrisis")}
                  </Text>
                  <Divider
                    borderBottomWidth="1px"
                    borderColor="gray.700"
                    position="absolute"
                    top={lang === "ar" ? "57px" : "54px"}
                    width={
                      isTabletView ? screen.width - 130 : screen.width - 40
                    }
                  />
                  <Flex
                    justify="center"
                    width={
                      lang === "ar"
                        ? isTabletView
                          ? screen.width - 30
                          : screen.width + 30
                        : isTabletView
                        ? screen.width - 90
                        : screen.width - 30
                    }
                    mt="-22px"
                  >
                    <SimulatorBarChart
                      height="400px"
                      data={[
                        {
                          name: "financial crisis",
                          tfo: -18.9,
                          euro: -50.7,
                          nikkei: -45.5,
                          sp: -43.9,
                        },
                      ]}
                    />
                  </Flex>
                </Box>
                <Box
                  aria-label="europeanDebtCrisis"
                  position="relative"
                  mt="12"
                >
                  <Text textAlign="center" fontSize="xs" color="gray.400">
                    {t("investingWithTFO.chart.labels.europeanDebtCrisis")}
                  </Text>
                  <Text
                    textAlign="center"
                    fontSize="xs"
                    color="gray.400"
                    mt="2"
                  >
                    {t(
                      "investingWithTFO.chart.quarterLabels.europeanDebtCrisis",
                    )}
                  </Text>
                  <Divider
                    borderBottomWidth="1px"
                    borderColor="gray.700"
                    position="absolute"
                    top={lang === "ar" ? "57px" : "54px"}
                    width={
                      isTabletView ? screen.width - 130 : screen.width - 40
                    }
                  />
                  <Flex
                    justify="center"
                    mt="-22px"
                    width={
                      lang === "ar"
                        ? isTabletView
                          ? screen.width - 30
                          : screen.width + 30
                        : isTabletView
                        ? screen.width - 90
                        : screen.width - 30
                    }
                  >
                    <SimulatorBarChart
                      height="130px"
                      data={[
                        {
                          name: "European debt crisis",
                          tfo: -1.6,
                          euro: -12.5,
                          nikkei: -15.3,
                          sp: -11.4,
                        },
                      ]}
                    />
                  </Flex>
                </Box>
                <Box
                  aria-label="coronavirusPandemic"
                  position="relative"
                  mt="12"
                >
                  <Text textAlign="center" fontSize="xs" color="gray.400">
                    {t("investingWithTFO.chart.labels.coronavirusPandemic")}
                  </Text>
                  <Text
                    textAlign="center"
                    fontSize="xs"
                    color="gray.400"
                    mt="2"
                  >
                    {t(
                      "investingWithTFO.chart.quarterLabels.coronavirusPandemic",
                    )}
                  </Text>
                  <Divider
                    borderBottomWidth="1px"
                    borderColor="gray.700"
                    position="absolute"
                    top={lang === "ar" ? "57px" : "54px"}
                    width={
                      isTabletView ? screen.width - 130 : screen.width - 40
                    }
                  />
                  <Flex
                    justify="center"
                    mt="-22px"
                    width={
                      lang === "ar"
                        ? isTabletView
                          ? screen.width - 30
                          : screen.width + 30
                        : isTabletView
                        ? screen.width - 90
                        : screen.width - 30
                    }
                  >
                    <SimulatorBarChart
                      height="200px"
                      data={[
                        {
                          name: "Coronavirus pandemic",
                          tfo: -6.3,
                          euro: -20.9,
                          nikkei: -19.2,
                          sp: -19.6,
                        },
                      ]}
                    />
                  </Flex>
                </Box>
                <Box aria-label="europeanDebt" position="relative" mt="12">
                  <Text
                    textAlign="center"
                    left={isTabletView ? "280" : "120"}
                    fontSize="xs"
                    color="gray.400"
                  >
                    {t("investingWithTFO.chart.labels.europeanDebt")}
                  </Text>
                  <Text
                    textAlign="center"
                    fontSize="xs"
                    color="gray.400"
                    mt="2"
                  >
                    {t("investingWithTFO.chart.quarterLabels.europeanDebt")}
                  </Text>
                  <Divider
                    borderBottomWidth="1px"
                    borderColor="gray.700"
                    position="absolute"
                    top={lang === "ar" ? "57px" : "54px"}
                    width={
                      isTabletView ? screen.width - 130 : screen.width - 40
                    }
                  />
                  <Flex
                    justify="center"
                    width={
                      lang === "ar"
                        ? isTabletView
                          ? screen.width - 30
                          : screen.width + 30
                        : isTabletView
                        ? screen.width - 90
                        : screen.width - 30
                    }
                    mt="-22px"
                  >
                    <SimulatorBarChart
                      height="400px"
                      data={[
                        {
                          name: "European Debt Crisis Worsens",
                          tfo: -7.3,
                          euro: -16.5,
                          nikkei: -10.6,
                          sp: -13.9,
                        },
                      ]}
                    />
                  </Flex>
                </Box>
                <Box aria-label="fedReasing" position="relative" mt="12">
                  <Text
                    textAlign="center"
                    left={isTabletView ? "280" : "120"}
                    fontSize="xs"
                    color="gray.400"
                  >
                    {t("investingWithTFO.chart.labels.fedReasing")}
                  </Text>
                  <Text
                    textAlign="center"
                    fontSize="xs"
                    color="gray.400"
                    mt="2"
                  >
                    {t("investingWithTFO.chart.quarterLabels.fedReasing")}
                  </Text>
                  <Divider
                    borderBottomWidth="1px"
                    borderColor="gray.700"
                    position="absolute"
                    top={lang === "ar" ? "57px" : "54px"}
                    width={
                      isTabletView ? screen.width - 130 : screen.width - 40
                    }
                  />
                  <Flex
                    justify="center"
                    width={
                      lang === "ar"
                        ? isTabletView
                          ? screen.width - 30
                          : screen.width + 30
                        : isTabletView
                        ? screen.width - 90
                        : screen.width - 30
                    }
                    mt="-22px"
                  >
                    <SimulatorBarChart
                      height="400px"
                      data={[
                        {
                          name: "Fed Reasing Interest Rates",
                          tfo: -1.9,
                          euro: -16.9,
                          nikkei: -16.9,
                          sp: -13.5,
                        },
                      ]}
                    />
                  </Flex>
                </Box>
              </Carousel>
            </Box>
          </>
        )}
      </Box>
    </Container>
  )
}

export default React.memo(InvestingWithTFO)
