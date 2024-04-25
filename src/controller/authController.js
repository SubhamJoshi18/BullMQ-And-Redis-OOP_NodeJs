import { AuthService } from "../service/auth.service.js";
class AuthController {
  static async register(req, res) {
    const body = req.body;
    return AuthService.registerService(res, body);
  }

  static async login(req, res) {
    const body = req.body;
    return AuthService.loginService(res, body);
  }
}

export default AuthController;
