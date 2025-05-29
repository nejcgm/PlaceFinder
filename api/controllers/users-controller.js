const HttpError = require("../models/http-error");
const uuid = require("uuid").v4;
const { validationResult } = require("express-validator");
const User = require("../models/user");

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(new HttpError("could not find users", 500));
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("register failed try again later", 500));
  }

  if (existingUser) {
    return next(
      new HttpError("User already exists, please log in instead.", 422)
    );
  }

  const createdUser = new User({
    name,
    email,
    image: "https://example.com/alice-smith.jpg",
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch {
    const error = new HttpError("Creating User failed", 500);
    return next(error);
  }
  res.status(201).json({ User: createdUser.toObject({ getters: true }) });
};

const logIn = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("login failed try again later", 500));
  }

  if (!existingUser || existingUser.password !== password) {
    return next(
      new HttpError("Invalid credentials, could not log you in.", 401)
    );
  }

  res.json({ message: "Logged in successfully!", user: existingUser.toObject({ getters: true }) });
};

exports.getAllUsers = getAllUsers;
exports.register = register;
exports.logIn = logIn;
