import * as Yup from "yup"

export const validatePassword = async (value: string): Promise<string> => {
  let error = ""

  await Yup.string()
    .min(8, "length")
    .matches(/[a-z]/, "lowercase")
    .matches(/[A-Z]/, "uppercase")
    .matches(/[\d]/, "digit")
    .matches(/[!@#$%^&*()\-_+=\?]/, "special")
    .required("required")
    .validate(value, { abortEarly: false })
    .catch((e) => {
      error = e.inner.map((e: { message: string }) => e.message).join(":")
    })

  return error
}
