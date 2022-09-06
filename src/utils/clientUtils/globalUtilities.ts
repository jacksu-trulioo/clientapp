import { FilterDataType, FilterOptionType } from "~/services/mytfo/types"
import { formatCurrencyWithCommas } from "~/utils/formatCurrency"
import {
  filterCommitments,
  filterInvestments,
  sortCommitments,
  sortInvestments,
} from "~/utils/googleEventsClient"
import { clientUniEvent } from "~/utils/gtag"

export const percentTwoDecimalPlace = (input: number) => {
  let roundPercent = Math.abs(Math.round((input + Number.EPSILON) * 100) / 100)
  return roundPercent.toFixed(1)
}

export const roundValueWithoutAbsolute = (input: number) => {
  let roundPercent = Math.round((input + Number.EPSILON) * 100) / 100
  return roundPercent.toFixed(1)
}
export const formatChar = (name: string) =>
  name.charAt(0).toUpperCase() + name.slice(1)

export const roundCurrencyValue = (input: number) => {
  let roundPercent = Math.round(Number(input) + Number.EPSILON)
  let currenyFormat = formatCurrencyWithCommas(`${roundPercent}`)
  if (roundPercent < 0) {
    return `-${currenyFormat}`
  } else if (roundPercent == 0) {
    return 0
  }
  return currenyFormat
}

export const filterByKeys = async (
  data: [],
  filterKeys: string[],
  filterValues: string[],
) => {
  return Promise.all(
    data?.filter(function (e) {
      return filterKeys.every(function (a) {
        return filterValues.includes(e[a])
      })
    }),
  )
}

export const orderByService = (data: Array<object>, orderBy: string) => {
  if (orderBy == "asc") return data.reverse()
  else return data
}

export const wholeRoundWithAbsolute = (input: number) => {
  let roundPercent = Math.abs(Math.round((input + Number.EPSILON) * 100) / 100)
  return roundPercent.toFixed()
}

export const splitByCapsLetters = (input: string) => {
  return input.match(/[A-Z][a-z]+/g)?.join(" ")
}

export const roundPercentValue = (input: number) => {
  let roundPercent = Math.abs(Math.round(input + Number.EPSILON) * 100) / 100
  return roundPercent.toFixed()
}

export const absoluteConvertCurrencyWithDollar = (input: number) => {
  let roundPercent = Math.round(Number(input) + Number.EPSILON)
  let currenyFormat = formatCurrencyWithCommas(`${roundPercent}`)
  if (roundPercent < 0) {
    return `-$${currenyFormat}`
  } else if (roundPercent == 0) {
    return `$0`
  } else {
    return `$${currenyFormat}`
  }
}

export const getInsightTypeKey = (type: string) => {
  switch (type.toLocaleLowerCase()) {
    case "articles":
      return "articles"

    case "managementviews":
      return "managementViews"

    case "marketupdates":
      return "MarketUpdates"

    case "webinars":
      return "webinars"

    case "whitepapers":
      return "whitepapers"

    case "quarterlyreviews":
      return "quarterlyReviews"

    case "podcasts":
      return "podcasts"

    default:
      return false
  }
}

export const getInsightTypeTag = (type: string) => {
  switch (type.toLocaleLowerCase()) {
    case "articles":
      return "Article"

    case "managementviews":
      return "ManagementView"

    case "marketupdates":
      return "MarketUpdate"

    case "webinars":
      return "Webinar"

    case "whitepapers":
      return "Whitepaper"

    case "quarterlyreviews":
      return "QuarterlyReview"

    case "podcasts":
      return "Podcast"

    default:
      return false
  }
}

export const convertToMillions = (input: number) => {
  let closingamt_disp = 0
  Number.isNaN(input) || input == null
    ? (closingamt_disp = 0)
    : (closingamt_disp = input)
  return Math.abs(Number(closingamt_disp)) >= 1.0e9
    ? Number(closingamt_disp) / 1.0e9 + "b"
    : // Six Zeroes for Millions
    Math.abs(Number(closingamt_disp)) >= 1.0e6
    ? Number(closingamt_disp) / 1.0e6 + "m"
    : // Three Zeroes for Thousands
    Math.abs(Number(closingamt_disp)) >= 1.0e3
    ? Number(closingamt_disp) / 1.0e3 + "k"
    : Number(closingamt_disp)
}

export const triggerInvestmentSortFilterEvent = (
  filterOptions: FilterDataType[],
  sortOption: string,
  mandateId: string,
  email: string,
) => {
  let values: string[] = []

  filterOptions.forEach(({ filterOptions }) => {
    filterOptions
      .filter(({ isSelected }) => {
        return isSelected
      })
      .forEach(({ value }) => {
        values.push(value as string)
      })
  })

  clientUniEvent(sortInvestments, sortOption, mandateId, email)
  clientUniEvent(filterInvestments, values.toString(), mandateId, email)
}

export const triggerCommitmentSortFilterEvent = (
  filterOptions: FilterOptionType[],
  sortOption: string,
  mandateId: string,
  email: string,
) => {
  let values: string[] = []

  filterOptions
    .filter(({ isSelected }) => {
      return isSelected
    })
    .forEach(({ label }) => {
      values.push(label as string)
    })

  clientUniEvent(sortCommitments, sortOption, mandateId, email)
  clientUniEvent(filterCommitments, values.toString(), mandateId, email)
}
