import { StyleProps, useDisclosure } from "@chakra-ui/react"
import { Formik } from "formik"
import produce from "immer"
import ky from "ky"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { useCallback } from "react"
import useSWR, { mutate } from "swr"

import {
  GetSupportPopUp,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "~/components"
import { Preference } from "~/services/mytfo/types"
import { triggerEventWithStep } from "~/utils/kycGoogleEventsHelper"

import ModalLayout from "../ModalLayout"
import Footer from "./Footer"
import Header from "./Header"
import { useKycInvestmentExperienceSchema } from "./KycInvestmentExperience.schema"
import {
  useKycInvestmentExperienceWizard,
  withKycInvestmentExperienceWizard,
} from "./KycInvestmentExperienceContext"
import { CurrentInvestments } from "./Steps/CurrentInvestments"
import { HoldingInformation } from "./Steps/HoldingInformation"
import { ReceivedInvestmentAdvisory } from "./Steps/ReceivedInvestmentAdvisory"
import StepLayout from "./Steps/StepLayout"
import { TransactionsInformation } from "./Steps/TransactionsInformation"
import {
  KycInvestmentExperienceResponse,
  KycInvestmentExperienceValues,
} from "./types"
import {
  parseKycInvestmentResponse,
  prepareKycInvestmentRequest,
} from "./utils"

const KycInvestmentExperience: React.VFC = () => {
  const { t } = useTranslation("kyc")
  const kycInvestmentExperienceSchema = useKycInvestmentExperienceSchema()
  const { data: preferredLanguage } = useSWR<Preference>("/api/user/preference")

  const { next, step, isLast } = useKycInvestmentExperienceWizard()
  const {
    onOpen: onOpenSupport,
    onClose: onCloseSupport,
    isOpen: isOpenSupport,
  } = useDisclosure()
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    containerRef?.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [step])

  const { push, reload } = useRouter()

  const handleSaveAndExit = React.useCallback(async () => {
    if (preferredLanguage?.language === "AR") {
      push("/ar")
      reload()
    } else {
      push("/")
    }
  }, [preferredLanguage?.language, push, reload])

  const ChapterHeaderStepper = React.useMemo(
    (props?: StyleProps) => (
      <Stepper activeStep={2} orientation="horizontal" {...props}>
        <Step index={0} completed />
        <Step index={1}>
          <StepContent>
            <StepLabel color="white" fontWeight="bold">
              {t("chapterSelection.chapterTwo.stepper.title")}
            </StepLabel>
          </StepContent>
        </Step>
        <Step index={2} />
      </Stepper>
    ),
    [t],
  )

  const { data: kycInvestmentExperience, error } =
    useSWR<KycInvestmentExperienceResponse>(
      "/api/user/kyc/investment-experience",
    )

  const onSave = useCallback(
    async (body: KycInvestmentExperienceValues) => {
      const payload = produce(kycInvestmentExperience, (draft) => {
        return {
          ...draft,
          ...prepareKycInvestmentRequest(body),
        }
      })
      const res = await ky
        .put("/api/user/kyc/investment-experience", {
          json: payload,
        })
        .json<KycInvestmentExperienceResponse>()
      await mutate<KycInvestmentExperienceResponse>(
        "/api/user/kyc/investment-experience",
        res,
      )
      if (isLast) {
        push("/kyc")
      } else {
        triggerEventWithStep(step, "kycInvestmentExperience")
        next()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [next, kycInvestmentExperience, isLast, step],
  )

  if (!kycInvestmentExperience || error) {
    return null
  }

  const initialValues: KycInvestmentExperienceValues =
    parseKycInvestmentResponse(kycInvestmentExperience, step)

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onSave}
        validationSchema={kycInvestmentExperienceSchema}
        enableReinitialize
      >
        <ModalLayout
          title={t("investmentExperience.page.title")}
          description={t("investmentExperience.page.description")}
          header={
            <Header
              onExit={handleSaveAndExit}
              headerLeft={ChapterHeaderStepper}
              onOpenSupport={onOpenSupport}
            />
          }
          footer={<Footer onSubmit={onSave} />}
          containerRef={containerRef}
        >
          <StepLayout>
            <CurrentInvestments />
            <HoldingInformation />
            <ReceivedInvestmentAdvisory />
            <TransactionsInformation />
          </StepLayout>
        </ModalLayout>
      </Formik>
      <GetSupportPopUp isOpen={isOpenSupport} onClose={onCloseSupport} />
    </>
  )
}

KycInvestmentExperience.displayName = "KycInvestmentExperience"

export default withKycInvestmentExperienceWizard(KycInvestmentExperience)
