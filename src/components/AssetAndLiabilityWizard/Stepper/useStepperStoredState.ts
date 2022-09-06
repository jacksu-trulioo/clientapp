import { useFormikContext } from "formik"
import { useCallback, useState } from "react"

import { FillDetailsValues } from "../Steps/FillDetails"
import { StepperContextType } from "./StepperProvider"
import { useStepper } from "./useStepper"

const DEFAULT_STORAGE_KEY = "tfo.assets-and-liabilities-wizard"

type StoredState = Omit<
  StepperContextType,
  "setStep" | "setBankAccountType" | "setAssetOrLiability"
> & {
  details?: Partial<FillDetailsValues>
}

function clientGuard<Callback extends Function>(callback: Callback) {
  if (typeof window !== "undefined") {
    return callback
  }
  return (() => undefined) as never as Callback
}

const getFromStorage = clientGuard(() => {
  const storedState = localStorage.getItem(DEFAULT_STORAGE_KEY)
  if (storedState) {
    return JSON.parse(storedState) as StoredState
  }

  return undefined
})

const storeInStorage = clientGuard((state: StoredState) => {
  const stringifiedState = JSON.stringify(state)
  localStorage.setItem(DEFAULT_STORAGE_KEY, stringifiedState)
})

const removeFromStorage = clientGuard(() => {
  localStorage.removeItem(DEFAULT_STORAGE_KEY)
})

export function useStepperStoredState() {
  const [state, setState] = useState(getFromStorage)
  const { setStep, setAssetOrLiability, setBankAccountType } = useStepper()
  const { setValues } = useFormikContext()

  const set = useCallback((newState: StoredState) => {
    storeInStorage(newState)
    setState(newState)
  }, [])

  const purge = useCallback(() => {
    removeFromStorage()
    setState(undefined)
  }, [])

  const restore = useCallback(() => {
    if (state) {
      const {
        step: storedStep,
        assetOrLiability: storedAssetOrLiability,
        bankAccountType: storeBankAccountType,
        details,
      } = state

      setStep(storedStep)
      setAssetOrLiability(storedAssetOrLiability)
      setBankAccountType(storeBankAccountType)
      setValues(details)
      removeFromStorage()
    }
  }, [setAssetOrLiability, setBankAccountType, setStep, setValues, state])

  return {
    state,
    set,
    purge,
    restore,
  }
}
