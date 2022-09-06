import { Button } from "@chakra-ui/button"
import { Box, Flex, Grid, GridItem, Heading, Text } from "@chakra-ui/layout"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { IslamIcon } from "~/components"
import { InterestedOpportunitiesProps } from "~/services/mytfo/clientTypes"

const SimilarOpportunityCard = ({
  opportunities,
}: InterestedOpportunitiesProps) => {
  const { t, lang } = useTranslation("opportunities")

  const onClickerHandler = async (opportunityId: number) => {
    if (opportunityId) {
      router.push(`/client/opportunities/${opportunityId}`)
    }
  }

  return (
    <Grid
      templateColumns={{
        base: "repeat(1, 1fr)",
        md: "repeat(2, 1fr)",
        lgp: "repeat(3, 1fr)",
        xl: "repeat(3, 1fr)",
        "2xl": "repeat(3, 1fr)",
      }}
      gap={6}
    >
      {opportunities?.length
        ? opportunities?.map((deal, index) => (
            <GridItem
              pos="relative"
              mb={{ base: "0", md: "20px" }}
              key={index}
              cursor="pointer"
              onClick={() => {
                onClickerHandler(deal.opportunityId)
              }}
            >
              <Box
                border="1px solid #222222"
                boxShadow={"0px 0px 24px rgba(0, 0, 0, 0.75)"}
                borderRadius="6px"
                overflow="hidden"
                h="265px"
                minH="265px"
              >
                <Box
                  bgImage={`linear-gradient(180deg, rgba(26, 26, 26, 0.32) 0%, rgba(26, 26, 26, 0.8) 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)) ,url(${deal.opportunityImageUrl})`}
                  bgPosition="top center"
                  bgRepeat="no-repeat"
                  bgSize="cover"
                  h="100%"
                  position="relative"
                >
                  <Box alignItems="center" h="full" p="24px" pos="relative">
                    {deal.isShariah == 1 && (
                      <Flex justifyContent="end" mb="60px">
                        <Box
                          color="gray.900"
                          backgroundColor="secondary.500"
                          borderRadius="full"
                          p="8px 12px"
                          fontSize={{ base: "12px", md: "14px" }}
                          fontWeight="500"
                        >
                          <IslamIcon me="1" w="3" h="3" color="gray.900" />
                          <Text
                            aria-label="isShariahCompliant"
                            as="span"
                            fontWeight="bold"
                            ml="8px"
                          >
                            {t("index.card.tag.shariah")}
                          </Text>
                        </Box>
                      </Flex>
                    )}

                    <Box pos="absolute" bottom="55px" p="0 24px 0 0">
                      <Heading
                        color="white"
                        fontSize={{ base: "20px", md: "18px" }}
                        fontWeight="400"
                        mb="8px"
                        noOfLines={1}
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
                        {deal.about}
                      </Text>
                    </Box>
                  </Box>

                  <Flex pl="20px" pr="20px" position="absolute" bottom="22px">
                    <Button
                      fontSize="14px"
                      m="0 2px !important"
                      colorScheme="primary"
                      textDecoration="none"
                      variant="link"
                      onClick={() => {
                        onClickerHandler(deal.opportunityId)
                      }}
                      _hover={{
                        textDecoration: "underline",
                      }}
                    >
                      {t("common:button.viewDetails")}
                    </Button>
                  </Flex>
                </Box>
              </Box>
            </GridItem>
          ))
        : false}
    </Grid>
  )
}

export default React.memo(SimilarOpportunityCard)
