import { Formik } from "formik"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { useCallback } from "react"
import * as Yup from "yup"

import ModalLayout from "../ModalLayout"
import Footer from "./Footer"
import Header from "./Header"
import {
  accountTypes,
  countries,
  currencies,
  fillDetailsInitialValues,
} from "./mocks"
import { Step, Stepper, StepperProvider } from "./Stepper"
import RestoreModal from "./Stepper/RestoreModal"
import AddAssetOrLiability from "./Steps/AddAssetOrLiability"
import AddBankAccount from "./Steps/AddBankAccount"
import FillDetails, { FillDetailsValues } from "./Steps/FillDetails"
import { AssetOrLiability, BankAccountType } from "./types"

type Props = {
  assets: AssetOrLiability[]
  bankAccountTypes: BankAccountType[]
  onSave?: () => void
}

const formSchema = Yup.object().shape({
  bankName: Yup.string().max(128),
  accountType: Yup.string().oneOf(
    accountTypes.map((accountType) => accountType.value),
  ),
  country: Yup.string().oneOf(countries.map((country) => country.value)),
  currency: Yup.string().oneOf(currencies.map((currency) => currency.value)),
  balance: Yup.number().positive(),
  interestRate: Yup.number().min(1).max(100),
})

const AssetAndLiabilityWizard: React.FC<Props> = ({
  assets = [],
  bankAccountTypes = [],
  onSave,
}) => {
  const { t } = useTranslation("wealthAddAssets")

  const router = useRouter()

  const onClose = useCallback(() => {
    router.back()
  }, [router])

  const onSubmit = useCallback(
    async (values: FillDetailsValues) => {
      await fetch("/api/wealth/assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.bankName,
          type: values.accountType,
          tags: [
            {
              name: values.bankName,
            },
          ],
          valuations: [
            {
              amount: Number(values.balance),
              currencyCode: values.currency,
              currencyToUsdFxRate: Number(values.balance), // Should be set by the backend?
              amountInUsd: Number(values.balance), // Should be set by the backend?
              originCode: `${values.country}T`, // Does it still needs 3 characters?
              valuatedAt: "2022-02-04T17:22:00.000Z", // should be set by the backend?
            },
          ],
          bankAccount: {
            bankName: values.bankName,
            countryCode: values.country,
            interestRate: Number(values.interestRate),
            description: "TODO",
            accountType: values.accountType,
            ownership: Number(values.balance), // Should be set by the backend?
            startDate: "2021-10-26T17:22:00.000Z", // Should be set by the backend?
            tenureInYears: 4,
          },
        }),
      })

      onSave?.()

      router.push("/wealth-overview")
    },
    [onSave, router],
  )

  const onSaveAndExit = useCallback(() => {
    router.back()
    onSave?.()
  }, [onSave, router])

  return (
    <Formik
      initialValues={fillDetailsInitialValues}
      validationSchema={formSchema}
      onSubmit={onSubmit}
    >
      <StepperProvider>
        <ModalLayout
          title={t("seo.page.title")}
          description={t("seo.page.description")}
          header={<Header onSave={onSaveAndExit} />}
          footer={<Footer onClose={onClose} />}
        >
          <Stepper
            steps={{
              [Step.ADD_ASSETS_OR_LIABILITIES]: (
                <AddAssetOrLiability assets={assets} />
              ),
              [Step.ADD_BANK_ACCOUNTS]: (
                <AddBankAccount bankAccountTypes={bankAccountTypes} />
              ),
              [Step.FILL_DETAILS]: <FillDetails />,
            }}
          />
        </ModalLayout>
        <RestoreModal />
      </StepperProvider>
    </Formik>
  )
}

AssetAndLiabilityWizard.displayName = "AssetAndLiabilityWizard"

export default AssetAndLiabilityWizard
