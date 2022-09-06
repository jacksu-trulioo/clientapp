import {
  Box,
  Circle,
  Divider,
  Flex,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/layout"
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  UseModalProps,
} from "@chakra-ui/modal"
import { Button, useBreakpointValue } from "@chakra-ui/react"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment } from "react"
import useSWR from "swr"

import {
  Card,
  CardContent,
  ChatIcon,
  EmailIcon,
  MeetingChatIcon,
  PhoneIcon,
} from "~/components"
import siteConfig from "~/config"
import { RelationshipManager } from "~/services/mytfo/types"

interface TalkToExpertsCardInterface {
  expertName: string
}
function TalkToExpertsCard(props: TalkToExpertsCardInterface) {
  const { expertName } = props
  const { t } = useTranslation("support")
  const router = useRouter()
  const isDesktopView = useBreakpointValue({ base: false, md: true })
  const handleClick = (e: React.SyntheticEvent) => {
    e.preventDefault()
    router.push("/schedule-meeting")
  }

  return (
    <Card
      bgColor="gunmetal.500"
      as="button"
      onClick={handleClick}
      minW={isDesktopView ? "350px" : "310px"}
      aria-label={t("card.talkWithExperts.title")}
    >
      <CardContent bgColor="gunmetal">
        <HStack alignItems="center" spacing="6">
          <PhoneIcon w="6" h="6" color="primary.500" />
          <VStack alignItems="baseline" spacing="2">
            {expertName ? (
              <>
                <Text fontSize="16px" lineHeight="5" color="contrast.200">
                  {t("card.talkWithRelationshipMananger.title")}
                  {` ${expertName}`}
                </Text>
                <Text fontSize="12px" color="gray.500">
                  {t("card.talkWithRelationshipMananger.description")}
                </Text>
              </>
            ) : (
              <>
                <Text fontSize="16px" lineHeight="5" color="contrast.200">
                  {t("card.talkWithExperts.title")}
                </Text>
                <Text fontSize="12px" color="gray.500">
                  {t("card.talkWithExperts.description")}
                </Text>
              </>
            )}
          </VStack>
        </HStack>
      </CardContent>
    </Card>
  )
}

interface ContactRelationshipManagerCardInterface {
  expertName: string
  expertEmail: string
}

function ContactRelationshipManagerCard(
  props: ContactRelationshipManagerCardInterface,
) {
  const { expertName, expertEmail } = props
  const { t } = useTranslation("support")
  const router = useRouter()
  const isDesktopView = useBreakpointValue({ base: false, md: true })
  const handleClick = (e: React.SyntheticEvent) => {
    e.preventDefault()
    router.push(`mailto:${expertEmail}`)
  }

  return (
    <Card
      bgColor="gunmetal.500"
      as="button"
      onClick={handleClick}
      minW={isDesktopView ? "350px" : "310px"}
      aria-label={t("card.talkWithExperts.title")}
      mb="4"
    >
      <CardContent bgColor="gunmetal">
        <HStack alignItems="center" spacing="6">
          <ChatIcon w="6" h="6" color="primary.500" />
          <VStack alignItems="baseline" spacing="2">
            <Text fontSize="16px" lineHeight="5" color="contrast.200">
              {t("card.contactRelationshipManager.title")} {` ${expertName}`}
            </Text>
            <Text fontSize="12px" color="gray.500" w="full" textAlign="start">
              {t("card.contactRelationshipManager.description")}
            </Text>
          </VStack>
        </HStack>
      </CardContent>
    </Card>
  )
}

function RelationshipManagerCard(props: Pick<RelationshipManager, "manager">) {
  const { t } = useTranslation("support")
  const { manager } = props
  return (
    <>
      <HStack
        spacing="16px"
        minW={{ base: "350px", md: "310px" }}
        alignItems="center"
        justifyContent="space-between"
      >
        <VStack alignItems="baseline" spacing="2">
          <Text color="gray.400" fontSize={{ base: "sm", md: "xs" }}>
            {t("modal.getSupport.yourFinancialAdvisor")}
          </Text>
          <Text color="white" fontSize={{ base: "md", md: "sm" }}>
            {`${manager?.firstName} ${manager?.lastName}`}
          </Text>
        </VStack>
        <Circle
          size={{ base: "12", md: "9" }}
          position="relative"
          _before={{
            content: '""',
            bg: "secondary.800",
            opacity: "0.2",
            position: "absolute",
            width: "full",
            height: "full",
            borderRadius: "full",
          }}
        >
          <MeetingChatIcon
            color="secondary.500"
            w={{ base: "7", md: "5" }}
            h={{ base: "7", md: "5" }}
          />
        </Circle>
      </HStack>
    </>
  )
}

