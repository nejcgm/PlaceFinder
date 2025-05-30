const HttpError = require("../models/http-error");
const uuid = require("uuid").v4;
const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const PRIVATE_KEY = process.env.PRIVATE_KEY;

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

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(
      new HttpError("Hashing password failed, please try again.", 500)
    );
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      PRIVATE_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(new HttpError("Creating user failed, please try again.", 500));
  }

  try {
    await createdUser.save();
  } catch {
    const error = new HttpError("Creating User failed", 500);
    return next(error);
  }
  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const logIn = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("login failed try again later", 500));
  }

  if (!existingUser) {
    return next(
      new HttpError("Invalid credentials, could not log you in.", 401)
    );
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return next(
      new HttpError(
        "Could not log you in, please check your credentials and try again.",
        500
      )
    );
  }
  if (!isValidPassword) {
    return next(
      new HttpError("Invalid credentials, could not log you in.", 401)
    );
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      PRIVATE_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(new HttpError("Login failed, please try again.", 500));
  }

  res.json({
    message: "Logged in successfully!",
    user: existingUser.toObject({
      userId: existingUser.id,
      email: existingUser.email,
      token: token,
    }),
  });
};

exports.getAllUsers = getAllUsers;
exports.register = register;
exports.logIn = logIn;
