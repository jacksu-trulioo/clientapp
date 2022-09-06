import {
  Box,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  VStack,
} from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React, { useState } from "react"

import {
  Checkbox,
  CloseIcon,
  ConfirmModalBox,
  DownArrow,
  IslamIcon,
} from "~/components"
import { InvestmentCartDealDetails } from "~/services/mytfo/clientTypes"

type InvestmentCartProps = {
  data: InvestmentCartDealDetails
  type: string
  onChange: (value: boolean, key: number, type: string) => void
  onRemove: Function
}

export default function DealCard({
  data,
  type,
  onChange,
  onRemove,
}: InvestmentCartProps) {
  const { t, lang } = useTranslation("subscription")
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
      >
        <Popover
          returnFocusOnClose={false}
          isOpen={false}
          placement={lang.includes("en") ? "bottom-start" : "bottom-end"}
          closeOnBlur={false}
        >
          <PopoverTrigger>
            <Box
              display="flex"
              alignItems="center"
              w="full"
              position="relative"
            >
              <Checkbox
                defaultChecked={data?.isChecked}
                onChange={(e) => {
                  onChange(e.target.checked, data.opportunityId, type)
                }}
                mr={4}
                className="remember-txt"
                colorScheme="secondary"
              />
              <Text mr={2} dir="ltr">
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
          </PopoverTrigger>
          <PopoverContent bg="gunmetal.500">
            <PopoverHeader fontWeight="400" fontSize="12px" color="gray.400">
              Investment Cart
            </PopoverHeader>
            <PopoverArrow bg="gunmetal.500" border="0px" />
            <PopoverCloseButton
              style={{
                right: lang.includes("en") ? "5px" : "inherit",
                left: lang.includes("en") ? "inherit" : "5px",
              }}
            />
            <PopoverBody fontWeight="400" fontSize="14px" color="contrast.200">
              Select Programs and deals you want to subscribe to
            </PopoverBody>
          </PopoverContent>
        </Popover>

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
            color="primary.500"
          >
            {t("investmentCart.button.moreInfo")}
          </Text>
          <DownArrow
            w="12px"
            h="12px"
            transform={showDetails ? "rotate(180deg)" : "rotate(0deg)"}
          />
        </Box>
        {showDetails ? (
          <>
            <Box
              w="100%"
              mb={2}
              style={{ marginTop: "5px" }}
              display="flex"
              alignItems="center"
            >
              <Text fontSize="14px" fontWeight="400" color="gray.400" w="30%">
                {t("investmentCart.moreInfoDropdown.sponsor")}:
              </Text>
              <Text fontSize="14px" fontWeight="bold" color="gray.400" w="70%">
                {data.sponsor}
              </Text>
            </Box>
            <Box
              w="100%"
              mb={2}
              style={{ marginTop: "5px" }}
              display="flex"
              alignItems="center"
            >
              <Text fontSize="14px" fontWeight="400" color="gray.400" w="30%">
                {t("investmentCart.moreInfoDropdown.assetClass")}:
              </Text>
              <Text fontSize="14px" fontWeight="bold" color="gray.400" w="70%">
                {data.assetClass}
              </Text>
            </Box>
            <Box
              w="100%"
              mb={2}
              style={{ marginTop: "5px" }}
              display="flex"
              alignItems="center"
            >
              <Text fontSize="14px" fontWeight="400" color="gray.400" w="30%">
                {t("investmentCart.moreInfoDropdown.sector")}:
              </Text>
              <Text fontSize="14px" fontWeight="bold" color="gray.400" w="70%">
                {data.sector}
              </Text>
            </Box>
            <Box
              w="100%"
              mb={2}
              style={{ marginTop: "5px" }}
              display="flex"
              alignItems="center"
            >
              <Text fontSize="14px" fontWeight="400" color="gray.400" w="30%">
                {t("investmentCart.moreInfoDropdown.expectedExit")}:
              </Text>
              <Text
                fontSize="14px"
                fontWeight="700"
                className="deal-val expectedYr"
                color="#c7c7c7"
                w="70%"
                dir="ltr"
                style={{ textAlign: lang.includes("ar") ? "end" : "start" }}
              >
                {data.expectedExitYear}
              </Text>
            </Box>
            <Box
              w="100%"
              mb={2}
              style={{ marginTop: "5px" }}
              display="flex"
              alignItems="center"
            >
              <Text fontSize="14px" fontWeight="400" color="gray.400" w="30%">
                {t("investmentCart.moreInfoDropdown.expectedReturn")}:
              </Text>
              <Text
                fontSize="14px"
                fontWeight="bold"
                color="gray.400"
                w="70%"
                dir="ltr"
                style={{ textAlign: lang.includes("ar") ? "end" : "start" }}
              >
                {data.expectedReturn}
              </Text>
            </Box>
            <Box
              w="100%"
              mb={2}
              style={{ marginTop: "5px" }}
              display="flex"
              alignItems="center"
            >
              <Text fontSize="14px" fontWeight="400" color="gray.400" w="30%">
                {t("investmentCart.moreInfoDropdown.country")}:
              </Text>
              <Text fontSize="14px" fontWeight="bold" color="gray.400" w="70%">
                {data.country}
              </Text>
            </Box>
          </>
        ) : (
          false
        )}
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
