import {
  Box,
  chakra,
  Container,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Square,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import Trans from "next-translate/Trans"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import SimulatorStackedChart from "~/components/SimulatorStackedChart"
import {
  MyProposal,
  PortfolioProposal,
  StrategiesTabularData,
  StrategiesType,
} from "~/services/mytfo/types"
import formatCurrency, {
  formatCurrencyWithoutSymbol,
} from "~/utils/formatCurrency"
import nFormatter from "~/utils/nFormatter"

interface InvestmentProps {
  graphData: PortfolioProposal[]
  strategiesData: StrategiesTabularData[]
  proposalData: MyProposal
  proposalFullData: MyProposal
}
function InvestmentWork(props: InvestmentProps) {
  let { graphData, strategiesData, proposalData, proposalFullData } = props
  const { t, lang } = useTranslation("personalizedProposal")
  const { onOpen, onClose, isOpen } = useDisclosure()

  if (!proposalData && proposalFullData) {
    proposalData = { ...proposalFullData }
    strategiesData = [...(proposalFullData?.transformedStrategiesData || [])]
    graphData = [...proposalFullData?.graphData]
  }

  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isDesktopView = !isMobileView
  function getAllocationColorIdentifier(categorization: string) {
    switch (categorization) {
      case StrategiesType.CapitalYielding:
        return "lightSlateGrey.800"
      case StrategiesType.CapitalGrowth:
        return "shinyShamrock.700"
      case StrategiesType.Opportunistic:
        return "purpleTaupe.500"
      case StrategiesType.AbsoluteReturn:
        return "darkLava.500"
    }
  }
  interface InvestmentWorkTabularProps {
    strategiesData: StrategiesTabularData[]
  }

  function InvestmentWorkTabularData(props: InvestmentWorkTabularProps) {
    const { strategiesData = [] } = props
    const totalData = strategiesData[strategiesData.length - 1]
    return (
      <Table size="sm">
        <Thead>
          <Tr>
            <Th textTransform="capitalize">
              {t("investmentWork.chart.strategyName")}
            </Th>
            {strategiesData[strategiesData.length - 1]?.years.map(
              (_item: number, index: number) => (
                <Th key={index} textTransform="capitalize">
                  {t(`investmentWork.chart.year${index + 1}`)}
                </Th>
              ),
            )}
            <Th textTransform="capitalize">
              {t("investmentWork.chart.totalAmount")}
            </Th>
            <Th textTransform="capitalize">
              {t("investmentWork.chart.portfolioPercent")}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {strategiesData.slice(0, -1).map(
            (item) =>
              item.totalAmount !== 0 && (
                <Tr key={item.name}>
                  <Td fontSize="xs">
                    <HStack spacing={3} me="4" alignSelf="flex-start">
                      <Square
                        size="4"
                        bg={getAllocationColorIdentifier(item.name)}
                      />
                      <Text>
                        {t(`investmentWork.legends.${item.name}`)}
                        {}
                      </Text>
                    </HStack>
                  </Td>
                  {item.years.length
                    ? totalData?.years.map((_item, index) => (
                        <Td
                          key={index}
                          color={
                            item.years[index] === 0 ||
                            item.years[index] === undefined
                              ? "gray.700"
                              : "white"
                          }
                          textTransform="uppercase"
                        >
                          ${nFormatter(item.years[index], 2)}
                        </Td>
                      ))
                    : Object.values(totalData.years).map((_item, index) => (
                        <Td key={index} color="gray.700">
                          ${nFormatter(0, 0)}
                        </Td>
                      ))}

                  <Td textTransform="uppercase">
                    ${nFormatter(item.totalAmount, 2)}
                  </Td>
                  <Td>{`${(item.percentageAllocation * 100).toFixed(0)}%`}</Td>
                </Tr>
              ),
          )}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th textTransform="capitalize">
              {t("investmentWork.chart.total")}
            </Th>
            {totalData?.years.map((item, index) => (
              <Th key={index}>${nFormatter(item, 2)}</Th>
            ))}
            <Th>${nFormatter(totalData?.totalAmount, 2)}</Th>
            <Th>{`${(totalData?.percentageAllocation * 100).toFixed(0)}%`}</Th>
          </Tr>
        </Tfoot>
      </Table>
    )
  }

  function showInfoModal() {
    return (
      <Modal
        onClose={onClose}
        size="2xl"
        isOpen={isOpen}
        isCentered={true}
        autoFocus={false}
        returnFocusOnClose={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton onClick={onClose} />
          <ModalBody
            textAlign="start"
            maxH="sm"
            overflowY="auto"
            overflowX="auto"
          >
            <InvestmentWorkTabularData strategiesData={strategiesData} />
            <Text fontSize="xs" color="gray.500" mt="8">
              {t("investmentWork.disclaimer")}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  }

  return (
    <Container maxW="full" ps="0">
      <Box>
        <Heading fontSize={{ base: "xl", md: "2xl" }} color="contrast.200">
          {t("investmentWork.heading")}
        </Heading>
        <Text fontSize={{ base: "lg", md: "xl" }} mt="10">
          {t("investmentWork.title")}
        </Text>
        <Trans
          i18nKey="personalizedProposal:investmentWork.description"
          components={[
            <Text fontSize="md" mt="4" color="gray.400" key="0" />,
            <chakra.span fontSize="md" color="primary.400" key="1" />,
          ]}
          values={{
            year: graphData.length,
          }}
        />
      </Box>
      <Flex mt="5" mb="16" direction={{ base: "column", md: "row" }}>
        <Stack
          direction={{ base: "row", md: "column" }}
          spacing={{ base: "4", md: "4" }}
          justifyContent="space-between"
        >
          <Box bgColor="gray.800" p="5" w={{ base: "50%", md: "280px" }}>
            <Text fontSize="xs" color="gray.500">
              {t("investmentWork.labels.totalCommitted")}
            </Text>
            <Text fontSize={{ base: "md", md: "xl" }} mt="2">
              {lang === "ar"
                ? `${formatCurrencyWithoutSymbol(
                    proposalData.totalCommitted,
                  )} ${t("common:generic.dollar")}`
                : formatCurrency(proposalData.totalCommitted)}
            </Text>
          </Box>
          <Box bgColor="gray.800" p="5" w={{ base: "50%", md: "280px" }}>
            <Text fontSize="xs" color="gray.500">
              {t("investmentWork.labels.yearsToFullyDeploy")}
            </Text>
            <Text fontSize={{ base: "md", md: "xl" }} mt="2">
              {graphData.length}
            </Text>
          </Box>
        </Stack>
        <Box flex="1" ms={{ base: "0", md: "14" }}>
          <SimulatorStackedChart data={graphData} onOpen={onOpen} />
        </Box>
      </Flex>
      {isDesktopView && (
        <>
          <InvestmentWorkTabularData strategiesData={strategiesData} />
          <Text fontSize="xs" color="gray.500" mt="8">
            {t("investmentWork.disclaimer")}
          </Text>
        </>
      )}
      {showInfoModal()}
    </Container>
  )
}

export default React.memo(InvestmentWork)
