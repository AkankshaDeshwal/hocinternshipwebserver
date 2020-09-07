const express = require("express");
const User = require("../models/user-model");
const HttpError = require("../http-error");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", async (req, res, next) => {
  const { userName, password } = req.body;

  let loggingUser;
  try {
    loggingUser = await User.findOne({
      userName: userName,
      password: password,
    });
  } catch (err) {
    return next(
      new HttpError("Something went wrong, please try again later", 500)
    );
  }

  if (!loggingUser) {
    return next(new HttpError("User doesnt exists. Try signup", 401));
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: loggingUser._id,
        userName: loggingUser.userName,
        isAdmin: loggingUser.isAdmin,
      },
      "secret",
      { expiresIn: "1hr" }
    );
  } catch (err) {
    return next(new HttpError("Could not login, please try again later", 500));
  }

  res.json({
    message: "Logged in",
    userName: loggingUser.userName,
    token: token,
    isAdmin: loggingUser.isAdmin,
  });
});

router.post("/signup", async (req, res, next) => {
  const { userName, password } = req.body;

  let userExists;

  try {
    userExists = await User.findOne({ userName: userName });
  } catch (err) {
    return next(
      new HttpError("Something went wrong, please try again later.", 500)
    );
  }

  if (userExists) {
    return next(new HttpError("User exists. Please login.", 500));
  }

  const newUser = new User({
    userName: userName,
    password: password,
    isAdmin: false,
  });
  try {
    await newUser.save();
  } catch (err) {
    return next(
      new HttpError("Could not create user, please try again later.", 501)
    );
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: newUser._id,
        username: newUser.userName,
        isAdmin: newUser.isAdmin,
      },
      "secret",
      { expiresIn: "1hr" }
    );
  } catch (err) {
    return next(
      new HttpError("Something went wrong, please try again later 3", 400)
    );
  }

  res.json({
    message: "Sign up successful",
    userName: newUser.userName,
    token: token,
    isAdmin: newUser.isAdmin,
  });
});

module.exports = router;
