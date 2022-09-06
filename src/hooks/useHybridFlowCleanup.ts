import { useEffect } from "react"

import useUpdateKycHybridFlow from "~/utils/useUpdateKycHybridFlow"

export default function useHybridFlowCleanup() {
  const { updateKycHybridFlow } = useUpdateKycHybridFlow()
  const cleanup = () => {
    updateKycHybridFlow(false)
  }
  useEffect(() => {
    window.addEventListener("beforeunload", cleanup)
    return () => {
      window.removeEventListener("beforeunload", cleanup)
      cleanup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
