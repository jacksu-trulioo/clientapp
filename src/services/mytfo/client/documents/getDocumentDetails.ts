import ky from "ky"

import {
  DocCenterListSchema,
  DownloadDealSheetSchema,
  DownloadDocumnetsSchema,
  ReportAndVideoListSchema,
} from "~/services/mytfo/jsonSchemas"
import {
  DocCenterParams,
  MultipleDocsDownloadParams,
  ReportAndVideoList,
  ReportAndVideoObj,
} from "~/services/mytfo/types"

import validateSchema from "../../ajvValidator"

const getDocumentDetails = async (
  httpClient: typeof ky,
  params: DocCenterParams | MultipleDocsDownloadParams,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await httpClient.post(`miscellaneous/api/v1/doc-center`, {
        json: params,
        timeout: 20000,
      })
      let response = (await data.json()) as ReportAndVideoList

      if (params.action == "list") {
        if (await validateSchema(DocCenterListSchema, response)) {
          resolve(response)
        }
      } else if (params.action == "list of files") {
        if (await validateSchema(ReportAndVideoListSchema, response)) {
          if (
            params.folderName == "Monthly Reports" ||
            params.folderName == "Relationship Review" ||
            params.folderName == "Videos"
          ) {
            if (params.sortBy === "fileName") {
              monthSorter(response.data, params.orderBy as string)
            } else {
              dateSorter(response.data, params.orderBy as string)
            }
          } else if (
            params.folderName == "Quarterly Reports" ||
            params.folderName == "Invoices"
          ) {
            if (params.sortBy === "fileName") {
              quarterSorter(response.data, params.orderBy as string)
            } else {
              dateSorter(response.data, params.orderBy as string)
            }
          }

          resolve(response)
        }
      } else if (
        params.action == "download" ||
        params.action == "multipleDownload" ||
        params.action == "view"
      ) {
        if (await validateSchema(DownloadDocumnetsSchema, response)) {
          resolve(response)
        }
      } else {
        if (await validateSchema(DownloadDealSheetSchema, response)) {
          resolve(response)
        }
      }

      reject("Validation Error")
    } catch (error) {
      reject(error)
    }
  })
}

const months = [
  "JAN",
  "JANUARY",
  "FEB",
  "FEBRUARY",
  "MAR",
  "MARCH",
  "APR",
  "APRIL",
  "MAY",
  "JUN",
  "JUNE",
  "JUL",
  "JULY",
  "AUG",
  "AUGUST",
  "SEP",
  "SEPT",
  "SEPTEMBER",
  "OCT",
  "OCTOBER",
  "NOV",
  "NOVEMBER",
  "DEC",
  "DECEMBER",
]

const monthSorter = (data: ReportAndVideoList["data"], orderBy: string) => {
  data.sort((a: ReportAndVideoObj, b: ReportAndVideoObj) => {
    let splitFileNameA = a.name.split(".")[0].split("-")
    let splitFileNameB = b.name.split(".")[0].split("-")

    let monthA = splitFileNameA[0]
    let monthB = splitFileNameB[0]

    let yearA = Number(splitFileNameA[1])
    let yearB = Number(splitFileNameB[1])

    if (yearA !== yearB) {
      if (orderBy === "desc") {
        return yearB - yearA
      } else {
        return yearA - yearB
      }
    } else {
      if (orderBy === "desc") {
        return months.indexOf(monthB) - months.indexOf(monthA)
      } else {
        return months.indexOf(monthA) - months.indexOf(monthB)
      }
    }
  })
}

const quarters = ["Q1", "Q2", "Q3", "Q4"]

const quarterSorter = (data: ReportAndVideoList["data"], orderBy: string) => {
  data.sort((a: ReportAndVideoObj, b: ReportAndVideoObj) => {
    let splitFileNameA = a.name.split(".")[0].split("-")
    let splitFileNameB = b.name.split(".")[0].split("-")

    let quarterA = splitFileNameA[0]
    let quarterB = splitFileNameB[0]

    let yearA = Number(splitFileNameA[1])
    let yearB = Number(splitFileNameB[1])

    if (yearA !== yearB) {
      if (orderBy === "desc") {
        return yearB - yearA
      } else {
        return yearA - yearB
      }
    } else {
      if (orderBy === "desc") {
        return quarters.indexOf(quarterB) - quarters.indexOf(quarterA)
      } else {
        return quarters.indexOf(quarterA) - quarters.indexOf(quarterB)
      }
    }
  })
}

const dateSorter = (data: ReportAndVideoList["data"], orderBy: string) => {
  return data.sort((a: ReportAndVideoObj, b: ReportAndVideoObj) => {
    let dateA: Date = new Date(a.date)
    let dateB: Date = new Date(b.date)

    if (orderBy == "desc") {
      return Number(dateB) - Number(dateA)
    } else {
      return Number(dateA) - Number(dateB)
    }
  })
}

export default getDocumentDetails
