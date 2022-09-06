import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/accordion"
import { Button } from "@chakra-ui/button"
import { useDisclosure } from "@chakra-ui/hooks"
import {
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/media-query"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import {
  Card,
  CardContent,
  ChatIcon,
  ContactUsModal,
  EmailIcon,
  Layout,
  PhoneIcon,
} from "~/components"
import MeetingChatIcon from "~/components/Icon/MeetingChatIcon"
import siteConfig from "~/config"
import {
  FAQ,
  RelationshipManager,
  UserQualificationStatus,
  UserStatuses,
} from "~/services/mytfo/types"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

interface ContactClientServiceCardProps {
  onClick: () => void
}

function ScheduleMeetingCard() {
  const { t } = useTranslation("support")
  const router = useRouter()

  const handleClick = (e: React.SyntheticEvent) => {
    e.preventDefault()
    router.push("/schedule-meeting")
  }

  return (
    <Card
      bgColor="gunmetal.500"
      flex="1 0 300px"
      as="button"
      onClick={handleClick}
      aria-label={t("card.scheduleMeeting.title")}
    >
      <CardContent bgColor="gunmetal">
        <HStack alignItems="flex-start" spacing="6">
          <MeetingChatIcon w="6" h="6" color="primary.500" />
          <VStack spacing="1" alignItems="flex-start">
            <Text
              fontSize={{ base: "md", md: "lg" }}
              textAlign="start"
              lineHeight="5"
            >
              {t("card.scheduleMeeting.title")}
            </Text>
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              textAlign="start"
              color="gray.500"
            >
              {t("card.scheduleMeeting.description")}
            </Text>
          </VStack>
        </HStack>
      </CardContent>
    </Card>
  )
}
function ContactClientServiceCard(
  props: React.PropsWithChildren<ContactClientServiceCardProps>,
) {
  const { onClick } = props
  const { t } = useTranslation("support")
  return (
    <Card
      bgColor="gunmetal.500"
      flex="1 0 300px"
      as="button"
      aria-label={t("card.contactClientService.title")}
      onClick={onClick}
      ml={{ base: 0, md: 8, lg: 8 }}
      mt={{ base: 8, md: 0, lg: 0 }}
    >
      <CardContent bgColor="gunmetal">
        <HStack alignItems="flex-start" spacing="6">
          <ChatIcon w="6" h="6" color="primary.500" />
          <VStack spacing="1" alignItems="flex-start">
            <Text
              fontSize={{ base: "md", md: "lg" }}
              textAlign="start"
              lineHeight="5"
            >
              {t("card.contactClientService.title")}
            </Text>
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              textAlign="start"
              color="gray.500"
            >
              {t("card.contactClientService.description")}
            </Text>
          </VStack>
        </HStack>
      </CardContent>
    </Card>
  )
}
function TalkToExpertsCard() {
  const { t } = useTranslation("support")
  const router = useRouter()

  const handleClick = (e: React.SyntheticEvent) => {
    e.preventDefault()
    router.push("/schedule-meeting")
  }

  return (
    <Card
      bgColor="gunmetal.500"
      flex="1 0 300px"
      as="button"
      onClick={handleClick}
      aria-label={t("card.talkWithExperts.title")}
      mt={{ base: 8, md: 0, lg: 0 }}
    >
      <CardContent bgColor="gunmetal">
        <HStack alignItems="flex-start" spacing="6">
          <PhoneIcon w="6" h="6" color="primary.500" />
          <VStack spacing="1" alignItems="flex-start">
            <Text
              fontSize={{ base: "md", md: "lg" }}
              textAlign="start"
              lineHeight="5"
            >
              {t("card.talkWithExperts.title")}
            </Text>
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              textAlign="start"
              color="gray.500"
            >
              {t("card.talkWithExperts.description")}
            </Text>
          </VStack>
        </HStack>
      </CardContent>
    </Card>
  )
}

