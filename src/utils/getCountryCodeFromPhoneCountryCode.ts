import { CountryCode } from "~/services/mytfo/types"

import phoneCountryCodes from "./data/phoneCountryCodes"

export default function getCountryCodeFromPhoneCountryCode(
  phoneCountryCode: string,
): CountryCode {
  const reversedPhoneCountryCodes = Object.fromEntries(
    Object.entries(phoneCountryCodes).map(([k, v]) => [v, k]),
  )

  return reversedPhoneCountryCodes[phoneCountryCode] as CountryCode
}
