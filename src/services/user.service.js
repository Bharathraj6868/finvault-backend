const UserModel = require('../models/user.model');
const { validateUser } = require('../utils/validators');
const { AppError } = require('../utils/error');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

class UserService {
  static create(data) {
    validateUser(data);

    const existing = UserModel.findByEmail(data.email);
    if (existing) throw new AppError(409, 'A user with this email already exists');

    const defaultPassword = 'ChangeMe123!';
    const user = UserModel.create({
      id: uuidv4(),
      name: data.name.trim(),
      email: data.email.trim(),
      password: defaultPassword,
      role: data.role
    });

    return { ...user, temporaryPassword: defaultPassword };
  }

  static getAll() {
    return UserModel.findAll();
  }

  static getById(id) {
    const user = UserModel.findById(id);
    if (!user) throw new AppError(404, 'User not found');
    return user;
  }

  static update(id, data) {
    const existing = UserModel.findById(id);
    if (!existing) throw new AppError(404, 'User not found');

    if (data.email && data.email !== existing.email) {
      const emailExists = UserModel.findByEmail(data.email);
      if (emailExists) throw new AppError(409, 'Email already in use');
    }

    if (data.role && !['admin', 'analyst', 'viewer'].includes(data.role)) {
      throw new AppError(400, 'Invalid role');
    }

    if (data.status && !['active', 'inactive'].includes(data.status)) {
      throw new AppError(400, 'Invalid status');
    }

    return UserModel.update(id, data);
  }

  static delete(id) {
    const existing = UserModel.findById(id);
    if (!existing) throw new AppError(404, 'User not found');
    UserModel.delete(id);
    return { message: 'User deleted successfully' };
  }
}

module.exports = UserService;