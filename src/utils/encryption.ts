import crypto, { BinaryLike, createHmac, KeyObject } from "crypto"
import ky, { ResponsePromise } from "ky"
import type { NextApiRequest } from "next"

export const TurnOffEncryption = process.env.NEXT_PUBLIC_TURNOFF_ENCRYPTION

function getOptions(payload: string, lang: string) {
  return {
    json: payload,
    headers: {
      "Accept-Language": lang,
    },
  }
}

function decryptStringAES(value: string) {
  //\n is important in the key
  const privateKey =
    "-----BEGIN RSA PRIVATE KEY-----\n" +
    process.env.SERVER_PRIVATE_KEY +
    "\n-----END RSA PRIVATE KEY-----"
  try {
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        passphrase: "",
      },
      Buffer.from(value, "base64"),
    )
    return JSON.parse(decrypted.toString("utf8"))
  } catch (e) {
    console.error(e)
    throw e
  }
}

function encryptStringAES(value: unknown): string {
  if (TurnOffEncryption) return JSON.stringify(value)
  const publicKey =
    "-----BEGIN PUBLIC KEY-----" +
    process.env.NEXT_PUBLIC_KEY_ENCRYPTION +
    "-----END PUBLIC KEY-----"
  const encryptedData = crypto.publicEncrypt(
    {
      key: publicKey,
    },
    Buffer.from(JSON.stringify(value)),
  )
  return encryptedData.toString("base64")
}

export default function encryptBodyRequest(
  value: unknown,
  url: string,
  lang: string = "en",
  method: "POST" | "PUT" = "POST",
): ResponsePromise {
  let encryptData = encryptStringAES(value)
  if (method === "POST") {
    return ky.post(url, getOptions(encryptData, lang))
  } else {
    return ky.put(url, getOptions(encryptData, lang))
  }
}

export function decryptBody(req: NextApiRequest) {
  if (TurnOffEncryption) return JSON.parse(req.body)
  return decryptStringAES(req.body)
}

export const createHash = (value: string, secret: BinaryLike | KeyObject) => {
  const hmac = createHmac("sha512", secret)
  hmac.update(value)
  return hmac.digest("hex")
}
