import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import { useBreakpointValue } from "@chakra-ui/media-query"
import {
  Box,
  Button,
  Flex,
  Link,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react"
import ky from "ky"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment, useEffect, useState } from "react"
import useSWR, { mutate } from "swr"

import {
  CallIcon,
  ChangePassword,
  ClientLayout,
  ComboBox,
  Disclaimer,
  PageContainer,
  RigthArrow,
  ScheduleMettingIcon,
  SettingEmailIcom,
  SettingScheduleMetting,
  SkeletonCard,
  TermsAndCondition,
} from "~/components"
import { useUser } from "~/hooks/useUser"
import { Preference } from "~/services/mytfo/types"
import { languageToggle, mandateIdSwitch } from "~/utils/googleEventsClient"
import { clientUniEvent } from "~/utils/gtag"

type SettingPropsType = {
  mandateId: string
}

type LanguageBoxPropsType = {
  isDesktopView: boolean
}

type MandateIDsType = {
  uniqueMandateIds: string[]
}

export default function Setting({ mandateId }: SettingPropsType) {
  const { user } = useUser()

  const [IsViewTerms, setIsViewTerms] = useState(Boolean)
  const [IsViewDisclaimer, setIsViewDisclaimer] = useState(Boolean)
  const { t, lang } = useTranslation("setting")
  const isDesktopView = useBreakpointValue({ base: false, lgp: true })
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)

  const { data: mandateIds, error: mandateError } = useSWR<MandateIDsType>(
    `/api/client/account/mandate`,
  )

  const viewTerms = () => {
    setIsViewTerms(true)
  }
  const viewDisclaimer = () => {
    setIsViewDisclaimer(true)
  }

  const isLoading = !mandateIds && !mandateError

  useEffect(() => {
    if (isLoading) {
      setIsPageLoading(true)
    } else {
      setIsPageLoading(false)
    }
  }, [isLoading])

  const changeMandate = async (mandate: string) => {
    setIsPageLoading(true)
    await ky.post("/api/client/account/mandate", {
      json: { mandateId: mandate },
    })
    await mutate("/api/user")
    window.location.replace(lang.includes("ar") ? "/ar/client" : "/client")
  }

  const onClose = () => {
    setIsChangePasswordOpen(false)
  }

  return (
    <ClientLayout title={t("page.title")} description={t("page.description")}>
      <PageContainer
        isLoading={isPageLoading}
        as="section"
        maxW="full"
        px="0"
        mt={{ base: 8, md: 8, lgp: 0 }}
        filter={isPageLoading ? "blur(3px)" : "none"}
      >
        {isLoading ? (
          <SkeletonCard flex="1" mb="25px" mt="20px" />
        ) : (
          <Fragment>
            <Text fontSize="30px">{t(`page.title`)}</Text>
            <Flex
              justifyContent="space-between"
              w={{ md: "100%", base: "100%", lgp: "100%" }}
              d={{ base: "block", md: "flex", lgp: "block" }}
            >
              <ReletionshipManagerCard />
              <Box
                w="30%"
                d={{ base: "none", lgp: "none", md: "block" }}
                style={{
                  marginRight: lang.includes("ar") ? "34px" : "0",
                  marginTop: lang.includes("ar") ? "34px" : "50px",
                }}
              >
                <Box>
                  <Text
                    fontSize={{ lgp: "24px", base: "18px" }}
                    fontWeight={{ base: "700", md: "700", lgp: "400" }}
                    color="#FFFFFF"
                  >
                    {t(`password.title`)}
                  </Text>
                  <Box mt="24px">
                    <Button colorScheme="primary" size="md" variant="outline">
                      <Text mr="12px">{t(`password.button`)}</Text>
                    </Button>
                  </Box>
                  <Box></Box>
                </Box>
                <Box mt="40px">
                  <Text
                    fontSize={{ lgp: "24px", base: "18px" }}
                    fontWeight={{ base: "700", md: "700", lgp: "400" }}
                    color="#FFFFFF"
                    mb={{ lgp: "40px", md: "16px", base: "16px" }}
                  >
                    {t(`language.title`)}
                  </Text>
                  <LanguageBox isDesktopView={isDesktopView || true} />
                </Box>
              </Box>
            </Flex>
            <Flex
              flexDirection={{ lgp: "row", md: "row", base: "column" }}
              mt={{ lgp: "48px", md: "0", base: "40px" }}
              justifyContent="space-between"
            >
              {mandateIds?.uniqueMandateIds?.length ? (
                <Box
                  w={{ lgp: "50%", md: "100%", base: "100%" }}
                  mb={{ base: "40px", md: "0", lgp: "0" }}
                >
                  <Text
                    fontSize={{ lgp: "24px", base: "18px" }}
                    fontWeight={{ base: "700", md: "700", lgp: "400" }}
                    color="#FFFFFF"
                    mb={{ lgp: "40px", md: "16px", base: "16px" }}
                  >
                    {t(`viewAccount.title`)}
                  </Text>
                  <Box
                    className="comboBoxSelector"
                    width={{
                      base: "100%",
                      md: lang === "ar" ? "66%" : "50%",
                      lgp: "80%",
                    }}
                    mb="20px"
                  >
                    <ComboBox
                      onSelectHandler={(value: string) => {
                        mandateId = value
                        clientUniEvent(
                          mandateIdSwitch,
                          mandateId,
                          user?.mandateId as string,
                          user?.email as string,
                        )
                        changeMandate(value)
                      }}
                      initialValue={mandateId}
                      data={mandateIds?.uniqueMandateIds.map((mandate) => {
                        return mandate
                      })}
                    />
                  </Box>
                </Box>
              ) : (
                false
              )}
              <Box d={{ lgp: "block", md: "none" }} w={{ lgp: "50%" }}>
                <Text
                  fontSize={{ lgp: "24px", base: "18px" }}
                  fontWeight={{ base: "700", md: "700", lgp: "400" }}
                  color="#FFFFFF"
                  mb={{ lgp: "40px", md: "16px", base: "16px" }}
                >
                  {t(`language.title`)}
                </Text>
                <LanguageBox isDesktopView={isDesktopView || true} />
              </Box>
            </Flex>

            <Box
              mt="64px"
              d={{ lgp: "block", md: "none" }}
              borderBottom="1px solid #222222"
              pb="48px"
            >
              <Text
                fontSize={{ lgp: "24px", base: "18px" }}
                fontWeight={{ base: "700", md: "700", lgp: "400" }}
                color="#FFFFFF"
              >
                {t(`password.title`)}
              </Text>

              <Box mt="24px">
                <Button
                  colorScheme="primary"
                  size="md"
                  variant="outline"
                  w="180px"
                  onClick={() => {
                    setIsChangePasswordOpen(true)
                  }}
                >
                  <Text mr="8px" fontSize="14px">
                    {t(`password.button`)}
                  </Text>
                  <Box d={{ lgp: "none", md: "block", base: "block" }}>
                    <RigthArrow />
                  </Box>
                </Button>
              </Box>
            </Box>

            <Box mt="48px" mb={{ base: "40px", md: "40px", lgp: "48px" }}>
              <Text
                fontSize={{ lgp: "24px", base: "18px" }}
                fontWeight={{ base: "700", md: "700", lgp: "400" }}
                pt={{ md: "40px", base: "0", lgp: "0" }}
                borderTop={{
                  md: "1px solid #222222",
                  base: "none",
                  lgp: "none",
                }}
              >
                {t(`more.title`)}
              </Text>
              <Flex
                mt={{ lgp: "24px", md: "50px", base: "24px" }}
                flexDirection={{ lgp: "row", md: "row", base: "column" }}
              >
                <Box mr="50px" mb={{ base: "25px", md: "0", lgp: "0" }}>
                  {" "}
                  <Button
                    colorScheme="primary"
                    size="md"
                    variant="outline"
                    _focus={{
                      outline: "none",
                    }}
                    onClick={() => {
                      viewTerms()
                    }}
                    w="180px"
                  >
                    <Text pr="10px" fontSize="14px">
                      {t(`more.button.terms`)}
                    </Text>{" "}
                    <RigthArrow />
                  </Button>
                </Box>

                <Box mr="50px" mb={{ base: "25px", md: "0", lgp: "0" }}>
                  {" "}
                  <Button
                    colorScheme="primary"
                    size="md"
                    variant="outline"
                    _focus={{
                      outline: "none",
                    }}
                    onClick={() => {
                      viewDisclaimer()
                    }}
                    w="180px"
                  >
                    <Text pr="10px" fontSize="14px">
                      {t(`more.button.disclaimer`)}
                    </Text>
                    <RigthArrow />
                  </Button>
                </Box>
              </Flex>
            </Box>

            <ChangePassword isOpen={isChangePasswordOpen} onClose={onClose} />
            {IsViewTerms ? (
              <TermsAndCondition
                show={IsViewTerms}
                close={() => setIsViewTerms(false)}
              />
            ) : (
              false
            )}

            {IsViewDisclaimer ? (
              <Disclaimer
                show={IsViewDisclaimer}
                close={() => setIsViewDisclaimer(false)}
              />
            ) : (
              false
            )}
          </Fragment>
        )}
      </PageContainer>
    </ClientLayout>
  )
}

