import User from "../model/User.js";

class ProfileController {
  static async ViewProfile(req, res) {
    const user = req.user;
    console.log(user);
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
  }
}

export default ProfileController;
