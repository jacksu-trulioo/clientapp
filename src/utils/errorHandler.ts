/* eslint-disable @typescript-eslint/no-explicit-any */
export const errorHandler = async (error: any) => {
  var statusCode = error?.response?.status

  if (statusCode == 404) {
    return {
      statusCode: 404,
      message: "No data found",
    }
  }

  if (statusCode == 400) {
    return {
      statusCode: 400,
      message: "Bad Request",
    }
  }

  if (statusCode == 401) {
    return {
      statusCode: 401,
      message: "Unauthorized",
    }
  }

  if (statusCode == 500) {
    var errorJSON = await error.response?.json()
    if (errorJSON?.code == "GENE-002") {
      return {
        statusCode: 401,
        message: "Unauthorized",
      }
    }

    return {
      statusCode: 500,
      message: "Something went wrong",
    }
  }

  if (error == "Validation Error") {
    return {
      statusCode: 501,
      message: "In Valid JSON Schema",
    }
  }

  return {
    statusCode: 500,
    message: "Something went wrong",
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
