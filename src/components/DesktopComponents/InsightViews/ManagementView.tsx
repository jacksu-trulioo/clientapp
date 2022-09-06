import { Box, Heading, Stack, Text } from "@chakra-ui/layout"
import moment from "moment"
import useTranslation from "next-translate/useTranslation"
import { Fragment, useEffect } from "react"

import { ChakraUIMarkDownRenderer } from "~/components"
import { useUser } from "~/hooks/useUser"
import { ManagementView as ManagementViewType } from "~/services/mytfo/types"
import { readFeatureArticleTime } from "~/utils/googleEventsClient"
import { clientEvent } from "~/utils/gtag"

type ManagementViewPropsType = {
  managementView: ManagementViewType
}

const ManagementView = ({ managementView }: ManagementViewPropsType) => {
  const { t, lang } = useTranslation("insights")
  const { user } = useUser()
  useEffect(() => {
    const openTime = moment(new Date())
    let title = managementView?.title as string
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
      managementView.publishDate
        ? moment(managementView.publishDate).format("MMM DD YYYY")
        : ""
    } | ${managementView?.estimatedDuration}`
  }

  return (
    <Fragment>
      <Text mb={{ base: 4, md: "8px" }} color="secondary.500" fontWeight="bold">
        {t(`tag.ManagementView`)}
      </Text>
      <Heading fontSize="30px" mb={{ base: 10, md: "8px" }}>
        {managementView?.title}
      </Heading>
      <Text
        color="gray.400"
        fontSize="xs"
        mb={{ base: 10, md: "8px" }}
        fontFamily="'Gotham'"
      >
        {renderDate()}
      </Text>
      <Text fontSize="lg" color="gray.500" mb="10">
        <ChakraUIMarkDownRenderer>
          {managementView?.description || ""}
        </ChakraUIMarkDownRenderer>
      </Text>
      {managementView?.video && (
        <Box position="relative" height="50vw" maxH="558px" mb="10">
          <iframe
            key={managementView?.video}
            src={managementView?.video}
            frameBorder="0"
            width="100%"
            height="100%"
            allowFullScreen
            title={managementView?.title}
          />
        </Box>
      )}
      {/* management view content section code starts from here */}
      {managementView?.contents &&
        managementView?.contents.map((content) => (
          <Stack
            justifyContent="space-between"
            py="4"
            width="full"
            key={content.title}
            _last={{
              borderBottom: "2px",
              borderColor: "gray.800",
              pb: "12",
            }}
            _first={{ pt: "8" }}
          >
            <Heading as="h3" fontSize="2xl" mb="4">
              {content.title}
            </Heading>
            <ChakraUIMarkDownRenderer>
              {content.description}
            </ChakraUIMarkDownRenderer>
          </Stack>
        ))}
      {managementView?.disclaimer && (
        <Box mb="12">
          <Heading as="h3" fontSize="2xl" mb="8" fontStyle="italic">
            {t("label.disclaimer")}
          </Heading>
          <Text fontSize="xs" color="gray.500">
            <ChakraUIMarkDownRenderer>
              {managementView.disclaimer}
            </ChakraUIMarkDownRenderer>
          </Text>
        </Box>
      )}
    </Fragment>
  )
}

export default ManagementView
