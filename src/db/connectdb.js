import mongoose from "mongoose";
export const dbConnect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/masterb");
    console.log("Database Connected SuccessFully");
  } catch (err) {
    console.log("Database Connection Failed");
  }
};
