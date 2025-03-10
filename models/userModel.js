const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  req_date: {
    type: Date,
    required: true,
  }
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
