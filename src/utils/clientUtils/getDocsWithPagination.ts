import { ReportAndVideoList } from "~/services/mytfo/types"

export const getDocsWithPagination = async (
  docData: ReportAndVideoList,
  max: string,
  offset: string,
) => {
  try {
    let isData = docData?.data.slice(
      Number(offset),
      Number(offset) + Number(max),
    )
    let pageTotal = Math.ceil(docData?.data.length / Number(max))
    let data = isData

    return {
      success: true,
      data,
      pageTotal,
    }
  } catch (error) {
    return error
  }
}
