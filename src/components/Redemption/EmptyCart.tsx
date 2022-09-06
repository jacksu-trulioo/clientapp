import { Box, Container, Flex, Text } from "@chakra-ui/layout"
import { Button, Image, useBreakpointValue } from "@chakra-ui/react"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

export default function EmptyCart() {
  const { t } = useTranslation("redemption")
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
        <Box fontSize="20px" fontWeight="400" color="white" textAlign="left">
          <Text>{t("myLiquidHolding.title")}</Text>
        </Box>
        <Box textAlign="center" mb="4">
          <Image
            src={"/images/Cash_icon.svg"}
            w="97px"
            h="97px"
            margin={"24px auto"}
          />

          <Text fontSize="18px" fontWeight="400" color="gray.500">
            {t("empty.title")}
          </Text>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="center">
          <Button
            mb="5"
            mt="5"
            px={8}
            colorScheme="primary"
            variant="solid"
            width={"auto"}
            onClick={() => router.push("/client/opportunities")}
          >
            {t("confirmation.button")}
          </Button>
        </Box>
      </Container>
    </Flex>
  )
}
