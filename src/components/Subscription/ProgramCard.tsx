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
import ky from "ky"
import useTranslation from "next-translate/useTranslation"
import React, { useState } from "react"
import useSWR, { mutate } from "swr"

import { Checkbox, DownArrow, InfoIcon, ModalBox } from "~/components"
import { SubscriptionDealsDetail } from "~/services/mytfo/clientTypes"
import { PopupDetailRoot } from "~/services/mytfo/types"

type ProgramCardType = {
  deal: SubscriptionDealsDetail
  onChangeHandler: Function
  programIndex: number
  dealIndex: number
}

export default function ProgramCard({
  deal,
  onChangeHandler,
  programIndex,
  dealIndex,
}: ProgramCardType) {
  const { lang, t } = useTranslation("subscription")
  const [showDetails, setShowdetails] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const { data: popUps } = useSWR<PopupDetailRoot>(
    `/api/client/deals/popup-details`,
  )

  const updatePopUpFlag = async (popUpName: string, flag: boolean) => {
    try {
      var popUpData = popUps?.popupDetails.find(({ popupName }) => {
        return popupName == popUpName
      })
      if (!popUpData?.flag) {
        await ky.post("/api/client/deals/popup-details", {
          json: {
            updatePopupDetailsList: [
              {
                popupId: popUpData?.popupId,
                flag,
                popupName: popUpName,
              },
            ],
          },
        })
        await mutate(`/api/client/deals/popup-details`)
      }
    } catch (error) {}
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
        className="programPopup"
      >
        <Popover
          returnFocusOnClose={false}
          isOpen={
            popUps?.popupDetails?.length && programIndex == 0 && dealIndex == 0
              ? !popUps?.popupDetails?.find(({ popupName }) => {
                  return popupName == "PROGRAM_DETAILS_SELECT_DEAL"
                })?.flag
                ? true
                : false
              : false
          }
          onClose={() => updatePopUpFlag("PROGRAM_DETAILS_SELECT_DEAL", true)}
          placement={"bottom-start"}
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
                onChange={(e) => {
                  updatePopUpFlag("PROGRAM_DETAILS_SELECT_DEAL", true)
                  onChangeHandler(e.target.checked, programIndex, dealIndex)
                }}
                colorScheme="secondary"
                isChecked={deal.defaultSelection || deal.isSelected}
                mr="8px"
                isDisabled={deal.defaultSelection ? true : false}
                className="remember-txt"
              />
              <Text mr={4} dir="ltr">
                {deal.dealName}
              </Text>
              {deal.defaultSelection ? (
                <InfoIcon
                  color={"primary.500"}
                  onClick={() => {
                    setIsOpen(true)
                  }}
                  cursor="pointer"
                />
              ) : (
                false
              )}
            </Box>
          </PopoverTrigger>
          <PopoverContent bg="gunmetal.500">
            <PopoverHeader fontWeight="400" fontSize="12px" color="gray.400">
              {t("common:client.userOnBoarding.programDetails.title")}
            </PopoverHeader>
            <PopoverArrow bg="gunmetal.500" border="0px" />
            <PopoverCloseButton
              style={{
                right: lang.includes("en") ? "5px" : "inherit",
                left: lang.includes("en") ? "inherit" : "5px",
              }}
            />
            <PopoverBody fontWeight="400" fontSize="14px" color="contrast.200">
              {t("common:client.userOnBoarding.programDetails.description")}
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
                {deal.sponsor}
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
                {lang.includes("en")
                  ? deal.assetClass
                  : deal?.assetClassAr
                  ? deal?.assetClassAr
                  : deal?.assetClass}
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
                {lang.includes("en")
                  ? deal.sector
                  : deal?.sectorAr
                  ? deal?.sectorAr
                  : deal?.sector}
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
                fontWeight="bold"
                className="deal-val expectedYr"
                w="70%"
              >
                {deal.expectedExitYear}
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
              <Text fontSize="14px" fontWeight="bold" color="gray.400" w="70%">
                {deal.expectedReturn}
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
                {t("investmentCart.moreInfoDropdown.country")}:{" "}
              </Text>
              <Text fontSize="14px" fontWeight="bold" color="gray.400" w="70%">
                {lang.includes("en")
                  ? deal.country
                  : deal?.countryAr
                  ? deal?.countryAr
                  : deal?.country}
              </Text>
            </Box>
          </>
        ) : (
          false
        )}
      </VStack>
      <ModalBox
        isOpen={isOpen}
        modalDescription={t("programDetails.newDealPopup.description")}
        modalTitle={t("programDetails.newDealPopup.title")}
        primaryButtonText={t("common:client.errors.noDate.button")}
        onClose={() => {
          setIsOpen(false)
        }}
        onPrimaryClick={() => {
          setIsOpen(false)
        }}
      />
    </>
  )
}
