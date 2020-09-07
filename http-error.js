class HttpError extends Error {
  constructor(message, code) {
    super(message);
    this.errorCode = code;
  }
}

module.exports = HttpError;
