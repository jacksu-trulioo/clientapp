import useTranslation from "next-translate/useTranslation"
import * as Yup from "yup"

import {
  CountryCode,
  InterestedInvestments,
  InvestmentExperience,
  PriorInvestment,
  RegionCode,
  User,
  YesOrNo,
} from "~/services/mytfo/types"
import countryCodes from "~/utils/data/countryCodes"
import regionCodes from "~/utils/data/regionCodes"

import { FormControlProps } from ".."

export interface InvestorProfileFormProps extends FormControlProps {
  handleSubmit: () => Promise<void>
}

const getInitialValues = (user?: User) => ({
  firstName: user?.profile?.firstName,
  lastName: user?.profile?.lastName,
  countryOfResidence: user?.profile?.countryOfResidence,
  investorSurvey: user?.profile?.investorSurvey,
  nationality: user?.profile?.nationality,
  region: user?.profile?.region,
  phoneCountryCode: user?.profile?.phoneCountryCode,
  phoneNumber: user?.profile?.phoneNumber,
  preProposalInitialAction: user?.profile?.preProposalInitialAction,
  isTaxableInUS:
    user?.profile.isTaxableInUS !== null
      ? user?.profile.isTaxableInUS // Consider creating a sharable transformer for this.
        ? ("yes" as const)
        : ("no" as const)
      : undefined,
  isDefinedSophisticatedByCMA:
    user?.profile.isDefinedSophisticatedByCMA !== null
      ? user?.profile.isDefinedSophisticatedByCMA // Consider creating a sharable transformer for this.
        ? ("yes" as const)
        : ("no" as const)
      : undefined,
  isAccreditedByCBB:
    user?.profile.isAccreditedByCBB !== null
      ? user?.profile.isAccreditedByCBB // Consider creating a sharable transformer for this.
        ? ("yes" as const)
        : ("no" as const)
      : undefined,
})

export const getPersonalInfoInitialValues = (user?: User) =>
  Object.assign({}, getInitialValues(user), {
    nationality: user?.profile.nationality || undefined,
    region: user?.profile.region || undefined,
    phoneCountryCode: user?.profile.phoneCountryCode || "",
    phoneNumber: user?.profile.phoneNumber || "",
    isTaxableInUS:
      user?.profile.isTaxableInUS !== null
        ? user?.profile.isTaxableInUS // Consider creating a sharable transformer for this.
          ? ("yes" as const)
          : ("no" as const)
        : undefined,
    isDefinedSophisticatedByCMA:
      user?.profile.isDefinedSophisticatedByCMA !== null
        ? user?.profile.isDefinedSophisticatedByCMA // Consider creating a sharable transformer for this.
          ? ("yes" as const)
          : ("no" as const)
        : undefined,
    isAccreditedByCBB:
      user?.profile.isAccreditedByCBB !== null
        ? user?.profile.isAccreditedByCBB // Consider creating a sharable transformer for this.
          ? ("yes" as const)
          : ("no" as const)
        : undefined,

    preProposalInitialAction: user?.profile?.preProposalInitialAction,
  })

export const useBaseSchema = () => {
  const { t } = useTranslation("common")

  return Yup.object({
    firstName: Yup.string().required(t("common:errors.required")),
    lastName: Yup.string().required(t("common:errors.required")),
    countryOfResidence: Yup.mixed<CountryCode>()
      // oneOf should accept readonly array.
      // https://github.com/jquense/yup/issues/1298
      .oneOf([...countryCodes], t("common:errors.required"))
      .required(t("common:errors.required")),
  })
}

export const usePersonalInfoSchema = () => {
  const { t } = useTranslation("common")
  const baseSchema = useBaseSchema()

  return baseSchema.concat(
    Yup.object({
      nationality: Yup.mixed<CountryCode>()
        // oneOf should accept readonly array.
        // https://github.com/jquense/yup/issues/1298
        .oneOf([...countryCodes], t("common:errors.required"))
        .required(t("common:errors.required")),
      region: Yup.mixed<RegionCode>().when("nationality", {
        is: "SA",
        then: Yup.mixed<RegionCode>()
          // oneOf should accept readonly array.
          // https://github.com/jquense/yup/issues/1298
          .oneOf([...regionCodes], t("common:errors.required"))
          .required(t("common:errors.required")),
      }),

      phoneCountryCode: Yup.string().required(t("common:errors.required")),
      phoneNumber: Yup.string()
        .matches(/^[0-9]*$/, t("common:errors.numberAllowed"))
        .required(t("common:errors.required"))
        .when("phoneCountryCode", {
          is: (value: string) => {
            return value === "+966" || value === "+971"
          },

          then: Yup.string()
            .required(t("common:errors.required"))
            .max(
              9,
              t("common:errors.phoneNumberLength", {
                digit: 9,
              }),
            )
            .min(
              9,
              t("common:errors.phoneNumberLength", {
                digit: 9,
              }),
            )
            .nullable(),
        })
        .when("phoneCountryCode", {
          is: (value: string) => {
            return (
              value === "+974" ||
              value === "+965" ||
              value === "+968" ||
              value === "+973"
            )
          },
          then: Yup.string()
            .required(t("common:errors.required"))
            .max(
              8,
              t("common:errors.phoneNumberLength", {
                digit: 8,
              }),
            )
            .min(
              8,
              t("common:errors.phoneNumberLength", {
                digit: 8,
              }),
            )
            .nullable(),
        })
        .when("phoneCountryCode", {
          is: (value: string) => {
            return (
              value !== "+966" &&
              value !== "+965" &&
              value !== "+973" &&
              value !== "+968" &&
              value !== "+974" &&
              value !== "+971"
            )
          },
          then: Yup.string()
            .required(t("common:errors.required"))
            .max(
              15,
              t("common:errors.phoneNumberLengthMax", {
                digit: 15,
              }),
            )
            .nullable(),
        }),
      isTaxableInUS: Yup.mixed<YesOrNo>()
        .oneOf(["yes", "no"])
        .required(t("common:errors.required")),
      isDefinedSophisticatedByCMA: Yup.mixed<YesOrNo>().when("nationality", {
        is: "SA",
        then: Yup.mixed<YesOrNo>()
          .oneOf(["yes", "no"])
          .required(t("common:errors.required")),
      }),
      isAccreditedByCBB: Yup.mixed<YesOrNo>().when("nationality", {
        is: "SA",
        otherwise: Yup.mixed<YesOrNo>()
          .oneOf(["yes", "no"])
          .required(t("common:errors.required")),
      }),
    }),
  )
}

