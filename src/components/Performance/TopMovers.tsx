import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect, useState } from "react"

import { useUser } from "~/hooks/useUser"
import { percentTwoDecimalPlace } from "~/utils/clientUtils/globalUtilities"
import { loadMorePerformance } from "~/utils/googleEventsClient"
import { clientUniEvent } from "~/utils/gtag"

import PolygonDownIcon from "../Icon/PolygonDownIcon"
import PolygonIcon from "../Icon/PolygonIcon"

type TopMoverProps = {
  deals: DealData[] | undefined
}

type DealData = {
  name: string
  performanceObj: {
    direction: string
    percent: number
  }
  id: number
}

export default function TopMovers({ deals }: TopMoverProps) {
  const { t } = useTranslation("performance")
  const [topMoverDeals] = useState(deals || [])
  const [showmoreVal, setShowmoreVal] = useState(10)
  const [loadFlag, setLoadFlag] = useState(true)
  const { user } = useUser()

  useEffect(() => {
    if (topMoverDeals.length < 10) {
      setLoadFlag(false)
    } else {
      setLoadFlag(true)
    }
  }, [])

  const increaseCount = () => {
    const recordCount = showmoreVal
    setShowmoreVal(recordCount + 10)
    const eventMoversCount =
      recordCount + 10 >= topMoverDeals.length
        ? topMoverDeals.length
        : recordCount + 10
    clientUniEvent(
      loadMorePerformance,
      "Shown Movers: " + eventMoversCount,
      user?.mandateId as string,
      user?.email as string,
    )
    if (recordCount + 10 < topMoverDeals?.length) {
      setLoadFlag(true)
    } else {
      setLoadFlag(false)
    }
  }

  const goToDetailPage = (path: string, dealId?: number | string) => {
    if (dealId) {
      router.push(`${path}/${dealId}`)
    } else {
      router.push(`${path}`)
    }
  }
  const { lang } = useTranslation("performance")
  return (
    <Box mt={{ base: "40px", sm: "40px", md: "80px" }}>
      <Grid templateColumns="repeat(2, 1fr)" mb="8px" pe="16px">
        <GridItem>
          <Heading color="contrast.200" fontWeight="400" fontSize="14px">
            {t("topMoverTable.header.topMoverDeals")}
          </Heading>
        </GridItem>
        <GridItem textAlign="right">
          <Heading
            color={{ base: "gray.500", sm: "gray.500", md: "gray.400" }}
            fontWeight="400"
            fontSize="14px"
          >
            {t("topMoverTable.header.change")}
          </Heading>
        </GridItem>
      </Grid>
      <List spacing={0.5}>
        {topMoverDeals
          .slice(0, showmoreVal)
          .map(({ name, performanceObj, id }, i) => (
            <ListItem
              key={i}
              bgColor={i % 2 == 0 ? "gray.800" : "gray.850"}
              p="16px"
              borderRadius="3px"
            >
              <Grid templateColumns="repeat(5, 1fr)">
                <GridItem colSpan={4}>
                  <Text
                    maxWidth="100%"
                    color="contrast.200"
                    fontWeight="400"
                    fontSize="14px"
                    onClick={() =>
                      goToDetailPage("/client/investment-detail", id)
                    }
                    cursor="pointer"
                  >
                    {name}
                  </Text>
                </GridItem>
                <GridItem colSpan={1} alignSelf="center">
                  <Flex
                    justifyContent={
                      lang.includes("ar") ? "flex-start" : "flex-end"
                    }
                    alignItems="center"
                    color={
                      performanceObj.direction == "downwards"
                        ? "red.500"
                        : "green.500"
                    }
                    fontWeight="400"
                    fontSize="14px"
                    dir="ltr"
                  >
                    {performanceObj.direction == "downwards" ? (
                      <PolygonDownIcon
                        width={"10px"}
                        height={"10px"}
                        direction="bottom"
                        mr={lang.includes("ar") ? "0px" : "5px"}
                        ml={lang.includes("ar") ? "6px" : "0px"}
                      />
                    ) : (
                      <PolygonIcon
                        width={"10px"}
                        height={"10px"}
                        direction="inherit"
                        mr={lang.includes("ar") ? "0px" : "5px"}
                        ml={lang.includes("ar") ? "6px" : "0px"}
                      />
                    )}
                    <Text>
                      {percentTwoDecimalPlace(performanceObj.percent)}%
                    </Text>
                  </Flex>
                </GridItem>
              </Grid>
            </ListItem>
          ))}
      </List>
      {loadFlag && (
        <Box mt="2px">
          <Button
            colorScheme="primary"
            variant="link"
            textDecoration="none"
            p="13px"
            bg="gray.800"
            role="button"
            isFullWidth={true}
            type="button"
            fontWeight="400"
            fontSize="14px"
            onClick={increaseCount}
            _focus={{
              bgColor: "gray.800",
            }}
            _hover={{
              bgColor: "pineapple.800",
            }}
          >
            {t("labels.loadMore")}
          </Button>
        </Box>
      )}
    </Box>
  )
}
