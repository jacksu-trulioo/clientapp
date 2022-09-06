import { Button } from "@chakra-ui/button"
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Link,
  Text,
} from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/react"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useEffect, useState } from "react"

import { IslamIcon } from "~/components"
import { useUser } from "~/hooks/useUser"
import { InterestedOpportunitiesProps } from "~/services/mytfo/clientTypes"
import {
  selectOpportunityDashboard,
  viewDetailsOpportunitiesLandingPage,
} from "~/utils/googleEventsClient"
import { clientUniEvent } from "~/utils/gtag"

const OpportunityImgCard = ({
  opportunities,
  showHeading,
  showAll,
}: InterestedOpportunitiesProps) => {
  const { t, lang } = useTranslation("clientDashboard")
  const [count, setCount] = useState(opportunities.length)
  const { user } = useUser()

  const isLessThan1280 = useBreakpointValue({
    base: false,
    md: false,
    lgp: false,
    "2xl": true,
    xl: true,
  })

  useEffect(() => {
    checkDimensions()
  }, [opportunities, isLessThan1280])

  const checkDimensions = () => {
    if (!showAll && !showHeading) {
      if (isLessThan1280) {
        setCount(3)
      } else {
        setCount(2)
      }
    } else {
      setCount(opportunities.length)
    }
  }

  const redirectToDealPage = async (opportunityId: number) => {
    if (opportunityId) {
      router.push(`/client/opportunities/${opportunityId}`)
    }
  }

  return (
    <Fragment>
      {showHeading ? (
        <Flex>
          <Box w="100%" mt={{ base: "40px", md: "40px", lg: "80px" }}>
            <Box
              display={{ base: "block", md: "flex" }}
              justifyContent="space-between"
              w="100%"
              marginBottom="16px"
              alignItems="center"
            >
              <Text
                fontSize="18px"
                fontWeight="700"
                color="white"
                lineHeight="120%"
              >
                {t(`opportunities.title`)}
              </Text>
              <Link
                mt={{ base: "16px", md: "0" }}
                justifyContent={{ base: "flex-end", md: "flex-start" }}
                fontSize="14px"
                fontWeight="500"
                color="primary.500"
                display="flex"
                alignItems="center"
                lineHeight="120%"
                onClick={() => {
                  router.push("/client/opportunities")
                }}
                minWidth="90px"
                alignSelf={{ base: "center", md: "inherit" }}
                outline="none"
                _hover={{
                  textDecoration: "none",
                }}
                _focus={{
                  boxShadow: "none",
                }}
              >
                {t(`opportunities.button.seeMore`)}
                <svg
                  style={{
                    marginLeft: lang.includes("en") ? "16px" : 0,
                    marginRight: lang.includes("ar") ? "16px" : 0,
                    transform: lang.includes("ar") ? "rotate(180deg)" : "none",
                  }}
                  width="8"
                  height="12"
                  viewBox="0 0 8 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2.25478 11.7557L7.64793 6.4073C7.87517 6.18216 7.87517 5.81842 7.64793 5.5927L2.25478 0.244292C1.92673 -0.0814308 1.39301 -0.0814308 1.06439 0.244292C0.736349 0.570015 0.736349 1.09866 1.06439 1.42438L5.67794 6.00029L1.06439 10.575C0.736349 10.9013 0.736349 11.43 1.06439 11.7557C1.39301 12.0814 1.92673 12.0814 2.25478 11.7557Z"
                    fill="#B99855"
                  />
                </svg>
              </Link>
            </Box>
          </Box>
        </Flex>
      ) : (
        false
      )}
      <Grid
        aria-label="Deals Card"
        role={"grid"}
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lgp: "repeat(2, 1fr)",
          xl: "repeat(3, 1fr)",
          "2xl": "repeat(3, 1fr)",
        }}
        gap={6}
        mb="40px"
      >
        {opportunities?.length
          ? opportunities?.slice(0, count).map((deal, index) => (
              <GridItem key={index} pos="relative">
                <Box
                  pb="80px"
                  pos="relative"
                  border="1px solid #222222"
                  boxShadow={"0px 0px 24px rgba(0, 0, 0, 0.75)"}
                  borderRadius="8px"
                  overflow="hidden"
                  minHeight="100%"
                  cursor="pointer"
                  onClick={() => {
                    clientUniEvent(
                      selectOpportunityDashboard,
                      deal.opportunityName,
                      user?.mandateId as string,
                      user?.email as string,
                    )
                    redirectToDealPage(deal.opportunityId)
                  }}
                >
                  <Box
                    bgImage={`linear-gradient(rgba(26, 26, 26, 0.32) 0%, rgba(26, 26, 26, 0.8) 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2)),url(${deal.opportunityImageUrl})`}
                    bgPosition="center top"
                    bgRepeat="no-repeat"
                    bgSize="cover"
                    height="235px"
                    display="flex"
                    position="relative"
                  >
                    <Box
                      w="full"
                      alignItems="center"
                      // background="linear-gradient(180deg, rgba(26, 26, 26, 0.32) 0%, rgba(26, 26, 26, 0.8) 100%), rgba(0,0,0,0.6)"
                      h="full"
                      p={{ base: "24px", md: "24px", lgp: "38px 24px 24px" }}
                    >
                      <Flex justifyContent="flex-end" mb="60px">
                        {deal.isShariah == 1 && (
                          <Box
                            color="gray.900"
                            backgroundColor="secondary.500"
                            borderRadius="full"
                            p="8px 12px"
                            mr="22px"
                            fontSize={{ base: "12px", md: "14px" }}
                            fontWeight="500"
                          >
                            <IslamIcon me="1" w="3" h="3" color="gray.900" />
                            <Text
                              aria-label="isShariahCompliant"
                              as="span"
                              fontWeight="bold"
                              ml="8px"
                              fontSize="14px"
                            >
                              {t("opportunities.dealInfo.shariah")}{" "}
                            </Text>
                          </Box>
                        )}
                        {deal.isProgram ? (
                          <Box
                            color="gray.900"
                            backgroundColor="#96C5AE"
                            borderRadius="full"
                            p="8px 12px"
                            fontSize="14px"
                            fontWeight="500"
                          >
                            <Text
                              aria-label="isShariahCompliant"
                              as="span"
                              fontWeight="bold"
                            >
                              {t("opportunities.dealInfo.program")}
                            </Text>
                          </Box>
                        ) : (
                          <Box
                            color="gray.900"
                            backgroundColor="primary.500"
                            borderRadius="full"
                            p="8px 12px"
                            fontSize="14px"
                            fontWeight="500"
                          >
                            <Text
                              aria-label="isShariahCompliant"
                              as="span"
                              fontWeight="bold"
                            >
                              {t("opportunities.dealInfo.deal")}
                            </Text>
                          </Box>
                        )}
                      </Flex>
                      <Flex
                        flexDirection="column"
                        position="absolute"
                        bottom="24px"
                        pe="24px"
                      >
                        <Heading
                          color="white"
                          fontSize={{ base: "18px", md: "18px", lgp: "24px" }}
                          fontWeight="400"
                          mb="8px"
                          dir="ltr"
                          fontFamily="'Gotham'"
                          textAlign={lang.includes("en") ? "start" : "end"}
                        >
                          {deal.opportunityName}
                        </Heading>

                        <Text
                          aria-label="description"
                          color="#C7C7C7"
                          fontSize="14px"
                          fontWeight="400"
                          noOfLines={3}
                        >
                          {deal?.about}
                        </Text>
                      </Flex>
                    </Box>
                  </Box>
                  <Grid gap="1px" templateColumns="repeat(9, 1fr)">
                    <GridItem
                      colSpan={lang.includes("ar") ? 4 : 5}
                      bg="#222"
                      p="20px"
                    >
                      <Text
                        fontSize={{ base: "14px", md: "16px", lgp: "16px" }}
                        fontWeight="400"
                        color="gray.500"
                        mb="6px"
                      >
                        {t("opportunities.dealInfo.expectedReturn")}
                      </Text>
                      <Text
                        fontSize={{ base: "14px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#ffffff"
                        dir="ltr"
                        textAlign="left"
                        noOfLines={1}
                        fontFamily="'Gotham'"
                      >
                        {deal.expectedReturn.split("/")[0] + " /..."}
                      </Text>
                    </GridItem>
                    <GridItem
                      colSpan={lang.includes("ar") ? 5 : 4}
                      bg="#222"
                      p="20px"
                    >
                      <Text
                        fontSize={{ base: "14px", md: "16px", lgp: "16px" }}
                        fontWeight="400"
                        color="gray.500"
                        mb="6px"
                      >
                        {t("opportunities.dealInfo.expectedExit")}
                      </Text>
                      <Text
                        fontSize={{ base: "14px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="contrast.200"
                        dir="ltr"
                        fontFamily="'Gotham'"
                        textAlign={lang.includes("en") ? "start" : "end"}
                      >
                        {deal.expectedExitYear}
                      </Text>
                      {/* </Box> */}
                    </GridItem>
                  </Grid>
                  <Box
                    // mr={{ base: "0", lgp: "80px" }}
                    mt="32px"
                    pl="20px"
                    pr="20px"
                  >
                    <Grid
                      templateColumns="repeat(2, 1fr)"
                      gap={0}
                      mb="16px"
                      d="flex"
                    >
                      <GridItem w="40%">
                        <Box
                          fontWeight="400"
                          fontSize={{ base: "14px", md: "16px", lgp: "16px" }}
                          color="gray.500"
                        >
                          {t("opportunities.dealInfo.assetClass")}
                        </Box>
                      </GridItem>
                      <GridItem w="60%">
                        <Box
                          fontWeight="400"
                          fontSize={{ base: "14px", md: "16px", lgp: "16px" }}
                          color="contrast.200"
                        >
                          {deal?.assetClass}
                        </Box>
                      </GridItem>
                    </Grid>
                    <Grid
                      templateColumns="repeat(2, 1fr)"
                      gap={0}
                      mb="16px"
                      d="flex"
                    >
                      <GridItem w="40%">
                        <Box
                          fontWeight="400"
                          fontSize={{ base: "14px", lgp: "16px" }}
                          color="gray.500"
                        >
                          {t("opportunities.dealInfo.country")}
                        </Box>
                      </GridItem>
                      <GridItem w="60%">
                        <Box
                          fontWeight="400"
                          fontSize={{ base: "14px", lgp: "16px" }}
                          color="contrast.200"
                        >
                          {deal?.country}
                        </Box>
                      </GridItem>
                    </Grid>
                    <Grid
                      templateColumns="repeat(2, 1fr)"
                      gap={0}
                      mb="16px"
                      d="flex"
                    >
                      <GridItem w="40%">
                        <Box
                          fontWeight="400"
                          fontSize={{ base: "14px", md: "16px" }}
                          color="gray.500"
                        >
                          {t("opportunities.dealInfo.sector")}
                        </Box>
                      </GridItem>
                      <GridItem w="60%">
                        <Box
                          fontWeight="400"
                          fontSize={{ base: "14px", md: "16px" }}
                          color="contrast.200"
                        >
                          {deal.sector}
                        </Box>
                      </GridItem>
                    </Grid>
                    <Grid
                      templateColumns="repeat(2, 1fr)"
                      gap={0}
                      mb="16px"
                      d="flex"
                    >
                      <GridItem w="40%">
                        <Box
                          fontWeight="400"
                          fontSize={{ base: "14px", md: "16px" }}
                          color="gray.500"
                        >
                          {t("opportunities.dealInfo.sponsor")}
                        </Box>
                      </GridItem>
                      <GridItem w="60%">
                        <Box
                          fontWeight="400"
                          fontSize={{ base: "14px", md: "16px" }}
                          color="contrast.200"
                          fontFamily="'Gotham'"
                        >
                          {deal.sponsor}
                        </Box>
                      </GridItem>
                    </Grid>
                  </Box>
                  <Box p="20px" pos="absolute" bottom="0px" w="100%">
                    <Button
                      fontSize={{ base: "16px", md: "16px", lgp: "14px" }}
                      colorScheme="primary"
                      variant="outline"
                      w="100%"
                      onClick={() => {
                        clientUniEvent(
                          viewDetailsOpportunitiesLandingPage,
                          deal.opportunityName,
                          user?.mandateId as string,
                          user?.email as string,
                        )
                        clientUniEvent(
                          selectOpportunityDashboard,
                          deal.opportunityName,
                          user?.mandateId as string,
                          user?.email as string,
                        )
                        redirectToDealPage(deal.opportunityId)
                      }}
                    >
                      {t("opportunities.button.viewDetails")}
                    </Button>
                  </Box>
                </Box>
              </GridItem>
            ))
          : false}
      </Grid>
    </Fragment>
  )
}

export default OpportunityImgCard
