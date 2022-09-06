import {
  categorzeArrayBySingleAplhabet,
  GlossaryRes,
} from "~/services/mytfo/clientTypes"

export const sortDataWithSingleAplhabet = (glossariesData: GlossaryRes) => {
  try {
    //sorting an Array
    glossariesData.sort((a, b) =>
      a.term.localeCompare(b.term, "es", { sensitivity: "base" }),
    )

    //categorzing an array by single aplhabets...
    let result = glossariesData.reduce(
      (acc: categorzeArrayBySingleAplhabet, value) => {
        let alphabet = value.term[0]
        if (!acc[alphabet]) {
          acc[alphabet] = { alphabet, record: [value] }
        } else acc[alphabet].record.push(value)
        return acc
      },
      {},
    )

    return Object.values(result)
  } catch (error) {
    return error
  }
}
