import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import {
  Box,
  Flex,
  Text,
  useBreakpointValue,
  useMediaQuery,
} from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React, { MouseEventHandler, useState } from "react"
import Slider from "react-slick"

import { Marquee } from "~/components"
import { CardCategoriesResponse } from "~/services/mytfo/clientTypes"
import { percentTwoDecimalPlace } from "~/utils/clientUtils/globalUtilities"

type props = {
  className?: string
  style?: {}
  onClick?: MouseEventHandler<HTMLDivElement>
}

function SampleNextArrow({ className, style, onClick }: props) {
  const { lang } = useTranslation("marketSimplified")
  return (
    <Box
      className={className}
      d={{
        lgp: lang.includes("ar") ? "block" : "none",
      }}
      style={{
        ...style,
        right: lang.includes("ar") ? "-25% !important" : "0",
      }}
      w="30px"
      h="30px"
      top="40%"
      onClick={onClick}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          aria-label="NextSlider "
          role={"slider"}
          opacity="0.15"
          cx="12"
          cy="12"
          r="12"
          fill="#B99855"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.2567 17.7557L15.6499 12.4073C15.8771 12.1822 15.8771 11.8184 15.6499 11.5927L10.2567 6.24429C9.92869 5.91857 9.39497 5.91857 9.06634 6.24429C8.7383 6.57002 8.7383 7.09866 9.06634 7.42438L13.6799 12.0003L9.06634 16.575C8.7383 16.9013 8.7383 17.43 9.06634 17.7557C9.39497 18.0814 9.92869 18.0814 10.2567 17.7557Z"
          fill="#B99855"
        />
      </svg>
    </Box>
  )
}

type arrowProps = {
  className?: string
  onClick?: MouseEventHandler<HTMLDivElement>
}

function SamplePrevArrow({ className, onClick }: arrowProps) {
  const { lang } = useTranslation("marketSimplified")
  return (
    <Box
      className={className}
      d={{
        lgp: lang.includes("ar") ? "block" : "none",
      }}
      w="30px"
      h="30px"
      top="40%"
      left="0"
      zIndex="5"
      onClick={onClick}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          aria-label="PrevSlider "
          role={"slider"}
          opacity="0.15"
          cx="12"
          cy="12"
          r="12"
          fill="#B99855"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.5636 17.7557L8.17043 12.4073C7.94319 12.1822 7.94319 11.8184 8.17043 11.5927L13.5636 6.24429C13.8916 5.91857 14.4253 5.91857 14.754 6.24429C15.082 6.57002 15.082 7.09866 14.754 7.42438L10.1404 12.0003L14.754 16.575C15.082 16.9013 15.082 17.43 14.754 17.7557C14.4253 18.0814 13.8916 18.0814 13.5636 17.7557Z"
          fill="#B99855"
        />
      </svg>
    </Box>
  )
}

type CardCategoriesData = {
  CardCategoriesDataProps: CardCategoriesResponse
}

