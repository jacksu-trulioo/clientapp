import moment from "moment"

export const formatDate = (date: string, lang: string) => {
  return moment(date).format(
    lang.includes("en") ? "MMMM Do, YYYY" : "Do MMMM YYYY",
  )
}

export const formatShortDate = (date: string, lang: string) => {
  return moment(date).format(
    lang.includes("en") ? "MMM DD, YYYY" : "DD MMM YYYY",
  )
}

export const formatShortMonthYear = (date: string) => {
  return moment(date).format("MMM YYYY")
}

export const getShortMonth = (month: number) => {
  let text

  switch (month) {
    case 1:
      text = "Jan"
      break
    case 2:
      text = "Feb"
      break
    case 3:
      text = "Mar"
      break
    case 4:
      text = "Apr"
      break
    case 5:
      text = "May"
      break
    case 6:
      text = "Jun"
      break
    case 7:
      text = "Jul"
      break
    case 8:
      text = "Aug"
      break
    case 9:
      text = "Sep"
      break
    case 10:
      text = "Oct"
      break
    case 11:
      text = "Nov"
      break
    case 12:
      text = "Dec"
      break

    default:
      break
  }

  return text
}

export const getQuarterDate = (quarter: number, year: number) => {
  switch (quarter) {
    case 1:
      return {
        fromDate: `${year}-01-01`,
        toDate: `${year}-03-31`,
      }
    case 2:
      return {
        fromDate: `${year}-01-01`,
        toDate: `${year}-06-30`,
      }
    case 3:
      return {
        fromDate: `${year}-01-01`,
        toDate: `${year}-09-30`,
      }
    case 4:
      return {
        fromDate: `${year}-01-01`,
        toDate: `${year}-12-31`,
      }
  }
}
