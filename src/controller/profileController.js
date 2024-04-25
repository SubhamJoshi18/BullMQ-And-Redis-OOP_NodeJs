import User from "../model/User.js";
import { ProfileService } from "../service/profile.service.js";
class ProfileController {
  static async ViewProfile(req, res) {
    const user = req.user;
    return ProfileService.ViewProfileService(res, user);
  }

  static async DeleteProfile(req, res) {
    const user = req.user;
    return ProfileService.DeleteOneService(res, user);
  }

  static async updateProfile(req, res) {
    const { id } = req.params;
    const authUser = req.user;
    return ProfileService.UpdateProfileService(req, res, id, authUser);
  }
}

export default ProfileController;
