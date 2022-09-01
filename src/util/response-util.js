exports.createOKResponse = function (data, message) {
  return {
    code: 0,
    data: data,
    message: message,
  }
}

exports.createFailedResponse = function (error, message) {
  return {
    code: error,
    message: message,
  }
}
