import { isValid, parse } from "date-fns"
import subYears from "date-fns/subYears"
import useTranslation from "next-translate/useTranslation"
import * as Yup from "yup"

import { FormControlProps } from "~/components"
import {
  AddressNotMatchTaxResidence,
  KycSourceOfFunds,
  NameTitle,
  NationalityNotMatchTaxResidence,
  NoTinReason,
  PepCheck,
  PhoneNumberNotMatchTaxResidence,
  YesOrNo,
} from "~/services/mytfo/types"
import {
  alphaEnglishAllowedRegex,
  alphaEnglishSpecialAllowedRegex,
  alphaNumericSpaceAllowedRegex,
  alphaNumericSpaceSpecialAllowedRegex,
} from "~/utils/constants/regex"

export interface KycPersonalInformationFormProps extends FormControlProps {
  handleSubmit: () => Promise<void>
}

export const usePersonalInfoSchema = () => {
  const { t } = useTranslation("common")

  return Yup.object({
    firstName: Yup.string()
      .matches(alphaEnglishAllowedRegex, {
        excludeEmptyString: true,
        message: t("common:errors.alphaEnglishAllowed"),
      })
      .max(50, t("common:errors.maxChar"))
      .required(t("common:errors.required")),
    lastName: Yup.string()
      .matches(alphaEnglishAllowedRegex, {
        excludeEmptyString: true,
        message: t("common:errors.alphaEnglishAllowed"),
      })
      .max(50, t("common:errors.maxChar"))
      .required(t("common:errors.required")),
    middleName: Yup.string()
      .matches(alphaEnglishSpecialAllowedRegex, {
        excludeEmptyString: true,
        message: t("common:errors.alphaEnglishSpecialAllowed"),
      })
      .max(50, t("common:errors.maxChar"))
      .required(t("common:errors.required")),
    title: Yup.mixed<NameTitle>().required(t("common:errors.required")),
  })
}
function parseDateString(_value: string, originalValue: string) {
  return isValid(originalValue)
    ? originalValue
    : parse(
        originalValue.split("/").reverse().join("-"),
        "yyyy-MM-dd",
        new Date(),
      )
}

export const usePersonalInfoCountryDobSchema = () => {
  const { t } = useTranslation("common")

  return Yup.object({
    gender: Yup.string().required(t("common:errors.required")).nullable(),
    dateOfBirth: Yup.date()
      .transform(parseDateString)
      .min(
        subYears(new Date(), 85),
        t(
          "kyc:personalInformation.KycPersonalInfoCountryDob.input.dateOfBirth.errors.minMaxDOB",
        ),
      )
      .max(
        subYears(new Date(), 18),
        t(
          "kyc:personalInformation.KycPersonalInfoCountryDob.input.dateOfBirth.errors.minMaxDOB",
        ),
      )
      .required(t("common:errors.required"))
      .typeError(
        t(
          "kyc:personalInformation.KycPersonalInfoCountryDob.input.dateOfBirth.errors.invalid",
        ),
      )
      .nullable(),
    countryOfBirth: Yup.string()
      .required(t("common:errors.required"))
      .nullable(),
    placeOfBirth: Yup.string()
      .matches(/^[a-zA-Z][a-zA-Z0-9\s]*$/, {
        excludeEmptyString: true,
        message: t("common:errors.alphaEnglishNumericSpaceAllowed"),
      })
      .max(50, t("common:errors.maxChar"))
      .required(t("common:errors.required"))
      .nullable(),
    nationality: Yup.string().required(t("common:errors.required")).nullable(),
    otherNationality: Yup.string()
      .notOneOf(
        [Yup.ref("nationality")],
        t(
          "kyc:personalInformation.KycPersonalInfoCountryDob.select.otherNationality.errors.notEqualNationality",
        ),
      )
      .nullable(),
  })
}

