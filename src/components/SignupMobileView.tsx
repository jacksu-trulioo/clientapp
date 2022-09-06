import "react-responsive-carousel/lib/styles/carousel.min.css"

import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import Trans from "next-translate/Trans"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect } from "react"
import { Carousel } from "react-responsive-carousel"

import {
  LanguageSwitch,
  Link,
  PlayTriangleIcon,
  SafeAndSecureIcon,
  SignUpLogo,
} from "~/components"
import siteConfig from "~/config"
import { joinNow, playVideoOnSignup } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"

import AppleSocialButton from "./AppleSocialButton"
import SocialButtons from "./SocialButtons"

const SignupMobileView = () => {
  const { t, lang } = useTranslation("auth")
  const router = useRouter()
  const {
    isOpen: isVideoOpen,
    onClose: onVideoClose,
    onOpen: onVideoOpen,
  } = useDisclosure()
  const { tfoInfoVideoLinkEn, tfoInfoVideoLinkAr } = siteConfig

  useEffect(() => {
    // wait till the query paramenters are accessible
    if (!router.isReady) return
    const showTour = !!router.query?.showTour
    if (showTour) {
      onVideoOpen()
    }
  }, [onVideoOpen, router.isReady, router.query?.showTour])

  const videoModal = () => (
    <Modal
      isOpen={isVideoOpen}
      onClose={onVideoClose}
      size="sm"
      autoFocus={false}
      returnFocusOnClose={false}
      isCentered
    >
      <ModalOverlay />

      <ModalContent>
        <ModalCloseButton color="white" />

        <ModalBody mt="12" p="0">
          <video
            controls
            style={{ borderRadius: "0 0 6px 6px" }}
            width="100%"
            height="100%"
            autoPlay
            muted
          >
            <source
              src={lang === "en" ? tfoInfoVideoLinkEn : tfoInfoVideoLinkAr}
            />
          </video>
        </ModalBody>
      </ModalContent>
    </Modal>
  )

  let isAndroid =
    typeof window !== "undefined"
      ? Boolean(navigator.userAgent.match(/Android/i))
      : false

  return (
    <>
      <Box
        position="absolute"
        top="20px"
        id="logo"
        width="full"
        zIndex="modal"
        p="3"
        mb={5}
      >
        <Flex justifyContent="space-between">
          <SignUpLogo height="7" />
          <LanguageSwitch />
        </Flex>
      </Box>

      <Box h="60vh" position="relative">
        <Box
          position="absolute"
          top="0"
          left="0"
          h="full"
          w="full"
          background={
            lang === "en"
              ? "linear-gradient(180deg, #111111 0%, rgba(17, 17, 17, 0) 25.95%, rgba(17, 17, 17, 0) 49.92%, rgba(17, 17, 17, 0.72) 79.7%, #111111 100%)"
              : "linear-gradient(180deg, #111111 100%, rgba(17, 17, 17, 0) 25.95%, rgba(17, 17, 17, 0) 49.92%, rgba(17, 17, 17, 0.72) 79.7%, #111111 100%)"
          }
          zIndex="overlay"
        >
          <Flex
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
            h="full"
            w="full"
            position="absolute"
          >
            <PlayTriangleIcon
              w={16}
              h={16}
              zIndex="modal"
              cursor="pointer"
              onClick={() => {
                event(playVideoOnSignup)
                onVideoOpen()
              }}
            />
          </Flex>
        </Box>
        <video
          autoPlay
          className="video"
          muted
          loop
          playsInline
          poster={`/images/signup_thumbnail_${lang}.jpg`}
        >
          <source
            src={lang === "en" ? tfoInfoVideoLinkEn : tfoInfoVideoLinkAr}
            type="video/mp4"
          />
        </video>
        <Box
          className="carousal-box"
          width="100%"
          dir="ltr"
          position="absolute"
          bottom={0}
          zIndex="modal"
          px={4}
        >
          <Carousel
            showStatus={false}
            showThumbs={false}
            autoPlay={true}
            infiniteLoop={true}
            animationHandler="slide"
            interval={3000}
            width="100%"
          >
            <Trans
              i18nKey="auth:signup.slides.first"
              components={[
                <Text
                  key="0"
                  fontSize="22px"
                  fontWeight="bold"
                  dir={lang === "en" ? "ltr" : "rtl"}
                />,

                <Text
                  key="1"
                  color="white"
                  fontSize="22px"
                  fontWeight="normal"
                  dir={lang === "en" ? "ltr" : "rtl"}
                ></Text>,
              ]}
            />

            <Trans
              i18nKey="auth:signup.slides.second"
              components={[
                <Text
                  key="0"
                  fontSize="22px"
                  fontWeight="bold"
                  dir={lang === "en" ? "ltr" : "rtl"}
                />,

                <Text
                  key="1"
                  color="white"
                  fontSize="22px"
                  fontWeight="normal"
                  dir={lang === "en" ? "ltr" : "rtl"}
                ></Text>,
              ]}
            />

            <Trans
              i18nKey="auth:signup.slides.third"
              components={[
                <Text
                  key="0"
                  fontSize="22px"
                  fontWeight="bold"
                  dir={lang === "en" ? "ltr" : "rtl"}
                />,

                <Text
                  key="1"
                  color="white"
                  fontSize="22px"
                  fontWeight="normal"
                  dir={lang === "en" ? "ltr" : "rtl"}
                ></Text>,
              ]}
            />
          </Carousel>
        </Box>
      </Box>
      <Container
        display="flex"
        maxW="md"
        mt={4}
        flex="1"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Button
          m={2}
          colorScheme="primary"
          size="lg"
          w="full"
          onClick={() => {
            event(joinNow)
            router.push("/signup/email")
          }}
        >
          {t("signup.button.join")}
        </Button>
        {!isAndroid && <AppleSocialButton />}
        <Flex
          my="8"
          w="full"
          justifyContent="center"
          alignItems="center"
          display="inline-flex"
        >
          <Divider />

          <Text color="gray.400" fontSize="sm" w="sm" textAlign="center" mx={4}>
            {t("signup.text.social")}
          </Text>

          <Divider />
        </Flex>
        <Center mb={6} gridGap={{ base: 8, md: 5 }}>
          <SocialButtons noAppleLogo={true} />
        </Center>
        <Stack
          direction={["row"]}
          justifyContent="center"
          alignItems={"center"}
        >
          <Text color="gray.400" fontSize="sm">
            {t("signup.text.alreadyHaveAnAccount")}
          </Text>

          <Button
            as={Link}
            href="/login"
            variant="link"
            colorScheme="primary"
            size="sm"
          >
            {t("signup.link.login")}
          </Button>
        </Stack>
        <Flex p="80px 20px 20px">
          <SafeAndSecureIcon />
          <Text
            fontSize="16px"
            fontWeight="400"
            color="contrast.200"
            textAlign="start"
            pl="14px"
          >
            {t("signup.safeandsecure.title")}
          </Text>
        </Flex>
      </Container>
      {videoModal()}
    </>
  )
}

export default SignupMobileView
