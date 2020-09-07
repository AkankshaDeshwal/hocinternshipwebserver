const jwt = require("jsonwebtoken");
const HttpError = require("./http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return next(new HttpError("no token", 401));
    }
    const decodedToken = jwt.verify(token, "secret");
    const isAdmin = decodedToken.isAdmin;
    if (!isAdmin) {
      return next(
        new HttpError("You are not authorised to visit this route. 2", 401)
      );
    }
    next();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, please try again later", 400)
    );
  }
};
