import moment from "moment"
import getT from "next-translate/getT"

export const getLastFourQuarters = (
  valuationDate: string,
  langCode: string,
) => {
  return new Promise(async (resolve) => {
    const t = await getT(langCode, "common")
    let quarters = [0, 1, 2, 3].map((i) => {
      return moment(valuationDate).subtract(i, "Q").format("[quarter_]Q YYYY")
    })

    quarters = quarters.map((q) => {
      const key = q.match(/quarter_\d/gi)
      const year = q.match(/[0-9]{2,4}/gi)

      if (key?.length && year?.length) {
        let newKey = key[0]
        let newYear = year[0]
        return `${t(`client.quarters.${newKey}`)}\n${newYear}`
      }
      return ""
    })
    resolve([...quarters].reverse())
  })
}

export const getTotalCommitmentsStartAndEndDate = (valuationDate: string) => {
  const data = [
    moment(valuationDate).format("MMM YYYY"),
    moment(valuationDate).subtract("11", "months").format("MMM YYYY"),
  ]
  return data
}
