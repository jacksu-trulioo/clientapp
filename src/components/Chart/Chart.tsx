import { Box, Heading, HStack, HTMLChakraProps, Text } from "@chakra-ui/react"
import React from "react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, StarIcon } from "~/components"
import nFormatter from "~/utils/nFormatter"

export type ChartProps = HTMLChakraProps<"div">

const Chart: React.FC<ChartProps> = (_props) => {
  const data = [
    {
      name: "Dec",
      value: 340000000,
    },
    {
      name: "Jan",
      value: 440000000,
    },
    {
      name: "Feb",
      value: 539800000,
    },
    {
      name: "Mar",
      value: 780000000,
    },
    {
      name: "Apr",
      value: 690800000,
    },
    {
      name: "May",
      value: 480000000,
    },
    {
      name: "Jun",
      value: 780000000,
    },
    {
      name: "July",
      value: 830000000,
    },
    {
      name: "Aug",
      value: 980000000,
    },
  ]

  return (
    <Card bg="linear-gradient(270deg, var(--chakra-colors-gray-900) 16.67%, var(--chakra-colors-gray-800) 50.52%, var(--chakra-colors-gray-900) 81.77%)">
      <CardContent p="0">
        <Box p="6">
          <Box ml="4">
            <Heading fontSize="lg">Title</Heading>
            <Text my="2" fontSize="sm" color="primary.500">
              Label
            </Text>
          </Box>

          <HStack my="4" spacing="1" alignItems="start">
            <Text fontSize="md">$</Text>
            <Heading fontWeight="light">00m</Heading>
          </HStack>

          <Box ml="4" color="gray.500">
            <HStack alignItems="center">
              <StarIcon w="3" h="3" />
              <Text>Label</Text>
            </HStack>
            <HStack alignItems="center">
              <StarIcon w="3" h="3" />
              <Text>Label</Text>
            </HStack>
          </Box>
        </Box>

        <Box h="200px" ml="8" zIndex="1">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={data} margin={{ right: -1 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="25%"
                    stopColor="rgba(255, 255, 255, 0.2)"
                    stopOpacity={0.8}
                  />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="name"
                axisLine={false}
                tickSize={0}
                tickFormatter={(value, index) =>
                  index === 0 || index === data.length - 1 ? "" : value
                }
              />

              <YAxis
                style={{ paddingRight: 20, marginRight: 20 }}
                tickFormatter={(value, _index) => nFormatter(value, 3)}
                tickSize={0}
                axisLine={false}
              />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#5DA683"
                strokeWidth="3"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>

          <Box
            background="linear-gradient(90deg, #1A1A1A 0%, rgba(26, 26, 26, 0) 100%)"
            pos="absolute"
            bottom="0"
            left="90px"
            width="150px"
            height="200px"
          />
          <Box
            zIndex="0"
            backgroundSize="50px 50px"
            backgroundImage=" linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);"
            pos="absolute"
            top="-25"
            bottom="-25"
            right="0"
            left="200px"
          />
        </Box>
      </CardContent>
    </Card>
  )
}

export default Chart
