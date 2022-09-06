import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/accordion"
import { Box, Divider, Flex, Heading, Text } from "@chakra-ui/layout"
import moment from "moment"
import useTranslation from "next-translate/useTranslation"
import { Fragment, useEffect } from "react"

import { ChakraUIMarkDownRenderer } from "~/components"
import { useUser } from "~/hooks/useUser"
import { Article } from "~/services/mytfo/types"
import { readFeatureArticleTime } from "~/utils/googleEventsClient"
import { clientEvent } from "~/utils/gtag"

type ArticlePropsType = {
  article: Article
}

const ArticleView = ({ article }: ArticlePropsType) => {
  const { t, lang } = useTranslation("insights")
  const { user } = useUser()

  useEffect(() => {
    const openTime = moment(new Date())
    let title = article?.title as string

    return () => {
      moment.locale(lang.includes("en") ? "en" : "ar")
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        readFeatureArticleTime,
        title,
        duration.asSeconds().toString(),
        user?.mandateId as string,
        user?.email as string,
      )
    }
  }, [])

  const renderDate = () => {
    moment.locale("en")

    return `${
      article.publishDate
        ? moment(article.publishDate).format("MMM DD YYYY")
        : ""
    } | ${article?.estimatedDuration}`
  }

  return (
    <Fragment>
      <Text mb={{ base: 4, md: 6 }} color="secondary.500" fontWeight="bold">
        {t(`tag.Article`)}
      </Text>
      <Heading size="lg" mb={{ base: 10, md: "8px" }}>
        {article?.title}
      </Heading>
      <Text
        aria-label="publishDateAndDuration"
        color="gray.400"
        fontSize="xs"
        mb={{ base: 10, md: "8px" }}
        fontFamily="'Gotham'"
      >
        {renderDate()}
      </Text>

      <Text fontSize="xl" color="gray.500" mb="10">
        <ChakraUIMarkDownRenderer>
          {article?.description || ""}
        </ChakraUIMarkDownRenderer>
      </Text>

      <Divider borderColor="gray.800" mb="12" border="1px" />
      <Accordion allowToggle w="full" mb="12">
        {article?.contents &&
          article?.contents.map((content) => (
            <AccordionItem
              aria-label="content"
              borderBottom="1px solid"
              borderBottomColor="gray.800"
              mb="0"
              key={content.title}
            >
              <h2>
                <AccordionButton
                  bg="transparent"
                  p="0"
                  _hover={{ bg: "transparent" }}
                >
                  <Flex
                    aria-label="Accordion"
                    role={"button"}
                    justifyContent="space-between"
                    py="6"
                    width="full"
                  >
                    <Text textAlign="start" fontSize="xl">
                      {content.title}
                    </Text>
                    <AccordionIcon color="primary.500" />
                  </Flex>
                </AccordionButton>
              </h2>

              <AccordionPanel bg="transparent">
                <ChakraUIMarkDownRenderer>
                  {content.description}
                </ChakraUIMarkDownRenderer>
              </AccordionPanel>
            </AccordionItem>
          ))}
      </Accordion>
      {article?.disclaimer && (
        <Box mb="12">
          <Heading as="h3" fontSize="2xl" mb="8" fontStyle="italic">
            {t("label.disclaimer")}
          </Heading>
          <Text fontSize="xs" color="gray.500">
            <ChakraUIMarkDownRenderer>
              {article.disclaimer}
            </ChakraUIMarkDownRenderer>
          </Text>
        </Box>
      )}
    </Fragment>
  )
}

export default ArticleView
