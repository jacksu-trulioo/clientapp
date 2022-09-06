import React from "react"

import { timeSpentPerComponent } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"
import { logActivity } from "~/utils/logActivity"

export const useSpentTime = (
  component: string,
  type?: string,
  extraAttributes?: Object,
) => {
  const initialTimer = React.useRef(new Date())
  let seconds
  React.useEffect(() => {
    return () => {
      const endTime = new Date()
      // eslint-disable-next-line react-hooks/exhaustive-deps
      seconds = (endTime.getTime() - initialTimer?.current?.getTime()) / 1000
      if (type === "logUserActivity") {
        logActivity(
          component,
          JSON.stringify({ timeSpent: seconds, ...extraAttributes }),
        )
      } else {
        event({
          ...timeSpentPerComponent,
          category: `Time spent on ${component} is ${seconds} seconds`,
          action: `Time spent on ${component} is ${seconds} seconds`,
          label: `Time spent on ${component} is ${seconds} seconds`,
        })
      }
    }
  }, [])
}
