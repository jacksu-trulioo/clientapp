import { useBreakpointValue } from "@chakra-ui/media-query"
import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Image,
  Link,
  ListItem,
  OrderedList,
  Spacer,
  Text,
} from "@chakra-ui/react"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { InvestmentStages } from "~/components"

interface stageProps {
  title1: string
  title2: string
  title3: string
  title4: string
  period1: string
  period2: string
  period3: string
  period4: string
  para1: string
  para2: string
  para3: string
  para4: string
}

const Stage = ({
  title1,
  title2,
  title3,
  title4,
  period1,
  period2,
  period3,
  period4,
  para1,
  para2,
  para3,
  para4,
}: stageProps) => {
  const { t, lang } = useTranslation("illiquidStages")
  const isDesktopView = useBreakpointValue({
    base: false,
    lgp: true,
    md: false,
  })
  const isMobileView = useBreakpointValue({ base: true, md: false, lgp: false })
  const isTabView = useBreakpointValue({ base: false, md: true, lgp: false })
  return (
    <Box mb="80px">
      <Box color="#fff" mb="80px">
        <Box mb="24px">
          <Box
            as="nav"
            fontStyle="normal"
            mb={{ base: "0", md: "0px", lgp: "0" }}
            fontSize="12px"
            fontWeight="400"
            d={{ base: "none", md: "block", lgp: "block" }}
          >
            <OrderedList m="8px 0">
              <ListItem display="inline-flex" alignItems="center">
                <Link
                  onClick={() => router.push("/client/portfolio-summary")}
                  color="primary.500"
                  _focus={{
                    boxShadow: "none",
                  }}
                >
                  {t(`common:nav.links.portfolioSummary`)}
                </Link>
                <Box as="span" marginInline="0.5rem">
                  /
                </Box>
              </ListItem>
              <ListItem
                display="inline-flex"
                alignItems="center"
                _hover={{ textDecoration: "underline" }}
              >
                {t("page")}
              </ListItem>
            </OrderedList>
          </Box>
        </Box>
        <Box>
          <Box as="h4" color="#fff" fontWeight="400" mb="40px" fontSize="30px">
            {t("page")}
          </Box>
          <Container
            fontSize="18px"
            color="#fff"
            fontWeight="400"
            margin="0"
            p="0"
            maxWidth={{ lgp: "100%", md: "100%", base: "100%" }}
          >
            <Text mb="24px">{t("articles.article1")}</Text>
            <Text mb="24px">{t("articles.article2")}</Text>
            <Text mb="24px">{t("articles.article3")}</Text>
          </Container>
        </Box>
      </Box>
      <Box>
        <Box
          alignItems="center"
          mb="16px"
          display={{ lgp: "flex", md: "flex", base: "flex" }}
          style={{
            direction: lang.includes("ar") ? "rtl" : "ltr",
            gap: "8px",
          }}
        >
          <Text
            color="#fff"
            fontWeight="400"
            fontSize={{ lgp: "22px", md: "18px", base: "18px" }}
            fontStyle="normal"
          >
            {t("investmentStages.title")}
          </Text>
          <Spacer />
          <Box display="flex" alignItems="center">
            <Box d="flex" alignItems="center" me="12px">
              {" "}
              <Box
                borderRadius="50%"
                w="14px"
                h="14px"
                bg="primary.500"
                me="8px"
              />
              <Text color="primary.500" fontSize="18px" fontWeight="400">
                {t("investmentStages.tfo")}
              </Text>{" "}
            </Box>
            <Box d="flex" alignItems="center">
              <Box
                borderRadius="50%"
                w="14px"
                h="14px"
                bg="vodka.200"
                me="8px"
              />
              <Text color="vodka.200" fontSize="18px" fontWeight="400">
                {t("investmentStages.general")}
              </Text>
            </Box>
          </Box>
        </Box>
        {isDesktopView ? (
          <InvestmentStages w="100%" h="100%" lang={lang} />
        ) : (
          false
        )}
        {isMobileView ? (
          <>
            <Box>
              {lang.includes("en") ? (
                <Image src="/images/1-2-3-stagesEng.png" alt="stage 1-2-3" />
              ) : (
                <Image src="/images/1-2-3-stagesArbic.png" alt="stage 1-2-3" />
              )}
            </Box>
            <Box mt="8px">
              {lang.includes("en") ? (
                <Image src="/images/4-stagesEng.png" alt="stage 4" />
              ) : (
                <Image src="/images/4-stagesArbic.png" alt="stage 4" />
              )}
            </Box>
          </>
        ) : (
          false
        )}
        {isTabView ? <InvestmentStages w="100%" h="100%" lang={lang} /> : false}
      </Box>
      <Grid
        templateColumns={{
          lgp: "repeat(2, 1fr)",
          base: "repeat(1, 1fr)",
          md: "repeat(1, 1fr)",
        }}
        gap={10}
        mt="48px"
      >
        <GridItem w="100%" color="#fff">
          <Flex>
            <Box
              w="40px"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              p="15px"
              borderRadius="50%"
              h="40px"
              textAlign="center"
              bg="#494949"
              color="#fff"
              fontSize="24px"
              fontWeight="400"
              mr="10px"
            >
              1
            </Box>
            <Box
              style={{
                marginTop: lang.includes("ar") ? 0 : "6px",
              }}
            >
              <Box d="flex">
                <Box as="h4" fontSize="22px" fontWeight="400">
                  {title1}{" "}
                </Box>
                <Box
                  as="span"
                  fontSize="20px"
                  color="#c7c7c7"
                  ml="10px"
                  fontWeight="400"
                >
                  {period1}
                </Box>
              </Box>
              <Text mt="16px" fontSize="18px" fontWeight="400">
                {para1}
              </Text>
            </Box>
          </Flex>
        </GridItem>
        <GridItem w="100%" color="#fff">
          <Flex>
            <Box
              w="40px"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              p="15px"
              borderRadius="50%"
              h="40px"
              textAlign="center"
              bg="#829195"
              color="#fff"
              fontSize="24px"
              fontWeight="400"
              marginRight="10px"
            >
              2
            </Box>
            <Box
              style={{
                marginTop: lang.includes("ar") ? 0 : "6px",
              }}
            >
              <Box d="flex">
                <Box as="h4" fontSize="22px" fontWeight="400">
                  {title2}{" "}
                </Box>
                <Box as="span" fontSize="20px" color="#c7c7c7" ml="10px">
                  {period2}
                </Box>
              </Box>
              <Text mt="16px" fontSize="18px" fontWeight="400">
                {para2}
              </Text>
            </Box>
          </Flex>
        </GridItem>
      </Grid>
      <Grid
        templateColumns={{
          lgp: "repeat(2, 1fr)",
          base: "repeat(1, 1fr)",
          md: "repeat(1, 1fr)",
        }}
        gap={10}
        mt="48px"
      >
        <GridItem w="100%" color="#fff">
          <Flex>
            <Box
              as="span"
              w="40px"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              p="15px"
              borderRadius="50%"
              h="40px"
              textAlign="center"
              bg="#7c6a45"
              color="#fff"
              fontSize="24px"
              fontWeight="400"
              marginRight="10px"
            >
              3
            </Box>
            <Box
              style={{
                marginTop: lang.includes("ar") ? 0 : "6px",
              }}
            >
              <Box d="flex">
                <Box as="h4" fontSize="22px" fontWeight="400">
                  {title3}{" "}
                </Box>
                <Box as="span" fontSize="20px" color="#c7c7c7" ml="10px">
                  {period3}
                </Box>
              </Box>
              <Text mt="16px" fontSize="18px" fontWeight="400">
                {para3}
              </Text>
            </Box>
          </Flex>
        </GridItem>
        <GridItem w="100%" color="#fff">
          <Flex>
            <Box
              as="span"
              w="40px"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              p="15px"
              borderRadius="50%"
              h="40px"
              textAlign="center"
              bg="#3b2f42"
              color="#fff"
              fontSize="24px"
              fontWeight="400"
              marginRight="10px"
            >
              4
            </Box>
            <Box
              style={{
                marginTop: lang.includes("ar") ? 0 : "6px",
              }}
            >
              <Box d="flex" justifyContent="flex-start" alignItems="center">
                <Box
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  as="h4"
                  fontSize="22px"
                  fontWeight="400"
                  width={{ base: "149px", lgp: "auto", md: "auto" }}
                >
                  {title4}
                </Box>
                <Box
                  as="span"
                  fontSize="20px"
                  color="#c7c7c7"
                  ml="10px"
                  justifyContent="center"
                  alignItems="center"
                  textAlign="center"
                  alignContent="center"
                >
                  {period4}
                </Box>
              </Box>
              <Text mt="16px" fontSize="18px" fontWeight="400">
                {para4}
              </Text>
            </Box>
          </Flex>
        </GridItem>
      </Grid>
    </Box>
  )
}
export default Stage