function SupportScreen() {
  const { t, lang } = useTranslation("support")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { inquiryEmail } = siteConfig

  const isDesktopView = useBreakpointValue({ base: false, md: true })

  const contacts = [
    {
      labelText: t("text.email"),
      icon: <EmailIcon w="4" h="4" />,
      href: `mailto:${inquiryEmail}`,
      value: inquiryEmail,
    },
  ]

  const { data: faqsData, error: faqsError } = useSWR<FAQ[]>(
    ["/api/portfolio/faqs", lang],
    (url, lang) =>
      fetch(url, {
        headers: {
          "Accept-Language": lang,
        },
      }).then((res) => res.json()),
  )

  const { data: statusData, error: statusError } =
    useSWR<UserStatuses>("/api/user/status")

  const { data: relationshipManagerData, error: relationshipManagerError } =
    useSWR<RelationshipManager>("/api/user/relationship-manager")

  const isLoading =
    (!faqsData && !faqsError) ||
    (!statusData && !statusError) ||
    (!relationshipManagerData && !relationshipManagerError)
  const error = faqsError || statusError || relationshipManagerError

  if (error || isLoading) return null

  return (
    <Layout title={t("page.title")} description={t("page.description")}>
      <Container as="section" maxW="full" px="0" mt={{ base: 6, md: 0 }}>
        {/* Header section */}
        <Heading
          mb={{ base: 8, md: 4 }}
          textAlign={{ base: "center", md: "start" }}
        >
          {t("heading")}
        </Heading>

        <Text
          as="h3"
          fontSize="xl"
          color="gray.500"
          mb={{ base: 8, md: 10 }}
          textAlign={{ base: "center", md: "start" }}
        >
          {t("subheading")}
        </Text>
        <Grid
          templateColumns={`repeat(${isDesktopView ? 2 : 1}, 1fr)`}
          width="full"
          mb={{ base: 8, md: 10 }}
        >
          {statusData?.status === UserQualificationStatus.Verified &&
          relationshipManagerData?.assigned ? (
            <ScheduleMeetingCard />
          ) : (
            <TalkToExpertsCard />
          )}
          <ContactClientServiceCard onClick={onOpen} />
        </Grid>

        <Divider color="gray.800" mb={{ base: 8, md: 14 }} />

        {/* FAQs section */}
        <Text fontSize={{ base: "xl", md: "2xl" }} mb={{ base: 8, md: 10 }}>
          {t("headings.faqs")}
        </Text>

        <Accordion
          defaultIndex={[0]}
          allowToggle
          w="full"
          mb={{ base: 8, md: 14 }}
        >
          {faqsData &&
            faqsData
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((faq) => (
                <AccordionItem
                  borderBottom="2px solid"
                  borderBottomColor="gray.800"
                  mb="0"
                  key={faq.id}
                >
                  <h2>
                    <AccordionButton
                      bg="transparent"
                      p="0"
                      _hover={{ bg: "transparent" }}
                    >
                      <Flex justifyContent="space-between" py="6" width="full">
                        <Text textAlign="start">{faq.title}</Text>
                        <AccordionIcon />
                      </Flex>
                    </AccordionButton>
                  </h2>
                  <AccordionPanel bg="transparent" px="0">
                    <Text fontSize="sm" color="gray.500" textAlign="start">
                      {faq.description}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
              ))}
        </Accordion>

        <ContactUsModal onClose={onClose} isOpen={isOpen} />

        {/* Contacts section */}
        <Text fontSize={{ base: "xl", md: "2xl" }} mb={{ base: 8, md: 10 }}>
          {t("headings.contacts")}
        </Text>
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          mb="12"
          sx={{
            "& > div": {
              borderBottom: "1px solid",
              borderBottomColor: "gray.700",
            },
            ...(isDesktopView && {
              "div:nth-last-of-type(2)": {
                borderBottom: "none",
              },
              "div:nth-last-of-type(1)": {
                borderBottom: "none",
              },
              "div:nth-of-type(odd)": {
                marginEnd: "3",
              },
              "div:nth-of-type(even)": {
                marginStart: "3",
                "&:before": {
                  content: '""',
                  position: "absolute",
                  top: "1",
                  insetStart: lang === "ar" ? "0" : "-3",
                  insetEnd: lang === "ar" ? "-3" : "0",
                  bottom: "1",
                  borderStart: "1px solid",
                  borderStartColor: "gray.700",
                },
              },
            }),
          }}
        >
          {contacts.map((item) => {
            return (
              <VStack
                alignItems="flex-start"
                textAlign="start"
                position="relative"
                py="4"
                key={item.labelText}
              >
                <HStack color="gray.500">
                  {item.icon}
                  <Text> {item.labelText} </Text>
                </HStack>
                <Button
                  as="a"
                  variant="link"
                  colorScheme="primary"
                  href={item.href}
                >
                  {item.value}
                </Button>
              </VStack>
            )
          })}
        </SimpleGrid>
      </Container>
    </Layout>
  )
}

export default withPageAuthRequired(SupportScreen)
