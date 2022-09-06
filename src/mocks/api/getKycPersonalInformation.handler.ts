import faker from "faker"
import { DefaultRequestBody, rest } from "msw"

import siteConfig from "~/config"
import {
  Gender,
  KycPersonalInformation,
  NameTitle,
} from "~/services/mytfo/types"

const {
  api: { baseUrl },
} = siteConfig

function handler() {
  return rest.get<DefaultRequestBody, KycPersonalInformation>(
    `${baseUrl}/user/kyc/personal-information`,
    (req, res, ctx) => {
      const personalInformation = {
        isAbsher: true,
        title: NameTitle.Mr,
        firstName: faker.name.firstName(),
        middleName: faker.name.middleName(),
        lastName: faker.name.lastName(),
        gender: Gender.Male,
        birthMonthYear: undefined,
        dateOfBirth: undefined,
        countryOfBirth: undefined,
        placeOfBirth: undefined,
        nationality: undefined,
        otherNationality: undefined,
        countryOfResidence: undefined,
        address1: undefined,
        isResidenceAddressOutsideSaudiArabia: false,
        address2: undefined,
        nationalIdNumber: undefined,
        passportNumber: undefined,
        employmentActivity: undefined,
        employmentDetails: undefined,
        employerDetails: undefined,
        companyDetails: undefined,
        incomeDetails: undefined,
        taxInformation: undefined,
        reasonablenessCheck: undefined,
        pepCheck: undefined,
      }
      return res(ctx.json(personalInformation))
    },
  )
}

export default handler()
