


export const sendError = async (res, message, statuscode = 400) => {
  return res.status(statuscode).json({
    success: 0,
    message,
  });
};

export const sendSuccess = async (res, message, data = {}, statuscode = 200,) => {
  return res.status(statuscode).json({
    success: 1,
    message,
    data,
  });
};
