const sendResponce = (
  res,
  status = 200,
  success = true,
  data = null,
  message = ""
) => {
  res.status(status).json({ message: message, success: success, data: data });
};

export default sendResponce;
