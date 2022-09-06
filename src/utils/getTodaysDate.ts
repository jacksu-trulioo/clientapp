export const getTodaysDate = () => {
  const today = new Date()

  let hours = today.getHours()
  let minutes: string | number = today.getMinutes()
  let ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes
  var strTime = hours + ":" + minutes + " " + ampm

  return `${today.toDateString()} ${strTime}`
}
