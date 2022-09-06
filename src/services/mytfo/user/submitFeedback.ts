import ky from "ky"

import { UserFeedbackInput } from "../types"

const submitFeedback = async (
  httpClient: typeof ky,
  params: UserFeedbackInput,
) => {
  return httpClient
    .post("user/feedback", {
      json: params,
    })
    .json()
}

export default submitFeedback
