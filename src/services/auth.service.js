const UserModel = require('../models/user.model');
const { generateToken } = require('../middleware/auth');
const { AppError } = require('../utils/error');

class AuthService {
  static login({ email, password }) {
    if (!email || !password) {
      throw new AppError(400, 'Email and password are required');
    }

    const user = UserModel.findByEmail(email);
    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    if (!UserModel.verifyPassword(password, user.password)) {
      throw new AppError(401, 'Invalid email or password');
    }

    if (user.status === 'inactive') {
      throw new AppError(403, 'Account is inactive. Contact an administrator.');
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  static getProfile(userId) {
    const user = UserModel.findById(userId);
    if (!user) throw new AppError(404, 'User not found');
    return user;
  }
}

module.exports = AuthService;