const ReletionshipManagerCard = () => {
  const { t, lang } = useTranslation("setting")
  const { data: profileData, error } = useSWR(`/api/client/account/profile`)
  const isLoading = !profileData && !error

  if (isLoading) {
    return <SkeletonCard flex="1" mb="25px" mt="20px" />
  }

  if (profileData) {
    return (
      <Box mt={{ base: "48px", md: "24px", lgp: "40px" }}>
        <Text
          fontSize={{ lgp: "24px", base: "18px" }}
          fontWeight={{ base: "700", md: "700", lgp: "400" }}
        >
          {t(`rmDetail.title`)}
        </Text>

        <Box
          mt="16px"
          bg="#1A1A1A"
          py="24px"
          px={{ lgp: "24px", md: "24px", base: "14px" }}
          w={{
            lgp: "53%",
            md: lang.includes("ar") ? "460px" : "100%",
            base: "100%",
          }}
          borderRadius="6px"
        >
          <Flex>
            <Box
              style={{
                marginRight: lang.includes("ar") ? "0" : "24px",
                marginLeft: lang.includes("ar") ? "14px" : "0",
              }}
            >
              <ScheduleMettingIcon />
            </Box>
            <Box>
              <Text fontSize="12px" color="#C7C7C7">
                {t(`rmDetail.title`)}
              </Text>
              <Text fontSize="18px" mt="8px" color="#FFFFFF">
                {profileData?.manager.name}
              </Text>
              <Flex
                mt="24px"
                flexDirection={{ lgp: "row", md: "row", base: "column" }}
                justifyContent={{
                  lgp: "center",
                  md: "center",
                  base: " flex-start",
                }}
                alignItems={{
                  lgp: "center",
                  md: "center",
                  base: " flex-start",
                }}
              >
                <Flex
                  mr={{
                    lgp: lang.includes("ar") ? "16px" : "24px",
                    md: "16px",
                    base: "16px",
                  }}
                  mb={{ base: "15px", md: "0", lgp: "0" }}
                >
                  <Box d="flex" flexDir="column" justifyContent="center">
                    <CallIcon />{" "}
                  </Box>
                  <Text
                    pl="9px"
                    fontSize="14px"
                    color="primary.500"
                    fontWeight="600"
                  >
                    <Link
                      href={"tel:" + profileData?.manager.phone}
                      target="_blank"
                      _focus={{ boxShadow: "none" }}
                    >
                      {t(`rmDetail.options.call`)}
                    </Link>
                  </Text>
                </Flex>
                <Flex
                  mr={{
                    base: lang.includes("ar") ? "0" : "24px",
                    md: lang.includes("ar") ? "16px" : "24px",
                    lg: lang.includes("ar") ? "16px" : "24px",
                  }}
                  mb={{ base: "15px", md: "0", lgp: "0" }}
                >
                  <Box d="flex" flexDir="column" justifyContent="center">
                    <SettingEmailIcom />
                  </Box>
                  <Text
                    pl="9px"
                    fontSize="14px"
                    color="primary.500"
                    fontWeight="600"
                  >
                    <Link
                      href={"mailto:" + profileData?.manager.email}
                      target="_blank"
                      _focus={{ boxShadow: "none" }}
                    >
                      {t(`rmDetail.options.email`)}
                    </Link>
                  </Text>
                </Flex>
                <Flex mr="18px" mb={{ base: "15px", md: "0", lgp: "0" }}>
                  <Box d="flex" flexDir="column" justifyContent="center">
                    <SettingScheduleMetting />{" "}
                  </Box>
                  <Link
                    pl="9px"
                    fontSize="14px"
                    color="primary.500"
                    fontWeight="600"
                    onClick={() => router.push("/client/schedule-meeting")}
                    _focus={{ boxShadow: "none" }}
                  >
                    {t(`rmDetail.options.scheduleMeeting`)}
                  </Link>
                </Flex>
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Box>
    )
  }

  return <Fragment />
}

