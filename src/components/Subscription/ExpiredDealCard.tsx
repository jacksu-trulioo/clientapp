import { Box, Text, VStack } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React, { useState } from "react"

import { Checkbox, CloseIcon, ConfirmModalBox, IslamIcon } from "~/components"
import { InvestmentCartDealDetails } from "~/services/mytfo/clientTypes"

type InvestmentCartProps = {
  data: InvestmentCartDealDetails
  type: string
  onRemove: Function
}

export default function ExpiredDealCard({
  data,
  type,
  onRemove,
}: InvestmentCartProps) {
  const { t } = useTranslation("subscription")
  const [showDetails, setShowdetails] = useState(false)
  const [isOpenCart, setOpenCart] = useState(false)

  const removeDeal = async () => {
    await onRemove(data)
    setOpenCart(false)
  }

  const onModalClose = () => {
    setOpenCart(false)
  }

  return (
    <>
      <VStack
        w="full"
        spacing={{ base: 6, md: 8 }}
        alignItems="start"
        bgColor="gray.800"
        padding="16px 16px 16px 24px"
        mb="8px"
        className={type}
        position="relative"
        cursor={"not-allowed"}
      >
        <Box display="flex" alignItems="center" w="full" position="relative">
          <Checkbox
            defaultChecked={false}
            isDisabled={true}
            mr={4}
            className="remember-txt"
            colorScheme="secondary"
          />
          <Text mr={2} dir="ltr" color="#888">
            {" "}
            {data?.opportunityName}
          </Text>
          {data?.isInvestmentPreferenceShariah && (
            <IslamIcon color="secondary.500" mr={3} />
          )}
          <Box
            cursor="pointer"
            justifyContent="flex-end"
            flex="1 1"
            textAlign="right"
            onClick={() => {
              setOpenCart(true)
            }}
          >
            <CloseIcon h="14px" w="14px" color={"primary.500"} />
          </Box>
        </Box>

        <Box
          style={{ marginTop: "10px" }}
          display="flex"
          cursor="pointer"
          onClick={() => {
            setShowdetails(!showDetails)
          }}
          alignItems="center"
        >
          <Text
            aria-label="More Info"
            fontSize="14px"
            fontWeight="400"
            mr="2"
            color="red.500"
          >
            {t(
              `investmentCart.${
                type == "program" ? "expireProgram" : "expireDeal"
              }.title`,
            )}
          </Text>
        </Box>
      </VStack>

      {isOpenCart && (
        <ConfirmModalBox
          isOpen={isOpenCart}
          onClose={onModalClose}
          bodyContent={t("investmentCart.removeModal.message")}
          secondButtonText={t("common:client.no")}
          secondButtonOnClick={onModalClose}
          firstButtonText={t("common:client.yes")}
          firstButtonOnClick={removeDeal}
        />
      )}
    </>
  )
}