export const useMinimumAmountSchema = () => {
  const { t } = useTranslation("common")

  return Yup.object().shape({
    investorSurvey: Yup.object().shape({
      investMinimumAmount: Yup.mixed<YesOrNo>()
        .oneOf(["yes", "no"])
        .required(t("common:errors.required")),
      whenToStartInvestment: Yup.string().when("investMinimumAmount", {
        is: "yes",
        then: Yup.string()
          .min(1, t("common:errors.required"))
          .required(t("common:errors.required")),
      }),
    }),
  })
}

export const getMinimumAmountInitialValues = (user?: User) => {
  return Object.assign({}, getInitialValues(user), {
    investorSurvey: {
      investMinimumAmount:
        user?.profile.investorSurvey &&
        user?.profile.investorSurvey?.investMinimumAmount !== null
          ? user?.profile.investorSurvey?.investMinimumAmount
            ? ("yes" as const)
            : ("no" as const)
          : undefined,
      whenToStartInvestment:
        user?.profile.investorSurvey?.whenToStartInvestment || undefined,
    },
  })
}

export const getPriorExperienceInitialValues = (user?: User) => {
  return Object.assign({}, getInitialValues(user), {
    investorSurvey: {
      priorInvExperience:
        user?.profile?.investorSurvey?.priorInvExperience?.length !== 0
          ? user?.profile.investorSurvey?.priorInvExperience
          : undefined,
      otherPriorDetails:
        user?.profile?.investorSurvey?.otherPriorDetails || undefined,
    },
  })
}

export const usePriorExperienceSchema = () => {
  const { t } = useTranslation("common")

  return Yup.object().shape({
    investorSurvey: Yup.object().shape({
      priorInvExperience: Yup.array()
        .of(Yup.string().oneOf(Object.keys(PriorInvestment)))
        .min(1, t("common:errors.required"))
        .required(t("common:errors.required")),
      otherPriorDetails: Yup.string().when("priorInvExperience", {
        is: (value: string[]) => {
          return value?.includes("Other")
        },
        then: Yup.string().required(t("common:errors.required")),
        otherwise: Yup.string(),
      }),
    }),
  })
}

export const getInterestedInvestmentInitialValues = (user?: User) =>
  Object.assign({}, getInitialValues(user), {
    investorSurvey: {
      interestedInvestments:
        user?.profile.investorSurvey?.interestedInvestments?.length !== 0
          ? user?.profile.investorSurvey?.interestedInvestments
          : undefined,
      otherInterestedInvDetails:
        user?.profile?.investorSurvey?.otherInterestedInvDetails || undefined,
    },
  })

export const useInterestedInvestmentSchema = () => {
  const { t } = useTranslation("common")

  return Yup.object().shape({
    investorSurvey: Yup.object().shape({
      interestedInvestments: Yup.array()
        .of(Yup.string().oneOf(Object.keys(InterestedInvestments)))
        .min(1, t("common:errors.required"))
        .required(t("common:errors.required")),
      otherInterestedInvDetails: Yup.string().when("interestedInvestments", {
        is: (value: string[]) => {
          return value?.includes("Other")
        },
        then: Yup.string().required(t("common:errors.required")),
        otherwise: Yup.string(),
      }),
    }),
  })
}

export const getInvestmentExperienceInitialValues = (user?: User) =>
  Object.assign({}, getInitialValues(user), {
    investorSurvey: {
      investmentExperience:
        user?.profile.investorSurvey?.investmentExperience || undefined,
    },
  })

export const useInvestmentExperienceSchema = () => {
  const { t } = useTranslation("common")

  return Yup.object().shape({
    investorSurvey: Yup.object().shape({
      investmentExperience: Yup.string()
        .oneOf(Object.values(InvestmentExperience))
        .required(t("common:errors.required")),
    }),
  })
}
