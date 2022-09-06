require("dotenv").config

import { LokaliseApi } from "@lokalise/node-api"

import generateLokaliseJsonExport from "./generateLokaliseJsonExport"
import importKeys from "./importKeys"

const lokaliseApi = new LokaliseApi({ apiKey: process.env.LOKALISE_API_KEY })

async function waitUntilUploadingDone(
  lokaliseApi: LokaliseApi,
  processId: string,
  projectId: string,
) {
  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      const reloadedProcess = await lokaliseApi
        .queuedProcesses()
        .get(processId, {
          project_id: projectId,
        })

      if (reloadedProcess.status === "finished") {
        resolve(reloadedProcess.status)
        clearInterval(interval)
      }
    }, 1000)
  })
}

/**
 * Synchronises i18n project translation keys with Lokalise.
 *
 * To run, execute the following command line from the project root directory:
 *
 *  npx ts-node -r dotenv/config --project ./scripts/tsconfig.json --transpile-only ./scripts/lokalise/sync.ts
 */
async function main() {
  if (!process.env.LOKALISE_PROJECT_ID) {
    throw new Error(
      "LOKALISE_PROJECT_ID is a required variable, but it was not set",
    )
  }

  // Import keys from Lokalise.
  await importKeys()

  // Create JSON export file.
  const exportedJson = generateLokaliseJsonExport()

  // Upload new i18n keys to Lokalise.
  console.log("Uploading translations...")

  const base64I18n = Buffer.from(exportedJson).toString("base64")

  const bgProcess = await lokaliseApi
    .files()
    .upload(process.env.LOKALISE_PROJECT_ID, {
      data: base64I18n,
      filename: "en.json",
      lang_iso: "en",
      use_automations: false,
      replace_modified: false,
    })

  console.log("Updating process status...")

  await waitUntilUploadingDone(
    lokaliseApi,
    bgProcess.process_id,
    process.env.LOKALISE_PROJECT_ID,
  )

  console.log("✅ Uploading completed!")
}

main()
