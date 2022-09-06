import { Box, Text } from "@chakra-ui/react"
import moment from "moment"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect, useState } from "react"

type MarketSpectrumDataProps = {
  marketSpectrumData: {
    start: {
      value: number
      date: string
    }
    end: {
      value: number
      date: string
    }
  }
}

export default function MarketIndicatorsChart({
  marketSpectrumData,
}: MarketSpectrumDataProps) {
  const { lang } = useTranslation()
  const [startRountPos, setStartRountPos] = useState({
    trackerLength: 0,
    start: {
      value: 0,
      date: "",
    },
    end: {
      value: 0,
      date: "",
    },
  })

  const convertPerc = (val: number) => {
    let val_perc = 0
    val = val > 1 ? 1 : val < -1 ? -1 : val
    if (val >= 0) {
      val_perc = (100 * (val + 1)) / 2
    } else {
      let p_val = (100 * Math.abs(val)) / 2
      val_perc = 50 - p_val
    }
    return val_perc
  }

  useEffect(() => {
    let start_val_perc = convertPerc(marketSpectrumData.start.value)
    let end_val_perc = convertPerc(marketSpectrumData.end.value)
    let new_obj = {
      trackerLength: Math.abs(start_val_perc - end_val_perc),
      start: {
        value: start_val_perc,
        date: moment(marketSpectrumData.start.date).format("MMM YYYY"),
      },
      end: {
        value: end_val_perc,
        date: moment(marketSpectrumData.end.date).format("MMM YYYY"),
      },
    }
    if (start_val_perc > end_val_perc) {
      new_obj.start.value = end_val_perc
      new_obj.start.date = moment(marketSpectrumData.end.date).format(
        "MMM YYYY",
      )
      new_obj.end.value = start_val_perc
      new_obj.end.date = moment(marketSpectrumData.start.date).format(
        "MMM YYYY",
      )
    }
    setStartRountPos(new_obj)
  }, [marketSpectrumData])

  return (
    <Box
      position="relative"
      my="25px"
      mx={{
        base: lang.includes("en") ? "40px" : "50px",
        md: lang.includes("en") ? "50px" : "65px",
      }}
    >
      <Box
        aria-label="Graph"
        h="4px"
        w="100%"
        bg="rgb(183,76,69)"
        bgGradient="linear-gradient(90deg, #b74c45 0%, #bfda88 100%)"
        pos="relative"
      >
        <Box
          bg="#fff"
          h="8px"
          w="8px"
          pos="absolute"
          transform="translate(-50%, -50%)"
          top="50%"
          left={`${startRountPos?.start?.value}%`}
          borderRadius="50%"
          zIndex="1"
          _before={{
            backgroundColor: "#ffffff63",
            borderRadius: "50%",
            content: '""',
            position: "absolute",
            height: "28px",
            width: "28px",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: "0",
          }}
          _after={{
            content: '""',
            position: "absolute",
            height: "10px",
            width: "1px",
            transform: "translateX(-50%)",
            left: "50%",
            top: "15px",
            backgroundColor: "#fff",
          }}
        >
          <Text
            textAlign="center"
            pos="absolute"
            fontSize={{ base: "14px", md: "18px" }}
            fontWeight="400"
            color="#fff"
            whiteSpace="nowrap"
            top="28px"
            left="50%"
            transform="translateX(-50%)"
          >
            {startRountPos?.start?.date}
          </Text>
        </Box>
        <Box
          zIndex="0"
          h="3px"
          bg="#BFC5F4"
          pos="absolute"
          top="50%"
          transform="translateY(-50%)"
          left={`${startRountPos?.start?.value}%`}
          w={`${startRountPos?.trackerLength}%`}
        />
        <Box
          bg="#fff"
          h="8px"
          w="8px"
          pos="absolute"
          transform="translate(-50%, -50%)"
          top="50%"
          left={`${startRountPos?.end?.value}%`}
          borderRadius="50%"
          zIndex="2"
          _before={{
            backgroundColor: "#ffffff63",
            borderRadius: "50%",
            content: '""',
            position: "absolute",
            height: "28px",
            width: "28px",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: "0",
          }}
          _after={{
            content: '""',
            position: "absolute",
            height: "10px",
            width: "1px",
            transform: "translateX(-50%)",
            left: "50%",
            top: "-15px",
            backgroundColor: "#fff",
          }}
        >
          <Text
            textAlign="center"
            pos="absolute"
            fontSize={{ base: "14px", md: "18px" }}
            fontWeight="400"
            color="#fff"
            whiteSpace="nowrap"
            bottom="28px"
            left="50%"
            transform="translateX(-50%)"
          >
            {startRountPos?.end?.date}
          </Text>
        </Box>
      </Box>
    </Box>
  )
}