const GetSupportPopUp = (props: UseModalProps) => {
  const { t } = useTranslation("support")
  const isDesktopView = useBreakpointValue({ base: false, md: true })
  const isMobileView = !isDesktopView

  const { inquiryEmail } = siteConfig
  const contacts = [
    {
      labelText: t("text.email"),
      icon: <EmailIcon w="4" h="4" />,
      href: `mailto:${inquiryEmail}`,
      value: inquiryEmail,
    },
  ]
  const { data: rmData, error: rmError } = useSWR<RelationshipManager>(
    "/api/user/relationship-manager",
  )

  const rmAssigned = rmData?.assigned && !rmError

  const renderSupportModal = () => {
    return (
      <>
        <Box>
          <Text fontSize="30px" color="contrast.200" mb="4">
            {t("modal.getSupport.title")}
          </Text>
          <Text color="gray.500" fontSize="16px" fontWeight="400">
            {t("modal.getSupport.description")}
          </Text>
        </Box>
        <Box>
          {rmAssigned ? (
            <>
              <Text
                color="contrast.200"
                fontSize="16px"
                fontWeight="400"
                mb={8}
              >
                {t("modal.getSupport.contactFinancialAdvisor")}
              </Text>
              <RelationshipManagerCard
                manager={{
                  firstName: rmData?.manager?.firstName || "",
                  lastName: rmData?.manager?.lastName || "",
                  email: rmData?.manager?.email || "",
                }}
              />
              <Divider color="red" mt="6" />
            </>
          ) : (
            <>
              <Text
                color="contrast.200"
                fontSize="16px"
                fontWeight="400"
                mb={["8", "4"]}
              >
                {t("modal.getSupport.contactYou")}
              </Text>
              <TalkToExpertsCard expertName="" />
            </>
          )}
        </Box>
        <Box>
          {rmAssigned ? (
            <>
              <Flex gridRowGap="4" flexDirection="column" height="max-content">
                <TalkToExpertsCard
                  expertName={`${rmData?.manager?.firstName}`}
                />
                <ContactRelationshipManagerCard
                  expertEmail={`${rmData?.manager?.email}`}
                  expertName={`${rmData?.manager?.firstName}`}
                />
              </Flex>
            </>
          ) : (
            <>
              <Text
                color="contrast.200"
                fontSize="16px"
                fontWeight="400"
                mb={["8", "4"]}
              >
                {t("modal.getSupport.contactUs")}
              </Text>
              <SimpleGrid
                spacingX={12}
                columns={{ base: 1, md: 2 }}
                gridTemplateColumns="repeat(1,max-content)"
              >
                {contacts.map((item, index) => {
                  return (
                    <Fragment key={item.labelText + index}>
                      <VStack
                        alignItems="center"
                        textAlign="center"
                        position="relative"
                        py="4"
                      >
                        <HStack color="gray.500">
                          {item.icon}
                          <Text> {item.labelText} </Text>
                        </HStack>
                        <Button
                          as="a"
                          variant="link"
                          target="_blank"
                          colorScheme="primary"
                          href={item.href}
                          fontFamily="Gotham, sans-serif"
                        >
                          {item.value}
                        </Button>
                      </VStack>
                      {!isDesktopView && index != 3 && <Divider />}
                    </Fragment>
                  )
                })}
              </SimpleGrid>
            </>
          )}
        </Box>
      </>
    )
  }

  return (
    <Modal
      onClose={props?.onClose}
      isOpen={props?.isOpen}
      autoFocus={false}
      returnFocusOnClose={false}
      size="auto"
      {...(isMobileView && { scrollBehavior: "inside" })}
    >
      <ModalOverlay />

      <ModalContent w="fit-content">
        <ModalCloseButton />

        <ModalBody {...(isDesktopView && { pt: 18, pb: 8 })}>
          <VStack spacing={6} align="center">
            {renderSupportModal()}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default React.memo(GetSupportPopUp)