export default function MarketSimplifiedCarousel(
  CardCategoriesDataProps: CardCategoriesData,
) {
  const [isMobileView] = useMediaQuery("(max-width: 1023px)")

  const { lang, t } = useTranslation("insights")
  const [Slick, setSlick] = useState(Number)
  const [selected, setSelected] = useState(
    lang.includes("ar") ? "next" : "prev",
  )
  const variant = useBreakpointValue({ sm: 5, md: 4, lgp: 3, xl: 3 })

  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 2,
    rows: 2,
    draggable: false,
    rtl: lang.includes("ar") ? true : false,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,

    afterChange: (slick: number) => {
      const isPrevArrow = document.querySelector<HTMLElement>(
        ".sliderClass .slick-prev",
      )
      const isNextArrow = document.querySelector<HTMLElement>(
        ".sliderClass .slick-next",
      )

      const contentPanel = document.querySelector<HTMLElement>(
        ".sliderClass .slick-list",
      )

      if (lang.includes("ar")) {
        if (slick == 0) {
          isNextArrow?.setAttribute("style", "display: block")
          isPrevArrow?.setAttribute("style", "display: none")
          contentPanel?.setAttribute(
            "style",
            "-webkit-mask: linear-gradient(270deg, transparent 1%, rgb(199, 199, 199) 20%, rgb(199, 199, 199) 0px, rgb(199, 199, 199) 59%) !important",
          )
          setSelected("prev")
        } else {
          isPrevArrow?.setAttribute("style", "display: block")
          var isSliderLenth = variant ? variant - 1 : 0

          if (isSliderLenth === slick) {
            contentPanel?.setAttribute(
              "style",
              "-webkit-mask: linear-gradient(90deg, transparent 1%, rgb(199, 199, 199) 20%, rgb(199, 199, 199) 0px, rgb(199, 199, 199) 59%) !important",
            )
            isNextArrow?.setAttribute("style", "display: none")
            setSelected("next")
          }
        }
      } else {
        if (slick == 0) {
          isPrevArrow?.setAttribute("style", "display: none")
          isNextArrow?.setAttribute("style", "display: block")
        } else {
          isPrevArrow?.setAttribute("style", "display: block")
          var isSliderLenth = variant ? variant - 1 : 0
          if (isSliderLenth === slick) {
            contentPanel?.setAttribute(
              "style",
              "-webkit-mask: linear-gradient(90deg, transparent 1%, rgb(199, 199, 199) 20%, rgb(199, 199, 199) 0px, rgb(199, 199, 199) 59%) !important",
            )
            isNextArrow?.setAttribute("style", "display: none ")
          }
        }
      }

      setSlick(slick)
    },

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
          dots: false,
          autoplay: false,
          speed: 1000,
          autoplaySpeed: 1000,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          autoplay: false,
          speed: 1000,
          autoplaySpeed: 1000,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          autoplay: false,
          speed: 1000,
          autoplaySpeed: 1000,
        },
      },
    ],
  }

  setTimeout(() => {
    const isSliderPanel = document.querySelector<HTMLElement>(
      ".sliderClass .slick-list",
    )
    if (lang.includes("ar")) {
      if (Slick == 0) {
        if (selected == "prev") {
          isSliderPanel?.setAttribute(
            "style",
            "-webkit-mask: linear-gradient(270deg, transparent 1%, #c7c7c7 20%, #c7c7c7 0, #c7c7c7 59%)",
          )
        } else {
          isSliderPanel?.setAttribute(
            "style",
            "-webkit-mask: linear-gradient(90deg, transparent 1%, #c7c7c7 20%, #c7c7c7 0, #c7c7c7 59%)",
          )
        }
      } else if (
        (variant == 7 && Slick == 7) ||
        (variant == 5 && Slick == 5) ||
        (variant == 4 && Slick == 4) ||
        (variant == 3 && Slick == 3)
      ) {
        isSliderPanel?.setAttribute(
          "style",
          "-webkit-mask: linear-gradient(270deg, transparent 1%, #c7c7c7 20%, #c7c7c7 0, #c7c7c7 59%)",
        )
      }
    } else {
      if (Slick == 0) {
        isSliderPanel?.setAttribute(
          "style",
          "-webkit-mask: linear-gradient(270deg, transparent 1%, #c7c7c7 20%, #c7c7c7 0, #c7c7c7 59%)",
        )
      } else if (
        (variant == 7 && Slick == 7) ||
        (variant == 5 && Slick == 5) ||
        (variant == 4 && Slick == 4) ||
        (variant == 3 && Slick == 3)
      ) {
        isSliderPanel?.setAttribute(
          "style",
          "-webkit-mask: linear-gradient(90deg, transparent 1%, #c7c7c7 20%, #c7c7c7 0, #c7c7c7 59%)",
        )
      }
    }
    if (isMobileView) {
      isSliderPanel?.setAttribute("style", "-webkit-mask: none")
    }
  }, 100)

  return (
    <Box>
      <Box
        as="header"
        fontStyle="normal"
        fontWeight="700"
        fontSize="18px"
        lineHeight="120%"
        color="contrast.200"
        pt="24px"
        mb="12px"
        // mx="35px"
      >
        {t("marketSimplified.label.categories")}
      </Box>

      <Slider {...settings} className="sliderClass">
        {CardCategoriesDataProps.CardCategoriesDataProps.stockCategories?.map(
          (item, i) => (
            <Box
              p={{ base: "5px", md: "12px", lgp: "14px 16px" }}
              bg="#222"
              key={i}
            >
              <Box>
                <Flex
                  justifyContent="space-between"
                  style={{
                    flexDirection: lang.includes("ar") ? "row-reverse" : "row",
                  }}
                >
                  <Text
                    aria-label={item.categoryName}
                    role={"heading"}
                    color="contrast.200"
                    fontSize="14px"
                    fontWeight="700"
                    pb="7px"
                  >
                    {item.categoryName}
                  </Text>
                </Flex>
                <Box
                  aria-label={item.categoryName}
                  role={"gridcell"}
                  w="100%"
                  p="10px"
                  borderRadius="6px"
                  bg="#1A1A1A"
                  color="contrast.200"
                  fontSize="14px"
                  key={i}
                >
                  {item.items.slice(0, 3).map((paste, i) => (
                    <Flex
                      style={{
                        flexDirection: lang.includes("ar")
                          ? "row-reverse"
                          : "row",
                      }}
                      justifyContent="space-between"
                      key={i}
                      mb="8px"
                      _last={{ mb: "0" }}
                    >
                      {paste.stockCompany.length <= 6 ? (
                        <Text style={{ color: "#C7C7C7" }} fontSize="14px">
                          {paste.stockCompany}
                        </Text>
                      ) : (
                        <Box w="58.33333333%" flex="0 0 auto" pr="5px">
                          <Marquee
                            color="#C7C7C7"
                            text={paste.stockCompany}
                            // scrollamount="2"
                          />
                        </Box>
                      )}

                      <Box flex="0 0 auto">
                        <Text
                          fontSize="16px"
                          fontWeight="700"
                          display="flex"
                          alignItems="center"
                          color={
                            paste.stockWeekChange.direction == "upwards"
                              ? "#B5E361"
                              : "#C73D3D"
                          }
                          whiteSpace="nowrap"
                        >
                          {paste.stockWeekChange.direction == "upwards" ? (
                            <TriangleUpIcon
                              h="10px"
                              w="10px"
                              me="5px"
                              color="green.500"
                            />
                          ) : (
                            <TriangleDownIcon
                              h="10px"
                              w="10px"
                              me="5px"
                              color="red.500"
                            />
                          )}{" "}
                          {percentTwoDecimalPlace(
                            paste.stockWeekChange.percent,
                          )}
                          %
                        </Text>
                      </Box>
                    </Flex>
                  ))}
                </Box>
              </Box>
            </Box>
          ),
        )}
        {CardCategoriesDataProps.CardCategoriesDataProps.indexCategories?.map(
          (item, i) => (
            <Box
              p={{ base: "5px", md: "12px", lgp: "14px 16px" }}
              bg="#222"
              key={i}
            >
              <Box>
                <Flex
                  justifyContent="space-between"
                  style={{
                    flexDirection: lang.includes("ar") ? "row-reverse" : "row",
                  }}
                >
                  <Text
                    aria-label={item.categoryName}
                    role={"heading"}
                    color="contrast.200"
                    fontSize="14px"
                    fontWeight="700"
                    pb="7px"
                  >
                    {item.categoryName}
                  </Text>
                </Flex>
                <Box
                  aria-label={item.categoryName}
                  role={"gridcell"}
                  w="100%"
                  p="10px"
                  borderRadius="6px"
                  bg="#1A1A1A"
                  color="contrast.200"
                  fontSize="14px"
                  key={i}
                >
                  {item.items.slice(0, 3).map((paste, i) => (
                    <Flex
                      style={{
                        flexDirection: lang.includes("ar")
                          ? "row-reverse"
                          : "row",
                      }}
                      key={i}
                      justifyContent="space-between"
                      mb="8px"
                      _last={{ mb: "0" }}
                    >
                      {paste.indexName.length <= 6 ? (
                        <Text style={{ color: "#C7C7C7" }} fontSize="14px">
                          {paste.indexName}
                        </Text>
                      ) : (
                        <Box w="58.33333333%" flex="0 0 auto" pr="5px">
                          <Marquee color="#C7C7C7" text={paste.indexName} />
                        </Box>
                      )}

                      <Box flex="0 0 auto">
                        <Text
                          fontSize="16px"
                          fontWeight="700"
                          display="flex"
                          alignItems="center"
                          color={
                            paste.indexWeekChange.direction == "upwards"
                              ? "#B5E361"
                              : "#C73D3D"
                          }
                          whiteSpace="nowrap"
                        >
                          {paste.indexWeekChange.direction == "upwards" ? (
                            <TriangleUpIcon
                              h="10px"
                              w="10px"
                              me="5px"
                              color="green.500"
                            />
                          ) : (
                            <TriangleDownIcon
                              h="10px"
                              w="10px"
                              me="5px"
                              color="red.500"
                            />
                          )}{" "}
                          {percentTwoDecimalPlace(
                            paste.indexWeekChange.percent,
                          )}
                          %
                        </Text>
                      </Box>
                    </Flex>
                  ))}
                </Box>
              </Box>
            </Box>
          ),
        )}
        {CardCategoriesDataProps.CardCategoriesDataProps.bondCategories?.map(
          (item, i) => (
            <Box
              p={{ base: "5px", md: "12px", lgp: "14px 16px" }}
              _last={{
                pr: "30px",
              }}
              bg="#222"
              key={i}
            >
              <Box>
                <Flex
                  justifyContent="space-between"
                  style={{
                    flexDirection: lang.includes("ar") ? "row-reverse" : "row",
                  }}
                >
                  <Text
                    aria-label={item.categoryName}
                    role={"heading"}
                    color="contrast.200"
                    fontSize="14px"
                    fontWeight="700"
                    pb="7px"
                  >
                    {item.categoryName}
                  </Text>
                </Flex>
                <Box
                  aria-label={item.categoryName}
                  role={"gridcell"}
                  w="100%"
                  p="10px"
                  borderRadius="6px"
                  bg="#1A1A1A"
                  color="contrast.200"
                  fontSize="14px"
                  key={i}
                >
                  {item.items.slice(0, 3).map((paste, i) => (
                    <Flex
                      style={{
                        flexDirection: lang.includes("ar")
                          ? "row-reverse"
                          : "row",
                      }}
                      key={i}
                      justifyContent="space-between"
                      mb="8px"
                      _last={{ mb: "0" }}
                    >
                      {paste.bondYields.length <= 6 ? (
                        <Text style={{ color: "#C7C7C7" }} fontSize="14px">
                          {paste.bondYields}
                        </Text>
                      ) : (
                        <Box w="58.33333333%" flex="0 0 auto" pr="5px">
                          <Marquee
                            color="#C7C7C7"
                            text={paste.bondYields}
                            // scrollamount="2"
                          />
                        </Box>
                      )}

                      <Box flex="0 0 auto">
                        <Text
                          fontSize="16px"
                          fontWeight="700"
                          display="flex"
                          alignItems="center"
                          color={
                            paste.bondWeekChange.direction == "upwards"
                              ? "#B5E361"
                              : "#C73D3D"
                          }
                          whiteSpace="nowrap"
                        >
                          {paste.bondWeekChange.direction == "upwards" ? (
                            <TriangleUpIcon
                              h="10px"
                              w="10px"
                              me="5px"
                              color="green.500"
                            />
                          ) : (
                            <TriangleDownIcon
                              h="10px"
                              w="10px"
                              me="5px"
                              color="red.500"
                            />
                          )}{" "}
                          {percentTwoDecimalPlace(paste.bondWeekChange.percent)}
                          %
                        </Text>
                      </Box>
                    </Flex>
                  ))}
                </Box>
              </Box>
            </Box>
          ),
        )}
      </Slider>
    </Box>
  )
}