export const usePersonalInfoOtherAddressSchema = () => {
  const { t } = useTranslation("common")

  return Yup.object().shape({
    hasResidenceAddressOutsideSaudiArabia: Yup.mixed<YesOrNo>()
      .oneOf(["yes", "no"])
      .required(t("common:errors.required")),
    address2: Yup.object().when("hasResidenceAddressOutsideSaudiArabia", {
      is: (value: string) => value === "yes",
      then: (schema) =>
        schema.shape({
          address: Yup.string()
            .trim()
            .matches(alphaNumericSpaceSpecialAllowedRegex, {
              excludeEmptyString: true,
              message: t(
                "common:errors.alphaEnglishNumericSpaceSpecialAllowed",
              ),
            })
            .max(50, t("common:errors.maxChar"))
            .required(t("common:errors.required"))
            .nullable(),
          city: Yup.string()
            .trim()
            .required(t("common:errors.required"))
            .max(50, t("common:errors.maxChar"))
            .matches(alphaEnglishAllowedRegex, {
              excludeEmptyString: true,
              message: t("common:errors.alphaEnglishAllowed"),
            })
            .nullable(),
          postcode: Yup.string()
            .matches(alphaNumericSpaceAllowedRegex, {
              excludeEmptyString: true,
              message: t("common:errors.alphaEnglishNumericSpaceAllowed"),
            })
            .max(50, t("common:errors.maxChar"))
            .nullable(),
          country: Yup.string()
            .required(t("common:errors.required"))
            .nullable(),
        }),
    }),
  })
}

export const usePepCheckSchema = () => {
  const { t } = useTranslation()
  return Yup.object().shape({
    pepCheck: Yup.object().shape({
      optionValue: Yup.string()
        .nullable(true)
        .required(t("common:errors.required")),
      dateOfAppointment: Yup.date().when("optionValue", {
        is: (value: PepCheck) => {
          return (
            value === PepCheck.YesIamPep || value === PepCheck.YesIamPepRelated
          )
        },
        then: Yup.date()
          .transform(parseDateString)
          .typeError(
            t(
              "kyc:personalInformation.KycPepCheck.input.dateOfAppointment.errors.valid",
            ),
          )
          .max(
            new Date(new Date().setHours(0, 0, 0, 0)),
            t(
              "kyc:personalInformation.KycPepCheck.input.dateOfAppointment.errors.future",
            ),
          )
          .nullable(true)
          .required(t("common:errors.required")),
        otherwise: Yup.date()
          .transform(parseDateString)
          .typeError(
            t(
              "kyc:personalInformation.KycPepCheck.input.dateOfAppointment.errors.valid",
            ),
          )
          .max(
            new Date(new Date().setHours(0, 0, 0, 0)),
            t(
              "kyc:personalInformation.KycPepCheck.input.dateOfAppointment.errors.future",
            ),
          )
          .nullable(true),
      }),
      fullLegalName: Yup.string()
        .matches(alphaEnglishAllowedRegex, {
          excludeEmptyString: true,
          message: t("common:errors.alphaEnglishAllowed"),
        })
        .max(50, t("common:errors.maxChar"))
        .when("optionValue", {
          is: (value: string) => {
            return value === PepCheck.YesIamPepRelated
          },
          then: Yup.string().nullable().required(t("common:errors.required")),
          otherwise: Yup.string().nullable(true),
        }),
      accountHolderRelationship: Yup.string().when("optionValue", {
        is: (value: string) => {
          return value === PepCheck.YesIamPepRelated
        },
        then: Yup.string().nullable(true).required(t("common:errors.required")),
        otherwise: Yup.string().nullable(true),
      }),
      jurisdiction: Yup.string().when("optionValue", {
        is: (value: string) => {
          return value === PepCheck.YesIamPepRelated
        },
        then: Yup.string().nullable(true).required(t("common:errors.required")),
        otherwise: Yup.string().nullable(true),
      }),
    }),
  })
}
export const useEmploymentDetailsSchema = () => {
  const { t } = useTranslation("common")

  return Yup.object({
    employmentActivity: Yup.string()
      .nullable()
      .required(t("common:errors.required")),
    employmentDetails: Yup.object({
      employmentSector: Yup.string().nullable(),
      yearsOfProfessionalExperience: Yup.number()
        .typeError(t("common:errors.onlyInteger"))
        .integer(t("common:errors.onlyInteger"))
        .min(0, t("common:errors.minNumberAllowed"))
        .max(99, t("common:errors.maxNumberAllowed"))
        .nullable(),
      jobTitle: Yup.string()
        .nullable()
        .max(50, t("common:errors.maxChar"))
        .matches(alphaEnglishAllowedRegex, {
          excludeEmptyString: true,
          message: t("common:errors.alphaEnglishAllowed"),
        }),
      areYouDirectorOfListedCompany: Yup.mixed<YesOrNo>().nullable(),
      sectorOfLastEmployment: Yup.string().nullable(),
      lastJobTitleHeld: Yup.string()
        .nullable()
        .matches(alphaEnglishAllowedRegex, {
          excludeEmptyString: true,
          message: t("common:errors.alphaEnglishAllowed"),
        }),
    }),
  })
}

