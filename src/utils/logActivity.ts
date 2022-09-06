import ky from "ky"

import { LogActivity } from "~/services/mytfo/types"

export const logActivity = async (event: string, metaData: string) => {
  try {
    await ky
      .post("/api/user/log-activity", {
        json: {
          event: event,
          meta: metaData,
        },
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      })
      .json<LogActivity>()
  } catch (err) {
    console.log("Error...", err)
  }
}