const LanguageBox = ({ isDesktopView }: LanguageBoxPropsType) => {
  const toast = useToast()
  const { t } = useTranslation("setting")
  const [isButtonLoading, setIsButtonLoading] = useState(false)
  const { user } = useUser()
  const {
    data: preferredLanguage,
    error: preferredLanguageError,
    mutate,
  } = useSWR<Preference>("/api/user/preference")

  const isLoading = !preferredLanguage && !preferredLanguageError

  const [selectedLanguage, setSelectedLanguage] = React.useState(
    preferredLanguage?.language,
  )

  useEffect(() => {
    setSelectedLanguage(preferredLanguage?.language)
  }, [preferredLanguage])

  const onLanguageSave = async () => {
    setIsButtonLoading(true)
    clientUniEvent(
      languageToggle,
      selectedLanguage as string,
      user?.mandateId as string,
      user?.email as string,
    )
    await ky
      .post("/api/user/preference", {
        json: {
          language: selectedLanguage,
        },
      })
      .json<Preference>()

    // NOTE: we invalidate the swr call for preference because we are updating data
    mutate()

    toast({
      title: t("profile:tabs.preferences.toast.title"),
      description: t("profile:tabs.preferences.toast.description"),
      status: "success",
      isClosable: true,
      variant: "subtle",
      position: "top",
    })
    window.location.replace(
      selectedLanguage === "AR" ? "/ar/client" : "/client",
    )
    setIsButtonLoading(false)
  }

  const onChange = (value: "AR" | "EN") => {
    setSelectedLanguage(value || "EN")
  }

  return (
    <Fragment>
      {!isLoading ? (
        <Box>
          {isDesktopView ? (
            <Text mb="8px" fontSize="14px">
              {t(`language.subTitle`)}:
            </Text>
          ) : (
            false
          )}
          <RadioGroup
            onChange={onChange}
            value={selectedLanguage}
            className="concentartionCard"
          >
            <Stack direction="column">
              <Radio mb="19px" colorScheme="secondary" value="AR">
                {t(`language.ar`)}
              </Radio>
              <Radio colorScheme="secondary" value="EN">
                {t(`language.en`)}
              </Radio>
            </Stack>
          </RadioGroup>
          {selectedLanguage != preferredLanguage?.language ? (
            <Box mt="24px">
              <Button
                onClick={onLanguageSave}
                colorScheme="primary"
                size="md"
                variant="outline"
                w="180px"
                isLoading={isButtonLoading}
              >
                <Text>{t("common:button.save")}</Text>
              </Button>
            </Box>
          ) : (
            false
          )}
        </Box>
      ) : (
        false
      )}
    </Fragment>
  )
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async function (ctx) {
    const sesison = getSession(ctx.req, ctx.res)
    if (sesison?.mandateId) {
      return {
        props: {
          mandateId: sesison.mandateId,
        }, // will be passed to the page component as props
      }
    }
    return {
      notFound: true,
    }
  },
})