export const useEmployerDetailsSchema = () => {
  const { t } = useTranslation("common")

  return Yup.object().shape({
    employerDetails: Yup.object().shape({
      country: Yup.string().nullable().required(t("common:errors.required")),
      nameOfCompany: Yup.string()
        .nullable()
        .max(50, t("common:errors.maxChar"))
        .matches(alphaNumericSpaceAllowedRegex, {
          excludeEmptyString: true,
          message: t("common:errors.alphaEnglishNumericSpaceAllowed"),
        })
        .required(t("common:errors.required")),
      buildingNumber: Yup.string()
        .nullable()
        .max(50, t("common:errors.maxChar"))
        .matches(alphaNumericSpaceSpecialAllowedRegex, {
          excludeEmptyString: true,
          message: t("common:errors.alphaEnglishNumericSpaceSpecialAllowed"),
        }),
      streetName: Yup.string()
        .nullable()
        .max(50, t("common:errors.maxChar"))
        .matches(alphaNumericSpaceSpecialAllowedRegex, {
          excludeEmptyString: true,
          message: t("common:errors.alphaEnglishNumericSpaceSpecialAllowed"),
        }),
      address: Yup.string()
        .nullable()
        .max(50, t("common:errors.maxChar"))
        .matches(alphaNumericSpaceSpecialAllowedRegex, {
          excludeEmptyString: true,
          message: t("common:errors.alphaEnglishNumericSpaceSpecialAllowed"),
        }),
      district: Yup.string()
        .nullable()
        .max(50, t("common:errors.maxChar"))
        .matches(/^[a-zA-Z][a-zA-Z\s]*$/, {
          excludeEmptyString: true,
          message: t("common:errors.alphaEnglishAllowed"),
        }),
      city: Yup.string()
        .nullable()
        .max(50, t("common:errors.maxChar"))
        .matches(alphaEnglishAllowedRegex, {
          excludeEmptyString: true,
          message: t("common:errors.alphaEnglishAllowed"),
        })
        .required(t("common:errors.required")),
      postcode: Yup.string()
        .matches(alphaNumericSpaceAllowedRegex, {
          excludeEmptyString: true,
          message: t("common:errors.alphaEnglishNumericSpaceAllowed"),
        })
        .max(50, t("common:errors.maxChar"))
        .required(t("common:errors.required"))
        .nullable(),
      phoneNumber: Yup.string()
        .matches(/^[0-9]*$/, t("common:errors.numberAllowed"))
        .when("phoneCountryCode", {
          is: (value: string) => {
            return value === "+966" || value === "+971"
          },

          then: Yup.string()
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
            .max(
              15,
              t("common:errors.phoneNumberLengthMax", {
                digit: 15,
              }),
            )
            .nullable(),
        }),
      estimatedNumberOfEmployees: Yup.string().nullable(),
      estimatedAnnualRevenue: Yup.string().nullable(),
      phoneCountryCode: Yup.string().nullable(),
    }),
  })
}

export const usePersonalInfoSSOSchema = () => {
  const { t } = useTranslation("kyc")
  return Yup.object().shape({
    nationalIdNumber: Yup.string()
      .matches(/^\d+$/, t("common:errors.numberAllowed"))
      .length(
        10,
        t(
          "personalInformation.kycPersonalInfoNationalId.input.nationalId.errors.lengthKSA",
        ),
      )
      .required(t("common:errors.required"))
      .nullable(),
    monthOfBirth: Yup.string().required(t("common:errors.required")),
    yearOfBirth: Yup.string().required(t("common:errors.required")),
  })
}

