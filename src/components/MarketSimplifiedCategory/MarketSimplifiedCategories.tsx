import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React, { MouseEventHandler } from "react"
import Slider from "react-slick"

import { Marquee, PolygonDownIcon, PolygonIcon } from "~/components"

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
        lgp: "block !important",
        md: "none !important",
        base: "none !important",
      }}
      style={{ ...style, right: lang.includes("ar") ? "-25% !important" : "0" }}
      w="30px"
      h="30px"
      top="40%"
      //   right="0"
      //   _before={{ content: '""' }}
      onClick={onClick}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle opacity="0.15" cx="12" cy="12" r="12" fill="#B99855" />
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
  style?: {}
  onClick?: MouseEventHandler<HTMLDivElement>
}

function SamplePrevArrow({ className, style, onClick }: arrowProps) {
  return (
    <Box
      className={className}
      d={{
        lgp: "block !important",
        md: "none !important",
        base: "none !important",
      }}
      style={{ ...style }}
      w="30px"
      h="30px"
      top="40%"
      left="0"
      zIndex="5"
      onClick={onClick}
      //   _before={{ content: '""' }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle opacity="0.15" cx="12" cy="12" r="12" fill="#B99855" />
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

export default function Categories() {
  const { lang } = useTranslation("marketSimplified")
  const Boxes = [
    {
      country: "Nasdaq",
      place: "NADQ",
      cost: "130.23",
      value: "+12.4%",
      color: "#B5E361",
    },
    {
      country: "Dow Jones",
      place: "DOW",
      cost: "130.23",
      value: "-12.4%",
      color: "#C73D3D",
    },
    {
      country: "Russell 2000",
      place: "RUT",
      cost: "130.23",
      value: "12.4%",
      color: "#B5E361",
      arrow: <PolygonIcon width={"12px"} height={"12px"} direction="inherit" />,
    },
    {
      country: "S&P 500",
      place: "SPX",
      cost: "130.23",
      value: "12.4%",
      color: "#B5E361",
      arrow: <PolygonIcon width={"12px"} height={"12px"} direction="inherit" />,
    },
    {
      country: "NYSE",
      place: "NYA",
      cost: "130.23",
      value: "12.4%",
      color: "#C73D3D",
      arrow: (
        <PolygonDownIcon width={"12px"} height={"12px"} direction="bottom" />
      ),
    },
    {
      country: "Russell 2000",
      place: "RUT",
      cost: "130.23",
      value: "12.4%",
      color: "#B5E361",
      arrow: <PolygonIcon width={"12px"} height={"12px"} direction="inherit" />,
    },
    {
      country: "S&P 500",
      place: "SPX",
      cost: "130.23",
      value: "12.4%",
      color: "#B5E361",
      arrow: <PolygonIcon width={"12px"} height={"12px"} direction="inherit" />,
    },
    {
      country: "NYSE",
      place: "NYA NYA NYA NYA",
      cost: "130.23",
      value: "12.4%",
      color: "#C73D3D",
      arrow: (
        <PolygonDownIcon width={"12px"} height={"12px"} direction="bottom" />
      ),
    },
    {
      country: "NYSE",
      place: "NYA NYA NYA NYA",
      cost: "130.23",
      value: "12.4%",
      color: "#C73D3D",
      arrow: (
        <PolygonDownIcon width={"12px"} height={"12px"} direction="bottom" />
      ),
    },
    {
      country: "NYSE",
      place: "NYA NYA NYA NYA",
      cost: "130.23",
      value: "12.4%",
      color: "#C73D3D",
      arrow: (
        <PolygonDownIcon width={"12px"} height={"12px"} direction="bottom" />
      ),
    },
    {
      country: "NYSE",
      place: "NYA NYA NYA NYA",
      cost: "130.23",
      value: "12.4%",
      color: "#C73D3D",
      arrow: (
        <PolygonDownIcon width={"12px"} height={"12px"} direction="bottom" />
      ),
    },
  ]

  const data = [
    "S+P has gained 14.6% YTD in 2020, but without Facebook, Amazon,Netflix, Microsoft, Apple, and Alphabet (Google), it would onlybe up by 2.3% YTD. This group of 6 stocks peaked on Sept 2nd and (except Alphabet) has refused to confirm the S+P 500's recent new highs.",
    "S+P has gained 14.6% YTD in 2020, but without Facebook, Amazon,Netflix, Microsoft, Apple, and Alphabet (Google), it would onlybe up by 2.3% YTD. This group of 6 stocks peaked on Sept 2nd and (except Alphabet) has refused to confirm the S+P 500's recent new highs.",
    "S+P has gained 14.6% YTD in 2020, but without Facebook, Amazon,Netflix, Microsoft, Apple, and Alphabet (Google), it would onlybe up by 2.3% YTD. This group of 6 stocks peaked on Sept 2nd and (except Alphabet) has refused to confirm the S+P 500's recent new highs.",
  ]

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    draggable: false,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  }
  return (
    <Box mt="50px">
      <Box
        as="header"
        fontStyle="normal"
        fontWeight="700"
        fontSize="18px"
        lineHeight="120%"
        color="#fff"
        // mt="36px"
        mb="15px"
      >
        Categories
      </Box>
      <Box>
        <Slider {...settings}>
          {data.map((i) => (
            <Box key={i} px={{ base: "5px", md: "24px" }} py="20px" bg="#222">
              <Grid
                templateColumns={{
                  xl: "repeat(5, 1fr)",
                  md: "repeat(3, 1fr)",
                  base: "repeat(2, 1fr)",
                }}
                gap={{ xl: "30px", base: "10px" }}
                py="8px"
              >
                {Boxes.map((paste, i) => (
                  <Box key={i}>
                    {" "}
                    <Flex
                      justifyContent="space-between"
                      style={{
                        flexDirection: lang.includes("ar")
                          ? "row-reverse"
                          : "row",
                      }}
                    >
                      <Text
                        color="#fff"
                        fontSize="14px"
                        fontWeight="700"
                        pb="7px"
                      >
                        Indices
                      </Text>
                    </Flex>
                    <GridItem
                      w="100%"
                      p="15px"
                      borderRadius="6px"
                      bg="#1A1A1A"
                      color="#fff"
                      fontSize="14px"
                      key={i}
                    >
                      <Flex
                        style={{
                          flexDirection: lang.includes("ar")
                            ? "row-reverse"
                            : "row",
                        }}
                        justifyContent="space-between"
                      >
                        {paste.place.length <= 6 ? (
                          <Text style={{ color: "#C7C7C7" }} fontSize="14px">
                            {paste.place}
                          </Text>
                        ) : (
                          <Marquee
                            color="#C7C7C7"
                            width="50%"
                            text={paste.country}
                          />
                        )}

                        <Text fontSize="18px" fontWeight="700">
                          {paste.cost}
                        </Text>
                      </Flex>

                      <Flex
                        pt="6px"
                        style={{
                          flexDirection: lang.includes("ar")
                            ? "row-reverse"
                            : "row",
                        }}
                        justifyContent="space-between"
                      >
                        {paste.place.length <= 6 ? (
                          <Text style={{ color: "#C7C7C7" }}>
                            {paste.place}
                          </Text>
                        ) : (
                          <Marquee
                            color="#C7C7C7"
                            width="50%"
                            text={paste.place}
                          />
                        )}

                        <Text
                          fontSize="18px"
                          color={paste.color}
                          fontWeight="700"
                        >
                          {paste.arrow}&nbsp;{paste.value}
                        </Text>
                      </Flex>
                      <Flex
                        pt="6px"
                        style={{
                          flexDirection: lang.includes("ar")
                            ? "row-reverse"
                            : "row",
                        }}
                        justifyContent="space-between"
                      >
                        {paste.place.length <= 6 ? (
                          <Text style={{ color: "#C7C7C7" }}>
                            {paste.place}
                          </Text>
                        ) : (
                          <Marquee
                            color="#C7C7C7"
                            width="50%"
                            text={paste.place}
                          />
                        )}

                        <Text
                          fontSize="18px"
                          color={paste.color}
                          fontWeight="700"
                        >
                          {paste.arrow}&nbsp;{paste.value}
                        </Text>
                      </Flex>
                    </GridItem>
                  </Box>
                ))}
              </Grid>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  )
}
