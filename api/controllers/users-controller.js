const HttpError = require("../models/http-error");
const uuid = require("uuid").v4;
const { validationResult } = require("express-validator");

const USERS = [
  {
    id: "u1",
    name: "John Wick",
    image: "https://variety.com/wp-content/uploads/2023/03/John-Wick-3.jpg",
    places: 3,
  },
  {
    id: "u2",
    name: "Jane Doe",
    image: "https://example.com/jane-doe.jpg",
    places: 1,
  },
  {
    id: "u3",
    name: "Alice Smith",
    image: "https://example.com/alice-smith.jpg",
    places: 2,
  },
];

const getAllUsers = (req, res, next) => {
  res.json({ users: USERS });
};

const register = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }
  const { email, name, image, password, confirmPassword } = req.body;

  const existingUser = USERS.find((user) => user.email === email);
  if (existingUser) {
    throw new HttpError("User already exists, please log in instead.", 422);
  }

  const createdUser = {
    id: uuid(),
    email,
    name,
    image,
    password,
    confirmPassword,
  };

  USERS.push(createdUser);
  res.status(201).json({ user: createdUser });
};

const logIn = (req, res, next) => {
  const { email, password } = req.body;

  const existingUser = USERS.find(
    (user) => user.email === email && user.password === password
  );

  if (!existingUser || existingUser.password !== password) {
    throw new HttpError("Invalid credentials, could not log you in.", 401);
  }

  res.json({ message: "Logged in successfully!", user: existingUser });
};

exports.getAllUsers = getAllUsers;
exports.register = register;
exports.logIn = logIn;
