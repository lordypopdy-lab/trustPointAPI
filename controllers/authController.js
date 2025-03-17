require("dotenv").config();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const { hashPassword, comparePassword } = require("../helpers/auth");

const verificationOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({
      error: "email is required to request for OTP"
    })
  }

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  const sendOTP = async (email) => {
    const otp = generateOTP();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Testing OTP from TrustPoint Your One-Time Password (OTP) is: ${otp}\n\nIt will expire in 10 minutes.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      // console.log(`OTP sent successfully to ${email}: ${otp}`);
      return res.json({
        message: "OTP Sent Successfully!",
        OTP: otp
      })
    } catch (error) {
      console.error("Error sending OTP:", error);
      return null;
    }
  };

  const userEmail = email; // Replace with user's email
  sendOTP(userEmail)

}

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
          res.cookie("token", token).json({
            message: "Logged In Successfully!",
            userData: user
          });
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
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    confirm_password,
  } = req.body;
  try {
    //Check if firstname was taken
    if (!firstName) {
      return res.json({
        error: "firstName is required",
      });
    }

    //Check if lastname was taken
    if (!lastName) {
      return res.json({
        error: "lastName is required",
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
    if (password !== confirm_password) {
      return res.json({
        error: "confirm_password must match password",
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
      firstName: firstName,
      lastName: lastName,
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
  verificationOTP
};
