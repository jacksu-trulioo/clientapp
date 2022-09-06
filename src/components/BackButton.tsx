import { Button, ButtonProps } from "@chakra-ui/button"
import { Badge, Box, Flex, Text } from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/media-query"
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
} from "@chakra-ui/react"
import ky from "ky"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { useState } from "react"
import useSWR, { mutate } from "swr"

import { CaretLeftIcon, InvestmentCartIcon } from "~/components"
import useStore from "~/hooks/useStore"
import { InvestmentCartDealDetails } from "~/services/mytfo/clientTypes"
import { PopupDetailRoot } from "~/services/mytfo/types"
import directlyAccessiblePath from "~/utils/constants/directlyAccessiblePath"

import { withNoSsr } from "../components/NoSsr"

function BackButton(props: ButtonProps) {
  const router = useRouter()
  const { t } = useTranslation("common")

  // https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
  if (history.scrollRestoration && history.scrollRestoration !== "manual") {
    history.scrollRestoration = "manual"
  }

  return (
    <Button
      colorScheme="primary"
      leftIcon={
        <CaretLeftIcon
          transform={router.locale === "ar" ? "rotate(180deg)" : "initial"}
        />
      }
      onClick={router.back}
      variant="ghost"
      size="sm"
      {...props}
    >
      {t("button.back")}
    </Button>
  )
}

const BackButtonContainer = () => {
  const { t, lang } = useTranslation("common")
  const router = useRouter()
  const isDesktopView = useBreakpointValue({ base: false, lgp: true })
  const [showBackButton, setShowBackButton] = useStore((state) => [
    state.showBackButton,
    state.setShowBackButton,
  ])
  const [isProceedGuide, setIsProceedGuide] = useState(false)
  const shouldShowBackButton =
    history?.length !== 0 && !directlyAccessiblePath.includes(router.pathname)

  const cartButton =
    !isDesktopView && router.pathname.includes("client/opportunities")
  const { data: investmentCartCount } = useSWR<InvestmentCartDealDetails[]>(
    cartButton ? "/api/client/deals/investment-cart" : null,
  )

  const { data: popUps } = useSWR<PopupDetailRoot>(
    cartButton ? "/api/client/deals/popup-details" : null,
  )

  React.useEffect(() => {
    if (popUps?.popupDetails?.length) {
      var popUpData = popUps?.popupDetails?.find(({ popupName }) => {
        return popupName == "OPPORTUNITIES_INVESTMENT_CART"
      })

      var addTOCartPopupData = popUps?.popupDetails?.find(({ popupName }) => {
        return popupName == "OPPORTUNITIES_ADD_TO_CART"
      })

      if (!popUpData?.flag && addTOCartPopupData?.flag) {
        setIsProceedGuide(true)
      } else {
        setIsProceedGuide(false)
      }
    } else {
      setIsProceedGuide(false)
    }

    if (shouldShowBackButton !== showBackButton) {
      setShowBackButton(shouldShowBackButton)
    }
  }, [setShowBackButton, shouldShowBackButton, showBackButton, popUps])

  if (isDesktopView) {
    //returned spacer as the flex items needs to be flexed between in header
    return shouldShowBackButton ? <BackButton my="1" /> : <Spacer />
  }

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

  return shouldShowBackButton ? (
    <Box
      width="full"
      position={isProceedGuide ? "fixed" : "relative"}
      top={isProceedGuide ? "56px" : "inherit"}
    >
      <Flex dir="row" justifyContent="space-between" alignItems="center">
        <BackButton mt="2px" mb="4px" />
        {cartButton && (
          <Popover
            returnFocusOnClose={false}
            isOpen={isProceedGuide}
            onClose={() =>
              updatePopUpFlag("OPPORTUNITIES_INVESTMENT_CART", true)
            }
            placement={"bottom-end"}
            closeOnBlur={false}
          >
            <PopoverTrigger>
              <Box display={{ base: "block", lgp: "none" }}>
                <Text
                  cursor="pointer"
                  ps="3"
                  pe="3"
                  display={{ base: "none", md: "block" }}
                  fontSize="16px"
                  fontWeight="500"
                  color="primary.500"
                  textAlign={{ base: "right", md: "right" }}
                  onClick={() => router.push("/client/subscription")}
                >
                  <InvestmentCartIcon /> {t("client.investmentCart.title")} (
                  {investmentCartCount?.length})
                </Text>
                <Text
                  cursor={"pointer"}
                  ps="3"
                  pe="3"
                  display={{ base: "block", md: "none" }}
                  fontSize="16px"
                  fontWeight="500"
                  color="primary.500"
                  textAlign={{ base: "right", md: "right" }}
                  onClick={() => router.push("/client/subscription")}
                  paddingRight="25px"
                >
                  <Box pos="relative" w="27px">
                    <InvestmentCartIcon />
                    <Badge
                      alignItems="center"
                      justifyContent="center"
                      background="#c73d3d"
                      position="absolute"
                      right="-7px"
                      top="-9px"
                      width="16px"
                      height="16px"
                      borderRadius="100%"
                      fontWeight="600"
                      fontSize="10px"
                      lineHeight="12px"
                      textAlign="center"
                      color="#fff"
                      display="flex"
                    >
                      {investmentCartCount?.length}
                    </Badge>
                  </Box>
                </Text>
              </Box>
            </PopoverTrigger>
            <PopoverContent bg="gunmetal.500" marginRight="15px">
              <PopoverHeader fontWeight="400" fontSize="12px" color="gray.400">
                {t("client.userOnBoarding.viewCart.title")}
              </PopoverHeader>
              <PopoverArrow bg="gunmetal.500" border="0px" />
              <PopoverCloseButton
                style={{
                  right: lang.includes("en") ? "5px" : "inherit",
                  left: lang.includes("en") ? "inherit" : "5px",
                }}
              />
              <PopoverBody
                fontWeight="400"
                fontSize="14px"
                color="contrast.200"
              >
                {t("client.userOnBoarding.viewCart.description")}
              </PopoverBody>
            </PopoverContent>
          </Popover>
        )}
      </Flex>
    </Box>
  ) : null
}

export default withNoSsr(BackButtonContainer)
