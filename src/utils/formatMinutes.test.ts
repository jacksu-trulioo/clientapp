import formatMinutes from "./formatMinutes"

test("it should be 1 minute", async () => {
  let minuteText = formatMinutes(1, "en")
  expect(minuteText).toBe("1 min")
})

test("it should be empty string minute if value is null", async () => {
  let minuteText = formatMinutes(undefined, "en")
  expect(minuteText).toBe("")
})

test("it should be 2 minutes", async () => {
  let minuteText = formatMinutes(2, "en")
  expect(minuteText).toBe("2 mins")
})

test("it should be arabic minute", async () => {
  let minuteText = formatMinutes(1, "ar")
  expect(minuteText).toBe("دقيقة")
})

test("it should be arabic 11 minutes", async () => {
  let minuteText = formatMinutes(11, "ar")
  expect(minuteText).toBe("11 دقيقة ")
})

test("it should be arabic 5 minutes", async () => {
  let minuteText = formatMinutes(5, "ar")
  expect(minuteText).toBe("5 دقائق ")
})

test("it should be arabic 2 minutes", async () => {
  let minuteText = formatMinutes(2, "ar")
  expect(minuteText).toBe("دقيقتان")
})

test("it should be empty string minute if value is null ar", async () => {
  let minuteText = formatMinutes(undefined, "ar")
  expect(minuteText).toBe("")
})
