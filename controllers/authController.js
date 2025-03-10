const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const { hashPassword, comparePassword } = require("../helpers/auth");

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.json({
        error: "email is required",
      });
    }

    //Check if password is goood
    if (!password || password.length < 6) {
      return res.json({
        error: "password is required and should be atleast six(6) characters",
      });
    }

    //Check if user exist
    const user = await Admin.findOne({ email });
    const adminCount = await Admin.countDocuments();
    if (!user && adminCount < 1) {
      const hashedPassword = await hashPassword(password);
      await Admin.create({
        name: "Admin",
        email: "example@gmail.com",
        password: hashedPassword,
        req_date: new Date(),
      });
      return res.json({
        new: "New admin created Contact lordy-popdy for Details!",
      });
    }
    //Check if password match
    const match = await comparePassword(password, user.password);
    if (match) {
      jwt.sign(
        { name: user.name, email: user.email, id: user._id },
        process.env.JWT_SECRET,
        {},
        (error, token) => {
          if (error) throw error;
          res.cookie("token", token).json(user);
        }
      );
    }
    if (!match) {
      return res.json({
        error:
          "password not match our database, password should be atleast six(6) character",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    //Check if user exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "No user found",
      });
    }
    //Check if password match
    const match = await comparePassword(password, user.password);
    if (match) {
      jwt.sign(
        { name: user.name, email: user.email, id: user._id },
        process.env.JWT_SECRET,
        {},
        (error, token) => {
          if (error) throw error;
          res.cookie("token", token).json(user);
        }
      );
    }
    if (!match) {
      return res.json({
        error:
          "password not match our database, password should be atleast six(6) character",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const test = async (req, res) => {
  return res.status(200).json({ message: "TrustPointAPI Connected Succesfully!" });
};

const createUser = async (req, res) => {
  const {
    userName,
    email,
    phoneNumber,
    password,
    comfirm_password,
  } = req.body;
  try {
    //Check if username was taken
    if (!userName) {
      return res.json({
        error: "userName is required",
      });
    }

    //check if email is provided
    if (!email) {
      return res.json({
        error: "email is required!",
      });
    }

    //check if phoneNumber is provided
    if (!phoneNumber) {
      return res.json({
        error: "phoneNumber is required!",
      });
    }


    //Check if password is goood
    if (!password || password.length < 6) {
      return res.json({
        error: "password is required and should be atleast six(6) characters",
      });
    }

    //Check comfirmPassword
    if (password !== comfirm_password) {
      return res.json({
        error: "Comfirm password must match password",
      });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "email is taken",
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      userName: userName,
      email: email,
      phoneNumber: phoneNumber,
      password: hashedPassword,
      req_date: new Date(),
    });

    if (user) {
      return res.json({
        message: "Account Created Successfully!",
        userData: user
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  test,
  loginUser,
  createUser,
  loginAdmin,
};
