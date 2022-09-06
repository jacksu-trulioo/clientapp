import produce from "immer"
import ky from "ky"
import { useRouter } from "next/router"
import React from "react"
import useSWR, { mutate } from "swr"

import {
  AdditionalPreference,
  InvestmentGoal,
  InvestorProfileGoals,
  PortfolioOwner,
} from "~/services/mytfo/types"

const pages = ["1", "2", "3", "4", "5", "6", "7", "8"]

export type InvestmentGoalsFormContext = {
  ref?: React.MutableRefObject<HTMLDivElement | null>
  pages: string[]
  currentPage?: string
  isFirstPage?: boolean
  currentPageIndex: number
  previousPage?: () => void
  handleSubmit: (values: InvestorProfileGoals) => Promise<void>
}

export const InvestmentGoalsFormContext =
  React.createContext<InvestmentGoalsFormContext>({
    pages,
    currentPageIndex: 0,
    previousPage: undefined,
    handleSubmit: () => Promise.resolve(),
  })

export type UseInvestmentGoalsFormContext = () => InvestmentGoalsFormContext

export const useInvestmentGoalsFormContext = () =>
  React.useContext(InvestmentGoalsFormContext)

export type InvestmentGoalsFormProviderProps = React.PropsWithChildren<{
  onCompleted: () => void
}>

export function InvestmentGoalsFormProvider(
  props: InvestmentGoalsFormProviderProps,
): React.ReactElement<InvestmentGoalsFormContext> {
  const { children, onCompleted } = props
  const { data: investmentGoals } = useSWR<InvestorProfileGoals>(
    "/api/user/investment-goals",
  )
  const router = useRouter()
  const ref = React.useRef<HTMLDivElement>(null)

  const [, page] = location.hash.split("#")
  const [currentPage, setCurrentPage] = React.useState(page)
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0)
  const isFirstPage = currentPage === "1" || !currentPage

  React.useEffect(() => {
    setCurrentPage(page)

    const pageIndex = pages.findIndex((p) => p === page)
    setCurrentPageIndex(pageIndex === -1 ? 0 : pageIndex)
  }, [page])

  const nextPage = React.useCallback(() => {
    // At end of form.
    if (currentPageIndex === pages.length - 1) {
      return onCompleted()
    }

    const route = pages[Math.min(currentPageIndex + 1, pages.length - 1)]
    router.push("#" + route)
    setCurrentPage(route)
  }, [currentPageIndex, onCompleted, router])

  const previousPage = React.useCallback(() => {
    // At beginning of form.
    if (currentPageIndex === 0) {
      return
    }

    if (
      page === "7" &&
      (investmentGoals?.investmentAmountInUSD || 0) < 10000000
    ) {
      router.push("#" + 5)
      return
    }

    const route = pages[Math.max(currentPageIndex - 1, 0)]
    router.push(route ? "#" + route : router.pathname)
    setCurrentPage(route)
  }, [currentPageIndex, router, page, investmentGoals?.investmentAmountInUSD])

  const calculateDesiredAmountIncome = (
    values: InvestorProfileGoals,
    updatedInvestmentGoalsObj: InvestorProfileGoals,
  ) => {
    if (
      updatedInvestmentGoalsObj &&
      values?.desiredAnnualIncome &&
      updatedInvestmentGoalsObj?.investmentAmountInUSD
    ) {
      let amount =
        (values.desiredAnnualIncome *
          parseInt(
            (updatedInvestmentGoalsObj?.investmentAmountInUSD || "")
              .toString()
              .replace(/\D/g, ""),
          ) || 0) / 100

      amount = Math.round(amount)

      return amount
    }
  }

  const handleSubmit = React.useCallback(
    async (values: InvestorProfileGoals) => {
      try {
        const updateObj = produce(investmentGoals, (draft) => {
          return {
            ...draft,
            ...values,
          }
        })

        let updatedInvestmentGoalsObj = { ...updateObj }

        if (page === "7") {
          if (
            values?.additionalPreferences?.includes(AdditionalPreference.None)
          ) {
            updatedInvestmentGoalsObj.additionalPreferences = [
              AdditionalPreference.None,
            ]
          }
        }

        if (page === "5") {
          if (updatedInvestmentGoalsObj?.shouldGenerateIncome === "no") {
            updatedInvestmentGoalsObj.desiredAnnualIncome = undefined
          } else {
            updatedInvestmentGoalsObj.desiredAnnualIncome =
              calculateDesiredAmountIncome(values, updatedInvestmentGoalsObj)
          }
        }

        if (page === "4") {
          updatedInvestmentGoalsObj.investmentAmountInUSD =
            parseInt(
              (updatedInvestmentGoalsObj?.investmentAmountInUSD || "")
                .toString()
                .replace(/\D/g, ""),
            ) || 0

          updatedInvestmentGoalsObj.annualInvestmentTopUpAmountInUSD =
            parseInt(
              (
                updatedInvestmentGoalsObj?.annualInvestmentTopUpAmountInUSD ||
                ""
              )
                .toString()
                .replace(/\D/g, ""),
            ) || 0
        }

        if (
          values?.whoIsPortfolioFor !== PortfolioOwner.Other &&
          Boolean(values?.whoIsPortfolioForOtherDetails)
        ) {
          updatedInvestmentGoalsObj.whoIsPortfolioForOtherDetails = undefined
        }

        if (
          page === "2" &&
          !values?.investmentGoals?.includes(InvestmentGoal.Other) &&
          values?.investmentGoalsOtherDetails !== ""
        ) {
          updatedInvestmentGoalsObj.investmentGoalsOtherDetails = null
        }

        if (
          page === "5" &&
          (updatedInvestmentGoalsObj?.investmentAmountInUSD || 0) < 10000000
        ) {
          if (updatedInvestmentGoalsObj?.excludedAssets?.length !== 0) {
            updatedInvestmentGoalsObj.excludedAssets = []
            const reformedInvestmentGoals = await ky
              .put("/api/user/investment-goals", {
                json: updatedInvestmentGoalsObj,
              })
              .json<InvestorProfileGoals>()
            await mutate<InvestorProfileGoals>(
              "/api/user/investment-goals",

              reformedInvestmentGoals,
            )
            router.push("#" + 7)
            return
          }

          const reformedInvestmentGoals = await ky
            .put("/api/user/investment-goals", {
              json: updatedInvestmentGoalsObj,
            })
            .json<InvestorProfileGoals>()
          await mutate<InvestorProfileGoals>(
            "/api/user/investment-goals",

            reformedInvestmentGoals,
          )
          router.push("#" + 7)
          return
        }

        const updatedInvestmentGoals = await ky
          .put("/api/user/investment-goals", {
            json: updatedInvestmentGoalsObj,
          })
          .json<InvestorProfileGoals>()

        await mutate<InvestorProfileGoals>(
          "/api/user/investment-goals",
          updatedInvestmentGoals,
        )

        nextPage()
      } catch (error) {
        console.error(error)
      }
    },
    [investmentGoals, nextPage, page, router],
  )

  const contextValue = React.useMemo(
    () => ({
      ref,
      currentPage,
      currentPageIndex,
      isFirstPage,
      pages,
      previousPage,
      handleSubmit,
    }),
    [
      ref,
      currentPage,
      currentPageIndex,
      isFirstPage,
      previousPage,
      handleSubmit,
    ],
  )

  return (
    <InvestmentGoalsFormContext.Provider value={contextValue}>
      {children}
    </InvestmentGoalsFormContext.Provider>
  )
}
