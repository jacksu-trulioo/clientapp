import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import { Box, Heading, Text } from "@chakra-ui/layout"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
} from "@chakra-ui/react"
import moment from "moment"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useEffect } from "react"
import useSWR from "swr"

import {
  ClientLayout,
  InvestmentCartIcon,
  NoDataFound,
  OpportunityCard,
  PageContainer,
  SkeletonOpportunityCard,
} from "~/components"
import { useUser } from "~/hooks/useUser"
import { InvestmentCartDealDetails } from "~/services/mytfo/clientTypes"
import { screenSpentTime } from "~/utils/googleEventsClient"
import { clientEvent } from "~/utils/gtag"

function InterestedDeals() {
  const { t, lang } = useTranslation("opportunities")

  const { data: opportunities, error } = useSWR(
    `/api/client/deals/get-interested-opportunities?langCode=${lang}`,
  )

  const { data: investmentCartCount } = useSWR<InvestmentCartDealDetails[]>(
    `/api/client/deals/investment-cart`,
  )

  const isLoading = !opportunities && !error

  const { user } = useUser()

  useEffect(() => {
    const openTime = moment(new Date())
    return () => {
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        screenSpentTime,
        "Interested Deals",
        duration.asSeconds().toString(),
        user?.mandateId as string,
        user?.email as string,
      )
    }
  }, [])

  return (
    <>
      <ClientLayout
        title={t("index.page.title")}
        description={t("index.page.description")}
      >
        <PageContainer
          isLoading={isLoading}
          as="section"
          maxW="full"
          px="0"
          mt={{ base: 8, md: 8, lg: 0 }}
          filter={isLoading ? "blur(3px)" : "none"}
        >
          {isLoading ? (
            <SkeletonOpportunityCard flex="1" mb="25px" mt="20px" />
          ) : (
            <Fragment>
              <Breadcrumb
                fontSize="12px"
                m="8px 0"
                d={{ base: "none", md: "block", lgp: "block" }}
              >
                <BreadcrumbItem>
                  <BreadcrumbLink
                    color="primary.500"
                    href="/client/opportunities"
                    _focus={{ boxShadow: "none" }}
                    fontSize="12px"
                  >
                    {t("index.heading")}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink
                    fontSize="12px"
                    dir="ltr"
                    fontFamily="'Gotham'"
                    _hover={{ textDecoration: "none" }}
                    cursor="default"
                  >
                    {t(`client.labels.interested`)}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
              <Box mb="50px">
                <Flex
                  justifyContent="space-between"
                  flexDirection={{ base: "column-reverse", md: "row" }}
                  alignContent="center"
                >
                  <Heading
                    fontSize="30px"
                    fontWeight="400"
                    mb="4"
                    textAlign={{ base: "start", md: "start" }}
                  >
                    {t(`client.labels.interested`)}
                  </Heading>
                  <Box display={{ base: "none", lgp: "block" }}>
                    <Text
                      aria-label="Investment Cart"
                      role={"button"}
                      fontSize="16px"
                      fontWeight="500"
                      color="primary.500"
                      mb="8"
                      textAlign={{ base: "start", md: "start" }}
                      onClick={() => router.push("/client/subscription")}
                      cursor="pointer"
                    >
                      <InvestmentCartIcon />{" "}
                      {t(`common:client.investmentCart.title`)} (
                      {investmentCartCount?.length})
                    </Text>
                  </Box>
                </Flex>
                <Text
                  fontSize="18px"
                  fontWeight="400"
                  color="gray.500"
                  textAlign={{ base: "start", md: "start" }}
                >
                  {t("client.description")}
                </Text>
              </Box>
              {opportunities?.length ? (
                <OpportunityCard
                  opportunities={opportunities}
                  showHeading={false}
                  showAll={true}
                />
              ) : (
                <NoDataFound isHeader isDescription isIcon />
              )}
            </Fragment>
          )}
        </PageContainer>
      </ClientLayout>
    </>
  )
}

export default InterestedDeals

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async function (ctx) {
    const sesison = getSession(ctx.req, ctx.res)
    if (sesison?.mandateId) {
      return {
        props: {}, // will be passed to the page component as props
      }
    }
    return {
      notFound: true,
    }
  },
})
