import flat from "flat"
import fs from "fs-extra"
import path from "path"

/**
 * Generates a Lokalise-ready `en.json` file from the namespaced locale files
 * in `public/locales/en`.
 *
 * For each namespace file, flatten the file to create i18n keys to upload
 * to Lokalise, e.g.:
 *
 * The following key in `common.json`,
 *
 *  "button": {
 *    "submit": "Submit"
 *   }
 *
 * should be translated to the following i18n key:
 *
 * common:button.submit = "Submit"
 */
export default function generateLokaliseJsonExport() {
  console.log("Generating new JSON export for Lokalise...")

  const lokaliseKeys = {}
  const dir = path.resolve("./public/locales/en")
  const namespaces = fs.readdirSync(dir)

  if (!namespaces) {
    throw new Error("missing locale files in /public/locales/en")
  }

  // Begin parsing each file.
  namespaces.forEach((filename) => {
    const file = path.resolve(dir, filename)
    const [namespace] = filename.split(".")

    if (fs.pathExistsSync(file)) {
      const jsonData = fs.readJSONSync(file)

      const prefixedKeys = {} as Record<string, unknown>
      const flattenedKeys = flat.flatten<
        Record<string, unknown>,
        Record<string, string>
      >(jsonData)

      Object.keys(flattenedKeys).forEach((key) => {
        prefixedKeys[`${namespace}:${key}`] = flattenedKeys[key]
      })

      Object.assign(lokaliseKeys, {
        ...lokaliseKeys,
        ...prefixedKeys,
      })
    }
  })

  return JSON.stringify(lokaliseKeys)
}
