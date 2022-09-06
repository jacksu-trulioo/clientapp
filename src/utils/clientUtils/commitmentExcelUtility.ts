import moment from "moment"

import { CommitmentExcelArray } from "~/services/mytfo/clientTypes"
import { Commitment, TotalCommitments } from "~/services/mytfo/types"

export const commitmentExcelUtil = async (
  response: TotalCommitments,
  filterValues: Array<string>,
  sortBy: string,
  orderBy: string,
) => {
  let performanceExcelArray = [] as CommitmentExcelArray

  let commitments: Commitment[] = response.commitments

  let filteredCommitments = await filterByDeployedPercCommitment(
    commitments,
    filterValues,
  )

  let sortedCommitments: Commitment[] = []

  if (orderBy == "asc") {
    sortedCommitments = [...filteredCommitments].sort(
      (a: Commitment, b: Commitment) => {
        if (a[sortBy as keyof Commitment] > b[sortBy as keyof Commitment])
          return 1
        else if (b[sortBy as keyof Commitment] > a[sortBy as keyof Commitment])
          return -1
        else return 0
      },
    )
  }

  sortedCommitments.forEach((commitmentData) => {
    performanceExcelArray.push({
      Deal: commitmentData.managedVehicle,
      "Deployed (%)": commitmentData.deployed,
      Committed: commitmentData.committed,
      Called: commitmentData.called,
      Uncalled: commitmentData.uncalled,
      Strategy: commitmentData.strategy,
      "Committed Date": moment(commitmentData.lastCommitment).format(
        "DD/MM/YYYY",
      ),
    })
  })

  return performanceExcelArray
}

export async function filterByDeployedPercCommitment(
  data: Array<Commitment>,
  filterValues: Array<string>,
) {
  let min = 0
  let max = 100
  let filteredData: Commitment[] = []
  filterValues.forEach((item) => {
    if (item.includes("-")) {
      min = parseInt(item.split("-")[0])
      max = parseInt(item.split("-")[1])
    } else {
      min = max = parseInt(item)
    }
    const result = data.filter(function (e: Commitment) {
      return e.deployed >= min && e.deployed <= max
    })
    result.forEach(function (elem) {
      filteredData.push(elem)
    })
  })
  return filteredData
}
