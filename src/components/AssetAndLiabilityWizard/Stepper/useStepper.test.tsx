import { act, renderHook } from "@testing-library/react-hooks"

import { Step, StepperProvider } from "./StepperProvider"
import { useStepper } from "./useStepper"

describe("useStepper", () => {
  it("should have the right default state", async () => {
    const { result } = renderHook(useStepper, {
      wrapper: StepperProvider,
    })

    expect(result.current.step).toBe(Step.ADD_ASSETS_OR_LIABILITIES)
    expect(result.current.assetOrLiability).not.toBeDefined()
    expect(result.current.bankAccountType).not.toBeDefined()
  })

  it("should not increase the step if is the last", async () => {
    const { result } = renderHook(useStepper, {
      wrapper: StepperProvider,
    })

    act(() => {
      result.current.setStep(Step.FILL_DETAILS)
    })

    expect(result.current.step).toBe(Step.FILL_DETAILS)

    act(() => {
      result.current.next()
    })

    expect(result.current.step).toBe(Step.FILL_DETAILS)
  })

  it("should not decrease the step if is the first", async () => {
    const { result } = renderHook(useStepper, {
      wrapper: StepperProvider,
    })

    act(() => {
      result.current.back()
    })

    expect(result.current.step).toBe(Step.ADD_ASSETS_OR_LIABILITIES)
  })

  describe("When the step is equal to `Step.ADD_BANK_ACCOUNTS`", () => {
    it("should unset the asset of the liability when going back", async () => {
      const { result } = renderHook(useStepper, {
        wrapper: StepperProvider,
      })

      const asset = {
        id: "fake id",
        title: "fake asset or liability",
        description: "fake description",
      }

      act(() => {
        result.current.setStep(Step.ADD_BANK_ACCOUNTS)
        result.current.setAssetOrLiability(asset)
      })

      expect(result.current.step).toBe(Step.ADD_BANK_ACCOUNTS)
      expect(result.current.assetOrLiability).toEqual(asset)

      act(() => {
        result.current.back()
      })

      expect(result.current.assetOrLiability).not.toBeDefined()
    })
  })

  describe("When the step is equal to `Step.FILL_DETAILS`", () => {
    it("should unset the bank account type when going back", async () => {
      const { result } = renderHook(useStepper, {
        wrapper: StepperProvider,
      })

      const bankAccountType = {
        id: "fake id",
        title: "fake bank account type",
        description: "fake description",
      }

      act(() => {
        result.current.setStep(Step.FILL_DETAILS)
        result.current.setBankAccountType(bankAccountType)
      })

      expect(result.current.step).toBe(Step.FILL_DETAILS)
      expect(result.current.bankAccountType).toEqual(bankAccountType)

      act(() => {
        result.current.back()
      })

      expect(result.current.bankAccountType).not.toBeDefined()
    })
  })
})
