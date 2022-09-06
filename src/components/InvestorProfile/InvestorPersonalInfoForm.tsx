import {
  Box,
  Center,
  Container,
  Divider,
  Flex,
  HStack,
  ListItem,
  Stack,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/layout"
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal"
import {
  Button,
  chakra,
  FormControl,
  FormLabel,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import { Form, Formik } from "formik"
import { motion } from "framer-motion"
import produce from "immer"
import ky from "ky"
import Trans from "next-translate/Trans"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import { mutate } from "swr"

import {
  useCountryList,
  usePhoneCountryCodeList,
  useRegionList,
} from "~/hooks/useList"
import { useUser } from "~/hooks/useUser"
import { Profile, User } from "~/services/mytfo/types"

import { InputControl, Logo, Radio, RadioGroupControl, SelectControl } from ".."
import {
  getPersonalInfoInitialValues,
  usePersonalInfoSchema,
} from "./InvestorProfile.schema"
import InvestorProfileFormActions from "./InvestorProfileFormActions"
import { useInvestorProfileFormContext } from "./InvestorProfileFormContext"
import InvesterProfileTitleBox from "./InvestorProfileTitleBox"

const InvestorPersonalInfoForm = React.forwardRef<HTMLDivElement, unknown>(
  function InvestorPersonalInfoForm(_props, _ref) {
    const { ref, handleSubmit } = useInvestorProfileFormContext()
    const { user } = useUser()
    const { t, lang } = useTranslation("proposal")
    const countryList = useCountryList()
    const regionList = useRegionList()
    const phoneCountryCodeList = usePhoneCountryCodeList()
    const { onOpen, onClose, isOpen } = useDisclosure()

    const direction = lang === "ar" ? "rtl" : "ltr"

    const [modalName, setModalName] = React.useState("")
    const isMobileView = useBreakpointValue({ base: true, md: false })
    const isTabletView = useBreakpointValue({
      base: false,
      md: true,
      lg: false,
    })

    const isDesktopView = useBreakpointValue({
      base: false,
      md: false,
      lg: true,
    })
    const validationSchema = usePersonalInfoSchema()
    const initialValues = getPersonalInfoInitialValues(user)

    const handleModal = (name: string) => {
      setModalName(name)
      onOpen()
    }

    function showInfoModal() {
      return (
        <Modal
          onClose={onClose}
          size={isMobileView ? "xs" : "2xl"}
          isOpen={isOpen}
          isCentered={true}
          autoFocus={false}
          returnFocusOnClose={false}
        >
          <ModalOverlay />
          <ModalContent maxHeight="590px" height="full">
            <Stack isInline alignItems="center" p="4" justifyContent="start">
              <Logo height="28px" />
            </Stack>
            <ModalCloseButton
              onClick={onClose}
              {...(lang === "ar" && { left: "calc(100% - 40px)" })}
            />
            <ModalHeader marginTop="0" textAlign="start">
              {t(
                `proposal:investorProfile.personalInformation.radio.${modalName}.modal.title`,
              )}
            </ModalHeader>
            <ModalBody
              textAlign="start"
              maxH="sm"
              overflowY="auto"
              height="full"
            >
              <Trans
                i18nKey={`proposal:investorProfile.personalInformation.radio.${modalName}.modal.description`}
                components={[
                  <Text pb="4" key="0" />,
                  <UnorderedList
                    spacing="4"
                    fontSize="sm"
                    color="gray.400"
                    key="1"
                  />,
                  <ListItem key="2" />,
                  <br key="3" />,
                ]}
              />
            </ModalBody>

            <ModalFooter borderTop="1px" borderColor="gray.800">
              <Button colorScheme="primary" variant="solid" onClick={onClose}>
                {t(
                  `proposal:investorProfile.personalInformation.radio.${modalName}.modal.button.label`,
                )}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )
    }

    const updateProfileDetailsForHubspot = async (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const updateObj = {
        ...initialValues,
        isTaxableInUS: initialValues.isTaxableInUS === "yes",
        isDefinedSophisticatedByCMA:
          initialValues.isDefinedSophisticatedByCMA === "yes",
        isAccreditedByCBB: initialValues.isAccreditedByCBB === "yes",
        [event.target.name]: event.target.value === "yes",
      }

      const profile = await ky
        .put("/api/user/profile", {
          json: updateObj,
        })
        .json<Profile>()

      await mutate<User>(
        "/api/user",
        produce((user) => {
          user.profile = profile
        }),
      )
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          py={{ base: 2, md: 16 }}
        >
          <InvesterProfileTitleBox
            heading={t("investorProfile.personalInformation.title")}
            infoHeading={t(
              "investorProfile.personalInformation.questionInfo.title",
            )}
            infoDescription={t(
              "investorProfile.personalInformation.questionInfo.description",
            )}
          />

          <Center px={{ base: 0, md: "64px" }} py={{ base: "32px", md: 0 }}>
            <Divider
              orientation={isMobileView ? "horizontal" : "vertical"}
              {...(isDesktopView && {
                sx: {
                  position: "absolute",
                  top: "24",
                  bottom: "24",
                  height: "80%",
                },
              })}
              {...(isTabletView && {
                sx: {
                  position: "absolute",
                  top: "20",
                  bottom: "25",
                  height: "50%",
                },
              })}
            />
          </Center>

          <Container
            flex={isTabletView ? "2" : "1"}
            px="0"
            {...(isMobileView && { mb: "36" })}
            h="100vh"
          >
            <Formik<Profile>
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {(formikProps) => (
                <Form style={{ width: "100%" }}>
                  <VStack spacing={["6", "8"]} alignItems="start" maxW="sm">
                    <Box mt="0" pt="0" w="full">
                      <FormControl>
                        <HStack>
                          <FormLabel
                            color="gray.400"
                            display="flex"
                            alignItems="center"
                            pb="0"
                            mb="0"
                          >
                            {t(
                              "investorProfile.personalInformation.select.phoneCountryCode.label",
                            )}
                          </FormLabel>
                          {user?.phoneNumberVerified ? (
                            <Text
                              color="shinyShamrock.800"
                              fontSize="xs"
                              px="2"
                              py="1"
                              bgColor="shinyShamrock.800WithOpacity"
                              borderRadius="6px"
                            >
                              {t("common:labels.verified")}
                            </Text>
                          ) : (
                            <Text
                              color="warningRed.300"
                              fontSize="xs"
                              px="2"
                              py="1"
                              bgColor="warningRed.300WithOpacity"
                              borderRadius="6px"
                            >
                              {t("common:labels.notVerified")}
                            </Text>
                          )}
                        </HStack>
                        <Stack
                          alignItems="flex-start"
                          direction={
                            direction === "rtl" ? "row-reverse" : "row"
                          }
                        >
                          <SelectControl
                            name="phoneCountryCode"
                            aria-label="phoneCountryCode"
                            selectProps={{
                              placeholder: t(
                                "investorProfile.personalInformation.select.phoneCountryCode.placeholder",
                              ),
                              options: phoneCountryCodeList,
                            }}
                            isDisabled={user?.phoneNumberVerified}
                            w="70%"
                            pl="0"
                            pr="2"
                          />
                          <InputControl
                            aria-label="phoneNumber"
                            name="phoneNumber"
                            pt="2"
                            isDisabled={user?.phoneNumberVerified}
                          />
                        </Stack>
                      </FormControl>
                    </Box>

                    <SelectControl
                      name="nationality"
                      aria-label="nationality"
                      label={t(
                        "investorProfile.personalInformation.select.nationality.label",
                      )}
                      selectProps={{
                        placeholder: t("common:select.placeholder"),
                        options: countryList,
                      }}
                    />

                    {formikProps.values.nationality === "SA" && (
                      <SelectControl
                        name="region"
                        aria-label="region"
                        label={t(
                          "investorProfile.personalInformation.select.region.label",
                        )}
                        selectProps={{
                          placeholder: t("common:select.placeholder"),
                          options: regionList,
                        }}
                      />
                    )}

                    {formikProps.values.nationality === "SA" && (
                      <RadioGroupControl
                        maxW={{ base: "full", md: "380px" }}
                        name="isDefinedSophisticatedByCMA"
                        direction={{ base: "column", md: "row" }}
                        {...(isMobileView && { variant: "filled" })}
                        label={t(
                          "investorProfile.personalInformation.radio.isDefinedSophisticatedByCMA.label",
                        )}
                        variant="filled"
                        modal={
                          <chakra.span
                            color="primary.500"
                            ms="2"
                            textDecoration="underline"
                            fontSize={{ base: "xs", md: "sm" }}
                            onClick={() =>
                              handleModal("isDefinedSophisticatedByCMA")
                            }
                            cursor="pointer"
                          >
                            {t(
                              "investorProfile.personalInformation.radio.isDefinedSophisticatedByCMA.learnMore",
                            )}
                          </chakra.span>
                        }
                      >
                        {["yes", "no"].map((option) => (
                          <Radio key={option} value={option} me="2">
                            <Text>
                              {t(
                                `proposal:investorProfile.personalInformation.radio.isDefinedSophisticatedByCMA.options.${option}.title`,
                              )}
                            </Text>
                          </Radio>
                        ))}
                      </RadioGroupControl>
                    )}

                    {formikProps.values.nationality &&
                      formikProps.values.nationality !== "SA" && (
                        <RadioGroupControl
                          onChange={updateProfileDetailsForHubspot}
                          name="isAccreditedByCBB"
                          direction={{ base: "column", md: "row" }}
                          w="full"
                          {...(isMobileView && { variant: "filled" })}
                          label={t(
                            "investorProfile.personalInformation.radio.isAccreditedByCBB.label",
                          )}
                          variant="filled"
                          modal={
                            <chakra.span
                              color="primary.500"
                              ms="2"
                              fontSize={{ base: "xs", md: "sm" }}
                              textDecoration="underline"
                              cursor="pointer"
                              onClick={() => handleModal("isAccreditedByCBB")}
                            >
                              {t(
                                "investorProfile.personalInformation.radio.isAccreditedByCBB.learnMore",
                              )}
                            </chakra.span>
                          }
                        >
                          {["yes", "no"].map((option) => (
                            <Radio key={option} value={option} me="2">
                              <Text>
                                {t(
                                  `proposal:investorProfile.personalInformation.radio.isAccreditedByCBB.options.${option}.title`,
                                )}
                              </Text>
                            </Radio>
                          ))}
                        </RadioGroupControl>
                      )}
                    {formikProps.values.nationality && (
                      <RadioGroupControl
                        onChange={updateProfileDetailsForHubspot}
                        name="isTaxableInUS"
                        {...(isMobileView && { variant: "filled" })}
                        label={t(
                          "investorProfile.personalInformation.radio.isTaxableInUS.label",
                        )}
                        direction={{ base: "column", md: "row" }}
                        w="full"
                        variant="filled"
                        tooltip={
                          <Trans
                            i18nKey="proposal:investorProfile.personalInformation.radio.isTaxableInUS.popover"
                            components={[
                              <Box key="0" />,
                              <Text
                                key="1"
                                textAlign={lang === "ar" ? "end" : "start"}
                              />,
                              <br key="2" />,

                              <UnorderedList
                                key="3"
                                {...(lang === "ar" && {
                                  dir: "rtl",
                                })}
                              />,
                              <ListItem key="4" />,
                              <UnorderedList
                                key="5"
                                listStyleType="none"
                                {...(lang === "ar" && {
                                  dir: "rtl",
                                })}
                              />,
                              <ListItem
                                key="6"
                                ms="1"
                                sx={{
                                  "&:before": {
                                    content: '"-"',
                                    position: "relative",
                                    insetStart: lang === "ar" ? "1" : "-1",
                                  },
                                  textIndent: "-5px",
                                }}
                              />,
                            ]}
                          />
                        }
                      >
                        {["yes", "no"].map((option) => (
                          <Radio key={option} value={option} me="2">
                            <Text>
                              {t(
                                `proposal:investorProfile.personalInformation.radio.isTaxableInUS.options.${option}.title`,
                              )}
                            </Text>
                          </Radio>
                        ))}
                      </RadioGroupControl>
                    )}
                  </VStack>

                  <InvestorProfileFormActions ref={ref} {...formikProps} />
                </Form>
              )}
            </Formik>
          </Container>
          {showInfoModal()}
        </Flex>
      </motion.div>
    )
  },
)

export default React.memo(InvestorPersonalInfoForm)
