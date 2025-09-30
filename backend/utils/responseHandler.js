// ******** Response Handling Function ******** //
const response = (res, statusCode, message, data = null) => {
  if (!response) {
    console.error("Response object is null");
    return;
  }

  const responseObject = {
    status: statusCode < 400 ? "success" : "error",
    message,
    data,
  };

  return res.status(statusCode).json(responseObject);
};

// ******** Exports ******** //
module.exports = response;
