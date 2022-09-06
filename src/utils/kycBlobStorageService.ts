import { BlobServiceClient } from "@azure/storage-blob"

import { KycDocument } from "~/services/mytfo/types"

const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING || ""

const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING,
)

/**
 * Upload the kyc files to azure blob
 * @param userIdentity Unique user identifier, use to tag the kyc file in azure blob storage
 * @param kycFiles Files in base64 format and with the given name
 */
export async function uploadKycFiles(
  userIdentity: string,
  kycFiles: KycDocument[],
) {
  userIdentity = userIdentity.toLocaleLowerCase()
  if (blobServiceClient) {
    let containerClient = blobServiceClient.getContainerClient(userIdentity)
    await containerClient.createIfNotExists()
    kycFiles.forEach(async function (item) {
      let blockBlobClient = containerClient.getBlockBlobClient(item.FileName)
      let buffer = Buffer.from(item.Content, "base64")
      await blockBlobClient.uploadData(buffer)
      await blockBlobClient.setTags({ ["User"]: userIdentity })
    })
    return true
  }
}
