import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { CaretRightIcon } from "~/components"

import PieChart from "../PieChart/PieChart"
import AllocationStep from "./AllocationSteps"
import ChartAssets from "./ChartAssets"

type AllocationChartProps = {
  allocationChartData: []
  getChartValue?: (color: string) => void
}

function AllocationChart({
  allocationChartData,
  getChartValue,
}: AllocationChartProps) {
  const router = useRouter()
  const { t, lang } = useTranslation("portfolioSummary")

  return (
    <Container
      as="section"
      w="100%"
      maxW="100%"
      px="0"
      pt={{ base: 0, lgp: 0 }}
      mb="35px"
    >
      <Flex
        justifyContent="space-between"
        align="center"
        d={{ base: "block", md: "flex" }}
      >
        <Box>
          <Heading
            fontSize="18px"
            mb={{ base: "16px", md: "0" }}
            color="contrast.200"
            fontWeight="700"
          >
            {t("portfolioObjectives.title")}
          </Heading>
        </Box>
        <Box>
          <Heading
            fontSize="14px"
            textAlign="end"
            ms={{ base: "2px", md: "16px" }}
            align="end"
            color="#B99855"
            fontWeight="400"
            cursor="pointer"
            onClick={() => router.push("/client/asset-allocation")}
            _hover={{
              textDecoration: "underline",
            }}
            position="relative"
            pr="20px"
            whiteSpace="nowrap"
          >
            {t("portfolioObjectives.button")}
            <CaretRightIcon
              color="#B99855"
              h="20px"
              transform={lang == "ar" ? "rotate(-180deg)" : "initial"}
              transformOrigin="center"
              position="absolute"
              right={{ base: "auto", md: "0" }}
              bottom={{ base: "-1px", md: "-3px" }}
            />
          </Heading>
        </Box>
      </Flex>

      <Flex
        flexDir={{ base: "column", md: "column", lgp: "row" }}
        justifyContent="space-between"
        align="center"
        mt={{ base: "16px", md: "26px" }}
      >
        <Box
          maxW={{ base: "100%", md: "100%", lgp: "50%" }}
          w={{ base: "100%", md: "100%", lgp: "50%" }}
          d={{ base: "block", md: "flex", lgp: "block" }}
          justifyContent="space-between"
        >
          <Box
            maxW={{ base: "100%", md: "49%", lgp: "100%" }}
            w={{ base: "100%", md: "49%", lgp: "100%" }}
          >
            <Flex flexDir={{ base: "row", md: "row" }} mb="16px">
              <AllocationStep index={1} />
              <Text
                fontSize="16px"
                ms="30px"
                color="#ffffff"
                fontWeight="400"
                d="flex"
                justifyContent="center"
                flexDir="column"
              >
                {t("portfolioObjectives.objectives.objectiveOne")}
              </Text>
            </Flex>
          </Box>
          <Box
            maxW={{ base: "100%", md: "49%", lgp: "100%" }}
            w={{ base: "100%", md: "49%", lgp: "100%" }}
          >
            <Flex>
              <AllocationStep index={2} />
              <Text
                fontSize="16px"
                ms="30px"
                color="#ffffff"
                fontWeight="400"
                d="flex"
                justifyContent="center"
                flexDir="column"
              >
                {t("portfolioObjectives.objectives.objectiveTwo")}
              </Text>
            </Flex>
          </Box>
        </Box>
        <Flex
          maxW={{ base: "100%", md: "100%", lgp: "70%" }}
          w={{ base: "100%", md: "100%", lgp: "70%" }}
          flexDir={{ base: "column", md: "row" }}
        >
          <Box
            maxW={{ base: "100%", md: "50%", lgp: "70%" }}
            w={{ base: "100%", md: "50%", lgp: "70%" }}
            display="flex"
            alignItems="center"
            my={{ base: "32px", md: "0" }}
          >
            <PieChart callBackFunc={getChartValue} data={allocationChartData} />
          </Box>
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(1, 1fr)",
            }}
            maxW={{ lgp: "30%" }}
            w={{ lgp: "30%" }}
            m={{ base: "auto" }}
          >
            {allocationChartData?.length
              ? allocationChartData?.map(({ color, name, value }, i) => (
                  <>
                    {value > 0 && (
                      <GridItem
                        key={i}
                        mb="15px"
                        pl={{
                          base: "0",
                          sm: "40px",
                          md: "0",
                          lgp: "0",
                        }}
                        whiteSpace="nowrap"
                      >
                        <ChartAssets color={color} text={name} />
                      </GridItem>
                    )}
                  </>
                ))
              : false}
          </Grid>
        </Flex>
      </Flex>
    </Container>
  )
}

export default AllocationChart