export const useAbsherOtherDetailsSchema = () => {
  const { t } = useTranslation("common")

  return Yup.object().shape({
    title: Yup.string().required(t("common:errors.required")),
    countryOfBirth: Yup.string()
      .trim()
      .required(t("common:errors.required"))
      .nullable(),
    placeOfBirth: Yup.string()
      .trim()
      .matches(/^[a-zA-Z][a-zA-Z0-9\s]*$/, {
        excludeEmptyString: true,
        message: t("common:errors.alphaEnglishNumericSpaceAllowed"),
      })
      .max(50, t("common:errors.maxChar"))
      .required(t("common:errors.required"))
      .nullable(),
    passportNumber: Yup.string()
      .trim()
      .matches(/^[a-zA-Z0-9]*$/, {
        excludeEmptyString: true,
        message: t("common:errors.alphaEnglishNumericAllowed"),
      })
      .max(10, t("common:errors.maxLength"))
      .required(t("common:errors.required"))
      .nullable(),
    otherNationality: Yup.string().nullable(),
    hasResidenceAddressOutsideSaudiArabia: Yup.mixed<YesOrNo>()
      .oneOf(["yes", "no"])
      .required(t("common:errors.required")),
    address2: Yup.object().when("hasResidenceAddressOutsideSaudiArabia", {
      is: (value: string) => value === "yes",
      then: (schema) =>
        schema.shape({
          address: Yup.string()
            .trim()
            .max(50, t("common:errors.maxChar"))
            .matches(alphaNumericSpaceSpecialAllowedRegex, {
              excludeEmptyString: true,
              message: t(
                "common:errors.alphaEnglishNumericSpaceSpecialAllowed",
              ),
            })
            .required(t("common:errors.required"))
            .nullable(),
          city: Yup.string()
            .trim()
            .required(t("common:errors.required"))
            .max(50, t("common:errors.maxChar"))
            .matches(alphaEnglishAllowedRegex, {
              excludeEmptyString: true,
              message: t("common:errors.alphaEnglishAllowed"),
            })
            .nullable(),
          postcode: Yup.string()
            .matches(alphaNumericSpaceAllowedRegex, {
              excludeEmptyString: true,
              message: t("common:errors.alphaEnglishNumericSpaceAllowed"),
            })
            .max(50, t("common:errors.maxChar"))
            .nullable(),
          country: Yup.string()
            .required(t("common:errors.required"))
            .nullable(),
        }),
    }),
  })
}
export const useKycReasonablenessCheckOneSchema = () => {
  const { t } = useTranslation("common")
  return Yup.object().shape({
    reasonablenessCheck: Yup.object()
      .shape({
        addressNotMatchTaxResidence: Yup.object().shape({
          checkValue: Yup.string()
            .nullable()
            .required(t("common:errors.required")),
          otherText: Yup.string()
            .nullable()
            .when("checkValue", {
              is: AddressNotMatchTaxResidence.AddressNotMatchTaxResidence5,
              then: Yup.string()
                .nullable()
                .max(50, t("common:errors.maxLength"))
                .required(t("common:errors.required"))
                .matches(/^[a-zA-Z0-9\s]*$/, {
                  excludeEmptyString: true,
                  message: t("common:errors.alphaEnglishNumericSpaceAllowed"),
                }),
              otherwise: Yup.string().nullable(),
            }),
        }),
      })
      .nullable(),
  })
}
export const useTaxInformationOneSchema = () => {
  const { t } = useTranslation("common")
  return Yup.object().shape({
    taxInformation: Yup.object().shape({
      locationOfMainTaxDomicile: Yup.string()
        .nullable()
        .required(t("common:errors.required")),
      taxableInUSA: Yup.mixed<YesOrNo>()
        .oneOf(["yes", "no"], "common:errors.onlyOne")
        .nullable()
        .required(t("common:errors.required")),
      tinInformation: Yup.array()
        .of(
          Yup.object().shape({
            countriesOfTaxResidency: Yup.string()
              .nullable()
              .required(t("common:errors.required")), // these constraints take precedence
          }),
        )
        .test(
          "unique",
          t(
            "kyc:personalInformation.kycTaxInformation.select.countriesOfTaxResidency.errors.unique",
          ),
          function (value) {
            const countryList = value?.map((x) => {
              if (x.countriesOfTaxResidency) return x.countriesOfTaxResidency
            })
            const uniqueList = Array.from(new Set(countryList))
            return countryList?.length === uniqueList.length
          },
        ),
    }),
  })
}

