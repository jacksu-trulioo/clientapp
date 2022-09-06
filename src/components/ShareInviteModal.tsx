import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/layout"
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/modal"
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import {
  LinkedInSocialIcon,
  TelegramIcon,
  TwitterSocialIcon,
  WhatsAppIcon,
} from "~/components"
import { copyLinkForSharing, inviteFriend } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"

interface ShareInviteModalType {
  isOpen: boolean
  onClose: () => void
}

function ShareInviteModal(props: ShareInviteModalType) {
  const inviteLinkRef = React.useRef<HTMLInputElement>(null)
  const { data, error } = useSWR("/api/user/promotion/short-code")
  const isLoading = !data && !error
  const toast = useToast()
  const { t, lang } = useTranslation("common")
  const localePath = lang === "ar" ? "/ar/" : "/"
  const inviteUrl =
    typeof window !== "undefined" && !isLoading
      ? `${window.location.origin}${localePath}invite/${data?.code}`
      : ""
  const isMobileView = useBreakpointValue({ base: true, md: false })

  const openLinkCopiedToast = () => {
    event(copyLinkForSharing)
    navigator.clipboard.writeText(inviteLinkRef?.current?.value || "")
    toast({
      id: Math.random(),
      title: t("shareInviteModal.message"),
      variant: "subtle",
      status: "success",
      isClosable: true,
      position: "top",
    })
  }

  const openShareLink = () => {
    event(inviteFriend)
    if (navigator.share) {
      navigator.share({
        title: t("shareInviteModal.platform.heading"),
        text: t("shareInviteModal.platform.description"),
        url: inviteLinkRef?.current?.value as string,
      })
    }
  }

  const socialShareIcons = [
    { Icon: LinkedInSocialIcon, name: t("shareInviteModal.platform.linkedin") },
    { Icon: TwitterSocialIcon, name: t("shareInviteModal.platform.twitter") },
    { Icon: WhatsAppIcon, name: t("shareInviteModal.platform.whatsApp") },
  ]

  const getShareLinkUrl = (name: string) => {
    if (name === t("shareInviteModal.platform.whatsApp"))
      return `https://wa.me?text=${t("shareInviteModal.platform.heading")} ${t(
        "shareInviteModal.platform.description",
      )} ${inviteUrl}`
    if (name === t("shareInviteModal.platform.linkedin"))
      return `https://www.linkedin.com/shareArticle?mini=true&url=${inviteUrl}&title=${t(
        "shareInviteModal.platform.heading",
      )}&description=${t("shareInviteModal.platform.description")}`
    if (name === t("shareInviteModal.platform.twitter"))
      return `http://twitter.com/share?text=${t(
        "shareInviteModal.platform.heading",
      )} ${t("shareInviteModal.platform.description")}&url=${inviteUrl}`
  }

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={props.isOpen}
      onClose={props.onClose}
      size="lg"
      isCentered={true}
      autoFocus={false}
      returnFocusOnClose={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <VStack
            spacing={4}
            justifyContent="center"
            alignItems="flex-start"
            mb={6}
          >
            <ModalCloseButton
              {...(lang === "ar" && { left: "auto", right: "0.75em" })}
            />
            <Flex>
              <TelegramIcon w="6" h="6" color="secondary.500" />
              <Heading fontSize="lg" fontWeight={400} ml={1}>
                {t("shareInviteModal.heading")}
              </Heading>
            </Flex>

            <Text fontSize="md" fontWeight={400} textAlign="left">
              {t("shareInviteModal.title")}
            </Text>
            <Text fontSize="sm">{t("shareInviteModal.label")}</Text>
            {!isLoading && (
              <InputGroup w="full">
                <Input
                  name="shareLink"
                  isReadOnly={true}
                  value={inviteUrl}
                  fontSize="sm"
                  ref={inviteLinkRef}
                />
                {!isMobileView && (
                  <InputRightElement
                    w="4.5rem"
                    {...(lang === "ar" && { left: "auto" })}
                    right="6px"
                  >
                    <Text
                      cursor="pointer"
                      textDecoration="underline"
                      fontSize="sm"
                      color="primary.500"
                      onClick={openLinkCopiedToast}
                    >
                      {t("shareInviteModal.cta.copyLink")}
                    </Text>
                  </InputRightElement>
                )}
              </InputGroup>
            )}
            {!isMobileView && !isLoading && (
              <VStack alignItems="flex-start">
                <Text>{t("shareInviteModal.shareHeading")}</Text>
                <Flex>
                  {socialShareIcons.map(({ Icon, name }) => (
                    <VStack
                      key={name}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Link
                        href={getShareLinkUrl(name)}
                        target="_blank"
                        {...(name ===
                          t("shareInviteModal.platform.linkedin") && {
                          href: undefined,
                          target: "_self",
                        })}
                      >
                        <Box
                          mx="3"
                          as="button"
                          w="10"
                          border="1px solid"
                          borderColor="gray.700"
                          borderRadius="full"
                          height="10"
                          onClick={() => {
                            event(inviteFriend)
                            if (
                              name === t("shareInviteModal.platform.linkedin")
                            ) {
                              if (typeof window !== undefined) {
                                const url = getShareLinkUrl(name)
                                const strWindowFeatures =
                                  "location=yes,height=570,width=520,scrollbars=yes,status=yes"
                                window.open(url, "_blank", strWindowFeatures)
                              }
                            }
                          }}
                          _disabled={{
                            opacity: "0.4",
                            _hover: {
                              cursor: "not-allowed",
                            },
                          }}
                        >
                          <Icon
                            w="6"
                            h="6"
                            color={
                              name === "Whatsapp" ? "green.400" : "currentColor"
                            }
                          />
                        </Box>
                      </Link>
                      <Text fontSize="xs">{name}</Text>
                    </VStack>
                  ))}
                </Flex>
              </VStack>
            )}
            {isMobileView && (
              <Flex justifyContent="center" alignItems="center" w="full">
                <Button
                  w="full"
                  colorScheme="primary"
                  size="sm"
                  variant="outline"
                  fontWeight={400}
                  mr={2}
                  onClick={openShareLink}
                >
                  {t("shareInviteModal.cta.share")}
                </Button>
                <Button
                  ml={2}
                  w="full"
                  colorScheme="primary"
                  size="sm"
                  variant="solid"
                  fontWeight={400}
                  onClick={openLinkCopiedToast}
                >
                  {t("shareInviteModal.cta.copyLink")}
                </Button>
              </Flex>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Flex
            alignItems="center"
            justifyContent={isMobileView ? "center" : "flex-end"}
            w="full"
          >
            <Button
              colorScheme="primary"
              size="sm"
              variant={isMobileView ? "link" : "outline"}
              fontWeight={400}
              onClick={props.onClose}
            >
              {t("shareInviteModal.cta.cancel")}
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default React.memo(ShareInviteModal)
