const gccCountriesCodes = ["BH", "KW", "OM", "QA", "SA", "AE"]

export function isGccCountry(countryCode: string) {
  return gccCountriesCodes.includes(countryCode)
}
