require("dotenv").config

import { LokaliseApi } from "@lokalise/node-api"
import AdmZip from "adm-zip"
import deepmerge from "deepmerge"
import fs from "fs-extra"
import got from "got"
import path from "path"
import prettier from "prettier"

import transformLokaliseFileToI18n from "./transformLokaliseFileToI18n"

const lokaliseApi = new LokaliseApi({ apiKey: process.env.LOKALISE_API_KEY })

async function download(
  translationsUrl: string,
  archive: fs.PathOrFileDescriptor,
) {
  try {
    const response = await got.get(translationsUrl).buffer()
    // Might want to use fs-promises and writeFile instead (await/async version)
    fs.writeFileSync(archive, response)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Downloads translation files from Lokalise, and updates the i18n namespace files with the
 * latest translated keys.
 */
export default async function importKeys() {
  if (!process.env.LOKALISE_PROJECT_ID) {
    throw new Error(
      "LOKALISE_PROJECT_ID is a required variable, but it was not set",
    )
  }

  const lokaliseFolder = path.resolve(process.cwd(), ".lokalise")

  if (!fs.existsSync(lokaliseFolder)) {
    await fs.mkdir(lokaliseFolder)
  }

  console.log("Downloading translations...")

  const { bundle_url: translationsUrl } = await lokaliseApi
    .files()
    .download(process.env.LOKALISE_PROJECT_ID, {
      format: "json",
      original_filenames: false,
      bundle_structure: "%LANG_ISO%.json",
    })

  const archive = path.resolve(lokaliseFolder, "archive.zip")

  await download(translationsUrl, archive)

  console.log("Extracting translations from archive...")

  const zip = new AdmZip(archive)
  zip.extractAllTo(lokaliseFolder, true)

  fs.unlink(archive, (err) => {
    if (err) throw err
  })

  const localeFilenames = fs.readdirSync(lokaliseFolder)

  if (!localeFilenames) {
    throw new Error("missing downloaded locale files from Lokalise")
  }

  localeFilenames.forEach((localeFilename) => {
    const [locale] = localeFilename.split(".")

    console.log(
      `Transforming Lokalise translation file, "${localeFilename}", into i18n keys...`,
    )

    const translationPath = path.resolve(lokaliseFolder, localeFilename)
    const result = transformLokaliseFileToI18n(translationPath)

    console.log(
      `Updating namespace keys in "/public/locales/${locale}" with new values from Lokalise...`,
    )

    const namespaces = Object.keys(result)

    namespaces.forEach((namespace) => {
      const namespaceFile = path.resolve(
        process.cwd(),
        `public/locales/${locale}`,
        `${namespace}.json`,
      )

      // Read existing keys.
      const existingNamespaceKeys = JSON.parse(
        fs.readFileSync(namespaceFile, "utf-8"),
      )

      // Deep merge with imported keys from Lokalise.
      const updated = deepmerge(existingNamespaceKeys, result[namespace])

      // Update namespace file with merged keys.
      const formattedContent = prettier.format(JSON.stringify(updated), {
        semi: false,
        parser: "json",
      })
      fs.writeFileSync(namespaceFile, formattedContent.replace(/\\\\n/g, "\\n"))
    })
  })
}
