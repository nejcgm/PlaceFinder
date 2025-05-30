const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");

const usersControllers = require("../controllers/users-controller");

router.get("/", usersControllers.getAllUsers);

router.post(
  "/register",
  fileUpload.single("image"),
  [
    check("name").notEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 8 }),
  ],
  usersControllers.register
);

router.post("/login", usersControllers.logIn);

module.exports = router;
