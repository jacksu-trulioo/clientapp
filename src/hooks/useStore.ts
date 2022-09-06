import produce from "immer"
import create from "zustand"

import { InvestmentCartDealDetails } from "~/services/mytfo/clientTypes"

export type AppState = {
  isDrawerOpen: boolean
  setIsDrawerOpen: (isDrawerOpen: boolean) => void
  showBackButton: boolean
  setShowBackButton: (isDrawerOpen: boolean) => void
  setSubscriptionDealsAndPrograms: (
    dealAndProgramData: InvestmentCartDealDetails[],
  ) => void
  subscriptionDealsAndPrograms: InvestmentCartDealDetails[]
}

const useStore = create<AppState>((set, _get) => ({
  isDrawerOpen: true,
  showBackButton: false,
  setIsDrawerOpen: (isDrawerOpen) =>
    set(
      produce((state) => {
        state.isDrawerOpen = isDrawerOpen
      }),
    ),
  setShowBackButton: (showBackButton) =>
    set(
      produce((state) => {
        state.showBackButton = showBackButton
      }),
    ),
  subscriptionDealsAndPrograms: [],
  setSubscriptionDealsAndPrograms: (subscriptionDealsAndPrograms) =>
    set(
      produce((state) => {
        state.subscriptionDealsAndPrograms = subscriptionDealsAndPrograms
      }),
    ),
}))

export default useStore
