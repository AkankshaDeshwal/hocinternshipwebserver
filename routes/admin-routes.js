const express = require("express");
const User = require("../models/user-model");
const checkAdmin = require("../check-admin");

const router = express.Router();

router.use(checkAdmin);

router.get("/users", async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    return next(
      new HttpError("Could not fetch user list, please try again later", 500)
    );
  }

  res.json({ users: users.map((user) => user.toObject()) });
});

router.patch("/users", async (req, res, next) => {
  const { userName, password, userId } = req.body;

  let user;

  try {
    user = await User.findById(userId);
    user.userName = userName;
    user.password = password;
    await user.save();
  } catch (err) {
    return next(
      new HttpError("Could not edit user, please try again later", 500)
    );
  }
  res.json({ message: "User edited successfully." });
});

router.post("/users", async (req, res, next) => {
  const { userName, password } = req.body;
  const newUser = new User({
    userName: userName,
    password: password,
    isAdmin: false,
  });
  try {
    await newUser.save();
  } catch (err) {
    return next(
      new HttpError("Could not create user, please try again later", 500)
    );
  }
  res.json({ message: "User created successfully." });
});

router.delete("/users/:id", async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    await user.remove();
  } catch (err) {
    return next(
      new HttpError("Could not delete user, please try again later", 500)
    );
  }

  res.json({ message: "User removed sucessfully" });
});

module.exports = router;
