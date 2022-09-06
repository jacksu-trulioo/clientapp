import formatYearName from "./formatYearName"

test("it should be 1 year", async () => {
  let yearText = formatYearName(1, "en")
  expect(yearText).toBe("year")
})

test("it should be empty string year if value is null", async () => {
  let yearText = formatYearName(undefined, "en")
  expect(yearText).toBe("")
})

test("it should be 2 years", async () => {
  let yearText = formatYearName(2, "en")
  expect(yearText).toBe("years")
})

test("it should be arabic year", async () => {
  let yearText = formatYearName(1, "ar")
  expect(yearText).toBe("عام")
})

test("it should be arabic 11 year", async () => {
  let yearText = formatYearName(11, "ar")
  expect(yearText).toBe("عام")
})

test("it should be arabic 5 years", async () => {
  let yearText = formatYearName(5, "ar")
  expect(yearText).toBe("أعوام")
})

test("it should be arabic 2 years", async () => {
  let yearText = formatYearName(2, "ar")
  expect(yearText).toBe("عامَين")
})

test("it should be empty string year if value is null ar", async () => {
  let yearText = formatYearName(undefined, "ar")
  expect(yearText).toBe("")
})
