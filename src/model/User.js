import mongoose from "mongoose";
import nonFieldProperty from "../utils/dbUtils/field.js";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, nonFieldProperty("Name")],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, nonFieldProperty("Email")],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, nonFieldProperty("Password")],
    },
    password_confirmation: {
      type: String,
      required: [true, nonFieldProperty("Confirm Password")],
    },
    profile: {
      type: String,
    },
    News: [
      {
        type: mongoose.Types.ObjectId,
        ref: "News",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
