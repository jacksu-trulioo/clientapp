import { Box, Grid, GridItem, Heading, Text } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"

import { PolygonDownIcon, PolygonIcon } from "~/components"

type tableHeader = {
  name: string
  size: number
  style: {
    textAlign:
      | "center"
      | "end"
      | "justify"
      | "left"
      | "match-parent"
      | "right"
      | "start"
    fontWeight?: string
    fontSize?: string
    lineHeight?: string
    color?: string
    paddingRight?: string
  }
}
type data = {
  size: number | undefined
  value: string | undefined
  isArrow?: Boolean
  arrowType?: string
  isRtl?: boolean
  style?: {
    textAlign?:
      | "center"
      | "end"
      | "justify"
      | "left"
      | "match-parent"
      | "right"
      | "start"
    fontWeight?: string
    fontSize?: string | { base: string; md: string; lgp: string }
    fontFamily?: string
    lineHeight?: string
    color?: string
    paddingRight?: string
    whiteSpace?:
      | "-moz-pre-wrap"
      | "break-spaces"
      | "normal"
      | "nowrap"
      | "pre"
      | "pre-line"
      | "pre-wrap"
    overflow?: string
    textOverflow?: string
  }
}
type tableBody = {
  name?: string
  data: data[]
  style?: {
    textAlign: string
    fontWeight: string
    fontSize: string
    fontFamily: string
    lineHeight: string
    color: string
    paddingRight: string
  }
}

type DesktopTable = {
  isHeader?: boolean
  isGrid?: boolean
  isGap?: boolean
  tableGridSize: number
  tableHeader?: tableHeader[]
  tableBody: tableBody[]
  headerPadding?: string
}

const DesktopTableVarirantTwo = ({
  isGrid,
  isGap,
  isHeader,
  tableHeader,
  tableGridSize,
  tableBody,
  headerPadding,
}: DesktopTable) => {
  const { lang } = useTranslation("profitAndLoss")
  return (
    <>
      {isHeader ? (
        <Grid
          templateColumns={{
            base: "repeat(2, 1fr)",
            lgp: `repeat(${tableGridSize}, 1fr)`,
          }}
          gap={{ base: "0", md: "0", lgp: isGap == true ? "0" : "15px" }}
          style={{ padding: headerPadding ? headerPadding : "8px 16px" }}
        >
          {tableHeader?.map(({ name, size, style }, i) => (
            <GridItem key={i} colSpan={size} pe={style.paddingRight}>
              <Heading
                textAlign={style.textAlign}
                fontSize="14px"
                color="gray.400"
                fontWeight="400"
              >
                {name}
              </Heading>
            </GridItem>
          ))}
        </Grid>
      ) : (
        false
      )}
      {tableBody?.map(({ data }, j) => (
        <Box
          bg="gray.800"
          _odd={{ backgroundColor: "gray.850" }}
          mb="2px"
          borderRadius="2px"
          padding={{ lgp: "16px", md: "0", base: "0" }}
          key={j}
        >
          <Grid
            aria-label={data[0].value}
            role={"grid"}
            templateColumns={{
              base: "repeat(2, 1fr)",
              lgp: `repeat(${tableGridSize}, 1fr)`,
            }}
            gap={{ base: "0", md: "0", lgp: isGap == true ? "0" : "15px" }}
            d={{
              base: "flex",
              md: "flex",
              lgp: isGrid == true ? "grid" : "flex",
            }}
            justifyContent={{ base: "space-between", md: "space-between" }}
            p={{ base: "16px 16px", md: "16px 10px", lgp: "0" }}
            alignItems="center"
          >
            {data?.map(
              (
                { size, value, style, isArrow, arrowType, isRtl },
                i: number,
              ) => (
                <GridItem colSpan={size} key={i}>
                  <Text
                    fontSize={style?.fontSize}
                    fontWeight={style?.fontWeight}
                    color={style?.color}
                    lineHeight={style?.lineHeight}
                    textAlign={style?.textAlign}
                    whiteSpace={style?.whiteSpace}
                    overflow={style?.overflow}
                    textOverflow={style?.textOverflow}
                    style={{
                      direction:
                        lang.includes("ar") && !isRtl ? "ltr" : "inherit",
                    }}
                  >
                    {isArrow ? (
                      arrowType == "downwards" ? (
                        <PolygonDownIcon
                          width={"12px"}
                          height={"12px"}
                          direction="bottom"
                        />
                      ) : arrowType == "upwards" ? (
                        <PolygonIcon
                          width={"12px"}
                          height={"12px"}
                          direction="bottom"
                          paddingBottom="3px"
                        />
                      ) : (
                        false
                      )
                    ) : (
                      false
                    )}{" "}
                    {value}
                  </Text>
                </GridItem>
              ),
            )}
          </Grid>
        </Box>
      ))}
    </>
  )
}

export default DesktopTableVarirantTwo