export const useKycReasonablenessCheckTwoSchema = () => {
  const { t } = useTranslation("common")
  return Yup.object().shape({
    reasonablenessCheck: Yup.object().shape({
      phoneNumberNotMatchTaxResidence: Yup.object().shape({
        checkValue: Yup.string()
          .nullable()
          .required(t("common:errors.required")),
        otherText: Yup.string()
          .nullable()
          .when("checkValue", {
            is: PhoneNumberNotMatchTaxResidence.PhoneNumberNotMatchTaxResidence2,
            then: Yup.string()
              .nullable()
              .max(50, t("common:errors.maxLength"))
              .matches(/^[a-zA-Z0-9\s]*$/, {
                excludeEmptyString: true,
                message: t("common:errors.alphaEnglishNumericSpaceAllowed"),
              })
              .required(t("common:errors.required")),
            otherwise: Yup.string().nullable(),
          }),
      }),
    }),
  })
}

export const useKycReasonablenessCheckThreeSchema = () => {
  const { t } = useTranslation("common")
  return Yup.object().shape({
    reasonablenessCheck: Yup.object().shape({
      nationalityNotMatchTaxResidence: Yup.object().shape({
        checkValue: Yup.string()
          .nullable()
          .required(t("common:errors.required")),
        otherText: Yup.string()
          .nullable()
          .when("checkValue", {
            is: NationalityNotMatchTaxResidence.NationalityNotMatchTaxResidence4,
            then: Yup.string()
              .nullable()
              .max(50, t("common:errors.maxLength"))
              .matches(/^[a-zA-Z0-9\s]*$/, {
                excludeEmptyString: true,
                message: t("common:errors.alphaEnglishNumericSpaceAllowed"),
              })
              .required(t("common:errors.required")),
            otherwise: Yup.string().nullable(),
          }),
      }),
    }),
  })
}

export const useIncomeDetailsSchema = () => {
  const { t } = useTranslation("common")

  return Yup.object({
    incomeDetails: Yup.object().shape({
      annualIncome: Yup.string().required(t("common:errors.required")),
      netWorth: Yup.string().required(t("common:errors.required")),
      sourceOfFunds: Yup.array().min(1, t("common:errors.atleastOne")),
      sourceOfWealth: Yup.array().min(1, t("common:errors.atleastOne")),
      sourceOfFundsOtherText: Yup.string()
        .nullable()
        .when("sourceOfFunds", {
          is: (value: string[]) => {
            return value.includes(KycSourceOfFunds.Other)
          },
          then: Yup.string()
            .nullable()
            .max(50, t("common:errors.maxLength"))
            .required(t("common:errors.required")),
          otherwise: Yup.string().nullable(),
        }),
    }),
  })
}
export const useTaxInformationTwoSchema = () => {
  const { t } = useTranslation("common")
  return Yup.object().shape({
    taxInformation: Yup.object().shape({
      tinInformation: Yup.array()
        .of(
          Yup.object().shape({
            globalTaxIdentificationNumber: Yup.string().when("haveNoTin", {
              is: false,
              then: Yup.string()
                .nullable(true)
                .matches(/^\d*$/, {
                  excludeEmptyString: true,
                  message: t("common:errors.numberAllowed"),
                })
                .max(11, t("common:errors.maxLength"))
                .required(t("common:errors.required")),
              otherwise: Yup.string()
                .nullable(true)
                .matches(/^\d*$/, {
                  excludeEmptyString: true,
                  message: t("common:errors.numberAllowed"),
                })
                .max(11, t("common:errors.maxLength")),
            }),

            haveNoTin: Yup.boolean(),

            reasonForNoTin: Yup.string().when("haveNoTin", {
              is: true,
              then: Yup.string()
                .nullable(true)
                .max(50, t("common:errors.maxChar"))
                .required(t("common:errors.required")),
              otherwise: Yup.string().nullable(true),
            }),

            reasonForNoTinExplanation: Yup.string().when("reasonForNoTin", {
              is: NoTinReason.UnableToObtainTin,
              then: Yup.string()
                .nullable(true)
                .max(50, t("common:errors.maxChar"))
                .matches(/^[a-zA-Z0-9\s]*$/, {
                  excludeEmptyString: true,
                  message: t("common:errors.alphaEnglishNumericSpaceAllowed"),
                })
                .required(t("common:errors.required")),
              otherwise: Yup.string().nullable(true),
            }),
          }),
        )
        .required(t("common:errors.required")),
    }),
  })
}
