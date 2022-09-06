import {
  HStack,
  Square,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { Earnings } from "~/services/mytfo/types"
import nFormatter from "~/utils/nFormatter"

interface EarningsGridViewProps {
  data?: Earnings[]
}

function EarningsGridViewComponent(props: EarningsGridViewProps) {
  const { data } = props

  const { t } = useTranslation("personalizedProposal")

  const totalData = {
    income: data?.reduce((a, b) => a + b?.income, 0),
    capital: data?.reduce((a, b) => a + b?.capital, 0),
    total: data?.reduce((a, b) => a + b?.total, 0),
    percentage: data?.reduce((a, b) => a + b?.percentage, 0),
    cumulativeDistribution: data?.reduce(
      (a, b) => a + b?.cumulativeDistribution,
      0,
    ),
  }

  return (
    <Table size="sm" mt="8">
      <Thead>
        <Tr>
          <Th textTransform="capitalize">{t("earnings.table.label.year")}</Th>
          <Th textTransform="capitalize">
            {t("earnings.table.label.incomeDistribution")}
          </Th>
          <Th textTransform="capitalize">
            {t("earnings.table.label.capitalDistribution")}
          </Th>
          <Th textTransform="capitalize">
            {t("earnings.table.label.totalDistribution")}
          </Th>
          <Th textTransform="capitalize">
            {t("earnings.table.label.cumulativeDistribution")}
          </Th>
          <Th textTransform="capitalize">
            {t("earnings.table.label.investedCapital")}
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {data &&
          data.length &&
          data.map((item) => (
            <Tr key={item.year}>
              <Td>
                <HStack alignSelf="flex-start" alignItems="baseline">
                  <Square size="2" bg="primary.500" />
                  <Text fontSize="xs">{item.year}</Text>
                </HStack>
              </Td>
              <Td fontSize="xs">${nFormatter(item.income, 2)}</Td>
              <Td fontSize="xs">${nFormatter(item.capital, 2)}</Td>
              <Td fontSize="xs">${nFormatter(item.total, 2)}</Td>
              <Td fontSize="xs">
                ${nFormatter(item.cumulativeDistribution, 2)}
              </Td>
              <Td fontSize="xs">{`${item.percentage.toFixed(0)}%`}</Td>
            </Tr>
          ))}
      </Tbody>
      <Tfoot>
        {totalData && (
          <Tr>
            <Th textTransform="capitalize">
              {t("earnings.table.label.total")}
            </Th>
            <Th>${nFormatter(totalData.income || 0, 2)}</Th>
            <Th>${nFormatter(totalData.capital || 0, 2)}</Th>
            <Th>${nFormatter(totalData.total || 0, 2)}</Th>
            <Th>${nFormatter(totalData?.cumulativeDistribution || 0, 2)}</Th>
            <Th>{`${totalData?.percentage?.toFixed(0)}%`}</Th>
          </Tr>
        )}
      </Tfoot>
    </Table>
  )
}

export default EarningsGridViewComponent
