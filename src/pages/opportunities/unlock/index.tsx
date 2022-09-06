import { Button } from "@chakra-ui/button"
import {
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  ListItem,
  Stack,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/layout"
import { chakra, Tooltip, useBreakpointValue } from "@chakra-ui/react"
import { Form, Formik, useFormikContext } from "formik"
import ky from "ky"
import { useRouter } from "next/router"
import Trans from "next-translate/Trans"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import useSWR from "swr"

import {
  InfoIcon,
  ModalFooter,
  ModalHeader,
  ModalLayout,
  Radio,
  RadioGroupControl,
} from "~/components"
import { useUser } from "~/hooks/useUser"
import {
  PreProposalInitialAcccessType,
  PreProposalInitialActionType,
  Profile,
  UserQualificationStatus,
  UserStatuses,
} from "~/services/mytfo/types"
import formatMinutes from "~/utils/formatMinutes"
import { InvestmentStartUnlockFlowEvent } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"
import withPageAuthRequired from "~/utils/withPageAuthRequired"

type ProposalInitialActionProps = {
  preProposalInitialAction: string
}

function BuildOpportunityUnlockScreen() {
  const { t, lang } = useTranslation("opportunities")
  const router = useRouter()
  const { user } = useUser()
  const isMobileView = useBreakpointValue({ base: true, md: false })

  const { data: userStatusData, error: userStatusError } =
    useSWR<UserStatuses>("/api/user/status")

  const isUserStatusLoading = !userStatusData && !userStatusError

  const handleSubmit = async (values: ProposalInitialActionProps) => {
    event(InvestmentStartUnlockFlowEvent)
    const accessValue =
      values.preProposalInitialAction ===
      PreProposalInitialActionType.QualifyToUnlock
        ? PreProposalInitialAcccessType.Opportunities
        : PreProposalInitialAcccessType.Proposal
    if (user?.profile?.preProposalInitialAction === null) {
      await ky
        .put("/api/user/profile", {
          json: {
            ...user?.profile,
            preProposalInitialAction: values.preProposalInitialAction,
            access: accessValue,
          },
        })
        .json<Profile>()
    }
    if (accessValue === PreProposalInitialAcccessType.Proposal) {
      router.push("/proposal/investor-profile")
      return
    }
    if (router.query.originPage === "opportunity") {
      router.push(
        `/opportunities/unlock/investor-profile?originPage=${router.query.originPage}`,
      )
    }
    router.push("/opportunities/unlock/investor-profile")
  }

  if (isUserStatusLoading) {
    return null
  }

  //redirect to 404 page if user is disqualified
  if (userStatusData?.status === UserQualificationStatus.Disqualified) {
    router.push("/404")
    return null
  }

  const FooterAction = () => {
    const { values, submitForm } =
      useFormikContext<Pick<Profile, "preProposalInitialAction">>()
    return (
      <Button
        type="submit"
        colorScheme="primary"
        isFullWidth={isMobileView}
        disabled={!values?.preProposalInitialAction}
        onClick={submitForm}
      >
        {t("unlock.button.getStarted")}
      </Button>
    )
  }

  return (
    <Formik<ProposalInitialActionProps>
      enableReinitialize
      initialValues={{ preProposalInitialAction: "" }}
      onSubmit={handleSubmit}
    >
      {(formikProps) => {
        return (
          <ModalLayout
            title={t("unlock.page.title")}
            description={t("unlock.page.description")}
            header={
              <ModalHeader
                boxShadow="0 0 0 4px var(--chakra-colors-gray-900)"
                headerRight={
                  <Button
                    variant="ghost"
                    colorScheme="primary"
                    onClick={router.back}
                  >
                    {t("common:button.exit")}
                  </Button>
                }
              />
            }
            footer={
              <ModalFooter position="fixed" bottom="0" bgColor="gray.850">
                <FooterAction />
              </ModalFooter>
            }
          >
            <Container
              maxW="5xl"
              p="0"
              py={{ base: 8, md: 24 }}
              mb={{ base: 8, md: 0 }}
              {...(isMobileView && { height: "100vh" })}
            >
              <Stack flexDirection={{ base: "column", md: "row" }}>
                <Flex
                  direction="column"
                  maxW={{ base: "sm", md: "xs" }}
                  flex="1"
                >
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">
                    {formatMinutes(2, lang)}
                  </Text>
                  <Heading
                    fontSize={{ base: "2xl", md: "3xl" }}
                    mb={{ base: 4, md: 6 }}
                  >
                    {t("unlock.heading")}
                  </Heading>
                  <Text fontSize="sm" color="gray.400">
                    {t("unlock.sideDescription")}
                  </Text>
                </Flex>
                <Center px={{ base: 0, md: 16 }} py={{ base: 6, md: 0 }}>
                  <Divider
                    border="1px solid --chakra-colors-gray-700"
                    orientation={isMobileView ? "horizontal" : "vertical"}
                    height="full"
                  />
                </Center>
                <Flex maxW="lg" direction="column" flex="2">
                  <Trans
                    i18nKey="opportunities:unlock.subHeading"
                    components={[
                      <Text fontSize="md" mb="2" key="0" />,
                      <UnorderedList
                        color="gray.500"
                        fontSize="sm"
                        mb="8"
                        key="1"
                      />,
                      <ListItem key="2" />,
                    ]}
                  />
                  <Form style={{ width: "100%" }}>
                    <VStack
                      spacing={{ base: 6, md: 8 }}
                      alignItems="start"
                      maxW="lg"
                    >
                      <Text fontSize="md">{t("unlock.options.heading")}</Text>

                      <RadioGroupControl
                        mt="0"
                        name="preProposalInitialAction"
                        variant="filled"
                        onChange={async (
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                          await formikProps.setFieldValue(
                            "preProposalInitialAction",
                            event.target.value,
                          )
                        }}
                      >
                        {Object.values(PreProposalInitialActionType).map(
                          (option) => (
                            <Radio
                              alignItems="flex-start"
                              key={option}
                              variant="filled"
                              value={option}
                              boxShadow="0px 0px 24px rgba(0, 0, 0, 0.75)"
                            >
                              <Text fontSize="md">
                                {t(`unlock.options.${option}`)}
                                <Tooltip
                                  hasArrow
                                  label={t(`unlock.tooltip.${option}`)}
                                  placement="bottom"
                                >
                                  <chakra.span ps="2">
                                    <InfoIcon color="primary.500" />
                                  </chakra.span>
                                </Tooltip>
                              </Text>
                              {option ===
                                PreProposalInitialActionType.StartInvesting && (
                                <Text
                                  fontSize="xs"
                                  display="inline-flex"
                                  bgColor="primary.800"
                                  color="primary.300"
                                  mt="2"
                                  px="2"
                                  py="1"
                                  borderRadius="50"
                                >
                                  {t(`unlock.options.recommended`)}
                                </Text>
                              )}
                            </Radio>
                          ),
                        )}
                      </RadioGroupControl>
                    </VStack>
                  </Form>
                </Flex>
              </Stack>
            </Container>
          </ModalLayout>
        )
      }}
    </Formik>
  )
}

export default withPageAuthRequired(BuildOpportunityUnlockScreen)
