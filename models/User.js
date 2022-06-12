const mongoose = require("mongoose");

//user'ın barındıracağı fieldlar ve onların tipi
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "default_photo.png",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
