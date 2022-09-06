import flat from "flat"
import fs from "fs-extra"

/**
 * Transforms keys from Lokalise into separate locale files.
 */
export default function transformLokaliseFileToI18n(translationPath: string) {
  const localiseJson = JSON.parse(
    fs.readFileSync(translationPath, "utf-8"),
  ) as Record<string, unknown>

  const result = {} as Record<string, Record<string, unknown>>

  Object.keys(localiseJson).forEach((key) => {
    const [namespace, i18nKey] = key.split(":")

    if (!result[namespace]) result[namespace] = {}

    result[namespace][i18nKey] = localiseJson[key]
  })

  Object.keys(result).forEach((namespace) => {
    result[namespace] = flat.unflatten(result[namespace], { object: true })
  })

  return result
}
