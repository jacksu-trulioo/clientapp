async function validateSchema(responseSchema?: object, response?: object) {
  callback(responseSchema, response)
  return true
}
export default validateSchema
const callback = (responseSchema?: object, response?: object) => {
  return { responseSchema, response }
}
