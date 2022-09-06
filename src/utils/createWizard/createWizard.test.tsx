import { act, renderHook } from "@testing-library/react-hooks"

import { createWizard } from "./createWizard"

describe("createWizard", () => {
  it("should create a Provider, a Context, a Hook and a HOC", () => {
    const result = createWizard({
      numberOfSteps: 10,
    })

    expect(result.WizardContext).toBeDefined()
    expect(result.useWizard).toBeDefined()
    expect(result.WizardProvider).toBeDefined()
    expect(result.withWizard).toBeDefined()
  })

  it("should retrieve the current state of the wizard from the hook", () => {
    const INITIAL_STEP = 5

    const { useWizard, WizardProvider } = createWizard({
      numberOfSteps: 10,
      initialStep: INITIAL_STEP,
    })

    const { result } = renderHook(useWizard, {
      wrapper: WizardProvider,
    })

    expect(result.current.step).toBe(INITIAL_STEP)
  })

  it("should provide the state from the HOC", () => {
    const INITIAL_STEP = 5

    const { useWizard, withWizard } = createWizard({
      numberOfSteps: 10,
      initialStep: INITIAL_STEP,
    })

    const CustomProvider = withWizard((props) => <div {...props} />)

    const { result } = renderHook(useWizard, {
      wrapper: CustomProvider,
    })

    expect(result.current.step).toBe(INITIAL_STEP)
  })

  it("should increase the current step by executing the function next", () => {
    const INITIAL_STEP = 1

    const { useWizard, WizardProvider } = createWizard({
      numberOfSteps: 10,
      initialStep: INITIAL_STEP,
    })

    const { result } = renderHook(useWizard, {
      wrapper: WizardProvider,
    })

    act(() => {
      result.current.next()
    })

    expect(result.current.step).toBe(INITIAL_STEP + 1)
  })

  it("should decrease the current step by executing the function back", () => {
    const INITIAL_STEP = 7

    const { useWizard, WizardProvider } = createWizard({
      numberOfSteps: 10,
      initialStep: INITIAL_STEP,
    })

    const { result } = renderHook(useWizard, {
      wrapper: WizardProvider,
    })

    act(() => {
      result.current.back()
    })

    expect(result.current.step).toBe(INITIAL_STEP - 1)
  })

  it("should not decrease the current step if is equal to the minimum", () => {
    const INITIAL_STEP = 7

    const { useWizard, WizardProvider } = createWizard({
      numberOfSteps: 10,
      initialStep: INITIAL_STEP,
      firstStepNumber: INITIAL_STEP,
    })

    const { result } = renderHook(useWizard, {
      wrapper: WizardProvider,
    })

    act(() => {
      result.current.back()
    })

    expect(result.current.step).toBe(INITIAL_STEP)
  })

  it("should not increase the current step if is equal to the maximum", () => {
    const INITIAL_STEP = 7

    const { useWizard, WizardProvider } = createWizard({
      numberOfSteps: INITIAL_STEP,
      initialStep: INITIAL_STEP - 1,
      firstStepNumber: 0,
    })

    const { result } = renderHook(useWizard, {
      wrapper: WizardProvider,
    })

    act(() => {
      result.current.next()
    })

    expect(result.current.step).toBe(INITIAL_STEP - 1)
  })
})
