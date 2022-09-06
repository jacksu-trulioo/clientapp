import useTranslation from "next-translate/useTranslation"

import countryCodes from "~/utils/data/countryCodes"
import hijiriMonths from "~/utils/data/hijiriMonths"
import hijiriYears from "~/utils/data/hijiriYears"
import phoneCountryCodes from "~/utils/data/phoneCountryCodes"
import regionCodes from "~/utils/data/regionCodes"
import timeZones from "~/utils/data/timeZones"

export function useCountryList() {
  const { t } = useTranslation("countries")

  return countryCodes.map((code) => ({
    label: t(code),
    value: code,
  }))
}

export function useRegionList() {
  const { t } = useTranslation("region")

  return regionCodes.map((code) => ({
    label: t(code),
    value: code,
  }))
}

export function usePhoneCountryCodeList() {
  return Object.entries(phoneCountryCodes).map((code) => ({
    label: code[0] + " " + code[1],
    value: code[1],
  }))
}

export function useTimeZoneList() {
  const { t } = useTranslation("timeZones")
  return timeZones.map((timeZone) => ({
    label: `${t(timeZone.label)} ${timeZone.offset}`,
    value: timeZone.value,
    GMT: timeZone.offset,
  }))
}

export function useHijiriMonthList() {
  return hijiriMonths.map((hijiriMonth) => ({
    label: hijiriMonth,
    value: hijiriMonth,
  }))
}

export function useHijiriYearList() {
  return hijiriYears.map((hijiriYear) => ({
    label: hijiriYear,
    value: hijiriYear,
  }))
}
