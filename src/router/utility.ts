import expresss from "express";

export function sendResponse(
  res: expresss.Response,
  message: string,
  error: any
) {
  res
    .status(error !== null ? (error !== null ? 400 : 200) : 400)
    .json({
      message: message,
      error: error
    })
    .end();
}
