import { Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react"
import { format } from "date-fns"
import moment from "moment"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect, useState } from "react"
import useSWR from "swr"

import { PortfolioActivityType } from "~/services/mytfo/clientTypes"

import Calender from "./CalenderComponent/Calender"
import MultiCalender from "./CalenderComponent/MultiCalender"
import PortfolioActivityBoxes from "./CalenderComponent/PortfolioActivityBoxes/PortfolioActivityBoxes"

type isEventDate = Date[]

type HighliDataType = {
  [key: string]: isEventDate
}

type HighlightRange = HighliDataType[]

type FooterDetailsType = {
  bgColor: string
  title: string
}[]

export default function PortfolioActivity() {
  const { data: portfolioActivityData } = useSWR(
    `/api/client/miscellaneous/portfolio-activity`,
  )

  const { t } = useTranslation("clientDashboard")

  const [highlightRange, setHighlightRange] = useState<HighlightRange>()
  const [isFooterDetails, setisFooterDetails] = useState<FooterDetailsType>()
  const [isMinDate, setisMinDate] = useState<Date>()
  const [isMaxDate, setIsMaxDate] = useState<Date>()
  const [isStartDate, setStartDate] = useState<Date>()
  const [isToggle, setToggle] = useState<boolean>(false)
  const [isMonthData, setMonthData] = useState<Array<PortfolioActivityType>>([])

  const [isNextMonthData, setNextMonthData] = useState<boolean>(false)
  const [isCallback, setCallback] = useState<string>("onLoad")
  const [activityEventHeight, setActivityEventHeight] = useState<number>(445)

  const isTabView = useBreakpointValue({
    base: false,
    md: true,
    lg: true,
    lgp: false,
    xl: false,
    "2xl": false,
  })

  useEffect(() => {
    getCalendarData("onload")
  }, [isTabView, portfolioActivityData])

  useEffect(() => {
    setActivityEventHeight(
      document.getElementsByClassName("tfo-datepicker-portfolio-activity")[0]
        .clientHeight,
    )
  }, [isToggle])

  const getCalendarData = (callBack: string) => {
    if (isCallback == "onLoad" || isCallback == "curr") {
      setCallback("prev")
    } else {
      setCallback("curr")
    }

    let monthWiseData = [] as PortfolioActivityType[]
    let isMultiCalendarData = [] as PortfolioActivityType[]
    let distributionList: Date[] = []
    let capitalCallList: Date[] = []
    let exitsList: Date[] = []
    let isFooterData = [
      {
        title: t("portfolioActivity.calenderLegends.title1"),
        bgColor: "#7bad1f",
      },
      {
        title: t("portfolioActivity.calenderLegends.title2"),
        bgColor: "#F7B198",
      },
      {
        title: t("portfolioActivity.calenderLegends.title3"),
        bgColor: "#8791E4",
      },
    ]

    let isSelectedMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      1,
    )

    let hasNextMonth = true
    let isDate = new Date(isSelectedMonth)
    isDate.setMonth(new Date(isSelectedMonth).getMonth() + 1)
    const lastDay = new Date(isDate.getFullYear(), isDate.getMonth() + 1, 0)

    setisMinDate(new Date(isSelectedMonth))
    setIsMaxDate(new Date(lastDay))

    let isMonthDate = new Date(isSelectedMonth)
    let isCurrDate = new Date(isSelectedMonth)
    let currDateFormat = format(new Date(isCurrDate), "yyyy-MM-dd")

    let isCurrMonthDate = new Date(isSelectedMonth)
    isCurrMonthDate.setMonth(new Date(isSelectedMonth).getMonth() + 1)

    if (callBack == "change") {
      if (isToggle) {
        isMonthDate.setMonth(new Date(isSelectedMonth).getMonth() + 1)
        setToggle(false)
      } else {
        setToggle(true)
      }
    } else {
      setToggle(true)
    }

    let startDate = new Date(
      isMonthDate.getFullYear(),
      isMonthDate.getMonth(),
      1,
    )
    let startDateFormat = format(new Date(startDate), "yyyy-MM-dd")

    let endDate = new Date(
      isMonthDate.getFullYear(),
      isMonthDate.getMonth() + 1,
      0,
    )
    let endDateFormat = format(new Date(endDate), "yyyy-MM-dd")

    if (portfolioActivityData?.length > 0) {
      portfolioActivityData.forEach((item: PortfolioActivityType) => {
        let isMonth = format(new Date(item.date), "yyyy-MM-dd")

        let isCurrMonth = format(new Date(item.date), "MM")
        let isNextMonth = format(new Date(isCurrMonthDate), "MM")

        if (isNextMonth == isCurrMonth) {
          setNextMonthData(true)
          startDateFormat = format(
            new Date(
              isCurrMonthDate.getFullYear(),
              isCurrMonthDate.getMonth(),
              1,
            ),
            "yyyy-MM-dd",
          )
        } else {
          setNextMonthData(false)
          hasNextMonth = false
        }

        let sameOrBefore = moment(startDateFormat).isSameOrBefore(isMonth)
        let sameOrAfter = moment(endDateFormat).isSameOrAfter(isMonth)

        if (sameOrBefore && sameOrAfter) {
          if (currDateFormat <= isMonth) {
            monthWiseData.push(item)
          }
        }

        if (currDateFormat <= isMonth) {
          isMultiCalendarData.push(item)
        }

        if (item.capitalCalls.length > 0) {
          for (let c = 0; c < item.capitalCalls.length; c++) {
            capitalCallList.push(new Date(item.date))
          }
        }

        if (item.distributions.length > 0) {
          for (let d = 0; d < item.distributions.length; d++) {
            distributionList.push(new Date(item.date))
          }
        }

        if (item.exits.length > 0) {
          for (let e = 0; e < item.exits.length; e++) {
            exitsList.push(new Date(item.date))
          }
        }
      })

      if (hasNextMonth) {
        let nextMonth = new Date(
          isCurrMonthDate.getFullYear(),
          isCurrMonthDate.getMonth(),
          1,
        )
        setStartDate(nextMonth)
        setNextMonthData(false)

        portfolioActivityData.forEach((item: PortfolioActivityType) => {
          monthWiseData.push(item)
        })
      } else {
        setStartDate(new Date(isSelectedMonth))
      }
    }

    if (isTabView) {
      setMonthData(isMultiCalendarData)
    } else {
      setMonthData(monthWiseData)
    }

    let isHighlightRange = [
      {
        "react-datepicker__day--capital-calls": capitalCallList,
      },
      {
        "react-datepicker__day--distribution": distributionList,
      },
      {
        "react-datepicker__day--exits": exitsList,
      },
    ] as HighliDataType[]

    setHighlightRange(isHighlightRange)

    setisFooterDetails(isFooterData)
  }

  const getClassName = () => {
    return `portfolioActivityCalendar singleCalendar ${
      isNextMonthData ? "" : "navBtnhide "
    }`
  }

  return (
    <>
      <Box className="portfolioActivityBG">
        <Box>
          <Text
            fontSize="18px"
            fontWeight="700"
            color="#FFF"
            lineHeight="120%"
            mb="16px"
          >
            {t("portfolioActivity.title")}
          </Text>
          <Text
            fontSize="14px"
            fontWeight="400"
            color="#C7C7C7"
            lineHeight="120%"
            w="100%"
            mb={{ lgp: "24px", md: "24px", base: "16px" }}
          >
            {t("portfolioActivity.subTitle")}
          </Text>
        </Box>
        <Flex
          mt="24px"
          d={{
            lgp: "flex",
            md: isTabView ? "block" : "flex",
            base: "block",
          }}
          flexWrap="wrap"
        >
          {isTabView ? (
            <Box
              w={{
                lgp: "400px",
                md: isTabView ? "100%" : "50%",
                base: "100%",
              }}
              pr="24px"
              mb={{ md: "48px", base: "0", lgp: "0" }}
              className="portfolioActivityCalendar multiCalendar"
              flex="0 0 auto"
            >
              {" "}
              <MultiCalender
                componentName="viewModeDatepickerComp"
                eventBadgesList={portfolioActivityData}
                footerDetails={isFooterDetails}
                highlightWithRanges={highlightRange}
                minDate={isMinDate}
                maxDate={isMaxDate}
                showDisabledMonthNavigation={false}
                readonly
                inline
              />
            </Box>
          ) : (
            <Box
              w={{
                lgp: "400px",
                md: isTabView ? "100%" : "50%",
                base: "100%",
              }}
              pr={{ md: isTabView ? "0" : "24px", base: "0", lgp: "24px" }}
              mb={{ md: "48px", base: "0", lgp: "0" }}
              className={getClassName()}
              flex="0 0 auto"
            >
              <Calender
                componentName="viewModeDatepickerComp"
                eventBadgesList={portfolioActivityData}
                footerDetails={isFooterDetails}
                highlightWithRanges={highlightRange}
                minDate={isMinDate}
                maxDate={isMaxDate}
                showDisabledMonthNavigation={true}
                readonly
                isChange={() => getCalendarData("change")}
                isStartDate={isStartDate}
              />{" "}
            </Box>
          )}
          <Box
            w={{
              lgp: "100%",
              md: isTabView ? "100%" : "50%",
              base: "100%",
            }}
            flex={{ lgp: "1 0 0%" }}
            mt={{ lgp: "0", md: "0", base: "24px" }}
            className="portfolioActivityEventArea"
          >
            {" "}
            <PortfolioActivityBoxes
              data={isMonthData}
              isCallback={isCallback}
              maxHeight={activityEventHeight}
            />
          </Box>
        </Flex>
        <Text
          mt={{ base: "24px", md: "42px", lgp: "42px" }}
          textAlign="left"
          color="#C7C7C7"
          fontSize="14px"
          fontWeight="400"
          lineHeight="120%"
          mb={{ lgp: "40px", md: "40px", base: "0" }}
        >
          {t("portfolioActivity.activityNote")}
        </Text>
      </Box>
    </>
  )
}
