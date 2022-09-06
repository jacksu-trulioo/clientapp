import { Box, Circle, Flex, Spacer, Stack, Text } from "@chakra-ui/layout"
import {
  Button,
  Divider,
  HStack,
  IconButton,
  Skeleton,
  SkeletonCircle,
  Slide,
  useBreakpointValue,
  useDisclosure,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import {
  CalendarIcon,
  Card,
  CardContent,
  CardFooter,
  CaretDownIcon,
  MailIcon,
  MeetingChatIcon,
  PhoneIcon,
  RectangleDrawerIcon,
  RightArrowIcon,
} from "~/components"
import { RelationshipManager } from "~/services/mytfo/types"

export default function RelationshipManagerCard(props: { variant?: String }) {
  const { t } = useTranslation("home")
  const { variant } = props
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data, error } = useSWR<RelationshipManager>(
    "/api/user/relationship-manager",
  )

  const [isLessThan830] = useMediaQuery("(max-width: 830px)")
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const isDesktopTabletView = !isMobileView
  const isLoading = !data && !error
  const isRelationshipManagerAssigned = data?.assigned

  const sendMessageHandler = (event: React.SyntheticEvent) => {
    event.preventDefault()
    router.push(`mailto:${data?.manager?.email}`)
  }

  const scheduleMeetingHandler = (e: React.SyntheticEvent) => {
    e.preventDefault()
    router.push("/schedule-meeting")
  }

  const handleClick = (e: React.SyntheticEvent) => {
    e.preventDefault()
    router.push("/schedule-meeting")
  }

  function MinimalRelationshipManagerAssignedCard() {
    return (
      <Box alignSelf="flex-start" width={{ base: "full", md: "auto" }}>
        <HStack
          aria-label="minimizedRMCard"
          maxW={{ base: "full", md: "350px", lg: "350px" }}
          p="2"
          alignItems="center"
          border="2px solid"
          borderColor="gunmetal.600"
          borderRadius="full"
          bg="gunmetal.700"
        >
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

          <VStack alignItems="flex-start" spacing="0">
            <Text
              color="gray.400"
              fontSize={{ base: "sm", md: "xs" }}
              whiteSpace={{ base: "initial", md: "nowrap" }}
            >
              {t("cta.relationshipManager.title")}
            </Text>
            <Text
              color="white"
              fontSize={{ base: "md", md: "sm" }}
              whiteSpace={{ base: "initial", md: "nowrap" }}
            >
              {`${data?.manager?.firstName} ${data?.manager?.lastName}`}
            </Text>
          </VStack>
          <Spacer />
          {isMobileView ? (
            <IconButton
              aria-label="expandRMCard"
              size="md"
              icon={<CaretDownIcon color="primary.500" w="6" h="6" />}
              onClick={onOpen}
              colorScheme="primary"
              variant="ghost"
            />
          ) : (
            <HStack spacing="0">
              <IconButton
                aria-label="RM card mail icon"
                size="sm"
                onClick={sendMessageHandler}
                icon={<MailIcon color="primary.500" w="5" h="5" />}
                colorScheme="primary"
                variant="ghost"
              />
              <IconButton
                aria-label="RM card calendar icon"
                onClick={scheduleMeetingHandler}
                size="sm"
                icon={<CalendarIcon color="primary.500" w="5" h="5" />}
                colorScheme="primary"
                variant="ghost"
              />
            </HStack>
          )}
        </HStack>
        {isOpen && (
          //This is required to create overlay effect when RM card is open
          <Box
            position="fixed"
            onClick={onClose}
            top="-20px"
            left="-20px"
            height="100%"
            width="120%"
            zIndex="docked"
            bg="gray.850"
            opacity="0.8"
            backdropFilter="blur(8px)"
          ></Box>
        )}
        <Slide
          aria-label="overlaidRMCard"
          direction="bottom"
          in={isOpen}
          style={{ zIndex: 1100 }}
        >
          <Flex
            bg="gray.800"
            alignItems="center"
            flexDirection="column"
            px="4"
            py="2"
          >
            <IconButton
              aria-label="Close RM card"
              onClick={onClose}
              size="xs"
              icon={<RectangleDrawerIcon color="gray.700" w="6" h="6" />}
              colorScheme="primary"
              variant="ghost"
            />

            <Divider borderColor="gray.850" border="1px solid" mt="2" mb="10" />
            <Circle
              size={{ base: "12", md: "9" }}
              position="relative"
              mb="6"
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
            <Text color="gray.400" fontSize="md" mb="2">
              {t("cta.relationshipManager.title")}
            </Text>
            <Text color="white" fontSize="2xl" mb="10">
              {`${data?.manager?.firstName} ${data?.manager?.lastName}`}
            </Text>
            <VStack width="full" spacing="3" mb="5">
              <Button
                colorScheme="primary"
                leftIcon={<CalendarIcon w="4" h="4" />}
                fontSize="md"
                onClick={scheduleMeetingHandler}
                variant="solid"
                isFullWidth
              >
                {t("cta.relationshipManager.button.meeting")}
              </Button>
              <Button
                colorScheme="primary"
                leftIcon={<MailIcon w="4" h="4" />}
                fontSize="md"
                onClick={sendMessageHandler}
                variant="outline"
                isFullWidth
              >
                {t("cta.relationshipManager.button.message")}
              </Button>
            </VStack>
          </Flex>
        </Slide>
      </Box>
    )
  }

  function MinimalRelationshipManagerNotAssignedCard() {
    return (
      <Box alignSelf="flex-start" width={{ base: "full", md: "auto" }}>
        <HStack
          aria-label="minimalHelpCard"
          maxW={{ base: "full", md: "350px", lg: "350px" }}
          p="2"
          alignItems="center"
          border="2px solid"
          borderColor="gunmetal.600"
          borderRadius="full"
          bg="gunmetal.700"
          justify="space-between"
        >
          <Flex alignItems="center">
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
              mr={4}
            >
              <PhoneIcon
                color="secondary.500"
                w={{ base: "7", md: "5" }}
                h={{ base: "7", md: "5" }}
              />
            </Circle>

            <VStack alignItems="flex-start" spacing="0">
              <Text
                color="white"
                fontSize={{ base: "md", md: "sm" }}
                whiteSpace={{ base: "initial", md: "nowrap" }}
              >
                {t("cta.relationshipManager.button.talkWithExpert")}
              </Text>
              <Text color="gray.400" fontSize={{ base: "sm", md: "xs" }}>
                {t("cta.relationshipManager.button.schedule")}
              </Text>
            </VStack>
          </Flex>

          <IconButton
            aria-label="expandScheduleMeetingIcon"
            size="sm"
            onClick={handleClick}
            icon={
              <RightArrowIcon
                color="primary.500"
                w="4"
                h="4"
                transform={
                  router.locale === "ar" ? "rotate(180deg)" : "initial"
                }
              />
            }
            colorScheme="primary"
            variant="ghost"
            _hover={{
              bgColor: "transparent",
            }}
          />
        </HStack>
        {isOpen && (
          //This is required to create overlay effect when RM card is open
          <Box
            position="fixed"
            onClick={onClose}
            top="-20px"
            left="-20px"
            height="100%"
            width="120%"
            zIndex="docked"
            bg="gray.850"
            opacity="0.8"
            backdropFilter="blur(8px)"
          ></Box>
        )}
        <Slide direction="bottom" in={isOpen} style={{ zIndex: 1100 }}>
          <Flex
            bg="gray.800"
            alignItems="center"
            flexDirection="column"
            px="4"
            py="2"
          >
            <IconButton
              aria-label="Close RM card"
              onClick={onClose}
              size="sm"
              icon={<CaretDownIcon w="6" h="6" />}
              colorScheme="primary"
              variant="ghost"
            />
            <Divider borderColor="gray.850" border="1px solid" mt="2" mb="10" />
            <Circle
              size={{ base: "12", md: "9" }}
              position="relative"
              mb="6"
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
            <Text color="gray.400" fontSize="md" mb="2">
              {t("cta.relationshipManager.title")}
            </Text>
            <Text color="white" fontSize="2xl" mb="10"></Text>
            <VStack width="full" spacing="3" mb="5">
              <Button
                colorScheme="primary"
                leftIcon={<CalendarIcon w="4" h="4" />}
                fontSize="md"
                onClick={scheduleMeetingHandler}
                variant="solid"
                isFullWidth
              >
                {t("cta.relationshipManager.button.meeting")}
              </Button>
              <Button
                colorScheme="primary"
                leftIcon={<MailIcon w="4" h="4" />}
                fontSize="md"
                onClick={sendMessageHandler}
                variant="outline"
                isFullWidth
              >
                {t("cta.relationshipManager.button.message")}
              </Button>
            </VStack>
          </Flex>
        </Slide>
      </Box>
    )
  }

  function RelationshipManagerAssignedActionCard() {
    return (
      <Card
        aria-label="rmCard"
        maxW={{
          base: "full",
          md: isLessThan830 ? "220px" : "280px",
          lg: "300px",
        }}
        flex="1"
        display="flex"
        flexDirection="column"
        justifyContent="space-evenly"
      >
        <CardContent pb="4">
          {isMobileView && (
            <Circle
              size="10"
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
              mb="8"
            >
              <MeetingChatIcon color="secondary.500" w="5" h="5" />
            </Circle>
          )}
          <VStack spacing={4} alignItems={{ base: "flex-start", md: "center" }}>
            {isDesktopTabletView && (
              <Circle
                size="10"
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
                <MeetingChatIcon color="secondary.500" w="5" h="5" />
              </Circle>
            )}

            <VStack alignItems="flex-start" spacing="0">
              <Text color="gray.400" fontSize="sm">
                {t("cta.relationshipManager.title")}
              </Text>
              <Text color="white" fontSize="lg">
                {`${data?.manager?.firstName} ${data?.manager?.lastName}`}
              </Text>
            </VStack>
          </VStack>
          <Divider pt="4" />
        </CardContent>
        <CardFooter pt="0">
          <VStack width="full" alignItems="flex-start" spacing="2">
            <Button
              colorScheme="primary"
              leftIcon={<CalendarIcon w="4" h="4" />}
              fontSize="sm"
              onClick={handleClick}
              variant="solid"
              isFullWidth
            >
              {t("cta.relationshipManager.button.meeting")}
            </Button>
            <Button
              colorScheme="primary"
              leftIcon={<MailIcon w="4" h="4" />}
              fontSize="sm"
              onClick={sendMessageHandler}
              variant="outline"
              isFullWidth
            >
              {t("cta.relationshipManager.button.message")}
            </Button>
          </VStack>
        </CardFooter>
      </Card>
    )
  }
  function RelationshipManagerNotAssignedActionCard() {
    return (
      <Card
        aria-label="rmNotAssignedCard"
        maxW={{
          base: "full",
          md: isLessThan830 ? "220px" : "280px",
          lg: "300px",
        }}
        flex="1"
      >
        <CardContent
          display="flex"
          flexDirection="column"
          height="full"
          alignItems={{ base: "flex-start", md: "center" }}
          justifyContent="space-evenly"
          textAlign={{ base: "start", md: "center" }}
        >
          <Circle
            size="10"
            position="relative"
            mt="2"
            mb={{ base: 8, md: isLessThan830 ? 4 : 8, lg: 8 }}
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
            <PhoneIcon color="secondary.500" w="5" h="5" />
          </Circle>

          <Text fontSize="lg"></Text>

          <Text color="white" fontSize="lg" mb="3">
            {t("cta.relationshipManager.help.title")}
          </Text>

          <Text
            color="gray.400"
            fontSize="sm"
            mb={{ base: 8, md: isLessThan830 ? 4 : 8, lg: 8 }}
          >
            {t("cta.relationshipManager.help.description")}
          </Text>

          <Button
            variant="outline"
            colorScheme="primary"
            isFullWidth
            onClick={handleClick}
          >
            {t("cta.relationshipManager.button.schedule")}
          </Button>
        </CardContent>
      </Card>
    )
  }
  if (error) {
    return null
  }

  if (isLoading) {
    return (
      // need minimum width here because there is no content in skeleton
      <Card minW={{ base: "full", md: isLessThan830 ? "220px" : "280px" }}>
        <CardContent>
          <Stack mt="1" mb="6" direction="row" alignItems="center">
            <SkeletonCircle size="10" />
            <Skeleton flex="1" height="8" maxW="3xs" rounded="full" />
          </Stack>
          <Stack>
            <Skeleton height="8" maxW="sm" rounded="full" />
            <Skeleton height="8" maxW="sm" rounded="full" />
          </Stack>
        </CardContent>
      </Card>
    )
  }

  if (isRelationshipManagerAssigned) {
    if (variant === "minimal") {
      return <MinimalRelationshipManagerAssignedCard />
    }
    return <RelationshipManagerAssignedActionCard />
  } else {
    if (variant === "minimal") {
      return <MinimalRelationshipManagerNotAssignedCard />
    }
    return <RelationshipManagerNotAssignedActionCard />
  }
}
