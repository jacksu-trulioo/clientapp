import { isMinimumProfileCompleted } from "./isMinimumProfileCompleted"

test("it should false if undefined", async () => {
  let expected = isMinimumProfileCompleted(undefined)
  expect(expected).toBe(false)
})

test("it should be false if missing values", async () => {
  let expected = isMinimumProfileCompleted({ firstName: "test" })
  expect(expected).toBe(false)
})

test("it should be true if completed", async () => {
  let expected = isMinimumProfileCompleted({
    firstName: "test",
    lastName: "last name",
    countryOfResidence: "NL",
    phoneCountryCode: "+316",
    phoneNumber: "628261006",
  })
  expect(expected).toBe(true)
})
