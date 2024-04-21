import User from "../model/User.js";
import vine, { errors } from "@vinejs/vine";
import { loginSchema, registerSchema } from "../validation/authValidation.js";
import bcryptjs from "bcrypt";
import Token from "../utils/jwt/token.js";

class AuthController {
  static async register(req, res) {
    const body = req.body;
    try {
      const validator = vine.compile(registerSchema);
      const payload = await validator.validate(body);

      const existingEmail = await User.findOne({ email: payload.email });
      if (existingEmail) {
        return res.status(401).json({
          sttus: 401,
          message: `The Email You Provided ${payload.email} is Already Exists, Please Try Another One`,
        });
      }
      const salt = bcryptjs.genSaltSync(10);
      const hashPass = bcryptjs.hashSync(payload.password, salt);
      const user = new User({
        email: payload.email,
        name: payload.name,
        password: hashPass,
        password_confirmation: hashPass,
      });
      const savedUser = await user.save();
      return res.status(201).json({
        status: 201,
        message: "User Saved SuccessFully",
        data: savedUser,
      });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({
          error: error.message,
        });
      } else {
        return res.status(500).json({
          mssage: "Something went Wrong Please Try Again",
        });
      }
    }
  }

  static async login(req, res) {
    const body = req.body;
    try {
      const validator = vine.compile(loginSchema);
      const payload = await validator.validate(body);
      const existingUser = await User.findOne({ email: payload.email });
      if (!existingUser) {
        return res.status(400).json({
          status: 400,
          message: "Use Not Found",
        });
      }
      const checkPassword = bcryptjs.compare(
        payload.password,
        existingUser.password
      )
        ? true
        : false;

      if (checkPassword && typeof checkPassword === "boolean") {
        console.log("Hi");
        const accesstoken = await Token.generateAccessToken(
          existingUser._id,
          existingUser.name,
          existingUser.email
        );
        console.log(accesstoken);
        return res.status(200).json({
          status: 200,
          message: "Logged In SuccessFully",
          access_token: accesstoken,
        });
      }
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(403).json({
          message: error.message,
        });
      } else {
        return res.status(500).json({
          message: "INTERNAL SERVER ERROR",
        });
      }
    }
  }
}

export default AuthController;
