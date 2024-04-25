import logger from "../config/logger.js";
import User from "../model/User.js";
import { generateUniqueName, imageValidator } from "../utils/helper.js";

export class ProfileService {
  static async ViewProfileService(res, user) {
    try {
      const existingUser = await User.findOne({ _id: user.userid });
      if (!existingUser) {
        return res.status(403).json({
          message: "User does not exists",
        });
      }
      return res.status(201).json({
        status: 201,
        message: "Profile",
        data: existingUser,
      });
    } catch (err) {
      logger.error(err.message);
      return res.status(500).json({
        message: "INTERNAL SERVER ERROR",
      });
    }
  }

  static async DeleteOneService(res, user) {
    const existingUser = await User.findOne({ _id: user.userid });
    if (!existingUser) {
      return res.status(403).json({
        message: "User Does not Exists",
      });
    }
    await User.deleteOne({ _id: existingUser._id });
    return res.status(201).json({
      status: 201,
      message: "User Deleted SuccessFully",
    });
  }

  static async UpdateProfileService(req, res, id, user) {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        status: 400,
        message: "Profile Image Is Required",
      });
    }

    try {
      const profile = req.files.profile;
      const message = imageValidator(profile.size, profile.mimetype);
      if (message !== null) {
        return res.status(400).json({
          error: {
            profile: message,
          },
        });
      }

      const imageExt = profile.name.split(".");
      const imageName = generateUniqueName() + "." + imageExt[1];
      console.log(process.cwd());
      const uploadPath = process.cwd() + "/src/public/images/" + imageName;

      profile.mv(uploadPath, (err) => {
        if (err) {
          console.log(err);
        }
      });
      await User.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            profile: imageName,
          },
        }
      );
      return res.json({
        name: profile.name,
        size: profile.size,
        mime: profile.mimetype,
        image: "Image Has Been Saved SuccessFully",
      });
    } catch (err) {
      logger.error(err.message);
      return res.status(500).json({
        status: 500,
        message: "INTERNAL SERVER ERROR",
      });
    }
  }
}
