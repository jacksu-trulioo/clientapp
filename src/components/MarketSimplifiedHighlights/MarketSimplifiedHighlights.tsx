import { Box, Hide, Text, useMediaQuery } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React, { MouseEventHandler } from "react"
import Slider from "react-slick"

type arrowProps = {
  className?: string
  style?: {}
  onClick?: MouseEventHandler<HTMLDivElement>

  insideArrow?: string
}

function SampleNextArrow({
  className,
  style,
  onClick,
  insideArrow,
}: arrowProps) {
  const { lang } = useTranslation()

  return (
    <Hide below="lgp">
      {insideArrow == "in" ? (
        <Box
          aria-label="highlightsSliderNext"
          role={"slider"}
          className={className}
          style={{
            ...style,
            right: lang.includes("ar") ? "7px" : "4px",
          }}
          w="30px"
          h="30px"
          top="40%"
          onClick={onClick}
        >
          <svg
            width="13"
            height="21"
            viewBox="0 0 13 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.09064 20.3721L12.0792 11.4581C12.458 11.0829 12.458 10.4767 12.0792 10.1005L3.09064 1.18645C2.54391 0.643579 1.65437 0.643579 1.10666 1.18645C0.55993 1.72932 0.55993 2.61039 1.10666 3.15326L8.79591 10.7798L1.10666 18.4044C0.55993 18.9482 0.55993 19.8293 1.10666 20.3721C1.65437 20.915 2.54391 20.915 3.09064 20.3721Z"
              fill="#C7C7C7"
            />
          </svg>
        </Box>
      ) : (
        <Box
          aria-label="highlightsSliderNext"
          role={"slider"}
          className={className}
          style={{
            ...style,
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
            <circle opacity="0.15" cx="12" cy="12" r="12" fill="#B99855" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.2567 17.7557L15.6499 12.4073C15.8771 12.1822 15.8771 11.8184 15.6499 11.5927L10.2567 6.24429C9.92869 5.91857 9.39497 5.91857 9.06634 6.24429C8.7383 6.57002 8.7383 7.09866 9.06634 7.42438L13.6799 12.0003L9.06634 16.575C8.7383 16.9013 8.7383 17.43 9.06634 17.7557C9.39497 18.0814 9.92869 18.0814 10.2567 17.7557Z"
              fill="#B99855"
            />
          </svg>
        </Box>
      )}
    </Hide>
  )
}

function SamplePrevArrow({
  className,
  style,
  onClick,
  insideArrow,
}: arrowProps) {
  const { lang } = useTranslation()
  return (
    <Hide below="lgp">
      {insideArrow == "in" ? (
        <Box
          aria-label="highlightsSliderPrev"
          role={"slider"}
          className={className}
          style={{
            ...style,
            left: lang.includes("ar") ? "26px" : "25px",
          }}
          w="30px"
          h="30px"
          top="40%"
          zIndex="5"
          onClick={onClick}
          // left="25px"
        >
          <svg
            width="12"
            height="21"
            viewBox="0 0 12 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.60614 20.0909L0.617546 11.1769C0.238813 10.8016 0.238813 10.1954 0.617546 9.81921L9.60614 0.905201C10.1529 0.362329 11.0424 0.362329 11.5901 0.905201C12.1368 1.44807 12.1368 2.32914 11.5901 2.87201L3.90087 10.4985L11.5901 18.1231C12.1368 18.667 12.1368 19.548 11.5901 20.0909C11.0424 20.6338 10.1529 20.6338 9.60614 20.0909Z"
              fill="#C7C7C7"
            />
          </svg>
        </Box>
      ) : (
        <Box
          aria-label="highlightsSliderPrev"
          role={"slider"}
          className={className}
          style={{ ...style }}
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
            <circle opacity="0.15" cx="12" cy="12" r="12" fill="#B99855" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.5636 17.7557L8.17043 12.4073C7.94319 12.1822 7.94319 11.8184 8.17043 11.5927L13.5636 6.24429C13.8916 5.91857 14.4253 5.91857 14.754 6.24429C15.082 6.57002 15.082 7.09866 14.754 7.42438L10.1404 12.0003L14.754 16.575C15.082 16.9013 15.082 17.43 14.754 17.7557C14.4253 18.0814 13.8916 18.0814 13.5636 17.7557Z"
              fill="#B99855"
            />
          </svg>
        </Box>
      )}
    </Hide>
  )
}

type props = {
  SlideOnScreenDesktop: number
  SlideOnScreenTab?: number
  SlideOnScreenMob?: number
  Highlights: string[]
  insideArrowMain?: string
  Boxpadding?: string
  MinHeight?: string
}

const MarketHighlights = ({
  SlideOnScreenDesktop,
  SlideOnScreenTab,
  SlideOnScreenMob,
  Highlights,
  insideArrowMain,
  Boxpadding,
  MinHeight,
}: props) => {
  const { t } = useTranslation("insights")
  const data = Highlights
  const isMobView = useMediaQuery([
    "(max-width: 768px)",
    "(display-mode: browser)",
  ])
  const isTabView = useMediaQuery([
    "(max-width: 1023px)",
    "(display-mode: browser)",
  ])

  const getMobView = () => {
    var mobView = false
    isMobView.forEach((item, index) => {
      if (index == 0 && item) {
        mobView = item
      }
    })
    return mobView
  }

  const getTabView = () => {
    var tabView = false
    isTabView.forEach((item, index) => {
      if (index == 0 && item) {
        tabView = item
      }
    })
    return tabView
  }

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: getMobView()
      ? SlideOnScreenMob
      : getTabView()
      ? SlideOnScreenTab
      : SlideOnScreenDesktop,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 5000,
    draggable: false,
    nextArrow: <SampleNextArrow insideArrow={insideArrowMain} />,
    prevArrow: <SamplePrevArrow insideArrow={insideArrowMain} />,
  }
  return (
    <Box mb="50px">
      <Text
        mt={{ lgp: "32px", base: "24px" }}
        mb={{ lgp: "12px", base: "16px" }}
        fontSize={{ lgp: "18px", md: "16px", base: "18px" }}
        fontWeight="700"
      >
        {t("higlights.title")}
      </Text>
      <Slider {...settings} infinite={false} className="highlightsCarouselBox">
        {data.map((item: string, i: number) => (
          <Box key={i} textAlign="left" color="#fff" px="15px">
            <Box
              w="100%"
              bg="#222"
              style={{
                padding: getTabView()
                  ? "16px"
                  : Boxpadding
                  ? Boxpadding
                  : "16px 22px",
              }}
              borderRadius="6px"
              d="flex"
              flexDir="column"
              justifyContent="center"
              minH={MinHeight}
              overflow="hidden"
            >
              <Text
                aria-label="highlightsContent"
                role={"contentinfo"}
                fontFamily="Gotham,sans-serif"
                style={{ textAlign: "start" }}
                fontSize={{ lgp: "18px", base: "16px" }}
                fontStyle="normal"
                fontWeight="400"
                lineHeight="120%"
                color="contrast.200"
              >
                {item}
              </Text>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  )
}

export default MarketHighlights
