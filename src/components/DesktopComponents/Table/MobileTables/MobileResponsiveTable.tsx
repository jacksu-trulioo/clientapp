import { Box, Grid, GridItem, Text } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import { Fragment } from "react"

import { PolygonDownIcon, PolygonIcon } from "~/components"
type MobileTable = {
  borderRadius?: string
  bgColor?: string
  index?: number
  tableItem: tableItem[]
  header?: string
  isHeader?: boolean
  isRowOddCol?: boolean
  onClickRedirect?: (path: string, dealId?: number | string) => void
  id?: number
  isCustomBgColor?: boolean
}
type tableItem = {
  key: string
  style?: {
    color?: string
    fontSize?: string
    fontWeight?: string
    lineHeight?: string
    textAlign?: string
    paddingBottom?: string
  }
  value?: string
  valueStyle?: {
    color?: string
    fontSize?: string
    fontWeight?: string
    lineHeight?: string
    textAlign?: string
  }
  isArrow?: boolean
  arrowType?: string
}
const MobileResponsiveTable = ({
  borderRadius,
  bgColor,
  index,
  tableItem,
  header,
  isHeader,
  isRowOddCol,
  id,
  onClickRedirect,
  isCustomBgColor,
}: MobileTable) => {
  const { lang } = useTranslation()
  return (
    <Fragment>
      <Box
        aria-label={`Deal Row ${(index || 0) + 1}`}
        role={"row"}
        fontSize="14px"
        bg={isCustomBgColor ? bgColor : "gray.800"}
        _odd={
          !isCustomBgColor
            ? { backgroundColor: bgColor ? bgColor : "gray.850" }
            : undefined
        }
        _first={
          !isCustomBgColor
            ? {
                bgColor: "gray.850",
              }
            : undefined
        }
        borderRadius={borderRadius ? borderRadius : "0"}
        mb="2px"
        onClick={() => {
          if (onClickRedirect) {
            onClickRedirect(`/client/investment-detail/${id}`)
          }
        }}
      >
        {isHeader ? (
          <Text
            aria-label="Deal Name"
            role={"cell"}
            fontWeight="400"
            fontSize="14px"
            lineHeight="120%"
            color="contrast.200"
            textAlign="center"
            p="16px"
          >
            {header}
          </Text>
        ) : (
          false
        )}
        {tableItem?.map(
          ({ key, value, style, isArrow, arrowType, valueStyle }, i) => (
            <Grid
              key={i}
              p="16px"
              _odd={{ backgroundColor: isRowOddCol ? "gray.800" : "none" }}
              templateColumns="repeat(2, 1fr)"
            >
              <GridItem
                aria-label="SPV Table Header"
                role={"group"}
                style={style as {}}
                color={style?.color}
                w="100%"
              >
                {key}
              </GridItem>
              <GridItem
                aria-label={key}
                role={"cell"}
                color={valueStyle?.color}
                textAlign="end"
                w="100%"
                style={{
                  direction: "ltr",
                  textAlign: lang.includes("ar") ? "left" : "end",
                  justifyContent: lang.includes("ar")
                    ? "flex-start"
                    : "flex-end",
                }}
                fontSize={valueStyle?.fontSize}
                fontWeight={valueStyle?.fontWeight}
                display="flex"
                alignItems="center"
              >
                {isArrow ? (
                  arrowType == "downwards" ? (
                    <PolygonDownIcon
                      width={"12px"}
                      height={"12px"}
                      style={{
                        marginRight: "5px",
                      }}
                    />
                  ) : arrowType == "upwards" ? (
                    <PolygonIcon
                      width={"12px"}
                      height={"12px"}
                      style={{
                        marginRight: "5px",
                      }}
                    />
                  ) : (
                    false
                  )
                ) : (
                  false
                )}
                {value}
              </GridItem>
            </Grid>
          ),
        )}
      </Box>
    </Fragment>
  )
}
export default MobileResponsiveTable
