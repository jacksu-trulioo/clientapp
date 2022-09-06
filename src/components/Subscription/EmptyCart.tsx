import { Box, Container, Flex, Text } from "@chakra-ui/layout"
import { Button, Image, useBreakpointValue } from "@chakra-ui/react"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

export default function EmptyCart() {
  const { t } = useTranslation("subscription")
  const isTabletView = useBreakpointValue({
    base: false,
    md: true,
    lgp: false,
  })
  const isMobileView = useBreakpointValue({ base: true, md: false })

  return (
    <Flex py={{ base: 2, md: 16 }} direction={{ base: "column", md: "row" }}>
      <Container
        flex={isTabletView ? "2" : "1"}
        px="0"
        {...(isMobileView && { mb: "36" })}
        h="100vh"
      >
        <Box
          aria-label="Empty Investment Cart"
          role={"paragraph"}
          textAlign="center"
          mb="4"
          mt="10"
        >
          <Image
            w="41px"
            objectFit="contain"
            src="/images/EmptyCart.svg"
            alt="geography"
            style={{ margin: "15px auto" }}
          />
          <Text fontSize="24px" fontWeight="400" mt="5" color="white">
            {t("investmentCart.emptyCart.title")}
          </Text>
          <Text fontSize="20px" mt="5" fontWeight="400" color="gray.500">
            {t("investmentCart.emptyCart.description")}
          </Text>
        </Box>

        <Box
          display="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="center"
        >
          <Button
            mb="5"
            mt="5"
            px={8}
            colorScheme="primary"
            variant="solid"
            width={"auto"}
            onClick={() => router.push("/client/opportunities")}
          >
            {t("confirmation.opportunitiesCTA")}
          </Button>
          <Text
            cursor="pointer"
            onClick={() => router.push(`/client/redemption`)}
          >
            {t("common:client.orderManagementCTAs.redeemButtonText")}
          </Text>
        </Box>
      </Container>
    </Flex>
  )
}
